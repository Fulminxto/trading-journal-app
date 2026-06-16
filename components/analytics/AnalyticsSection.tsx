type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function AnalyticsSection({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-accent-bright/20 hover:bg-white/[0.05]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_8%,transparent)_30%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.06),transparent_35%)]" />

      <div className="relative z-10">
        <div className="mb-6">
          {subtitle && (
            <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
              {subtitle}
            </p>
          )}

          <h2 className="mt-2 text-2xl font-black tracking-tight text-white">
            {title}
          </h2>
        </div>

        {children}
      </div>
    </section>
  );
}
