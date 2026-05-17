import { prisma } from "@/lib/prisma";
import EquityChart from "@/components/EquityChart";

export default async function EquityPage() {
  const trades = await prisma.trade.findMany({
    orderBy: [
      { openDate: "asc" },
      { id: "asc" },
    ],
  });

  const equityData = trades
    .filter((trade) => trade.equity !== null)
    .map((trade) => ({
      date: trade.openDate.toLocaleDateString(),
      equity: trade.equity ?? 0,
    }));

  const currentEquity =
    trades.length > 0 ? trades[trades.length - 1].equity ?? 0 : 0;

  const bestEquity = Math.max(
    0,
    ...trades.map((trade) => trade.equity ?? 0)
  );

  const maxDrawdown = Math.min(
    0,
    ...trades.map((trade) => trade.drawdownPercent ?? 0)
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-gray-400">Andamento conto</p>
        <h1 className="text-4xl font-bold">Equity Curve</h1>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">Equity attuale</p>
          <p className="mt-4 text-3xl font-bold text-green-400">
            {currentEquity.toFixed(2)} $
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">Equity Peak</p>
          <p className="mt-4 text-3xl font-bold text-green-400">
            {bestEquity.toFixed(2)} $
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-gray-400">Max Drawdown</p>
          <p className="mt-4 text-3xl font-bold text-red-400">
            {maxDrawdown.toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <EquityChart data={equityData} />
      </div>
    </div>
  );
}