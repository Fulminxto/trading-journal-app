import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Flame,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function getDaysInMonth(
  year: number,
  month: number
) {
  return new Date(
    year,
    month + 1,
    0
  ).getDate();
}

function getCurrencySymbol(
  currency: string
) {
  const normalized =
    currency.toUpperCase();

  if (
    normalized === "USD" ||
    normalized === "USDT" ||
    normalized === "USDC"
  ) {
    return "$";
  }

  if (normalized === "EUR") {
    return "€";
  }

  if (normalized === "GBP") {
    return "£";
  }

  return currency;
}

function formatCurrency(
  value: number,
  currency: string
) {
  const symbol =
    getCurrencySymbol(currency);

  return `${symbol}${value.toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 1,
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

function getMonthIndex(value: string | undefined) {
  if (value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (
    Number.isNaN(parsed) ||
    parsed < 0 ||
    parsed > 11
  ) {
    return null;
  }

  return parsed;
}

function getYearValue(value: string | undefined) {
  if (value === undefined) {
    return null;
  }

  const parsed = Number(value);

  if (
    Number.isNaN(parsed) ||
    parsed < 2000 ||
    parsed > 2100
  ) {
    return null;
  }

  return parsed;
}

function StatCard({
  label,
  value,
  description,
  tone = "text-white",
}: {
  label: string;
  value: string | number;
  description: string;
  tone?: string;
}) {
  return (
    <div className="card-hover rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-gray-400">
        {label}
      </p>

      <h2 className={`mt-3 text-3xl font-black ${tone}`}>
        {value}
      </h2>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {description}
      </p>
    </div>
  );
}

export default async function CalendarPage({
  params,
  searchParams,
}: {
  params: Promise<{
    accountId: string;
  }>;

  searchParams: Promise<{
    month?: string;
    year?: string;
  }>;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { accountId } =
    await params;

  const query =
    await searchParams;

  const membership =
    await prisma.accountMember.findFirst(
      {
        where: {
          userId:
            session.user.id,
          tradingAccountId:
            accountId,
        },

        include: {
          tradingAccount: true,
        },
      }
    );

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

  const account =
    membership.tradingAccount;

  const now = new Date();

  const requestedMonth =
    getMonthIndex(query.month);

  const requestedYear =
    getYearValue(query.year);

  const month =
    requestedMonth !== null
      ? requestedMonth
      : now.getMonth();

  const year =
    requestedYear !== null
      ? requestedYear
      : now.getFullYear();

  const currency =
    account.currency || "USD";

  const monthStart = new Date(
    year,
    month,
    1
  );

  const monthEnd = new Date(
    year,
    month + 1,
    1
  );

  const trades =
    await prisma.trade.findMany({
      where: {
        tradingAccountId:
          accountId,

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

  const days =
    getDaysInMonth(
      year,
      month
    );

  const grouped: Record<
    number,
    {
      pnl: number;
      trades: number;
      wins: number;
      losses: number;
      be: number;
    }
  > = {};

  for (const trade of trades) {
    const day = new Date(
      trade.openDate
    ).getDate();

    if (!grouped[day]) {
      grouped[day] = {
        pnl: 0,
        trades: 0,
        wins: 0,
        losses: 0,
        be: 0,
      };
    }

    grouped[day].pnl +=
      trade.resultUsd || 0;

    grouped[day].trades += 1;

    if (trade.outcome === "win") {
      grouped[day].wins += 1;
    }

    if (trade.outcome === "loss") {
      grouped[day].losses += 1;
    }

    if (trade.outcome === "be") {
      grouped[day].be += 1;
    }
  }

  const monthName = new Date(
    year,
    month
  ).toLocaleString("it-IT", {
    month: "long",
  });

  const monthLabel = new Date(
    year,
    month
  ).toLocaleString("it-IT", {
    month: "long",
    year: "numeric",
  });

  const previousMonth =
    month === 0
      ? 11
      : month - 1;

  const nextMonth =
    month === 11
      ? 0
      : month + 1;

  const previousYear =
    month === 0
      ? year - 1
      : year;

  const nextYear =
    month === 11
      ? year + 1
      : year;

  const groupedDays =
    Object.values(grouped);

  const totalMonthPnl =
    groupedDays.reduce(
      (acc, day) =>
        acc + day.pnl,
      0
    );

  const totalMonthTrades =
    groupedDays.reduce(
      (acc, day) =>
        acc + day.trades,
      0
    );

  const activeDays =
    groupedDays.length;

  const positiveDays =
    groupedDays.filter(
      (day) => day.pnl > 0
    ).length;

  const negativeDays =
    groupedDays.filter(
      (day) => day.pnl < 0
    ).length;

  const flatDays =
    groupedDays.filter(
      (day) => day.pnl === 0
    ).length;

  const bestDay =
    groupedDays.length > 0
      ? Math.max(
        ...groupedDays.map(
          (day) => day.pnl
        )
      )
      : 0;

  const worstDay =
    groupedDays.length > 0
      ? Math.min(
        ...groupedDays.map(
          (day) => day.pnl
        )
      )
      : 0;

  const averageDailyPnl =
    activeDays > 0
      ? totalMonthPnl /
      activeDays
      : 0;

  const averageTradesPerActiveDay =
    activeDays > 0
      ? totalMonthTrades /
      activeDays
      : 0;

  const bestDayEntry =
    Object.entries(grouped).sort(
      (a, b) => b[1].pnl - a[1].pnl
    )[0];

  const worstDayEntry =
    Object.entries(grouped).sort(
      (a, b) => a[1].pnl - b[1].pnl
    )[0];

  const bestDayLabel =
    bestDayEntry
      ? `${bestDayEntry[0]} ${monthName}`
      : "-";

  const worstDayLabel =
    worstDayEntry
      ? `${worstDayEntry[0]} ${monthName}`
      : "-";

  const weekdays = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ];

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();

  const adjustedFirstDay =
    firstDay === 0
      ? 6
      : firstDay - 1;

  const endEmptyDays =
    (7 -
      ((adjustedFirstDay + days) %
        7)) %
    7;

  const isCurrentMonth =
    now.getMonth() === month &&
    now.getFullYear() === year;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.08),transparent_35%)]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-green-300">
                Trading calendar
              </span>

              <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-gray-300">
                {account.name}
              </span>

              {isCurrentMonth && (
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Current month
                </span>
              )}
            </div>

            <p className="text-sm text-gray-400">
              Monthly performance view
            </p>

            <h1 className="mt-3 text-5xl font-black capitalize tracking-tight text-white sm:text-6xl">
              {monthLabel}
            </h1>

            <p className="mt-6 max-w-3xl text-base leading-7 text-gray-400">
              A day-by-day view of performance, trading
              activity and monthly consistency. Use it to
              spot strong days, weak days and periods where
              discipline needs more attention.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/accounts/${accountId}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white transition hover:bg-white/[0.08]"
            >
              Back to Account Hub
            </Link>

            <div className="flex items-center gap-3">
              <Link
                href={`/accounts/${accountId}/calendar?month=${previousMonth}&year=${previousYear}`}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                aria-label="Previous month"
              >
                <ChevronLeft size={20} />
              </Link>

              <Link
                href={`/accounts/${accountId}/calendar?month=${nextMonth}&year=${nextYear}`}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white transition hover:bg-white/[0.08]"
                aria-label="Next month"
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Monthly PnL"
          value={formatCurrency(
            totalMonthPnl,
            currency
          )}
          description={`${activeDays} active days · ${totalMonthTrades} trades`}
          tone={getResultTone(totalMonthPnl)}
        />

        <StatCard
          label="Average Daily"
          value={formatCurrency(
            averageDailyPnl,
            currency
          )}
          description="Average PnL only across active trading days."
          tone={getResultTone(averageDailyPnl)}
        />

        <StatCard
          label="Best Day"
          value={formatCurrency(
            bestDay,
            currency
          )}
          description={bestDayLabel}
          tone="text-green-400"
        />

        <StatCard
          label="Worst Day"
          value={formatCurrency(
            worstDay,
            currency
          )}
          description={worstDayLabel}
          tone="text-red-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-green-400" size={21} />
            <p className="text-sm text-gray-400">
              Positive Days
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-green-400">
            {positiveDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <TrendingDown className="text-red-400" size={21} />
            <p className="text-sm text-gray-400">
              Negative Days
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-red-400">
            {negativeDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Minus className="text-yellow-300" size={21} />
            <p className="text-sm text-gray-400">
              Flat Days
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-yellow-300">
            {flatDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <Flame className="text-cyan-300" size={21} />
            <p className="text-sm text-gray-400">
              Avg Trades / Active Day
            </p>
          </div>

          <h2 className="mt-4 text-3xl font-black text-cyan-300">
            {formatNumber(
              averageTradesPerActiveDay
            )}
          </h2>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-gray-400">
              Calendar matrix
            </p>

            <h2 className="mt-1 text-3xl font-black capitalize text-white">
              {monthName} performance
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
            <div className="flex items-center gap-2">
              <CircleDot size={14} className="text-green-400" />
              Profit
            </div>

            <div className="flex items-center gap-2">
              <CircleDot size={14} className="text-red-400" />
              Loss
            </div>

            <div className="flex items-center gap-2">
              <CircleDot size={14} className="text-gray-500" />
              No result
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[840px] overflow-hidden rounded-3xl border border-white/10">
            <div className="grid grid-cols-7 border-b border-white/10 bg-black/20">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="border-r border-white/10 p-4 text-center text-sm font-black uppercase tracking-[0.14em] text-gray-500 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 bg-black/10">
              {Array.from({
                length:
                  adjustedFirstDay,
              }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="min-h-[150px] border-r border-b border-white/10 bg-black/20"
                />
              ))}

              {Array.from({
                length: days,
              }).map((_, index) => {
                const day = index + 1;

                const data =
                  grouped[day];

                const pnl =
                  data?.pnl || 0;

                const tradesCount =
                  data?.trades || 0;

                const positive =
                  pnl > 0;

                const negative =
                  pnl < 0;

                const intensity =
                  Math.min(
                    Math.abs(pnl) / 500,
                    1
                  );

                const isToday =
                  now.getDate() ===
                  day &&
                  now.getMonth() ===
                  month &&
                  now.getFullYear() ===
                  year;

                return (
                  <div
                    key={day}
                    className={`group relative min-h-[150px] border-r border-b border-white/10 p-4 transition-all duration-300 last:border-r-0 hover:z-10 hover:scale-[1.02] ${positive
                        ? "bg-green-500/10"
                        : negative
                          ? "bg-red-500/10"
                          : "bg-transparent"
                      }`}
                    style={{
                      backgroundColor: positive
                        ? `rgba(34,197,94,${0.06 +
                        intensity * 0.18
                        })`
                        : negative
                          ? `rgba(239,68,68,${0.06 +
                          intensity * 0.18
                          })`
                          : undefined,
                    }}
                  >
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-0 blur-2xl transition duration-500 group-hover:opacity-100 ${positive
                          ? "bg-green-500/10"
                          : negative
                            ? "bg-red-500/10"
                            : "bg-white/5"
                        }`}
                    />

                    <div className="relative mb-5 flex items-center justify-between">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${isToday
                            ? "bg-white text-black"
                            : "bg-white/5 text-white"
                          }`}
                      >
                        {day}
                      </div>

                      <div
                        className={`h-2.5 w-2.5 rounded-full ${positive
                            ? "bg-green-400"
                            : negative
                              ? "bg-red-400"
                              : "bg-gray-500"
                          }`}
                      />
                    </div>

                    <div className="relative space-y-2">
                      <p
                        className={`text-sm font-black ${positive
                            ? "text-green-400"
                            : negative
                              ? "text-red-400"
                              : "text-gray-400"
                          }`}
                      >
                        {formatCurrency(
                          pnl,
                          currency
                        )}
                      </p>

                      <p className="text-xs text-gray-500">
                        {tradesCount} trades
                      </p>

                      {data && (
                        <p className="text-xs text-gray-600">
                          {data.wins}W / {data.losses}L / {data.be}BE
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {Array.from({
                length: endEmptyDays,
              }).map((_, index) => (
                <div
                  key={`end-empty-${index}`}
                  className="min-h-[150px] border-r border-b border-white/10 bg-black/20"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="text-cyan-300" size={22} />

          <div>
            <p className="text-sm text-gray-400">
              Monthly summary
            </p>

            <h2 className="text-2xl font-black text-white">
              What this month shows
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Activity
            </p>

            <h3 className="mt-3 text-3xl font-black text-white">
              {activeDays}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Days with at least one recorded trade.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Direction
            </p>

            <h3 className={`mt-3 text-3xl font-black ${getResultTone(totalMonthPnl)}`}>
              {totalMonthPnl > 0
                ? "Positive"
                : totalMonthPnl < 0
                  ? "Negative"
                  : "Flat"}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Based on total monthly PnL.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Total Trades
            </p>

            <h3 className="mt-3 text-3xl font-black text-cyan-300">
              {totalMonthTrades}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Total operations opened during this month.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
