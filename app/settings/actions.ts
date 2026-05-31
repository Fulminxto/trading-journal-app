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

function getAllowedValue(
  value: string,
  allowedValues: string[],
  fallback: string
) {
  if (allowedValues.includes(value)) {
    return value;
  }

  return fallback;
}

export async function updateSettings(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const defaultCurrency =
    getAllowedValue(
      getString(formData, "defaultCurrency"),
      ["USD", "EUR", "JPY", "GBP"],
      "USD"
    );

  const appLanguage =
    getAllowedValue(
      getString(formData, "appLanguage"),
      ["it", "en", "uk", "es", "fr", "de"],
      "it"
    );

  const themePreference =
    getAllowedValue(
      getString(formData, "themePreference"),
      ["dark", "light", "system"],
      "dark"
    );

  const accentColor =
    getAllowedValue(
      getString(formData, "accentColor"),
      ["green", "blue", "purple", "amber", "red"],
      "green"
    );

  const appIconVariant =
    getAllowedValue(
      getString(formData, "appIconVariant"),
      ["classic", "dark", "premium", "minimal"],
      "classic"
    );

  const compactMode =
    getBoolean(
      formData,
      "compactMode"
    );

  const performanceBlur =
    getBoolean(
      formData,
      "performanceBlur"
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
      appLanguage,
      themePreference,
      accentColor,
      appIconVariant,

      compactMode,
      performanceBlur,

      reviewReminders,
      sessionLockAlerts,
      dailyTradingReminder,
    },
  });

  redirect("/settings?toast=success");
}