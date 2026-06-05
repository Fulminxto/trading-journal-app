"use client";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>
      {children}
    </div>
  );
}

function ChartBlock({ height = "h-40" }: { height?: string }) {
  return (
    <Card className="mt-8">
      <div className="mb-4 h-3 w-28 rounded bg-white/10" />
      <div className="mb-6 h-6 w-48 rounded-lg bg-white/10" />
      <div className={`${height} rounded-2xl bg-white/[0.04]`} />
    </Card>
  );
}

export default function AnalyticsSkeleton() {
  return (
    <div className="animate-pulse">

      {/* Analytics Hero */}
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
          <div className="grid grid-cols-2 gap-4 xl:min-w-[400px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <div className="h-3 w-16 rounded bg-white/10" />
                <div className="mt-3 h-9 w-3/4 rounded-xl bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 gross profit/loss/pf/streak cards */}
      <div className="mb-8 mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="h-3 w-24 rounded bg-white/10" />
            <div className="mt-2 h-8 w-3/4 rounded-xl bg-white/10" />
          </div>
        ))}
      </div>

      {/* Title */}
      <div className="mb-8">
        <div className="h-3 w-36 rounded bg-white/10" />
        <div className="mt-2 h-10 w-48 rounded-xl bg-white/10" />
      </div>

      {/* 4 main stat cards with icon */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="h-9 w-3/4 rounded-xl bg-white/10" />
              </div>
              <div className="h-10 w-10 rounded-2xl bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* PerformanceIntelligence */}
      <Card className="mt-8">
        <div className="mb-4 h-3 w-36 rounded bg-white/10" />
        <div className="mb-6 h-6 w-56 rounded-lg bg-white/10" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-2 h-8 w-3/4 rounded-xl bg-white/10" />
            </div>
          ))}
        </div>
      </Card>

      {/* PerformanceInsights */}
      <Card className="mt-8">
        <div className="mb-4 h-3 w-24 rounded bg-white/10" />
        <div className="mb-6 h-6 w-48 rounded-lg bg-white/10" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="h-4 w-full rounded bg-white/10" />
            </div>
          ))}
        </div>
      </Card>

      {/* Heatmap / chart sections */}
      <ChartBlock />
      <ChartBlock />
      <ChartBlock />
      <ChartBlock />
      <ChartBlock />
      <ChartBlock />
      <ChartBlock />

      {/* Chart trend sections */}
      <ChartBlock height="h-32" />
      <ChartBlock height="h-32" />
      <ChartBlock height="h-32" />
      <ChartBlock height="h-32" />
      <ChartBlock height="h-32" />
      <ChartBlock height="h-32" />

      {/* PsychologyAnalytics */}
      <Card className="mt-8">
        <div className="mb-4 h-3 w-32 rounded bg-white/10" />
        <div className="mb-6 h-6 w-48 rounded-lg bg-white/10" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-black/20 p-4">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-2 h-8 w-16 rounded-xl bg-white/10" />
              <div className="mt-4 h-2 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </Card>

      {/* SymbolPerformance */}
      <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
        <Card>
          <div className="h-3 w-32 rounded bg-white/10" />
          <div className="mt-1 h-6 w-48 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
                <div className="space-y-1">
                  <div className="h-4 w-20 rounded bg-white/10" />
                  <div className="h-3 w-16 rounded bg-white/10" />
                </div>
                <div className="h-5 w-20 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Long vs Short */}
      <Card className="mt-8">
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="mt-1 h-6 w-32 rounded-lg bg-white/10" />
        <div className="mt-6 space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="h-4 w-8 rounded bg-white/10" />
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10" />
              <div className="mt-2 h-3 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>
      </Card>

      {/* Best Results / Outcome / Mistakes / Setup */}
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="mt-8">
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-1 h-6 w-48 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex items-center justify-between rounded-2xl bg-black/20 p-4">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-4 w-20 rounded bg-white/10" />
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Monthly dashboard */}
      <Card className="mt-8">
        <div className="h-3 w-36 rounded bg-white/10" />
        <div className="mt-1 h-6 w-48 rounded-lg bg-white/10" />
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="mt-2 h-6 w-28 rounded-lg bg-white/10" />
              <div className="mt-1 h-3 w-20 rounded bg-white/10" />
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/20 p-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <div className="h-5 w-32 rounded-lg bg-white/10" />
                <div className="h-3 w-20 rounded bg-white/10" />
              </div>
              <div className="flex gap-6">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 w-8 rounded bg-white/10" />
                    <div className="h-5 w-12 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
