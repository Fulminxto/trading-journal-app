type Props = {
  accountName: string;
  totalPnl: string;
  winRate: number;
  totalTrades: number;
};

export default function AnalyticsHero({
  accountName,
  totalPnl,
  winRate,
  totalTrades,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#111827] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.15),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">
              VOLTIS Analytics
            </p>

            <h1 className="mt-4 text-4xl font-black tracking-tight text-white xl:text-6xl">
              {accountName}
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
              Performance intelligence,
              psychology tracking e
              analytics avanzati per
              costruire un sistema di
              trading professionale.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:min-w-[420px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                Total PnL
              </p>

              <h2 className="mt-3 text-3xl font-black text-green-400">
                {totalPnl}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                Win Rate
              </p>

              <h2 className="mt-3 text-3xl font-black text-cyan-400">
                {winRate}%
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                Total Trades
              </p>

              <h2 className="mt-3 text-3xl font-black text-violet-400">
                {totalTrades}
              </h2>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
              <p className="text-sm text-gray-400">
                Account Status
              </p>

              <h2 className="mt-3 text-3xl font-black text-yellow-400">
                Active
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}