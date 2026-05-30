type Props = {
  bestSetup: string;
  weakSetupCount: number;
  strongTradeCount: number;
};

export default function EdgeDetectionEngine({
  bestSetup,
  weakSetupCount,
  strongTradeCount,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#07140f] via-[#0b1a14] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-green-400">
          Edge Detection
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Trading Edge Engine
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Best Setup
            </p>

            <h3 className="mt-3 text-2xl font-black text-green-400">
              {bestSetup}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Strong Trades
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {strongTradeCount}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Weak Setups
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakSetupCount}
            </h3>
          </div>
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS confronta qualità dei
          setup, execution rating e
          risultati operativi per
          individuare dove il trader
          possiede maggiore edge.
        </p>
      </div>
    </div>
  );
}
