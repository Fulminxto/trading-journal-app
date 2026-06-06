"use client";

export default function WorkspaceSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Hero */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
          <div className="xl:col-span-3">
            <div className="mb-4 h-3 w-32 rounded bg-white/10" />
            <div className="h-12 w-3/4 rounded-2xl bg-white/10" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
            <div className="mt-6 flex gap-3">
              <div className="h-10 w-36 rounded-2xl bg-white/10" />
              <div className="h-10 w-36 rounded-2xl bg-white/10" />
            </div>
          </div>
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="h-3 w-20 rounded bg-white/10" />
                  <div className="mt-3 h-6 w-1/2 rounded-xl bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-3 h-8 w-8 rounded-xl bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-4 h-9 w-3/4 rounded-xl bg-white/10" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Leaderboard + Online Members */}
      <div className="grid items-stretch gap-6 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-28 rounded bg-white/10" />
            <div className="mb-6 h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-1/4 rounded bg-white/10" />
                  </div>
                  <div className="h-6 w-16 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Inactive Members + Recent Activity */}
      <div className="grid items-stretch gap-6 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-28 rounded bg-white/10" />
            <div className="mb-6 h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-1/3 rounded bg-white/10" />
                    <div className="h-3 w-1/4 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
