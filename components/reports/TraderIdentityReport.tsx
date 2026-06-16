import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; behavioralRisk: number; winRate: number; emotionalTrades: number; totalTrades: number; };
export default function TraderIdentityReport({ disciplineScore, behavioralRisk, winRate, emotionalTrades, totalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const emotionalRatio = totalTrades > 0 ? emotionalTrades / totalTrades : 0;
  const structured = disciplineScore >= 80 && behavioralRisk < 25 && winRate >= 60; const developing = !structured && disciplineScore >= 60; const emotional = !structured && !developing && emotionalRatio >= 0.4;
  const identity = structured ? i.structuredTrader : developing ? i.developingTrader : emotional ? i.emotionalTrader : i.unstableTrader;
  const tone = structured ? "text-green-400" : developing ? "text-yellow-400" : "text-red-400";
  const message = structured ? i.identityStructuredMessage : developing ? i.identityDevelopingMessage : emotional ? i.identityEmotionalMessage : i.identityUnstableMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_10%,transparent),transparent_35%)]" /><div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-accent-bright">{i.traderIdentity}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.identityReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-5">{[{ label: i.identity, value: identity, cls: tone }, { label: t.discipline, value: disciplineScore, cls: "text-accent" }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-accent-bright" }, { label: t.winRate, value: `${winRate}%`, cls: "text-violet-400" }, { label: i.emotionalRatio, value: `${Math.round(emotionalRatio * 100)}%`, cls: "text-yellow-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 ${c.label === i.identity ? "text-2xl" : "text-4xl"} font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiIdentityAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{identity}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
