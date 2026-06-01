"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  logActivity,
  notifyFoundersAndAdmins,
} from "@/lib/activity";

const REVIEW_COOLDOWN_MINUTES = 10;

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

function normalizeUsername(value: string) {
  return value.trim().toLowerCase();
}

export async function submitAccountReview(
  formData: FormData
) {
  const session = await auth();

  const username = normalizeUsername(
    getString(formData, "username")
  );

  const message = getLimitedString(
    formData,
    "message",
    3000
  );

  if (!message) {
    redirect("/account-review?toast=error");
  }

  const user = session?.user?.id
    ? await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
    : username
      ? await prisma.user.findUnique({
        where: {
          username,
        },
      })
      : null;

  if (!user) {
    redirect("/account-review?toast=created");
  }

  if (user.status !== "FROZEN") {
    redirect("/account-review?toast=created");
  }

  const recentTicket =
    await prisma.supportTicket.findFirst({
      where: {
        userId: user.id,
        type: "account_review",
        createdAt: {
          gte: new Date(
            Date.now() -
            REVIEW_COOLDOWN_MINUTES *
            60 *
            1000
          ),
        },
      },
    });

  if (recentTicket) {
    redirect("/account-review?toast=created");
  }

  const ticket =
    await prisma.supportTicket.create({
      data: {
        userId: user.id,
        type: "account_review",
        subject:
          "Richiesta revisione account sospeso",
        message,
        status: "open",
        priority: "high",
      },
    });

  await logActivity({
    userId: user.id,
    type: "ACCOUNT_REVIEW_REQUESTED",
    title: "Account review requested",
    description: `${user.username} requested account review`,
    metadata: {
      ticketId: ticket.id,
      status: ticket.status,
      priority: ticket.priority,
    },
  });

  await notifyFoundersAndAdmins({
    actorId: user.id,
    type: "ACCOUNT_REVIEW_REQUESTED",
    title: "Account review requested",
    message: `${user.username} requested a frozen account review`,
    link: `/admin/support/${ticket.id}`,
  });

  redirect("/account-review?toast=created");
}