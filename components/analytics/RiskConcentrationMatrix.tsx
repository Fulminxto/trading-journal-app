type RiskItem = {
  label: string;
  value: number;
};

type Props = {
  risks: RiskItem[];
};

function getRiskTone(value: number) {
  if (value >= 40) {
    return "border-red-500/30 bg-red-500/15 text-red-400";
  }

  if (value >= 20) {
    return "border-yellow-500/30 bg-yellow-500/15 text-yellow-400";
  }

  return "border-green-500/20 bg-green-500/10 text-green-400";
}

export default function RiskConcentrationMatrix({
  risks,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#090b16] via-[#130f20] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.16),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          AI Risk Matrix
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Risk Concentration
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {risks.map((risk) => (
            <div
              key={risk.label}
              className={`rounded-2xl border p-5 ${getRiskTone(
                risk.value
              )}`}
            >
              <p className="text-sm text-gray-300">
                {risk.label}
              </p>

              <h3 className="mt-3 text-4xl font-black">
                {risk.value}%
              </h3>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS aggrega i principali
          fattori di rischio operativo
          per mostrare dove si concentra
          la fragilità del processo.
        </p>
      </div>
    </div>
  );
}