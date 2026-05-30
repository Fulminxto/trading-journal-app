type Props = {
  lowConfidenceTrades: number;
  highConfidenceTrades: number;
  highQualityTrades: number;
};

export default function ConfidenceAnalyticsEngine({
  lowConfidenceTrades,
  highConfidenceTrades,
  highQualityTrades,
}: Props) {
  const confidenceStatus =
    highConfidenceTrades >= highQualityTrades
      ? "Conviction Strong"
      : lowConfidenceTrades > highConfidenceTrades
      ? "Underconfident"
      : "Balanced";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Confidence Analytics
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Confidence Engine
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              High Confidence
            </p>

            <h3 className="mt-3 text-4xl font-black text-green-400">
              {highConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Low Confidence
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Confidence Status
            </p>

            <h3 className="mt-3 text-2xl font-black text-cyan-400">
              {confidenceStatus}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS confronta confidence,
          qualità dei trade e disciplina
          esecutiva per capire se la
          convinzione operativa è
          allineata al tuo reale edge.
        </p>
      </div>
    </div>
  );
}
