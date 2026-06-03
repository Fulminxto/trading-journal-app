import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

type Props = ReportI18nProps & {
  totalTrades: number;
  totalPnl: number;
  winRate: number;
};

export default function WeeklyReportCard({
  totalTrades,
  totalPnl,
  winRate,
  appLanguage,
  currency,
}: Props) {
  const t = getReportLabels(appLanguage);

  const performanceText =
    totalPnl >= 0
      ? t.weeklyPositive
      : t.weeklyNegative;

  const consistencyText =
    winRate >= 50
      ? t.weeklyConsistencyPositive
      : t.weeklyConsistencyWeak;

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
        {t.weeklyIntelligence}
      </p>

      <h2 className="mt-3 text-3xl font-black text-white">
        {t.weeklyReport}
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.trades}
          </p>

          <h3 className="mt-3 text-4xl font-black text-cyan-400">
            {totalTrades}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.pnl}
          </p>

          <h3
            className={`mt-3 text-4xl font-black ${totalPnl >= 0
                ? "text-green-400"
                : "text-red-400"
              }`}
          >
            {formatReportCurrency(
              totalPnl,
              currency,
              appLanguage
            )}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.winRate}
          </p>

          <h3 className="mt-3 text-4xl font-black text-violet-400">
            {winRate}%
          </h3>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.performance}
          </p>

          <h3 className="mt-3 text-xl font-black text-white">
            {performanceText}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.consistency}
          </p>

          <h3 className="mt-3 text-xl font-black text-cyan-400">
            {consistencyText}
          </h3>
        </div>
      </div>
    </div>
  );
}
