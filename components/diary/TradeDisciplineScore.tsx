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
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score basato su execution, setup quality, confidence e disciplina emotiva del trader.",
    elite: "Elite",
    consistent: "Consistente",
    developing: "In sviluppo",
    unstable: "Instabile",
  },
  en: {
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score based on execution, setup quality, confidence and the trader’s emotional discipline.",
    elite: "Elite",
    consistent: "Consistent",
    developing: "Developing",
    unstable: "Unstable",
  },
  uk: {
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score на основі execution, setup quality, confidence та емоційної дисципліни трейдера.",
    elite: "Elite",
    consistent: "Стабільний",
    developing: "У розвитку",
    unstable: "Нестабільний",
  },
  ru: {
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score на основе execution, setup quality, confidence и эмоциональной дисциплины трейдера.",
    elite: "Elite",
    consistent: "Стабильный",
    developing: "В развитии",
    unstable: "Нестабильный",
  },
  es: {
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score basado en execution, setup quality, confidence y disciplina emocional del trader.",
    elite: "Elite",
    consistent: "Consistente",
    developing: "En desarrollo",
    unstable: "Inestable",
  },
  fr: {
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score basé sur execution, setup quality, confidence et discipline émotionnelle du trader.",
    elite: "Elite",
    consistent: "Consistant",
    developing: "En développement",
    unstable: "Instable",
  },
  de: {
    eyebrow: "Trade Discipline",
    title: "Discipline Score",
    description:
      "Score basierend auf Execution, Setup Quality, Confidence und emotionaler Disziplin des Traders.",
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

export default function TradeDisciplineScore({
  score,
  appLanguage,
}: Props) {
  const tone = getTone(score);
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#111827] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              {t.eyebrow}
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
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
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}

