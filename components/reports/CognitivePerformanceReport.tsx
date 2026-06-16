import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; behavioralRisk: number; lowConfidenceTrades: number; weakExecutionTrades: number; totalTrades: number; };
export default function CognitivePerformanceReport({ disciplineScore, behavioralRisk, lowConfidenceTrades, weakExecutionTrades, totalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const cognitiveLoad = totalTrades > 0 ? ((lowConfidenceTrades + weakExecutionTrades) / totalTrades) * 100 : 0;
  const cognitiveScore = Math.max(0, Math.min(100, Math.round(disciplineScore - behavioralRisk * 0.4 - cognitiveLoad * 0.3)));
  const high = cognitiveScore >= 80; const moderate = !high && cognitiveScore >= 60;
  const cognitiveStatus = high ? i.highCognitiveClarity : moderate ? i.moderateCognitiveStability : i.cognitiveInstability;
  const tone = high ? "text-green-400" : moderate ? "text-yellow-400" : "text-red-400";
  const message = high ? i.cognitiveHighMessage : moderate ? i.cognitiveModerateMessage : i.cognitiveLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-violet-400">{i.cognitiveIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.cognitivePerformanceReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">{[{ label: i.cognitiveScore, value: cognitiveScore, cls: tone }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: "text-red-400" }, { label: t.confidence, value: lowConfidenceTrades, cls: "text-yellow-400" }, { label: t.weakExecutions, value: weakExecutionTrades, cls: "text-orange-400" }, { label: i.cognitiveLoad, value: `${Math.round(cognitiveLoad)}%`, cls: "text-accent-bright" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiCognitiveAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{cognitiveStatus}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
