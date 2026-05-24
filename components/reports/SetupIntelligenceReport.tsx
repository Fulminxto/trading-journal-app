type Props = {
  totalTrades: number;
  disciplineScore: number;
  averageWin: number;
 averageLoss: number;
  winRate: number;
};

export default function SetupIntelligenceReport({
  totalTrades,
  disciplineScore,
  averageWin,
  averageLoss,
  winRate,
}: Props) {
  const setupScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        disciplineScore * 0.4 +
          winRate * 0.4 +
          (averageWin >
          Math.abs(averageLoss)
            ? 20
            : 0)
      )
    )
  );

  const setupStatus =
    setupScore >= 80
      ? "Elite Setup Selection"
      : setupScore >= 60
      ? "Developing Setup Quality"
      : "Weak Setup Structure";

  const tone =
    setupStatus ===
    "Elite Setup Selection"
      ? "text-green-400"
      : setupStatus ===
        "Developing Setup Quality"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400">
          Setup Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Setup Quality Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Setup Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {setupScore}
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
              Avg Win
            </p>

            <h3 className="mt-4 text-4xl font-black text-green-400">
              ${averageWin.toFixed(0)}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Avg Loss
            </p>

            <h3 className="mt-4 text-4xl font-black text-red-400">
              ${averageLoss.toFixed(0)}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Setup Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {setupStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {setupStatus ===
            "Elite Setup Selection"
              ? "Il trader mostra alta qualità nella selezione dei setup e buona precisione operativa."
              : setupStatus ===
                "Developing Setup Quality"
              ? "La qualità dei setup è discreta ma ancora migliorabile."
              : "La struttura dei setup mostra instabilità e mancanza di selettività."}
          </p>
        </div>
      </div>
    </div>
  );
}