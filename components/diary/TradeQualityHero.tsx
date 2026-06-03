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
      "Analizza qualitÃ  esecuzione, disciplina operativa, confidence e comportamento decisionale trade per trade.",
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
      "ÐÐ½Ð°Ð»Ñ–Ð·ÑƒÐ¹ ÑÐºÑ–ÑÑ‚ÑŒ execution, Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ñƒ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ñ–Ð½Ñƒ, confidence Ñ‚Ð° decision behavior Ð¿Ð¾ ÐºÐ¾Ð¶Ð½Ð¾Ð¼Ñƒ trade.",
    totalTrades: "Ð£ÑÑŒÐ¾Ð³Ð¾ ÑƒÐ³Ð¾Ð´",
    execution: "Execution",
    confidence: "Confidence",
  },
  ru: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "ÐÐ½Ð°Ð»Ð¸Ð·Ð¸Ñ€ÑƒÐ¹ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ execution, Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½ÑƒÑŽ Ð´Ð¸ÑÑ†Ð¸Ð¿Ð»Ð¸Ð½Ñƒ, confidence Ð¸ decision behavior Ð¿Ð¾ ÐºÐ°Ð¶Ð´Ð¾Ð¼Ñƒ trade.",
    totalTrades: "Ð’ÑÐµÐ³Ð¾ ÑÐ´ÐµÐ»Ð¾Ðº",
    execution: "Execution",
    confidence: "Confidence",
  },
  es: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analiza calidad de ejecuciÃ³n, disciplina operativa, confidence y comportamiento decisional trade por trade.",
    totalTrades: "Trades totales",
    execution: "Execution",
    confidence: "Confidence",
  },
  fr: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analyse la qualitÃ© dâ€™exÃ©cution, la discipline opÃ©rationnelle, la confidence et le comportement dÃ©cisionnel trade par trade.",
    totalTrades: "Trades totaux",
    execution: "Execution",
    confidence: "Confidence",
  },
  de: {
    eyebrow: "VOLTIS Trade Quality",
    title: "Execution Journal",
    description:
      "Analysiere Execution-QualitÃ¤t, operative Disziplin, Confidence und Entscheidungsverhalten Trade fÃ¼r Trade.",
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
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10 flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400" />

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
              {t.eyebrow}
            </p>
          </div>

          <h1 className="mt-6 text-5xl font-black tracking-tight text-white xl:text-7xl">
            {t.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 xl:text-lg">
            {t.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 xl:min-w-[420px]">
          <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.totalTrades}
            </p>

            <h2 className="mt-3 text-4xl font-black text-cyan-400">
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

          <div className="rounded-3xl border border-green-500/10 bg-green-500/[0.06] p-5 backdrop-blur-xl">
            <p className="text-sm text-gray-400">
              {t.confidence}
            </p>

            <h2 className="mt-3 text-4xl font-black text-green-400">
              {averageConfidence}/10
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
