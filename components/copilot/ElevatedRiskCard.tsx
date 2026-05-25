type Props = {
  highPatternsCount: number;
  show: boolean;
};

export default function ElevatedRiskCard({
  highPatternsCount,
  show,
}: Props) {
  if (!show) {
    return null;
  }

  return (
    <div className="rounded-[32px] border border-yellow-500/30 bg-yellow-500/10 p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-yellow-300">
            Elevated Risk
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Behavioral Warning
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-yellow-100">
            VOLTIS rileva pattern ad alto rischio che potrebbero ridurre qualità decisionale, disciplina ed execution.
          </p>
        </div>

        <div className="rounded-full border border-yellow-400/20 bg-yellow-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.15em] text-yellow-300">
          {highPatternsCount} High Risk
        </div>
      </div>
    </div>
  );
}