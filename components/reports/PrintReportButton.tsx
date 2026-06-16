"use client";

import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";

export default function PrintReportButton({
  appLanguage,
}: ReportI18nProps) {
  const t = getReportLabels(appLanguage);

  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-accent-bright/20 bg-accent-bright/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-accent-bright transition hover:border-accent-bright/40 hover:bg-accent-bright/20"
    >
      {t.exportPdf}
    </button>
  );
}
