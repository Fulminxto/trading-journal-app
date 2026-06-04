"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import EmptyState from "@/components/EmptyState";
import {
  formatCurrencyByLanguage,
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type EquityPoint = {
  date: string;
  equity: number;
};

type Props = {
  data: EquityPoint[];
  language?: string;
};

const tooltipLabels: Record<
  AppLanguage,
  { equity: string; date: string }
> = {
  en: { equity: "Equity", date: "Date:" },
  it: { equity: "Equity", date: "Data:" },
  uk: { equity: "Equity", date: "Дата:" },
  ru: { equity: "Equity", date: "Дата:" },
  es: { equity: "Equity", date: "Fecha:" },
  fr: { equity: "Equity", date: "Date :" },
  de: { equity: "Equity", date: "Datum:" },
};

export default function EquityChart({ data, language }: Props) {
  const hasData = data.length > 0;

  if (!hasData) {
    return (
      <EmptyState
        title="No equity data yet"
        description="Start tracking executions to generate your equity curve and performance analytics."
      />
    );
  }

  const firstEquity = data[0]?.equity || 0;
  const lastEquity = data[data.length - 1]?.equity || 0;
  const isPositive = lastEquity >= firstEquity;

  const lang = normalizeAppLanguage(language);
  const tl = tooltipLabels[lang];

  const mainColor = isPositive ? "#22c55e" : "#ef4444";
  const glowColor = isPositive
    ? "rgba(34,197,94,0.22)"
    : "rgba(239,68,68,0.22)";

  return (
    <div className="relative h-[390px] min-h-[390px] w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-80 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 10%, ${glowColor}, transparent 45%)`,
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.06),transparent_35%)]" />

      <ResponsiveContainer width="100%" height={355}>
        <AreaChart
          data={data}
          margin={{
            top: 20,
            right: 22,
            left: 4,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient
              id="equityGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={mainColor} stopOpacity={0.35} />
              <stop offset="55%" stopColor={mainColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={mainColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 10"
            stroke="rgba(255,255,255,0.07)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#71717a"
            tick={{ fontSize: 11, fill: "#8b98ad" }}
            tickLine={false}
            axisLine={false}
            dy={10}
          />

          <YAxis
            stroke="#71717a"
            tick={{ fontSize: 11, fill: "#8b98ad" }}
            tickLine={false}
            axisLine={false}
            width={82}
            tickFormatter={(value) =>
              formatCurrencyByLanguage(Number(value), "USD", lang)
            }
          />

          <Tooltip
            cursor={{
              stroke: "rgba(34,211,238,0.25)",
              strokeWidth: 1,
            }}
            formatter={(value) => [
              formatCurrencyByLanguage(Number(value), "USD", lang),
              tl.equity,
            ]}
            labelFormatter={(label) => `${tl.date} ${label}`}
            contentStyle={{
              backgroundColor: "rgba(7,11,20,0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px",
              color: "white",
              boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
              backdropFilter: "blur(18px)",
            }}
            labelStyle={{
              color: "#a1a1aa",
              fontSize: 12,
              marginBottom: 6,
            }}
          />

          <Area
            type="monotone"
            dataKey="equity"
            stroke="transparent"
            fill="url(#equityGradient)"
            animationDuration={900}
          />

          <Line
            type="monotone"
            dataKey="equity"
            stroke={mainColor}
            strokeWidth={3.5}
            dot={false}
            activeDot={{
              r: 6,
              stroke: "#050b10",
              strokeWidth: 3,
              fill: mainColor,
            }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
