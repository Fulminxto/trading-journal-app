type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  winRate: number;
  emotionalTrades: number;
  totalTrades: number;
};

export default function TraderIdentityReport({
  disciplineScore,
  behavioralRisk,
  winRate,
  emotionalTrades,
  totalTrades,
}: Props) {
  const emotionalRatio =
    totalTrades > 0
      ? emotionalTrades / totalTrades
      : 0;

  const identity =
    disciplineScore >= 80 &&
    behavioralRisk < 25 &&
    winRate >= 60
      ? "Structured Trader"
      : disciplineScore >= 60
      ? "Developing Trader"
      : emotionalRatio >= 0.4
      ? "Emotional Trader"
      : "Unstable Trader";

  const tone =
    identity === "Structured Trader"
      ? "text-green-400"
      : identity ===
          "Developing Trader"
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Trader Identity
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Identity Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Identity
            </p>

            <h3 className={`mt-4 text-2xl font-black ${tone}`}>
              {identity}
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

            <h3 className="mt-4 text-4xl font-black text-violet-400">
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
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Identity Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {identity}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {identity === "Structured Trader"
              ? "Il trader mostra struttura operativa stabile, controllo emotivo e processo ripetibile."
              : identity ===
                  "Developing Trader"
                ? "La struttura operativa è in crescita ma necessita consolidamento."
                : identity ===
                    "Emotional Trader"
                  ? "Le emozioni stanno influenzando significativamente il processo decisionale."
                  : "La struttura operativa mostra instabilità e mancanza di coerenza."}
          </p>
        </div>
      </div>
    </div>
  );
}
