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
      className="rounded-pill border-[0.5px] border-accent-bright/30 bg-[linear-gradient(120deg,var(--color-accent),#3f86e8_60%,var(--color-accent-bright))] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-all duration-fast hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.3),0_0_22px_rgba(52,168,255,0.12)]"
    >
      {t.exportPdf}
    </button>
  );
}
