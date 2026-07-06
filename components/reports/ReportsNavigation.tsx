import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

const sectionIds = [
  "executive",
  "performance",
  "risk",
  "psychology",
  "growth",
] as const;

export default function ReportsNavigation({
  appLanguage,
}: ReportI18nProps) {
  const t = getReportLabels(appLanguage);

  return (
    <div className="print-hidden sticky top-4 z-30 rounded-card border-[0.5px] border-white/[0.07] bg-surface-1/85 p-2.5 backdrop-blur">
      <div className="flex gap-2 overflow-x-auto">
        {sectionIds.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="shrink-0 rounded-full border-[0.5px] border-white/[0.08] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted transition-colors duration-base hover:border-accent-bright/30 hover:bg-white/[0.03] hover:text-accent-bright"
          >
            {t[id]}
          </a>
        ))}
      </div>
    </div>
  );
}
