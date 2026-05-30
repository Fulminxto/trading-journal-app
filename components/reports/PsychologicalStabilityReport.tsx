type Props = {
  emotionalTrades: number;
  totalTrades: number;
  behavioralRisk: number;
  disciplineScore: number;
};

export default function PsychologicalStabilityReport({
  emotionalTrades,
  totalTrades,
  behavioralRisk,
  disciplineScore,
}: Props) {
  const emotionalRatio =
    totalTrades > 0
      ? emotionalTrades / totalTrades
      : 0;

  const stability =
    emotionalRatio < 0.2 &&
    behavioralRisk < 25 &&
    disciplineScore >= 70
      ? "Stable Mindset"
      : emotionalRatio < 0.4
      ? "Moderate Stability"
      : "Psychological Fragility";

  const stabilityTone =
    stability === "Stable Mindset"
      ? "text-green-400"
      : stability === "Moderate Stability"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#120c08] via-[#171020] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
          Psychological Stability
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Psychology Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Emotional Trades
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Emotional Ratio
            </p>

            <h3 className="mt-4 text-4xl font-black text-cyan-400">
              {Math.round(emotionalRatio * 100)}%
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
                  : "text-green-400"
              }`}
            >
              {behavioralRisk}%
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Stability
            </p>

            <h3
              className={`mt-4 text-2xl font-black ${stabilityTone}`}
            >
              {stability}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Psychological Assessment
          </p>

          <h3
            className={`mt-4 text-3xl font-black ${stabilityTone}`}
          >
            {stability}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {stability === "Stable Mindset"
              ? "Il trader mantiene buona stabilità emotiva e controllo operativo."
              : stability === "Moderate Stability"
              ? "La stabilità psicologica è discreta ma ancora vulnerabile sotto pressione."
              : "La struttura psicologica mostra segnali di instabilità operativa ed emotiva."}
          </p>
        </div>
      </div>
    </div>
  );
}
