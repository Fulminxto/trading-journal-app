import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { averageWin: number; averageLoss: number; winRate: number; disciplineScore: number; };
export default function EdgeAnalysisReport({ averageWin, averageLoss, winRate, disciplineScore, appLanguage, currency }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const edgeScore = Math.round(winRate * 0.5 + disciplineScore * 0.3 + (averageWin > Math.abs(averageLoss) ? 20 : 0));
  const strong = edgeScore >= 80; const developing = !strong && edgeScore >= 60;
  const status = strong ? i.strongEdge : developing ? i.developingEdge : i.weakEdge;
  const tone = strong ? "text-green-400" : developing ? "text-yellow-400" : "text-red-400";
  const message = strong ? i.edgeStrongMessage : developing ? i.edgeDevelopingMessage : i.edgeWeakMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-cyan-400">{i.edgeAnalysis}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.aiEdgeEngine}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: i.edgeScore, value: edgeScore, cls: tone }, { label: t.avgWin, value: formatReportCurrency(averageWin, currency, appLanguage), cls: "text-green-400" }, { label: t.avgLoss, value: formatReportCurrency(averageLoss, currency, appLanguage), cls: "text-red-400" }, { label: t.winRate, value: `${winRate}%`, cls: "text-violet-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiEdgeAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
