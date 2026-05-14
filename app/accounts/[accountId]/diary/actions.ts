"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

async function getAccess(
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

  return membership;
}

async function recalculateEquity(
  accountId: string
) {
  const membership =
    await prisma.accountMember.findFirst({
      where: {
        tradingAccountId: accountId,
      },

      include: {
        tradingAccount: true,
      },
    });

  if (!membership) {
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

  let equity =
    membership.tradingAccount
      .initialBalance;

  let equityPeak = equity;

  for (const trade of trades) {
    equity += trade.resultUsd || 0;

    if (equity > equityPeak) {
      equityPeak = equity;
    }

    const drawdownPercent =
      ((equity - equityPeak) /
        equityPeak) *
      100;

    const resultPercent =
      ((trade.resultUsd || 0) /
        membership.tradingAccount
          .initialBalance) *
      100;

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
  const membership =
    await getAccess(accountId);

  await prisma.trade.create({
    data: {
      tradingAccountId: accountId,

      createdById:
        membership.userId,

      openDate: new Date(
        formData.get(
          "openDate"
        ) as string
      ),

      openTime: formData.get(
        "openTime"
      ) as string,

      reason: formData.get(
        "reason"
      ) as string,

      strategy: formData.get(
        "strategy"
      ) as string,

      symbol: formData.get(
        "symbol"
      ) as string,

      direction: formData.get(
        "direction"
      ) as string,

      amount: Number(
        formData.get("amount")
      ),

      openingPrice: Number(
        formData.get(
          "openingPrice"
        )
      ),

      stopLoss: Number(
        formData.get("stopLoss")
      ),

      takeProfit: Number(
        formData.get("takeProfit")
      ),

      riskReward: Number(
        formData.get(
          "riskReward"
        )
      ),

      closeDate: formData.get(
        "closeDate"
      )
        ? new Date(
            formData.get(
              "closeDate"
            ) as string
          )
        : null,

      closingPrice: Number(
        formData.get(
          "closingPrice"
        )
      ),

      outcome: formData.get(
        "outcome"
      ) as string,

      resultUsd: Number(
        formData.get("resultUsd")
      ),

      notes: formData.get(
        "notes"
      ) as string,
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
  await getAccess(accountId);

  await prisma.trade.update({
    where: {
      id: tradeId,
      tradingAccountId: accountId,
    },

    data: {
      openDate: new Date(
        formData.get(
          "openDate"
        ) as string
      ),

      openTime: formData.get(
        "openTime"
      ) as string,

      reason: formData.get(
        "reason"
      ) as string,

      strategy: formData.get(
        "strategy"
      ) as string,

      symbol: formData.get(
        "symbol"
      ) as string,

      direction: formData.get(
        "direction"
      ) as string,

      amount: Number(
        formData.get("amount")
      ),

      openingPrice: Number(
        formData.get(
          "openingPrice"
        )
      ),

      stopLoss: Number(
        formData.get("stopLoss")
      ),

      takeProfit: Number(
        formData.get("takeProfit")
      ),

      riskReward: Number(
        formData.get(
          "riskReward"
        )
      ),

      closeDate: formData.get(
        "closeDate"
      )
        ? new Date(
            formData.get(
              "closeDate"
            ) as string
          )
        : null,

      closingPrice: Number(
        formData.get(
          "closingPrice"
        )
      ),

      outcome: formData.get(
        "outcome"
      ) as string,

      resultUsd: Number(
        formData.get("resultUsd")
      ),

      notes: formData.get(
        "notes"
      ) as string,
    },
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}

export async function deleteAccountTrade(
  accountId: string,
  tradeId: number,
  formData: FormData
) {
  await getAccess(accountId);

  await prisma.trade.delete({
    where: {
      id: tradeId,
      tradingAccountId: accountId,
    },
  });

  await recalculateEquity(accountId);

  redirect(`/accounts/${accountId}/diary`);
}