type Props = {
  sessionLocked: boolean;
  reviewRequired: boolean;
  lockReason: string;
};

export default function SessionLockCard({
  sessionLocked,
  reviewRequired,
  lockReason,
}: Props) {
  return (
    <div className="rounded-[36px] border border-red-500/20 bg-red-500/10 p-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-red-400">
            Session Lock System
          </p>

          <h2 className="mt-3 text-3xl font-black text-white">
            Trading Protection Gate
          </h2>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.15em] ${
            sessionLocked
              ? "bg-red-600/20 text-red-300"
              : reviewRequired
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-emerald-500/20 text-emerald-300"
          }`}
        >
          {sessionLocked
            ? "Locked"
            : reviewRequired
            ? "Review"
            : "Open"}
        </div>
      </div>

      <p className="mt-6 max-w-4xl text-sm leading-relaxed text-gray-300">
        {lockReason}
      </p>

      <div className="mt-8 grid gap-4 xl:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Session Locked
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {sessionLocked ? "Yes" : "No"}
          </h3>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
            Review Required
          </p>

          <h3 className="mt-3 text-3xl font-black text-white">
            {reviewRequired ? "Yes" : "No"}
          </h3>
        </div>
      </div>
    </div>
  );
}
