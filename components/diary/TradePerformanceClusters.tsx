import { normalizeAppLanguage } from "@/lib/i18n";

type Props = {
  strongTrades: number;
  averageTrades: number;
  weakTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  strongTrades: string;
  averageTrades: string;
  weakTrades: string;
  description: string;
};

const labels: Record<string, Labels> = {
  it: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Trade forti",
    averageTrades: "Trade medi",
    weakTrades: "Trade deboli",
    description:
      "VOLTIS raggruppa i trade per qualità operativa per individuare pattern di edge, debolezza e consistenza.",
  },
  en: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Strong Trades",
    averageTrades: "Average Trades",
    weakTrades: "Weak Trades",
    description:
      "VOLTIS groups trades by operational quality to identify edge, weakness and consistency patterns.",
  },
  uk: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Сильні trade",
    averageTrades: "Середні trade",
    weakTrades: "Слабкі trade",
    description:
      "VOLTIS групує trade за операційною якістю, щоб знаходити patterns edge, слабкості та стабільності.",
  },
  ru: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Сильные trade",
    averageTrades: "Средние trade",
    weakTrades: "Слабые trade",
    description:
      "VOLTIS группирует trade по операционному качеству, чтобы находить patterns edge, слабости и стабильности.",
  },
  es: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Trades fuertes",
    averageTrades: "Trades medios",
    weakTrades: "Trades débiles",
    description:
      "VOLTIS agrupa trades por calidad operativa para identificar patrones de edge, debilidad y consistencia.",
  },
  fr: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Trades forts",
    averageTrades: "Trades moyens",
    weakTrades: "Trades faibles",
    description:
      "VOLTIS regroupe les trades par qualité opérationnelle pour identifier les patterns d’edge, de faiblesse et de consistance.",
  },
  de: {
    eyebrow: "Performance Clusters",
    title: "Trade Clustering",
    strongTrades: "Starke Trades",
    averageTrades: "Durchschnittliche Trades",
    weakTrades: "Schwache Trades",
    description:
      "VOLTIS gruppiert Trades nach operativer Qualität, um Edge-, Schwäche- und Konstanzmuster zu erkennen.",
  },
};

export default function TradePerformanceClusters({
  strongTrades,
  averageTrades,
  weakTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {t.strongTrades}
              </p>

              <span className="font-bold text-green-400">
                {strongTrades}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400"
                style={{
                  width: `${Math.min(
                    strongTrades * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {t.averageTrades}
              </p>

              <span className="font-bold text-cyan-400">
                {averageTrades}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{
                  width: `${Math.min(
                    averageTrades * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {t.weakTrades}
              </p>

              <span className="font-bold text-red-400">
                {weakTrades}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-red-400"
                style={{
                  width: `${Math.min(
                    weakTrades * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}

