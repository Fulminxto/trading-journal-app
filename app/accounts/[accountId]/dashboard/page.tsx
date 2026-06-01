import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import EquityChart from "@/components/EquityChart";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardStatCard from "@/components/dashboard/DashboardStatCard";
import ConsistencyScoreCard from "@/components/dashboard/ConsistencyScoreCard";

function formatCurrency(
  value: number,
  currency: string
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function getResultTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-yellow-400";
}

function getDateLabel(date: Date) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ accountId: string }>;
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

  const account = membership.tradingAccount;

  const currency = account.currency;
  const initialBalance = account.initialBalance || 0;

  const totalTrades = trades.length;

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const be = trades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  ).length;

  const winningTrades = trades.filter(
    (trade) => trade.outcome === "win"
  );

  const losingTrades = trades.filter(
    (trade) => trade.outcome === "loss"
  );

  const grossProfit = winningTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const grossLoss = losingTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity ||
      initialBalance
      : initialBalance;

  const currentProfitPercent =
    initialBalance > 0
      ? ((currentEquity - initialBalance) /
        initialBalance) *
      100
      : 0;

  const remainingToTarget =
    account.profitTarget
      ? account.profitTarget - currentProfitPercent
      : null;

  const targetProgress =
    account.profitTarget && account.profitTarget > 0
      ? Math.max(
        0,
        Math.min(
          100,
          (currentProfitPercent /
            account.profitTarget) *
          100
        )
      )
      : 0;

  const winRate =
    closedTrades > 0
      ? (wins / closedTrades) * 100
      : 0;

  const lossRate =
    closedTrades > 0
      ? (losses / closedTrades) * 100
      : 0;

  const beRate =
    closedTrades > 0
      ? (be / closedTrades) * 100
      : 0;

  const averageWin =
    wins > 0 ? grossProfit / wins : 0;

  const averageLoss =
    losses > 0 ? grossLoss / losses : 0;

  const averageResult =
    totalTrades > 0 ? totalPnl / totalTrades : 0;

  const profitFactor =
    Math.abs(grossLoss) > 0
      ? grossProfit / Math.abs(grossLoss)
      : grossProfit > 0
        ? grossProfit
        : 0;

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const worstTrade =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const maxDrawdown =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) =>
            trade.drawdownPercent || 0
        )
      )
      : 0;

  const recentTrades = [...trades]
    .reverse()
    .slice(0, 5);

  const lastFivePnl = recentTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const lastFiveWins = recentTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const lastFiveLosses = recentTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const chartData = trades.map((trade) => ({
    date: getDateLabel(trade.openDate),

    equity:
      trade.equity ||
      initialBalance,
  }));

  const consistencyScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        winRate * 0.5 +
        (averageWin > Math.abs(averageLoss)
          ? 20
          : 10) +
        (maxDrawdown > -5 ? 20 : 10)
      )
    )
  );

  const accountHealth =
    totalTrades === 0
      ? "Waiting for data"
      : currentProfitPercent >= 0 &&
        maxDrawdown > -5
        ? "Stable"
        : currentProfitPercent >= 0
          ? "Positive but monitor risk"
          : "Needs review";

  const stats = [
    {
      label: "Current Equity",
      value: formatCurrency(
        currentEquity,
        currency
      ),
      tone: "text-white",
    },

    {
      label: "Current Profit",
      value: formatPercent(
        currentProfitPercent
      ),
      tone: getResultTone(
        currentProfitPercent
      ),
    },

    {
      label: "Total PnL",
      value: formatCurrency(
        totalPnl,
        currency
      ),
      tone: getResultTone(totalPnl),
    },

    {
      label: "Win Rate",
      value: formatPercent(winRate),
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
    },

    {
      label: "Trades",
      value: totalTrades,
      tone: "text-white",
    },

    {
      label: "Wins",
      value: wins,
      tone: "text-green-400",
    },

    {
      label: "Losses",
      value: losses,
      tone: "text-red-400",
    },

    {
      label: "Break Even",
      value: be,
      tone: "text-yellow-400",
    },

    {
      label: "Average Result",
      value: formatCurrency(
        averageResult,
        currency
      ),
      tone: getResultTone(
        averageResult
      ),
    },

    {
      label: "Average Win",
      value: formatCurrency(
        averageWin,
        currency
      ),
      tone: "text-green-400",
    },

    {
      label: "Average Loss",
      value: formatCurrency(
        averageLoss,
        currency
      ),
      tone: "text-red-400",
    },

    {
      label: "Profit Factor",
      value: profitFactor.toFixed(2),
      tone:
        profitFactor >= 1
          ? "text-green-400"
          : "text-red-400",
    },

    {
      label: "Best Trade",
      value: formatCurrency(
        bestTrade,
        currency
      ),
      tone: "text-green-400",
    },

    {
      label: "Worst Trade",
      value: formatCurrency(
        worstTrade,
        currency
      ),
      tone: "text-red-400",
    },

    {
      label: "Max Drawdown",
      value: formatPercent(maxDrawdown),
      tone: "text-red-400",
    },

    {
      label: "Remaining Target",
      value:
        remainingToTarget !== null
          ? formatPercent(remainingToTarget)
          : "-",
      tone:
        remainingToTarget !== null &&
          remainingToTarget <= 0
          ? "text-green-400"
          : "text-yellow-400",
    },
  ];

  return (
    <div>
      <DashboardHero
        accountName={account.name}
        currentEquity={formatCurrency(
          currentEquity,
          currency
        )}
        totalPnl={formatCurrency(
          totalPnl,
          currency
        )}
        winRate={formatPercent(winRate)}
        totalTrades={totalTrades}
      />

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ConsistencyScoreCard
            score={consistencyScore}
          />
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Account Status
          </p>

          <h2 className="mt-2 text-2xl font-black text-white">
            {accountHealth}
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Snapshot based on profit, drawdown and
            recent account behavior.
          </p>
        </div>
      </div>

      <div className="mb-8 mt-10">
        <p className="text-sm text-gray-400">
          Dashboard account
        </p>

        <h1 className="text-3xl font-bold sm:text-4xl">
          {account.name}
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Account Type
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {account.type}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Initial Balance
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {formatCurrency(
              initialBalance,
              currency
            )}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Currency
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {currency}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Broker / Firm
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {account.broker || "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Phase
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {account.phase || "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Profit Target
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {account.profitTarget
              ? formatPercent(
                account.profitTarget
              )
              : "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Max Drawdown Limit
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {account.maxDrawdown
              ? formatPercent(
                account.maxDrawdown
              )
              : "-"}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Daily Drawdown Limit
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {account.dailyDrawdown
              ? formatPercent(
                account.dailyDrawdown
              )
              : "-"}
          </h2>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Account Growth
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Equity Curve
            </h2>
          </div>

          {chartData.length > 0 ? (
            <EquityChart data={chartData} />
          ) : (
            <div className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/10 p-8 text-center text-sm text-gray-400">
              No trades yet. Once trades are added,
              the equity curve will appear here.
            </div>
          )}
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Target Progress
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            {account.profitTarget
              ? `${targetProgress.toFixed(0)}%`
              : "-"}
          </h2>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-green-400"
              style={{
                width: `${targetProgress}%`,
              }}
            />
          </div>

          <div className="mt-5 space-y-3 text-sm text-gray-400">
            <div className="flex items-center justify-between gap-4">
              <span>Current profit</span>
              <span
                className={getResultTone(
                  currentProfitPercent
                )}
              >
                {formatPercent(
                  currentProfitPercent
                )}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Target</span>
              <span className="text-green-400">
                {account.profitTarget
                  ? formatPercent(
                    account.profitTarget
                  )
                  : "-"}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span>Remaining</span>
              <span
                className={
                  remainingToTarget !== null &&
                    remainingToTarget <= 0
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                {remainingToTarget !== null
                  ? formatPercent(
                    remainingToTarget
                  )
                  : "-"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Recent Momentum
          </p>

          <h2
            className={`mt-2 text-3xl font-black ${getResultTone(
              lastFivePnl
            )}`}
          >
            {formatCurrency(
              lastFivePnl,
              currency
            )}
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            Last {recentTrades.length} trades ·{" "}
            <span className="text-green-400">
              {lastFiveWins}W
            </span>{" "}
            /{" "}
            <span className="text-red-400">
              {lastFiveLosses}L
            </span>
          </p>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Profit Factor
          </p>

          <h2
            className={`mt-2 text-3xl font-black ${profitFactor >= 1
                ? "text-green-400"
                : "text-red-400"
              }`}
          >
            {profitFactor.toFixed(2)}
          </h2>

          <p className="mt-3 text-sm text-gray-400">
            Gross profit compared to gross loss.
          </p>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Outcome Split
          </p>

          <div className="mt-4 space-y-3 text-sm">
            <div>
              <div className="mb-1 flex justify-between text-gray-400">
                <span>Wins</span>
                <span className="text-green-400">
                  {formatPercent(winRate)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-green-400"
                  style={{
                    width: `${Math.min(
                      100,
                      winRate
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-gray-400">
                <span>Losses</span>
                <span className="text-red-400">
                  {formatPercent(lossRate)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-red-400"
                  style={{
                    width: `${Math.min(
                      100,
                      lossRate
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-gray-400">
                <span>Break Even</span>
                <span className="text-yellow-400">
                  {formatPercent(beRate)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-yellow-400"
                  style={{
                    width: `${Math.min(
                      100,
                      beRate
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-3">
          <div className="mb-5">
            <p className="text-sm text-gray-400">
              Latest Activity
            </p>

            <h2 className="text-2xl font-bold">
              Recent Trades
            </h2>
          </div>

          {recentTrades.length > 0 ? (
            <div className="space-y-3">
              {recentTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div>
                    <p className="font-bold text-white">
                      {trade.symbol || "Unknown Symbol"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {getDateLabel(trade.openDate)} ·{" "}
                      {trade.direction || "-"} ·{" "}
                      {trade.outcome || "-"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-bold ${getResultTone(
                        trade.resultUsd || 0
                      )}`}
                    >
                      {formatCurrency(
                        trade.resultUsd || 0,
                        currency
                      )}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Equity{" "}
                      {formatCurrency(
                        trade.equity ||
                        initialBalance,
                        currency
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/10 p-6 text-sm text-gray-400">
              No recent trades yet.
            </div>
          )}
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-5">
            <p className="text-sm text-gray-400">
              Review Notes
            </p>

            <h2 className="text-2xl font-bold">
              What to watch
            </h2>
          </div>

          <div className="space-y-4 text-sm leading-6 text-gray-400">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="font-bold text-white">
                Risk
              </p>
              <p className="mt-1">
                Current max drawdown is{" "}
                <span className="text-red-400">
                  {formatPercent(maxDrawdown)}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="font-bold text-white">
                Execution
              </p>
              <p className="mt-1">
                Average result per trade is{" "}
                <span
                  className={getResultTone(
                    averageResult
                  )}
                >
                  {formatCurrency(
                    averageResult,
                    currency
                  )}
                </span>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="font-bold text-white">
                Consistency
              </p>
              <p className="mt-1">
                Score currently at{" "}
                <span className="text-green-400">
                  {consistencyScore}/100
                </span>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <DashboardStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            tone={stat.tone}
          />
        ))}
      </div>
    </div>
  );
}