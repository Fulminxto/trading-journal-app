type Props = {
  lowConfidenceTrades: number;
  weakSetupTrades: number;
  impulsiveTrades: number;
};

export default function ExecutionPatternEngine({
  lowConfidenceTrades,
  weakSetupTrades,
  impulsiveTrades,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Execution Pattern Engine
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Behavioral Patterns
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Low Confidence
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {lowConfidenceTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Weak Setups
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakSetupTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Impulsive Trades
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {impulsiveTrades}
            </h3>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          Questa sezione individua
          pattern di bassa confidence,
          setup deboli e operatività
          impulsiva per migliorare la
          disciplina decisionale.
        </p>
      </div>
    </div>
  );
}
