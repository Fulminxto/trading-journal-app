type Props = {
  emotionalTrades: number;
  totalTrades: number;
  behavioralRisk: number;
  disciplineScore: number;
};

export default function EmotionalIntelligenceReport({
  emotionalTrades,
  totalTrades,
  behavioralRisk,
  disciplineScore,
}: Props) {
  const emotionalRatio =
    totalTrades > 0
      ? emotionalTrades / totalTrades
      : 0;

  const emotionalScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        100 -
          emotionalRatio * 50 -
          behavioralRisk * 0.3 +
          disciplineScore * 0.2
      )
    )
  );

  const emotionalStatus =
    emotionalScore >= 80
      ? "Emotionally Stable"
      : emotionalScore >= 60
      ? "Moderate Emotional Stability"
      : "Emotional Instability";

  const tone =
    emotionalStatus ===
    "Emotionally Stable"
      ? "text-green-400"
      : emotionalStatus ===
        "Moderate Emotional Stability"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#120c08] via-[#171020] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
          Emotional Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Emotional Stability Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Emotional Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {emotionalScore}
            </h3>
          </div>

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
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Emotional Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {emotionalStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {emotionalStatus ===
            "Emotionally Stable"
              ? "Il trader mostra buona stabilità emotiva e controllo psicologico operativo."
              : emotionalStatus ===
                "Moderate Emotional Stability"
              ? "La stabilità emotiva è discreta ma vulnerabile durante pressione o drawdown."
              : "La struttura emotiva mostra instabilità e forte influenza psicologica sulle decisioni."}
          </p>
        </div>
      </div>
    </div>
  );
}
