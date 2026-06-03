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
      ? "Rischio operativo elevato: riduci frequenza, proteggi capitale e fai review prima di nuove operazioni."
      : escalationLevel === "Cooldown"
      ? "Segnali di deterioramento rilevati: consigliato rallentare, evitare overtrading e tornare a setup puliti."
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

