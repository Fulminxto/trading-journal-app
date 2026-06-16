import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type Props = {
  totalTrades: number;
  highQualityTrades: number;
  weakExecutionTrades: number;
  disciplineScore: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  title: string;
  phase1: string;
  phase2: string;
  phase3: string;
  journalActive: string;
  waitingForData: string;
  qualityImproving: string;
  executionNeedsRefinement: string;
  disciplineStable: string;
  disciplineDeveloping: string;
  description: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    eyebrow: "AI Performance Timeline",
    title: "Evoluzione trader",
    phase1: "Fase 1 — Base dati",
    phase2: "Fase 2 — Qualità execution",
    phase3: "Fase 3 — Maturità disciplina",
    journalActive: "Journal attivo",
    waitingForData: "In attesa di dati trade",
    qualityImproving: "Qualità in miglioramento",
    executionNeedsRefinement: "Execution da raffinare",
    disciplineStable: "Disciplina sempre più stabile",
    disciplineDeveloping: "Disciplina ancora in sviluppo",
    description:
      "VOLTIS interpreta i dati del journal come una timeline di crescita, mostrando come il trader evolve in qualità, disciplina ed esecuzione.",
  },
  en: {
    eyebrow: "AI Performance Timeline",
    title: "Trader Evolution",
    phase1: "Phase 1 — Data Foundation",
    phase2: "Phase 2 — Execution Quality",
    phase3: "Phase 3 — Discipline Maturity",
    journalActive: "Journal active",
    waitingForData: "Waiting for trade data",
    qualityImproving: "Quality improving",
    executionNeedsRefinement: "Execution needs refinement",
    disciplineStable: "Discipline becoming stable",
    disciplineDeveloping: "Discipline still developing",
    description:
      "VOLTIS interprets journal data as a growth timeline, showing how the trader evolves in quality, discipline and execution.",
  },
  uk: {
    eyebrow: "AI Performance Timeline",
    title: "Еволюція трейдера",
    phase1: "Фаза 1 — База даних",
    phase2: "Фаза 2 — Якість execution",
    phase3: "Фаза 3 — Зрілість дисципліни",
    journalActive: "Journal активний",
    waitingForData: "Очікування trade data",
    qualityImproving: "Якість покращується",
    executionNeedsRefinement: "Execution потребує покращення",
    disciplineStable: "Дисципліна стає стабільною",
    disciplineDeveloping: "Дисципліна ще розвивається",
    description:
      "VOLTIS інтерпретує дані journal як timeline росту, показуючи, як трейдер розвивається в якості, дисципліні та execution.",
  },
  ru: {
    eyebrow: "AI Performance Timeline",
    title: "Эволюция трейдера",
    phase1: "Фаза 1 — База данных",
    phase2: "Фаза 2 — Качество execution",
    phase3: "Фаза 3 — Зрелость дисциплины",
    journalActive: "Journal активен",
    waitingForData: "Ожидание trade data",
    qualityImproving: "Качество улучшается",
    executionNeedsRefinement: "Execution требует улучшения",
    disciplineStable: "Дисциплина становится стабильной",
    disciplineDeveloping: "Дисциплина еще развивается",
    description:
      "VOLTIS интерпретирует данные journal как timeline роста, показывая, как трейдер развивается в качестве, дисциплине и execution.",
  },
  es: {
    eyebrow: "AI Performance Timeline",
    title: "Evolución del trader",
    phase1: "Fase 1 — Base de datos",
    phase2: "Fase 2 — Calidad execution",
    phase3: "Fase 3 — Madurez disciplinaria",
    journalActive: "Journal activo",
    waitingForData: "Esperando datos de trades",
    qualityImproving: "Calidad mejorando",
    executionNeedsRefinement: "Execution necesita refinamiento",
    disciplineStable: "Disciplina cada vez más estable",
    disciplineDeveloping: "Disciplina aún en desarrollo",
    description:
      "VOLTIS interpreta los datos del journal como una timeline de crecimiento, mostrando cómo el trader evoluciona en calidad, disciplina y execution.",
  },
  fr: {
    eyebrow: "AI Performance Timeline",
    title: "Évolution du trader",
    phase1: "Phase 1 — Base de données",
    phase2: "Phase 2 — Qualité execution",
    phase3: "Phase 3 — Maturité discipline",
    journalActive: "Journal actif",
    waitingForData: "En attente de données trade",
    qualityImproving: "Qualité en amélioration",
    executionNeedsRefinement: "Execution à affiner",
    disciplineStable: "Discipline de plus en plus stable",
    disciplineDeveloping: "Discipline encore en développement",
    description:
      "VOLTIS interprète les données du journal comme une timeline de croissance, montrant comment le trader évolue en qualité, discipline et execution.",
  },
  de: {
    eyebrow: "AI Performance Timeline",
    title: "Trader-Entwicklung",
    phase1: "Phase 1 — Datenbasis",
    phase2: "Phase 2 — Execution-Qualität",
    phase3: "Phase 3 — Disziplinreife",
    journalActive: "Journal aktiv",
    waitingForData: "Warten auf Trade-Daten",
    qualityImproving: "Qualität verbessert sich",
    executionNeedsRefinement: "Execution braucht Feinschliff",
    disciplineStable: "Disziplin wird stabiler",
    disciplineDeveloping: "Disziplin entwickelt sich noch",
    description:
      "VOLTIS interpretiert Journal-Daten als Wachstumstimeline und zeigt, wie sich der Trader in Qualität, Disziplin und Execution entwickelt.",
  },
};

export default function AIPerformanceTimeline({
  totalTrades,
  highQualityTrades,
  weakExecutionTrades,
  disciplineScore,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_10%,transparent),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
          {t.eyebrow}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.title}
        </h2>

        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.phase1}
            </p>

            <h3 className="mt-2 text-xl font-black text-accent-bright">
              {totalTrades > 0
                ? t.journalActive
                : t.waitingForData}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.phase2}
            </p>

            <h3 className="mt-2 text-xl font-black text-accent">
              {highQualityTrades > weakExecutionTrades
                ? t.qualityImproving
                : t.executionNeedsRefinement}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.phase3}
            </p>

            <h3 className="mt-2 text-xl font-black text-violet-400">
              {disciplineScore >= 70
                ? t.disciplineStable
                : t.disciplineDeveloping}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.description}
        </p>
      </div>
    </div>
  );
}
