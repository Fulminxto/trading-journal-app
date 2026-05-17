import AnalyticsSection from "./AnalyticsSection";

type Props = {
  averageConfidence: number;
  averageExecution: number;
  averageSetupQuality: number;
};

export default function PsychologyAnalytics({
  averageConfidence,
  averageExecution,
  averageSetupQuality,
}: Props) {
  return (
    <AnalyticsSection
      subtitle="Psychology intelligence"
      title="Trader Psychology"
    >
      <div className="space-y-4">
        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Confidence
            </span>

            <span className="font-bold text-cyan-400">
              {averageConfidence}/10
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Execution
            </span>

            <span className="font-bold text-violet-400">
              {averageExecution}/10
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-black/20 p-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">
              Setup Quality
            </span>

            <span className="font-bold text-yellow-400">
              {averageSetupQuality}/10
            </span>
          </div>
        </div>
      </div>
    </AnalyticsSection>
  );
}