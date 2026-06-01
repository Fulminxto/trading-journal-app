import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  Gauge,
  ListChecks,
  Save,
  ShieldCheck,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveTradingGoals } from "./actions";

type StatCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  tone?: string;
};

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

function ProgressBar({
  value,
  tone = "bg-green-400",
}: {
  value: number;
  tone?: string;
}) {
  const width = Math.min(
    Math.max(value, 0),
    100
  );

  return (
    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className={`h-full rounded-full ${tone}`}
        style={{
          width: `${width}%`,
        }}
      />
    </div>
  );
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

export default async function RulesPage({
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

  if (
    membership.role !== "MANAGER" &&
    !membership.canManageAccount
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.tradingAccount.status === "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
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
  const currency = account.currency || "USD";

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

  const monthLabel = now.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const goal =
    await prisma.tradingGoal.findUnique({
      where: {
        tradingAccountId_month_year: {
          tradingAccountId: accountId,
          month,
          year,
        },
      },
    });

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      openDate: {
        gte: monthStart,
        lt: monthEnd,
      },
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

  const totalPnl = trades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const closedTrades = trades.filter(
    (trade) =>
      trade.outcome === "win" ||
      trade.outcome === "loss" ||
      trade.outcome === "be"
  );

  const wins = closedTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const winRate =
    closedTrades.length > 0
      ? (wins / closedTrades.length) * 100
      : 0;

  const maxDrawdown =
    trades.length > 0
      ? Math.abs(
        Math.min(
          ...trades.map(
            (trade) =>
              trade.drawdownPercent || 0
          )
        )
      )
      : 0;

  const tradesByDay = new Map<string, number>();

  for (const trade of trades) {
    const key = trade.openDate.toDateString();
    tradesByDay.set(
      key,
      (tradesByDay.get(key) || 0) + 1
    );
  }

  const busiestDayTrades =
    tradesByDay.size > 0
      ? Math.max(...tradesByDay.values())
      : 0;

  const monthlyProfitGoal =
    goal?.monthlyProfitGoal || 0;

  const monthlyWinRateGoal =
    goal?.monthlyWinRateGoal || 0;

  const maxDrawdownLimit =
    goal?.maxDrawdownLimit || 0;

  const maxTradesPerDay =
    goal?.maxTradesPerDay || 0;

  const profitProgress =
    monthlyProfitGoal > 0
      ? (totalPnl / monthlyProfitGoal) * 100
      : 0;

  const winRateProgress =
    monthlyWinRateGoal > 0
      ? (winRate / monthlyWinRateGoal) * 100
      : 0;

  const drawdownUsage =
    maxDrawdownLimit > 0
      ? (maxDrawdown / maxDrawdownLimit) * 100
      : 0;

  const tradeLimitUsage =
    maxTradesPerDay > 0
      ? (busiestDayTrades / maxTradesPerDay) * 100
      : 0;

  const profitRemaining =
    monthlyProfitGoal > 0
      ? monthlyProfitGoal - totalPnl
      : null;

  const rules = [
    {
      title: "No revenge trading",
      description:
        "Do not open a new trade to emotionally recover a loss.",
    },
    {
      title: "No impulsive entries",
      description:
        "Every entry must come from a valid setup and clear reason.",
    },
    {
      title: "Respect risk limits",
      description:
        "The account must stay inside drawdown and trade frequency limits.",
    },
    {
      title: "Stop after emotional mistakes",
      description:
        "If execution quality drops, the priority becomes protection.",
    },
    {
      title: "Process before profit",
      description:
        "The goal is to protect consistency, not chase a single result.",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.08),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-yellow-300">
                Discipline system
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {monthLabel}
              </span>
            </div>

            <p className="text-sm text-gray-400">
              Account control center
            </p>

            <h1 className="mt-3 text-5xl font-black tracking-tight text-white sm:text-6xl">
              Rules & Goals
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              Set the monthly targets, define the account
              limits and keep the operating rules visible
              before performance becomes emotional.
            </p>
          </div>

          <Link
            href={`/accounts/${accountId}`}
            className="w-fit rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
          >
            Back to Account Hub
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly PnL"
          value={formatCurrency(totalPnl, currency)}
          description={
            monthlyProfitGoal > 0
              ? `Target: ${formatCurrency(
                monthlyProfitGoal,
                currency
              )}`
              : "No monthly profit target set."
          }
          icon={TrendingUp}
          tone={getResultTone(totalPnl)}
        />

        <StatCard
          label="Win Rate"
          value={formatPercent(winRate)}
          description={
            monthlyWinRateGoal > 0
              ? `Target: ${formatPercent(
                monthlyWinRateGoal
              )}`
              : "No win rate target set."
          }
          icon={Target}
          tone={
            winRate >= monthlyWinRateGoal &&
              monthlyWinRateGoal > 0
              ? "text-green-400"
              : "text-yellow-400"
          }
        />

        <StatCard
          label="Max Drawdown"
          value={formatPercent(maxDrawdown)}
          description={
            maxDrawdownLimit > 0
              ? `Limit: ${formatPercent(
                maxDrawdownLimit
              )}`
              : "No drawdown limit set."
          }
          icon={ShieldCheck}
          tone={
            maxDrawdownLimit > 0 &&
              maxDrawdown > maxDrawdownLimit
              ? "text-red-400"
              : "text-yellow-300"
          }
        />

        <StatCard
          label="Trades This Month"
          value={trades.length}
          description={
            maxTradesPerDay > 0
              ? `Daily limit: ${maxTradesPerDay}`
              : "No daily trade limit set."
          }
          icon={Activity}
          tone="text-cyan-300"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          action={saveTradingGoals.bind(
            null,
            accountId
          )}
          className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Performance targets
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Monthly Goals
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-green-400">
              <Gauge size={20} />
            </div>
          </div>

          <div className="space-y-4">
            <input
              name="monthlyProfitGoal"
              type="number"
              step="0.01"
              placeholder="Monthly Profit Goal"
              defaultValue={
                goal?.monthlyProfitGoal || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <input
              name="monthlyWinRateGoal"
              type="number"
              step="0.01"
              placeholder="Monthly Win Rate Goal %"
              defaultValue={
                goal?.monthlyWinRateGoal || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <input
              name="maxDrawdownLimit"
              type="number"
              step="0.01"
              placeholder="Max Drawdown Limit %"
              defaultValue={
                goal?.maxDrawdownLimit || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <input
              name="maxTradesPerDay"
              type="number"
              placeholder="Max Trades Per Day"
              defaultValue={
                goal?.maxTradesPerDay || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 text-white outline-none transition placeholder:text-gray-600 focus:border-green-500/40"
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-500 p-4 font-black text-black transition hover:bg-green-400"
            >
              <Save size={18} />
              Save Goals
            </button>
          </div>
        </form>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Operating framework
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Discipline Rules
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-3 text-yellow-300">
              <ListChecks size={20} />
            </div>
          </div>

          <div className="space-y-3">
            {rules.map((rule) => (
              <div
                key={rule.title}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                <p className="font-bold text-white">
                  {rule.title}
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-gray-400">
                Profit progress
              </p>

              <h2 className="mt-1 text-2xl font-black text-white">
                Monthly Target
              </h2>
            </div>

            <CalendarDays className="text-green-400" />
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-gray-400">
                Current progress
              </span>

              <span className={getResultTone(totalPnl)}>
                {profitProgress.toFixed(0)}%
              </span>
            </div>

            <ProgressBar value={profitProgress} />

            <p className="mt-4 text-sm leading-6 text-gray-500">
              {profitRemaining !== null
                ? profitRemaining <= 0
                  ? "Monthly profit target reached."
                  : `${formatCurrency(
                    profitRemaining,
                    currency
                  )} remaining to reach the target.`
                : "Set a monthly profit target to track progress."}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Win Rate Progress
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {winRateProgress.toFixed(0)}%
          </h2>

          <ProgressBar
            value={winRateProgress}
            tone="bg-cyan-300"
          />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Drawdown Usage
          </p>

          <h2
            className={`mt-3 text-3xl font-black ${drawdownUsage > 100
                ? "text-red-400"
                : "text-yellow-300"
              }`}
          >
            {drawdownUsage.toFixed(0)}%
          </h2>

          <ProgressBar
            value={drawdownUsage}
            tone={
              drawdownUsage > 100
                ? "bg-red-400"
                : "bg-yellow-300"
            }
          />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-300">
            <AlertTriangle size={20} />
          </div>

          <div>
            <p className="text-sm text-gray-400">
              Control signals
            </p>

            <h2 className="mt-1 text-2xl font-black text-white">
              Risk Guardrails
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Busiest day
            </p>

            <h3 className="mt-3 text-3xl font-black text-white">
              {busiestDayTrades}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Max trades opened in one day this month.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Daily limit usage
            </p>

            <h3
              className={`mt-3 text-3xl font-black ${tradeLimitUsage > 100
                  ? "text-red-400"
                  : "text-yellow-300"
                }`}
            >
              {tradeLimitUsage.toFixed(0)}%
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Based on the busiest trading day.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Closed trades
            </p>

            <h3 className="mt-3 text-3xl font-black text-cyan-300">
              {closedTrades.length}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Used to calculate current win rate.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}