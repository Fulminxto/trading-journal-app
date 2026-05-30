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
      ? "Alcuni segnali richiedono attenzione: mantieni disciplina e monitora execution."
      : "Rischio operativo sotto controllo.";

  return {
    escalationLevel,
    protectionRequired,
    cooldownRecommended,
    message,
  };
}
