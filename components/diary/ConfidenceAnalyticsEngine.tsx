import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  lowConfidenceTrades: number;
  highConfidenceTrades: number;
  highQualityTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  highConfidence: string;
  lowConfidence: string;
  confidenceStatus: string;
  convictionStrong: string;
  underconfident: string;
  balanced: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "Alta confidence",
    lowConfidence: "Bassa confidence",
    confidenceStatus: "Stato confidence",
    convictionStrong: "Convinzione forte",
    underconfident: "Bassa convinzione",
    balanced: "Bilanciato",
    description:
      "VOLTIS confronta confidence, qualità dei trade e disciplina esecutiva per capire se la convinzione operativa è allineata al tuo reale edge.",
  },
  en: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "High Confidence",
    lowConfidence: "Low Confidence",
    confidenceStatus: "Confidence Status",
    convictionStrong: "Conviction Strong",
    underconfident: "Underconfident",
    balanced: "Balanced",
    description:
      "VOLTIS compares confidence, trade quality and execution discipline to understand whether your operational conviction is aligned with your real edge.",
  },
  uk: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "Висока confidence",
    lowConfidence: "Низька confidence",
    confidenceStatus: "Статус confidence",
    convictionStrong: "Сильна переконаність",
    underconfident: "Недостатня впевненість",
    balanced: "Збалансовано",
    description:
      "VOLTIS порівнює confidence, якість trade та execution discipline, щоб зрозуміти, чи операційна переконаність відповідає реальному edge.",
  },
  ru: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "Высокая confidence",
    lowConfidence: "Низкая confidence",
    confidenceStatus: "Статус confidence",
    convictionStrong: "Сильная убежденность",
    underconfident: "Недостаточная уверенность",
    balanced: "Сбалансировано",
    description:
      "VOLTIS сравнивает confidence, качество trade и execution discipline, чтобы понять, соответствует ли операционная убежденность реальному edge.",
  },
  es: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "Alta confidence",
    lowConfidence: "Baja confidence",
    confidenceStatus: "Estado confidence",
    convictionStrong: "Convicción fuerte",
    underconfident: "Poca confianza",
    balanced: "Equilibrado",
    description:
      "VOLTIS compara confidence, calidad de los trades y disciplina de ejecución para entender si la convicción operativa está alineada con tu edge real.",
  },
  fr: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "Confidence élevée",
    lowConfidence: "Confidence faible",
    confidenceStatus: "Statut confidence",
    convictionStrong: "Conviction forte",
    underconfident: "Sous-confiant",
    balanced: "Équilibré",
    description:
      "VOLTIS compare confidence, qualité des trades et discipline d’exécution pour comprendre si la conviction opérationnelle est alignée avec ton edge réel.",
  },
  de: {
    eyebrow: "Confidence Analytics",
    title: "Confidence Engine",
    highConfidence: "Hohe Confidence",
    lowConfidence: "Niedrige Confidence",
    confidenceStatus: "Confidence-Status",
    convictionStrong: "Starke Überzeugung",
    underconfident: "Zu wenig Vertrauen",
    balanced: "Ausgeglichen",
    description:
      "VOLTIS vergleicht Confidence, Trade-Qualität und Execution-Disziplin, um zu verstehen, ob die operative Überzeugung mit deinem echten Edge übereinstimmt.",
  },
};

export default function ConfidenceAnalyticsEngine({
  lowConfidenceTrades,
  highConfidenceTrades,
  highQualityTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  const confidenceStatus =
    highConfidenceTrades >= highQualityTrades
      ? t.convictionStrong
      : lowConfidenceTrades > highConfidenceTrades
        ? t.underconfident
        : t.balanced;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_10%,transparent),transparent_35%)]" />

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
              {t.highConfidence}
            </p>

            <h3 className="mt-3 text-4xl font-black text-accent">
              {highConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.lowConfidence}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.confidenceStatus}
            </p>

            <h3 className="mt-3 text-2xl font-black text-accent-bright">
              {confidenceStatus}
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
