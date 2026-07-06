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
      className="print-hidden rounded-pill border-[0.5px] border-flash/[0.14] bg-white/[0.035] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition-colors duration-base hover:border-accent-bright/35 hover:bg-white/[0.06] hover:text-white"
    >
      {t.exportPdf}
    </button>
  );
}
