import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import EquityChart from "@/components/EquityChart";
import DashboardHero from "@/components/dashboard/DashboardHero";

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

  const account =
    membership.tradingAccount;

  const currency = account.currency;

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

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity ||
      account.initialBalance
      : account.initialBalance;

  const currentProfitPercent =
    ((currentEquity -
      account.initialBalance) /
      account.initialBalance) *
    100;

  const remainingToTarget =
    account.profitTarget
      ? account.profitTarget -
      currentProfitPercent
      : null;

  const winRate =
    totalTrades > 0
      ? (wins / totalTrades) * 100
      : 0;

  const averageWin =
    wins > 0
      ? trades
        .filter(
          (trade) =>
            trade.outcome ===
            "win"
        )
        .reduce(
          (acc, trade) =>
            acc +
            (trade.resultUsd || 0),
          0
        ) / wins
      : 0;

  const averageLoss =
    losses > 0
      ? trades
        .filter(
          (trade) =>
            trade.outcome ===
            "loss"
        )
        .reduce(
          (acc, trade) =>
            acc +
            (trade.resultUsd || 0),
          0
        ) / losses
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

  const maxDrawdown =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) =>
            trade.drawdownPercent ||
            0
        )
      )
      : 0;

  const chartData = trades.map((trade) => ({
    date: new Date(
      trade.openDate
    ).toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "2-digit",
    }),

    equity:
      trade.equity ||
      account.initialBalance,
  }));

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
      value: `${currentProfitPercent.toFixed(2)}%`,
      tone:
        currentProfitPercent >= 0
          ? "text-green-400"
          : "text-red-400",
    },

    {
      label: "Trades",
      value: totalTrades,
      tone: "text-white",
    },

    {
      label: "Win Rate",
      value: `${winRate.toFixed(2)}%`,
      tone:
        winRate >= 50
          ? "text-green-400"
          : "text-red-400",
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
      label: "Total PnL",
      value: formatCurrency(
        totalPnl,
        currency
      ),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
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
      value: `${maxDrawdown.toFixed(2)}%`,
      tone: "text-red-400",
    },

    {
      label: "Remaining Target",
      value:
        remainingToTarget !== null
          ? `${remainingToTarget.toFixed(
            2
          )}%`
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
          winRate={`${winRate.toFixed(2)}%`}
          totalTrades={totalTrades}
        />

        <div className="mb-8">
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
              $
              {account.initialBalance.toLocaleString()}
            </h2>
          </div>

          <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Currency
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              {account.currency}
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
                ? `${account.profitTarget}%`
                : "-"}
            </h2>
          </div>

          <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Max Drawdown
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-400">
              {account.maxDrawdown
                ? `${account.maxDrawdown}%`
                : "-"}
            </h2>
          </div>

          <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Daily Drawdown
            </p>

            <h2 className="mt-2 text-3xl font-bold text-red-400">
              {account.dailyDrawdown
                ? `${account.dailyDrawdown}%`
                : "-"}
            </h2>
          </div>
        </div>

        <div className="card-hover mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Account Growth
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Equity Curve
            </h2>
          </div>

          <EquityChart data={chartData} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5"
            >
              <p className="text-sm text-gray-400">
                {stat.label}
              </p>

              <h2
                className={`mt-2 text-3xl font-bold ${stat.tone}`}
              >
                {stat.value}
              </h2>
            </div>
          ))}
        </div>
      </div>
      );
}