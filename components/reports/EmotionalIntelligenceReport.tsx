import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { emotionalTrades: number; totalTrades: number; behavioralRisk: number; disciplineScore: number; };
export default function EmotionalIntelligenceReport({ emotionalTrades, totalTrades, behavioralRisk, disciplineScore, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const emotionalRatio = totalTrades > 0 ? emotionalTrades / totalTrades : 0;
  const emotionalScore = Math.max(0, Math.min(100, Math.round(100 - emotionalRatio * 50 - behavioralRisk * 0.3 + disciplineScore * 0.2)));
  const stable = emotionalScore >= 80; const moderate = !stable && emotionalScore >= 60;
  const status = stable ? i.emotionallyStable : moderate ? i.moderateEmotionalStability : i.emotionalInstability;
  const tone = stable ? "text-green-400" : moderate ? "text-yellow-400" : "text-red-400";
  const message = stable ? i.emotionalStableMessage : moderate ? i.emotionalModerateMessage : i.emotionalLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#120c08] via-[#171020] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-yellow-400">{i.emotionalIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.emotionalStabilityReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4"><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.emotionalScore}</p><h3 className={`mt-4 text-4xl font-black ${tone}`}>{emotionalScore}</h3></div><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{t.emotionalTrades}</p><h3 className="mt-4 text-4xl font-black text-yellow-400">{emotionalTrades}</h3></div><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.emotionalRatio}</p><h3 className="mt-4 text-4xl font-black text-cyan-400">{Math.round(emotionalRatio * 100)}%</h3></div><div className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{t.behavioralRisk}</p><h3 className={`mt-4 text-4xl font-black ${behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-green-400"}`}>{behavioralRisk}%</h3></div></div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiEmotionalAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
