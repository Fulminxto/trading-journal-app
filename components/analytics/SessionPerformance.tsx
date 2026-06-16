import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import AnalyticsSection from "./AnalyticsSection";

type Props = {
  londonTrades: number;
  newYorkTrades: number;
  asianTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  subtitle: string;
  title: string;
  london: string;
  newYork: string;
  asian: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    subtitle: "Intelligence sessioni",
    title: "Sessioni di trading",
    london: "Sessione Londra",
    newYork: "Sessione New York",
    asian: "Sessione asiatica",
  },
  en: {
    subtitle: "Session intelligence",
    title: "Trading Sessions",
    london: "London Session",
    newYork: "New York Session",
    asian: "Asian Session",
  },
  uk: {
    subtitle: "Аналітика сесій",
    title: "Торгові сесії",
    london: "Лондонська сесія",
    newYork: "Нью-Йоркська сесія",
    asian: "Азійська сесія",
  },
  ru: {
    subtitle: "Аналитика сессий",
    title: "Торговые сессии",
    london: "Лондонская сессия",
    newYork: "Нью-Йоркская сессия",
    asian: "Азиатская сессия",
  },
  es: {
    subtitle: "Intelligence de sesiones",
    title: "Sesiones de trading",
    london: "Sesión Londres",
    newYork: "Sesión New York",
    asian: "Sesión asiática",
  },
  fr: {
    subtitle: "Intelligence des sessions",
    title: "Sessions de trading",
    london: "Session Londres",
    newYork: "Session New York",
    asian: "Session asiatique",
  },
  de: {
    subtitle: "Session Intelligence",
    title: "Trading-Sessions",
    london: "London Session",
    newYork: "New York Session",
    asian: "Asien Session",
  },
};

export default function SessionPerformance({
  londonTrades,
  newYorkTrades,
  asianTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  return (
    <AnalyticsSection subtitle={t.subtitle} title={t.title}>
      <div className="space-y-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{t.london}</span>
            <span className="font-bold text-accent-bright">{londonTrades}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{t.newYork}</span>
            <span className="font-bold text-violet-400">{newYorkTrades}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">{t.asian}</span>
            <span className="font-bold text-yellow-400">{asianTrades}</span>
          </div>
        </div>
      </div>
    </AnalyticsSection>
  );
}
