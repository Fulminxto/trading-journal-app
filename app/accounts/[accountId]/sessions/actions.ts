"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue || null;
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (!value) {
    return null;
  }

  const number = Number(value.replace(",", "."));

  return Number.isNaN(number) ? null : number;
}

function getDate(formData: FormData, key: string) {
  const value = getString(formData, key);

  return value ? new Date(value) : null;
}

async function getAccess(accountId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const membership = await prisma.accountMember.findFirst({
    where: {
      userId: session.user.id,
      tradingAccountId: accountId,
    },
  });

  if (!membership) {
    redirect("/accounts");
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
    redirect(`/accounts/${accountId}/sessions`);
  }

  await prisma.tradingSession.create({
    data: {
      tradingAccountId: accountId,
      createdById: membership.userId,
      date,
      title: getString(formData, "title"),
      marketBias: getString(formData, "marketBias"),
      focus: getString(formData, "focus"),
      emotionalState: getString(formData, "emotionalState"),
      sessionType: getString(formData, "sessionType"),
      checklist: getString(formData, "checklist"),
      goals: getString(formData, "goals"),
      mistakesToAvoid: getString(formData, "mistakesToAvoid"),
      sessionReview: getString(formData, "sessionReview"),
      finalScore: getNumber(formData, "finalScore"),
    },
  });

  redirect(`/accounts/${accountId}/sessions`);
}