"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const STARTING_EQUITY = 10000; // Cambia qui il capitale iniziale del conto

function toNumber(value: FormDataEntryValue | null) {
  if (!value) return null;

  const stringValue = value.toString().replace(",", ".");
  const numberValue = Number(stringValue);

  return isNaN(numberValue) ? null : numberValue;
}

function toDate(value: FormDataEntryValue | null) {
  if (!value) return null;
  return new Date(value.toString());
}

async function recalculateEquity() {
  const trades = await prisma.trade.findMany({
    orderBy: [{ openDate: "asc" }, { id: "asc" }],
  });

  let equity = STARTING_EQUITY;
  let equityPeak = STARTING_EQUITY;

  for (const trade of trades) {
    const previousEquity = equity;
    const resultUsd = trade.resultUsd ?? 0;

    equity = equity + resultUsd;
    equityPeak = Math.max(equityPeak, equity);

    const resultPercent =
      previousEquity > 0 ? (resultUsd / previousEquity) * 100 : 0;

    const drawdownPercent =
      equityPeak > 0 ? ((equity - equityPeak) / equityPeak) * 100 : 0;

    await prisma.trade.update({
      where: {
        id: trade.id,
      },
      data: {
        resultPercent,
        equity,
        equityPeak,
        drawdownPercent,
      },
    });
  }
}

export async function createTrade(formData: FormData) {
  await prisma.trade.create({
    data: {
      openDate: new Date(formData.get("openDate") as string),
      openTime: formData.get("openTime") as string,
      reason: formData.get("reason") as string,
      strategy: formData.get("strategy") as string,
      symbol: formData.get("symbol") as string,
      direction: formData.get("direction") as string,
      amount: toNumber(formData.get("amount")),
      openingPrice: toNumber(formData.get("openingPrice")),
      stopLoss: toNumber(formData.get("stopLoss")),
      takeProfit: toNumber(formData.get("takeProfit")),
      riskReward: toNumber(formData.get("riskReward")),
      closeDate: toDate(formData.get("closeDate")),
      closingPrice: toNumber(formData.get("closingPrice")),
      outcome: formData.get("outcome") as string,
      resultUsd: toNumber(formData.get("resultUsd")),
      notes: formData.get("notes") as string,
    },
  });

  await recalculateEquity();

  redirect("/diary");
}

export async function deleteTrade(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.trade.delete({
    where: { id },
  });

  await recalculateEquity();

  redirect("/diary");
}

export async function updateTrade(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.trade.update({
    where: { id },
    data: {
      openDate: new Date(formData.get("openDate") as string),
      openTime: formData.get("openTime") as string,
      reason: formData.get("reason") as string,
      strategy: formData.get("strategy") as string,
      symbol: formData.get("symbol") as string,
      direction: formData.get("direction") as string,
      amount: toNumber(formData.get("amount")),
      openingPrice: toNumber(formData.get("openingPrice")),
      stopLoss: toNumber(formData.get("stopLoss")),
      takeProfit: toNumber(formData.get("takeProfit")),
      riskReward: toNumber(formData.get("riskReward")),
      closeDate: toDate(formData.get("closeDate")),
      closingPrice: toNumber(formData.get("closingPrice")),
      outcome: formData.get("outcome") as string,
      resultUsd: toNumber(formData.get("resultUsd")),
      notes: formData.get("notes") as string,
    },
  });

  await recalculateEquity();

  redirect("/diary");
}
