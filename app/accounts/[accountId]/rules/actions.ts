"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity";
import {
  getChangedActivityFields,
  hasMeaningfulChanges,
} from "@/lib/activity-policy";
import {
  canManageRules,
  getAccountMembershipWithAccount,
} from "@/lib/permissions";
import { assertAccountWritable } from "@/lib/account-write-guard";

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

  const membership = await getAccountMembershipWithAccount(
    session.user.id,
    accountId
  );

  if (!membership) {
    redirect("/accounts");
  }

  if (!canManageRules(membership)) {
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

  const desiredGoal = {
    monthlyProfitGoal,
    monthlyWinRateGoal,
    maxDrawdownLimit,
    maxTradesPerDay,
  };

  if (!existingGoal) {
    const goal = await prisma.tradingGoal.create({
      data: {
        tradingAccountId: accountId,
        month,
        year,
        ...desiredGoal,
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
        changedFields: Object.keys(desiredGoal),
        before: null,
        after: desiredGoal,
      },
    });
  } else {
    const currentGoal = {
      monthlyProfitGoal:
        existingGoal.monthlyProfitGoal,
      monthlyWinRateGoal:
        existingGoal.monthlyWinRateGoal,
      maxDrawdownLimit:
        existingGoal.maxDrawdownLimit,
      maxTradesPerDay:
        existingGoal.maxTradesPerDay,
    };

    const changes = getChangedActivityFields(
      currentGoal,
      desiredGoal
    );

    if (hasMeaningfulChanges(changes)) {
      await prisma.tradingGoal.update({
        where: {
          id: existingGoal.id,
        },
        data: desiredGoal,
      });

      await logActivity({
        userId: membership.userId,
        accountId,
        type: "TRADING_GOALS_UPDATED",
        title: "Trading goals updated",
        description: `${membership.userId} updated trading rules and goals`,
        metadata: {
          goalId: existingGoal.id,
          month,
          year,
          ...changes,
        },
      });
    }
  }

  assertAccountWritable(membership.tradingAccount.status);

  revalidatePath(
    `/accounts/${accountId}/rules`
  );
}
