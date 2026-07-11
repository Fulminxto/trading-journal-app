import type { ReactNode } from "react";

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
  totalTrades: number;
  hasSufficientBehavioralData: boolean;
  hasEnoughData: boolean;
  action?: ReactNode;
};

export default function ExecutiveSummaryCard({
  totalPnl,
  winRate,
  disciplineScore,
  behavioralRisk,
  totalTrades,
  hasSufficientBehavioralData,
  hasEnoughData,
  appLanguage,
  currency,
  action,
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
        action={action}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.pnlStatus}</p>
          <h3
            className={`mt-3 text-metric-lg ${
              totalPnl > 0
                ? "text-green-400"
                : totalPnl < 0
                  ? "text-red-400"
                  : "text-white"
            }`}
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
          <h3
            className={`mt-3 text-metric-lg ${
              hasSufficientBehavioralData ? "text-accent" : "text-muted-faint"
            }`}
          >
            {hasSufficientBehavioralData ? disciplineScore : "Not assessed"}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.behavioralRisk}</p>
          <h3
            className={`mt-3 text-metric-lg ${
              hasSufficientBehavioralData
                ? behavioralRisk >= 50
                  ? "text-red-400"
                  : behavioralRisk >= 25
                    ? "text-yellow-400"
                    : "text-green-400"
                : "text-accent-bright"
            }`}
          >
            {hasSufficientBehavioralData ? `${behavioralRisk}%` : "Not available"}
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
              Early sample
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
              The account is currently {totalPnl > 0 ? "profitable" : totalPnl < 0 ? "negative" : "flat"}, but {totalTrades} {totalTrades === 1 ? "trade is" : "trades are"} not sufficient to assess consistency, discipline and risk stability.
            </p>
          </>
        )}
      </Card>
    </Card>
  );
}
