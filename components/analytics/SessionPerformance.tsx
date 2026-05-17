type Props = {
  londonTrades: number;
  newYorkTrades: number;
  asianTrades: number;
};

export default function SessionPerformance({
  londonTrades,
  newYorkTrades,
  asianTrades,
}: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-gray-400">
        Session Performance
      </p>

      <h2 className="mt-1 text-2xl font-bold">
        Trading Sessions
      </h2>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              London Session
            </span>

            <span className="font-bold text-cyan-400">
              {londonTrades}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              New York Session
            </span>

            <span className="font-bold text-violet-400">
              {newYorkTrades}
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Asian Session
            </span>

            <span className="font-bold text-yellow-400">
              {asianTrades}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}