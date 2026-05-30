type LatestTrade = {
  symbol: string;
  outcome: string | null;
  executionRating: number | null;
  confidence: number | null;
  emotionalState: string | null;
};

type Props = {
  latestTrade: LatestTrade | undefined;
  latestTradeReview: string;
};

export default function TradeReviewCard({
  latestTrade,
  latestTradeReview,
}: Props) {
  return (
    <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Trade-by-Trade Review
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Latest Trade Intelligence
          </h2>
        </div>

        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-cyan-300">
          AI Review
        </div>
      </div>

      <div className="mt-8 rounded-[28px] border border-white/10 bg-black/20 p-6">
        {latestTrade ? (
          <>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Latest Trade
                </p>

                <h3 className="mt-2 text-2xl font-black text-white">
                  {latestTrade.symbol}
                </h3>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
                  latestTrade.outcome === "win"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : latestTrade.outcome === "loss"
                    ? "bg-red-500/20 text-red-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {latestTrade.outcome}
              </div>
            </div>

            <p className="mt-6 text-sm leading-relaxed text-gray-300">
              {latestTradeReview}
            </p>

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Execution
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {latestTrade.executionRating || 0}/10
                </h3>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Confidence
                </p>

                <h3 className="mt-2 text-3xl font-black text-white">
                  {latestTrade.confidence || 0}/10
                </h3>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                  Emotional State
                </p>

                <h3 className="mt-2 text-lg font-black text-white">
                  {latestTrade.emotionalState || "Stable"}
                </h3>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            Nessun trade disponibile per la review AI.
          </p>
        )}
      </div>
    </div>
  );
}
