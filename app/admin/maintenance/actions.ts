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

export async function updateMaintenanceMode(
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

  const enabled =
    formData.get("enabled") === "on";

  const blockLogin =
    formData.get("blockLogin") === "on";

  const title =
    getString(formData, "title") ||
    "Scheduled Maintenance";

  const message =
    getString(formData, "message") ||
    "VOLTIS is currently under maintenance.";

  const type =
    getString(formData, "type") ||
    "warning";

  const existing =
    await prisma.maintenanceMode.findFirst();

  if (existing) {
    await prisma.maintenanceMode.update({
      where: {
        id: existing.id,
      },

      data: {
        enabled,
        blockLogin,
        title,
        message,
        type,
      },
    });
  } else {
    await prisma.maintenanceMode.create({
      data: {
        enabled,
        blockLogin,
        title,
        message,
        type,
      },
    });
  }

  redirect(
    "/admin/maintenance?toast=updated"
  );
}