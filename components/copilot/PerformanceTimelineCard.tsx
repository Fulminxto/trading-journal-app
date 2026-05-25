type TimelineItem = {
  id: string | number;
  index: number;
  symbol: string;
  outcome: string | null;
  qualityScore: number;
};

type Props = {
  performanceTimeline: TimelineItem[];
};

export default function PerformanceTimelineCard({
  performanceTimeline,
}: Props) {
  return (
    <div className="rounded-[36px] border border-violet-500/20 bg-violet-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
            AI Performance Timeline
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Trader Evolution Tracking
          </h2>
        </div>

        <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-violet-300">
          {performanceTimeline.length} Trades
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {performanceTimeline.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-gray-400">
              Nessun dato disponibile per costruire la timeline AI.
            </p>
          </div>
        ) : (
          performanceTimeline.slice(-8).map((item) => (
            <div
              key={item.id}
              className="rounded-[28px] border border-white/10 bg-black/20 p-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                    Trade #{item.index}
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    {item.symbol}
                  </h3>
                </div>

                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
                    Quality Score
                  </p>

                  <h3
                    className={`mt-2 text-2xl font-black ${
                      item.qualityScore >= 80
                        ? "text-emerald-400"
                        : item.qualityScore >= 60
                        ? "text-cyan-400"
                        : item.qualityScore >= 40
                        ? "text-yellow-300"
                        : "text-red-400"
                    }`}
                  >
                    {item.qualityScore}%
                  </h3>
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-violet-400"
                  style={{
                    width: `${item.qualityScore}%`,
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}