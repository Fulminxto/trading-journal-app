"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  logActivity,
  notifyFoundersAndAdmins,
} from "@/lib/activity";

const ALLOWED_MAINTENANCE_TYPES = [
  "warning",
  "info",
  "success",
  "danger",
  "error",
] as const;

type MaintenanceType =
  (typeof ALLOWED_MAINTENANCE_TYPES)[number];

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

function getBoolean(
  formData: FormData,
  key: string
) {
  return formData.get(key) === "on";
}

function getMaintenanceType(
  value: string
): MaintenanceType {
  if (
    ALLOWED_MAINTENANCE_TYPES.includes(
      value as MaintenanceType
    )
  ) {
    return value as MaintenanceType;
  }

  return "warning";
}

function getDate(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

export async function updateMaintenanceMode(
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

  const enabled = getBoolean(
    formData,
    "enabled"
  );

  const blockLogin = getBoolean(
    formData,
    "blockLogin"
  );

  const title =
    getLimitedString(
      formData,
      "title",
      120
    ) || "Scheduled Maintenance";

  const message =
    getLimitedString(
      formData,
      "message",
      2000
    ) ||
    "VOLTIS is currently under maintenance.";

  const type = getMaintenanceType(
    getString(formData, "type") ||
    "warning"
  );

  const startAt = getDate(
    formData,
    "startAt"
  );

  const expectedEndAt = getDate(
    formData,
    "expectedEndAt"
  );

  const existing =
    await prisma.maintenanceMode.findFirst();

  const before = existing
    ? {
      enabled: existing.enabled,
      blockLogin: existing.blockLogin,
      title: existing.title,
      message: existing.message,
      type: existing.type,
      startAt: existing.startAt,
      expectedEndAt:
        existing.expectedEndAt,
    }
    : null;

  const maintenance = existing
    ? await prisma.maintenanceMode.update({
      where: {
        id: existing.id,
      },

      data: {
        enabled,
        blockLogin,
        title,
        message,
        type,
        startAt,
        expectedEndAt,
      },
    })
    : await prisma.maintenanceMode.create({
      data: {
        enabled,
        blockLogin,
        title,
        message,
        type,
        startAt,
        expectedEndAt,
      },
    });

  await logActivity({
    userId: currentUser.id,
    type: "MAINTENANCE_UPDATED",
    title: "Maintenance mode updated",
    description: `${currentUser.username} updated maintenance mode`,
    metadata: {
      maintenanceId: maintenance.id,
      before,
      after: {
        enabled: maintenance.enabled,
        blockLogin: maintenance.blockLogin,
        title: maintenance.title,
        message: maintenance.message,
        type: maintenance.type,
        startAt: maintenance.startAt,
        expectedEndAt:
          maintenance.expectedEndAt,
      },
    },
  });

  await notifyFoundersAndAdmins({
    actorId: currentUser.id,
    type: "MAINTENANCE_UPDATED",
    title: "Maintenance mode updated",
    message: `${currentUser.username} updated platform maintenance settings`,
    link: "/admin/maintenance",
  });

  redirect(
    "/admin/maintenance?toast=updated"
  );
}