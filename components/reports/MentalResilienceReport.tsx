import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; behavioralRisk: number; emotionalTrades: number; losses: number; totalTrades: number; };
export default function MentalResilienceReport({ disciplineScore, behavioralRisk, emotionalTrades, losses, totalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const pressureRatio = totalTrades > 0 ? (emotionalTrades + losses) / totalTrades : 0;
  const score = Math.max(0, Math.min(100, Math.round(disciplineScore - behavioralRisk * 0.3 - pressureRatio * 25)));
  const high = score >= 80; const moderate = !high && score >= 60;
  const status = high ? i.highMentalResilience : moderate ? i.moderateResilience : i.mentalFragility;
  const tone = high ? "text-green-400" : moderate ? "text-yellow-400" : "text-red-400";
  const message = high ? i.resilienceHighMessage : moderate ? i.resilienceModerateMessage : i.resilienceLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#120c08] via-[#171020] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-yellow-400">{i.mentalResilience}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.resilienceReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">{[{ label: i.resilienceScore, value: score, cls: tone }, { label: t.discipline, value: disciplineScore, cls: "text-green-400" }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: "text-red-400" }, { label: t.emotionalTrades, value: emotionalTrades, cls: "text-yellow-400" }, { label: i.pressureRatio, value: `${Math.round(pressureRatio * 100)}%`, cls: "text-cyan-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiResilienceAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
