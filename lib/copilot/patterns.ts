type Trade = {
  outcome: string | null;
  executionRating: number | null;
  confidence: number | null;
  emotionalState: string | null;
  openTime: string | null;
};

type Pattern = {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  occurrences: number;
};

export function calculatePatternMetrics(
  recentTrades: Trade[]
) {
  const revengeRiskTrades = recentTrades.filter(
    (trade, index) => {
      const previousTrade =
        recentTrades[index + 1];

      return (
        previousTrade?.outcome === "loss" &&
        trade.executionRating !== null &&
        trade.executionRating <= 4
      );
    }
  ).length;

  const weakTimeTrades = recentTrades.filter(
    (trade) => {
      if (!trade.openTime) {
        return false;
      }

      const hour = Number(
        trade.openTime.split(":")[0]
      );

      return hour >= 20 || hour <= 2;
    }
  ).length;

  const copilotPatterns: Pattern[] = [];

  if (revengeRiskTrades >= 2) {
    copilotPatterns.push({
      id: "revenge-trading",
      type: "Behavioral",
      title: "Revenge Trading Risk",
      description:
        "Sequenze operative mostrano possibili ingressi impulsivi dopo loss consecutive.",
      severity:
        revengeRiskTrades >= 4
          ? "critical"
          : "high",
      occurrences: revengeRiskTrades,
    });
  }

  if (weakTimeTrades >= 3) {
    copilotPatterns.push({
      id: "weak-time-execution",
      type: "Execution",
      title: "Weak Night Execution",
      description:
        "Execution quality ridotta nelle fasce orarie serali/notturne.",
      severity:
        weakTimeTrades >= 5
          ? "high"
          : "medium",
      occurrences: weakTimeTrades,
    });
  }

  const emotionalTrades = recentTrades.filter(
    (trade) =>
      trade.emotionalState &&
      trade.emotionalState.length > 0
  ).length;

  if (emotionalTrades >= 4) {
    copilotPatterns.push({
      id: "emotional-instability",
      type: "Psychology",
      title: "Emotional Instability",
      description:
        "Frequente presenza di componenti emotive durante execution e gestione trade.",
      severity:
        emotionalTrades >= 7
          ? "critical"
          : "high",
      occurrences: emotionalTrades,
    });
  }

  const criticalPatterns =
    copilotPatterns.filter(
      (pattern) =>
        pattern.severity === "critical"
    );

  const highPatterns =
    copilotPatterns.filter(
      (pattern) =>
        pattern.severity === "high"
    );

  return {
    revengeRiskTrades,
    weakTimeTrades,
    copilotPatterns,
    criticalPatterns,
    highPatterns,
  };
}