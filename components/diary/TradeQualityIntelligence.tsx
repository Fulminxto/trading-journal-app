import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  highQualityTrades: number;
  weakExecutionTrades: number;
  emotionalTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  highQuality: string;
  weakExecution: string;
  emotionalTrades: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Trade Quality Intelligence",
    title: "Qualità esecuzione",
    highQuality: "Alta qualità",
    weakExecution: "Esecuzione debole",
    emotionalTrades: "Trade emotivi",
    description:
      "Questa sezione valuta qualità dei setup, execution rating e stato emotivo per distinguere trade tecnici da trade impulsivi o deboli.",
  },
  en: {
    eyebrow: "Trade Quality Intelligence",
    title: "Execution Quality",
    highQuality: "High Quality",
    weakExecution: "Weak Execution",
    emotionalTrades: "Emotional Trades",
    description:
      "This section evaluates setup quality, execution rating and emotional state to distinguish technical trades from impulsive or weak trades.",
  },
  uk: {
    eyebrow: "Trade Quality Intelligence",
    title: "Якість виконання",
    highQuality: "Висока якість",
    weakExecution: "Слабке виконання",
    emotionalTrades: "Емоційні trade",
    description:
      "Цей блок оцінює якість setup, execution rating та емоційний стан, щоб відрізняти технічні trade від імпульсивних або слабких.",
  },
  ru: {
    eyebrow: "Trade Quality Intelligence",
    title: "Качество исполнения",
    highQuality: "Высокое качество",
    weakExecution: "Слабое исполнение",
    emotionalTrades: "Эмоциональные trade",
    description:
      "Этот блок оценивает качество setup, execution rating и эмоциональное состояние, чтобы отличать технические trade от импульсивных или слабых.",
  },
  es: {
    eyebrow: "Trade Quality Intelligence",
    title: "Calidad de ejecución",
    highQuality: "Alta calidad",
    weakExecution: "Ejecución débil",
    emotionalTrades: "Trades emocionales",
    description:
      "Esta sección evalúa la calidad del setup, el execution rating y el estado emocional para distinguir trades técnicos de trades impulsivos o débiles.",
  },
  fr: {
    eyebrow: "Trade Quality Intelligence",
    title: "Qualité d’exécution",
    highQuality: "Haute qualité",
    weakExecution: "Exécution faible",
    emotionalTrades: "Trades émotionnels",
    description:
      "Cette section évalue la qualité du setup, l’execution rating et l’état émotionnel pour distinguer les trades techniques des trades impulsifs ou faibles.",
  },
  de: {
    eyebrow: "Trade Quality Intelligence",
    title: "Execution-Qualität",
    highQuality: "Hohe Qualität",
    weakExecution: "Schwache Execution",
    emotionalTrades: "Emotionale Trades",
    description:
      "Dieser Bereich bewertet Setup-Qualität, Execution Rating und emotionalen Zustand, um technische Trades von impulsiven oder schwachen Trades zu unterscheiden.",
  },
};

export default function TradeQualityIntelligence({
  highQualityTrades,
  weakExecutionTrades,
  emotionalTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_8%,transparent),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.highQuality}
            </p>

            <h3 className="mt-3 text-4xl font-black text-accent">
              {highQualityTrades}
            </h3>
          </div>

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
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}
