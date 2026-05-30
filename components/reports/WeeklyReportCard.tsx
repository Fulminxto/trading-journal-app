type Props = {
  totalTrades: number;
  totalPnl: number;
  winRate: number;
};

export default function WeeklyReportCard({
  totalTrades,
  totalPnl,
  winRate,
}: Props) {
  const performanceText =
    totalPnl >= 0
      ? "Settimana positiva. Il processo sta producendo risultati favorevoli."
      : "Settimana negativa. Serve ridurre esposizione e migliorare qualità esecutiva.";

  const consistencyText =
    winRate >= 50
      ? "La consistenza è sopra la soglia base."
      : "La consistenza è sotto soglia. Focus su setup migliori e gestione emotiva.";

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
        Weekly Intelligence
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        Weekly Report
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">Trades</p>
          <h3 className="mt-3 text-4xl font-black text-cyan-400">
            {totalTrades}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">PnL</p>
          <h3 className="mt-3 text-4xl font-black text-green-400">
            ${totalPnl.toFixed(0)}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">Win Rate</p>
          <h3 className="mt-3 text-4xl font-black text-violet-400">
            {winRate}%
          </h3>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">Performance</p>
          <h3 className="mt-3 text-xl font-black text-white">
            {performanceText}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">Consistency</p>
          <h3 className="mt-3 text-xl font-black text-cyan-400">
            {consistencyText}
          </h3>
        </div>
      </div>
    </div>
  );
}
