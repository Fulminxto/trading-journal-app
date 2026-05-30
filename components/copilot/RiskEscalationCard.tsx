type Props = {
  escalationLevel: string;
  protectionRequired: boolean;
  cooldownRecommended: boolean;
  message: string;
};

export default function RiskEscalationCard({
  escalationLevel,
  protectionRequired,
  cooldownRecommended,
  message,
}: Props) {
  return (
    <div className="rounded-[36px] border border-red-500/20 bg-red-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">
            Risk Escalation
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Protection Protocol
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            escalationLevel === "Protection"
              ? "bg-red-600/20 text-red-300"
              : escalationLevel === "Cooldown"
              ? "bg-yellow-500/20 text-yellow-300"
              : escalationLevel === "Monitor"
              ? "bg-cyan-500/20 text-cyan-300"
              : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {escalationLevel}
        </div>
      </div>

      <p className="mt-6 max-w-4xl text-sm leading-relaxed text-gray-300">
        {message}
      </p>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Protection Required
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {protectionRequired ? "Yes" : "No"}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Cooldown Recommended
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {cooldownRecommended ? "Yes" : "No"}
          </h3>
        </div>
      </div>
    </div>
  );
}
