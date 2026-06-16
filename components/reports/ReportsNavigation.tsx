import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

const sectionIds = [
  "executive",
  "weekly",
  "monthly",
  "behavior",
  "performance",
  "evolution",
  "coaching",
  "risk",
  "consistency",
  "psychology",
  "forecast",
  "growth",
  "edge",
  "decision",
  "execution",
  "setup",
  "confidence",
  "discipline",
  "emotion",
  "identity",
  "cognitive",
  "resilience",
] as const;

export default function ReportsNavigation({
  appLanguage,
}: ReportI18nProps) {
  const t = getReportLabels(appLanguage);

  return (
    <div className="print-hidden sticky top-4 z-30 rounded-[28px] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
      <div className="flex gap-3 overflow-x-auto">
        {sectionIds.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-gray-300 transition hover:border-accent-bright/40 hover:text-accent-bright"
          >
            {t[id]}
          </a>
        ))}
      </div>
    </div>
  );
}
