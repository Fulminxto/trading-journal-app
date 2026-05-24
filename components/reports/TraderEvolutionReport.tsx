type Props = {
  disciplineScore: number;
  winRate: number;
  emotionalTrades: number;
  totalTrades: number;
};

export default function TraderEvolutionReport({
  disciplineScore,
  winRate,
  emotionalTrades,
  totalTrades,
}: Props) {
  const maturity =
    disciplineScore >= 80
      ? "Advanced Trader"
      : disciplineScore >= 60
      ? "Developing Consistency"
      : "Early Stage Trader";

  const psychologyHealth =
    emotionalTrades <= totalTrades * 0.2
      ? "Stable"
      : emotionalTrades <= totalTrades * 0.4
      ? "Watchlist"
      : "Unstable";

  const psychologyTone =
    psychologyHealth === "Stable"
      ? "text-green-400"
      : psychologyHealth === "Watchlist"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b0f1a] via-[#111827] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-violet-400">
          Trader Evolution
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          Evolution Report
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Discipline
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {disciplineScore}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Win Rate
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {winRate}%
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Trader Stage
            </p>

            <h3 className="mt-3 text-2xl font-black text-violet-400">
              {maturity}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Psychology
            </p>

            <h3 className={`mt-3 text-2xl font-black ${psychologyTone}`}>
              {psychologyHealth}
            </h3>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            AI Evolution Insight
          </p>

          <h3 className="mt-3 text-xl font-black leading-relaxed text-white">
            {disciplineScore >= 80
              ? "Il trader sta costruendo una struttura operativa avanzata con buona stabilità comportamentale."
              : disciplineScore >= 60
              ? "La crescita è positiva, ma serve più consistenza nella qualità esecutiva."
              : "La priorità è costruire disciplina, routine e ripetibilità del processo."}
          </h3>
        </div>
      </div>
    </div>
  );
}