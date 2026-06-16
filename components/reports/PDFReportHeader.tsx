import {
  formatReportCurrency,
  formatReportDate,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

type Props = ReportI18nProps & {
  totalTrades: number;
  totalPnl: number;
  winRate: number;
};

export default function PDFReportHeader({
  totalTrades,
  totalPnl,
  winRate,
  appLanguage,
  currency,
}: Props) {
  const t = getReportLabels(appLanguage);
  const currentDate = formatReportDate(
    new Date(),
    appLanguage
  );

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#050b10] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_12%,transparent)_35%)]" />

      <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-accent-bright">
            {t.voltisIntelligenceReport}
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight text-white">
            {t.tradingPerformanceReport}
          </h1>

          <p className="mt-4 text-base text-gray-400">
            {t.generatedOn} {currentDate}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              {t.trades}
            </p>

            <h3 className="mt-3 text-4xl font-black text-accent-bright">
              {totalTrades}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
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

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              {t.winRate}
            </p>

            <h3 className="mt-3 text-4xl font-black text-violet-400">
              {winRate}%
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
