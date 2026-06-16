import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  traderType: string;
  strength: string;
  weakness: string;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  traderType: string;
  strength: string;
  weakness: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Trader Identity",
    title: "Profilo operativo",
    traderType: "Tipo trader",
    strength: "Punto forte",
    weakness: "Debolezza",
    description:
      "VOLTIS costruisce il profilo operativo del trader usando execution, confidence, setup quality e disciplina emotiva.",
  },
  en: {
    eyebrow: "Trader Identity",
    title: "Operating Profile",
    traderType: "Trader Type",
    strength: "Strength",
    weakness: "Weakness",
    description:
      "VOLTIS builds the trader's operating profile using execution, confidence, setup quality and emotional discipline.",
  },
  uk: {
    eyebrow: "Trader Identity",
    title: "Операційний профіль",
    traderType: "Тип трейдера",
    strength: "Сильна сторона",
    weakness: "Слабке місце",
    description:
      "VOLTIS будує операційний профіль трейдера на основі execution, confidence, setup quality та емоційної дисципліни.",
  },
  ru: {
    eyebrow: "Trader Identity",
    title: "Операционный профиль",
    traderType: "Тип трейдера",
    strength: "Сильная сторона",
    weakness: "Слабое место",
    description:
      "VOLTIS строит операционный профиль трейдера на основе execution, confidence, setup quality и эмоциональной дисциплины.",
  },
  es: {
    eyebrow: "Trader Identity",
    title: "Perfil operativo",
    traderType: "Tipo de trader",
    strength: "Fortaleza",
    weakness: "Debilidad",
    description:
      "VOLTIS construye el perfil operativo del trader usando execution, confidence, setup quality y disciplina emocional.",
  },
  fr: {
    eyebrow: "Trader Identity",
    title: "Profil opérationnel",
    traderType: "Type de trader",
    strength: "Force",
    weakness: "Faiblesse",
    description:
      "VOLTIS construit le profil opérationnel du trader avec execution, confidence, setup quality et discipline émotionnelle.",
  },
  de: {
    eyebrow: "Trader Identity",
    title: "Operatives Profil",
    traderType: "Trader-Typ",
    strength: "Stärke",
    weakness: "Schwäche",
    description:
      "VOLTIS erstellt das operative Profil des Traders anhand von Execution, Confidence, Setup Quality und emotionaler Disziplin.",
  },
};

export default function TraderIdentityEngine({
  traderType,
  strength,
  weakness,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#090b16] via-[#101426] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.traderType}
            </p>

            <h3 className="mt-3 text-2xl font-black text-violet-400">
              {traderType}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.strength}
            </p>

            <h3 className="mt-3 text-2xl font-black text-accent">
              {strength}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.weakness}
            </p>

            <h3 className="mt-3 text-2xl font-black text-red-400">
              {weakness}
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
