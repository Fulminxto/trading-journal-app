"use client";

export default function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header */}
      <div>
        <div className="mb-3 h-3 w-24 rounded bg-white/10" />
        <div className="h-10 w-1/3 rounded-2xl bg-white/10" />
      </div>

      {/* Create user form */}
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-4 h-6 w-36 rounded-xl bg-white/10" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="col-span-1 h-12 rounded-2xl bg-white/10 md:col-span-4" />
        </div>
      </div>

      {/* Users list */}
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            {/* User info + actions */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <div className="h-5 w-40 rounded-xl bg-white/10" />
                  <div className="h-3 w-24 rounded bg-white/10" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="h-9 w-24 rounded-2xl bg-white/10" />
                <div className="h-9 w-24 rounded-2xl bg-white/10" />
              </div>
            </div>

            {/* Permissions */}
            <div className="mt-6">
              <div className="mb-3 h-4 w-28 rounded bg-white/10" />
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="h-4 w-4 rounded bg-white/10" />
                    <div className="h-4 flex-1 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>

            {/* Reset password */}
            <div className="mt-6">
              <div className="mb-3 h-4 w-32 rounded bg-white/10" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                <div className="h-12 rounded-2xl bg-white/10" />
                <div className="h-12 w-36 rounded-2xl bg-white/10" />
              </div>
            </div>

            {/* Memberships */}
            <div className="mt-6">
              <div className="mb-3 h-4 w-28 rounded bg-white/10" />
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-7 w-24 rounded-full bg-white/10" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
