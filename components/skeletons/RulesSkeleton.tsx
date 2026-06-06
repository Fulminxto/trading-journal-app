"use client";

export default function RulesSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Hero */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex gap-2">
              <div className="h-6 w-20 rounded-full bg-yellow-500/20" />
              <div className="h-6 w-28 rounded-full bg-white/10" />
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

      {/* Goals form + Discipline rules */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-28 rounded bg-white/10" />
            <div className="h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="mt-6 space-y-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-12 rounded-2xl bg-white/10" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Progress section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-4 h-3 w-28 rounded bg-white/10" />
          <div className="h-7 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-6 h-32 rounded-2xl bg-white/10" />
        </div>
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-24 rounded bg-white/10" />
            <div className="h-7 w-2/3 rounded-xl bg-white/10" />
            <div className="mt-6 h-28 rounded-full bg-white/10" />
          </div>
        ))}
      </div>

      {/* Risk guardrails */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-4 h-3 w-32 rounded bg-white/10" />
        <div className="h-7 w-1/2 rounded-xl bg-white/10" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-3 h-3 w-24 rounded bg-white/10" />
              <div className="h-12 rounded-2xl bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
