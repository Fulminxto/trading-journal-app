"use client";

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
      <div className="mb-2 h-3 w-24 rounded bg-white/10" />
      <div className="mb-6 h-7 w-1/3 rounded-xl bg-white/10" />
      {children}
    </div>
  );
}

export default function SettingsSkeleton() {
  return (
    <div className="animate-pulse space-y-10">
      {/* Hero */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-white/10" />
          <div className="h-10 w-1/2 rounded-2xl bg-white/10" />
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full max-w-xl rounded bg-white/10" />
          <div className="h-4 w-2/3 max-w-lg rounded bg-white/10" />
        </div>
      </div>

      {/* Language */}
      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
        </div>
      </Section>

      {/* Appearance */}
      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/10" />
          ))}
        </div>
      </Section>

      {/* App Experience */}
      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="space-y-1">
                <div className="h-4 w-32 rounded bg-white/10" />
                <div className="h-3 w-48 rounded bg-white/10" />
              </div>
              <div className="h-6 w-11 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="space-y-1">
                <div className="h-4 w-24 rounded bg-white/10" />
                <div className="h-3 w-32 rounded bg-white/10" />
              </div>
              <div className="h-6 w-11 rounded-full bg-white/10" />
            </div>
          ))}
        </div>
      </Section>

      {/* Save button */}
      <div className="h-12 w-40 rounded-2xl bg-white/10" />

      {/* Backup */}
      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
        </div>
      </Section>

      {/* Security */}
      <Section>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-12 rounded-2xl bg-white/10" />
          <div className="h-12 rounded-2xl bg-white/10" />
        </div>
      </Section>

      {/* Onboarding */}
      <Section>
        <div className="h-12 w-48 rounded-2xl bg-white/10" />
      </Section>

      {/* Support + Danger zone */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[0, 1].map((i) => (
          <div key={i} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8">
            <div className="mb-2 h-3 w-24 rounded bg-white/10" />
            <div className="mb-6 h-7 w-1/2 rounded-xl bg-white/10" />
            <div className="space-y-3">
              <div className="h-12 rounded-2xl bg-white/10" />
              <div className="h-12 rounded-2xl bg-white/10" />
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
        <div className="mb-3 h-3 w-20 rounded bg-white/10" />
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-white/10" />
          <div className="h-4 w-40 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
