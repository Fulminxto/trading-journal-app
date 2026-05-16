import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  CandlestickChart,
} from "lucide-react";

function formatCurrency(
  value: number,
  currency: string
) {
  return `${value.toFixed(2)} ${currency}`;
}

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{
    accountId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;

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

  const account = membership.tradingAccount;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    orderBy: {
      openDate: "asc",
    },
  });

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  );

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  );

  const longTrades = trades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "long"
  );

  const shortTrades = trades.filter(
    (trade) =>
      trade.direction?.toLowerCase() ===
      "short"
  );

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const averageRR =
    trades.length > 0
      ? trades.reduce(
        (acc, trade) =>
          acc +
          (trade.riskReward || 0),
        0
      ) / trades.length
      : 0;

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) =>
            trade.resultUsd || 0
        )
      )
      : 0;

  const worstTrade =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) =>
            trade.resultUsd || 0
        )
      )
      : 0;

  const symbolStats: Record<
    string,
    {
      trades: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    const symbol = trade.symbol;

    if (!symbolStats[symbol]) {
      symbolStats[symbol] = {
        trades: 0,
        pnl: 0,
      };
    }

    symbolStats[symbol].trades += 1;

    symbolStats[symbol].pnl +=
      trade.resultUsd || 0;
  }

  const bestSymbol =
    Object.entries(symbolStats).sort(
      (a, b) =>
        b[1].pnl - a[1].pnl
    )[0];

  const worstSymbol =
    Object.entries(symbolStats).sort(
      (a, b) =>
        a[1].pnl - b[1].pnl
    )[0];

  const mostTraded =
    Object.entries(symbolStats).sort(
      (a, b) =>
        b[1].trades - a[1].trades
    )[0];

  const mistakesStats: Record<
    string,
    {
      count: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    if (!trade.mistakes) {
      continue;
    }

    const mistakes =
      trade.mistakes
        .split(",")
        .map((mistake) =>
          mistake.trim()
        )
        .filter(Boolean);

    for (const mistake of mistakes) {
      if (!mistakesStats[mistake]) {
        mistakesStats[mistake] = {
          count: 0,
          pnl: 0,
        };
      }

      mistakesStats[mistake].count += 1;

      mistakesStats[mistake].pnl +=
        trade.resultUsd || 0;
    }
  }

  const emotionalStats: Record<
    string,
    {
      trades: number;
      wins: number;
      pnl: number;
    }
  > = {};

  for (const trade of trades) {
    if (!trade.emotionalState) {
      continue;
    }

    if (
      !emotionalStats[
      trade.emotionalState
      ]
    ) {
      emotionalStats[
        trade.emotionalState
      ] = {
        trades: 0,
        wins: 0,
        pnl: 0,
      };
    }

    emotionalStats[
      trade.emotionalState
    ].trades += 1;

    if (trade.outcome === "win") {
      emotionalStats[
        trade.emotionalState
      ].wins += 1;
    }

    emotionalStats[
      trade.emotionalState
    ].pnl +=
      trade.resultUsd || 0;
  }

  const winRate =
    totalTrades > 0
      ? (wins.length / totalTrades) * 100
      : 0;

  const longWinRate =
    longTrades.length > 0
      ? (longTrades.filter(
        (trade) =>
          trade.outcome === "win"
      ).length /
        longTrades.length) *
      100
      : 0;

  const shortWinRate =
    shortTrades.length > 0
      ? (shortTrades.filter(
        (trade) =>
          trade.outcome === "win"
      ).length /
        shortTrades.length) *
      100
      : 0;

  const cards = [
    {
      label: "Total Trades",
      value: totalTrades,
      tone: "text-white",
      icon: BarChart3,
    },

    {
      label: "Win Rate",
      value: `${winRate.toFixed(2)}%`,
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
      icon: Target,
    },

    {
      label: "Average RR",
      value: averageRR.toFixed(2),
      tone: "text-yellow-400",
      icon: CandlestickChart,
    },

    {
      label: "Total PnL",
      value: formatCurrency(
        totalPnl,
        account.currency
      ),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
      icon:
        totalPnl >= 0
          ? TrendingUp
          : TrendingDown,
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Statistiche avanzate
        </p>

        <h1 className="mt-2 flex items-center gap-3 text-3xl font-bold sm:text-4xl">
          <BarChart3 className="text-green-400" />
          Analytics
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">
                  {card.label}
                </p>

                <Icon
                  size={20}
                  className="text-gray-500"
                />
              </div>

              <h2
                className={`mt-4 text-3xl font-bold ${card.tone}`}
              >
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Symbol Performance
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Performance strumenti
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-gray-500">
                Best Symbol
              </p>

              <div className="mt-2 flex items-center justify-between">
                <h3 className="text-xl font-bold text-green-400">
                  {bestSymbol?.[0] || "-"}
                </h3>

                <p className="font-semibold text-green-400">
                  {bestSymbol
                    ? formatCurrency(
                      bestSymbol[1].pnl,
                      account.currency
                    )
                    : "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-gray-500">
                Worst Symbol
              </p>

              <div className="mt-2 flex items-center justify-between">
                <h3 className="text-xl font-bold text-red-400">
                  {worstSymbol?.[0] || "-"}
                </h3>

                <p className="font-semibold text-red-400">
                  {worstSymbol
                    ? formatCurrency(
                      worstSymbol[1].pnl,
                      account.currency
                    )
                    : "-"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-gray-500">
                Most Traded
              </p>

              <div className="mt-2 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {mostTraded?.[0] || "-"}
                </h3>

                <p className="font-semibold text-white">
                  {mostTraded
                    ? `${mostTraded[1].trades} trades`
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Trade Direction
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Long vs Short
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  Long Trades
                </p>

                <p className="font-bold text-white">
                  {longTrades.length}
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-green-400"
                  style={{
                    width: `${Math.min(
                      longWinRate,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm text-green-400">
                {longWinRate.toFixed(2)}%
                winrate
              </p>
            </div>

            <div className="rounded-2xl bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">
                  Short Trades
                </p>

                <p className="font-bold text-white">
                  {shortTrades.length}
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${Math.min(
                      shortWinRate,
                      100
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm text-red-400">
                {shortWinRate.toFixed(2)}%
                winrate
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Trade Results
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Migliori risultati
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-gray-500">
                Best Trade
              </p>

              <h3 className="mt-2 text-2xl font-bold text-green-400">
                {formatCurrency(
                  bestTrade,
                  account.currency
                )}
              </h3>
            </div>

            <div className="rounded-2xl bg-black/20 p-4">
              <p className="text-sm text-gray-500">
                Worst Trade
              </p>

              <h3 className="mt-2 text-2xl font-bold text-red-400">
                {formatCurrency(
                  worstTrade,
                  account.currency
                )}
              </h3>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Outcome Breakdown
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Breakdown risultati
          </h2>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
              <p className="text-gray-400">
                Wins
              </p>

              <p className="font-bold text-green-400">
                {wins.length}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
              <p className="text-gray-400">
                Losses
              </p>

              <p className="font-bold text-red-400">
                {losses.length}
              </p>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
              <p className="text-gray-400">
                Break Even
              </p>

              <p className="font-bold text-yellow-400">
                {trades.filter(
                  (trade) =>
                    trade.outcome === "be"
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <p className="text-sm text-gray-400">
            Mistakes Analytics
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Errori ricorrenti
          </h2>

          <div className="mt-6 space-y-4">
            {Object.entries(mistakesStats).length === 0 ? (
              <p className="text-sm text-gray-500">
                Nessun errore registrato nei trade.
              </p>
            ) : (
              Object.entries(mistakesStats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([mistake, stats]) => (
                  <div
                    key={mistake}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-white">
                        {mistake}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Ripetuto {stats.count} volte
                      </p>
                    </div>

                    <p
                      className={`font-bold ${stats.pnl >= 0
                          ? "text-green-400"
                          : "text-red-400"
                        }`}
                    >
                      {formatCurrency(stats.pnl, account.currency)}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <p className="text-sm text-gray-400">
            Trading Psychology
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Emotional Performance
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(
              emotionalStats
            ).map(([state, stats]) => {
              const stateWinRate =
                stats.trades > 0
                  ? (stats.wins /
                    stats.trades) *
                  100
                  : 0;

              return (
                <div
                  key={state}
                  className="rounded-2xl border border-white/10 bg-black/20 p-5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">
                      {state}
                    </h3>

                    <div
                      className={`rounded-xl px-3 py-1 text-xs font-bold ${stateWinRate >= 50
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                        }`}
                    >
                      {stateWinRate.toFixed(0)}%
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Trades
                      </p>

                      <p className="font-bold text-white">
                        {stats.trades}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Wins
                      </p>

                      <p className="font-bold text-green-400">
                        {stats.wins}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Total PnL
                      </p>

                      <p
                        className={`font-bold ${stats.pnl >= 0
                          ? "text-green-400"
                          : "text-red-400"
                          }`}
                      >
                        {formatCurrency(
                          stats.pnl,
                          account.currency
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}