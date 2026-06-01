"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { logActivity } from "@/lib/activity";

function getString(
  formData: FormData,
  key: string
) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

function getLimitedString(
  formData: FormData,
  key: string,
  maxLength: number
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  return value.slice(0, maxLength);
}

function getNumber(
  formData: FormData,
  key: string
) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(
    value.replace(",", ".")
  );

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function getIntegerInRange(
  formData: FormData,
  key: string,
  min: number,
  max: number
) {
  const number = getNumber(formData, key);

  if (number === null) {
    return null;
  }

  const integer = Math.round(number);

  if (integer < min || integer > max) {
    return null;
  }

  return integer;
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

async function getAccess(accountId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership =
    await prisma.accountMember.findFirst({
      where: {
        userId: session.user.id,
        tradingAccountId: accountId,
      },
      include: {
        tradingAccount: true,
      },
    });

  if (!membership) {
    redirect("/accounts");
  }

  if (
    membership.tradingAccount.status ===
    "ARCHIVED"
  ) {
    redirect(
      `/accounts/${accountId}/sessions`
    );
  }

  if (membership.role === "VIEWER") {
    redirect(
      `/accounts/${accountId}/sessions`
    );
  }

  return membership;
}

export async function createTradingSession(
  accountId: string,
  formData: FormData
) {
  const membership = await getAccess(accountId);

  const date = getDate(formData, "date");

  if (!date) {
    redirect(
      `/accounts/${accountId}/sessions`
    );
  }

  const tradingSession =
    await prisma.tradingSession.create({
      data: {
        tradingAccountId: accountId,
        createdById: membership.userId,
        date,

        title: getLimitedString(
          formData,
          "title",
          120
        ),

        marketBias: getLimitedString(
          formData,
          "marketBias",
          120
        ),

        focus: getLimitedString(
          formData,
          "focus",
          500
        ),

        emotionalState: getLimitedString(
          formData,
          "emotionalState",
          120
        ),

        sessionType: getLimitedString(
          formData,
          "sessionType",
          80
        ),

        checklist: getLimitedString(
          formData,
          "checklist",
          2000
        ),

        goals: getLimitedString(
          formData,
          "goals",
          2000
        ),

        mistakesToAvoid: getLimitedString(
          formData,
          "mistakesToAvoid",
          2000
        ),

        sessionReview: getLimitedString(
          formData,
          "sessionReview",
          3000
        ),

        finalScore: getIntegerInRange(
          formData,
          "finalScore",
          1,
          10
        ),
      },
    });

  await logActivity({
    userId: membership.userId,
    accountId,
    type: "TRADING_SESSION_CREATED",
    title: "Trading session created",
    description: `${membership.userId} created a trading session`,
    metadata: {
      sessionId: tradingSession.id,
      date: tradingSession.date,
      title: tradingSession.title,
      sessionType: tradingSession.sessionType,
      finalScore: tradingSession.finalScore,
    },
  });

  redirect(
    `/accounts/${accountId}/sessions`
  );
}