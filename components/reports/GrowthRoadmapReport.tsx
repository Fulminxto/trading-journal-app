import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; behavioralRisk: number; winRate: number; };
export default function GrowthRoadmapReport({ disciplineScore, behavioralRisk, winRate, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const scaling = disciplineScore >= 80 && winRate >= 60 && behavioralRisk < 25; const stabilization = !scaling && disciplineScore >= 60;
  const nextLevel = scaling ? i.scalingPhase : stabilization ? i.stabilizationPhase : i.foundationPhase;
  const nextAction = scaling ? i.scalingAction : stabilization ? i.stabilizationAction : i.foundationAction;
  const tone = scaling ? "text-green-400" : stabilization ? "text-yellow-400" : "text-red-400";
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-violet-400">{i.growthRoadmap}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.aiGrowthEngine}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">{[{ label: t.discipline, value: disciplineScore, cls: "text-green-400" }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-cyan-400" }, { label: t.winRate, value: `${winRate}%`, cls: "text-cyan-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.nextTraderPhase}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{nextLevel}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{nextAction}</p></div></div></div>;
}
