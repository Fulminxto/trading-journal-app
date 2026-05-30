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

function getNumber(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const parsed = Number(value);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
}

export async function updateProfile(
  formData: FormData
) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const name = getString(
    formData,
    "name"
  );

  const username = getString(
    formData,
    "username"
  );

  const bio = getString(
    formData,
    "bio"
  );

  const tradingStyle = getString(
    formData,
    "tradingStyle"
  );

  const favoriteMarket = getString(
    formData,
    "favoriteMarket"
  );

  const timezone = getString(
    formData,
    "timezone"
  );

  const preferredSession = getString(
    formData,
    "preferredSession"
  );

  const riskPerTrade = getNumber(
    formData,
    "riskPerTrade"
  );

  const preferredBroker = getString(
    formData,
    "preferredBroker"
  );

  const setupStyle = getString(
    formData,
    "setupStyle"
  );

  const existingUser =
    await prisma.user.findUnique({
      where: {
        username,
      },
    });

  if (
    existingUser &&
    existingUser.id !== session.user.id
  ) {
    redirect(
      "/profile?toast=username-taken"
    );
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },

    data: {
      name: name || null,
      username,
      bio: bio || null,
      tradingStyle: tradingStyle || null,
      favoriteMarket: favoriteMarket || null,
      timezone: timezone || null,
      preferredSession: preferredSession || null,
      riskPerTrade,
      preferredBroker: preferredBroker || null,
      setupStyle: setupStyle || null,
    },
  });

  redirect("/profile?toast=success");
}
