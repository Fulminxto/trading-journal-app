"use client";

export default function SessionsSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Hero */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex gap-2">
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-24 rounded-full bg-white/10" />
            </div>
            <div className="h-12 w-2/3 rounded-2xl bg-white/10" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-2xl bg-white/10" />
        </div>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-3 h-8 w-8 rounded-xl bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-4 h-9 w-3/4 rounded-xl bg-white/10" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* 3 insight cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-3 h-3 w-24 rounded bg-white/10" />
            <div className="h-7 w-2/3 rounded-xl bg-white/10" />
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Intelligence row */}
      <div className="grid items-stretch gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-4 h-3 w-28 rounded bg-white/10" />
          <div className="h-9 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-6 h-40 rounded-2xl bg-white/10" />
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 h-3 w-28 rounded bg-white/10" />
          <div className="h-9 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* Execution Intelligence */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-4 h-3 w-28 rounded bg-white/10" />
        <div className="h-9 w-1/2 rounded-xl bg-white/10" />
        <div className="mt-6 h-48 rounded-2xl bg-white/10" />
      </div>

      {/* New session form */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-6 h-7 w-1/3 rounded-xl bg-white/10" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 rounded-2xl bg-white/10" />
          ))}
          <div className="h-24 rounded-2xl bg-white/10 sm:col-span-2 xl:col-span-3" />
        </div>
        <div className="mt-6 h-12 w-40 rounded-2xl bg-white/10" />
      </div>

      {/* Session history */}
      <div>
        <div className="mb-4 h-7 w-32 rounded-xl bg-white/10" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-3 h-5 w-1/3 rounded-xl bg-white/10" />
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 w-16 rounded bg-white/10" />
                    <div className="h-5 w-20 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
