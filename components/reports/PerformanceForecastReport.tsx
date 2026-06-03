import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { winRate: number; disciplineScore: number; behavioralRisk: number; totalPnl: number; };
export default function PerformanceForecastReport({ winRate, disciplineScore, behavioralRisk, totalPnl, appLanguage, currency }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const high = winRate >= 60 && disciplineScore >= 75 && behavioralRisk < 25; const stable = !high && winRate >= 50 && behavioralRisk < 40;
  const forecast = high ? i.highGrowthPotential : stable ? i.stableDevelopment : i.performanceInstability;
  const tone = high ? "text-green-400" : stable ? "text-yellow-400" : "text-red-400";
  const message = high ? i.forecastHighMessage : stable ? i.forecastStableMessage : i.forecastLowMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#111827] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-cyan-400">{i.performanceForecast}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.aiForecastEngine}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: t.winRate, value: `${winRate}%`, cls: "text-cyan-400" }, { label: t.discipline, value: disciplineScore, cls: "text-green-400" }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-green-400" }, { label: i.netPnl, value: formatReportCurrency(totalPnl, currency, appLanguage), cls: totalPnl >= 0 ? "text-green-400" : "text-red-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiForecastAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{forecast}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
