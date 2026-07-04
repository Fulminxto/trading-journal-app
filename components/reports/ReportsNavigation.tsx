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
    <div className="print-hidden sticky top-4 z-30 rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-4">
      <div className="flex gap-3 overflow-x-auto">
        {sectionIds.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="shrink-0 rounded-full border-[0.5px] border-flash/[0.12] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-muted transition-colors duration-base hover:border-accent-bright/40 hover:text-accent-bright"
          >
            {t[id]}
          </a>
        ))}
      </div>
    </div>
  );
}
