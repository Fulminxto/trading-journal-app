type Props = {
  averageLoss: number;
  averageWin: number;
  behavioralRisk: number;
  losses: number;
};

export default function RiskManagementReport({
  averageLoss,
  averageWin,
  behavioralRisk,
  losses,
}: Props) {
  const riskReward =
    averageLoss !== 0
      ? (
          averageWin /
          Math.abs(averageLoss)
        ).toFixed(2)
      : "0";

  const riskStatus =
    Number(riskReward) >= 1.5 &&
    behavioralRisk < 30
      ? "Controlled Risk"
      : Number(riskReward) >= 1
      ? "Moderate Risk"
      : "Risk Exposure";

  const riskTone =
    riskStatus === "Controlled Risk"
      ? "text-green-400"
      : riskStatus === "Moderate Risk"
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#171020] to-black p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.3em] text-red-400">
          Risk Management
        </p>

        <h2 className="mt-4 text-5xl font-black tracking-tight text-white">
          Risk Report
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Avg Win
            </p>

            <h3 className="mt-4 text-4xl font-black text-green-400">
              ${averageWin.toFixed(0)}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Avg Loss
            </p>

            <h3 className="mt-4 text-4xl font-black text-red-400">
              ${averageLoss.toFixed(0)}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Risk Reward
            </p>

            <h3 className="mt-4 text-4xl font-black text-cyan-400">
              {riskReward}
            </h3>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm text-gray-400">
              Losses
            </p>

            <h3 className="mt-4 text-4xl font-black text-yellow-400">
              {losses}
            </h3>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-black/20 p-6">
          <p className="text-sm text-gray-400">
            AI Risk Assessment
          </p>

          <h3 className={`mt-4 text-3xl font-black ${riskTone}`}>
            {riskStatus}
          </h3>

          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-300">
            {riskStatus === "Controlled Risk"
              ? "La gestione del rischio appare strutturata e sostenibile."
              : riskStatus === "Moderate Risk"
              ? "La gestione del rischio è discreta ma ancora migliorabile."
              : "La struttura rischio/rendimento mostra fragilità operative."}
          </p>
        </div>
      </div>
    </div>
  );
}