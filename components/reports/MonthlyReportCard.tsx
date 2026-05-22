type Props = {
  totalTrades: number;
  totalPnl: number;
  winRate: number;
  emotionalTrades: number;
  disciplineScore: number;
};

export default function MonthlyReportCard({
  totalTrades,
  totalPnl,
  winRate,
  emotionalTrades,
  disciplineScore,
}: Props) {
  const pnlTone =
    totalPnl >= 0
      ? "text-green-400"
      : "text-red-400";

  const disciplineLabel =
    disciplineScore >= 80
      ? "Elite Discipline"
      : disciplineScore >= 60
      ? "Stable Discipline"
      : "Developing Discipline";

  const psychologyStatus =
    emotionalTrades >= 5
      ? "Psychological pressure detected"
      : "Psychological structure stable";

  return (
    <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0d1726] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          Monthly Intelligence
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          Monthly AI Report
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Trades
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {totalTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              PnL
            </p>

            <h3 className={`mt-3 text-4xl font-black ${pnlTone}`}>
              ${totalPnl.toFixed(0)}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Win Rate
            </p>

            <h3 className="mt-3 text-4xl font-black text-violet-400">
              {winRate}%
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Discipline
            </p>

            <h3 className="mt-3 text-2xl font-black text-green-400">
              {disciplineLabel}
            </h3>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Performance Summary
            </p>

            <h3 className="mt-3 text-xl font-black text-white">
              {totalPnl >= 0
                ? "Il trader ha mantenuto una struttura profittevole durante il mese."
                : "Il trader ha attraversato una fase di drawdown operativo."}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Psychology Summary
            </p>

            <h3 className="mt-3 text-xl font-black text-yellow-400">
              {psychologyStatus}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              AI Coaching Insight
            </p>

            <h3 className="mt-3 text-xl font-black text-cyan-400">
              VOLTIS suggerisce di
              mantenere focus sulla
              ripetibilità del processo
              e sulla stabilità psicologica.
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}