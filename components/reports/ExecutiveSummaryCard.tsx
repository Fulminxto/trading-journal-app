import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import Card from "@/components/ui/Card";
import ReportChapterHeader from "@/components/reports/ReportChapterHeader";

type Props = ReportI18nProps & {
  totalPnl: number;
  winRate: number;
  disciplineScore: number;
  behavioralRisk: number;
  hasEnoughData: boolean;
};

export default function ExecutiveSummaryCard({
  totalPnl,
  winRate,
  disciplineScore,
  behavioralRisk,
  hasEnoughData,
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
    <Card className="report-card p-6 sm:p-10">
      <ReportChapterHeader
        number="01"
        subtitle={t.executiveSummary}
        title={t.aiStrategicOverview}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.pnlStatus}</p>
          <h3
            className={`mt-3 text-metric-lg ${totalPnl >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {formatReportCurrency(totalPnl, currency, appLanguage)}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.winRate}</p>
          <h3 className="mt-3 text-metric-lg text-accent-bright">
            {winRate}%
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.discipline}</p>
          <h3 className="mt-3 text-metric-lg text-accent">
            {disciplineScore}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.behavioralRisk}</p>
          <h3
            className={`mt-3 text-metric-lg ${behavioralRisk >= 50
                ? "text-red-400"
                : behavioralRisk >= 25
                  ? "text-yellow-400"
                  : "text-green-400"
              }`}
          >
            {behavioralRisk}%
          </h3>
        </Card>
      </div>

      <Card variant="inner" className="mt-8 p-5">
        <p className="text-sm text-muted-faint">
          {t.aiExecutiveAssessment}
        </p>

        {hasEnoughData ? (
          <>
            <h3 className={`mt-3 text-xl font-black ${overallTone}`}>
              {overallStatus}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
              {assessment}
            </p>
          </>
        ) : (
          <>
            <h3 className="mt-3 text-xl font-black text-muted-faint">
              {t.notEnoughDataTitle}
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
              {t.notEnoughDataMessage}
            </p>
          </>
        )}
      </Card>
    </Card>
  );
}
