"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  logActivity,
  notifyFoundersAndAdmins,
} from "@/lib/activity";

const ALLOWED_TICKET_TYPES = [
  "support",
  "bug",
  "feature",
  "account",
  "billing",
] as const;

type TicketType =
  (typeof ALLOWED_TICKET_TYPES)[number];

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

function getTicketType(
  value: string
): TicketType {
  if (
    ALLOWED_TICKET_TYPES.includes(
      value as TicketType
    )
  ) {
    return value as TicketType;
  }

  return "support";
}

export async function createSupportTicket(
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

  const type = getTicketType(
    getString(formData, "type")
  );

  const subject = getLimitedString(
    formData,
    "subject",
    120
  );

  const message = getLimitedString(
    formData,
    "message",
    3000
  );

  if (!subject || !message) {
    redirect("/support?toast=error");
  }

  const ticket =
    await prisma.supportTicket.create({
      data: {
        userId: currentUser.id,
        type,
        subject,
        message,
        status: "open",
        priority: "normal",
      },
    });

  await logActivity({
    userId: currentUser.id,
    type: "SUPPORT_TICKET_CREATED",
    title: "Support ticket created",
    description: `${currentUser.username} created a support ticket`,
    metadata: {
      ticketId: ticket.id,
      type: ticket.type,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
    },
  });

  await notifyFoundersAndAdmins({
    actorId: currentUser.id,
    type: "SUPPORT_TICKET_CREATED",
    title: "New support ticket",
    message: `${currentUser.username} opened: ${ticket.subject}`,
    link: `/admin/support/${ticket.id}`,
  });

  redirect("/support?toast=success");
}