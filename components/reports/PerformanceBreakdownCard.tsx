import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

type Props = ReportI18nProps & {
  wins: number;
  losses: number;
  breakEven: number;
  averageWin: number;
  averageLoss: number;
};

export default function PerformanceBreakdownCard({
  wins,
  losses,
  breakEven,
  averageWin,
  averageLoss,
  appLanguage,
  currency,
}: Props) {
  const t = getReportLabels(appLanguage);

  return (
    <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          {t.performanceBreakdown}
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          {t.executionSummary}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.wins}
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {wins}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.losses}
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {losses}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.breakEven}
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {breakEven}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.avgWin}
            </p>

            <h3 className="mt-3 text-3xl font-black text-green-400">
              {formatReportCurrency(
                averageWin,
                currency,
                appLanguage
              )}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.avgLoss}
            </p>

            <h3 className="mt-3 text-3xl font-black text-red-400">
              {formatReportCurrency(
                averageLoss,
                currency,
                appLanguage
              )}
            </h3>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            {t.aiPerformanceInsight}
          </p>

          <h3 className="mt-3 text-xl font-black leading-relaxed text-white">
            {averageWin > Math.abs(averageLoss)
              ? t.performancePositive
              : t.performanceFragile}
          </h3>
        </div>
      </div>
    </div>
  );
}
