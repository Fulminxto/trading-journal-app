import { normalizeAppLanguage } from "@/lib/i18n";

type Props = {
  accountName: string;
  totalPnl: string;
  winRate: number;
  totalTrades: number;
  appLanguage?: string | null;
};

type Labels = {
  eyebrow: string;
  description: string;
  totalPnl: string;
  winRate: string;
  totalTrades: string;
  accountStatus: string;
  active: string;
};

const labels: Record<string, Labels> = {
  it: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance intelligence, psychology tracking, analytics avanzati e behavioral insights per costruire un sistema di trading professionale.",
    totalPnl: "PnL totale",
    winRate: "Win Rate",
    totalTrades: "Trade totali",
    accountStatus: "Stato account",
    active: "Attivo",
  },
  en: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance intelligence, psychology tracking, advanced analytics and behavioral insights to build a professional trading system.",
    totalPnl: "Total PnL",
    winRate: "Win Rate",
    totalTrades: "Total Trades",
    accountStatus: "Account Status",
    active: "Active",
  },
  uk: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance intelligence, psychology tracking, розширена аналітика та behavioral insights для побудови професійної торгової системи.",
    totalPnl: "Загальний PnL",
    winRate: "Win Rate",
    totalTrades: "Усього угод",
    accountStatus: "Статус акаунта",
    active: "Активний",
  },
  ru: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance intelligence, psychology tracking, расширенная аналитика и behavioral insights для построения профессиональной торговой системы.",
    totalPnl: "Общий PnL",
    winRate: "Win Rate",
    totalTrades: "Всего сделок",
    accountStatus: "Статус аккаунта",
    active: "Активен",
  },
  es: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance intelligence, psychology tracking, analytics avanzados y behavioral insights para construir un sistema de trading profesional.",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Trades totales",
    accountStatus: "Estado de la cuenta",
    active: "Activo",
  },
  fr: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance intelligence, psychology tracking, analytics avancés et behavioral insights pour construire un système de trading professionnel.",
    totalPnl: "PnL total",
    winRate: "Win Rate",
    totalTrades: "Trades totaux",
    accountStatus: "État du compte",
    active: "Actif",
  },
  de: {
    eyebrow: "VOLTIS Analytics",
    description:
      "Performance Intelligence, Psychology Tracking, erweiterte Analytics und Behavioral Insights zum Aufbau eines professionellen Trading-Systems.",
    totalPnl: "Gesamt-PnL",
    winRate: "Win Rate",
    totalTrades: "Trades gesamt",
    accountStatus: "Kontostatus",
    active: "Aktiv",
  },
};

export default function AnalyticsHero({
  accountName,
  totalPnl,
  winRate,
  totalTrades,
  appLanguage,
}: Props) {
  const language = normalizeAppLanguage(appLanguage);
  const t = labels[language] ?? labels.en;

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#070b14] via-[#0f1726] to-black p-8 shadow-2xl shadow-cyan-500/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.18),transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="absolute inset-0 backdrop-blur-[2px]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400" />

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
                {t.eyebrow}
              </p>
            </div>

            <h1 className="mt-6 text-5xl font-black tracking-tight text-white xl:text-7xl">
              {accountName}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 xl:text-lg">
              {t.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:min-w-[460px]">
            <div className="rounded-3xl border border-green-500/10 bg-green-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.totalPnl}
              </p>

              <h2 className="mt-3 text-4xl font-black text-green-400">
                {totalPnl}
              </h2>
            </div>

            <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.winRate}
              </p>

              <h2 className="mt-3 text-4xl font-black text-cyan-400">
                {winRate}%
              </h2>
            </div>

            <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.totalTrades}
              </p>

              <h2 className="mt-3 text-4xl font-black text-violet-400">
                {totalTrades}
              </h2>
            </div>

            <div className="rounded-3xl border border-yellow-500/10 bg-yellow-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.accountStatus}
              </p>

              <h2 className="mt-3 text-4xl font-black text-yellow-400">
                {t.active}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

