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
      "Score calcolato usando performance, win rate, qualitÃ  esecuzione e consistenza operativa.",
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
      "Score Ñ€Ð¾Ð·Ñ€Ð°Ñ…Ð¾Ð²Ð°Ð½Ð¸Ð¹ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ñ– performance, win rate, ÑÐºÐ¾ÑÑ‚Ñ– execution Ñ‚Ð° Ð¾Ð¿ÐµÑ€Ð°Ñ†Ñ–Ð¹Ð½Ð¾Ñ— ÑÑ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¾ÑÑ‚Ñ–.",
    elite: "Elite",
    consistent: "Ð¡Ñ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¸Ð¹",
    developing: "Ð£ Ñ€Ð¾Ð·Ð²Ð¸Ñ‚ÐºÑƒ",
    unstable: "ÐÐµÑÑ‚Ð°Ð±Ñ–Ð»ÑŒÐ½Ð¸Ð¹",
  },
  ru: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score Ñ€Ð°ÑÑÑ‡Ð¸Ñ‚Ð°Ð½ Ð½Ð° Ð¾ÑÐ½Ð¾Ð²Ðµ performance, win rate, ÐºÐ°Ñ‡ÐµÑÑ‚Ð²Ð° execution Ð¸ Ð¾Ð¿ÐµÑ€Ð°Ñ†Ð¸Ð¾Ð½Ð½Ð¾Ð¹ ÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ð¾ÑÑ‚Ð¸.",
    elite: "Elite",
    consistent: "Ð¡Ñ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ð¹",
    developing: "Ð’ Ñ€Ð°Ð·Ð²Ð¸Ñ‚Ð¸Ð¸",
    unstable: "ÐÐµÑÑ‚Ð°Ð±Ð¸Ð»ÑŒÐ½Ñ‹Ð¹",
  },
  es: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score calculado usando performance, win rate, calidad de ejecuciÃ³n y consistencia operativa.",
    elite: "Elite",
    consistent: "Consistente",
    developing: "En desarrollo",
    unstable: "Inestable",
  },
  fr: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score calculÃ© avec la performance, le win rate, la qualitÃ© dâ€™exÃ©cution et la consistance opÃ©rationnelle.",
    elite: "Elite",
    consistent: "Consistant",
    developing: "En dÃ©veloppement",
    unstable: "Instable",
  },
  de: {
    eyebrow: "VOLTIS Score",
    title: "Consistency Engine",
    description:
      "Score berechnet aus Performance, Win Rate, Execution-QualitÃ¤t und operativer Konstanz.",
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
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#111827] to-black p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
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
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
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
