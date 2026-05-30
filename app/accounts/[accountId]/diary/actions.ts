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

  if (!trimmedValue) {
    return null;
  }

  return trimmedValue;
}

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (value === null) {
    return null;
  }

  const number = Number(value.replace(",", "."));

  if (Number.isNaN(number)) {
    return null;
  }

  return number;
}

function getDate(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (value === null) {
    return null;
  }

  return new Date(value);
}

async function getAccess(
  accountId: string,
  options?: {
    allowViewer?: boolean;
    requireCreateTrades?: boolean;
    requireEditTrades?: boolean;
    requireDeleteTrades?: boolean;
  }
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

  const isOwner =
    String(membership.role) === "OWNER";

  if (
    String(membership.role) === "VIEWER" &&
    !options?.allowViewer
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    options?.requireCreateTrades &&
    !isOwner &&
    !membership.canCreateTrades
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    options?.requireEditTrades &&
    !isOwner &&
    !membership.canEditTrades
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    options?.requireDeleteTrades &&
    !isOwner &&
    !membership.canDeleteTrades
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  return membership;
}

async function recalculateEquity(accountId: string) {
  const account = await prisma.tradingAccount.findUnique({
    where: {
      id: accountId,
    },
  });

  if (!account) {
    return;
  }

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    orderBy: [
      {
        openDate: "asc",
      },

      {
        id: "asc",
      },
    ],
  });

  let equity = account.initialBalance;
  let equityPeak = equity;

  for (const trade of trades) {
    const resultUsd = trade.resultUsd || 0;

    equity += resultUsd;

    if (equity > equityPeak) {
      equityPeak = equity;
    }

    const drawdownPercent =
      equityPeak > 0
        ? ((equity - equityPeak) / equityPeak) * 100
        : 0;

    const resultPercent =
      account.initialBalance > 0
        ? (resultUsd / account.initialBalance) * 100
        : 0;

    await prisma.trade.update({
      where: {
        id: trade.id,
      },

      data: {
        equity,
        equityPeak,
        drawdownPercent,
        resultPercent,
      },
    });
  }
}

export async function createAccountTrade(
  accountId: string,
  formData: FormData
) {
  const membership = await getAccess(accountId, {
    requireCreateTrades: true,
  });

  const openDate = getDate(formData, "openDate");

  if (!openDate) {
    redirect(`/accounts/${accountId}/diary`);
  }

  await prisma.trade.create({
    data: {
      tradingAccountId: accountId,
      createdById: membership.userId,

      openDate,
      openTime: getString(formData, "openTime"),
      reason: getString(formData, "reason"),
      strategy: getString(formData, "strategy"),

      symbol: getString(formData, "symbol") || "UNKNOWN",
      direction: getString(formData, "direction") || "LONG",

      amount: getNumber(formData, "amount"),
      openingPrice: getNumber(formData, "openingPrice"),
      stopLoss: getNumber(formData, "stopLoss"),
      takeProfit: getNumber(formData, "takeProfit"),
      riskReward: getNumber(formData, "riskReward"),

      closeDate: getDate(formData, "closeDate"),
      closingPrice: getNumber(formData, "closingPrice"),

      outcome: getString(formData, "outcome"),
      resultUsd: getNumber(formData, "resultUsd"),

      notes: getString(formData, "notes"),

      session: getString(formData, "session"),
      emotionalState: getString(formData, "emotionalState"),
      setupQuality: getNumber(formData, "setupQuality"),
      executionRating: getNumber(formData, "executionRating"),
      confidence: getNumber(formData, "confidence"),
      mistakes: getString(formData, "mistakes"),
      lessonsLearned: getString(formData, "lessonsLearned"),
    },
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}

export async function updateAccountTrade(
  accountId: string,
  tradeId: number,
  formData: FormData
) {
  await getAccess(accountId, {
    requireEditTrades: true,
  });

  const openDate = getDate(formData, "openDate");

  if (!openDate) {
    redirect(`/accounts/${accountId}/diary`);
  }

  await prisma.trade.update({
    where: {
      id: tradeId,
    },

    data: {
      openDate,
      openTime: getString(formData, "openTime"),
      reason: getString(formData, "reason"),
      strategy: getString(formData, "strategy"),

      symbol: getString(formData, "symbol") || "UNKNOWN",
      direction: getString(formData, "direction") || "LONG",

      amount: getNumber(formData, "amount"),
      openingPrice: getNumber(formData, "openingPrice"),
      stopLoss: getNumber(formData, "stopLoss"),
      takeProfit: getNumber(formData, "takeProfit"),
      riskReward: getNumber(formData, "riskReward"),

      closeDate: getDate(formData, "closeDate"),
      closingPrice: getNumber(formData, "closingPrice"),

      outcome: getString(formData, "outcome"),
      resultUsd: getNumber(formData, "resultUsd"),

      notes: getString(formData, "notes"),

      session: getString(formData, "session"),
      emotionalState: getString(formData, "emotionalState"),
      setupQuality: getNumber(formData, "setupQuality"),
      executionRating: getNumber(formData, "executionRating"),
      confidence: getNumber(formData, "confidence"),
      mistakes: getString(formData, "mistakes"),
      lessonsLearned: getString(formData, "lessonsLearned"),
    },
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}

export async function deleteAccountTrade(
  accountId: string,
  tradeId: number
) {
  await getAccess(accountId, {
    requireDeleteTrades: true,
  });

  await prisma.trade.delete({
    where: {
      id: tradeId,
    },
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}