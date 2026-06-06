"use client";

export default function UpdatesSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 h-3 w-28 rounded bg-white/10" />
        <div className="mb-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-white/10" />
          <div className="h-10 w-1/2 rounded-2xl bg-white/10" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full max-w-xl rounded bg-white/10" />
          <div className="h-4 w-2/3 max-w-lg rounded bg-white/10" />
        </div>
      </div>

      {/* Update cards */}
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 shrink-0 rounded-2xl bg-white/10" />
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-6 w-48 rounded-xl bg-white/10" />
                  <div className="h-5 w-16 rounded-full bg-white/10" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-white/10" />
                  <div className="h-4 w-5/6 rounded bg-white/10" />
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                </div>
                <div className="mt-4 h-3 w-24 rounded bg-white/10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
