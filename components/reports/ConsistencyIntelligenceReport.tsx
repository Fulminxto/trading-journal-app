type Props = {
  disciplineScore: number;
  winRate: number;
  totalTrades: number;
  emotionalTrades: number;
};

export default function ConsistencyIntelligenceReport({
  disciplineScore,
  winRate,
  totalTrades,
  emotionalTrades,
}: Props) {
  const emotionalRatio =
    totalTrades > 0
      ? emotionalTrades / totalTrades
      : 0;

  const consistencyLevel =
    disciplineScore >= 80 &&
    winRate >= 60 &&
    emotionalRatio < 0.2
      ? "Elite Consistency"
      : disciplineScore >= 60 &&
        winRate >= 50
      ? "Developing Consistency"
      : "Inconsistent Structure";

  const consistencyTone =
    consistencyLevel ===
    "Elite Consistency"
      ? "text-green-400"
      : consistencyLevel ===
        "Developing Consistency"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Consistency Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Consistency Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
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

            <h3 className="mt-4 text-4xl font-black text-cyan-400">
              {winRate}%
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Emotional Ratio
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {Math.round(emotionalRatio * 100)}%
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Structure
            </p>

            <h3
              className={`mt-4 text-2xl font-black ${consistencyTone}`}
            >
              {consistencyLevel}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Consistency Assessment
          </p>

          <h3
            className={`mt-4 text-3xl font-black ${consistencyTone}`}
          >
            {consistencyLevel}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {consistencyLevel ===
            "Elite Consistency"
              ? "Il trader mostra una struttura operativa stabile e ripetibile."
              : consistencyLevel ===
                "Developing Consistency"
              ? "La consistenza è in crescita ma necessita consolidamento."
              : "La struttura operativa mostra instabilità e variabilità elevata."}
          </p>
        </div>
      </div>
    </div>
  );
}
