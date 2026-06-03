type Memory = {
  title: string;
  severity: string;
  score: number;
};

type Input = {
  supervisorLevel: string;
  behavioralRisk: number;
  disciplineScore: number;
  consistencyScore: number;
  memories: Memory[];
};

export function buildAdaptiveCoachingMode({
  supervisorLevel,
  behavioralRisk,
  disciplineScore,
  consistencyScore,
  memories,
}: Input) {
  const hasCriticalMemory = memories.some(
    (memory) => memory.severity === "critical"
  );

  const hasHighMemory = memories.some(
    (memory) => memory.severity === "high"
  );

  if (
    supervisorLevel === "Critical" ||
    hasCriticalMemory
  ) {
    return {
      mode: "Protection Mode",
      tone: "strict",
      message:
        "VOLTIS rileva rischio operativo critico. PrioritÃ : ridurre frequenza, proteggere capitale e fare review prima di nuove operazioni.",
    };
  }

  if (
    supervisorLevel === "High" ||
    hasHighMemory ||
    behavioralRisk >= 50
  ) {
    return {
      mode: "Discipline Mode",
      tone: "direct",
      message:
        "VOLTIS rileva rischio comportamentale elevato. Focus: execution pulita, niente revenge trading e massima selettivitÃ .",
    };
  }

  if (
    disciplineScore >= 80 &&
    consistencyScore >= 75
  ) {
    return {
      mode: "Optimization Mode",
      tone: "growth",
      message:
        "La struttura operativa Ã¨ stabile. Focus: ottimizzare edge, scalare con controllo e mantenere disciplina.",
    };
  }

  return {
    mode: "Development Mode",
    tone: "supportive",
    message:
      "VOLTIS rileva una fase di sviluppo. Focus: costruire routine, migliorare consistenza e ridurre errori ripetuti.",
  };
}

