import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

type Props = ReportI18nProps & {
  totalTrades: number;
  totalPnl: number;
  winRate: number;
  emotionalTrades: number;
  disciplineScore: number;
};

export default function MonthlyReportCard({
  totalTrades,
  totalPnl,
  winRate,
  emotionalTrades,
  disciplineScore,
  appLanguage,
  currency,
}: Props) {
  const t = getReportLabels(appLanguage);

  const pnlTone =
    totalPnl >= 0
      ? "text-green-400"
      : "text-red-400";

  const disciplineLabel =
    disciplineScore >= 80
      ? t.eliteDiscipline
      : disciplineScore >= 60
        ? t.stableDiscipline
        : t.developingDiscipline;

  const psychologyStatus =
    emotionalTrades >= 5
      ? t.psychologicalPressureDetected
      : t.psychologicalStructureStable;

  return (
    <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0d1726] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
          {t.monthlyIntelligence}
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          {t.monthlyAIReport}
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
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

            <h3 className={`mt-3 text-4xl font-black ${pnlTone}`}>
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

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.discipline}
            </p>

            <h3 className="mt-3 text-2xl font-black text-green-400">
              {disciplineLabel}
            </h3>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.performanceSummary}
            </p>

            <h3 className="mt-3 text-xl font-black text-white">
              {totalPnl >= 0
                ? t.monthlyPositive
                : t.monthlyNegative}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.psychologySummary}
            </p>

            <h3 className="mt-3 text-xl font-black text-yellow-400">
              {psychologyStatus}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              {t.aiCoachingInsight}
            </p>

            <h3 className="mt-3 text-xl font-black text-cyan-400">
              {t.monthlyCoaching}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
