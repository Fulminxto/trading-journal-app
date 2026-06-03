import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { totalTrades: number; disciplineScore: number; averageWin: number; averageLoss: number; winRate: number; };
export default function SetupIntelligenceReport({ disciplineScore, averageWin, averageLoss, winRate, appLanguage, currency }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const score = Math.max(0, Math.min(100, Math.round(disciplineScore * 0.4 + winRate * 0.4 + (averageWin > Math.abs(averageLoss) ? 20 : 0))));
  const elite = score >= 80; const developing = !elite && score >= 60;
  const status = elite ? i.eliteSetupSelection : developing ? i.developingSetupQuality : i.weakSetupStructure;
  const tone = elite ? "text-green-400" : developing ? "text-yellow-400" : "text-red-400";
  const message = elite ? i.setupEliteMessage : developing ? i.setupDevelopingMessage : i.setupWeakMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#0b1020] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-violet-400">{i.setupIntelligence}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.setupQualityReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: i.setupScore, value: score, cls: tone }, { label: t.winRate, value: `${winRate}%`, cls: "text-cyan-400" }, { label: t.avgWin, value: formatReportCurrency(averageWin, currency, appLanguage), cls: "text-green-400" }, { label: t.avgLoss, value: formatReportCurrency(averageLoss, currency, appLanguage), cls: "text-red-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiSetupAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
