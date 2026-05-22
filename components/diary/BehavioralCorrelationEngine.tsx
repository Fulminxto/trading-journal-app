type Props = {
  emotionalTrades: number;
  weakExecutionTrades: number;
  lowConfidenceTrades: number;
  totalTrades: number;
};

export default function BehavioralCorrelationEngine({
  emotionalTrades,
  weakExecutionTrades,
  lowConfidenceTrades,
  totalTrades,
}: Props) {
  const behavioralRisk =
    totalTrades > 0
      ? Math.round(
          ((emotionalTrades +
            weakExecutionTrades +
            lowConfidenceTrades) /
            totalTrades) *
            100
        )
      : 0;

  const status =
    behavioralRisk >= 50
      ? "High Risk"
      : behavioralRisk >= 25
      ? "Watchlist"
      : "Stable";

  const tone =
    behavioralRisk >= 50
      ? "text-red-400"
      : behavioralRisk >= 25
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#100b14] via-[#151020] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.14),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Behavioral Correlation
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Behavior Risk Engine
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Behavioral Risk
            </p>

            <h3 className={`mt-3 text-4xl font-black ${tone}`}>
              {behavioralRisk}%
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Status
            </p>

            <h3 className={`mt-3 text-2xl font-black ${tone}`}>
              {status}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Emotional
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Weak Execution
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakExecutionTrades}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS aggrega emozioni,
          bassa confidence ed esecuzioni
          deboli per stimare il rischio
          comportamentale che può ridurre
          il tuo edge operativo.
        </p>
      </div>
    </div>
  );
}