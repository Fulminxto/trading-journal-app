"use client";

export default function EquitySkeleton() {
  return (
    <div className="animate-pulse space-y-10">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-8 sm:p-10">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <div className="h-8 w-36 rounded-full bg-white/10" />
              <div className="h-8 w-28 rounded-full bg-white/10" />
            </div>
            <div className="h-3 w-40 rounded bg-white/10" />
            <div className="mt-3 h-16 w-72 rounded-2xl bg-white/10 sm:h-20" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-12 w-40 rounded-2xl bg-white/10" />
        </div>
      </section>

      {/* 4 stat cards with icon */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="mt-3 h-9 w-3/4 rounded-xl bg-white/10" />
              </div>
              <div className="h-11 w-11 rounded-2xl bg-white/10" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </section>

      {/* Chart + peak/lowest */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="mt-1 h-7 w-44 rounded-lg bg-white/10" />
            </div>
            <div className="h-11 w-11 rounded-2xl bg-white/10" />
          </div>
          <div className="min-h-[280px] rounded-2xl bg-white/[0.04]" />
        </div>

        <div className="grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-3 h-9 w-40 rounded-xl bg-white/10" />
            <div className="mt-4 space-y-1">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-3 w-28 rounded bg-white/10" />
            <div className="mt-3 h-9 w-40 rounded-xl bg-white/10" />
            <div className="mt-4 space-y-1">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-3/4 rounded bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 trade-type stat cards */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="mt-3 h-9 w-16 rounded-xl bg-white/10" />
              </div>
              <div className="h-11 w-11 rounded-2xl bg-white/10" />
            </div>
            <div className="mt-4 space-y-1">
              <div className="h-3 w-full rounded bg-white/10" />
            </div>
          </div>
        ))}
      </section>

      {/* Best / Worst trade */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="mt-3 h-12 w-40 rounded-2xl bg-white/10" />
            <div className="mt-4 space-y-1">
              <div className="h-3 w-full rounded bg-white/10" />
              <div className="h-3 w-2/3 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </section>

      {/* History section */}
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-1 h-7 w-56 rounded-lg bg-white/10" />
          </div>
          <div className="h-3 w-36 rounded bg-white/10" />
        </div>

        {/* Mobile cards — lg:hidden */}
        <div className="space-y-3 lg:hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-3 w-32 rounded bg-white/10" />
                </div>
                <div className="h-5 w-20 rounded bg-white/10" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {Array.from({ length: 2 }).map((_, j) => (
                  <div key={j} className="rounded-xl bg-white/[0.03] p-3">
                    <div className="h-3 w-14 rounded bg-white/10" />
                    <div className="mt-1 h-5 w-20 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop table — hidden lg:block */}
        <div className="hidden overflow-x-auto rounded-2xl border border-white/10 lg:block">
          <div className="flex gap-8 bg-white/5 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 w-16 rounded bg-white/10" />
            ))}
          </div>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-8 border-t border-white/10 p-4">
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-4 w-16 rounded bg-white/10" />
              <div className="h-4 w-24 rounded bg-white/10" />
              <div className="h-4 w-20 rounded bg-white/10" />
              <div className="h-4 w-16 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
