type Props = {
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
}: Props) {
  return (
    <div className="rounded-[36px] border border-violet-500/20 bg-violet-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
            AI Review Engine
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Decision Quality Analysis
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            reviewScore >= 85
              ? "bg-emerald-500/20 text-emerald-300"
              : reviewScore >= 70
              ? "bg-cyan-500/20 text-cyan-300"
              : reviewScore >= 50
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {reviewLabel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Review Score
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {reviewScore}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Avg Execution
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {averageExecution}/10
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Avg Confidence
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {averageConfidence}/10
          </h3>
        </div>
      </div>
    </div>
  );
}
