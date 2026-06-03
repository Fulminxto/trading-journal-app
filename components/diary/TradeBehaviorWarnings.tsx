import { normalizeAppLanguage } from "@/lib/i18n";

type Props = {
  weakExecutionTrades: number;
  emotionalTrades: number;
  highQualityTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  warningsActive: string;
  stable: string;
  weakExecution: string;
  emotionalTrades: string;
  highQuality: string;
  description: string;
};

const labels: Record<string, Labels> = {
  it: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warning attivi",
    stable: "Stabile",
    weakExecution: "Execution debole",
    emotionalTrades: "Trade emotivi",
    highQuality: "Alta qualità",
    description:
      "VOLTIS monitora trade emotivi, esecuzioni deboli e qualità dei setup per individuare pattern comportamentali che possono compromettere la performance.",
  },
  en: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings Active",
    stable: "Stable",
    weakExecution: "Weak Execution",
    emotionalTrades: "Emotional Trades",
    highQuality: "High Quality",
    description:
      "VOLTIS monitors emotional trades, weak executions and setup quality to identify behavioral patterns that may compromise performance.",
  },
  uk: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Активні warning",
    stable: "Стабільно",
    weakExecution: "Слабке execution",
    emotionalTrades: "Емоційні trade",
    highQuality: "Висока якість",
    description:
      "VOLTIS відстежує емоційні trade, слабке execution та якість setup, щоб знаходити behavioral patterns, які можуть погіршити performance.",
  },
  ru: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Активные warning",
    stable: "Стабильно",
    weakExecution: "Слабое execution",
    emotionalTrades: "Эмоциональные trade",
    highQuality: "Высокое качество",
    description:
      "VOLTIS отслеживает эмоциональные trade, слабое execution и качество setup, чтобы находить behavioral patterns, которые могут ухудшить performance.",
  },
  es: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings activos",
    stable: "Estable",
    weakExecution: "Execution débil",
    emotionalTrades: "Trades emocionales",
    highQuality: "Alta calidad",
    description:
      "VOLTIS monitoriza trades emocionales, ejecuciones débiles y calidad de setup para identificar patrones conductuales que pueden comprometer la performance.",
  },
  fr: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings actifs",
    stable: "Stable",
    weakExecution: "Execution faible",
    emotionalTrades: "Trades émotionnels",
    highQuality: "Haute qualité",
    description:
      "VOLTIS surveille les trades émotionnels, les exécutions faibles et la qualité des setups pour identifier les patterns comportementaux qui peuvent compromettre la performance.",
  },
  de: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings aktiv",
    stable: "Stabil",
    weakExecution: "Schwache Execution",
    emotionalTrades: "Emotionale Trades",
    highQuality: "Hohe Qualität",
    description:
      "VOLTIS überwacht emotionale Trades, schwache Executions und Setup-Qualität, um Verhaltensmuster zu erkennen, die die Performance gefährden können.",
  },
};

export default function TradeBehaviorWarnings({
  weakExecutionTrades,
  emotionalTrades,
  highQualityTrades,
  appLanguage,
}: Props) {
  const hasWarnings =
    weakExecutionTrades > 2 ||
    emotionalTrades > highQualityTrades;

  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#1a1010] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-red-400">
              {t.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              {t.title}
            </h2>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              hasWarnings
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-green-500/20 bg-green-500/10 text-green-400"
            }`}
          >
            {hasWarnings ? t.warningsActive : t.stable}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.weakExecution}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakExecutionTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.emotionalTrades}
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.highQuality}
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {highQualityTrades}
            </h3>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}

