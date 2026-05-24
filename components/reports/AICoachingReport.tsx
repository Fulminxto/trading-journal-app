type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  winRate: number;
  emotionalTrades: number;
};

export default function AICoachingReport({
  disciplineScore,
  behavioralRisk,
  winRate,
  emotionalTrades,
}: Props) {
  const primaryFocus =
    disciplineScore < 60
      ? "Discipline & Execution"
      : behavioralRisk >= 30
      ? "Behavioral Stability"
      : winRate < 50
      ? "Setup Quality"
      : "Scaling Consistency";

  const coachingMessage =
    primaryFocus ===
    "Discipline & Execution"
      ? "Riduci overtrading, migliora review e aumenta la qualità media dei setup."
      : primaryFocus ===
        "Behavioral Stability"
      ? "Monitora impulsività, emotional trading e gestione psicologica."
      : primaryFocus ===
        "Setup Quality"
      ? "Concentrati solo sui setup ad alto edge e riduci esposizione inutile."
      : "La struttura è positiva. Ora il focus è mantenere consistenza e scalabilità.";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          AI Coaching Layer
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Coaching Report
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
              Emotional Trades
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            Primary Focus
          </p>

          <h3 className="mt-4 text-3xl font-black text-cyan-400">
            {primaryFocus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {coachingMessage}
          </p>
        </div>
      </div>
    </div>
  );
}