import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { emotionalTrades: number; totalTrades: number; behavioralRisk: number; disciplineScore: number; };
export default function PsychologicalStabilityReport({ emotionalTrades, totalTrades, behavioralRisk, disciplineScore, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const emotionalRatio = totalTrades > 0 ? emotionalTrades / totalTrades : 0;
  const stable = emotionalRatio < 0.2 && behavioralRisk < 25 && disciplineScore >= 70; const moderate = !stable && emotionalRatio < 0.4;
  const status = stable ? i.stableMindset : moderate ? i.moderateStability : i.psychologicalFragility;
  const tone = stable ? "text-green-400" : moderate ? "text-yellow-400" : "text-red-400";
  const message = stable ? i.psychologyStableMessage : moderate ? i.psychologyModerateMessage : i.psychologyFragileMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#120c08] via-[#171020] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-yellow-400">{i.psychologicalStability}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.psychologyReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: t.emotionalTrades, value: emotionalTrades, cls: "text-yellow-400" }, { label: i.emotionalRatio, value: `${Math.round(emotionalRatio * 100)}%`, cls: "text-cyan-400" }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-green-400" }, { label: i.stability, value: status, cls: tone }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 ${c.label === i.stability ? "text-2xl" : "text-4xl"} font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiPsychologicalAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
