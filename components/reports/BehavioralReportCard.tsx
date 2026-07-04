import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import Card from "@/components/ui/Card";
import ReportChapterHeader from "@/components/reports/ReportChapterHeader";

type Props = ReportI18nProps & {
  emotionalTrades: number;
  lowConfidenceTrades: number;
  weakExecutionTrades: number;
  losses: number;
  behavioralRisk: number;
  averageWin: number;
  averageLoss: number;
  hasEnoughData: boolean;
};

function getRiskTone(value: number) {
  if (value >= 60) return "text-red-400";
  if (value >= 35) return "text-yellow-400";
  return "text-green-400";
}

/**
 * Risk & Discipline chapter. Used to be this card plus RiskManagementReport
 * (its own synthetic "controlled/moderate/exposure" verdict blending the
 * same avgWin/avgLoss/behavioralRisk shown here) - folded the one real
 * number RiskManagementReport added (the risk/reward ratio) in here and
 * dropped its separately-invented verdict in favor of one shared tone
 * driven by the same behavioralRisk tiers Analytics' RiskConcentration
 * uses (>=60 high / >=35 medium / else low).
 */
export default function BehavioralReportCard({
  emotionalTrades,
  lowConfidenceTrades,
  weakExecutionTrades,
  losses,
  behavioralRisk,
  averageWin,
  averageLoss,
  hasEnoughData,
  appLanguage,
}: Props) {
  const t = getReportLabels(appLanguage);
  const riskReward = averageLoss !== 0 ? (averageWin / Math.abs(averageLoss)).toFixed(2) : "0.00";

  const isControlled = behavioralRisk < 35;
  const isModerate = !isControlled && behavioralRisk < 60;

  const status = isControlled
    ? t.riskControlledStatus
    : isModerate
      ? t.riskModerateStatus
      : t.riskExposureStatus;

  const message = isControlled
    ? t.riskControlledMessage
    : isModerate
      ? t.riskModerateMessage
      : t.riskHighExposureMessage;

  const tone = getRiskTone(behavioralRisk);

  return (
    <Card className="report-card p-6 sm:p-10">
      <ReportChapterHeader
        number="03"
        subtitle={t.riskDisciplineSubtitle}
        title={t.riskDisciplineTitle}
      />

      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
        {t.riskFactorsLabel}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.emotionalTrades}</p>
          <h3 className="mt-3 text-3xl font-black text-yellow-400">
            {emotionalTrades}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.lowConfidenceTrades}</p>
          <h3 className="mt-3 text-3xl font-black text-yellow-400">
            {lowConfidenceTrades}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.weakExecutions}</p>
          <h3 className="mt-3 text-3xl font-black text-red-400">
            {weakExecutionTrades}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.losses}</p>
          <h3 className="mt-3 text-3xl font-black text-red-400">
            {losses}
          </h3>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card variant="inner" className="p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-faint">{t.behavioralRisk}</p>
            <p className={`text-2xl font-black ${tone}`}>{behavioralRisk}%</p>
          </div>
        </Card>

        <Card variant="inner" className="p-5">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-faint">{t.riskRewardRatio}</p>
            <p className="text-2xl font-black text-accent-bright">{riskReward}</p>
          </div>
        </Card>
      </div>

      <Card variant="inner" className="mt-6 p-5">
        {hasEnoughData ? (
          <>
            <h3 className={`text-lg font-black ${tone}`}>{status}</h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
              {message}
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-black text-muted-faint">
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
