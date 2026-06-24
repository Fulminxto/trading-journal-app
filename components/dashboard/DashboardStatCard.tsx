type Props = {
  label: string;
  value: string | number;
  tone?: string;
};

export default function DashboardStatCard({
  label,
  value,
  tone = "text-white",
}: Props) {
  return (
    <div className="group relative min-h-[132px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-all duration-300 hover:border-accent-bright/20 hover:bg-white/[0.06]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_8%,transparent)_35%,transparent)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
          {label}
        </p>

        <h2
          className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl ${tone}`}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}
