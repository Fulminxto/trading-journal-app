import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import AnalyticsSection from "./AnalyticsSection";

type Props = {
  averageConfidence: number;
  averageExecution: number;
  averageSetupQuality: number;
  appLanguage?: string | null;
};

type Labels = {
  subtitle: string;
  title: string;
  confidence: string;
  execution: string;
  setupQuality: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    subtitle: "Intelligence psicologica",
    title: "Psicologia trader",
    confidence: "Confidence",
    execution: "Execution",
    setupQuality: "Qualità setup",
  },
  en: {
    subtitle: "Psychology intelligence",
    title: "Trader Psychology",
    confidence: "Confidence",
    execution: "Execution",
    setupQuality: "Setup Quality",
  },
  uk: {
    subtitle: "Психологічна аналітика",
    title: "Психологія трейдера",
    confidence: "Впевненість",
    execution: "Виконання",
    setupQuality: "Якість setup",
  },
  ru: {
    subtitle: "Психологическая аналитика",
    title: "Психология трейдера",
    confidence: "Уверенность",
    execution: "Исполнение",
    setupQuality: "Качество setup",
  },
  es: {
    subtitle: "Intelligence psicológica",
    title: "Psicología del trader",
    confidence: "Confianza",
    execution: "Ejecución",
    setupQuality: "Calidad del setup",
  },
  fr: {
    subtitle: "Intelligence psychologique",
    title: "Psychologie du trader",
    confidence: "Confiance",
    execution: "Exécution",
    setupQuality: "Qualité du setup",
  },
  de: {
    subtitle: "Psychologie Intelligence",
    title: "Trader-Psychologie",
    confidence: "Confidence",
    execution: "Execution",
    setupQuality: "Setup-Qualität",
  },
};

export default function PsychologyAnalytics({
  averageConfidence,
  averageExecution,
  averageSetupQuality,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  return (
    <AnalyticsSection subtitle={t.subtitle} title={t.title}>
      <div className="space-y-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{t.confidence}</span>
            <span className="font-bold text-accent-bright">{averageConfidence}/10</span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{t.execution}</span>
            <span className="font-bold text-violet-400">{averageExecution}/10</span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{t.setupQuality}</span>
            <span className="font-bold text-yellow-400">{averageSetupQuality}/10</span>
          </div>
        </div>
      </div>
    </AnalyticsSection>
  );
}
