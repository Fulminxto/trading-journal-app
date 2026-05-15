import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

function formatCurrency(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    include: {
      memberships: {
        include: {
          tradingAccount: {
            include: {
              trades: true,
            },
          },
        },
      },

      createdTrades: {
        orderBy: {
          openDate: "asc",
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const displayName = user.name || user.username;

  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const accounts = user.memberships.map(
    (membership) => membership.tradingAccount
  );

  const totalAccounts = accounts.length;

  const allTrades = accounts.flatMap(
    (account) => account.trades
  );

  const totalTrades = allTrades.length;

  const totalPnl = allTrades.reduce(
    (acc, trade) => acc + (trade.resultUsd || 0),
    0
  );

  const wins = allTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const losses = allTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const breakEven = allTrades.filter(
    (trade) => trade.outcome === "be"
  ).length;

  const winRate =
    totalTrades > 0 ? (wins / totalTrades) * 100 : 0;

  const firstTrade = allTrades
    .sort(
      (a, b) =>
        new Date(a.openDate).getTime() -
        new Date(b.openDate).getTime()
    )[0];

  const lastTrade = allTrades
    .sort(
      (a, b) =>
        new Date(b.openDate).getTime() -
        new Date(a.openDate).getTime()
    )[0];

  const journalStartDate =
    firstTrade?.openDate || user.createdAt;

  const daysActive = Math.max(
    1,
    Math.ceil(
      (new Date().getTime() -
        new Date(journalStartDate).getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const statCards = [
    {
      label: "Account collegati",
      value: totalAccounts,
      tone: "text-white",
    },
    {
      label: "Trade totali",
      value: totalTrades,
      tone: "text-white",
    },
    {
      label: "PnL totale",
      value: formatCurrency(totalPnl),
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
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
      label: "Giorni nel journal",
      value: daysActive,
      tone: "text-yellow-400",
    },
    {
      label: "Break Even",
      value: breakEven,
      tone: "text-yellow-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">
          Profilo trader
        </p>

        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
          Profile
        </h1>
      </div>

      <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-green-500/10 text-3xl font-bold text-green-400">
              {initials}
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                {displayName}
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                @{user.username}
              </p>

              <div className="mt-3 inline-flex rounded-xl bg-white/10 px-3 py-1 text-sm text-gray-300">
                {user.role}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-400">
            <p>
              Membro dal{" "}
              <span className="font-semibold text-white">
                {formatDate(user.createdAt)}
              </span>
            </p>

            <p className="mt-2">
              Primo dato registrato{" "}
              <span className="font-semibold text-white">
                {formatDate(journalStartDate)}
              </span>
            </p>
          </div>
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-6">
            <p className="text-sm text-gray-400">
              Account collegati
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Trading Accounts
            </h2>
          </div>

          <div className="space-y-4">
            {user.memberships.map((membership) => {
              const account = membership.tradingAccount;

              const accountPnl = account.trades.reduce(
                (acc, trade) =>
                  acc + (trade.resultUsd || 0),
                0
              );

              return (
                <Link
                  key={membership.id}
                  href={`/accounts/${account.id}/dashboard`}
                  className="block rounded-2xl border border-white/10 bg-black/20 p-5 transition hover:bg-white/[0.04]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">
                        {account.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {account.type} · {membership.role}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className="rounded-xl bg-white/10 px-3 py-1 text-sm text-gray-300">
                        {account.trades.length} trade
                      </span>

                      <span
                        className={`rounded-xl px-3 py-1 text-sm font-semibold ${
                          accountPnl >= 0
                            ? "bg-green-500/10 text-green-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {formatCurrency(accountPnl)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}

            {user.memberships.length === 0 && (
              <p className="text-sm text-gray-500">
                Nessun account collegato.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Performance summary
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Risultati
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between rounded-2xl bg-black/20 p-3">
                <span className="text-gray-400">Wins</span>
                <span className="font-bold text-green-400">
                  {wins}
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-black/20 p-3">
                <span className="text-gray-400">Losses</span>
                <span className="font-bold text-red-400">
                  {losses}
                </span>
              </div>

              <div className="flex justify-between rounded-2xl bg-black/20 p-3">
                <span className="text-gray-400">Break Even</span>
                <span className="font-bold text-yellow-400">
                  {breakEven}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-gray-400">
              Timeline
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Journal history
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-2xl bg-black/20 p-3">
                <p className="text-gray-500">
                  Primo trade
                </p>

                <p className="mt-1 font-semibold">
                  {firstTrade
                    ? formatDate(firstTrade.openDate)
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-black/20 p-3">
                <p className="text-gray-500">
                  Ultimo trade
                </p>

                <p className="mt-1 font-semibold">
                  {lastTrade
                    ? formatDate(lastTrade.openDate)
                    : "-"}
                </p>
              </div>

              <div className="rounded-2xl bg-black/20 p-3">
                <p className="text-gray-500">
                  Inizio percorso
                </p>

                <p className="mt-1 font-semibold">
                  {formatDate(journalStartDate)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}