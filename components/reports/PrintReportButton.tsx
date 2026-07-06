"use client";

import { FileText } from "lucide-react";

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
      className="print-hidden inline-flex items-center gap-2 rounded-pill border-[0.5px] border-accent-bright/25 bg-white/[0.055] px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.13em] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-colors duration-base hover:border-accent-bright/45 hover:bg-accent-bright/[0.08]"
    >
      <FileText size={14} className="text-accent-bright" />
      {t.exportPdf}
    </button>
  );
}
