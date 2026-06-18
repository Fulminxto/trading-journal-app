import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

type Props = ReportI18nProps & {
  totalPnl: number;
  winRate: number;
  disciplineScore: number;
  behavioralRisk: number;
};

export default function ExecutiveSummaryCard({
  totalPnl,
  winRate,
  disciplineScore,
  behavioralRisk,
  appLanguage,
  currency,
}: Props) {
  const t = getReportLabels(appLanguage);

  const isStrong =
    totalPnl >= 0 &&
    disciplineScore >= 70 &&
    behavioralRisk < 30;

  const isDeveloping =
    !isStrong && totalPnl >= 0;

  const overallStatus = isStrong
    ? t.strongStructure
    : isDeveloping
      ? t.developingStability
      : t.riskExposure;

  const overallTone = isStrong
    ? "text-green-400"
    : isDeveloping
      ? "text-yellow-400"
      : "text-red-400";

  const assessment = isStrong
    ? t.executiveStrong
    : isDeveloping
      ? t.executiveDeveloping
      : t.executiveRisk;

  return (
    <div className="report-card relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0C1430] via-[#0d1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_10%,transparent)_35%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-accent-bright">
          {t.executiveSummary}
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          {t.aiStrategicOverview}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              {t.pnlStatus}
            </p>

            <h3
              className={`mt-4 text-4xl font-black ${totalPnl >= 0
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

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              {t.winRate}
            </p>

            <h3 className="mt-4 text-4xl font-black text-accent-bright">
              {winRate}%
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              {t.discipline}
            </p>

            <h3 className="mt-4 text-4xl font-black text-violet-400">
              {disciplineScore}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              {t.behavioralRisk}
            </p>

            <h3
              className={`mt-4 text-4xl font-black ${behavioralRisk >= 50
                  ? "text-red-400"
                  : behavioralRisk >= 25
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
            >
              {behavioralRisk}%
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            {t.aiExecutiveAssessment}
          </p>

          <h3
            className={`mt-4 text-3xl font-black ${overallTone}`}
          >
            {overallStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {assessment}
          </p>
        </div>
      </div>
    </div>
  );
}
