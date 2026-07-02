import { normalizeAppLanguage } from "@/lib/i18n";

type Props = {
  score: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  description: string;
  elite: string;
  consistent: string;
  developing: string;
  unstable: string;
};

const labels: Record<string, Labels> = {
  it: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score calcolato usando performance, win rate, qualità esecuzione e consistenza operativa.",
    elite: "Elite",
    consistent: "Consistente",
    developing: "In sviluppo",
    unstable: "Instabile",
  },
  en: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score calculated using performance, win rate, execution quality and operational consistency.",
    elite: "Elite",
    consistent: "Consistent",
    developing: "Developing",
    unstable: "Unstable",
  },
  uk: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score розрахований на основі performance, win rate, якості execution та операційної стабільності.",
    elite: "Elite",
    consistent: "Стабільний",
    developing: "У розвитку",
    unstable: "Нестабільний",
  },
  ru: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score рассчитан на основе performance, win rate, качества execution и операционной стабильности.",
    elite: "Elite",
    consistent: "Стабильный",
    developing: "В развитии",
    unstable: "Нестабильный",
  },
  es: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score calculado usando performance, win rate, calidad de ejecución y consistencia operativa.",
    elite: "Elite",
    consistent: "Consistente",
    developing: "En desarrollo",
    unstable: "Inestable",
  },
  fr: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score calculé avec la performance, le win rate, la qualité d’exécution et la consistance opérationnelle.",
    elite: "Elite",
    consistent: "Consistant",
    developing: "En développement",
    unstable: "Instable",
  },
  de: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score berechnet aus Performance, Win Rate, Execution-Qualität und operativer Konstanz.",
    elite: "Elite",
    consistent: "Konstant",
    developing: "In Entwicklung",
    unstable: "Instabil",
  },
};

function getTone(score: number) {
  if (score >= 80) {
    return "text-green-400";
  }

  if (score >= 60) {
    return "text-cyan-400";
  }

  if (score >= 40) {
    return "text-yellow-400";
  }

  return "text-red-400";
}

function getLabel(score: number, t: Labels) {
  if (score >= 80) {
    return t.elite;
  }

  if (score >= 60) {
    return t.consistent;
  }

  if (score >= 40) {
    return t.developing;
  }

  return t.unstable;
}

export default function ConsistencyScoreCard({
  score,
  appLanguage,
}: Props) {
  const tone = getTone(score);
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-surface-1 via-[#111827] to-black p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
              {t.eyebrow}
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              {t.title}
            </h2>
          </div>

          <div
            className={`rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold ${tone}`}
          >
            {getLabel(score, t)}
          </div>
        </div>

        <div className="mt-8 flex items-end gap-4">
          <h3
            className={`text-7xl font-black tracking-tight ${tone}`}
          >
            {score}
          </h3>

          <span className="mb-2 text-xl font-bold text-gray-500">
            /100
          </span>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent-bright to-violet-500 transition-all duration-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <p className="mt-6 max-w-xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}

