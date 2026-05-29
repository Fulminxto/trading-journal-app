"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function createReleaseNote(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  if (
    !user ||
    (user.role !== "OWNER" && user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const title = getString(formData, "title");
  const content = getString(formData, "content");
  const type = getString(formData, "type") || "update";
  const priority = getString(formData, "priority") || "normal";
  const published = formData.get("published") === "on";

  if (!title || !content) {
    redirect("/admin/updates?toast=error");
  }

  await prisma.releaseNote.create({
    data: {
      title,
      content,
      type,
      priority,
      published,
    },
  });

  redirect("/admin/updates?toast=created");
}