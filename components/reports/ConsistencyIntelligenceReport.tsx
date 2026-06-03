import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; winRate: number; totalTrades: number; emotionalTrades: number; };
export default function ConsistencyIntelligenceReport({ disciplineScore, winRate, totalTrades, emotionalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const emotionalRatio = totalTrades > 0 ? emotionalTrades / totalTrades : 0;
  const elite = disciplineScore >= 80 && winRate >= 60 && emotionalRatio < 0.2; const developing = !elite && disciplineScore >= 60 && winRate >= 50;
  const level = elite ? i.eliteConsistency : developing ? i.developingConsistency : i.inconsistentStructure;
  const tone = elite ? "text-green-400" : developing ? "text-yellow-400" : "text-red-400";
  const message = elite ? i.consistencyEliteMessage : developing ? i.consistencyDevelopingMessage : i.consistencyWeakMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-cyan-400">{i.consistencyIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.consistencyReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: t.discipline, value: disciplineScore, cls: "text-green-400" }, { label: t.winRate, value: `${winRate}%`, cls: "text-cyan-400" }, { label: i.emotionalRatio, value: `${Math.round(emotionalRatio * 100)}%`, cls: "text-yellow-400" }, { label: i.structure, value: level, cls: tone }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 ${c.label === i.structure ? "text-2xl" : "text-4xl"} font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiConsistencyAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{level}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
