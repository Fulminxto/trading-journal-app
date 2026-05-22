type Props = {
  title: string;
  value: string | number;
  description: string;
  tone?: string;
};

export default function SessionInsightCard({
  title,
  value,
  description,
  tone = "text-cyan-400",
}: Props) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.06]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.08),transparent_35%)] opacity-0 transition group-hover:opacity-100" />

      <div className="relative z-10">
        <p className="text-sm text-gray-400">
          {title}
        </p>

        <h2
          className={`mt-4 text-5xl font-black tracking-tight ${tone}`}
        >
          {value}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}