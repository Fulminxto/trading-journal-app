"use client";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-card border-[0.5px] border-flash/[0.1] bg-surface-1 p-6 ${className}`}>
      {children}
    </div>
  );
}

function Inner({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-inner border-[0.5px] border-white/[0.06] bg-surface-2 p-4 ${className}`}>
      <div className="h-3 w-16 rounded bg-white/10" />
      <div className="mt-2 h-6 w-3/4 rounded-lg bg-white/10" />
    </div>
  );
}

export default function AnalyticsSkeleton() {
  return (
    <div className="animate-pulse space-y-8">

      {/* Header */}
      <div>
        <div className="h-3 w-36 rounded bg-white/10" />
        <div className="mt-3 h-10 w-48 rounded-xl bg-white/10" />
      </div>

      {/* Advanced stats strip */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-white/10" />
              <div className="h-10 w-10 rounded-inner bg-white/10" />
            </div>
            <div className="mt-4 h-8 w-2/3 rounded-lg bg-white/10" />
          </Card>
        ))}
      </div>

      {/* Risk Concentration hero */}
      <Card className="p-8 sm:p-10">
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="mt-3 h-9 w-64 rounded-xl bg-white/10" />
        <div className="mt-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Inner key={i} />
          ))}
        </div>
      </Card>

      {/* Psychology & Discipline */}
      <Card className="p-8 sm:p-10">
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="mt-3 h-8 w-56 rounded-xl bg-white/10" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Inner key={i} />
          ))}
        </div>
        <div className="mt-8 space-y-4 border-t border-white/[0.06] pt-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <Inner key={j} />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-8 h-[280px] rounded-inner border-[0.5px] border-white/[0.06] bg-surface-2 border-t pt-8" />
      </Card>

      {/* Markets */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-7 w-40 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Inner key={i} />
            ))}
          </div>
        </Card>
        <Card>
          <div className="h-3 w-24 rounded bg-white/10" />
          <div className="mt-2 h-7 w-32 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <Inner key={i} />
            ))}
          </div>
        </Card>
      </div>

      {/* Weekday heatmap */}
      <Card>
        <div className="h-3 w-32 rounded bg-white/10" />
        <div className="mt-2 h-7 w-48 rounded-lg bg-white/10" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Inner key={i} />
          ))}
        </div>
      </Card>

      {/* Sessions / Leaderboard */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-7 w-36 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Inner key={i} />
            ))}
          </div>
        </Card>
        <Card>
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-7 w-40 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Inner key={i} />
            ))}
          </div>
        </Card>
      </div>

      {/* Monthly dashboard */}
      <Card>
        <div className="h-3 w-36 rounded bg-white/10" />
        <div className="mt-2 h-7 w-48 rounded-lg bg-white/10" />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Inner key={i} />
          ))}
        </div>
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Inner key={i} />
          ))}
        </div>
      </Card>

      {/* Mistakes / Insights */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-7 w-44 rounded-lg bg-white/10" />
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Inner key={i} />
            ))}
          </div>
        </Card>
        <Card>
          <div className="h-3 w-28 rounded bg-white/10" />
          <div className="mt-2 h-7 w-44 rounded-lg bg-white/10" />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Inner key={i} />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
