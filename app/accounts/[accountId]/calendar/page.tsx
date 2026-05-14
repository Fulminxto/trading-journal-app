import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatCurrency(value: number, currency: string) {
  return `${value.toFixed(2)} ${currency}`;
}

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{ accountId: string }>;
  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } = await params;
  const query = await searchParams;

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

  const account = membership.tradingAccount;
  const now = new Date();

  const parsedMonth =
    query.month !== undefined
      ? Number(query.month)
      : now.getMonth();

  const parsedYear =
    query.year !== undefined
      ? Number(query.year)
      : now.getFullYear();

  const month =
    Number.isNaN(parsedMonth) || parsedMonth < 0 || parsedMonth > 11
      ? now.getMonth()
      : parsedMonth;

  const year =
    Number.isNaN(parsedYear) ? now.getFullYear() : parsedYear;

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,
      openDate: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
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

  const days = getDaysInMonth(year, month);

  const grouped: Record<
    number,
    {
      pnl: number;
      trades: number;
    }
  > = {};

  for (const trade of trades) {
    const day = new Date(trade.openDate).getDate();

    if (!grouped[day]) {
      grouped[day] = {
        pnl: 0,
        trades: 0,
      };
    }

    grouped[day].pnl += trade.resultUsd || 0;
    grouped[day].trades += 1;
  }

  const monthName = new Date(year, month).toLocaleString("it-IT", {
    month: "long",
  });

  const previousMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const previousYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;

  const groupedDays = Object.entries(grouped).map(([day, data]) => ({
    day: Number(day),
    pnl: data.pnl,
    trades: data.trades,
  }));

  const totalMonthPnl = groupedDays.reduce(
    (acc, day) => acc + day.pnl,
    0
  );

  const totalMonthTrades = groupedDays.reduce(
    (acc, day) => acc + day.trades,
    0
  );

  const activeDays = groupedDays.length;

  const winDays = groupedDays.filter((day) => day.pnl > 0).length;
  const lossDays = groupedDays.filter((day) => day.pnl < 0).length;
  const flatDays = groupedDays.filter((day) => day.pnl === 0).length;

  const bestDay =
    groupedDays.length > 0
      ? Math.max(...groupedDays.map((day) => day.pnl))
      : 0;

  const worstDay =
    groupedDays.length > 0
      ? Math.min(...groupedDays.map((day) => day.pnl))
      : 0;

  const averageDailyPnl =
    activeDays > 0 ? totalMonthPnl / activeDays : 0;

  let currentStreak = 0;
  let currentStreakType: "WIN" | "LOSS" | "FLAT" | "-" = "-";
  let bestWinStreak = 0;
  let bestLossStreak = 0;
  let runningWinStreak = 0;
  let runningLossStreak = 0;

  for (let day = 1; day <= days; day++) {
    const pnl = grouped[day]?.pnl;

    if (pnl === undefined) {
      runningWinStreak = 0;
      runningLossStreak = 0;
      continue;
    }

    if (pnl > 0) {
      runningWinStreak += 1;
      runningLossStreak = 0;
      bestWinStreak = Math.max(bestWinStreak, runningWinStreak);
    } else if (pnl < 0) {
      runningLossStreak += 1;
      runningWinStreak = 0;
      bestLossStreak = Math.max(bestLossStreak, runningLossStreak);
    } else {
      runningWinStreak = 0;
      runningLossStreak = 0;
    }
  }

  for (let day = days; day >= 1; day--) {
    const pnl = grouped[day]?.pnl;

    if (pnl === undefined) {
      continue;
    }

    if (pnl > 0) {
      currentStreakType = "WIN";
    } else if (pnl < 0) {
      currentStreakType = "LOSS";
    } else {
      currentStreakType = "FLAT";
    }

    for (let innerDay = day; innerDay >= 1; innerDay--) {
      const innerPnl = grouped[innerDay]?.pnl;

      if (innerPnl === undefined) {
        break;
      }

      if (
        (currentStreakType === "WIN" && innerPnl > 0) ||
        (currentStreakType === "LOSS" && innerPnl < 0) ||
        (currentStreakType === "FLAT" && innerPnl === 0)
      ) {
        currentStreak += 1;
      } else {
        break;
      }
    }

    break;
  }

  const latestTrades = trades.slice(-5).reverse();

  const winDaysPercent =
    activeDays > 0 ? (winDays / activeDays) * 100 : 0;

  const lossDaysPercent =
    activeDays > 0 ? (lossDays / activeDays) * 100 : 0;

  const flatDaysPercent =
    activeDays > 0 ? (flatDays / activeDays) * 100 : 0;

  const statCards = [
    {
      label: "Profitto totale",
      value: formatCurrency(totalMonthPnl, account.currency),
      tone:
        totalMonthPnl >= 0
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: "Miglior giorno",
      value: formatCurrency(bestDay, account.currency),
      tone: "text-green-400",
    },
    {
      label: "Peggior giorno",
      value: formatCurrency(worstDay, account.currency),
      tone: "text-red-400",
    },
    {
      label: "Media giornaliera",
      value: formatCurrency(averageDailyPnl, account.currency),
      tone:
        averageDailyPnl >= 0
          ? "text-green-400"
          : "text-red-400",
    },
    {
      label: "Trade totali",
      value: totalMonthTrades,
      tone: "text-white",
    },
    {
      label: "Giorni attivi",
      value: activeDays,
      tone: "text-white",
    },
  ];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Performance calendario
          </p>

          <h1 className="text-3xl font-bold capitalize sm:text-4xl">
            {monthName} {year}
          </h1>
        </div>

        <div className="flex gap-3">
          <a
            href={`/accounts/${accountId}/calendar?month=${previousMonth}&year=${previousYear}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
          >
            ← Mese prima
          </a>

          <a
            href={`/accounts/${accountId}/calendar?month=${nextMonth}&year=${nextYear}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
          >
            Mese dopo →
          </a>
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
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Calendario mensile
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Performance per giorno
              </h2>
            </div>

            <div
              className={`rounded-2xl px-4 py-2 text-sm font-bold ${
                totalMonthPnl >= 0
                  ? "bg-green-500/10 text-green-400"
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {totalMonthPnl >= 0 ? "+" : ""}
              {formatCurrency(totalMonthPnl, account.currency)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-7">
            {Array.from({ length: days }).map((_, index) => {
              const day = index + 1;
              const data = grouped[day];

              const pnl = data?.pnl || 0;
              const tradeCount = data?.trades || 0;

              const positive = pnl > 0;
              const negative = pnl < 0;
              const hasTrades = tradeCount > 0;

              return (
                <div
                  key={day}
                  className={`min-h-[120px] rounded-2xl border p-4 ${
                    positive
                      ? "border-green-500/20 bg-green-500/10"
                      : negative
                      ? "border-red-500/20 bg-red-500/10"
                      : hasTrades
                      ? "border-yellow-500/20 bg-yellow-500/10"
                      : "border-white/10 bg-black/20"
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">
                      {day}
                    </h2>

                    <div
                      className={`h-2 w-2 rounded-full ${
                        positive
                          ? "bg-green-400"
                          : negative
                          ? "bg-red-400"
                          : hasTrades
                          ? "bg-yellow-400"
                          : "bg-gray-600"
                      }`}
                    />
                  </div>

                  <p
                    className={`text-sm font-semibold ${
                      positive
                        ? "text-green-400"
                        : negative
                        ? "text-red-400"
                        : hasTrades
                        ? "text-yellow-400"
                        : "text-gray-500"
                    }`}
                  >
                    {formatCurrency(pnl, account.currency)}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    {tradeCount} trade
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">
              Streak attuale
            </p>

            <h2
              className={`mt-2 text-4xl font-bold ${
                currentStreakType === "WIN"
                  ? "text-green-400"
                  : currentStreakType === "LOSS"
                  ? "text-red-400"
                  : currentStreakType === "FLAT"
                  ? "text-yellow-400"
                  : "text-white"
              }`}
            >
              {currentStreak} giorni
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Tipo: {currentStreakType}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">
              Streak massimo
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-green-500/10 p-4">
                <p className="text-xs text-gray-400">
                  Win streak
                </p>

                <h3 className="mt-1 text-2xl font-bold text-green-400">
                  {bestWinStreak}
                </h3>
              </div>

              <div className="rounded-2xl bg-red-500/10 p-4">
                <p className="text-xs text-gray-400">
                  Loss streak
                </p>

                <h3 className="mt-1 text-2xl font-bold text-red-400">
                  {bestLossStreak}
                </h3>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">
              Distribuzione giorni
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Win Days</span>
                  <span className="text-green-400">
                    {winDays} giorni
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-green-400"
                    style={{
                      width: `${winDaysPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Loss Days</span>
                  <span className="text-red-400">
                    {lossDays} giorni
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-red-400"
                    style={{
                      width: `${lossDaysPercent}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Flat Days</span>
                  <span className="text-yellow-400">
                    {flatDays} giorni
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{
                      width: `${flatDaysPercent}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-sm text-gray-400">
              Ultime operazioni
            </p>

            <div className="mt-4 space-y-3">
              {latestTrades.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nessuna operazione in questo mese.
                </p>
              ) : (
                latestTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between rounded-2xl bg-black/20 p-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {trade.symbol}
                      </p>

                      <p className="text-xs text-gray-500">
                        {new Date(
                          trade.openDate
                        ).toLocaleDateString("it-IT")}{" "}
                        · {trade.direction}
                      </p>
                    </div>

                    <p
                      className={`font-bold ${
                        (trade.resultUsd || 0) >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatCurrency(
                        trade.resultUsd || 0,
                        account.currency
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}