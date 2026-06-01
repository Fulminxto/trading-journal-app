"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  createNotification,
  logActivity,
} from "@/lib/activity";

const ALLOWED_TICKET_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "closed",
] as const;

const ALLOWED_TICKET_PRIORITIES = [
  "low",
  "normal",
  "high",
  "urgent",
] as const;

type TicketStatus =
  (typeof ALLOWED_TICKET_STATUSES)[number];

type TicketPriority =
  (typeof ALLOWED_TICKET_PRIORITIES)[number];

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

function getTicketStatus(
  value: string
): TicketStatus {
  if (
    ALLOWED_TICKET_STATUSES.includes(
      value as TicketStatus
    )
  ) {
    return value as TicketStatus;
  }

  return "open";
}

function getTicketPriority(
  value: string
): TicketPriority {
  if (
    ALLOWED_TICKET_PRIORITIES.includes(
      value as TicketPriority
    )
  ) {
    return value as TicketPriority;
  }

  return "normal";
}

export async function updateSupportTicketStatus(
  ticketId: string,
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

  if (
    !currentUser ||
    (
      currentUser.role !== "FOUNDER" &&
      currentUser.role !== "ADMIN"
    )
  ) {
    redirect("/accounts");
  }

  if (!ticketId) {
    redirect("/admin/support");
  }

  const ticket =
    await prisma.supportTicket.findUnique({
      where: {
        id: ticketId,
      },
      include: {
        user: true,
      },
    });

  if (!ticket) {
    redirect("/admin/support");
  }

  const status = getTicketStatus(
    getString(formData, "status")
  );

  const priority = getTicketPriority(
    getString(formData, "priority")
  );

  const adminNote = getLimitedString(
    formData,
    "adminNote",
    3000
  );

  const resolvedStatuses = [
    "resolved",
    "closed",
  ];

  const updatedTicket =
    await prisma.supportTicket.update({
      where: {
        id: ticket.id,
      },

      data: {
        status,
        priority,
        adminNote: adminNote || null,

        resolvedAt:
          resolvedStatuses.includes(status)
            ? new Date()
            : null,
      },
    });

  await logActivity({
    userId: currentUser.id,
    type: "SUPPORT_TICKET_UPDATED",
    title: "Support ticket updated",
    description: `${currentUser.username} updated support ticket`,
    metadata: {
      ticketId: updatedTicket.id,
      ticketOwnerId: ticket.userId,
      ticketOwnerUsername:
        ticket.user.username,
      subject: ticket.subject,
      before: {
        status: ticket.status,
        priority: ticket.priority,
        adminNote: ticket.adminNote,
        resolvedAt: ticket.resolvedAt,
      },
      after: {
        status: updatedTicket.status,
        priority: updatedTicket.priority,
        adminNote:
          updatedTicket.adminNote,
        resolvedAt:
          updatedTicket.resolvedAt,
      },
    },
  });

  await createNotification({
    userId: ticket.userId,
    type: "SUPPORT_TICKET_UPDATED",
    title: "Support ticket updated",
    message: `Your support ticket "${ticket.subject}" was updated.`,
    link: `/support`,
  });

  redirect(
    `/admin/support/${ticket.id}?toast=updated`
  );
}