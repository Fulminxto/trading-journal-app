type Props = {
  strongTrades: number;
  averageTrades: number;
  weakTrades: number;
};

export default function TradePerformanceClusters({
  strongTrades,
  averageTrades,
  weakTrades,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Performance Clusters
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Trade Clustering
        </h2>

        <div className="mt-8 space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Strong Trades
              </p>

              <span className="font-bold text-green-400">
                {strongTrades}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-green-400"
                style={{
                  width: `${Math.min(
                    strongTrades * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Average Trades
              </p>

              <span className="font-bold text-cyan-400">
                {averageTrades}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{
                  width: `${Math.min(
                    averageTrades * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                Weak Trades
              </p>

              <span className="font-bold text-red-400">
                {weakTrades}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-red-400"
                style={{
                  width: `${Math.min(
                    weakTrades * 10,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS raggruppa i trade
          per qualità operativa per
          individuare pattern di edge,
          debolezza e consistenza.
        </p>
      </div>
    </div>
  );
}