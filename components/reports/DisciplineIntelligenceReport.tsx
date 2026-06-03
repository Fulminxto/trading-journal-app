import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; behavioralRisk: number; emotionalTrades: number; totalTrades: number; };
export default function DisciplineIntelligenceReport({ disciplineScore, behavioralRisk, emotionalTrades, totalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const emotionalRatio = totalTrades > 0 ? emotionalTrades / totalTrades : 0;
  const elite = disciplineScore >= 80 && behavioralRisk < 25 && emotionalRatio < 0.2; const developing = !elite && disciplineScore >= 60;
  const status = elite ? i.eliteDiscipline : developing ? i.developingDiscipline : i.disciplineInstability;
  const tone = elite ? "text-green-400" : developing ? "text-yellow-400" : "text-red-400";
  const message = elite ? i.disciplineEliteMessage : developing ? i.disciplineDevelopingMessage : i.disciplineLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-violet-400">{i.disciplineIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.disciplineReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4"><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.disciplineScore}</p><h3 className={`mt-4 text-4xl font-black ${tone}`}>{disciplineScore}</h3></div><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{t.behavioralRisk}</p><h3 className={`mt-4 text-4xl font-black ${behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-green-400"}`}>{behavioralRisk}%</h3></div><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.emotionalRatio}</p><h3 className="mt-4 text-4xl font-black text-yellow-400">{Math.round(emotionalRatio * 100)}%</h3></div><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.status}</p><h3 className={`mt-4 text-2xl font-black ${tone}`}>{status}</h3></div></div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiDisciplineAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
