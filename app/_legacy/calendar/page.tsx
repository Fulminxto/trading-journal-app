import { prisma } from "@/lib/prisma";

function getMonthDays(year: number, month: number) {
  const days = [];
  const lastDay = new Date(year, month + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}

const monthNames = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

function StatCard({
  label,
  value,
  color = "text-gray-200",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-3 break-words text-xl font-bold sm:text-2xl ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    year?: string;
    day?: string;
  }>;
}) {
  const params = await searchParams;

  const currentDate = new Date();

  const month = Number(params.month) || currentDate.getMonth() + 1;
  const year = Number(params.year) || currentDate.getFullYear();
  const selectedDay = params.day ? Number(params.day) : null;

  const normalizedMonth = month - 1;

  const previousMonth = month === 1 ? 12 : month - 1;
  const previousYear = month === 1 ? year - 1 : year;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const trades = await prisma.trade.findMany({
    orderBy: {
      openDate: "asc",
    },
  });

  const monthlyTrades = trades.filter((trade) => {
    const tradeDate = new Date(trade.openDate);

    return (
      tradeDate.getMonth() === normalizedMonth &&
      tradeDate.getFullYear() === year
    );
  });

  const dailyPerformance = monthlyTrades.reduce<Record<string, number>>(
    (acc, trade) => {
      const tradeDate = new Date(trade.openDate);
      const dateKey = tradeDate.toISOString().split("T")[0];

      acc[dateKey] = (acc[dateKey] || 0) + (trade.resultUsd ?? 0);

      return acc;
    },
    {}
  );

  const selectedDateKey =
    selectedDay !== null
      ? new Date(year, normalizedMonth, selectedDay)
          .toISOString()
          .split("T")[0]
      : null;

  const selectedDayTrades = selectedDateKey
    ? monthlyTrades.filter(
        (trade) =>
          new Date(trade.openDate).toISOString().split("T")[0] ===
          selectedDateKey
      )
    : [];

  const selectedDayProfit = selectedDayTrades.reduce(
    (sum, trade) => sum + (trade.resultUsd ?? 0),
    0
  );

  const profits = Object.values(dailyPerformance);

  const monthlyProfit = profits.reduce((sum, value) => sum + value, 0);
  const bestDay = profits.length > 0 ? Math.max(...profits) : 0;
  const worstDay = profits.length > 0 ? Math.min(...profits) : 0;
  const dailyAverage = profits.length > 0 ? monthlyProfit / profits.length : 0;

  const winDays = profits.filter((p) => p > 0).length;
  const lossDays = profits.filter((p) => p < 0).length;

  const monthDays = getMonthDays(year, normalizedMonth);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-400">Performance mensile</p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            {monthNames[normalizedMonth]} {year}
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">
          <a
            href={`/calendar?month=${previousMonth}&year=${previousYear}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-center text-sm hover:bg-white/10 sm:text-base"
          >
            ← Prev
          </a>

          <a
            href={`/calendar?month=${nextMonth}&year=${nextYear}`}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-center text-sm hover:bg-white/10 sm:text-base"
          >
            Next →
          </a>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Profitto mese"
          value={`${monthlyProfit.toFixed(2)} $`}
          color={monthlyProfit >= 0 ? "text-green-400" : "text-red-400"}
        />

        <StatCard
          label="Best Day"
          value={`${bestDay.toFixed(2)} $`}
          color="text-green-400"
        />

        <StatCard
          label="Worst Day"
          value={`${worstDay.toFixed(2)} $`}
          color="text-red-400"
        />

        <StatCard
          label="Daily Average"
          value={`${dailyAverage.toFixed(2)} $`}
        />

        <StatCard
          label="Win Days"
          value={winDays}
          color="text-green-400"
        />

        <StatCard
          label="Loss Days"
          value={lossDays}
          color="text-red-400"
        />
      </div>

      <div className="mb-4 grid grid-cols-7 gap-1 text-center text-xs text-gray-400 sm:gap-3 sm:text-sm">
        <div>Lun</div>
        <div>Mar</div>
        <div>Mer</div>
        <div>Gio</div>
        <div>Ven</div>
        <div>Sab</div>
        <div>Dom</div>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-3">
        {Array.from({
          length: (monthDays[0].getDay() + 6) % 7,
        }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {monthDays.map((day) => {
          const dateKey = day.toISOString().split("T")[0];
          const profit = dailyPerformance[dateKey] || 0;
          const dayNumber = day.getDate();

          const isToday =
            day.getDate() === currentDate.getDate() &&
            day.getMonth() === currentDate.getMonth() &&
            day.getFullYear() === currentDate.getFullYear();

          const isSelected = selectedDay === dayNumber;

          return (
            <a
              key={dateKey}
              href={`/calendar?month=${month}&year=${year}&day=${dayNumber}`}
              className={`min-h-16 rounded-xl p-2 transition hover:scale-[1.02] sm:min-h-28 sm:rounded-2xl sm:p-4 ${
                profit > 0
                  ? "border border-green-500/20 bg-green-500/10"
                  : profit < 0
                  ? "border border-red-500/20 bg-red-500/10"
                  : "border border-white/10 bg-white/[0.03]"
              } ${
                isToday
                  ? "ring-2 ring-green-400 shadow-lg shadow-green-500/20"
                  : ""
              } ${isSelected ? "outline outline-2 outline-white/40" : ""}`}
            >
              <p className="text-xs text-gray-400 sm:text-sm">{dayNumber}</p>

              <p
                className={
                  profit > 0
                    ? "mt-3 text-[10px] font-bold leading-tight text-green-400 sm:mt-5 sm:text-xl"
                    : profit < 0
                    ? "mt-3 text-[10px] font-bold leading-tight text-red-400 sm:mt-5 sm:text-xl"
                    : "mt-3 text-[10px] font-bold leading-tight text-gray-500 sm:mt-5 sm:text-xl"
                }
              >
                {profit !== 0 ? `${profit.toFixed(0)}$` : "0$"}
              </p>
            </a>
          );
        })}
      </div>

      {selectedDay !== null && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-400">Operazioni del giorno</p>

              <h2 className="text-xl font-bold sm:text-2xl">
                {selectedDay} {monthNames[normalizedMonth]} {year}
              </h2>
            </div>

            <p
              className={
                selectedDayProfit >= 0
                  ? "text-2xl font-bold text-green-400"
                  : "text-2xl font-bold text-red-400"
              }
            >
              {selectedDayProfit.toFixed(2)} $
            </p>
          </div>

          {selectedDayTrades.length === 0 ? (
            <p className="text-gray-400">
              Nessuna operazione registrata in questo giorno.
            </p>
          ) : (
            <div className="space-y-3">
              {selectedDayTrades.map((trade) => (
                <div
                  key={trade.id}
                  className="flex flex-col gap-3 rounded-xl bg-zinc-900 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold">
                      {trade.symbol}{" "}
                      <span
                        className={
                          trade.direction === "LONG"
                            ? "text-green-400"
                            : "text-red-400"
                        }
                      >
                        {trade.direction}
                      </span>
                    </p>

                    <p className="text-sm text-gray-400">
                      {trade.openTime || "--:--"} ·{" "}
                      {trade.strategy || "No strategy"}
                    </p>
                  </div>

                  <p
                    className={
                      trade.resultUsd && trade.resultUsd < 0
                        ? "font-bold text-red-400"
                        : "font-bold text-green-400"
                    }
                  >
                    {trade.resultUsd ?? 0} $
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}