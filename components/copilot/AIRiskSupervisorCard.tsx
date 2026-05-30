type Props = {
  supervisorLevel: string;
  riskSignals: number;
  behavioralDrift: boolean;
  executionDecay: boolean;
  confidenceDecay: boolean;
};

export default function AIRiskSupervisorCard({
  supervisorLevel,
  riskSignals,
  behavioralDrift,
  executionDecay,
  confidenceDecay,
}: Props) {
  return (
    <div className="rounded-[36px] border border-red-500/20 bg-red-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">
            AI Risk Supervisor
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Operational Risk Overview
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            supervisorLevel === "Critical"
              ? "bg-red-600/20 text-red-300"
              : supervisorLevel === "High"
              ? "bg-red-500/20 text-red-300"
              : supervisorLevel === "Moderate"
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {supervisorLevel}
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-4">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Risk Signals
          </p>

          <h3 className="mt-3 text-4xl font-black text-white">
            {riskSignals}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Drift
          </p>

          <h3
            className={`mt-3 text-2xl font-black ${
              behavioralDrift
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {behavioralDrift ? "Detected" : "Stable"}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Execution
          </p>

          <h3
            className={`mt-3 text-2xl font-black ${
              executionDecay
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {executionDecay ? "Declining" : "Stable"}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Confidence
          </p>

          <h3
            className={`mt-3 text-2xl font-black ${
              confidenceDecay
                ? "text-red-400"
                : "text-emerald-400"
            }`}
          >
            {confidenceDecay ? "Declining" : "Stable"}
          </h3>
        </div>
      </div>
    </div>
  );
}
