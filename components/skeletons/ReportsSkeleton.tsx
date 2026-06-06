"use client";

function Card({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[32px] border border-white/10 bg-white/[0.03] p-8 ${className}`}>
      <div className="mb-4 h-3 w-24 rounded bg-white/10" />
      <div className="h-7 w-2/3 rounded-xl bg-white/10" />
      <div className="mt-6 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
        <div className="h-4 w-1/2 rounded bg-white/10" />
      </div>
    </div>
  );
}

export default function ReportsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <div className="h-3 w-32 rounded bg-white/10" />
            <div className="mt-4 h-16 w-3/4 rounded-2xl bg-white/10 xl:h-20" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-12 w-36 rounded-2xl bg-white/10" />
        </div>
      </div>

      {/* Nav skeleton */}
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-9 w-24 shrink-0 rounded-full bg-white/10" />
        ))}
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-4 h-10 w-3/4 rounded-xl bg-white/10" />
            <div className="mt-3 h-3 w-1/2 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Executive focus + edge quality */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 xl:col-span-2">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-3 h-9 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-4 h-4 w-full rounded bg-white/10" />
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-3 h-9 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-4 h-4 w-full rounded bg-white/10" />
        </div>
      </div>

      {/* Report cards — executive + weekly + monthly + behavioral + performance */}
      {Array.from({ length: 5 }).map((_, i) => (
        <Card key={i} />
      ))}

      {/* More report cards (evolution, coaching, risk, consistency...) — smaller batch */}
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={`b${i}`} />
      ))}
    </div>
  );
}
