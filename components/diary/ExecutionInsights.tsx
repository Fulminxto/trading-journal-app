import { normalizeAppLanguage } from "@/lib/i18n";

type Props = {
  disciplineScore: number;
  averageExecution: number;
  averageConfidence: number;
  highQualityTrades: number;
  weakExecutionTrades: number;
  emotionalTrades: number;
  bestSetup: string;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  disciplineScore: string;
  avgExecution: string;
  avgConfidence: string;
  highQuality: string;
  weakExecution: string;
  emotionalTrades: string;
  bestSetup: string;
  elite: string;
  consistent: string;
  developing: string;
  unstable: string;
};

const labels: Record<string, Labels> = {
  it: {
    eyebrow: "Execution Insights",
    title: "Qualità operativa",
    disciplineScore: "Discipline Score",
    avgExecution: "Execution media",
    avgConfidence: "Confidence media",
    highQuality: "Alta qualità",
    weakExecution: "Exec debole",
    emotionalTrades: "Trade emotivi",
    bestSetup: "Setup migliore",
    elite: "Elite",
    consistent: "Consistente",
    developing: "In sviluppo",
    unstable: "Instabile",
  },
  en: {
    eyebrow: "Execution Insights",
    title: "Operational quality",
    disciplineScore: "Discipline Score",
    avgExecution: "Avg Execution",
    avgConfidence: "Avg Confidence",
    highQuality: "High Quality",
    weakExecution: "Weak Execution",
    emotionalTrades: "Emotional Trades",
    bestSetup: "Best Setup",
    elite: "Elite",
    consistent: "Consistent",
    developing: "Developing",
    unstable: "Unstable",
  },
  uk: {
    eyebrow: "Execution Insights",
    title: "Операційна якість",
    disciplineScore: "Discipline Score",
    avgExecution: "Сер. Execution",
    avgConfidence: "Сер. Confidence",
    highQuality: "Висока якість",
    weakExecution: "Слабке Exec",
    emotionalTrades: "Емоційні trade",
    bestSetup: "Кращий setup",
    elite: "Elite",
    consistent: "Стабільний",
    developing: "У розвитку",
    unstable: "Нестабільний",
  },
  ru: {
    eyebrow: "Execution Insights",
    title: "Операционное качество",
    disciplineScore: "Discipline Score",
    avgExecution: "Ср. Execution",
    avgConfidence: "Ср. Confidence",
    highQuality: "Высокое качество",
    weakExecution: "Слабое Exec",
    emotionalTrades: "Эмоц. сделки",
    bestSetup: "Лучший setup",
    elite: "Elite",
    consistent: "Стабильный",
    developing: "В развитии",
    unstable: "Нестабильный",
  },
  es: {
    eyebrow: "Execution Insights",
    title: "Calidad operativa",
    disciplineScore: "Discipline Score",
    avgExecution: "Exec media",
    avgConfidence: "Confidence media",
    highQuality: "Alta calidad",
    weakExecution: "Exec débil",
    emotionalTrades: "Trades emoc.",
    bestSetup: "Mejor setup",
    elite: "Elite",
    consistent: "Consistente",
    developing: "En desarrollo",
    unstable: "Inestable",
  },
  fr: {
    eyebrow: "Execution Insights",
    title: "Qualité opérationnelle",
    disciplineScore: "Discipline Score",
    avgExecution: "Exec moyenne",
    avgConfidence: "Confiance moy.",
    highQuality: "Haute qualité",
    weakExecution: "Exec faible",
    emotionalTrades: "Trades émot.",
    bestSetup: "Meilleur setup",
    elite: "Elite",
    consistent: "Consistant",
    developing: "En développement",
    unstable: "Instable",
  },
  de: {
    eyebrow: "Execution Insights",
    title: "Operative Qualität",
    disciplineScore: "Discipline Score",
    avgExecution: "Ø Execution",
    avgConfidence: "Ø Confidence",
    highQuality: "Hohe Qualität",
    weakExecution: "Schwache Exec",
    emotionalTrades: "Emot. Trades",
    bestSetup: "Bestes Setup",
    elite: "Elite",
    consistent: "Konstant",
    developing: "In Entwicklung",
    unstable: "Instabil",
  },
};

function getTier(score: number, t: Labels) {
  if (score >= 80) return { label: t.elite, color: "text-green-400", bar: "from-green-500 to-emerald-400" };
  if (score >= 60) return { label: t.consistent, color: "text-accent-bright", bar: "from-accent-bright to-violet-500" };
  if (score >= 40) return { label: t.developing, color: "text-yellow-400", bar: "from-yellow-500 to-orange-400" };
  return { label: t.unstable, color: "text-red-400", bar: "from-red-500 to-red-400" };
}

export default function ExecutionInsights({
  disciplineScore,
  averageExecution,
  averageConfidence,
  highQualityTrades,
  weakExecutionTrades,
  emotionalTrades,
  bestSetup,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;
  const tier = getTier(disciplineScore, t);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-accent-bright/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent),transparent_35%)]" />

      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
            {t.eyebrow}
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            {t.title}
          </h2>
        </div>

        {/* Discipline Score */}
        <div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end gap-3">
              <span className={`text-7xl font-black leading-none tracking-tight ${tier.color}`}>
                {disciplineScore}
              </span>

              <span className="mb-2 text-xl font-bold text-gray-500">
                /100
              </span>
            </div>

            <div className={`rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold ${tier.color}`}>
              {tier.label}
            </div>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            {t.disciplineScore}
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 ${tier.bar}`}
              style={{ width: `${disciplineScore}%` }}
            />
          </div>
        </div>

        {/* 4 core metrics */}
        <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500">
              {t.avgExecution}
            </p>

            <p className="mt-2 text-2xl font-black text-violet-400">
              {averageExecution}<span className="text-sm font-normal text-gray-500">/10</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500">
              {t.avgConfidence}
            </p>

            <p className="mt-2 text-2xl font-black text-accent">
              {averageConfidence}<span className="text-sm font-normal text-gray-500">/10</span>
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500">
              {t.highQuality}
            </p>

            <p className="mt-2 text-2xl font-black text-green-400">
              {highQualityTrades}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500">
              {t.weakExecution}
            </p>

            <p className="mt-2 text-2xl font-black text-red-400">
              {weakExecutionTrades}
            </p>
          </div>
        </div>

        {/* Emotional + Best Setup */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500">
              {t.emotionalTrades}
            </p>

            <p className="mt-2 text-2xl font-black text-yellow-400">
              {emotionalTrades}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-gray-500">
              {t.bestSetup}
            </p>

            <p className="mt-2 truncate text-xl font-black text-accent-bright">
              {bestSetup}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
