"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  logActivity,
  notifyAccountMembers,
} from "@/lib/activity";
import { redirect } from "next/navigation";
import { assertAccountWritable } from "@/lib/account-write-guard";

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

function getNumber(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (value === null) {
    return null;
  }

  const number = Number(value.replace(",", "."));

  if (!Number.isFinite(number)) {
    return null;
  }

  return number;
}

function getIntInRange(
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

function getDate(formData: FormData, key: string) {
  const value = getString(formData, key);

  if (value === null) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

function getDirection(formData: FormData) {
  const value = getString(formData, "direction");

  if (!value) {
    return "LONG";
  }

  const normalizedValue = value.toUpperCase();

  if (
    normalizedValue === "LONG" ||
    normalizedValue === "SHORT"
  ) {
    return normalizedValue;
  }

  return "LONG";
}

function getOutcome(formData: FormData) {
  const value = getString(formData, "outcome");

  if (!value) {
    return null;
  }

  const normalizedValue = value.toLowerCase();

  if (
    normalizedValue === "win" ||
    normalizedValue === "loss" ||
    normalizedValue === "be"
  ) {
    return normalizedValue;
  }

  return null;
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

  const isManager =
    membership.role === "MANAGER";

  const isMutatingAction =
    options?.requireCreateTrades ||
    options?.requireEditTrades ||
    options?.requireDeleteTrades;

  if (
    membership.role === "VIEWER" &&
    !options?.allowViewer
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    options?.requireCreateTrades &&
    !isManager &&
    !membership.canCreateTrades
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    options?.requireEditTrades &&
    !isManager &&
    !membership.canEditTrades
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    options?.requireDeleteTrades &&
    !isManager &&
    !membership.canDeleteTrades
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (isMutatingAction) {
    assertAccountWritable(membership.tradingAccount.status);
  }

  return membership;
}

async function getTradeForAccount(
  accountId: string,
  tradeId: number
) {
  if (!Number.isInteger(tradeId)) {
    redirect(`/accounts/${accountId}/diary`);
  }

  const trade = await prisma.trade.findFirst({
    where: {
      id: tradeId,
      tradingAccountId: accountId,
    },
  });

  if (!trade) {
    redirect(`/accounts/${accountId}/diary`);
  }

  return trade;
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

async function getTradeFormData(formData: FormData) {
  const strategyId = getString(formData, "strategyId") || null;
  let strategy: string | null = null;
  if (strategyId) {
    const strat = await prisma.strategy.findFirst({
      where: { id: strategyId },
      select: { name: true },
    });
    strategy = strat?.name ?? null;
  }
  return {
    openTime: getLimitedString(formData, "openTime", 20),
    reason: getLimitedString(formData, "reason", 1000),
    strategy,
    strategyId,

    symbol:
      getLimitedString(formData, "symbol", 30) ||
      "UNKNOWN",

    direction: getDirection(formData),

    amount: getNumber(formData, "amount"),
    openingPrice: getNumber(
      formData,
      "openingPrice"
    ),
    stopLoss: getNumber(formData, "stopLoss"),
    takeProfit: getNumber(formData, "takeProfit"),
    riskReward: getNumber(formData, "riskReward"),

    closeDate: getDate(formData, "closeDate"),
    closingPrice: getNumber(
      formData,
      "closingPrice"
    ),

    outcome: getOutcome(formData),
    resultUsd: getNumber(formData, "resultUsd"),

    notes: getLimitedString(formData, "notes", 2000),

    session: getLimitedString(formData, "session", 80),
    emotionalState: getLimitedString(
      formData,
      "emotionalState",
      120
    ),
    setupQuality: getIntInRange(
      formData,
      "setupQuality",
      1,
      10
    ),
    executionRating: getIntInRange(
      formData,
      "executionRating",
      1,
      10
    ),
    confidence: getIntInRange(
      formData,
      "confidence",
      1,
      10
    ),
    mistakes: getLimitedString(
      formData,
      "mistakes",
      1500
    ),
    lessonsLearned: getLimitedString(
      formData,
      "lessonsLearned",
      1500
    ),
  };
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

  const tradeData = await getTradeFormData(formData);

  const trade = await prisma.trade.create({
    data: {
      tradingAccountId: accountId,
      createdById: membership.userId,

      openDate,
      ...tradeData,
    },
  });

  await logActivity({
    userId: membership.userId,
    accountId,
    type: "TRADE_CREATED",
    title: "Trade created",
    description: `${trade.symbol} ${trade.direction} trade created`,
    metadata: {
      tradeId: trade.id,
      symbol: trade.symbol,
      direction: trade.direction,
      outcome: trade.outcome,
      source: "manual",
    },
  });

  await notifyAccountMembers({
    accountId,
    actorId: membership.userId,
    type: "TRADE_CREATED",
    title: "New trade created",
    message: `${trade.symbol} ${trade.direction} trade added`,
    link: `/accounts/${accountId}/diary`,
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}

export async function updateAccountTrade(
  accountId: string,
  tradeId: number,
  formData: FormData
) {
  const membership = await getAccess(accountId, {
    requireEditTrades: true,
  });

  const existingTrade =
    await getTradeForAccount(accountId, tradeId);

  const openDate = getDate(formData, "openDate");

  if (!openDate) {
    redirect(`/accounts/${accountId}/diary`);
  }

  const tradeData = await getTradeFormData(formData);

  const trade = await prisma.trade.update({
    where: {
      id: existingTrade.id,
    },
    data: {
      openDate,
      ...tradeData,
    },
  });

  await logActivity({
    userId: membership.userId,
    accountId,
    type: "TRADE_UPDATED",
    title: "Trade updated",
    description: `${trade.symbol} trade updated`,
    metadata: {
      tradeId: trade.id,
      symbol: trade.symbol,
      direction: trade.direction,
      outcome: trade.outcome,
      before: {
        symbol: existingTrade.symbol,
        direction: existingTrade.direction,
        outcome: existingTrade.outcome,
        resultUsd: existingTrade.resultUsd,
      },
      after: {
        symbol: trade.symbol,
        direction: trade.direction,
        outcome: trade.outcome,
        resultUsd: trade.resultUsd,
      },
    },
  });

  await notifyAccountMembers({
    accountId,
    actorId: membership.userId,
    type: "TRADE_UPDATED",
    title: "Trade updated",
    message: `${trade.symbol} trade updated`,
    link: `/accounts/${accountId}/diary`,
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}

export async function deleteAccountTrade(
  accountId: string,
  tradeId: number
) {
  const membership = await getAccess(accountId, {
    requireDeleteTrades: true,
  });

  const trade = await getTradeForAccount(
    accountId,
    tradeId
  );

  await logActivity({
    userId: membership.userId,
    accountId,
    type: "TRADE_DELETED",
    title: "Trade deleted",
    description: `${trade.symbol} trade deleted`,
    metadata: {
      tradeId: trade.id,
      symbol: trade.symbol,
      direction: trade.direction,
      outcome: trade.outcome,
      resultUsd: trade.resultUsd,
    },
  });

  await notifyAccountMembers({
    accountId,
    actorId: membership.userId,
    type: "TRADE_DELETED",
    title: "Trade deleted",
    message: `${trade.symbol} trade deleted`,
    link: `/accounts/${accountId}/diary`,
  });

  await prisma.trade.delete({
    where: {
      id: trade.id,
    },
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}
