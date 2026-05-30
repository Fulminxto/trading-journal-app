"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function submitAccountReview(formData: FormData) {
  const username = getString(formData, "username");
  const message = getString(formData, "message");

  if (!username || !message) {
    redirect("/account-review?toast=error");
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    redirect("/account-review?toast=error");
  }

  await prisma.supportTicket.create({
    data: {
      userId: user.id,
      type: "account_review",
      subject: "Richiesta revisione account sospeso",
      message,
      priority: "high",
    },
  });

  redirect("/account-review?toast=created");
}
