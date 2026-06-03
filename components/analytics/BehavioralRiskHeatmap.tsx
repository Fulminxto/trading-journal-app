import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

type Props = {
  data: {
    factor: string;
    count: number;
    severity: "low" | "medium" | "high";
  }[];
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  description: string;
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Heatmap rischio comportamentale",
    title: "Concentrazione rischio",
    description:
      "VOLTIS aggrega emozioni, bassa confidence, setup deboli ed execution debole per mostrare dove si concentra il rischio comportamentale del trader.",
    lowRisk: "rischio basso",
    mediumRisk: "rischio medio",
    highRisk: "rischio alto",
  },
  en: {
    eyebrow: "Behavioral Risk Heatmap",
    title: "Risk Concentration",
    description:
      "VOLTIS aggregates emotions, low confidence, weak setups and weak execution to show where the trader's behavioral risk is concentrated.",
    lowRisk: "low risk",
    mediumRisk: "medium risk",
    highRisk: "high risk",
  },
  uk: {
    eyebrow: "Теплова карта поведінкового ризику",
    title: "Концентрація ризику",
    description:
      "VOLTIS агрегує емоції, низьку впевненість, слабкі setup та слабке виконання, щоб показати, де концентрується поведінковий ризик трейдера.",
    lowRisk: "низький ризик",
    mediumRisk: "середній ризик",
    highRisk: "високий ризик",
  },
  ru: {
    eyebrow: "Тепловая карта поведенческого риска",
    title: "Концентрация риска",
    description:
      "VOLTIS агрегирует эмоции, низкую уверенность, слабые setup и слабое исполнение, чтобы показать, где концентрируется поведенческий риск трейдера.",
    lowRisk: "низкий риск",
    mediumRisk: "средний риск",
    highRisk: "высокий риск",
  },
  es: {
    eyebrow: "Mapa de riesgo comportamental",
    title: "Concentración de riesgo",
    description:
      "VOLTIS agrega emociones, baja confianza, setups débiles y ejecución débil para mostrar dónde se concentra el riesgo comportamental del trader.",
    lowRisk: "riesgo bajo",
    mediumRisk: "riesgo medio",
    highRisk: "riesgo alto",
  },
  fr: {
    eyebrow: "Heatmap du risque comportemental",
    title: "Concentration du risque",
    description:
      "VOLTIS agrège émotions, faible confiance, setups faibles et exécution faible pour montrer où se concentre le risque comportemental du trader.",
    lowRisk: "risque faible",
    mediumRisk: "risque moyen",
    highRisk: "risque élevé",
  },
  de: {
    eyebrow: "Behavioral Risk Heatmap",
    title: "Risikokonzentration",
    description:
      "VOLTIS bündelt Emotionen, niedrige Confidence, schwache Setups und schwache Execution, um zu zeigen, wo sich das Verhaltensrisiko des Traders konzentriert.",
    lowRisk: "niedriges Risiko",
    mediumRisk: "mittleres Risiko",
    highRisk: "hohes Risiko",
  },
};

function getTone(severity: string) {
  if (severity === "high") {
    return "border-red-500/30 bg-red-500/15";
  }

  if (severity === "medium") {
    return "border-yellow-500/30 bg-yellow-500/15";
  }

  return "border-green-500/20 bg-green-500/10";
}

function getSeverityLabel(
  severity: "low" | "medium" | "high",
  t: Labels
) {
  if (severity === "high") return t.highRisk;
  if (severity === "medium") return t.mediumRisk;
  return t.lowRisk;
}

export default function BehavioralRiskHeatmap({
  data,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#1a1010] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-red-400">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {data.map((item) => (
            <div
              key={item.factor}
              className={`rounded-2xl border p-5 ${getTone(item.severity)}`}
            >
              <p className="text-sm text-gray-400">
                {item.factor}
              </p>

              <h3 className="mt-3 text-4xl font-black text-white">
                {item.count}
              </h3>

              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gray-400">
                {getSeverityLabel(item.severity, t)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}
