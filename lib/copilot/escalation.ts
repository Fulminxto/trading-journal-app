type Input = {
  supervisorLevel: string;
  behavioralRisk: number;
  riskSignals: number;
  emotionalVolatility: boolean;
  executionDecay: boolean;
  confidenceDecay: boolean;
};

export function buildRiskEscalation({
  supervisorLevel,
  behavioralRisk,
  riskSignals,
  emotionalVolatility,
  executionDecay,
  confidenceDecay,
}: Input) {
  const protectionRequired =
    supervisorLevel === "Critical" ||
    riskSignals >= 4 ||
    behavioralRisk >= 70;

  const cooldownRecommended =
    emotionalVolatility ||
    executionDecay ||
    confidenceDecay ||
    behavioralRisk >= 50;

  const escalationLevel =
    protectionRequired
      ? "Protection"
      : cooldownRecommended
      ? "Cooldown"
      : riskSignals >= 2
      ? "Monitor"
      : "Normal";

  const message =
    escalationLevel === "Protection"
      ? "Elevated operational risk: reduce frequency, protect capital and review before taking new trades."
      : escalationLevel === "Cooldown"
      ? "Deterioration signals detected: slow down, avoid overtrading and return to clean setups."
      : escalationLevel === "Monitor"
      ? "Some signals require attention: maintain discipline and monitor execution."
      : "Operational risk is under control.";

  return {
    escalationLevel,
    protectionRequired,
    cooldownRecommended,
    message,
  };
}


