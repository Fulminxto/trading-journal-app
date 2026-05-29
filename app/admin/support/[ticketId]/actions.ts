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

export async function updateSupportTicketStatus(
  ticketId: string,
  formData: FormData
) {
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
    (user.role !== "OWNER" &&
      user.role !== "ADMIN")
  ) {
    redirect("/");
  }

  const status = getString(
    formData,
    "status"
  );

  const priority = getString(
    formData,
    "priority"
  );

  const adminNote = getString(
    formData,
    "adminNote"
  );

  const resolvedStatuses = [
    "resolved",
    "closed",
  ];

  await prisma.supportTicket.update({
    where: {
      id: ticketId,
    },

    data: {
      status,
      priority,
      adminNote,

      resolvedAt:
        resolvedStatuses.includes(status)
          ? new Date()
          : null,
    },
  });

  redirect(
    `/admin/support/${ticketId}?toast=updated`
  );
}