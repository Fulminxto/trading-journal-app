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

function getBoolean(
  formData: FormData,
  key: string
) {
  return formData.get(key) === "on";
}

export async function updateSettings(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const defaultCurrency =
    getString(
      formData,
      "defaultCurrency"
    ) || "USD";

  const compactMode = getBoolean(
    formData,
    "compactMode"
  );

  const performanceBlur = getBoolean(
    formData,
    "performanceBlur"
  );

  const emailNotifications =
    getBoolean(
      formData,
      "emailNotifications"
    );

  const reviewReminders =
    getBoolean(
      formData,
      "reviewReminders"
    );

  const sessionLockAlerts =
    getBoolean(
      formData,
      "sessionLockAlerts"
    );

  const dailyTradingReminder =
    getBoolean(
      formData,
      "dailyTradingReminder"
    );

  await prisma.user.update({
    where: {
      id: session.user.id,
    },

    data: {
      defaultCurrency,
      compactMode,
      performanceBlur,
      emailNotifications,

      reviewReminders,
      sessionLockAlerts,
      dailyTradingReminder,
    },
  });

  redirect("/settings?toast=success");
}
