type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  winRate: number;
  emotionalTrades: number;
};

export default function DecisionQualityReport({
  disciplineScore,
  behavioralRisk,
  winRate,
  emotionalTrades,
}: Props) {
  const decisionScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        disciplineScore * 0.5 +
          winRate * 0.3 +
          (100 - behavioralRisk) * 0.2
      )
    )
  );

  const decisionStatus =
    decisionScore >= 80
      ? "High Decision Quality"
      : decisionScore >= 60
      ? "Developing Decision Process"
      : "Unstable Decision Process";

  const tone =
    decisionStatus ===
    "High Decision Quality"
      ? "text-green-400"
      : decisionStatus ===
        "Developing Decision Process"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Decision Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Decision Quality Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Decision Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {decisionScore}
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
              Emotional Trades
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Decision Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {decisionStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {decisionStatus ===
            "High Decision Quality"
              ? "Il trader mostra una struttura decisionale disciplinata e stabile."
              : decisionStatus ===
                "Developing Decision Process"
              ? "La qualità decisionale è in crescita ma ancora vulnerabile sotto pressione."
              : "La struttura decisionale mostra instabilità e rischio comportamentale elevato."}
          </p>
        </div>
      </div>
    </div>
  );
}
