type Props = {
  disciplineScore: number;
  traderType: string;
  weakness: string;
  weakExecutionTrades: number;
  emotionalTrades: number;
};

export default function AdaptiveCoachingLayer({
  disciplineScore,
  traderType,
  weakness,
  weakExecutionTrades,
  emotionalTrades,
}: Props) {
  const mainAdvice =
    disciplineScore >= 80
      ? "Continua a proteggere il tuo processo. Il focus ora è scalare senza perdere disciplina."
      : disciplineScore >= 60
      ? "La base è buona, ma serve più costanza. Concentrati su qualità setup e review post-trade."
      : "Riduci complessità e rischio. Prima di aumentare performance, stabilizza esecuzione e disciplina.";

  const warning =
    weakExecutionTrades > 2
      ? "Hai diverse esecuzioni deboli: evita trade non pianificati e aumenta il filtro prima dell’ingresso."
      : emotionalTrades > 2
      ? "La componente emotiva è presente: monitora impulsività, FOMO e revenge trading."
      : "Nessun warning critico rilevato. Continua a rispettare il processo.";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#071014] via-[#0b1720] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Adaptive Coaching
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          VOLTIS Coach Layer
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 xl:col-span-2">
            <p className="text-sm text-gray-400">
              Main Guidance
            </p>

            <h3 className="mt-3 text-xl font-black text-cyan-400">
              {mainAdvice}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Trader Profile
            </p>

            <h3 className="mt-3 text-xl font-black text-violet-400">
              {traderType}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Current Weakness
            </p>

            <h3 className="mt-3 text-xl font-black text-red-400">
              {weakness}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5 xl:col-span-2">
            <p className="text-sm text-gray-400">
              Warning
            </p>

            <h3 className="mt-3 text-xl font-black text-yellow-400">
              {warning}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          Il coaching layer usa disciplina,
          qualità esecutiva, stato emotivo
          e profilo operativo per generare
          feedback contestuale.
        </p>
      </div>
    </div>
  );
}
