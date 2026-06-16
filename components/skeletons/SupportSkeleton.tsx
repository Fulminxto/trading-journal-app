"use client";

export default function SupportSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 h-3 w-24 rounded bg-white/10" />
        <div className="mb-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-white/10" />
          <div className="h-10 w-1/2 rounded-2xl bg-white/10" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full max-w-xl rounded bg-white/10" />
          <div className="h-4 w-2/3 max-w-lg rounded bg-white/10" />
        </div>
      </div>

      {/* 3 category cards */}
      <div className="grid gap-6 xl:grid-cols-3">
        {[
          "border-red-500/20 bg-red-500/[0.04]",
          "border-yellow-500/20 bg-yellow-500/[0.04]",
          "border-accent-bright/20 bg-accent-bright/[0.04]",
        ].map((cls, i) => (
          <div key={i} className={`rounded-[32px] border p-6 ${cls}`}>
            <div className="mb-4 h-10 w-10 rounded-2xl bg-white/10" />
            <div className="mb-3 h-6 w-1/2 rounded-xl bg-white/10" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-white/10" />
              <div className="h-4 w-3/4 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* New ticket form */}
      <div className="rounded-[36px] border border-accent-bright/20 bg-accent-bright/[0.02] p-8">
        <div className="mb-6 h-7 w-1/3 rounded-xl bg-white/10" />
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-12 rounded-2xl bg-white/10" />
            <div className="h-12 rounded-2xl bg-white/10" />
          </div>
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-36 rounded-2xl bg-white/10" />
        </div>
        <div className="mt-6 h-12 w-40 rounded-2xl bg-white/10" />
      </div>

      {/* Ticket history */}
      <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-7 w-1/4 rounded-xl bg-white/10" />
          <div className="h-9 w-24 rounded-2xl bg-white/10" />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 rounded-xl bg-white/10" />
                  <div className="h-4 w-64 rounded bg-white/10" />
                </div>
                <div className="h-6 w-20 rounded-full bg-white/10" />
              </div>
              <div className="mt-3 h-3 w-32 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
