type Props = {
  emotionalTrades: number;
  lowConfidenceTrades: number;
  weakExecutionTrades: number;
  totalTrades: number;
};

export default function BehavioralReportCard({
  emotionalTrades,
  lowConfidenceTrades,
  weakExecutionTrades,
  totalTrades,
}: Props) {
  const behavioralRisk =
    totalTrades > 0
      ? Math.round(
          ((emotionalTrades +
            lowConfidenceTrades +
            weakExecutionTrades) /
            totalTrades) *
            100
        )
      : 0;

  const riskLabel =
    behavioralRisk >= 50
      ? "High Behavioral Risk"
      : behavioralRisk >= 25
      ? "Behavior Watchlist"
      : "Stable Behavior";

  const riskTone =
    behavioralRisk >= 50
      ? "text-red-400"
      : behavioralRisk >= 25
      ? "text-yellow-400"
      : "text-green-400";

  return (
    <div className="report-card relative overflow-hidden rounded-[36px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#171020] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.25em] text-red-400">
          Behavioral Report
        </p>

        <h2 className="mt-3 text-4xl font-black text-white">
          Trader Behavior Analysis
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Risk Score
            </p>

            <h3 className={`mt-3 text-4xl font-black ${riskTone}`}>
              {behavioralRisk}%
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Status
            </p>

            <h3 className={`mt-3 text-2xl font-black ${riskTone}`}>
              {riskLabel}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Emotional Trades
            </p>

            <h3 className="mt-3 text-4xl font-black text-yellow-400">
              {emotionalTrades}
            </h3>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <p className="text-sm text-gray-400">
              Weak Execution
            </p>

            <h3 className="mt-3 text-4xl font-black text-red-400">
              {weakExecutionTrades}
            </h3>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm text-gray-400">
            AI Behavioral Summary
          </p>

          <h3 className="mt-3 text-xl font-black leading-relaxed text-white">
            {behavioralRisk >= 50
              ? "Il comportamento operativo mostra segnali di rischio elevato. Priorità: ridurre impulsività, migliorare review e filtrare meglio i setup."
              : behavioralRisk >= 25
              ? "Sono presenti alcuni segnali da monitorare. Mantieni focus su execution, confidence e disciplina emotiva."
              : "La struttura comportamentale appare stabile. Continua a proteggere processo, routine e qualità decisionale."}
          </h3>
        </div>
      </div>
    </div>
  );
}