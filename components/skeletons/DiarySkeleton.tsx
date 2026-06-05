"use client";

function Block({ className = "" }: { className?: string }) {
  return <div className={`rounded-xl bg-white/10 ${className}`} />;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl border border-white/10 bg-white/[0.03] p-6 ${className}`}>
      {children}
    </div>
  );
}

function AICard() {
  return (
    <Card className="mt-8">
      <Block className="mb-4 h-3 w-24" />
      <Block className="mb-6 h-6 w-56" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <Block className="h-3 w-20" />
            <Block className="mt-2 h-8 w-3/4" />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function DiarySkeleton() {
  return (
    <div className="animate-pulse">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex flex-col gap-10 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <Block className="h-8 w-40 rounded-full" />
            <Block className="mt-6 h-16 w-3/4 rounded-2xl xl:h-20" />
            <div className="mt-6 space-y-2">
              <Block className="h-4 w-full" />
              <Block className="h-4 w-2/3" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 xl:min-w-[420px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
                <Block className="h-3 w-16" />
                <Block className="mt-3 h-10 w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI analysis cards stack */}
      <AICard />
      <AICard />
      <AICard />
      <AICard />
      <AICard />

      {/* Title + W/L counter */}
      <div className="mb-8 mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <Block className="h-3 w-28" />
          <Block className="mt-2 h-10 w-48" />
        </div>
        <Block className="h-10 w-36 rounded-2xl" />
      </div>

      {/* 8 stat cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
            <Block className="h-3 w-20" />
            <Block className="mt-2 h-8 w-3/4" />
          </div>
        ))}
      </div>

      {/* Filters form */}
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <Block className="mb-2 h-3 w-24" />
        <Block className="mb-6 h-6 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-9">
          {Array.from({ length: 8 }).map((_, i) => (
            <Block key={i} className="h-14 rounded-2xl" />
          ))}
          <Block className="h-14 rounded-2xl sm:col-span-2 xl:col-span-9" />
        </div>
      </div>

      {/* New trade form */}
      <div className="mb-10 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
        <Block className="mb-2 h-3 w-24" />
        <Block className="mb-6 h-6 w-40" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <Block key={i} className="h-14 rounded-2xl" />
          ))}
          <Block className="h-28 rounded-2xl sm:col-span-2" />
          <Block className="h-28 rounded-2xl sm:col-span-2" />
          <Block className="h-14 rounded-2xl sm:col-span-2 xl:col-span-4" />
        </div>
      </div>

      {/* History header */}
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <Block className="h-3 w-28" />
          <Block className="mt-1 h-7 w-40" />
        </div>
        <Block className="h-4 w-48" />
      </div>

      {/* Desktop table — hidden lg:block */}
      <div className="hidden overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03] lg:block">
        <div className="bg-white/5 p-4">
          <div className="flex gap-8">
            {Array.from({ length: 10 }).map((_, i) => (
              <Block key={i} className="h-3 w-16" />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-8 border-t border-white/10 p-4">
            <Block className="h-4 w-20" />
            <Block className="h-4 w-20" />
            <Block className="h-4 w-16" />
            <Block className="h-6 w-16 rounded-xl" />
            <Block className="h-4 w-16" />
            <Block className="h-6 w-14 rounded-xl" />
            <Block className="h-4 w-20" />
            <Block className="h-4 w-24" />
            <Block className="h-4 w-20" />
            <Block className="h-4 w-12" />
          </div>
        ))}
      </div>

      {/* Mobile cards — lg:hidden */}
      <div className="space-y-4 lg:hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Block className="h-3 w-32" />
                <Block className="h-7 w-24" />
              </div>
              <Block className="h-8 w-16 rounded-2xl" />
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="rounded-2xl bg-black/20 p-3">
                  <Block className="h-3 w-14" />
                  <Block className="mt-1 h-5 w-20" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
