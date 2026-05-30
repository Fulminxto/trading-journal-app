import { calculateCopilotAnalytics } from "@/lib/copilot/analytics";
import { calculatePatternMetrics } from "@/lib/copilot/patterns";
import { calculateReviewMetrics } from "@/lib/copilot/review";
import { calculateStabilityMetrics } from "@/lib/copilot/stability";
import { buildIntelligenceFeed } from "@/lib/copilot/intelligence";
import { buildAdaptiveCoachingMode } from "@/lib/copilot/coaching";
import { buildRiskEscalation } from "@/lib/copilot/escalation";
import { buildSessionLock } from "@/lib/copilot/sessionLock";

export function buildCopilotSystem({
  trades,
  copilotMemories,
}: {
  trades: any[];
  copilotMemories: any[];
}) {
  const analytics =
    calculateCopilotAnalytics(trades);

  const {
    totalTrades,
    winRate,
    behavioralRisk,
    disciplineScore,
    recentTrades,
    lossStreak,
    winStreak,
  } = analytics;

  const patternMetrics =
    calculatePatternMetrics(recentTrades);

  const {
    revengeRiskTrades,
    weakTimeTrades,
  } = patternMetrics;

  const performanceTimeline = trades
    .slice()
    .sort(
      (a, b) =>
        new Date(a.openDate).getTime() -
        new Date(b.openDate).getTime()
    )
    .map((trade, index) => {
      const execution =
        trade.executionRating || 0;

      const confidence =
        trade.confidence || 0;

      const isEmotional =
        trade.emotionalState &&
        trade.emotionalState.length > 0;

      const qualityScore = Math.max(
        0,
        Math.min(
          100,
          Math.round(
            execution * 5 +
              confidence * 3 +
              (trade.outcome === "win"
                ? 20
                : 0) -
              (isEmotional ? 15 : 0)
          )
        )
      );

      return {
        id: trade.id,
        index: index + 1,
        symbol: trade.symbol,
        outcome: trade.outcome,
        qualityScore,
      };
    });

  const consistencyScore =
    totalTrades === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(
              winRate * 0.45 +
                disciplineScore * 0.35 -
                behavioralRisk * 0.2
            )
          )
        );

  const consistencyLabel =
    consistencyScore >= 80
      ? "Elite"
      : consistencyScore >= 65
      ? "Stable"
      : consistencyScore >= 45
      ? "Developing"
      : "Fragile";

  const review =
    calculateReviewMetrics({
      trades,
      recentTrades,
      totalTrades,
      consistencyScore,
    });

  const {
    averageExecution,
    averageConfidence,
    reviewScore,
    reviewLabel,
    latestTrade,
    latestTradeReview,
  } = review;

  const recentWins = recentTrades.filter(
    (trade) => trade.outcome === "win"
  ).length;

  const recentLosses = recentTrades.filter(
    (trade) => trade.outcome === "loss"
  ).length;

  const recoveryDetected =
    recentWins >= 2 &&
    recentWins > recentLosses;

  const recoveryScore = recoveryDetected
    ? Math.min(
        100,
        Math.round(
          recentWins * 20 - recentLosses * 5
        )
      )
    : 0;

  const recoveryLabel =
    recoveryScore >= 80
      ? "Strong"
      : recoveryScore >= 60
      ? "Recovering"
      : recoveryScore > 0
      ? "Weak"
      : "None";

  const stability =
    calculateStabilityMetrics({
      performanceTimeline,
      recentTrades,
      behavioralRisk,
      recoveryDetected,
      recoveryScore,
    });

  const {
    recentAverageQuality,
    previousAverageQuality,
    behavioralDrift,
    recentExecutionAverage,
    previousExecutionAverage,
    executionDecay,
    recentConfidenceAverage,
    previousConfidenceAverage,
    confidenceDecay,
    emotionalRecentTrades,
    emotionalTradesCount,
    emotionalInstabilityScore,
    emotionalVolatility,
    emotionalLabel,
    riskSignals,
    supervisorLevel,
  } = stability;

  const intelligenceFeed =
    buildIntelligenceFeed({
      disciplineScore,
      behavioralRisk,
      revengeRiskTrades,
      winStreak,
      lossStreak,
      weakTimeTrades,
      behavioralDrift,
      recentAverageQuality,
      previousAverageQuality,
      recoveryDetected,
      recoveryLabel,
      executionDecay,
      recentExecutionAverage,
      previousExecutionAverage,
      confidenceDecay,
      recentConfidenceAverage,
      previousConfidenceAverage,
      supervisorLevel,
      emotionalVolatility,
      emotionalInstabilityScore,
      consistencyScore,
      totalTrades,
      reviewScore,
      latestTradeReview,
    });

  const adaptiveCoaching =
    buildAdaptiveCoachingMode({
      supervisorLevel,
      behavioralRisk,
      disciplineScore,
      consistencyScore,
      memories: copilotMemories,
    });

  const riskEscalation =
    buildRiskEscalation({
      supervisorLevel,
      behavioralRisk,
      riskSignals,
      emotionalVolatility,
      executionDecay,
      confidenceDecay,
    });

  const sessionLock =
    buildSessionLock({
      escalationLevel:
        riskEscalation.escalationLevel,
      protectionRequired:
        riskEscalation.protectionRequired,
      cooldownRecommended:
        riskEscalation.cooldownRecommended,
      lossStreak,
      behavioralRisk,
    });

  return {
    analytics,
    patternMetrics,
    performanceTimeline,
    consistencyScore,
    consistencyLabel,
    review,
    recentWins,
    recentLosses,
    recoveryDetected,
    recoveryScore,
    recoveryLabel,
    stability,
    intelligenceFeed,
    adaptiveCoaching,
    riskEscalation,
    sessionLock,
  };
}
