"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function saveTradingGoals(
  accountId: string,
  formData: FormData
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
    });

  if (!membership) {
    redirect("/accounts");
  }

  const now = new Date();

  const month = now.getMonth();
  const year = now.getFullYear();

  await prisma.tradingGoal.upsert({
    where: {
      tradingAccountId_month_year: {
        tradingAccountId: accountId,
        month,
        year,
      },
    },

    update: {
      monthlyProfitGoal:
        Number(formData.get("monthlyProfitGoal")) || null,
      monthlyWinRateGoal:
        Number(formData.get("monthlyWinRateGoal")) || null,
      maxDrawdownLimit:
        Number(formData.get("maxDrawdownLimit")) || null,
      maxTradesPerDay:
        Number(formData.get("maxTradesPerDay")) || null,
    },

    create: {
      tradingAccountId: accountId,
      month,
      year,
      monthlyProfitGoal:
        Number(formData.get("monthlyProfitGoal")) || null,
      monthlyWinRateGoal:
        Number(formData.get("monthlyWinRateGoal")) || null,
      maxDrawdownLimit:
        Number(formData.get("maxDrawdownLimit")) || null,
      maxTradesPerDay:
        Number(formData.get("maxTradesPerDay")) || null,
    },
  });

  revalidatePath(`/accounts/${accountId}/rules`);
}