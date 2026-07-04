import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import Card from "@/components/ui/Card";

type Props = ReportI18nProps & {
  primaryFocus: string;
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
  hasEnoughData,
  appLanguage,
}: Props) {
  const t = getReportLabels(appLanguage);

  return (
    <Card className="report-card p-6 sm:p-10">
      <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
        {t.growthFocusSubtitle}
      </p>

      <h2 className="mt-3 text-section text-white">
        {t.growthFocusTitle}
      </h2>

      <Card variant="inner" className="mt-6 p-5">
        {hasEnoughData ? (
          <p className="max-w-3xl text-lg font-black leading-relaxed text-white">
            {primaryFocus}
          </p>
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
