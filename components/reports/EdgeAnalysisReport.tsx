type Props = {
  averageWin: number;
  averageLoss: number;
  winRate: number;
  disciplineScore: number;
};

export default function EdgeAnalysisReport({
  averageWin,
  averageLoss,
  winRate,
  disciplineScore,
}: Props) {
  const edgeScore =
    Math.round(
      winRate * 0.5 +
        disciplineScore * 0.3 +
        (averageWin >
        Math.abs(averageLoss)
          ? 20
          : 0)
    );

  const edgeStatus =
    edgeScore >= 80
      ? "Strong Edge"
      : edgeScore >= 60
      ? "Developing Edge"
      : "Weak Edge";

  const edgeTone =
    edgeStatus === "Strong Edge"
      ? "text-green-400"
      : edgeStatus ===
        "Developing Edge"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Edge Analysis
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          AI Edge Engine
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Edge Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${edgeTone}`}>
              {edgeScore}
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

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Win Rate
            </p>

            <h3 className="mt-4 text-4xl font-black text-violet-400">
              {winRate}%
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Edge Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${edgeTone}`}>
            {edgeStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {edgeStatus === "Strong Edge"
              ? "Il trader mostra una struttura profittevole con edge operativo riconoscibile."
              : edgeStatus ===
                "Developing Edge"
              ? "L'edge operativo è presente ma necessita più consistenza e stabilità."
              : "La struttura operativa non mostra ancora un edge sufficientemente stabile."}
          </p>
        </div>
      </div>
    </div>
  );
}