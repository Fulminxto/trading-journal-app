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
    <section className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.06),transparent_30%)]" />

      <div className="relative z-10">
        <div className="mb-6">
          {subtitle && (
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
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