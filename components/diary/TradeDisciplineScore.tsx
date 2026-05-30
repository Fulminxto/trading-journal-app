type Props = {
  score: number;
};

function getTone(score: number) {
  if (score >= 80) {
    return "text-green-400";
  }

  if (score >= 60) {
    return "text-cyan-400";
  }

  if (score >= 40) {
    return "text-yellow-400";
  }

  return "text-red-400";
}

function getLabel(score: number) {
  if (score >= 80) {
    return "Elite";
  }

  if (score >= 60) {
    return "Consistent";
  }

  if (score >= 40) {
    return "Developing";
  }

  return "Unstable";
}

export default function TradeDisciplineScore({
  score,
}: Props) {
  const tone = getTone(score);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#0b1220] via-[#111827] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
              Trade Discipline
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Discipline Score
            </h2>
          </div>

          <div
            className={`rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold ${tone}`}
          >
            {getLabel(score)}
          </div>
        </div>

        <div className="mt-8 flex items-end gap-4">
          <h3
            className={`text-7xl font-black tracking-tight ${tone}`}
          >
            {score}
          </h3>

          <span className="mb-2 text-xl font-bold text-gray-500">
            /100
          </span>
        </div>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-500"
            style={{
              width: `${score}%`,
            }}
          />
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          Score basato su execution,
          setup quality, confidence e
          disciplina emotiva del trader.
        </p>
      </div>
    </div>
  );
}
