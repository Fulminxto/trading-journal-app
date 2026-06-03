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
      className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-500/20"
    >
      {t.exportPdf}
    </button>
  );
}
