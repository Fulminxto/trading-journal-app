import AnalyticsSection from "./AnalyticsSection";

type Props = {
  averageWin: string;
  averageLoss: string;
  profitFactor: string;
  bestWinStreak: number;
};

export default function PerformanceIntelligence({
  averageWin,
  averageLoss,
  profitFactor,
  bestWinStreak,
}: Props) {
  return (
    <AnalyticsSection
      subtitle="Performance intelligence"
      title="Advanced Metrics"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Average Win
          </p>

          <h3 className="mt-2 text-2xl font-bold text-green-400">
            {averageWin}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Average Loss
          </p>

          <h3 className="mt-2 text-2xl font-bold text-red-400">
            {averageLoss}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Best Win Streak
          </p>

          <h3 className="mt-2 text-2xl font-bold text-cyan-400">
            {bestWinStreak}
          </h3>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            Profit Factor
          </p>

          <h3 className="mt-2 text-2xl font-bold text-violet-400">
            {profitFactor}
          </h3>
        </div>
      </div>
    </AnalyticsSection>
  );
}