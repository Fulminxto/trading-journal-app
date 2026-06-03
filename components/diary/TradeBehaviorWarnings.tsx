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
    highQuality: "Alta qualitÃ ",
    description:
      "VOLTIS monitora trade emotivi, esecuzioni deboli e qualitÃ  dei setup per individuare pattern comportamentali che possono compromettere la performance.",
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
    warningsActive: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ– warning",
    stable: "Ð¡Ñ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¾",
    weakExecution: "Ð¡Ð»Ð°Ð±ÐºÐµ execution",
    emotionalTrades: "Ð•Ð¼Ð¾Ñ†Ñ–Ð¹Ð½Ñ– trade",
    highQuality: "Ð’Ð¸ÑÐ¾ÐºÐ° ÑÐºÑ–ÑÑ‚ÑŒ",
    description:
      "VOLTIS Ð²Ñ–Ð´ÑÑ‚ÐµÐ¶ÑƒÑ” ÐµÐ¼Ð¾Ñ†Ñ–Ð¹Ð½Ñ– trade, ÑÐ»Ð°Ð±ÐºÐµ execution Ñ‚Ð° ÑÐºÑ–ÑÑ‚ÑŒ setup, Ñ‰Ð¾Ð± Ð·Ð½Ð°Ñ…Ð¾Ð´Ð¸Ñ‚Ð¸ behavioral patterns, ÑÐºÑ– Ð¼Ð¾Ð¶ÑƒÑ‚ÑŒ Ð¿Ð¾Ð³Ñ–Ñ€ÑˆÐ¸Ñ‚Ð¸ performance.",
  },
  ru: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "ÐÐºÑ‚Ð¸Ð²Ð½Ñ‹Ðµ warning",
    stable: "Ð¡Ñ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾",
    weakExecution: "Ð¡Ð»Ð°Ð±Ð¾Ðµ execution",
    emotionalTrades: "Ð­Ð¼Ð¾Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ trade",
    highQuality: "Ð’Ñ‹ÑÐ¾ÐºÐ¾Ðµ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾",
    description:
      "VOLTIS Ð¾Ñ‚ÑÐ»ÐµÐ¶Ð¸Ð²Ð°ÐµÑ‚ ÑÐ¼Ð¾Ñ†Ð¸Ð¾Ð½Ð°Ð»ÑŒÐ½Ñ‹Ðµ trade, ÑÐ»Ð°Ð±Ð¾Ðµ execution Ð¸ ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð¾ setup, Ñ‡Ñ‚Ð¾Ð±Ñ‹ Ð½Ð°Ñ…Ð¾Ð´Ð¸Ñ‚ÑŒ behavioral patterns, ÐºÐ¾Ñ‚Ð¾Ñ€Ñ‹Ðµ Ð¼Ð¾Ð³ÑƒÑ‚ ÑƒÑ…ÑƒÐ´ÑˆÐ¸Ñ‚ÑŒ performance.",
  },
  es: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings activos",
    stable: "Estable",
    weakExecution: "Execution dÃ©bil",
    emotionalTrades: "Trades emocionales",
    highQuality: "Alta calidad",
    description:
      "VOLTIS monitoriza trades emocionales, ejecuciones dÃ©biles y calidad de setup para identificar patrones conductuales que pueden comprometer la performance.",
  },
  fr: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings actifs",
    stable: "Stable",
    weakExecution: "Execution faible",
    emotionalTrades: "Trades Ã©motionnels",
    highQuality: "Haute qualitÃ©",
    description:
      "VOLTIS surveille les trades Ã©motionnels, les exÃ©cutions faibles et la qualitÃ© des setups pour identifier les patterns comportementaux qui peuvent compromettre la performance.",
  },
  de: {
    eyebrow: "Behavior Intelligence",
    title: "Trade Behavior Warnings",
    warningsActive: "Warnings aktiv",
    stable: "Stabil",
    weakExecution: "Schwache Execution",
    emotionalTrades: "Emotionale Trades",
    highQuality: "Hohe QualitÃ¤t",
    description:
      "VOLTIS Ã¼berwacht emotionale Trades, schwache Executions und Setup-QualitÃ¤t, um Verhaltensmuster zu erkennen, die die Performance gefÃ¤hrden kÃ¶nnen.",
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
