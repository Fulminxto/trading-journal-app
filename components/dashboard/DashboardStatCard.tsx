import Card from "@/components/ui/Card";

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
    <Card interactive className="min-h-[132px]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
        {label}
      </p>

      <h2 className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl ${tone}`}>
        {value}
      </h2>
    </Card>
  );
}
