import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { weakExecutionTrades: number; totalTrades: number; disciplineScore: number; averageWin: number; averageLoss: number; };
export default function ExecutionIntelligenceReport({ weakExecutionTrades, totalTrades, disciplineScore, averageWin, averageLoss, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const executionRatio = totalTrades > 0 ? weakExecutionTrades / totalTrades : 0;
  const executionScore = Math.max(0, Math.min(100, Math.round(disciplineScore - executionRatio * 40 + (averageWin > Math.abs(averageLoss) ? 10 : -10))));
  const elite = executionScore >= 80; const stable = !elite && executionScore >= 60;
  const status = elite ? i.eliteExecution : stable ? i.stableExecution : i.executionInstability;
  const tone = elite ? "text-green-400" : stable ? "text-yellow-400" : "text-red-400";
  const message = elite ? i.executionEliteMessage : stable ? i.executionStableMessage : i.executionLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-cyan-400">{i.executionIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.executionReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: i.executionScore, value: executionScore, cls: tone }, { label: t.weakExecutions, value: weakExecutionTrades, cls: "text-red-400" }, { label: t.discipline, value: disciplineScore, cls: "text-green-400" }, { label: i.executionRatio, value: `${Math.round(executionRatio * 100)}%`, cls: "text-yellow-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiExecutionAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
