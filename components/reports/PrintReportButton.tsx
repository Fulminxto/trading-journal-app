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
      className="print-hidden inline-flex items-center gap-2 rounded-pill border-[0.5px] border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.13em] text-white transition-colors duration-base hover:border-accent-bright/30 hover:bg-white/[0.07]"
    >
      <FileText size={14} className="text-accent-bright" />
      {t.exportPdf}
    </button>
  );
}
