import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";

type RiskItem = {
  label: string;
  value: number;
};

type Props = {
  risks: RiskItem[];
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "AI Risk Matrix",
    title: "Concentrazione rischio",
    description:
      "VOLTIS aggrega i principali fattori di rischio operativo per mostrare dove si concentra la fragilità del processo.",
  },
  en: {
    eyebrow: "AI Risk Matrix",
    title: "Risk Concentration",
    description:
      "VOLTIS aggregates the main operational risk factors to show where process fragility is concentrated.",
  },
  uk: {
    eyebrow: "AI матриця ризику",
    title: "Концентрація ризику",
    description:
      "VOLTIS агрегує основні фактори операційного ризику, щоб показати, де концентрується крихкість процесу.",
  },
  ru: {
    eyebrow: "AI матрица риска",
    title: "Концентрация риска",
    description:
      "VOLTIS агрегирует основные факторы операционного риска, чтобы показать, где концентрируется хрупкость процесса.",
  },
  es: {
    eyebrow: "AI Risk Matrix",
    title: "Concentración de riesgo",
    description:
      "VOLTIS agrega los principales factores de riesgo operativo para mostrar dónde se concentra la fragilidad del proceso.",
  },
  fr: {
    eyebrow: "AI Risk Matrix",
    title: "Concentration du risque",
    description:
      "VOLTIS agrège les principaux facteurs de risque opérationnel pour montrer où se concentre la fragilité du processus.",
  },
  de: {
    eyebrow: "AI Risk Matrix",
    title: "Risikokonzentration",
    description:
      "VOLTIS bündelt die wichtigsten operativen Risikofaktoren, um zu zeigen, wo sich die Prozessfragilität konzentriert.",
  },
};

function getRiskTone(value: number) {
  if (value >= 40) {
    return "border-red-500/30 bg-red-500/15 text-red-400";
  }

  if (value >= 20) {
    return "border-yellow-500/30 bg-yellow-500/15 text-yellow-400";
  }

  return "border-green-500/20 bg-green-500/10 text-green-400";
}

export default function RiskConcentrationMatrix({
  risks,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#090b16] via-[#130f20] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {risks.map((risk) => (
            <div
              key={risk.label}
              className={`rounded-2xl border p-5 ${getRiskTone(risk.value)}`}
            >
              <p className="text-sm text-gray-300">
                {risk.label}
              </p>

              <h3 className="mt-3 text-4xl font-black">
                {risk.value}%
              </h3>
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
