import {
  getCopilotLabels,
  getCopilotStatusLabel,
  type CopilotI18nProps,
} from "@/components/copilot/CopilotI18n";


type Props = CopilotI18nProps & {
  reviewScore: number;
  reviewLabel: string;
  averageExecution: number;
  averageConfidence: number;
};

export default function AIReviewEngineCard({
  reviewScore,
  reviewLabel,
  averageExecution,
  averageConfidence,
  appLanguage,
}: Props) {
  const t = getCopilotLabels(appLanguage);

  return (
    <div className="rounded-[36px] border border-violet-500/20 bg-violet-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
            {t.components.aiReviewEngine.eyebrow}
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            {t.components.aiReviewEngine.title}
          </h2>
        </div>

        <div className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${reviewScore >= 85 ? "bg-emerald-500/20 text-emerald-300" : reviewScore >= 70 ? "bg-cyan-500/20 text-cyan-300" : reviewScore >= 50 ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"}`}>
          {getCopilotStatusLabel(reviewLabel, t) || reviewLabel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <Metric label={t.components.aiReviewEngine.reviewScore} value={`${reviewScore}%`} />
        <Metric label={t.components.aiReviewEngine.averageExecution} value={`${averageExecution}/10`} />
        <Metric label={t.components.aiReviewEngine.averageConfidence} value={`${averageConfidence}/10`} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
      <p className="text-xs uppercase tracking-[0.15em] text-gray-400">{label}</p>
      <h3 className="mt-3 text-4xl font-black text-white">{value}</h3>
    </div>
  );
}
