import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import Card from "@/components/ui/Card";
import ReportChapterHeader from "@/components/reports/ReportChapterHeader";

type Props = ReportI18nProps & {
  primaryFocus: string;
  hasSufficientBehavioralData: boolean;
  hasEnoughData: boolean;
};

/**
 * Closing chapter. Replaces TraderEvolutionReport, GrowthRoadmapReport and
 * AICoachingReport, which each re-derived their own "next phase"/"primary
 * focus" verdict from the same disciplineScore/behavioralRisk/winRate
 * already shown in the Executive Summary and Risk & Discipline chapters.
 * Reuses the one real `primaryFocus` recommendation page.tsx already
 * computes, instead of three parallel synthetic recommendations.
 */
export default function GrowthFocusCard({
  primaryFocus,
  hasSufficientBehavioralData,
  hasEnoughData,
  appLanguage,
}: Props) {
  const t = getReportLabels(appLanguage);

  return (
    <Card
      className={`report-card ${
        hasEnoughData && hasSufficientBehavioralData
          ? "p-6 sm:p-10"
          : "p-5 sm:p-8"
      }`}
    >
      <ReportChapterHeader
        number="05"
        subtitle={t.growthFocusSubtitle}
        title={t.growthFocusTitle}
      />

      <Card variant="inner" className="p-5">
        {hasEnoughData && hasSufficientBehavioralData ? (
          <p className="max-w-3xl text-lg font-black leading-relaxed text-white">
            {primaryFocus}
          </p>
        ) : (
          <>
            <h3 className="text-lg font-black text-muted-faint">
              Build a reliable operating sample
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
              Continue logging trades with confidence, execution quality, emotional state and risk/reward to unlock a complete performance assessment.
            </p>
          </>
        )}
      </Card>
    </Card>
  );
}
