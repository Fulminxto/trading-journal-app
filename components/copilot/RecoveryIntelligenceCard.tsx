type Props = {
  recoveryScore: number;
  recoveryLabel: string;
  recentWins: number;
  recentLosses: number;
};

export default function RecoveryIntelligenceCard({
  recoveryScore,
  recoveryLabel,
  recentWins,
  recentLosses,
}: Props) {
  return (
    <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
            AI Recovery Intelligence
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Drawdown Recovery Analysis
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            recoveryScore >= 80
              ? "bg-emerald-500/20 text-emerald-300"
              : recoveryScore >= 60
              ? "bg-cyan-500/20 text-cyan-300"
              : recoveryScore > 0
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {recoveryLabel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Recovery Score
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {recoveryScore}%
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Recent Wins
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {recentWins}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Recent Losses
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {recentLosses}
          </h3>
        </div>
      </div>
    </div>
  );
}