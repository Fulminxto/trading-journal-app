type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  winRate: number;
};

export default function GrowthRoadmapReport({
  disciplineScore,
  behavioralRisk,
  winRate,
}: Props) {
  const nextLevel =
    disciplineScore >= 80 &&
    winRate >= 60 &&
    behavioralRisk < 25
      ? "Scaling Phase"
      : disciplineScore >= 60
      ? "Stabilization Phase"
      : "Foundation Phase";

  const nextAction =
    nextLevel === "Scaling Phase"
      ? "Incrementare consistenza, proteggere edge e ottimizzare execution."
      : nextLevel ===
        "Stabilization Phase"
      ? "Ridurre variabilità emotiva e migliorare qualità media dei setup."
      : "Costruire disciplina, review process e routine operative solide.";

  const tone =
    nextLevel === "Scaling Phase"
      ? "text-green-400"
      : nextLevel ===
        "Stabilization Phase"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400">
          Growth Roadmap
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          AI Growth Engine
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
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
              Behavioral Risk
            </p>

            <h3
              className={`mt-4 text-4xl font-black ${
                behavioralRisk >= 50
                  ? "text-red-400"
                  : behavioralRisk >= 25
                  ? "text-yellow-400"
                  : "text-cyan-400"
              }`}
            >
              {behavioralRisk}%
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
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            Next Trader Phase
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {nextLevel}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {nextAction}
          </p>
        </div>
      </div>
    </div>
  );
}
