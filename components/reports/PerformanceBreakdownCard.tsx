import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import Card from "@/components/ui/Card";
import ReportChapterHeader from "@/components/reports/ReportChapterHeader";

type Props = ReportI18nProps & {
  wins: number;
  losses: number;
  breakEven: number;
  averageWin: number;
  averageLoss: number;
  profitFactor: number;
  hasEnoughData: boolean;
};

/**
 * Performance & Edge chapter. Used to be this card plus a separate
 * EdgeAnalysisReport computing its own "edge score" from a weighted blend
 * of winRate/disciplineScore already shown elsewhere - dropped that in
 * favor of the one real number (profit factor) and the same
 * averageWin > |averageLoss| verdict this card already used.
 */
export default function PerformanceBreakdownCard({
  wins,
  losses,
  breakEven,
  averageWin,
  averageLoss,
  profitFactor,
  hasEnoughData,
  appLanguage,
  currency,
}: Props) {
  const t = getReportLabels(appLanguage);
  const isPositiveEdge = averageWin > Math.abs(averageLoss);

  return (
    <Card className="report-card p-6 sm:p-10">
      <ReportChapterHeader
        number="02"
        subtitle={t.performanceBreakdown}
        title={t.executionSummary}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.wins}</p>
          <h3 className="mt-3 text-3xl font-black text-green-400">
            {wins}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.losses}</p>
          <h3 className="mt-3 text-3xl font-black text-red-400">
            {losses}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.breakEven}</p>
          <h3 className="mt-3 text-3xl font-black text-yellow-400">
            {breakEven}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.avgWin}</p>
          <h3 className="mt-3 text-2xl font-black text-green-400">
            {formatReportCurrency(averageWin, currency, appLanguage)}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.avgLoss}</p>
          <h3 className="mt-3 text-2xl font-black text-red-400">
            {formatReportCurrency(averageLoss, currency, appLanguage)}
          </h3>
        </Card>
      </div>

      <Card variant="inner" className="mt-6 p-5">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-faint">{t.profitFactorLabel}</p>
          <p className={`text-2xl font-black ${profitFactor >= 1 ? "text-green-400" : "text-red-400"}`}>
            {profitFactor.toFixed(2)}
          </p>
        </div>
      </Card>

      <Card variant="inner" className="mt-6 p-5">
        <p className="text-sm text-muted-faint">
          {t.aiPerformanceInsight}
        </p>

        {hasEnoughData ? (
          <h3 className="mt-3 text-lg font-black leading-relaxed text-white">
            {isPositiveEdge ? t.performancePositive : t.performanceFragile}
          </h3>
        ) : (
          <h3 className="mt-3 text-lg font-black leading-relaxed text-muted-faint">
            {t.notEnoughDataMessage}
          </h3>
        )}
      </Card>
    </Card>
  );
}
