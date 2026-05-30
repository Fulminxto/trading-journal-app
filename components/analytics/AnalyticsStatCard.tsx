type Props = {
  label: string;
  value: string | number;
  tone?: string;
  icon: React.ElementType;
};

export default function AnalyticsStatCard({
  label,
  value,
  tone = "text-white",
  icon: Icon,
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.06]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {label}
          </p>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-2">
            <Icon
              size={18}
              className="text-gray-400"
            />
          </div>
        </div>

        <h2
          className={`mt-5 text-4xl font-black tracking-tight ${tone}`}
        >
          {value}
        </h2>
      </div>
    </div>
  );
}
