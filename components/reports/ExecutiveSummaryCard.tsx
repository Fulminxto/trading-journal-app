type Props = {
  totalPnl: number;
  winRate: number;
  disciplineScore: number;
  behavioralRisk: number;
};

export default function ExecutiveSummaryCard({
  totalPnl,
  winRate,
  disciplineScore,
  behavioralRisk,
}: Props) {
  const overallStatus =
    totalPnl >= 0 &&
    disciplineScore >= 70 &&
    behavioralRisk < 30
      ? "Strong Structure"
      : totalPnl >= 0
      ? "Developing Stability"
      : "Risk Exposure";

  const overallTone =
    overallStatus === "Strong Structure"
      ? "text-green-400"
      : overallStatus ===
        "Developing Stability"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#050b10] via-[#0d1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Executive Summary
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          AI Strategic Overview
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              PnL Status
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

            <h3 className="mt-4 text-4xl font-black text-violet-400">
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
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Executive Assessment
          </p>

          <h3
            className={`mt-4 text-3xl font-black ${overallTone}`}
          >
            {overallStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {overallStatus ===
            "Strong Structure"
              ? "Il trader mostra una struttura operativa solida, con buona disciplina, controllo comportamentale e consistenza."
              : overallStatus ===
                "Developing Stability"
              ? "La struttura operativa è in crescita, ma sono ancora presenti aree di instabilità da consolidare."
              : "La struttura operativa mostra fragilità comportamentali e rischio operativo elevato."}
          </p>
        </div>
      </div>
    </div>
  );
}