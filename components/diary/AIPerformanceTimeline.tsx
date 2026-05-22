type Props = {
  totalTrades: number;
  highQualityTrades: number;
  weakExecutionTrades: number;
  disciplineScore: number;
};

export default function AIPerformanceTimeline({
  totalTrades,
  highQualityTrades,
  weakExecutionTrades,
  disciplineScore,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          AI Performance Timeline
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Trader Evolution
        </h2>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Phase 1 — Data Foundation
            </p>

            <h3 className="mt-2 text-xl font-black text-cyan-400">
              {totalTrades > 0
                ? "Journal active"
                : "Waiting for trade data"}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Phase 2 — Execution Quality
            </p>

            <h3 className="mt-2 text-xl font-black text-green-400">
              {highQualityTrades > weakExecutionTrades
                ? "Quality improving"
                : "Execution needs refinement"}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Phase 3 — Discipline Maturity
            </p>

            <h3 className="mt-2 text-xl font-black text-violet-400">
              {disciplineScore >= 70
                ? "Discipline becoming stable"
                : "Discipline still developing"}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS interpreta i dati del
          journal come una timeline di
          crescita, mostrando come il
          trader evolve in qualità,
          disciplina ed esecuzione.
        </p>
      </div>
    </div>
  );
}