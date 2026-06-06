"use client";

export default function ProfileSkeleton() {
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

      {/* Avatar card */}
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-5">
            <div className="h-24 w-24 rounded-full bg-white/10" />
            <div>
              <div className="h-7 w-40 rounded-xl bg-white/10" />
              <div className="mt-2 flex gap-2">
                <div className="h-5 w-16 rounded-full bg-white/10" />
                <div className="h-5 w-20 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[520px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="h-3 w-20 rounded bg-white/10" />
                <div className="mt-3 h-6 w-2/3 rounded-xl bg-white/10" />
              </div>
            ))}
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

      {/* Main area */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Left: edit form */}
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
          <div className="mb-6 h-7 w-1/3 rounded-xl bg-white/10" />
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 rounded-2xl bg-white/10" />
              ))}
            </div>
            <div className="h-12 rounded-2xl bg-white/10" />
            <div className="h-24 rounded-2xl bg-white/10" />
          </div>
          <div className="mt-6 flex gap-3">
            <div className="h-12 w-36 rounded-2xl bg-white/10" />
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-6">
          {/* Profile score */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-24 rounded bg-white/10" />
            <div className="h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="mt-4 h-4 rounded-full bg-white/10" />
          </div>
          {/* Workspace / Accounts */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-28 rounded bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-white/10" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-1/2 rounded bg-white/10" />
                    <div className="h-3 w-1/3 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Recent trades */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-28 rounded bg-white/10" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-4 w-16 rounded bg-white/10" />
                  <div className="h-4 w-20 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
          {/* Security */}
          <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 h-3 w-24 rounded bg-white/10" />
            <div className="space-y-3">
              <div className="h-12 rounded-2xl bg-white/10" />
              <div className="h-12 rounded-2xl bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
