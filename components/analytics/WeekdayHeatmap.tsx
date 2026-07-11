import Card from "@/components/ui/Card";
import {
  getAnalyticsLabels,
  type AnalyticsI18nProps,
} from "./AnalyticsI18n";

type Props = AnalyticsI18nProps & {
  data: {
    day: string;
    pnl: number;
  }[];
};

function getIntensity(value: number) {
  if (value >= 500) {
    return "border-green-400/40 bg-green-500/20";
  }

  if (value > 0) {
    return "border-green-500/20 bg-green-500/10";
  }

  if (value <= -500) {
    return "border-red-400/40 bg-red-500/20";
  }

  if (value < 0) {
    return "border-red-500/20 bg-red-500/10";
  }

  return "";
}

function getValueTone(value: number) {
  if (value > 0) {
    return "text-green-400";
  }

  if (value < 0) {
    return "text-red-400";
  }

  return "text-white";
}

export default function WeekdayHeatmap({
  data,
  appLanguage,
}: Props) {
  const t = getAnalyticsLabels(appLanguage);

  return (
    <Card>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-muted-faint">
        {t.performanceHeatmap}
      </p>

      <h2 className="mt-2 text-section text-white">
        {t.weekdayPerformance}
      </h2>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {data.map((item) => (
          <Card
            key={item.day}
            variant="inner"
            className={`p-4 ${getIntensity(item.pnl)}`}
          >
            <p className="text-sm text-muted">
              {item.day}
            </p>

            <h3 className={`mt-2 text-lg font-black ${getValueTone(item.pnl)}`}>
              {item.pnl > 0 ? "+" : ""}
              {item.pnl.toFixed(0)}
            </h3>
          </Card>
        ))}
      </div>

      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
        {t.weekdayHeatmapDescription}
      </p>
    </Card>
  );
}
