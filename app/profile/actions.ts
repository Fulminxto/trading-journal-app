"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity";
import { supabaseAdmin } from "@/lib/supabase";

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

async function uploadProfileImage(
  userId: string,
  formData: FormData
) {
  const file = formData.get("profileImage");

  if (!(file instanceof File)) {
    return null;
  }

  if (file.size === 0) {
    return null;
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    redirect("/profile?toast=invalid-image");
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    redirect("/profile?toast=image-too-large");
  }

  const fileExtension =
    file.name.split(".").pop() || "jpg";

  const filePath = `${userId}/avatar-${Date.now()}.${fileExtension}`;

  const arrayBuffer = await file.arrayBuffer();

  const { error } =
    await supabaseAdmin.storage
      .from("profile-images")
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: true,
      });

  if (error) {
    console.error(error);
    redirect("/profile?toast=image-upload-error");
  }

  const { data } =
    supabaseAdmin.storage
      .from("profile-images")
      .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function updateProfile(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
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
    await uploadProfileImage(
      session.user.id,
      formData
    );

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
      imageUpdated: Boolean(uploadedImageUrl),
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