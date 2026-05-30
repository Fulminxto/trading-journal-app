type Props = {
  winRate: number;
  disciplineScore: number;
  behavioralRisk: number;
  totalPnl: number;
};

export default function PerformanceForecastReport({
  winRate,
  disciplineScore,
  behavioralRisk,
  totalPnl,
}: Props) {
  const forecast =
    winRate >= 60 &&
    disciplineScore >= 75 &&
    behavioralRisk < 25
      ? "High Growth Potential"
      : winRate >= 50 &&
        behavioralRisk < 40
      ? "Stable Development"
      : "Performance Instability";

  const forecastTone =
    forecast === "High Growth Potential"
      ? "text-green-400"
      : forecast ===
        "Stable Development"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Performance Forecast
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          AI Forecast Engine
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
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
                  : "text-green-400"
              }`}
            >
              {behavioralRisk}%
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Net PnL
            </p>

            <h3
              className={`mt-4 text-4xl font-black ${
                totalPnl >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ${totalPnl.toFixed(0)}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Forecast Assessment
          </p>

          <h3
            className={`mt-4 text-3xl font-black ${forecastTone}`}
          >
            {forecast}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {forecast === "High Growth Potential"
              ? "La struttura operativa suggerisce forte potenziale di crescita e scalabilità."
              : forecast ===
                "Stable Development"
              ? "Il trader sta costruendo una base operativa stabile ma ancora migliorabile."
              : "La struttura operativa mostra instabilità che potrebbe limitare la crescita futura."}
          </p>
        </div>
      </div>
    </div>
  );
}
