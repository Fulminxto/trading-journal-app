import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { lowConfidenceTrades: number; totalTrades: number; disciplineScore: number; winRate: number; };
export default function ConfidenceIntelligenceReport({ lowConfidenceTrades, totalTrades, disciplineScore, winRate, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const confidenceRatio = totalTrades > 0 ? lowConfidenceTrades / totalTrades : 0;
  const confidenceScore = Math.max(0, Math.min(100, Math.round(disciplineScore * 0.5 + winRate * 0.3 + (1 - confidenceRatio) * 20)));
  const high = confidenceScore >= 80; const developing = !high && confidenceScore >= 60;
  const status = high ? i.highConfidenceStability : developing ? i.developingConfidence : i.confidenceFragility;
  const tone = high ? "text-green-400" : developing ? "text-yellow-400" : "text-red-400";
  const message = high ? i.confidenceHighMessage : developing ? i.confidenceDevelopingMessage : i.confidenceLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_10%,transparent),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-accent-bright">{i.confidenceIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.confidenceReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: i.confidenceScore, value: confidenceScore, cls: tone }, { label: t.confidence, value: lowConfidenceTrades, cls: "text-yellow-400" }, { label: t.discipline, value: disciplineScore, cls: "text-accent" }, { label: t.winRate, value: `${winRate}%`, cls: "text-violet-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiConfidenceAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
