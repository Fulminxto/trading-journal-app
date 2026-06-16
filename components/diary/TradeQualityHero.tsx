import { normalizeAppLanguage } from "@/lib/i18n";

type Props = {
  totalTrades: number;
  averageExecution: number;
  averageConfidence: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  description: string;
  totalTrades: string;
  execution: string;
  confidence: string;
};

const labels: Record<string, Labels> = {
  it: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analizza qualità esecuzione, disciplina operativa, confidence e comportamento decisionale trade per trade.",
    totalTrades: "Trade totali",
    execution: "Execution",
    confidence: "Confidence",
  },
  en: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analyze execution quality, operational discipline, confidence and decision behavior trade by trade.",
    totalTrades: "Total Trades",
    execution: "Execution",
    confidence: "Confidence",
  },
  uk: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Аналізуй якість execution, операційну дисципліну, confidence та decision behavior по кожному trade.",
    totalTrades: "Усього угод",
    execution: "Execution",
    confidence: "Confidence",
  },
  ru: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Анализируй качество execution, операционную дисциплину, confidence и decision behavior по каждому trade.",
    totalTrades: "Всего сделок",
    execution: "Execution",
    confidence: "Confidence",
  },
  es: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analiza calidad de ejecución, disciplina operativa, confidence y comportamiento decisional trade por trade.",
    totalTrades: "Trades totales",
    execution: "Execution",
    confidence: "Confidence",
  },
  fr: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analyse la qualité d’exécution, la discipline opérationnelle, la confidence et le comportement décisionnel trade par trade.",
    totalTrades: "Trades totaux",
    execution: "Execution",
    confidence: "Confidence",
  },
  de: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analysiere Execution-Qualität, operative Disziplin, Confidence und Entscheidungsverhalten Trade für Trade.",
    totalTrades: "Trades gesamt",
    execution: "Execution",
    confidence: "Confidence",
  },
};

export default function TradeQualityHero({
  totalTrades,
  averageExecution,
  averageConfidence,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-accent-bright/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-accent-bright)_10%,transparent),transparent_35%)]" />

      <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent-bright/20 bg-accent-bright/10 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-accent-bright" />

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-bright">
              {t.eyebrow}
            </p>
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight break-words text-white sm:text-5xl xl:text-7xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 xl:text-lg">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:min-w-[420px]">
          <div className="rounded-3xl border border-accent-bright/10 bg-accent-bright/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.totalTrades}
            </p>

            <h2 className="mt-3 text-4xl font-black text-accent-bright">
              {totalTrades}
            </h2>
          </div>

          <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.execution}
            </p>

            <h2 className="mt-3 text-4xl font-black text-violet-400">
              {averageExecution}/10
            </h2>
          </div>

          <div className="rounded-3xl border border-accent/10 bg-accent/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.confidence}
            </p>

            <h2 className="mt-3 text-4xl font-black text-accent">
              {averageConfidence}/10
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

