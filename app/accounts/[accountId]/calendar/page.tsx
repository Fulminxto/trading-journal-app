import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  const account =
    membership.tradingAccount;

  const now = new Date();

  const month =
    query.month !== undefined
      ? Number(query.month)
      : now.getMonth();

  const year =
    query.year !== undefined
      ? Number(query.year)
      : now.getFullYear();

  const trades =
    await prisma.trade.findMany({
      where: {
        tradingAccountId:
          accountId,

        openDate: {
          gte: new Date(
            year,
            month,
            1
          ),

          lt: new Date(
            year,
            month + 1,
            1
          ),
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
      };
    }

    grouped[day].pnl +=
      trade.resultUsd || 0;

    grouped[day].trades += 1;
  }

  const monthName = new Date(
    year,
    month
  ).toLocaleString("it-IT", {
    month: "long",
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

  const totalMonthPnl =
    Object.values(grouped).reduce(
      (acc, day) =>
        acc + day.pnl,
      0
    );

  const totalMonthTrades =
    Object.values(grouped).reduce(
      (acc, day) =>
        acc + day.trades,
      0
    );

  const activeDays =
    Object.keys(grouped).length;

  const bestDay =
    Object.values(grouped).length >
    0
      ? Math.max(
          ...Object.values(
            grouped
          ).map(
            (day) => day.pnl
          )
        )
      : 0;

  const worstDay =
    Object.values(grouped).length >
    0
      ? Math.min(
          ...Object.values(
            grouped
          ).map(
            (day) => day.pnl
          )
        )
      : 0;

  const averageDailyPnl =
    activeDays > 0
      ? totalMonthPnl /
        activeDays
      : 0;

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

  return (
    <div>
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Trading calendar
          </p>

          <h1 className="mt-1 text-4xl font-bold capitalize">
            {monthName} {year}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={`/accounts/${accountId}/calendar?month=${previousMonth}&year=${previousYear}`}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl transition hover:bg-white/[0.08]"
          >
            ←
          </a>

          <a
            href={`/accounts/${accountId}/calendar?month=${nextMonth}&year=${nextYear}`}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl transition hover:bg-white/[0.08]"
          >
            →
          </a>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Monthly PnL
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              totalMonthPnl >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {formatCurrency(
              totalMonthPnl,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Active Days
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {activeDays}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Best Day
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-400">
            {formatCurrency(
              bestDay,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Average Daily
          </p>

          <h2
            className={`mt-2 text-3xl font-bold ${
              averageDailyPnl >= 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {formatCurrency(
              averageDailyPnl,
              account.currency
            )}
          </h2>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        <div className="grid grid-cols-7 border-b border-white/10">
          {weekdays.map((day) => (
            <div
              key={day}
              className="border-r border-white/10 p-4 text-center text-sm font-semibold text-gray-400 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {Array.from({
            length:
              adjustedFirstDay,
          }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="min-h-[140px] border-r border-b border-white/10 bg-black/10"
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

            const trades =
              data?.trades || 0;

            const positive =
              pnl > 0;

            const negative =
              pnl < 0;

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
                className={`min-h-[140px] border-r border-b border-white/10 p-3 transition last:border-r-0 ${
                  positive
                    ? "bg-green-500/10"
                    : negative
                    ? "bg-red-500/10"
                    : "bg-transparent"
                }`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                      isToday
                        ? "bg-white text-black"
                        : "bg-white/5 text-white"
                    }`}
                  >
                    {day}
                  </div>

                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      positive
                        ? "bg-green-400"
                        : negative
                        ? "bg-red-400"
                        : "bg-gray-500"
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <p
                    className={`text-sm font-bold ${
                      positive
                        ? "text-green-400"
                        : negative
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {formatCurrency(
                      pnl,
                      account.currency
                    )}
                  </p>

                  <p className="text-xs text-gray-500">
                    {trades} trades
                  </p>
                </div>
              </div>
            );
          })}
          {Array.from({
  length:
    (7 -
      ((adjustedFirstDay + days) %
        7)) %
    7,
}).map((_, index) => (
  <div
    key={`end-empty-${index}`}
    className="min-h-[140px] border-r border-b border-white/10 bg-black/10"
  />
))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Worst Day
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-400">
            {formatCurrency(
              worstDay,
              account.currency
            )}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm text-gray-400">
            Total Trades
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalMonthTrades}
          </h2>
        </div>
      </div>
    </div>
  );
}