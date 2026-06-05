import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import AnalyticsSection from "./AnalyticsSection";

type Props = {
  averageWin: string;
  averageLoss: string;
  profitFactor: string;
  bestWinStreak: number;
  appLanguage?: string | null;
};

type Labels = {
  subtitle: string;
  title: string;
  averageWin: string;
  averageLoss: string;
  bestWinStreak: string;
  profitFactor: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    subtitle: "Intelligence performance",
    title: "Metriche avanzate",
    averageWin: "Win media",
    averageLoss: "Loss media",
    bestWinStreak: "Migliore serie di win",
    profitFactor: "Profit Factor",
  },
  en: {
    subtitle: "Performance intelligence",
    title: "Advanced Metrics",
    averageWin: "Average Win",
    averageLoss: "Average Loss",
    bestWinStreak: "Best Win Streak",
    profitFactor: "Profit Factor",
  },
  uk: {
    subtitle: "Аналітика performance",
    title: "Розширені метрики",
    averageWin: "Середній виграш",
    averageLoss: "Середній збиток",
    bestWinStreak: "Найкраща серія виграшів",
    profitFactor: "Profit Factor",
  },
  ru: {
    subtitle: "Аналитика performance",
    title: "Расширенные метрики",
    averageWin: "Средний выигрыш",
    averageLoss: "Средний убыток",
    bestWinStreak: "Лучшая серия выигрышей",
    profitFactor: "Profit Factor",
  },
  es: {
    subtitle: "Intelligence de performance",
    title: "Métricas avanzadas",
    averageWin: "Ganancia media",
    averageLoss: "Pérdida media",
    bestWinStreak: "Mejor racha de ganancias",
    profitFactor: "Profit Factor",
  },
  fr: {
    subtitle: "Intelligence performance",
    title: "Métriques avancées",
    averageWin: "Gain moyen",
    averageLoss: "Perte moyenne",
    bestWinStreak: "Meilleure série de gains",
    profitFactor: "Profit Factor",
  },
  de: {
    subtitle: "Performance Intelligence",
    title: "Erweiterte Metriken",
    averageWin: "Durchschnittlicher Gewinn",
    averageLoss: "Durchschnittlicher Verlust",
    bestWinStreak: "Beste Gewinnserie",
    profitFactor: "Profit Factor",
  },
};

export default function PerformanceIntelligence({
  averageWin,
  averageLoss,
  profitFactor,
  bestWinStreak,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  return (
    <AnalyticsSection subtitle={t.subtitle} title={t.title}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">{t.averageWin}</p>
          <h3 className="mt-2 text-2xl font-bold text-green-400">{averageWin}</h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">{t.averageLoss}</p>
          <h3 className="mt-2 text-2xl font-bold text-red-400">{averageLoss}</h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">{t.bestWinStreak}</p>
          <h3 className="mt-2 text-2xl font-bold text-cyan-400">{bestWinStreak}</h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">{t.profitFactor}</p>
          <h3 className="mt-2 text-2xl font-bold text-violet-400">{profitFactor}</h3>
        </div>
      </div>
    </AnalyticsSection>
  );
}
