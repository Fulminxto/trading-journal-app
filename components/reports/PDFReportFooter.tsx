import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

export default function PDFReportFooter({
  appLanguage,
}: ReportI18nProps) {
  const t = getReportLabels(appLanguage);

  return (
    <div className="hidden print:hidden report-card mt-10 rounded-[28px] border border-white/10 bg-black/30 p-6 text-center backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.25em] text-accent-bright">
        VOLTIS Intelligence System
      </p>

      <p className="mt-3 text-sm text-gray-400">
        {t.generatedBy}
      </p>
    </div>
  );
}
