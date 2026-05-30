type Props = {
  weakExecutionTrades: number;
  emotionalTrades: number;
  highQualityTrades: number;
};

export default function TradeBehaviorWarnings({
  weakExecutionTrades,
  emotionalTrades,
  highQualityTrades,
}: Props) {
  const hasWarnings =
    weakExecutionTrades > 2 ||
    emotionalTrades > highQualityTrades;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#1a1010] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-red-400">
              Behavior Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Trade Behavior Warnings
            </h2>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              hasWarnings
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-green-500/20 bg-green-500/10 text-green-400"
            }`}
          >
            {hasWarnings ? "Warnings Active" : "Stable"}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Weak Execution
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakExecutionTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Emotional Trades
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              High Quality
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {highQualityTrades}
            </h3>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS monitora trade emotivi,
          esecuzioni deboli e qualità dei
          setup per individuare pattern
          comportamentali che possono
          compromettere la performance.
        </p>
      </div>
    </div>
  );
}
