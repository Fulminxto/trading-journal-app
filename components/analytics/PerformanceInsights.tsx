import AnalyticsSection from "./AnalyticsSection";
import {
  getAnalyticsLabels,
  type AnalyticsI18nProps,
} from "./AnalyticsI18n";

type Props = AnalyticsI18nProps & {
  winRate: number;
  averageRR: number;
  totalPnl: number;
  bestSymbol?: string;
};

export default function PerformanceInsights({
  winRate,
  averageRR,
  totalPnl,
  bestSymbol,
  appLanguage,
}: Props) {
  const t = getAnalyticsLabels(appLanguage);

  const insights = [
    {
      title: t.performanceHealth,
      label: totalPnl >= 0 ? t.positive : t.defensive,
      tone:
        totalPnl >= 0
          ? "text-green-400"
          : "text-red-400",
      text:
        totalPnl >= 0
          ? t.positivePerformanceText
          : t.defensivePerformanceText,
    },
    {
      title: t.winRateQuality,
      label: winRate >= 50 ? t.stable : t.review,
      tone:
        winRate >= 50
          ? "text-cyan-400"
          : "text-yellow-400",
      text:
        winRate >= 50
          ? t.stableWinRateText
          : t.weakWinRateText,
    },
    {
      title: t.riskReward,
      label: averageRR >= 1.5 ? t.healthy : t.weak,
      tone:
        averageRR >= 1.5
          ? "text-violet-400"
          : "text-yellow-400",
      text:
        averageRR >= 1.5
          ? t.healthyRiskRewardText
          : t.weakRiskRewardText,
    },
    {
      title: t.marketEdge,
      label: bestSymbol || t.pending,
      tone: bestSymbol
        ? "text-green-400"
        : "text-gray-400",
      text: bestSymbol
        ? t.bestSymbolText(bestSymbol)
        : t.noMarketEdgeText,
    },
  ];

  return (
    <div className="xl:col-span-2">
      <AnalyticsSection
        subtitle={t.performanceInsights}
        title={t.voltisIntelligence}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {insights.map((insight) => (
            <div
              key={insight.title}
              className="group rounded-3xl border border-white/10 bg-black/20 p-5 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="font-bold text-white">
                  {insight.title}
                </p>

                <span
                  className={`rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-bold ${insight.tone}`}
                >
                  {insight.label}
                </span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </AnalyticsSection>
    </div>
  );
}
