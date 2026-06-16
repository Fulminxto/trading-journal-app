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
    return "bg-green-500/30 border-green-400/30";
  }

  if (value > 0) {
    return "bg-green-500/10 border-green-500/20";
  }

  if (value <= -500) {
    return "bg-red-500/30 border-red-400/30";
  }

  if (value < 0) {
    return "bg-red-500/10 border-red-500/20";
  }

  return "bg-white/[0.03] border-white/10";
}

export default function WeekdayHeatmap({
  data,
  appLanguage,
}: Props) {
  const t = getAnalyticsLabels(appLanguage);

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-accent-bright)_8%,transparent)_35%)]" />

      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-bright">
          {t.performanceHeatmap}
        </p>

        <h2 className="mt-3 text-3xl font-black text-white">
          {t.weekdayPerformance}
        </h2>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
          {data.map((item) => (
            <div
              key={item.day}
              className={`rounded-2xl border p-5 transition-all duration-300 ${getIntensity(
                item.pnl
              )}`}
            >
              <p className="text-sm text-gray-400">
                {item.day}
              </p>

              <h3 className="mt-3 text-3xl font-black text-white">
                {item.pnl >= 0 ? "+" : ""}
                {item.pnl.toFixed(0)}
              </h3>
            </div>
          ))}
        </div>

        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-gray-400">
          {t.weekdayHeatmapDescription}
        </p>
      </div>
    </div>
  );
}
