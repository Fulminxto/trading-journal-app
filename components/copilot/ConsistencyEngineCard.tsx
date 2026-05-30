type Props = {
  consistencyScore: number;
  consistencyLabel: string;
  disciplineScore: number;
  behavioralRisk: number;
};

export default function ConsistencyEngineCard({
  consistencyScore,
  consistencyLabel,
  disciplineScore,
  behavioralRisk,
}: Props) {
  return (
    <div className="rounded-[36px] border border-emerald-500/20 bg-emerald-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-400">
            Consistency Engine
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Operational Stability
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            consistencyScore >= 80
              ? "bg-emerald-500/20 text-emerald-300"
              : consistencyScore >= 65
              ? "bg-cyan-500/20 text-cyan-300"
              : consistencyScore >= 45
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {consistencyLabel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Consistency Score
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {consistencyScore}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Discipline
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {disciplineScore}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Behavioral Risk
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {behavioralRisk}%
          </h3>
        </div>
      </div>
    </div>
  );
}
