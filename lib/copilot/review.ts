type Trade = {
  id: string | number;
  symbol: string;
  outcome: string | null;
  executionRating: number | null;
  confidence: number | null;
  emotionalState: string | null;
};

export function calculateReviewMetrics({
  trades,
  recentTrades,
  totalTrades,
  consistencyScore,
}: {
  trades: Trade[];
  recentTrades: Trade[];
  totalTrades: number;
  consistencyScore: number;
}) {
  const averageExecution =
    totalTrades > 0
      ? Math.round(
          trades.reduce(
            (acc, trade) =>
              acc + (trade.executionRating || 0),
            0
          ) / totalTrades
        )
      : 0;

  const averageConfidence =
    totalTrades > 0
      ? Math.round(
          trades.reduce(
            (acc, trade) =>
              acc + (trade.confidence || 0),
            0
          ) / totalTrades
        )
      : 0;

  const reviewScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        averageExecution * 10 * 0.5 +
          averageConfidence * 10 * 0.3 +
          consistencyScore * 0.2
      )
    )
  );

  const reviewLabel =
    reviewScore >= 85
      ? "Institutional"
      : reviewScore >= 70
      ? "Advanced"
      : reviewScore >= 50
      ? "Developing"
      : "Unstable";

  const latestTrade = recentTrades[0];

  let latestTradeReview = "";

  if (latestTrade) {
    const execution = latestTrade.executionRating || 0;
    const confidence = latestTrade.confidence || 0;

    if (
      latestTrade.outcome === "win" &&
      execution >= 7 &&
      confidence >= 7
    ) {
      latestTradeReview =
        "Trade recente eseguito con buona qualit� decisionale, execution stabile e confidence coerente.";
    } else if (
      latestTrade.outcome === "loss" &&
      execution <= 4
    ) {
      latestTradeReview =
        "La perdita recente mostra segnali di weak execution. Priorit�: migliorare selezione setup ed evitare ingressi impulsivi.";
    } else if (
      latestTrade.outcome === "loss" &&
      confidence <= 4
    ) {
      latestTradeReview =
        "La perdita recente evidenzia bassa confidence operativa. Il focus � evitare trade presi senza piena convinzione.";
    } else if (latestTrade.emotionalState) {
      latestTradeReview =
        "Emotional component detected in the recent trade. VOLTIS recommends a post-session behavioral review.";
    } else {
      latestTradeReview =
        "Il trade recente non mostra anomalie operative significative.";
    }
  }

  return {
    averageExecution,
    averageConfidence,
    reviewScore,
    reviewLabel,
    latestTrade,
    latestTradeReview,
  };
}

