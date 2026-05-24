type Props = {
  disciplineScore: number;
  behavioralRisk: number;
  emotionalTrades: number;
  totalTrades: number;
};

export default function DisciplineIntelligenceReport({
  disciplineScore,
  behavioralRisk,
  emotionalTrades,
  totalTrades,
}: Props) {
  const emotionalRatio =
    totalTrades > 0
      ? emotionalTrades / totalTrades
      : 0;

  const disciplineStatus =
    disciplineScore >= 80 &&
    behavioralRisk < 25 &&
    emotionalRatio < 0.2
      ? "Elite Discipline"
      : disciplineScore >= 60
      ? "Developing Discipline"
      : "Discipline Instability";

  const tone =
    disciplineStatus === "Elite Discipline"
      ? "text-green-400"
      : disciplineStatus ===
        "Developing Discipline"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-400">
          Discipline Intelligence
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Discipline Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Discipline Score
            </p>

            <h3 className={`mt-4 text-4xl font-black ${tone}`}>
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
              Emotional Ratio
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {Math.round(emotionalRatio * 100)}%
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Status
            </p>

            <h3 className={`mt-4 text-2xl font-black ${tone}`}>
              {disciplineStatus}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Discipline Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${tone}`}>
            {disciplineStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {disciplineStatus ===
            "Elite Discipline"
              ? "Il trader mostra alta disciplina, controllo operativo e forte stabilità comportamentale."
              : disciplineStatus ===
                "Developing Discipline"
              ? "La disciplina operativa è in crescita ma ancora vulnerabile sotto pressione."
              : "La struttura disciplinare mostra instabilità e mancanza di controllo operativo."}
          </p>
        </div>
      </div>
    </div>
  );
}