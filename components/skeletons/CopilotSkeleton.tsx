"use client";

function Block({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl bg-white/10 ${className}`} />;
}

function Card({ h = "h-48", className = "" }: { h?: string; className?: string }) {
  return (
    <div className={`rounded-[28px] border border-white/10 bg-white/[0.04] p-5 ${h} ${className}`}>
      <Block className="mb-3 h-3 w-20" />
      <Block className="h-7 w-1/2" />
    </div>
  );
}

export default function CopilotSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Hero */}
      <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
        <Block className="mb-4 h-3 w-28" />
        <Block className="h-12 w-2/3" />
        <div className="mt-4 space-y-2">
          <Block className="h-4 w-full" />
          <Block className="h-4 w-3/4" />
        </div>
      </div>

      {/* Critical alerts */}
      <div className="space-y-4">
        <div className="rounded-[28px] border border-red-500/20 bg-red-500/[0.04] p-5">
          <Block className="mb-3 h-3 w-32" />
          <Block className="h-5 w-1/2" />
        </div>
        <div className="rounded-[28px] border border-yellow-500/20 bg-yellow-500/[0.04] p-5">
          <Block className="mb-3 h-3 w-32" />
          <Block className="h-5 w-1/2" />
        </div>
      </div>

      {/* Snapshot */}
      <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <Block className="mb-3 h-3 w-28" />
            <Block className="h-9 w-56" />
          </div>
          <div className="h-8 w-32 rounded-full bg-white/10" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <Block className="mb-3 h-3 w-20" />
              <Block className="h-9 w-2/3" />
              <Block className="mt-3 h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence + Coaching */}
      <div className="grid gap-6 xl:grid-cols-5">
        <Card h="h-56" className="xl:col-span-3" />
        <Card h="h-56" className="xl:col-span-2" />
      </div>

      {/* Consistency + AI Review */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card h="h-52" />
        <Card h="h-52" />
      </div>

      {/* Trade Review (full width) */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <Block className="mb-3 h-3 w-28" />
        <Block className="h-9 w-1/2" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/10" />
              <div className="flex-1 space-y-2">
                <Block className="h-4 w-1/3" />
                <Block className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review Timeline */}
      <div className="rounded-[36px] border border-white/10 bg-white/[0.03] p-8">
        <Block className="mb-3 h-3 w-28" />
        <Block className="h-9 w-1/2" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Block className="mb-2 h-4 w-2/3" />
              <Block className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      </div>

      {/* Performance + Recovery */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card h="h-52" className="xl:col-span-2" />
        <Card h="h-52" />
      </div>

      {/* Behavioral + Emotional */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card h="h-52" />
        <Card h="h-52" />
      </div>

      {/* Execution + Confidence */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card h="h-52" />
        <Card h="h-52" />
      </div>

      {/* Risk Supervision */}
      <div className="rounded-[36px] border border-red-500/20 bg-red-500/[0.04] p-8">
        <Block className="mb-3 h-3 w-32" />
        <Block className="h-9 w-1/2" />
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <Block className="mb-3 h-3 w-20" />
              <Block className="h-7 w-1/2" />
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="rounded-[36px] border border-cyan-500/20 bg-cyan-500/[0.05] p-8">
        <Block className="mb-3 h-3 w-28" />
        <Block className="h-9 w-1/2" />
        <div className="mt-6 grid gap-6 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <Block className="mb-3 h-3 w-24" />
              <Block className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Memory System */}
      <div className="rounded-[36px] border border-emerald-500/20 bg-emerald-500/[0.06] p-8">
        <Block className="mb-3 h-3 w-28" />
        <Block className="h-9 w-1/2" />
        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
              <Block className="mb-3 h-3 w-20" />
              <Block className="h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Memory + Conversation */}
      <Card h="h-40" />
      <Card h="h-40" />
    </div>
  );
}
