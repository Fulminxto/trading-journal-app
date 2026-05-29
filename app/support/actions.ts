"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

export async function createSupportTicket(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const type =
    getString(formData, "type") || "support";

  const subject =
    getString(formData, "subject");

  const message =
    getString(formData, "message");

  if (!subject || !message) {
    redirect("/support?toast=error");
  }

  await prisma.supportTicket.create({
    data: {
      userId: session.user.id,
      type,
      subject,
      message,
    },
  });

  redirect("/support?toast=success");
}