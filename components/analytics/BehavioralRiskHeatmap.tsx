type Props = {
  data: {
    factor: string;
    count: number;
    severity: "low" | "medium" | "high";
  }[];
};

function getTone(severity: string) {
  if (severity === "high") {
    return "border-red-500/30 bg-red-500/15";
  }

  if (severity === "medium") {
    return "border-yellow-500/30 bg-yellow-500/15";
  }

  return "border-green-500/20 bg-green-500/10";
}

export default function BehavioralRiskHeatmap({
  data,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#1a1010] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-red-400">
          Behavioral Risk Heatmap
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Risk Concentration
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
          {data.map((item) => (
            <div
              key={item.factor}
              className={`rounded-2xl border p-5 ${getTone(
                item.severity
              )}`}
            >
              <p className="text-sm text-gray-400">
                {item.factor}
              </p>

              <h3 className="mt-3 text-4xl font-black text-white">
                {item.count}
              </h3>

              <p className="mt-2 text-xs uppercase tracking-[0.16em] text-gray-400">
                {item.severity} risk
              </p>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS aggrega emozioni,
          bassa confidence, weak setup
          e weak execution per mostrare
          dove si concentra il rischio
          comportamentale del trader.
        </p>
      </div>
    </div>
  );
}