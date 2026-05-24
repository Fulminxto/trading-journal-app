type Props = {
  totalTrades: number;
  totalPnl: number;
  winRate: number;
};

export default function PDFReportHeader({
  totalTrades,
  totalPnl,
  winRate,
}: Props) {
  const currentDate =
    new Date().toLocaleDateString(
      "it-IT",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#050b10] via-[#0f1726] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-400">
            VOLTIS Intelligence Report
          </p>

          <h1 className="mt-4 text-6xl font-black tracking-tight text-white">
            Trading Performance Report
          </h1>

          <p className="mt-4 text-base text-gray-400">
            Generated on {currentDate}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Trades
            </p>

            <h3 className="mt-3 text-4xl font-black text-cyan-400">
              {totalTrades}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              PnL
            </p>

            <h3
              className={`mt-3 text-4xl font-black ${
                totalPnl >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              ${totalPnl.toFixed(0)}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-5 text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Win Rate
            </p>

            <h3 className="mt-3 text-4xl font-black text-violet-400">
              {winRate}%
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}