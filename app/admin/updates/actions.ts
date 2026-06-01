"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity";

const ALLOWED_RELEASE_TYPES = [
  "update",
  "feature",
  "fix",
  "security",
  "announcement",
  "improvement",
] as const;

const ALLOWED_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
  "critical",
] as const;

type ReleaseType =
  (typeof ALLOWED_RELEASE_TYPES)[number];

type ReleasePriority =
  (typeof ALLOWED_PRIORITIES)[number];

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

function getLimitedString(
  formData: FormData,
  key: string,
  maxLength: number
) {
  return getString(formData, key).slice(
    0,
    maxLength
  );
}

function getReleaseType(
  value: string
): ReleaseType {
  if (
    ALLOWED_RELEASE_TYPES.includes(
      value as ReleaseType
    )
  ) {
    return value as ReleaseType;
  }

  return "update";
}

function getPriority(
  value: string
): ReleasePriority {
  if (
    ALLOWED_PRIORITIES.includes(
      value as ReleasePriority
    )
  ) {
    return value as ReleasePriority;
  }

  return "normal";
}

async function requireAdminAccess() {
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

  if (
    !currentUser ||
    (
      currentUser.role !== "FOUNDER" &&
      currentUser.role !== "ADMIN"
    )
  ) {
    redirect("/accounts");
  }

  return currentUser;
}

export async function createReleaseNote(
  formData: FormData
) {
  const currentUser =
    await requireAdminAccess();

  const title = getLimitedString(
    formData,
    "title",
    120
  );

  const content = getLimitedString(
    formData,
    "content",
    5000
  );

  const type = getReleaseType(
    getString(formData, "type")
  );

  const priority = getPriority(
    getString(formData, "priority")
  );

  const published =
    formData.get("published") === "on";

  if (!title || !content) {
    redirect("/admin/updates?toast=error");
  }

  const releaseNote =
    await prisma.releaseNote.create({
      data: {
        title,
        content,
        type,
        priority,
        published,
      },
    });

  await logActivity({
    userId: currentUser.id,
    type: "RELEASE_NOTE_CREATED",
    title: "Release note created",
    description: `${currentUser.username} created release note: ${releaseNote.title}`,
    metadata: {
      releaseNoteId: releaseNote.id,
      releaseTitle: releaseNote.title,
      releaseType: releaseNote.type,
      priority: releaseNote.priority,
      published: releaseNote.published,
    },
  });

  if (published) {
    const users =
      await prisma.user.findMany({
        where: {
          status: "ACTIVE",
        },
        select: {
          id: true,
        },
      });

    if (users.length > 0) {
      await prisma.notification.createMany({
        data: users.map((user) => ({
          userId: user.id,
          type: "RELEASE_NOTE_PUBLISHED",
          title: "New VOLTIS update",
          message: releaseNote.title,
          link: "/updates",
        })),
      });
    }
  }

  redirect("/admin/updates?toast=created");
}