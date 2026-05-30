type Input = {
  escalationLevel: string;
  protectionRequired: boolean;
  cooldownRecommended: boolean;
  lossStreak: number;
  behavioralRisk: number;
};

export function buildSessionLock({
  escalationLevel,
  protectionRequired,
  cooldownRecommended,
  lossStreak,
  behavioralRisk,
}: Input) {
  const sessionLocked =
    protectionRequired ||
    escalationLevel === "Protection" ||
    lossStreak >= 3 ||
    behavioralRisk >= 75;

  const reviewRequired =
    sessionLocked ||
    cooldownRecommended ||
    behavioralRisk >= 50;

  const lockReason =
    sessionLocked
      ? "Rischio operativo elevato. VOLTIS consiglia stop temporaneo e review obbligatoria prima di continuare."
      : reviewRequired
      ? "Cooldown consigliato. Prima di continuare, completa una review mentale e operativa."
      : "Sessione operativa stabile. Nessun lock richiesto.";

  return {
    sessionLocked,
    reviewRequired,
    lockReason,
  };
}
