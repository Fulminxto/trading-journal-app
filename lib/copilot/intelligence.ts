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
      "La disciplina operativa rimane stabile nelle ultime sessioni."
    );
  }

  if (input.behavioralRisk >= 50) {
    intelligenceFeed.push(
      "Rilevato aumento del rischio comportamentale operativo."
    );
  }

  if (input.revengeRiskTrades > 0) {
    intelligenceFeed.push(
      "Possibili segnali di revenge trading dopo operazioni negative."
    );
  }

  if (input.winStreak >= 3) {
    intelligenceFeed.push(
      `Momentum positivo rilevato: ${input.winStreak} win consecutivi.`
    );
  }

  if (input.lossStreak >= 3) {
    intelligenceFeed.push(
      `Drawdown comportamentale rilevato: ${input.lossStreak} loss consecutivi.`
    );
  }

  if (input.weakTimeTrades > 0) {
    intelligenceFeed.push(
      "Qualità execution ridotta nelle fasce orarie serali."
    );
  }

  if (input.behavioralDrift) {
    intelligenceFeed.push(
      `Behavioral drift rilevato: qualità recente ${input.recentAverageQuality}% vs precedente ${input.previousAverageQuality}%.`
    );
  }

  if (input.recoveryDetected) {
    intelligenceFeed.push(
      `Recovery intelligence rileva segnali di recupero operativo (${input.recoveryLabel}).`
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
      "AI Risk Supervisor rileva rischio operativo critico: riduzione immediata della frequenza consigliata."
    );
  }

  if (input.emotionalVolatility) {
    intelligenceFeed.push(
      `Emotional stability engine rileva instabilità emotiva elevata (${input.emotionalInstabilityScore}%).`
    );
  }

  if (input.consistencyScore >= 80) {
    intelligenceFeed.push(
      "Consistency engine rileva una struttura operativa altamente stabile."
    );
  }

  if (input.consistencyScore <= 45 && input.totalTrades > 0) {
    intelligenceFeed.push(
      "Consistency engine rileva instabilità operativa e deterioramento decisionale."
    );
  }

  if (input.reviewScore >= 85) {
    intelligenceFeed.push(
      "AI Review Engine rileva execution e decision making di livello avanzato."
    );
  }

  if (input.reviewScore <= 50 && input.totalTrades > 0) {
    intelligenceFeed.push(
      "AI Review Engine rileva deterioramento nella qualità decisionale e execution."
    );
  }

  if (input.latestTradeReview.length > 0) {
    intelligenceFeed.push(input.latestTradeReview);
  }

  return intelligenceFeed;
}