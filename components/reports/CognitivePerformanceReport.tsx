type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  lowConfidenceTrades: number;
  weakExecutionTrades: number;
  totalTrades: number;
};

export default function CognitivePerformanceReport({
  disciplineScore,
  behavioralRisk,
  lowConfidenceTrades,
  weakExecutionTrades,
  totalTrades,
}: Props) {
  const cognitiveLoad =
    totalTrades > 0
      ? (
          (lowConfidenceTrades +
            weakExecutionTrades) /
          totalTrades
        ) *
        100
      : 0;

  const cognitiveScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        disciplineScore -
          behavioralRisk * 0.4 -
          cognitiveLoad * 0.3
      )
    )
  );

  const cognitiveStatus =
    cognitiveScore >= 80
      ? "High Cognitive Clarity"
      : cognitiveScore >= 60
      ? "Moderate Cognitive Stability"
      : "Cognitive Instability";

  const tone =
    cognitiveStatus ===
    "High Cognitive Clarity"
      ? "text-green-400"
      : cognitiveStatus ===
        "Moderate Cognitive Stability"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400">
          Cognitive Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Cognitive Performance Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Cognitive Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
              {cognitiveScore}
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
              Low Confidence
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Weak Execution
            </p>

            <h3 className="mt-4 text-4xl font-black text-orange-400">
              {weakExecutionTrades}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Cognitive Load
            </p>

            <h3 className="mt-4 text-4xl font-black text-cyan-400">
              {Math.round(cognitiveLoad)}%
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Cognitive Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {cognitiveStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {cognitiveStatus ===
            "High Cognitive Clarity"
              ? "Il trader mantiene lucidità operativa, chiarezza decisionale e stabilità cognitiva."
              : cognitiveStatus ===
                  "Moderate Cognitive Stability"
                ? "La struttura cognitiva è discreta ma vulnerabile durante pressione operativa."
                : "La performance cognitiva mostra overload decisionale e instabilità mentale."}
          </p>
        </div>
      </div>
    </div>
  );
}
