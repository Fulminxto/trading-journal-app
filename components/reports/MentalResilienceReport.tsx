type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  emotionalTrades: number;
  losses: number;
  totalTrades: number;
};

export default function MentalResilienceReport({
  disciplineScore,
  behavioralRisk,
  emotionalTrades,
  losses,
  totalTrades,
}: Props) {
  const pressureRatio =
    totalTrades > 0
      ? (emotionalTrades + losses) /
        totalTrades
      : 0;

  const resilienceScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        disciplineScore -
          behavioralRisk * 0.3 -
          pressureRatio * 25
      )
    )
  );

  const resilienceStatus =
    resilienceScore >= 80
      ? "High Mental Resilience"
      : resilienceScore >= 60
      ? "Moderate Resilience"
      : "Mental Fragility";

  const tone =
    resilienceStatus ===
    "High Mental Resilience"
      ? "text-green-400"
      : resilienceStatus ===
        "Moderate Resilience"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#120c08] via-[#171020] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-yellow-400">
          Mental Resilience
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Resilience Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Resilience Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {resilienceScore}
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

            <h3 className="mt-4 text-4xl font-black text-red-400">
              {behavioralRisk}%
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
              Pressure Ratio
            </p>

            <h3 className="mt-4 text-4xl font-black text-cyan-400">
              {Math.round(pressureRatio * 100)}%
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Resilience Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {resilienceStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {resilienceStatus ===
            "High Mental Resilience"
              ? "Il trader mostra capacità di mantenere stabilità e lucidità anche sotto pressione."
              : resilienceStatus ===
                "Moderate Resilience"
              ? "La resilienza mentale è discreta ma vulnerabile durante drawdown o volatilità."
              : "La struttura mentale mostra fragilità operative sotto pressione emotiva e decisionale."}
          </p>
        </div>
      </div>
    </div>
  );
}