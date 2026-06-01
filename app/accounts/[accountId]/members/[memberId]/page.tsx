import {
  ArrowLeft,
  BarChart3,
  Trophy,
  Activity,
  Target,
} from "lucide-react";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function MemberPerformancePage({
  params,
}: {
  params: Promise<{
    accountId: string;
    memberId: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId, memberId } = await params;

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
    membership.tradingAccount.status ===
    "ARCHIVED"
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  if (
    membership.role !== "MANAGER" &&
    !membership.canViewMembers
  ) {
    redirect(`/accounts/${accountId}/dashboard`);
  }

  const targetMembership =
    await prisma.accountMember.findFirst({
      where: {
        userId: memberId,
        tradingAccountId: accountId,
      },
      include: {
        user: true,
      },
    });

  if (!targetMembership) {
    redirect(`/accounts/${accountId}/members`);
  }

  const member = targetMembership.user;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      createdById: memberId,
    },
    orderBy: [
      {
        openDate: "desc",
      },
      {
        openTime: "desc",
      },
      {
        createdAt: "desc",
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

  const winRate =
    totalTrades > 0
      ? Math.round((wins / totalTrades) * 100)
      : 0;

  const totalPnl = trades.reduce(
    (sum, trade) =>
      sum + (trade.resultUsd || 0),
    0
  );

  const bestTrade =
    trades.length > 0
      ? Math.max(
        ...trades.map(
          (trade) => trade.resultUsd || 0
        )
      )
      : 0;

  const symbols = trades.reduce<
    Record<string, number>
  >((acc, trade) => {
    acc[trade.symbol] =
      (acc[trade.symbol] || 0) + 1;

    return acc;
  }, {});

  const bestSymbol =
    Object.entries(symbols).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-sm text-gray-400">
            Member Performance
          </p>

          <h1 className="mt-2 flex items-center gap-3 text-4xl font-black text-white">
            <BarChart3 className="text-cyan-400" />
            {member.name || member.username}
          </h1>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">
            Analisi operativa individuale del membro su questo account.
          </p>
        </div>

        <Link
          href={`/accounts/${accountId}/members`}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-gray-300 transition hover:bg-white/[0.05]"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            Total Trades
          </p>

          <p className="mt-4 text-3xl font-black text-white">
            {totalTrades}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            Win Rate
          </p>

          <p className="mt-4 text-3xl font-black text-white">
            {winRate}%
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            Total PnL
          </p>

          <p
            className={`mt-4 text-3xl font-black ${totalPnl >= 0
                ? "text-cyan-300"
                : "text-red-300"
              }`}
          >
            ${totalPnl.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-500">
            Best Symbol
          </p>

          <p className="mt-4 text-3xl font-black text-white">
            {bestSymbol}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-[32px] border border-cyan-500/20 bg-cyan-500/10 p-6">
          <Trophy className="text-cyan-300" />

          <h2 className="mt-4 text-2xl font-black text-white">
            Best Trade
          </h2>

          <p className="mt-4 text-3xl font-black text-cyan-300">
            ${bestTrade.toFixed(2)}
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <Activity className="text-cyan-300" />

          <h2 className="mt-4 text-2xl font-black text-white">
            Win / Loss
          </h2>

          <p className="mt-4 text-sm text-gray-300">
            {wins} win · {losses} loss
          </p>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <Target className="text-cyan-300" />

          <h2 className="mt-4 text-2xl font-black text-white">
            Operating Focus
          </h2>

          <p className="mt-4 text-sm text-gray-300">
            Strumento più utilizzato:{" "}
            {bestSymbol}
          </p>
        </div>
      </div>
    </div>
  );
}