import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { saveTradingGoals } from "./actions";

function ProgressBar({
  value,
}: {
  value: number;
}) {
  const width = Math.min(Math.max(value, 0), 100);

  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-green-400"
        style={{ width: `${width}%` }}
      />
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
    redirect(
      `/accounts/${accountId}/dashboard`
    );
  }

  if (
    membership.tradingAccount.status ===
    "ARCHIVED"
  ) {
    redirect(
      `/accounts/${accountId}/dashboard`
    );
  }

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 1);

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
  });

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const winRate =
    trades.length > 0
      ? (wins / trades.length) * 100
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

  const profitProgress =
    goal?.monthlyProfitGoal &&
      goal.monthlyProfitGoal > 0
      ? (totalPnl / goal.monthlyProfitGoal) *
      100
      : 0;

  const winRateProgress =
    goal?.monthlyWinRateGoal &&
      goal.monthlyWinRateGoal > 0
      ? (winRate / goal.monthlyWinRateGoal) *
      100
      : 0;

  return (
    <div>
      <div className="mb-10">
        <p className="text-sm text-gray-400">
          Discipline System
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Rules & Goals
        </h1>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Monthly PnL
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${totalPnl >= 0
                ? "text-green-400"
                : "text-red-400"
              }`}
          >
            ${totalPnl.toFixed(2)}
          </h2>

          <ProgressBar value={profitProgress} />
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Win Rate
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {winRate.toFixed(1)}%
          </h2>

          <ProgressBar value={winRateProgress} />
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Max Drawdown
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {maxDrawdown.toFixed(2)}%
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Trades This Month
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {trades.length}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <form
          action={saveTradingGoals.bind(
            null,
            accountId
          )}
          className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <p className="text-sm text-gray-400">
            Performance Targets
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Monthly Goals
          </h2>

          <div className="mt-6 space-y-4">
            <input
              name="monthlyProfitGoal"
              type="number"
              step="0.01"
              placeholder="Monthly Profit Goal"
              defaultValue={
                goal?.monthlyProfitGoal || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 outline-none"
            />

            <input
              name="monthlyWinRateGoal"
              type="number"
              step="0.01"
              placeholder="Monthly Win Rate Goal %"
              defaultValue={
                goal?.monthlyWinRateGoal || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 outline-none"
            />

            <input
              name="maxDrawdownLimit"
              type="number"
              step="0.01"
              placeholder="Max Drawdown Limit %"
              defaultValue={
                goal?.maxDrawdownLimit || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 outline-none"
            />

            <input
              name="maxTradesPerDay"
              type="number"
              placeholder="Max Trades Per Day"
              defaultValue={
                goal?.maxTradesPerDay || ""
              }
              className="w-full rounded-2xl border border-white/10 bg-black/20 p-4 outline-none"
            />

            <button
              type="submit"
              className="w-full rounded-2xl bg-green-500 p-4 font-bold text-black hover:bg-green-400"
            >
              Save Goals
            </button>
          </div>
        </form>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Discipline Rules
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Operating Rules
          </h2>

          <div className="mt-6 space-y-3">
            {[
              "No revenge trading",
              "No impulsive entries",
              "Respect risk limit",
              "Stop after emotional mistakes",
              "Process before profit",
            ].map((rule) => (
              <div
                key={rule}
                className="rounded-2xl border border-white/10 bg-black/20 p-4"
              >
                {rule}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}