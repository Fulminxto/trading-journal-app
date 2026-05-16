import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import {
  Wallet,
  Users,
  TrendingUp,
  Shield,
  ArrowRight,
  Activity,
} from "lucide-react";

export default async function AccountsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const currentUser =
    await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

  const memberships =
    await prisma.accountMember.findMany({
      where: {
        userId: session.user.id,
      },

      include: {
        tradingAccount: {
          include: {
            trades: true,
          },
        },
      },
    });

  const totalAccounts = memberships.length;

  const totalTrades = memberships.reduce(
    (acc, membership) =>
      acc + membership.tradingAccount.trades.length,
    0
  );

  const totalPnl = memberships.reduce(
    (acc, membership) =>
      acc +
      membership.tradingAccount.trades.reduce(
        (sum, trade) =>
          sum + (trade.resultUsd || 0),
        0
      ),
    0
  );

  const activeAccounts = memberships.filter(
    (membership) =>
      membership.tradingAccount.status === "ACTIVE"
  ).length;

  return (
    <div>
      <div className="relative mb-10 overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-green-400">
              Command Center
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome back,{" "}
              {currentUser?.name ||
                currentUser?.username}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-400">
              Seleziona un account operativo e continua a monitorare
              performance, sessioni, trade e crescita del tuo sistema.
            </p>
          </div>

          {currentUser?.role === "OWNER" && (
            <div className="flex flex-wrap gap-3">
              <a
                href="/admin"
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300 hover:bg-white/[0.06]"
              >
                Admin
              </a>

              <a
                href="/admin/accounts"
                className="rounded-2xl bg-green-500 px-4 py-3 text-sm font-bold text-black hover:bg-green-400"
              >
                Manage Accounts
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Accounts
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalAccounts}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Active
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {activeAccounts}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Total Trades
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalTrades}
          </h2>
        </div>

        <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Total PnL
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              totalPnl >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {totalPnl.toFixed(2)} $
          </h2>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Workspace
          </p>

          <h2 className="text-2xl font-bold">
            Trading Accounts
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {memberships.map((membership) => {
          const account =
            membership.tradingAccount;

          const accountPnl =
            account.trades.reduce(
              (acc, trade) =>
                acc + (trade.resultUsd || 0),
              0
            );

          const wins = account.trades.filter(
            (trade) =>
              trade.outcome === "win"
          ).length;

          const winRate =
            account.trades.length > 0
              ? (wins /
                  account.trades.length) *
                100
              : 0;

          return (
            <a
              key={account.id}
              href={`/accounts/${account.id}/dashboard`}
              className="card-hover group rounded-3xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-white">
                  <Wallet size={24} />
                </div>

                <span className="rounded-xl bg-white/10 px-3 py-1 text-xs font-semibold text-gray-300">
                  {account.type}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold transition group-hover:text-green-400">
                    {account.name}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {account.status}
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className="mt-1 text-gray-600 transition group-hover:translate-x-1 group-hover:text-green-400"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <TrendingUp size={15} />
                    Balance
                  </div>

                  <p className="font-bold text-white">
                    {account.initialBalance.toLocaleString()}{" "}
                    {account.currency}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <Users size={15} />
                    Role
                  </div>

                  <p className="font-bold text-white">
                    {membership.role}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <Activity size={15} />
                    Trades
                  </div>

                  <p className="font-bold text-white">
                    {account.trades.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="mb-2 flex items-center gap-2 text-gray-500">
                    <Shield size={15} />
                    WR
                  </div>

                  <p
                    className={`font-bold ${
                      winRate >= 50
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {winRate.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-gray-500">
                  Account PnL
                </p>

                <p
                  className={`mt-1 text-2xl font-bold ${
                    accountPnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {accountPnl.toFixed(2)}{" "}
                  {account.currency}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}