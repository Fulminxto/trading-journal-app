type Input = {
  disciplineScore: number;
  behavioralRisk: number;
  revengeRiskTrades: number;
  winStreak: number;
  lossStreak: number;
  weakTimeTrades: number;
  behavioralDrift: boolean;
  recentAverageQuality: number;
  previousAverageQuality: number;
  recoveryDetected: boolean;
  recoveryLabel: string;
  executionDecay: boolean;
  recentExecutionAverage: number;
  previousExecutionAverage: number;
  confidenceDecay: boolean;
  recentConfidenceAverage: number;
  previousConfidenceAverage: number;
  supervisorLevel: string;
  emotionalVolatility: boolean;
  emotionalInstabilityScore: number;
  consistencyScore: number;
  totalTrades: number;
  reviewScore: number;
  latestTradeReview: string;
};

export function buildIntelligenceFeed(input: Input) {
  const intelligenceFeed: string[] = [];

  if (input.disciplineScore >= 80) {
    intelligenceFeed.push(
      "Operational discipline remains stable across recent sessions."
    );
  }

  if (input.behavioralRisk >= 50) {
    intelligenceFeed.push(
      "Increase in operational behavioral risk detected."
    );
  }

  if (input.revengeRiskTrades > 0) {
    intelligenceFeed.push(
      "Possibili segnali di revenge trading dopo operazioni negative."
    );
  }

  if (input.winStreak >= 3) {
    intelligenceFeed.push(
      `Positive momentum detected: ${input.winStreak} consecutive wins.`
    );
  }

  if (input.lossStreak >= 3) {
    intelligenceFeed.push(
      `Behavioral drawdown detected: ${input.lossStreak} consecutive losses.`
    );
  }

  if (input.weakTimeTrades > 0) {
    intelligenceFeed.push(
      "Qualit� execution ridotta nelle fasce orarie serali."
    );
  }

  if (input.behavioralDrift) {
    intelligenceFeed.push(
      `Behavioral drift rilevato: qualit� recente ${input.recentAverageQuality}% vs precedente ${input.previousAverageQuality}%.`
    );
  }

  if (input.recoveryDetected) {
    intelligenceFeed.push(
      `Recovery intelligence detects operational recovery signals (${input.recoveryLabel}).`
    );
  }

  if (input.executionDecay) {
    intelligenceFeed.push(
      `Execution stability rileva deterioramento: execution recente ${input.recentExecutionAverage}/10 vs precedente ${input.previousExecutionAverage}/10.`
    );
  }

  if (input.confidenceDecay) {
    intelligenceFeed.push(
      `Confidence stability rileva deterioramento: confidence recente ${input.recentConfidenceAverage}/10 vs precedente ${input.previousConfidenceAverage}/10.`
    );
  }

  if (input.supervisorLevel === "Critical") {
    intelligenceFeed.push(
      "AI Risk Supervisor detects critical operational risk: immediate frequency reduction recommended."
    );
  }

  if (input.emotionalVolatility) {
    intelligenceFeed.push(
      `Emotional stability engine rileva instabilit� emotiva elevata (${input.emotionalInstabilityScore}%).`
    );
  }

  if (input.consistencyScore >= 80) {
    intelligenceFeed.push(
      "Consistency engine detects a highly stable operating structure."
    );
  }

  if (input.consistencyScore <= 45 && input.totalTrades > 0) {
    intelligenceFeed.push(
      "Consistency engine rileva instabilit� operativa e deterioramento decisionale."
    );
  }

  if (input.reviewScore >= 85) {
    intelligenceFeed.push(
      "AI Review Engine detects advanced execution and decision-making quality."
    );
  }

  if (input.reviewScore <= 50 && input.totalTrades > 0) {
    intelligenceFeed.push(
      "AI Review Engine rileva deterioramento nella qualit� decisionale e execution."
    );
  }

  if (input.latestTradeReview.length > 0) {
    intelligenceFeed.push(input.latestTradeReview);
  }

  return intelligenceFeed;
}

