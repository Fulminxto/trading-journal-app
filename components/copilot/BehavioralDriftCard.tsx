type Props = {
  behavioralDrift: boolean;
  recentAverageQuality: number;
  previousAverageQuality: number;
};

export default function BehavioralDriftCard({
  behavioralDrift,
  recentAverageQuality,
  previousAverageQuality,
}: Props) {
  return (
    <div className="rounded-[36px] border border-red-500/20 bg-red-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">
            Behavioral Drift Detection
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Quality Decay Monitor
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            behavioralDrift
              ? "bg-red-500/20 text-red-300"
              : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {behavioralDrift ? "Drift Detected" : "Stable"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Recent Quality
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {recentAverageQuality}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Previous Quality
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {previousAverageQuality}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Status
          </p>

          <h3
            className={`mt-3 text-3xl font-black ${
              behavioralDrift
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {behavioralDrift ? "Decay" : "Stable"}
          </h3>
        </div>
      </div>
    </div>
  );
}
