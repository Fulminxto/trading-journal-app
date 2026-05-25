type Props = {
  intelligenceFeed: string[];
};

export default function DailyIntelligenceFeed({
  intelligenceFeed,
}: Props) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            Daily Intelligence Feed
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Operational Highlights
          </h2>
        </div>

        <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-cyan-300">
          {intelligenceFeed.length} Insights
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {intelligenceFeed.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm leading-relaxed text-gray-400">
              Nessun insight operativo disponibile al momento.
            </p>
          </div>
        ) : (
          intelligenceFeed.map((item) => (
            <div
              key={item}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-sm leading-relaxed text-gray-300">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}