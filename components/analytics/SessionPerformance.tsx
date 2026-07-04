import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import AnalyticsSection from "./AnalyticsSection";

type SessionStats = {
  trades: number;
  wins: number;
  pnl: number;
};

type Props = {
  sessions: [string, SessionStats][];
  formatCurrency: (value: number) => string;
  appLanguage?: string | null;
};

type Labels = {
  subtitle: string;
  title: string;
  trades: string;
  wr: string;
  noSessions: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    subtitle: "Intelligence sessioni",
    title: "Sessioni di trading",
    trades: "trade",
    wr: "WR",
    noSessions: "Nessuna sessione registrata.",
  },
  en: {
    subtitle: "Session intelligence",
    title: "Trading Sessions",
    trades: "trades",
    wr: "WR",
    noSessions: "No session recorded.",
  },
  uk: {
    subtitle: "Аналітика сесій",
    title: "Торгові сесії",
    trades: "угод",
    wr: "WR",
    noSessions: "Сесії ще не зареєстровано.",
  },
  ru: {
    subtitle: "Аналитика сессий",
    title: "Торговые сессии",
    trades: "сделок",
    wr: "WR",
    noSessions: "Сессии еще не зарегистрированы.",
  },
  es: {
    subtitle: "Intelligence de sesiones",
    title: "Sesiones de trading",
    trades: "trades",
    wr: "WR",
    noSessions: "No hay sesiones registradas.",
  },
  fr: {
    subtitle: "Intelligence des sessions",
    title: "Sessions de trading",
    trades: "trades",
    wr: "WR",
    noSessions: "Aucune session enregistrée.",
  },
  de: {
    subtitle: "Session Intelligence",
    title: "Trading-Sessions",
    trades: "Trades",
    wr: "WR",
    noSessions: "Keine Session erfasst.",
  },
};

export default function SessionPerformance({
  sessions,
  formatCurrency,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  const sorted = [...sessions].sort((a, b) => b[1].pnl - a[1].pnl);

  return (
    <AnalyticsSection subtitle={t.subtitle} title={t.title}>
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-faint">{t.noSessions}</p>
      ) : (
        <div className="space-y-3">
          {sorted.map(([session, stats]) => {
            const wr =
              stats.trades > 0
                ? ((stats.wins / stats.trades) * 100).toFixed(0)
                : "0";

            return (
              <Card key={session} variant="inner" className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-white">{session}</p>
                    <p className="text-xs text-muted-faint">
                      {stats.trades} {t.trades} &middot; {t.wr} {wr}%
                    </p>
                  </div>

                  <p
                    className={`font-bold ${
                      stats.pnl >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formatCurrency(stats.pnl)}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </AnalyticsSection>
  );
}
