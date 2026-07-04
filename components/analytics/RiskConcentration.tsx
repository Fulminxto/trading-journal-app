import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import SignatureEdge from "@/components/ui/SignatureEdge";

type Props = {
  // Pre-sorted by page.tsx, worst severity first - this component trusts
  // that order rather than re-deriving it, so the "dominant tile" below is
  // always data[0].
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
    eyebrow: "AI Risk Matrix",
    title: "Concentrazione rischio",
    description:
      "VOLTIS aggrega emozioni, bassa confidence, setup deboli ed execution debole per mostrare dove si concentra il rischio comportamentale del trader.",
    lowRisk: "rischio basso",
    mediumRisk: "rischio medio",
    highRisk: "rischio alto",
  },
  en: {
    eyebrow: "AI Risk Matrix",
    title: "Risk Concentration",
    description:
      "VOLTIS aggregates emotions, low confidence, weak setups and weak execution to show where the trader's behavioral risk is concentrated.",
    lowRisk: "low risk",
    mediumRisk: "medium risk",
    highRisk: "high risk",
  },
  uk: {
    eyebrow: "AI матриця ризику",
    title: "Концентрація ризику",
    description:
      "VOLTIS агрегує емоції, низьку впевненість, слабкі setup та слабке виконання, щоб показати, де концентрується поведінковий ризик трейдера.",
    lowRisk: "низький ризик",
    mediumRisk: "середній ризик",
    highRisk: "високий ризик",
  },
  ru: {
    eyebrow: "AI матрица риска",
    title: "Концентрация риска",
    description:
      "VOLTIS агрегирует эмоции, низкую уверенность, слабые setup и слабое исполнение, чтобы показать, где концентрируется поведенческий риск трейдера.",
    lowRisk: "низкий риск",
    mediumRisk: "средний риск",
    highRisk: "высокий риск",
  },
  es: {
    eyebrow: "AI Risk Matrix",
    title: "Concentración de riesgo",
    description:
      "VOLTIS agrega emociones, baja confianza, setups débiles y ejecución débil para mostrar dónde se concentra el riesgo comportamental del trader.",
    lowRisk: "riesgo bajo",
    mediumRisk: "riesgo medio",
    highRisk: "riesgo alto",
  },
  fr: {
    eyebrow: "AI Risk Matrix",
    title: "Concentration du risque",
    description:
      "VOLTIS agrège émotions, faible confiance, setups faibles et exécution faible pour montrer où se concentre le risque comportemental du trader.",
    lowRisk: "risque faible",
    mediumRisk: "risque moyen",
    highRisk: "risque élevé",
  },
  de: {
    eyebrow: "AI Risk Matrix",
    title: "Risikokonzentration",
    description:
      "VOLTIS bündelt Emotionen, niedrige Confidence, schwache Setups und schwache Execution, um zu zeigen, wo sich das Verhaltensrisiko des Traders konzentriert.",
    lowRisk: "niedriges Risiko",
    mediumRisk: "mittleres Risiko",
    highRisk: "hohes Risiko",
  },
};

// Risk severity is evaluative like an outcome (this factor is dangerous or
// isn't), so semantic red/yellow/green is the correct use here - unlike a
// merely-distinguishing label, which would stay in the cold family.
function getTone(severity: string) {
  if (severity === "high") {
    return "border-red-500/30 bg-red-500/10 text-red-400";
  }

  if (severity === "medium") {
    return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";
  }

  return "border-green-500/20 bg-green-500/10 text-green-400";
}

function getSeverityLabel(
  severity: "low" | "medium" | "high",
  t: Labels
) {
  if (severity === "high") return t.highRisk;
  if (severity === "medium") return t.mediumRisk;
  return t.lowRisk;
}

export default function RiskConcentration({
  data,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  // The signature mechanic: severity dictates size, not a fixed layout.
  // Whatever is most dangerous right now is physically the biggest thing
  // on the page - "unforgiving" made structural, not decorative.
  const [primary, ...rest] = data;

  return (
    <Card className="border-[0.5px] border-red-500/25 p-6 sm:p-10">
      <div className="flex items-center gap-3">
        <SignatureEdge orientation="vertical" pulse={false} className="h-4" />
        <p className="text-sm text-muted">{t.eyebrow}</p>
      </div>

      <h2 className="mt-4 text-hero text-white">
        {t.title}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_1fr]">
        <Card
          variant="inner"
          className={`border p-6 sm:p-8 ${getTone(primary.severity)}`}
        >
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">
            {getSeverityLabel(primary.severity, t)}
          </p>

          <h3 className="mt-4 text-6xl font-black tabular-nums">
            {primary.count}
          </h3>

          <p className="mt-3 text-base text-gray-300">
            {primary.factor}
          </p>
        </Card>

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          {rest.map((item) => (
            <Card
              key={item.factor}
              variant="inner"
              className={`border p-4 ${getTone(item.severity)}`}
            >
              <h3 className="text-2xl font-black tabular-nums">
                {item.count}
              </h3>

              <p className="mt-1 text-xs text-gray-400">
                {item.factor}
              </p>
            </Card>
          ))}
        </div>
      </div>

      <p className="mt-8 max-w-2xl text-sm leading-relaxed text-muted">
        {t.description}
      </p>
    </Card>
  );
}
