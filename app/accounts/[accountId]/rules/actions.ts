"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";

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

  const number = Number(
    value.replace(",", ".")
  );

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function getNumberInRange(
  formData: FormData,
  key: string,
  min: number,
  max: number
) {
  const number = getNumber(formData, key);

  if (number === null) {
    return null;
  }

  if (number < min || number > max) {
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
  const number = getNumberInRange(
    formData,
    key,
    min,
    max
  );

  if (number === null) {
    return null;
  }

  return Math.round(number);
}

async function getRulesAccess(
  accountId: string
) {
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
      `/accounts/${accountId}/rules`
    );
  }

  const canManageRules =
    membership.role === "MANAGER" ||
    membership.canManageAccount;

  if (!canManageRules) {
    redirect(
      `/accounts/${accountId}/rules`
    );
  }

  return membership;
}

export async function saveTradingGoals(
  accountId: string,
  formData: FormData
) {
  const membership =
    await getRulesAccess(accountId);

  const now = new Date();

  const month = now.getMonth();
  const year = now.getFullYear();

  const monthlyProfitGoal =
    getNumberInRange(
      formData,
      "monthlyProfitGoal",
      -100000000,
      100000000
    );

  const monthlyWinRateGoal =
    getNumberInRange(
      formData,
      "monthlyWinRateGoal",
      0,
      100
    );

  const maxDrawdownLimit =
    getNumberInRange(
      formData,
      "maxDrawdownLimit",
      0,
      100
    );

  const maxTradesPerDay =
    getIntegerInRange(
      formData,
      "maxTradesPerDay",
      0,
      1000
    );

  const existingGoal =
    await prisma.tradingGoal.findUnique({
      where: {
        tradingAccountId_month_year: {
          tradingAccountId: accountId,
          month,
          year,
        },
      },
    });

  const goal =
    await prisma.tradingGoal.upsert({
      where: {
        tradingAccountId_month_year: {
          tradingAccountId: accountId,
          month,
          year,
        },
      },

      update: {
        monthlyProfitGoal,
        monthlyWinRateGoal,
        maxDrawdownLimit,
        maxTradesPerDay,
      },

      create: {
        tradingAccountId: accountId,
        month,
        year,
        monthlyProfitGoal,
        monthlyWinRateGoal,
        maxDrawdownLimit,
        maxTradesPerDay,
      },
    });

  await logActivity({
    userId: membership.userId,
    accountId,
    type: "TRADING_GOALS_UPDATED",
    title: "Trading goals updated",
    description: `${membership.userId} updated trading rules and goals`,
    metadata: {
      goalId: goal.id,
      month,
      year,
      before: existingGoal
        ? {
          monthlyProfitGoal:
            existingGoal.monthlyProfitGoal,
          monthlyWinRateGoal:
            existingGoal.monthlyWinRateGoal,
          maxDrawdownLimit:
            existingGoal.maxDrawdownLimit,
          maxTradesPerDay:
            existingGoal.maxTradesPerDay,
        }
        : null,
      after: {
        monthlyProfitGoal:
          goal.monthlyProfitGoal,
        monthlyWinRateGoal:
          goal.monthlyWinRateGoal,
        maxDrawdownLimit:
          goal.maxDrawdownLimit,
        maxTradesPerDay:
          goal.maxTradesPerDay,
      },
    },
  });

  revalidatePath(
    `/accounts/${accountId}/rules`
  );
}