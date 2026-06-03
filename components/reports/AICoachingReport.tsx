import {
  getReportLabels,
  type ReportI18nProps,
} from "@/components/reports/ReportI18n";
import { getReportInsightLabels } from "@/components/reports/ReportInsightI18n";


type Props = ReportI18nProps & {
  disciplineScore: number;
  behavioralRisk: number;
  winRate: number;
  emotionalTrades: number;
};

export default function AICoachingReport({ disciplineScore, behavioralRisk, winRate, emotionalTrades, appLanguage }: Props) {
  const t = getReportLabels(appLanguage);
  const i = getReportInsightLabels(appLanguage);

  const primaryFocus = disciplineScore < 60 ? i.disciplineExecution : behavioralRisk >= 30 ? i.behavioralStability : winRate < 50 ? i.setupQuality : i.scalingConsistency;
  const coachingMessage = primaryFocus === i.disciplineExecution ? i.disciplineExecutionMessage : primaryFocus === i.behavioralStability ? i.behavioralStabilityMessage : primaryFocus === i.setupQuality ? i.setupQualityMessage : i.scalingConsistencyMessage;

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#071018] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />
      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-400">{i.aiCoachingLayer}</p>
        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">{i.coachingReport}</h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          {[{ label: t.discipline, value: disciplineScore, cls: "text-green-400" }, { label: t.behavioralRisk, value: `${behavioralRisk}%`, cls: behavioralRisk >= 50 ? "text-red-400" : behavioralRisk >= 25 ? "text-yellow-400" : "text-cyan-400" }, { label: t.winRate, value: `${winRate}%`, cls: "text-violet-400" }, { label: t.emotionalTrades, value: emotionalTrades, cls: "text-yellow-400" }].map((card) => (
            <div key={card.label} className="rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{card.label}</p><h3 className={`mt-4 text-4xl font-black ${card.cls}`}>{card.value}</h3></div>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6"><p className="text-sm text-gray-400">{i.primaryFocus}</p><h3 className="mt-4 text-3xl font-black text-cyan-400">{primaryFocus}</h3><p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">{coachingMessage}</p></div>
      </div>
    </div>
  );
}
