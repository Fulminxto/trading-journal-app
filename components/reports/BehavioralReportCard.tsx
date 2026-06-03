import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & {
  emotionalTrades: number;
  lowConfidenceTrades: number;
  weakExecutionTrades: number;
  totalTrades: number;
};

export default function BehavioralReportCard({ emotionalTrades, lowConfidenceTrades, weakExecutionTrades, totalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage);
  const i = getReportInsightLabels(appLanguage);
  const behavioralRisk = totalTrades > 0 ? Math.round(((emotionalTrades + lowConfidenceTrades + weakExecutionTrades) / totalTrades) * 100) : 0;
  const isHigh = behavioralRisk >= 50;
  const isWatch = !isHigh && behavioralRisk >= 25;
  const riskLabel = isHigh ? i.highBehavioralRisk : isWatch ? i.behaviorWatchlist : i.stableBehavior;
  const riskTone = isHigh ? "text-red-400" : isWatch ? "text-yellow-400" : "text-green-400";
  const summary = isHigh ? i.behavioralHighMessage : isWatch ? i.behavioralWatchMessage : i.behavioralStableMessage;

  return (
    <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#171020] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />
      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-red-400">{i.behavioralReport}</p>
        <h2 className="mt-3 text-4xl font-black text-white">{i.traderBehaviorAnalysis}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{i.riskScore}</p><h3 className={`mt-3 text-4xl font-black ${riskTone}`}>{behavioralRisk}%</h3></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{i.status}</p><h3 className={`mt-3 text-2xl font-black ${riskTone}`}>{riskLabel}</h3></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{t.emotionalTrades}</p><h3 className="mt-3 text-4xl font-black text-yellow-400">{emotionalTrades}</h3></div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{t.weakExecutions}</p><h3 className="mt-3 text-4xl font-black text-red-400">{weakExecutionTrades}</h3></div>
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="text-sm text-gray-400">{i.aiBehavioralSummary}</p><h3 className="mt-3 text-xl font-black leading-relaxed text-white">{summary}</h3></div>
      </div>
    </div>
  );
}
