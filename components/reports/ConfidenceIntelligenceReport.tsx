type Props = {
  lowConfidenceTrades: number;
  totalTrades: number;
  disciplineScore: number;
  winRate: number;
};

export default function ConfidenceIntelligenceReport({
  lowConfidenceTrades,
  totalTrades,
  disciplineScore,
  winRate,
}: Props) {
  const confidenceRatio =
    totalTrades > 0
      ? lowConfidenceTrades / totalTrades
      : 0;

  const confidenceScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        disciplineScore * 0.5 +
          winRate * 0.3 +
          (1 - confidenceRatio) * 20
      )
    )
  );

  const confidenceStatus =
    confidenceScore >= 80
      ? "High Confidence Stability"
      : confidenceScore >= 60
      ? "Developing Confidence"
      : "Confidence Fragility";

  const tone =
    confidenceStatus ===
    "High Confidence Stability"
      ? "text-green-400"
      : confidenceStatus ===
        "Developing Confidence"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Confidence Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Confidence Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Confidence Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {confidenceScore}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Low Confidence
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Discipline
            </p>

            <h3 className="mt-4 text-4xl font-black text-green-400">
              {disciplineScore}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Win Rate
            </p>

            <h3 className="mt-4 text-4xl font-black text-violet-400">
              {winRate}%
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Confidence Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {confidenceStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {confidenceStatus ===
            "High Confidence Stability"
              ? "Il trader mostra sicurezza operativa stabile e fiducia coerente nel processo."
              : confidenceStatus ===
                "Developing Confidence"
              ? "La confidence operativa è in crescita ma ancora vulnerabile."
              : "La struttura mentale mostra instabilità e mancanza di fiducia nel processo."}
          </p>
        </div>
      </div>
    </div>
  );
}