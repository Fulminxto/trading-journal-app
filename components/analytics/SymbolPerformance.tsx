import { normalizeAppLanguage, type AppLanguage } from "@/lib/i18n";
import Card from "@/components/ui/Card";
import AnalyticsSection from "./AnalyticsSection";

type SymbolStats = {
  pnl: number;
  trades: number;
};

type Props = {
  bestSymbol?: [string, SymbolStats];
  worstSymbol?: [string, SymbolStats];
  mostTraded?: [string, SymbolStats];
  currency: string;
  formatCurrency: (
    value: number,
    currency: string
  ) => string;
  appLanguage?: string | null;
};

type Labels = {
  subtitle: string;
  title: string;
  bestSymbol: string;
  worstSymbol: string;
  mostTraded: string;
  trades: string;
};

const labels: Record<AppLanguage, Labels> = {
  it: {
    subtitle: "Intelligence mercati",
    title: "Performance simboli",
    bestSymbol: "Miglior simbolo",
    worstSymbol: "Peggior simbolo",
    mostTraded: "Più tradato",
    trades: "trade",
  },
  en: {
    subtitle: "Market intelligence",
    title: "Symbol Performance",
    bestSymbol: "Best Symbol",
    worstSymbol: "Worst Symbol",
    mostTraded: "Most Traded",
    trades: "trades",
  },
  uk: {
    subtitle: "Ринкова аналітика",
    title: "Performance символів",
    bestSymbol: "Найкращий символ",
    worstSymbol: "Найгірший символ",
    mostTraded: "Найчастіше торгується",
    trades: "угод",
  },
  ru: {
    subtitle: "Рыночная аналитика",
    title: "Performance символов",
    bestSymbol: "Лучший символ",
    worstSymbol: "Худший символ",
    mostTraded: "Самый торгуемый",
    trades: "сделок",
  },
  es: {
    subtitle: "Intelligence de mercado",
    title: "Performance de símbolos",
    bestSymbol: "Mejor símbolo",
    worstSymbol: "Peor símbolo",
    mostTraded: "Más operado",
    trades: "trades",
  },
  fr: {
    subtitle: "Intelligence marché",
    title: "Performance des symboles",
    bestSymbol: "Meilleur symbole",
    worstSymbol: "Pire symbole",
    mostTraded: "Le plus tradé",
    trades: "trades",
  },
  de: {
    subtitle: "Market Intelligence",
    title: "Symbol-Performance",
    bestSymbol: "Bestes Symbol",
    worstSymbol: "Schlechtestes Symbol",
    mostTraded: "Meistgetradet",
    trades: "Trades",
  },
};

export default function SymbolPerformance({
  bestSymbol,
  worstSymbol,
  mostTraded,
  currency,
  formatCurrency,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language];

  return (
    <AnalyticsSection subtitle={t.subtitle} title={t.title}>
      <div className="space-y-3">
        <Card variant="inner" className="p-4">
          <p className="text-sm text-muted-faint">
            {t.bestSymbol}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-green-400">
              {bestSymbol?.[0] || "—"}
            </h3>

            <p className="font-semibold text-green-400">
              {bestSymbol
                ? formatCurrency(bestSymbol[1].pnl, currency)
                : "—"}
            </p>
          </div>
        </Card>

        <Card variant="inner" className="p-4">
          <p className="text-sm text-muted-faint">
            {t.worstSymbol}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-red-400">
              {worstSymbol?.[0] || "—"}
            </h3>

            <p className="font-semibold text-red-400">
              {worstSymbol
                ? formatCurrency(worstSymbol[1].pnl, currency)
                : "—"}
            </p>
          </div>
        </Card>

        <Card variant="inner" className="p-4">
          <p className="text-sm text-muted-faint">
            {t.mostTraded}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {mostTraded?.[0] || "—"}
            </h3>

            <p className="font-semibold text-muted">
              {mostTraded
                ? `${mostTraded[1].trades} ${t.trades}`
                : "—"}
            </p>
          </div>
        </Card>
      </div>
    </AnalyticsSection>
  );
}
