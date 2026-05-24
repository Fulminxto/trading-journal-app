type Props = {
  weakExecutionTrades: number;
  totalTrades: number;
  disciplineScore: number;
  averageWin: number;
  averageLoss: number;
};

export default function ExecutionIntelligenceReport({
  weakExecutionTrades,
  totalTrades,
  disciplineScore,
  averageWin,
  averageLoss,
}: Props) {
  const executionRatio =
    totalTrades > 0
      ? weakExecutionTrades / totalTrades
      : 0;

  const executionScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        disciplineScore -
          executionRatio * 40 +
          (averageWin >
          Math.abs(averageLoss)
            ? 10
            : -10)
      )
    )
  );

  const executionStatus =
    executionScore >= 80
      ? "Elite Execution"
      : executionScore >= 60
      ? "Stable Execution"
      : "Execution Instability";

  const tone =
    executionStatus === "Elite Execution"
      ? "text-green-400"
      : executionStatus ===
        "Stable Execution"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">
          Execution Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Execution Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Execution Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {executionScore}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Weak Executions
            </p>

            <h3 className="mt-4 text-4xl font-black text-red-400">
              {weakExecutionTrades}
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
              Execution Ratio
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {Math.round(executionRatio * 100)}%
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Execution Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {executionStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {executionStatus ===
            "Elite Execution"
              ? "L'esecuzione operativa mostra alta qualità, controllo e ripetibilità."
              : executionStatus ===
                "Stable Execution"
              ? "La qualità esecutiva è discreta ma necessita maggiore consistenza."
              : "La struttura esecutiva mostra instabilità e vulnerabilità operative."}
          </p>
        </div>
      </div>
    </div>
  );
}