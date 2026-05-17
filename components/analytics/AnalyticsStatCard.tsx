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
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {label}
        </p>

        <Icon
          size={20}
          className="text-gray-500"
        />
      </div>

      <h2
        className={`mt-4 text-3xl font-bold ${tone}`}
      >
        {value}
      </h2>
    </div>
  );
}