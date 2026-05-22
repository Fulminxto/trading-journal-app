import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import WeeklyReportCard from "@/components/reports/WeeklyReportCard";

export default async function ReportsPage({
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
    });

  if (!membership) {
    redirect("/accounts");
  }

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
    },

    orderBy: {
      openDate: "desc",
    },
  });

  const totalTrades = trades.length;

  const totalPnl = trades.reduce(
    (acc, trade) =>
      acc + (trade.resultUsd || 0),
    0
  );

  const wins = trades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = trades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const winRate =
    totalTrades > 0
      ? Math.round((wins / totalTrades) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.10),transparent_35%)]" />

        <div className="relative z-10">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
            VOLTIS AI Reports
          </p>

          <h1 className="mt-4 text-5xl font-black tracking-tight text-white xl:text-7xl">
            Intelligence Reports
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-400 xl:text-lg">
            Report automatici su
            performance, comportamento,
            disciplina, execution e
            psicologia operativa del trader.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Total Trades
          </p>

          <h2 className="mt-4 text-4xl font-black text-cyan-400">
            {totalTrades}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Total PnL
          </p>

          <h2 className="mt-4 text-4xl font-black text-green-400">
            ${totalPnl.toFixed(0)}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Win Rate
          </p>

          <h2 className="mt-4 text-4xl font-black text-violet-400">
            {winRate}%
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
          <p className="text-sm text-gray-400">
            Losses
          </p>

          <h2 className="mt-4 text-4xl font-black text-red-400">
            {losses}
          </h2>
        </div>
      </div>

      <WeeklyReportCard
        totalTrades={totalTrades}
        totalPnl={totalPnl}
        winRate={winRate}
      />

      <h2 className="mt-3 text-3xl font-black text-white">
        Performance Summary
      </h2>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Performance Analysis
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {totalPnl >= 0
              ? "Performance positiva. Il trader sta mantenendo una struttura operativa profittevole."
              : "Performance negativa. Necessaria revisione di execution e gestione rischio."}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Consistency Analysis
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {winRate >= 50
              ? "La consistenza operativa è sopra la soglia base."
              : "La consistenza è instabile. Focus su qualità setup e disciplina."}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            AI Coaching Insight
          </p>

          <h3 className="mt-3 text-xl font-black text-cyan-400">
            VOLTIS suggerisce di
            mantenere focus sulla
            qualità esecutiva e sulla
            ripetibilità del processo.
          </h3>
        </div>
      </div>
    </div>
  );
}