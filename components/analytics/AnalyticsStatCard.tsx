import Card from "@/components/ui/Card";
import IconTile from "@/components/ui/IconTile";

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
    <Card interactive className="group p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">{label}</p>
        <IconTile size="sm">
          <Icon size={16} />
        </IconTile>
      </div>

      <h2 className={`mt-4 text-2xl font-bold ${tone}`}>
        {value}
      </h2>
    </Card>
  );
}
