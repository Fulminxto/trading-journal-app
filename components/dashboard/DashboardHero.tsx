import {
  getDashboardLabels,
  type DashboardI18nProps,
} from "./DashboardI18n";

type Props = DashboardI18nProps & {
  accountName: string;
  currentEquity: string;
  totalPnl: string;
  winRate: string;
  totalTrades: number;
};

export default function DashboardHero({
  accountName,
  currentEquity,
  totalPnl,
  winRate,
  totalTrades,
  appLanguage,
}: Props) {
  const t = getDashboardLabels(appLanguage);

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

            <h1 className="mt-6 text-3xl font-black tracking-tight break-words text-white sm:text-5xl xl:text-7xl">
              {accountName}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-400 xl:text-lg">
              {t.description}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:min-w-[460px]">
            <div className="rounded-3xl border border-green-500/10 bg-green-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.currentEquity}
              </p>

              <h2 className="mt-3 text-4xl font-black text-green-400">
                {currentEquity}
              </h2>
            </div>

            <div className="rounded-3xl border border-cyan-500/10 bg-cyan-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.totalPnl}
              </p>

              <h2 className="mt-3 text-4xl font-black text-cyan-400">
                {totalPnl}
              </h2>
            </div>

            <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.winRate}
              </p>

              <h2 className="mt-3 text-4xl font-black text-violet-400">
                {winRate}
              </h2>
            </div>

            <div className="rounded-3xl border border-yellow-500/10 bg-yellow-500/[0.06] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                {t.trades}
              </p>

              <h2 className="mt-3 text-4xl font-black text-yellow-400">
                {totalTrades}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
