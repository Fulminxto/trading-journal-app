import Card from "@/components/ui/Card";
import AnalyticsSection from "./AnalyticsSection";
import {
  getAnalyticsLabels,
  type AnalyticsI18nProps,
} from "./AnalyticsI18n";

type Props = AnalyticsI18nProps & {
  winRate: number;
  averageRR: number;
  totalPnl: number;
  tradeCount: number;
  hasRiskRewardData: boolean;
  bestSymbol?: string;
  symbolCount: number;
};

const MIN_INSIGHT_SAMPLE_SIZE = 5;

export default function PerformanceInsights({
  winRate,
  averageRR,
  totalPnl,
  tradeCount,
  hasRiskRewardData,
  bestSymbol,
  symbolCount,
  appLanguage,
}: Props) {
  const t = getAnalyticsLabels(appLanguage);
  const hasTradeData = tradeCount > 0;
  const hasLimitedSample =
    hasTradeData && tradeCount < MIN_INSIGHT_SAMPLE_SIZE;
  const hasMarketComparison =
    symbolCount >= 2;

  const insights = [
    {
      title: t.performanceHealth,
      label: hasTradeData
        ? totalPnl > 0
          ? hasLimitedSample
            ? `${t.positive} - limited sample`
            : t.positive
          : totalPnl < 0
            ? t.defensive
            : t.pending
        : "Insufficient data",
      tone:
        !hasTradeData || totalPnl === 0 || hasLimitedSample
          ? "text-muted-faint"
          : totalPnl > 0
          ? "text-green-400"
          : "text-red-400",
      text:
        !hasTradeData
          ? "Record trades to generate a supported performance health insight."
          : totalPnl === 0
            ? "Performance is flat for the selected period. More trade data is needed before calling the phase positive or defensive."
            : hasLimitedSample && totalPnl > 0
              ? "The account is currently profitable, but more trades are required to assess consistency and risk stability."
          : totalPnl > 0
          ? t.positivePerformanceText
          : t.defensivePerformanceText,
    },
    {
      title: t.winRateQuality,
      label: hasTradeData
        ? hasLimitedSample
          ? "Limited sample"
          : winRate >= 50
          ? t.stable
          : t.review
        : "Insufficient data",
      tone:
        !hasTradeData || hasLimitedSample
          ? "text-muted-faint"
          : winRate >= 50
          ? "text-accent-bright"
          : "text-yellow-400",
      text:
        !hasTradeData
          ? "Record closed trades before evaluating win rate quality."
          : hasLimitedSample
            ? `A ${winRate.toFixed(0)}% win rate across ${tradeCount} ${tradeCount === 1 ? "trade" : "trades"} is encouraging, but more observations are required to evaluate consistency.`
          : winRate >= 50
          ? t.stableWinRateText
          : t.weakWinRateText,
    },
    {
      title: t.riskReward,
      label: hasRiskRewardData
        ? averageRR >= 1.5
          ? t.healthy
          : t.weak
        : "Insufficient data",
      tone:
        !hasRiskRewardData
          ? "text-muted-faint"
          : averageRR >= 1.5
          ? "text-accent"
          : "text-yellow-400",
      text:
        !hasRiskRewardData
          ? "Record risk/reward values to evaluate this signal."
          : averageRR >= 1.5
          ? t.healthyRiskRewardText
          : t.weakRiskRewardText,
    },
    {
      title: t.marketEdge,
      label: bestSymbol
        ? hasMarketComparison
          ? bestSymbol
          : `${bestSymbol} only`
        : t.pending,
      tone:
        bestSymbol && hasMarketComparison
          ? "text-green-400"
          : "text-muted-faint",
      text: bestSymbol
        ? hasMarketComparison
          ? t.bestSymbolText(bestSymbol)
          : `${bestSymbol} is currently the only recorded instrument. More symbols or observations are required to compare market edge.`
        : t.noMarketEdgeText,
    },
  ];

  return (
    <AnalyticsSection
      subtitle={t.performanceInsights}
      title={t.voltisIntelligence}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {insights.map((insight) => (
          <Card
            key={insight.title}
            variant="inner"
            className="p-5"
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

            <p className="mt-4 text-sm leading-relaxed text-muted">
              {insight.text}
            </p>
          </Card>
        ))}
      </div>
    </AnalyticsSection>
  );
}
