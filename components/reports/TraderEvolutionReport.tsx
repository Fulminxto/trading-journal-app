import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { disciplineScore: number; winRate: number; emotionalTrades: number; totalTrades: number; };
export default function TraderEvolutionReport({ disciplineScore, winRate, emotionalTrades, totalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const maturity = disciplineScore >= 80 ? i.advancedTrader : disciplineScore >= 60 ? i.developingTraderConsistency : i.earlyStageTrader;
  const stable = emotionalTrades <= totalTrades * 0.2; const watch = !stable && emotionalTrades <= totalTrades * 0.4;
  const psychologyHealth = stable ? i.stable : watch ? i.watchlist : i.unstable;
  const psychologyTone = stable ? "text-green-400" : watch ? "text-yellow-400" : "text-red-400";
  const insight = disciplineScore >= 80 ? i.evolutionAdvancedMessage : disciplineScore >= 60 ? i.evolutionDevelopingMessage : i.evolutionEarlyMessage;
  return <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#0b0f1a] via-[#111827] to-black p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.12),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.25em] text-violet-400">{i.traderEvolution}</p><h2 className="mt-3 text-4xl font-black text-white">{i.evolutionReport}</h2><div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">{[{ label: t.discipline, value: disciplineScore, cls: "text-accent" }, { label: t.winRate, value: `${winRate}%`, cls: "text-accent-bright" }, { label: i.traderStage, value: maturity, cls: "text-violet-400" }, { label: i.psychology, value: psychologyHealth, cls: psychologyTone }].map(c => <div key={c.label} className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-3 ${c.label === i.traderStage || c.label === i.psychology ? "text-2xl" : "text-4xl"} font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{i.aiEvolutionInsight}</p><h3 className="mt-3 text-xl font-black leading-relaxed text-white">{insight}</h3></div></div></div>;
}
