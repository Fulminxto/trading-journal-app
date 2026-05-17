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
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm text-gray-400">
        Psychology Analytics
      </p>

      <h2 className="mt-1 text-2xl font-bold">
        Trader Psychology
      </h2>

      <div className="mt-6 space-y-4">
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
    </div>
  );
}