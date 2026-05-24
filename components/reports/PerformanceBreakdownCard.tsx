type Props = {
  wins: number;
  losses: number;
  breakEven: number;
  averageWin: number;
  averageLoss: number;
};

export default function PerformanceBreakdownCard({
  wins,
  losses,
  breakEven,
  averageWin,
  averageLoss,
}: Props) {
  return (
    <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          Performance Breakdown
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          Execution Summary
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Wins
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {wins}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Losses
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {losses}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Break Even
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {breakEven}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Avg Win
            </p>

            <h3 className="mt-3 text-3xl font-black text-green-400">
              ${averageWin.toFixed(0)}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Avg Loss
            </p>

            <h3 className="mt-3 text-3xl font-black text-red-400">
              ${averageLoss.toFixed(0)}
            </h3>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            AI Performance Insight
          </p>

          <h3 className="mt-3 text-xl font-black leading-relaxed text-white">
            {averageWin > Math.abs(averageLoss)
              ? "La struttura rischio/rendimento è positiva. Il trader mantiene un edge matematico favorevole."
              : "La struttura rischio/rendimento è fragile. Necessario migliorare gestione trade e qualità setup."}
          </h3>
        </div>
      </div>
    </div>
  );
}