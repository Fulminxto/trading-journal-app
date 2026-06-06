"use client";

function FormRow({ cols = 2 }: { cols?: number }) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-${cols}`}>
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-12 rounded-2xl bg-white/10" />
      ))}
    </div>
  );
}

export default function IntegrationsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Hero */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex gap-2">
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-20 rounded-full bg-white/10" />
              <div className="h-6 w-20 rounded-full bg-white/10" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-white/10" />
              <div className="h-10 w-2/3 rounded-2xl bg-white/10" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-2/3 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-9 w-28 rounded-2xl bg-white/10" />
        </div>
      </div>

      {/* 4 status cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-3 h-8 w-8 rounded-xl bg-white/10" />
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-4 h-6 w-3/4 rounded-xl bg-white/10" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Readiness section */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-4 h-3 w-32 rounded bg-white/10" />
        <div className="h-7 w-1/2 rounded-xl bg-white/10" />
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="h-5 w-5 rounded-full bg-white/10" />
              <div className="h-4 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Integration strategy + sources */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6 xl:col-span-2">
          <div className="mb-4 h-3 w-28 rounded bg-white/10" />
          <div className="h-7 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-6 space-y-4">
            <FormRow cols={2} />
            <div className="h-12 rounded-2xl bg-white/10" />
          </div>
        </div>
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
          <div className="mb-4 h-3 w-28 rounded bg-white/10" />
          <div className="h-7 w-1/2 rounded-xl bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-11 rounded-2xl bg-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* MT5 + Broker */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-24 rounded bg-white/10" />
            <div className="h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="mt-6 space-y-4">
              <div className="h-12 rounded-2xl bg-white/10" />
              <div className="h-12 rounded-2xl bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Connector setup */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-28 rounded bg-white/10" />
            <div className="h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="mt-6 h-24 rounded-2xl bg-white/10" />
          </div>
        ))}
      </div>

      {/* Sync logs */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-4 h-3 w-24 rounded bg-white/10" />
        <div className="h-7 w-1/3 rounded-xl bg-white/10" />
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="h-4 w-4 rounded-full bg-white/10" />
              <div className="h-4 flex-1 rounded bg-white/10" />
              <div className="h-4 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Security notice */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-3 h-5 w-32 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
      </div>

      {/* Save button */}
      <div className="h-12 w-40 rounded-2xl bg-white/10" />
    </div>
  );
}
