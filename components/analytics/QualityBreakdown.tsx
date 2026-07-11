import Card from "@/components/ui/Card";

type QualityBreakdownRowProps = {
  label: string;
  items: {
    level: string;
    count: number;
    pnl: number;
  }[];
};

function getPnlTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-white";
}

/**
 * One labeled row of 3 buckets (e.g. weak/average/elite) with count + PnL.
 * Confidence, Execution and Setup Quality used to each get a full-width
 * card of their own with near-identical chrome - this renders all three
 * as rows inside a single shared "Quality Breakdown" card instead.
 */
export default function QualityBreakdownRow({
  label,
  items,
}: QualityBreakdownRowProps) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
        {label}
      </p>

      <div className="mt-3 grid grid-cols-3 gap-3">
        {items.map((item) => (
          <Card key={item.level} variant="inner" className="p-4">
            <p className="text-xs text-muted">{item.level}</p>

            <h3 className="mt-2 text-lg font-black text-white">
              {item.count}
            </h3>

            <p
              className={`mt-1 text-xs font-bold ${
                getPnlTone(item.pnl)
              }`}
            >
              {item.pnl > 0 ? "+" : ""}
              {item.pnl.toFixed(0)}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
