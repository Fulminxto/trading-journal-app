type Props = {
  data: {
    emotion: string;
    count: number;
    pnl: number;
  }[];
};

function getTone(pnl: number) {
  if (pnl > 0) {
    return "border-green-500/20 bg-green-500/10";
  }

  if (pnl < 0) {
    return "border-red-500/20 bg-red-500/10";
  }

  return "border-white/10 bg-white/[0.03]";
}

export default function EmotionalStateHeatmap({
  data,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.10),transparent_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-violet-400">
          Psychology Heatmap
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          Emotional State Performance
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 md:col-span-3">
              <p className="text-sm text-gray-400">
                Nessuno stato emotivo registrato.
              </p>
            </div>
          ) : (
            data.map((item) => (
              <div
                key={item.emotion}
                className={`rounded-2xl border p-5 ${getTone(
                  item.pnl
                )}`}
              >
                <p className="text-sm text-gray-400">
                  {item.emotion}
                </p>

                <h3 className="mt-3 text-3xl font-black text-white">
                  {item.count}
                </h3>

                <p
                  className={`mt-2 text-sm font-bold ${
                    item.pnl >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {item.pnl >= 0 ? "+" : ""}
                  {item.pnl.toFixed(0)}
                </p>
              </div>
            ))
          )}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS collega stato emotivo e
          performance per individuare
          pattern psicologici ricorrenti.
        </p>
      </div>
    </div>
  );
}
