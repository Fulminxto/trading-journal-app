import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  lowConfidenceTrades: number;
  weakSetupTrades: number;
  impulsiveTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  lowConfidence: string;
  weakSetups: string;
  impulsiveTrades: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Execution Pattern Engine",
    title: "Pattern comportamentali",
    lowConfidence: "Bassa confidence",
    weakSetups: "Setup deboli",
    impulsiveTrades: "Trade impulsivi",
    description:
      "Questa sezione individua pattern di bassa confidence, setup deboli e operatività impulsiva per migliorare la disciplina decisionale.",
  },
  en: {
    eyebrow: "Execution Pattern Engine",
    title: "Behavioral Patterns",
    lowConfidence: "Low Confidence",
    weakSetups: "Weak Setups",
    impulsiveTrades: "Impulsive Trades",
    description:
      "This section identifies low confidence patterns, weak setups and impulsive trading behavior to improve decision discipline.",
  },
  uk: {
    eyebrow: "Execution Pattern Engine",
    title: "Поведінкові патерни",
    lowConfidence: "Низька confidence",
    weakSetups: "Слабкі setups",
    impulsiveTrades: "Імпульсивні угоди",
    description:
      "Цей блок визначає патерни низької confidence, слабких setups та імпульсивної торгівлі, щоб покращити дисципліну прийняття рішень.",
  },
  ru: {
    eyebrow: "Execution Pattern Engine",
    title: "Поведенческие паттерны",
    lowConfidence: "Низкая confidence",
    weakSetups: "Слабые setups",
    impulsiveTrades: "Импульсивные сделки",
    description:
      "Этот блок определяет паттерны низкой confidence, слабых setups и импульсивной торговли, чтобы улучшить дисциплину принятия решений.",
  },
  es: {
    eyebrow: "Execution Pattern Engine",
    title: "Patrones conductuales",
    lowConfidence: "Baja confidence",
    weakSetups: "Setups débiles",
    impulsiveTrades: "Trades impulsivos",
    description:
      "Esta sección identifica patrones de baja confidence, setups débiles y operativa impulsiva para mejorar la disciplina decisional.",
  },
  fr: {
    eyebrow: "Execution Pattern Engine",
    title: "Patterns comportementaux",
    lowConfidence: "Faible confidence",
    weakSetups: "Setups faibles",
    impulsiveTrades: "Trades impulsifs",
    description:
      "Cette section identifie les patterns de faible confidence, setups faibles et trading impulsif pour améliorer la discipline décisionnelle.",
  },
  de: {
    eyebrow: "Execution Pattern Engine",
    title: "Verhaltensmuster",
    lowConfidence: "Niedrige Confidence",
    weakSetups: "Schwache Setups",
    impulsiveTrades: "Impulsive Trades",
    description:
      "Dieser Bereich erkennt Muster niedriger Confidence, schwacher Setups und impulsiven Tradings, um die Entscheidungsdisziplin zu verbessern.",
  },
};

export default function ExecutionPatternEngine({
  lowConfidenceTrades,
  weakSetupTrades,
  impulsiveTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

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
              {t.lowConfidence}
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.weakSetups}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakSetupTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.impulsiveTrades}
            </p>

            <h3 className="mt-3 text-4xl font-black text-accent-bright">
              {impulsiveTrades}
            </h3>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}
