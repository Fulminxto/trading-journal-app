"use client";

export default function CalendarSkeleton() {
  return (
    <div className="animate-pulse space-y-10">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="h-8 w-36 rounded-full bg-white/10" />
              <div className="h-8 w-28 rounded-full bg-white/10" />
              <div className="h-8 w-28 rounded-full bg-white/10" />
            </div>
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="mt-3 h-16 w-72 rounded-2xl bg-white/10 sm:h-20" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
              <div className="h-4 w-1/2 rounded bg-white/10" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="h-12 w-36 rounded-2xl bg-white/10" />
            <div className="h-12 w-12 rounded-2xl bg-white/10" />
            <div className="h-12 w-12 rounded-2xl bg-white/10" />
          </div>
        </div>
      </section>

      {/* 4 main stat cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-3 h-9 w-3/4 rounded-xl bg-white/10" />
            <div className="mt-3 h-3 w-full rounded bg-white/10" />
          </div>
        ))}
      </section>

      {/* 4 day-type cards (positive/negative/flat/avg) */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-white/10" />
              <div className="h-3 w-24 rounded bg-white/10" />
            </div>
            <div className="mt-4 h-9 w-16 rounded-xl bg-white/10" />
          </div>
        ))}
      </section>

      {/* Calendar grid */}
      <section className="rounded-[32px] border border-white/10 bg-white/[0.03] p-4 sm:p-6">
        <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="h-3 w-28 rounded bg-white/10" />
            <div className="mt-1 h-8 w-56 rounded-xl bg-white/10" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 rounded bg-white/10" />
            <div className="h-4 w-16 rounded bg-white/10" />
            <div className="h-4 w-16 rounded bg-white/10" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[840px] overflow-hidden rounded-3xl border border-white/10">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-white/10 bg-black/20">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="border-r border-white/10 p-4 last:border-r-0">
                  <div className="mx-auto h-3 w-8 rounded bg-white/10" />
                </div>
              ))}
            </div>

            {/* Day cells — 5 rows × 7 cols = 35 cells */}
            <div className="grid grid-cols-7 bg-black/10">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="min-h-[150px] border-r border-b border-white/10 bg-black/10 p-4 last:border-r-0">
                  <div className="mb-5 flex items-center justify-between">
                    <div className="h-10 w-10 rounded-full bg-white/10" />
                    <div className="h-2.5 w-2.5 rounded-full bg-white/10" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-16 rounded bg-white/10" />
                    <div className="h-3 w-10 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Monthly summary */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-white/10" />
          <div>
            <div className="h-3 w-28 rounded bg-white/10" />
            <div className="mt-1 h-7 w-48 rounded-lg bg-white/10" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-3 h-9 w-16 rounded-xl bg-white/10" />
              <div className="mt-2 space-y-1">
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-3/4 rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
