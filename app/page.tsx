import { prisma } from "@/lib/prisma";
import EquityChart from "@/components/EquityChart";

function StatCard({
  label,
  value,
  color = "text-white",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
      <p className="text-sm text-gray-400">{label}</p>
      <p className={`mt-3 break-words text-2xl font-bold sm:text-3xl ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default async function Home() {
  const trades = await prisma.trade.findMany();

  const totalTrades = trades.length;

  const wins = trades.filter((trade) => trade.outcome === "win");
  const losses = trades.filter((trade) => trade.outcome === "loss");
  const breakEvens = trades.filter((trade) => trade.outcome === "be");

  const totalProfit = trades.reduce(
    (sum, trade) => sum + (trade.resultUsd ?? 0),
    0
  );

  const winRate = totalTrades > 0 ? (wins.length / totalTrades) * 100 : 0;

  const averageWin =
    wins.length > 0
      ? wins.reduce((sum, trade) => sum + (trade.resultUsd ?? 0), 0) /
        wins.length
      : 0;

  const averageLoss =
    losses.length > 0
      ? losses.reduce((sum, trade) => sum + (trade.resultUsd ?? 0), 0) /
        losses.length
      : 0;

  const maxDrawdown = Math.min(
    0,
    ...trades.map((trade) => trade.drawdownPercent ?? 0)
  );

  const equityData = trades
    .filter((trade) => trade.equity !== null)
    .sort((a, b) => a.openDate.getTime() - b.openDate.getTime())
    .map((trade) => ({
      date: trade.openDate.toLocaleDateString(),
      equity: trade.equity ?? 0,
    }));

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <p className="text-sm text-gray-400">Panoramica generale</p>
        <h2 className="text-3xl font-bold sm:text-4xl">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Profitto totale"
          value={`${totalProfit.toFixed(2)} $`}
          color={totalProfit >= 0 ? "text-green-400" : "text-red-400"}
        />

        <StatCard
          label="Win Rate"
          value={`${winRate.toFixed(1)}%`}
          color="text-green-400"
        />

        <StatCard label="Trades" value={totalTrades} />

        <StatCard
          label="Max Drawdown"
          value={`${maxDrawdown.toFixed(2)}%`}
          color="text-red-400"
        />

        <StatCard
          label="Wins"
          value={wins.length}
          color="text-green-400"
        />

        <StatCard
          label="Losses"
          value={losses.length}
          color="text-red-400"
        />

        <StatCard
          label="Break Even"
          value={breakEvens.length}
          color="text-yellow-400"
        />

        <StatCard
          label="Average Win"
          value={`${averageWin.toFixed(2)} $`}
          color="text-green-400"
        />

        <StatCard
          label="Average Loss"
          value={`${averageLoss.toFixed(2)} $`}
          color="text-red-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:p-5">
        <div className="mb-6">
          <p className="text-sm text-gray-400">Andamento conto</p>
          <h3 className="text-xl font-bold sm:text-2xl">Equity Curve</h3>
        </div>

        <EquityChart data={equityData} />
      </div>
    </div>
  );
}