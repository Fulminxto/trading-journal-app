"use client";

export default function DashboardSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">

          <div className="max-w-3xl">
            <div className="h-8 w-40 rounded-full bg-white/10" />
            <div className="mt-6 h-16 w-3/4 rounded-2xl bg-white/10 xl:h-20" />
            <div className="mt-6 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 xl:min-w-[460px]">
            <div className="rounded-3xl border border-accent/10 bg-accent/[0.06] p-5">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-3 h-10 w-3/4 rounded-xl bg-white/10" />
            </div>
            <div className="rounded-3xl border border-accent-bright/10 bg-accent-bright/[0.06] p-5">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-3 h-10 w-3/4 rounded-xl bg-white/10" />
            </div>
            <div className="rounded-3xl border border-violet-500/10 bg-violet-500/[0.06] p-5">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-3 h-10 w-3/4 rounded-xl bg-white/10" />
            </div>
            <div className="rounded-3xl border border-yellow-500/10 bg-yellow-500/[0.06] p-5">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-3 h-10 w-3/4 rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      </div>

      {/* VOLTIS Score + Account Status */}
      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-3">

        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-6 w-48 rounded-lg bg-white/10" />
            </div>
            <div className="h-8 w-24 rounded-full bg-white/10" />
          </div>
          <div className="mt-8 flex items-end gap-4">
            <div className="h-20 w-32 rounded-2xl bg-white/10" />
            <div className="mb-2 h-5 w-10 rounded bg-white/10" />
          </div>
          <div className="mt-8 h-3 rounded-full bg-white/10" />
          <div className="mt-6 space-y-2">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-2/3 rounded bg-white/10" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-8 w-40 rounded-xl bg-white/10" />
          <div className="mt-3 space-y-2">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-4/5 rounded bg-white/10" />
            <div className="h-3 w-3/5 rounded bg-white/10" />
          </div>
        </div>
      </div>

      {/* Account title */}
      <div className="mb-8 mt-10">
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="mt-2 h-10 w-56 rounded-xl bg-white/10" />
      </div>

      {/* 8 account info cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-2 h-9 w-3/4 rounded-xl bg-white/10" />
          </div>
        ))}
      </div>

      {/* Equity chart + Target progress */}
      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-3">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-6 space-y-2">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-6 w-36 rounded-lg bg-white/10" />
          </div>
          <div className="min-h-[260px] rounded-2xl bg-white/[0.04]" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-9 w-20 rounded-xl bg-white/10" />
          <div className="mt-5 h-3 rounded-full bg-white/10" />
          <div className="mt-5 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="h-3 w-16 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Momentum / Profit Factor / Outcome Split */}
      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-9 w-40 rounded-xl bg-white/10" />
          <div className="mt-3 h-3 w-48 rounded bg-white/10" />
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-2 h-9 w-20 rounded-xl bg-white/10" />
          <div className="mt-3 space-y-1">
            <div className="h-3 w-full rounded bg-white/10" />
            <div className="h-3 w-4/5 rounded bg-white/10" />
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="mb-1 flex justify-between">
                  <div className="h-3 w-12 rounded bg-white/10" />
                  <div className="h-3 w-12 rounded bg-white/10" />
                </div>
                <div className="h-2 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Trades + Review Notes */}
      <div className="mb-8 grid grid-cols-1 gap-4 xl:grid-cols-5">

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-3">
          <div className="mb-5 space-y-1">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="h-6 w-36 rounded-lg bg-white/10" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-3 w-36 rounded bg-white/10" />
                </div>
                <div className="space-y-2 text-right">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-3 w-28 rounded bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-5 space-y-1">
            <div className="h-3 w-20 rounded bg-white/10" />
            <div className="h-6 w-32 rounded-lg bg-white/10" />
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2 rounded-2xl border border-white/10 bg-black/10 p-4">
                <div className="h-4 w-16 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/10" />
                <div className="h-3 w-3/4 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 16 stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 16 }).map((_, i) => (
          <div key={i} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-5 h-10 w-3/4 rounded-xl bg-white/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
