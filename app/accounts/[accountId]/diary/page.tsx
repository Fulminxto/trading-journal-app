import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import {
  createAccountTrade,
  deleteAccountTrade,
} from "./actions";

function formatCurrency(value: number, currency: string) {
  return `${value.toFixed(2)} ${currency}`;
}

export default async function DiaryPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

  const membership = await prisma.accountMember.findFirst({
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

  const account = membership.tradingAccount;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },
    orderBy: [
      {
        openDate: "desc",
      },
      {
        id: "desc",
      },
    ],
  });

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = trades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const winRate =
    totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  const currentEquity =
    trades.length > 0
      ? trades[0].equity || account.initialBalance
      : account.initialBalance;

  const bestTrade =
    trades.length > 0
      ? Math.max(
          ...trades.map((trade) => trade.resultUsd || 0)
        )
      : 0;

  const worstTrade =
    trades.length > 0
      ? Math.min(
          ...trades.map((trade) => trade.resultUsd || 0)
        )
      : 0;

  const statCards = [
    {
      label: "Total PnL",
      value: formatCurrency(totalPnl, account.currency),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: "Current Equity",
      value: formatCurrency(currentEquity, account.currency),
      tone: "text-white",
    },
    {
      label: "Win Rate",
      value: `${winRate.toFixed(2)}%`,
      tone: "text-green-400",
    },
    {
      label: "Total Trades",
      value: totalTrades,
      tone: "text-white",
    },
    {
      label: "Best Trade",
      value: formatCurrency(bestTrade, account.currency),
      tone: "text-green-400",
    },
    {
      label: "Worst Trade",
      value: formatCurrency(worstTrade, account.currency),
      tone: "text-red-400",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Registro operativo
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Trading Diary
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Account: {account.name}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-gray-300">
          {wins} Win · {losses} Loss · {breakEven} BE
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <p className="text-sm text-gray-400">
              {stat.label}
            </p>

            <h2 className={`mt-2 text-2xl font-bold ${stat.tone}`}>
              {stat.value}
            </h2>
          </div>
        ))}
      </div>

      <form
        action={createAccountTrade.bind(null, accountId)}
        className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5"
      >
        <div className="mb-6">
          <p className="text-sm text-gray-400">
            Nuova operazione
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Inserisci trade
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <input
            name="openDate"
            type="date"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
            required
          />

          <input
            name="openTime"
            type="time"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="reason"
            placeholder="Motivo"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="strategy"
            placeholder="Strategia"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <select
            name="symbol"
            required
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">Strumento</option>

            <optgroup label="Forex">
              <option value="EURUSD">EURUSD</option>
              <option value="GBPUSD">GBPUSD</option>
              <option value="USDJPY">USDJPY</option>
              <option value="AUDUSD">AUDUSD</option>
              <option value="USDCAD">USDCAD</option>
              <option value="USDCHF">USDCHF</option>
              <option value="NZDUSD">NZDUSD</option>
            </optgroup>

            <optgroup label="Gold & Commodities">
              <option value="XAUUSD">XAUUSD</option>
              <option value="XAGUSD">XAGUSD</option>
              <option value="USOIL">USOIL</option>
              <option value="UKOIL">UKOIL</option>
            </optgroup>

            <optgroup label="Crypto">
              <option value="BTCUSD">BTCUSD</option>
              <option value="ETHUSD">ETHUSD</option>
              <option value="SOLUSD">SOLUSD</option>
              <option value="XRPUSD">XRPUSD</option>
            </optgroup>

            <optgroup label="Indices">
              <option value="NASDAQ">NASDAQ</option>
              <option value="S&P500">S&P500</option>
              <option value="DAX40">DAX40</option>
              <option value="DJI">DJI</option>
            </optgroup>
          </select>

          <select
            name="direction"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>

          <input
            name="amount"
            placeholder="Amount / Lot"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="openingPrice"
            placeholder="Opening Price"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="stopLoss"
            placeholder="Stop Loss"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="takeProfit"
            placeholder="Take Profit"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="riskReward"
            placeholder="Risk Reward"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="closeDate"
            type="date"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <input
            name="closingPrice"
            placeholder="Closing Price"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <select
            name="outcome"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          >
            <option value="">Outcome</option>
            <option value="win">Win</option>
            <option value="loss">Loss</option>
            <option value="be">BE</option>
          </select>

          <input
            name="resultUsd"
            placeholder="Result $"
            className="rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40"
          />

          <textarea
            name="notes"
            placeholder="Note operative"
            className="min-h-[110px] rounded-2xl border border-white/10 bg-zinc-900 p-4 outline-none focus:border-green-500/40 sm:col-span-2 xl:col-span-4"
          />

          <button
            type="submit"
            className="rounded-2xl bg-green-500 p-4 font-bold text-black transition hover:bg-green-400 sm:col-span-2 xl:col-span-4"
          >
            Aggiungi trade
          </button>
        </div>
      </form>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Storico operazioni
          </p>

          <h2 className="text-2xl font-bold">
            Trade registrati
          </h2>
        </div>

        <p className="text-sm text-gray-500">
          {totalTrades} operazioni totali
        </p>
      </div>

      <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03] lg:block">
        <table className="w-full border-collapse">
          <thead className="bg-white/5 text-left text-sm text-gray-400">
            <tr>
              <th className="p-4">Data</th>
              <th className="p-4">Symbol</th>
              <th className="p-4">Direction</th>
              <th className="p-4">Outcome</th>
              <th className="p-4">Result</th>
              <th className="p-4">Equity</th>
              <th className="p-4">R:R</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {trades.map((trade) => (
              <tr
                key={trade.id}
                className="border-t border-white/10 hover:bg-white/[0.02]"
              >
                <td className="p-4">
                  <div className="font-semibold">
                    {new Date(trade.openDate).toLocaleDateString("it-IT")}
                  </div>

                  <div className="text-xs text-gray-500">
                    {trade.openTime || "-"}
                  </div>
                </td>

                <td className="p-4 font-semibold">
                  {trade.symbol}
                </td>

                <td
                  className={`p-4 font-semibold ${
                    trade.direction === "LONG"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trade.direction}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                      trade.outcome === "win"
                        ? "bg-green-500/10 text-green-400"
                        : trade.outcome === "loss"
                        ? "bg-red-500/10 text-red-400"
                        : trade.outcome === "be"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-white/10 text-gray-400"
                    }`}
                  >
                    {trade.outcome || "-"}
                  </span>
                </td>

                <td
                  className={`p-4 font-bold ${
                    (trade.resultUsd || 0) >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {formatCurrency(
                    trade.resultUsd || 0,
                    account.currency
                  )}
                </td>

                <td className="p-4 font-semibold">
                  {formatCurrency(
                    trade.equity || account.initialBalance,
                    account.currency
                  )}
                </td>

                <td className="p-4 text-gray-300">
                  {trade.riskReward || "-"}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <Link
                      href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                      className="rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                    >
                      Edit
                    </Link>

                    <form
                      action={deleteAccountTrade.bind(
                        null,
                        accountId,
                        trade.id
                      )}
                    >
                      <button
                        type="submit"
                        className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}

            {trades.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="p-8 text-center text-gray-500"
                >
                  Nessun trade registrato.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {trades.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-center text-gray-500">
            Nessun trade registrato.
          </div>
        ) : (
          trades.map((trade) => (
            <div
              key={trade.id}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">
                    {trade.symbol}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(trade.openDate).toLocaleDateString("it-IT")}{" "}
                    · {trade.openTime || "-"}
                  </p>
                </div>

                <span
                  className={`rounded-xl px-3 py-1 text-sm font-bold ${
                    trade.direction === "LONG"
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {trade.direction}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-black/20 p-3">
                  <p className="text-gray-500">Outcome</p>
                  <p className="mt-1 font-bold">
                    {trade.outcome || "-"}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <p className="text-gray-500">Result</p>
                  <p
                    className={`mt-1 font-bold ${
                      (trade.resultUsd || 0) >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {formatCurrency(
                      trade.resultUsd || 0,
                      account.currency
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <p className="text-gray-500">Equity</p>
                  <p className="mt-1 font-bold">
                    {formatCurrency(
                      trade.equity || account.initialBalance,
                      account.currency
                    )}
                  </p>
                </div>

                <div className="rounded-2xl bg-black/20 p-3">
                  <p className="text-gray-500">R:R</p>
                  <p className="mt-1 font-bold">
                    {trade.riskReward || "-"}
                  </p>
                </div>
              </div>

              {trade.notes && (
                <p className="mt-4 rounded-2xl bg-black/20 p-3 text-sm text-gray-400">
                  {trade.notes}
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <Link
                  href={`/accounts/${accountId}/diary/${trade.id}/edit`}
                  className="flex-1 rounded-xl bg-white/10 px-3 py-3 text-center text-sm hover:bg-white/20"
                >
                  Edit
                </Link>

                <form
                  action={deleteAccountTrade.bind(
                    null,
                    accountId,
                    trade.id
                  )}
                  className="flex-1"
                >
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-red-500/10 px-3 py-3 text-sm text-red-400 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}