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
      ? "Cooldown recommended. Before continuing, complete a mental and operational review."
      : "Trading session is stable. No lock required.";

  return {
    sessionLocked,
    reviewRequired,
    lockReason,
  };
}

