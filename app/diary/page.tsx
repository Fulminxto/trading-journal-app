import { prisma } from "@/lib/prisma";
import { createTrade, deleteTrade } from "./actions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DiaryPage({
  searchParams,
}: {
  searchParams: Promise<{
    symbol?: string;
    direction?: string;
    outcome?: string;
    strategy?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const params = await searchParams;

  const symbol = params.symbol || "";
  const direction = params.direction || "";
  const outcome = params.outcome || "";
  const strategy = params.strategy || "";

  const trades = await prisma.trade.findMany({
    where: {
      userId,

      ...(symbol ? { symbol } : {}),

      ...(direction ? { direction } : {}),

      ...(outcome ? { outcome } : {}),

      ...(strategy
        ? {
            strategy: {
              contains: strategy,
            },
          }
        : {}),
    },

    orderBy: {
      id: "desc",
    },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">Registro operazioni</p>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Trading Diary
        </h1>
      </div>

      {/* CREATE TRADE FORM */}
      <form
        action={createTrade}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:grid-cols-2 sm:p-5 xl:grid-cols-4"
      >
        <input
          name="openDate"
          type="date"
          className="rounded-xl bg-zinc-900 p-3"
          required
        />

        <input
          name="openTime"
          type="time"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="reason"
          placeholder="Motivo"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="strategy"
          placeholder="Strategia"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="symbol"
          className="rounded-xl bg-zinc-900 p-3"
          required
        >
          <option value="">Strumento</option>
          <option value="XAUUSD">XAUUSD</option>
          <option value="BTCUSD">BTCUSD</option>
          <option value="EURUSD">EURUSD</option>
          <option value="GBPUSD">GBPUSD</option>
          <option value="USDJPY">USDJPY</option>
          <option value="NASDAQ">NASDAQ</option>
          <option value="S&P500">S&P500</option>
        </select>

        <select
          name="direction"
          className="rounded-xl bg-zinc-900 p-3"
          required
        >
          <option value="LONG">LONG</option>
          <option value="SHORT">SHORT</option>
        </select>

        <select
          name="amount"
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Amount / Lotto</option>
          <option value="0.01">0.01</option>
          <option value="0.02">0.02</option>
          <option value="0.03">0.03</option>
          <option value="0.05">0.05</option>
          <option value="0.10">0.10</option>
          <option value="0.20">0.20</option>
          <option value="0.50">0.50</option>
          <option value="1.00">1.00</option>
        </select>

        <input
          name="openingPrice"
          placeholder="Opening Price"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="stopLoss"
          placeholder="Stop Loss"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="takeProfit"
          placeholder="Take Profit"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="riskReward"
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Risk / Reward</option>
          <option value="1">1R</option>
          <option value="1.5">1.5R</option>
          <option value="2">2R</option>
          <option value="2.5">2.5R</option>
          <option value="3">3R</option>
          <option value="4">4R</option>
          <option value="5">5R</option>
        </select>

        <input
          name="closeDate"
          type="date"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <input
          name="closingPrice"
          placeholder="Closing Price"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <select
          name="outcome"
          className="rounded-xl bg-zinc-900 p-3"
        >
          <option value="">Outcome</option>
          <option value="win">Win</option>
          <option value="loss">Loss</option>
          <option value="be">BE</option>
        </select>

        <input
          name="resultUsd"
          placeholder="Result $"
          className="rounded-xl bg-zinc-900 p-3"
        />

        <textarea
          name="notes"
          placeholder="Note"
          className="rounded-xl bg-zinc-900 p-3 sm:col-span-2 xl:col-span-4"
        />

        <button
          type="submit"
          className="rounded-xl bg-green-500 p-3 font-bold text-black sm:col-span-2 xl:col-span-4"
        >
          Salva operazione
        </button>
      </form>

      <div className="mb-4 text-sm text-gray-400">
        Operazioni trovate:{" "}
        <span className="font-semibold text-white">
          {trades.length}
        </span>
      </div>
    </div>
  );
}