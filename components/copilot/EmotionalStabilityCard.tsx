type Props = {
  emotionalLabel: string;
  emotionalInstabilityScore: number;
  emotionalVolatility: boolean;
  emotionalTradesCount: number;
};

export default function EmotionalStabilityCard({
  emotionalLabel,
  emotionalInstabilityScore,
  emotionalVolatility,
  emotionalTradesCount,
}: Props) {
  return (
    <div className="rounded-[36px] border border-pink-500/20 bg-pink-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-pink-400">
            Emotional Stability
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Emotional Volatility Monitor
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            emotionalLabel === "Critical"
              ? "bg-red-600/20 text-red-300"
              : emotionalLabel === "High"
              ? "bg-red-500/20 text-red-300"
              : emotionalLabel === "Moderate"
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {emotionalLabel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Emotional Instability
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {emotionalInstabilityScore}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Emotional Trades
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {emotionalTradesCount}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Status
          </p>

          <h3
            className={`mt-3 text-3xl font-black ${
              emotionalVolatility
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {emotionalVolatility
              ? "Volatile"
              : "Stable"}
          </h3>
        </div>
      </div>
    </div>
  );
}