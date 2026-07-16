"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity";
import {
  getChangedActivityFields,
  hasMeaningfulChanges,
} from "@/lib/activity-policy";
import { normalizeAppLanguage } from "@/lib/i18n";

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

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  if (!currentUser) {
    redirect("/login");
  }

  const defaultCurrency =
    getAllowedValue(
      getString(formData, "defaultCurrency"),
      ["USD", "EUR", "JPY", "GBP"],
      "USD"
    );

  const appLanguage = normalizeAppLanguage(
    getString(formData, "appLanguage")
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
      ["blue", "violet", "teal", "amber", "coral", "platinum"],
      "blue"
    );

  const VALID_ICON_VARIANTS = [
    "classic", "circuit", "inverse", "low-poly", "mono", "glass", "violet",
  ];
  // legacy values (dark/premium/minimal) never shipped — collapse to classic
  const rawIconVariant = getString(formData, "appIconVariant");
  const appIconVariant = getAllowedValue(
    rawIconVariant,
    VALID_ICON_VARIANTS,
    "classic"
  );

  const currentSettings = {
    defaultCurrency:
      currentUser.defaultCurrency,

    appLanguage:
      currentUser.appLanguage,

    themePreference:
      currentUser.themePreference,

    accentColor:
      currentUser.accentColor,

    appIconVariant:
      currentUser.appIconVariant,
  };

  const desiredSettings = {
    defaultCurrency,
    appLanguage,
    themePreference,
    accentColor,
    appIconVariant,
  };

  const changes = getChangedActivityFields(
    currentSettings,
    desiredSettings
  );

  if (hasMeaningfulChanges(changes)) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },

      data: desiredSettings,
    });

    await logActivity({
      userId: session.user.id,
      type: "SETTINGS_UPDATED",
      title: "Settings updated",
      description: `${currentUser.username} updated settings`,
      metadata: changes,
    });
  }

  redirect(`/settings?toast=success&refresh=${Date.now()}`);
}

export async function updatePushEnabled(
  enabled: boolean
) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { pushNotificationsEnabled: enabled },
  });
}

const TOGGLE_WHITELIST = [
  "compactMode",
  "performanceBlur",
  "notificationsEnabled",
  "notifyTradeActivity",
  "notifyAccountActivity",
  "notifyPlatformUpdates",
  "notifySupport",
] as const;

export async function updateToggle(
  field: string,
  value: boolean
) {
  const session = await auth();

  if (!session?.user?.id) {
    return;
  }

  if (!(TOGGLE_WHITELIST as readonly string[]).includes(field)) {
    return;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { [field]: value },
  });

  revalidatePath("/settings");
}
