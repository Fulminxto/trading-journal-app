type Pattern = {
  id: string;
  type: string;
  title: string;
  description: string;
  severity: string;
  occurrences: number;
};

type Props = {
  copilotPatterns: Pattern[];
};

export default function PatternMemoryCard({
  copilotPatterns,
}: Props) {
  return (
    <div className="rounded-[36px] border border-white/10 bg-black/30 p-8 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-400">
            Pattern Memory
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Behavioral Intelligence
          </h2>
        </div>

        <div className="rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-amber-300">
          {copilotPatterns.length} Patterns
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {copilotPatterns.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm leading-relaxed text-gray-400">
              Nessun pattern comportamentale rilevato al momento.
            </p>
          </div>
        ) : (
          copilotPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.15em] text-amber-400">
                    {pattern.type}
                  </p>

                  <h3 className="mt-2 text-xl font-black text-white">
                    {pattern.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-gray-400">
                    {pattern.description}
                  </p>
                </div>

                <div
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] ${
                    pattern.severity === "critical"
                      ? "bg-red-600/20 text-red-300"
                      : pattern.severity === "high"
                      ? "bg-red-500/10 text-red-400"
                      : pattern.severity === "medium"
                      ? "bg-yellow-500/10 text-yellow-300"
                      : "bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {pattern.severity}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-gray-500">
                <span>Occurrences: {pattern.occurrences}</span>
                <span>Updated recently</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
