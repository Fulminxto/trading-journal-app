type Props = {
  lowScoreSessions: number;
  pendingReviews: number;
};

export default function BehaviorWarningCard({
  lowScoreSessions,
  pendingReviews,
}: Props) {
  const hasWarnings =
    lowScoreSessions > 2 ||
    pendingReviews > 3;

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-[#140909] via-[#1a1010] to-black p-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.12),transparent_35%)]" />

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-red-400">
              Behavior Intelligence
            </p>

            <h2 className="mt-3 text-3xl font-black text-white">
              Discipline Warnings
            </h2>
          </div>

          <div
            className={`rounded-full border px-4 py-2 text-sm font-bold ${
              hasWarnings
                ? "border-red-500/20 bg-red-500/10 text-red-400"
                : "border-green-500/20 bg-green-500/10 text-green-400"
            }`}
          >
            {hasWarnings
              ? "Warnings Active"
              : "Stable"}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Low Score Sessions
              </p>

              <span className="text-2xl font-black text-red-400">
                {lowScoreSessions}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-gray-400">
                Pending Reviews
              </p>

              <span className="text-2xl font-black text-yellow-400">
                {pendingReviews}
              </span>
            </div>
          </div>
        </div>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-400">
          VOLTIS monitora disciplina,
          review post-market e
          consistenza operativa per
          identificare comportamenti
          che possono ridurre la
          performance nel lungo periodo.
        </p>
      </div>
    </div>
  );
}