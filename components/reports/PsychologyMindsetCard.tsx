import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import Card from "@/components/ui/Card";
import ReportChapterHeader from "@/components/reports/ReportChapterHeader";

type Props = ReportI18nProps & {
  emotionalTrades: number;
  totalTrades: number;
  behavioralRisk: number;
  disciplineScore: number;
  hasEnoughData: boolean;
};

/**
 * Psychology & Mindset chapter. Replaces five components
 * (PsychologicalStabilityReport, EmotionalIntelligenceReport,
 * MentalResilienceReport, CognitivePerformanceReport, TraderIdentityReport)
 * that each blended the same emotionalTrades/behavioralRisk/disciplineScore
 * into a differently-named synthetic score. This keeps the two real
 * numbers (emotional ratio, trader stage from disciplineScore) and one
 * verdict, instead of five near-identical hero cards.
 */
export default function PsychologyMindsetCard({
  emotionalTrades,
  totalTrades,
  behavioralRisk,
  disciplineScore,
  hasEnoughData,
  appLanguage,
}: Props) {
  const t = getReportLabels(appLanguage);
  const emotionalRatio = totalTrades > 0 ? emotionalTrades / totalTrades : 0;

  const stage =
    disciplineScore >= 80
      ? t.stageAdvanced
      : disciplineScore >= 60
        ? t.stageDeveloping
        : t.stageEarly;

  const isStable = emotionalRatio < 0.2 && behavioralRisk < 25 && disciplineScore >= 70;
  const isModerate = !isStable && emotionalRatio < 0.4;

  const status = isStable
    ? t.psychologyStable
    : isModerate
      ? t.psychologyModerate
      : t.psychologyFragile;

  const message = isStable
    ? t.psychologyStableMessage
    : isModerate
      ? t.psychologyModerateMessage
      : t.psychologyFragileMessage;

  const tone = isStable
    ? "text-green-400"
    : isModerate
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <Card className="report-card p-6 sm:p-10">
      <ReportChapterHeader
        number="04"
        subtitle={t.psychologySubtitle}
        title={t.psychologyTitle}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.emotionalTrades}</p>
          <h3 className="mt-3 text-3xl font-black text-yellow-400">
            {emotionalTrades}
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.emotionalRatioLabel}</p>
          <h3 className="mt-3 text-3xl font-black text-accent-bright">
            {Math.round(emotionalRatio * 100)}%
          </h3>
        </Card>

        <Card variant="inner" className="p-5">
          <p className="text-sm text-muted-faint">{t.traderStageLabel}</p>
          <h3 className="mt-3 text-2xl font-black text-accent">
            {stage}
          </h3>
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
