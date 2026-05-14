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

  const now = new Date();

  const month =
    Number(query.month) ||
    now.getMonth();

  const year =
    Number(query.year) ||
    now.getFullYear();

  const trades = await prisma.trade.findMany({
    where: {
      tradingAccountId: accountId,

      openDate: {
        gte: new Date(year, month, 1),
        lt: new Date(year, month + 1, 1),
      },
    },
  });

  const days = getDaysInMonth(
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
    month === 0 ? 11 : month - 1;

  const nextMonth =
    month === 11 ? 0 : month + 1;

  const previousYear =
    month === 0 ? year - 1 : year;

  const nextYear =
    month === 11 ? year + 1 : year;

  const totalMonthPnl = Object.values(
    grouped
  ).reduce(
    (acc, day) => acc + day.pnl,
    0
  );

  const totalMonthTrades =
    Object.values(grouped).reduce(
      (acc, day) => acc + day.trades,
      0
    );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">
            Performance calendario
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            {monthName} {year}
          </h1>
        </div>

        <div className="flex gap-3">
          <a
            href={`/accounts/${accountId}/calendar?month=${previousMonth}&year=${previousYear}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
          >
            ←
          </a>

          <a
            href={`/accounts/${accountId}/calendar?month=${nextMonth}&year=${nextYear}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 hover:bg-white/[0.06]"
          >
            →
          </a>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
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
            {totalMonthPnl.toFixed(2)}{" "}
            {
              membership.tradingAccount
                .currency
            }
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Total Trades
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {totalMonthTrades}
          </h2>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">
            Active Days
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {
              Object.keys(grouped)
                .length
            }
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-7">
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

          return (
            <div
              key={day}
              className={`rounded-2xl border p-4 ${
                positive
                  ? "border-green-500/20 bg-green-500/10"
                  : negative
                  ? "border-red-500/20 bg-red-500/10"
                  : "border-white/10 bg-white/[0.03]"
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
                      : "bg-gray-500"
                  }`}
                />
              </div>

              <p
                className={`text-sm font-semibold ${
                  positive
                    ? "text-green-400"
                    : negative
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {pnl.toFixed(2)}{" "}
                {
                  membership
                    .tradingAccount
                    .currency
                }
              </p>

              <p className="mt-2 text-xs text-gray-500">
                {trades} trade
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}