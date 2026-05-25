type TimelineItem = {
  qualityScore: number;
};

type Trade = {
  executionRating: number | null;
  confidence: number | null;
  emotionalState: string | null;
};

export function calculateStabilityMetrics({
  performanceTimeline,
  recentTrades,
  behavioralRisk,
  recoveryDetected,
  recoveryScore,
}: {
  performanceTimeline: TimelineItem[];
  recentTrades: Trade[];
  behavioralRisk: number;
  recoveryDetected: boolean;
  recoveryScore: number;
}) {
  const recentQuality = performanceTimeline.slice(-5);
  const previousQuality = performanceTimeline.slice(-10, -5);

  const recentAverageQuality =
    recentQuality.length > 0
      ? Math.round(
          recentQuality.reduce(
            (acc, item) => acc + item.qualityScore,
            0
          ) / recentQuality.length
        )
      : 0;

  const previousAverageQuality =
    previousQuality.length > 0
      ? Math.round(
          previousQuality.reduce(
            (acc, item) => acc + item.qualityScore,
            0
          ) / previousQuality.length
        )
      : 0;

  const behavioralDrift =
    previousAverageQuality > 0 &&
    recentAverageQuality < previousAverageQuality - 15;

  const recentExecutionAverage =
    recentQuality.length > 0
      ? Math.round(
          recentTrades
            .slice(0, 5)
            .reduce(
              (acc, trade) =>
                acc + (trade.executionRating || 0),
              0
            ) / recentQuality.length
        )
      : 0;

  const previousExecutionAverage =
    previousQuality.length > 0
      ? Math.round(
          recentTrades
            .slice(5, 10)
            .reduce(
              (acc, trade) =>
                acc + (trade.executionRating || 0),
              0
            ) / previousQuality.length
        )
      : 0;

  const executionDecay =
    previousExecutionAverage > 0 &&
    recentExecutionAverage < previousExecutionAverage - 2;

  const recentConfidenceAverage =
    recentQuality.length > 0
      ? Math.round(
          recentTrades
            .slice(0, 5)
            .reduce(
              (acc, trade) =>
                acc + (trade.confidence || 0),
              0
            ) / recentQuality.length
        )
      : 0;

  const previousConfidenceAverage =
    previousQuality.length > 0
      ? Math.round(
          recentTrades
            .slice(5, 10)
            .reduce(
              (acc, trade) =>
                acc + (trade.confidence || 0),
              0
            ) / previousQuality.length
        )
      : 0;

  const confidenceDecay =
    previousConfidenceAverage > 0 &&
    recentConfidenceAverage < previousConfidenceAverage - 2;

  const emotionalRecentTrades = recentTrades.slice(0, 10);

  const emotionalTradesCount = emotionalRecentTrades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  const emotionalInstabilityScore =
    emotionalRecentTrades.length > 0
      ? Math.round(
          (emotionalTradesCount /
            emotionalRecentTrades.length) *
            100
        )
      : 0;

  const emotionalVolatility =
    emotionalInstabilityScore >= 60;

  const emotionalLabel =
    emotionalInstabilityScore >= 80
      ? "Critical"
      : emotionalInstabilityScore >= 60
      ? "High"
      : emotionalInstabilityScore >= 40
      ? "Moderate"
      : "Stable";

  const riskSignals = [
    behavioralDrift,
    executionDecay,
    confidenceDecay,
    recoveryDetected && recoveryScore < 60,
    behavioralRisk >= 50,
  ].filter(Boolean).length;

  const supervisorLevel =
    riskSignals >= 4
      ? "Critical"
      : riskSignals >= 3
      ? "High"
      : riskSignals >= 2
      ? "Moderate"
      : "Controlled";

  return {
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
  };
}