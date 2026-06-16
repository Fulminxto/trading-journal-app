import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  bestSetup: string;
  weakSetupCount: number;
  strongTradeCount: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  bestSetup: string;
  strongTrades: string;
  weakSetups: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Miglior setup",
    strongTrades: "Trade forti",
    weakSetups: "Setup deboli",
    description:
      "VOLTIS confronta qualità dei setup, execution rating e risultati operativi per individuare dove il trader possiede maggiore edge.",
  },
  en: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Best Setup",
    strongTrades: "Strong Trades",
    weakSetups: "Weak Setups",
    description:
      "VOLTIS compares setup quality, execution rating and operating results to identify where the trader has the strongest edge.",
  },
  uk: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Найкращий setup",
    strongTrades: "Сильні trade",
    weakSetups: "Слабкі setup",
    description:
      "VOLTIS порівнює setup quality, execution rating та операційні результати, щоб визначити, де трейдер має найсильніший edge.",
  },
  ru: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Лучший setup",
    strongTrades: "Сильные trade",
    weakSetups: "Слабые setup",
    description:
      "VOLTIS сравнивает setup quality, execution rating и операционные результаты, чтобы определить, где у трейдера самый сильный edge.",
  },
  es: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Mejor setup",
    strongTrades: "Trades fuertes",
    weakSetups: "Setups débiles",
    description:
      "VOLTIS compara setup quality, execution rating y resultados operativos para identificar dónde el trader tiene mayor edge.",
  },
  fr: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Meilleur setup",
    strongTrades: "Trades forts",
    weakSetups: "Setups faibles",
    description:
      "VOLTIS compare setup quality, execution rating et résultats opérationnels pour identifier où le trader possède le meilleur edge.",
  },
  de: {
    eyebrow: "Edge Detection",
    title: "Trading Edge Engine",
    bestSetup: "Bestes Setup",
    strongTrades: "Starke Trades",
    weakSetups: "Schwache Setups",
    description:
      "VOLTIS vergleicht Setup Quality, Execution Rating und operative Ergebnisse, um zu erkennen, wo der Trader den stärksten Edge hat.",
  },
};

export default function EdgeDetectionEngine({
  bestSetup,
  weakSetupCount,
  strongTradeCount,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#07140f] via-[#0b1a14] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent)_12%,transparent),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.bestSetup}
            </p>

            <h3 className="mt-3 text-2xl font-black text-accent">
              {bestSetup}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.strongTrades}
            </p>

            <h3 className="mt-3 text-4xl font-black text-accent-bright">
              {strongTradeCount}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.weakSetups}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakSetupCount}
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
