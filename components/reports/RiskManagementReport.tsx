import {
  formatReportCurrency,
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & { averageLoss: number; averageWin: number; behavioralRisk: number; losses: number; };
export default function RiskManagementReport({ averageLoss, averageWin, behavioralRisk, losses, appLanguage, currency }: Props) {
  const t = getReportLabels(appLanguage); const i = getReportInsightLabels(appLanguage);
  const riskReward = averageLoss !== 0 ? (averageWin / Math.abs(averageLoss)).toFixed(2) : "0";
  const controlled = Number(riskReward) >= 1.5 && behavioralRisk < 30; const moderate = !controlled && Number(riskReward) >= 1;
  const status = controlled ? i.controlledRisk : moderate ? i.moderateRisk : i.riskExposure;
  const tone = controlled ? "text-green-400" : moderate ? "text-yellow-400" : "text-red-400";
  const message = controlled ? i.riskControlledMessage : moderate ? i.riskModerateMessage : i.riskExposureMessage;
  return <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#171020] to-black p-10"><div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_35%)]" /><div className="relative z-10"><p className="text-sm uppercase tracking-[0.3em] text-red-400">{i.riskManagement}</p><h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.riskReport}</h2><div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">{[{ label: t.avgWin, value: formatReportCurrency(averageWin, currency, appLanguage), cls: "text-accent" }, { label: t.avgLoss, value: formatReportCurrency(averageLoss, currency, appLanguage), cls: "text-red-400" }, { label: i.riskReward, value: riskReward, cls: "text-accent-bright" }, { label: t.losses, value: losses, cls: "text-yellow-400" }].map(c => <div key={c.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{c.label}</p><h3 className={`mt-4 text-4xl font-black ${c.cls}`}>{c.value}</h3></div>)}</div><div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.aiRiskAssessment}</p><h3 className={`mt-4 text-3xl font-black ${tone}`}>{status}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{message}</p></div></div></div>;
}
