type Props = {
  executionDecay: boolean;
  recentExecutionAverage: number;
  previousExecutionAverage: number;
};

export default function ExecutionStabilityCard({
  executionDecay,
  recentExecutionAverage,
  previousExecutionAverage,
}: Props) {
  return (
    <div className="rounded-[36px] border border-orange-500/20 bg-orange-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-orange-400">
            Execution Stability
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Execution Quality Monitor
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            executionDecay
              ? "bg-red-500/20 text-red-300"
              : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {executionDecay ? "Decay" : "Stable"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Recent Execution
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {recentExecutionAverage}/10
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Previous Execution
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {previousExecutionAverage}/10
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Status
          </p>

          <h3
            className={`mt-3 text-3xl font-black ${
              executionDecay
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {executionDecay ? "Declining" : "Stable"}
          </h3>
        </div>
      </div>
    </div>
  );
}