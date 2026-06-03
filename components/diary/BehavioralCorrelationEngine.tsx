import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  emotionalTrades: number;
  weakExecutionTrades: number;
  lowConfidenceTrades: number;
  totalTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  behavioralRisk: string;
  status: string;
  emotional: string;
  weakExecution: string;
  highRisk: string;
  watchlist: string;
  stable: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Rischio comportamentale",
    status: "Stato",
    emotional: "Emotivi",
    weakExecution: "Execution debole",
    highRisk: "Rischio alto",
    watchlist: "Da monitorare",
    stable: "Stabile",
    description:
      "VOLTIS aggrega emozioni, bassa confidence ed esecuzioni deboli per stimare il rischio comportamentale che può ridurre il tuo edge operativo.",
  },
  en: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Behavioral Risk",
    status: "Status",
    emotional: "Emotional",
    weakExecution: "Weak Execution",
    highRisk: "High Risk",
    watchlist: "Watchlist",
    stable: "Stable",
    description:
      "VOLTIS aggregates emotions, low confidence and weak executions to estimate the behavioral risk that can reduce your operating edge.",
  },
  uk: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Поведінковий ризик",
    status: "Статус",
    emotional: "Емоційні",
    weakExecution: "Слабке execution",
    highRisk: "Високий ризик",
    watchlist: "Під контролем",
    stable: "Стабільно",
    description:
      "VOLTIS агрегує емоції, низьку confidence та слабке execution, щоб оцінити поведінковий ризик, який може зменшити твій operating edge.",
  },
  ru: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Поведенческий риск",
    status: "Статус",
    emotional: "Эмоциональные",
    weakExecution: "Слабое execution",
    highRisk: "Высокий риск",
    watchlist: "Под наблюдением",
    stable: "Стабильно",
    description:
      "VOLTIS агрегирует эмоции, низкую confidence и слабое execution, чтобы оценить поведенческий риск, который может снизить твой operating edge.",
  },
  es: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Riesgo conductual",
    status: "Estado",
    emotional: "Emocionales",
    weakExecution: "Execution débil",
    highRisk: "Riesgo alto",
    watchlist: "En observación",
    stable: "Estable",
    description:
      "VOLTIS agrega emociones, baja confidence y ejecuciones débiles para estimar el riesgo conductual que puede reducir tu edge operativo.",
  },
  fr: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Risque comportemental",
    status: "Statut",
    emotional: "Émotionnels",
    weakExecution: "Execution faible",
    highRisk: "Risque élevé",
    watchlist: "À surveiller",
    stable: "Stable",
    description:
      "VOLTIS agrège émotions, faible confidence et exécutions faibles pour estimer le risque comportemental qui peut réduire ton edge opérationnel.",
  },
  de: {
    eyebrow: "Behavioral Correlation",
    title: "Behavior Risk Engine",
    behavioralRisk: "Verhaltensrisiko",
    status: "Status",
    emotional: "Emotional",
    weakExecution: "Schwache Execution",
    highRisk: "Hohes Risiko",
    watchlist: "Watchlist",
    stable: "Stabil",
    description:
      "VOLTIS aggregiert Emotionen, niedrige Confidence und schwache Executions, um das Verhaltensrisiko zu schätzen, das deinen operativen Edge reduzieren kann.",
  },
};

export default function BehavioralCorrelationEngine({
  emotionalTrades,
  weakExecutionTrades,
  lowConfidenceTrades,
  totalTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  const behavioralRisk =
    totalTrades > 0
      ? Math.round(
          ((emotionalTrades +
            weakExecutionTrades +
            lowConfidenceTrades) /
            totalTrades) *
            100
        )
      : 0;

  const status =
    behavioralRisk >= 50
      ? t.highRisk
      : behavioralRisk >= 25
        ? t.watchlist
        : t.stable;

  const tone =
    behavioralRisk >= 50
      ? "text-red-400"
      : behavioralRisk >= 25
        ? "text-yellow-400"
        : "text-green-400";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#100b14] via-[#151020] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.behavioralRisk}
            </p>

            <h3 className={`mt-3 text-4xl font-black ${tone}`}>
              {behavioralRisk}%
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.status}
            </p>

            <h3 className={`mt-3 text-2xl font-black ${tone}`}>
              {status}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.emotional}
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {emotionalTrades}
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
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}
