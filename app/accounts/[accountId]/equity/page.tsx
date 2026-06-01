import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  ArrowLeft,
  BarChart3,
  LineChart as LineChartIcon,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import EquityChart from "@/components/EquityChart";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: string;
};

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return `${value.toFixed(2)}%`;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatShortDate(date: Date) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "2-digit",
  });
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

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "text-white",
}: StatCardProps) {
  return (
    <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-400">
            {label}
          </p>

          <h2 className={`mt-3 text-3xl font-black ${tone}`}>
            {value}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
          <Icon size={20} />
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default async function EquityPage({
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

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      lastSeenAt: new Date(),
      lastActivityAt: new Date(),
    },
  });

  const account = membership.tradingAccount;

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

  const initialBalance = account.initialBalance || 0;
  const currency = account.currency || "USD";

  const currentEquity =
    trades.length > 0
      ? trades[trades.length - 1].equity || initialBalance
      : initialBalance;

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const currentProfitPercent =
    initialBalance > 0
      ? ((currentEquity - initialBalance) /
        initialBalance) *
      100
      : 0;

  const positiveTrades = trades.filter(
    (trade) => (trade.resultUsd || 0) > 0
  ).length;

  const negativeTrades = trades.filter(
    (trade) => (trade.resultUsd || 0) < 0
  ).length;

  const flatTrades = trades.filter(
    (trade) => (trade.resultUsd || 0) === 0
  ).length;

  const maxDrawdown =
    trades.length > 0
      ? Math.min(
        ...trades.map(
          (trade) => trade.drawdownPercent || 0
        )
      )
      : 0;

  const maxEquity =
    trades.length > 0
      ? Math.max(
        initialBalance,
        ...trades.map(
          (trade) => trade.equity || initialBalance
        )
      )
      : initialBalance;

  const lowestEquity =
    trades.length > 0
      ? Math.min(
        initialBalance,
        ...trades.map(
          (trade) => trade.equity || initialBalance
        )
      )
      : initialBalance;

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

  const averagePnl =
    trades.length > 0 ? totalPnl / trades.length : 0;

  const chartData = trades.map((trade) => ({
    date: formatShortDate(trade.openDate),
    equity: trade.equity || initialBalance,
  }));

  const recentTrades = [...trades].reverse().slice(0, 10);

  const stats = [
    {
      label: "Current Equity",
      value: formatCurrency(currentEquity, currency),
      description:
        "Latest calculated account equity after closed trades.",
      icon: Wallet,
      tone: "text-white",
    },
    {
      label: "Total PnL",
      value: formatCurrency(totalPnl, currency),
      description:
        "Total profit or loss generated by the account.",
      icon: TrendingUp,
      tone: getResultTone(totalPnl),
    },
    {
      label: "Growth",
      value: formatPercent(currentProfitPercent),
      description:
        "Performance compared to the initial balance.",
      icon: BarChart3,
      tone: getResultTone(currentProfitPercent),
    },
    {
      label: "Max Drawdown",
      value: formatPercent(maxDrawdown),
      description:
        "Deepest equity pullback recorded on the account.",
      icon: ShieldAlert,
      tone: maxDrawdown < 0 ? "text-red-400" : "text-yellow-400",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                Capital tracking
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {account.name}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Equity control center
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              Equity Curve
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              Follow account growth, capital protection,
              drawdown behavior and the progression of your
              trading equity over time.
            </p>
          </div>

          <Link
            href={`/accounts/${accountId}`}
            className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            <ArrowLeft size={17} />
            Back to Account Hub
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            tone={stat.tone}
          />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Account growth
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Equity Progression
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-cyan-300">
              <LineChartIcon size={20} />
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="min-w-0">
              <EquityChart data={chartData} />
            </div>
          ) : (
            <div className="flex min-h-[280px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm leading-6 text-gray-400">
              No trades yet. Once trades are added,
              the equity curve will appear here.
            </div>
          )}
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Equity Peak
            </p>

            <h2 className="mt-3 text-3xl font-black text-green-400">
              {formatCurrency(maxEquity, currency)}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Highest recorded equity value for this account.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Lowest Equity
            </p>

            <h2 className="mt-3 text-3xl font-black text-red-400">
              {formatCurrency(lowestEquity, currency)}
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Lowest recorded equity value including the initial balance.
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Positive Trades"
          value={positiveTrades}
          description="Trades closed with a positive result."
          icon={TrendingUp}
          tone="text-green-400"
        />

        <StatCard
          label="Negative Trades"
          value={negativeTrades}
          description="Trades closed with a negative result."
          icon={TrendingDown}
          tone="text-red-400"
        />

        <StatCard
          label="Flat Trades"
          value={flatTrades}
          description="Trades closed at break-even or without PnL."
          icon={Activity}
          tone="text-yellow-400"
        />

        <StatCard
          label="Average PnL"
          value={formatCurrency(averagePnl, currency)}
          description="Average result per recorded trade."
          icon={BarChart3}
          tone={getResultTone(averagePnl)}
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Best Trade
          </p>

          <h2 className="mt-3 text-4xl font-black text-green-400">
            {formatCurrency(bestTrade, currency)}
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Largest single positive result recorded on this account.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Worst Trade
          </p>

          <h2 className="mt-3 text-4xl font-black text-red-400">
            {formatCurrency(worstTrade, currency)}
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            Largest single negative result recorded on this account.
          </p>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Equity history
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Trade by Trade Progression
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            Showing latest {recentTrades.length} of {trades.length} trades
          </p>
        </div>

        {recentTrades.length > 0 ? (
          <>
            <div className="space-y-3 lg:hidden">
              {recentTrades.map((trade) => {
                const result = trade.resultUsd || 0;
                const equity = trade.equity || initialBalance;
                const drawdown = trade.drawdownPercent || 0;

                return (
                  <div
                    key={trade.id}
                    className="rounded-2xl border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-white">
                          {trade.symbol || "Unknown Symbol"}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(trade.openDate)} · {trade.outcome || "-"}
                        </p>
                      </div>

                      <p className={`font-black ${getResultTone(result)}`}>
                        {formatCurrency(result, currency)}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <p className="text-gray-500">Equity</p>
                        <p className="mt-1 font-bold text-white">
                          {formatCurrency(equity, currency)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.03] p-3">
                        <p className="text-gray-500">Drawdown</p>
                        <p
                          className={`mt-1 font-bold ${drawdown < 0
                              ? "text-red-400"
                              : "text-gray-300"
                            }`}
                        >
                          {formatPercent(drawdown)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
              <table className="w-full border-collapse">
                <thead className="bg-white/5 text-left text-sm text-gray-400">
                  <tr>
                    <th className="p-4">Date</th>
                    <th className="p-4">Symbol</th>
                    <th className="p-4">Outcome</th>
                    <th className="p-4">Equity</th>
                    <th className="p-4">PnL</th>
                    <th className="p-4">Drawdown</th>
                  </tr>
                </thead>

                <tbody>
                  {recentTrades.map((trade) => {
                    const result = trade.resultUsd || 0;
                    const drawdown = trade.drawdownPercent || 0;

                    return (
                      <tr
                        key={trade.id}
                        className="border-t border-white/10"
                      >
                        <td className="p-4 text-gray-300">
                          {formatDate(trade.openDate)}
                        </td>

                        <td className="p-4 font-semibold text-white">
                          {trade.symbol || "-"}
                        </td>

                        <td className="p-4 text-gray-300">
                          {trade.outcome || "-"}
                        </td>

                        <td className="p-4 font-semibold text-white">
                          {formatCurrency(
                            trade.equity || initialBalance,
                            currency
                          )}
                        </td>

                        <td className={`p-4 font-semibold ${getResultTone(result)}`}>
                          {formatCurrency(result, currency)}
                        </td>

                        <td
                          className={`p-4 font-semibold ${drawdown < 0
                              ? "text-red-400"
                              : "text-gray-300"
                            }`}
                        >
                          {formatPercent(drawdown)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-sm text-gray-400">
            No equity history yet. Add trades to start tracking capital progression.
          </div>
        )}
      </section>
    </div>
  );
}
