import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

export default function PDFReportFooter({
  appLanguage,
}: ReportI18nProps) {
  const t = getReportLabels(appLanguage);

  return (
    <div className="print:hidden report-card mt-10 rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-accent-bright">
        VOLTIS Intelligence System
      </p>

      <p className="mt-3 text-sm text-muted">
        {t.generatedBy}
      </p>
    </div>
  );
}
