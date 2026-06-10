"use server";

import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity";
import { supabaseAdmin } from "@/lib/supabase";

const PROFILE_IMAGE_BUCKET = "profile-images";
const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function getString(
  formData: FormData,
  key: string
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getNumber(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number(value.replace(",", "."));

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

function getExtensionFromMimeType(
  mimeType: string
) {
  if (mimeType === "image/jpeg") {
    return "jpg";
  }

  if (mimeType === "image/png") {
    return "png";
  }

  if (mimeType === "image/webp") {
    return "webp";
  }

  return null;
}

function hasValidImageSignature(
  bytes: Uint8Array,
  mimeType: string
) {
  if (mimeType === "image/jpeg") {
    return (
      bytes[0] === 0xff &&
      bytes[1] === 0xd8 &&
      bytes[2] === 0xff
    );
  }

  if (mimeType === "image/png") {
    return (
      bytes[0] === 0x89 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x4e &&
      bytes[3] === 0x47
    );
  }

  if (mimeType === "image/webp") {
    const riff =
      String.fromCharCode(
        bytes[0],
        bytes[1],
        bytes[2],
        bytes[3]
      ) === "RIFF";

    const webp =
      String.fromCharCode(
        bytes[8],
        bytes[9],
        bytes[10],
        bytes[11]
      ) === "WEBP";

    return riff && webp;
  }

  return false;
}

function getStoragePathFromPublicUrl(
  publicUrl?: string | null
) {
  if (!publicUrl) {
    return null;
  }

  try {
    const url = new URL(publicUrl);
    const marker = `/${PROFILE_IMAGE_BUCKET}/`;
    const markerIndex =
      url.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(
      url.pathname.slice(
        markerIndex + marker.length
      )
    );
  } catch {
    return null;
  }
}

async function removePreviousProfileImage(
  publicUrl?: string | null
) {
  const storagePath =
    getStoragePathFromPublicUrl(publicUrl);

  if (!storagePath) {
    return;
  }

  await supabaseAdmin.storage
    .from(PROFILE_IMAGE_BUCKET)
    .remove([storagePath]);
}

async function uploadProfileImage({
  userId,
  currentImage,
  formData,
}: {
  userId: string;
  currentImage?: string | null;
  formData: FormData;
}) {
  const file = formData.get("profileImage");

  if (!(file instanceof File)) {
    return null;
  }

  if (file.size === 0) {
    return null;
  }

  if (file.size > MAX_PROFILE_IMAGE_SIZE) {
    redirect("/profile?toast=image-too-large");
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    redirect("/profile?toast=invalid-image");
  }

  const extension =
    getExtensionFromMimeType(file.type);

  if (!extension) {
    redirect("/profile?toast=invalid-image");
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (
    !hasValidImageSignature(bytes, file.type)
  ) {
    redirect("/profile?toast=invalid-image");
  }

  const filePath = `${userId}/avatar-${randomUUID()}.${extension}`;

  const { error } =
    await supabaseAdmin.storage
      .from(PROFILE_IMAGE_BUCKET)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
      });

  if (error) {
    console.error(error);
    redirect("/profile?toast=image-upload-error");
  }

  const { data } =
    supabaseAdmin.storage
      .from(PROFILE_IMAGE_BUCKET)
      .getPublicUrl(filePath);

  await removePreviousProfileImage(
    currentImage
  );

  return data.publicUrl;
}

export async function updateProfile(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  if (!currentUser) {
    redirect("/login");
  }

  const name = getString(
    formData,
    "name"
  );

  const username =
    getString(
      formData,
      "username"
    ) || currentUser.username;

  const bio = getString(
    formData,
    "bio"
  );

  const workspaceName = getString(
    formData,
    "workspaceName"
  );

  const tradingStyle = getString(
    formData,
    "tradingStyle"
  );

  const favoriteMarket = getString(
    formData,
    "favoriteMarket"
  );

  const timezone = getString(
    formData,
    "timezone"
  );

  const preferredSession = getString(
    formData,
    "preferredSession"
  );

  const riskPerTrade = getNumber(
    formData,
    "riskPerTrade"
  );

  const preferredBroker = getString(
    formData,
    "preferredBroker"
  );

  const setupStyle = getString(
    formData,
    "setupStyle"
  );

  const existingUser =
    await prisma.user.findUnique({
      where: {
        username,
      },
    });

  if (
    existingUser &&
    existingUser.id !== session.user.id
  ) {
    redirect(
      "/profile?toast=username-taken"
    );
  }

  const uploadedImageUrl =
    await uploadProfileImage({
      userId: session.user.id,
      currentImage: currentUser.image,
      formData,
    });

  await prisma.user.update({
    where: {
      id: session.user.id,
    },

    data: {
      name: name || null,
      username,
      bio: bio || null,

      workspaceName:
        workspaceName || null,

      image:
        uploadedImageUrl ||
        currentUser.image,

      tradingStyle:
        tradingStyle || null,

      favoriteMarket:
        favoriteMarket || null,

      timezone:
        timezone || null,

      preferredSession:
        preferredSession || null,

      riskPerTrade,

      preferredBroker:
        preferredBroker || null,

      setupStyle:
        setupStyle || null,
    },
  });

  await logActivity({
    userId: session.user.id,
    type: "PROFILE_UPDATED",
    title: "Profile updated",
    description: `${username} updated profile information`,
    metadata: {
      imageUpdated: Boolean(
        uploadedImageUrl
      ),
      fields: [
        "name",
        "username",
        "bio",
        "workspaceName",
        "image",
        "tradingStyle",
        "favoriteMarket",
        "timezone",
        "preferredSession",
        "riskPerTrade",
        "preferredBroker",
        "setupStyle",
      ],
    },
  });

  redirect("/profile?toast=success");
}

export async function changePassword(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: { id: session.user.id },
    });

  if (!currentUser) {
    redirect("/login");
  }

  const currentPassword = getString(
    formData,
    "currentPassword"
  );

  const newPassword = getString(
    formData,
    "newPassword"
  );

  const confirmPassword = getString(
    formData,
    "confirmPassword"
  );

  if (!currentPassword || !newPassword || !confirmPassword) {
    redirect("/profile?toast=error");
  }

  const isCurrentValid = await bcrypt.compare(
    currentPassword,
    currentUser.passwordHash
  );

  if (!isCurrentValid) {
    redirect("/profile?toast=wrong-current-password");
  }

  if (newPassword.length < 8) {
    redirect("/profile?toast=password-too-short");
  }

  if (newPassword !== confirmPassword) {
    redirect("/profile?toast=password-mismatch");
  }

  const passwordHash = await bcrypt.hash(
    newPassword,
    12
  );

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      passwordHash,
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });

  await logActivity({
    userId: session.user.id,
    type: "PASSWORD_CHANGED",
    title: "Password changed",
    description: `${currentUser.username} changed their password`,
  });

  redirect("/profile?toast=password-changed");
}