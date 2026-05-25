type Props = {
  criticalPatterns: {
    id: string;
    title: string;
    description: string;
  }[];
};

export default function CriticalAlertCard({
  criticalPatterns,
}: Props) {
  if (criticalPatterns.length === 0) {
    return null;
  }

  return (
    <div className="rounded-[32px] border border-red-500/30 bg-red-500/10 p-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-300">
            Critical Alert
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Behavioral Risk Escalation
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-red-100">
            VOLTIS AI ha rilevato pattern comportamentali ad
            alto rischio che potrebbero compromettere la
            stabilità operativa.
          </p>
        </div>

        <div className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-300">
          {criticalPatterns.length} High Risk
        </div>
      </div>

      <div className="mt-8 grid gap-4">
        {criticalPatterns.map((pattern) => (
          <div
            key={pattern.id}
            className="rounded-[24px] border border-white/10 bg-black/20 p-5"
          >
            <h3 className="text-lg font-black text-white">
              {pattern.title}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-gray-300">
              {pattern.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}