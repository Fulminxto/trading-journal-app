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

type EquityPoint = {
  date: string;
  equity: number;
};

type Props = {
  data: EquityPoint[];
};

function formatMoney(value: number) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function EquityChart({ data }: Props) {
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

  const mainColor = isPositive ? "#22c55e" : "#ef4444";
  const glowColor = isPositive
    ? "rgba(34,197,94,0.18)"
    : "rgba(239,68,68,0.18)";

  return (
    <div className="relative h-[360px] min-h-[360px] w-full min-w-0 overflow-hidden rounded-2xl bg-black/10 p-2">
      <div
        className="pointer-events-none absolute inset-0 opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${glowColor}, transparent 45%)`,
        }}
      />

      <ResponsiveContainer width="100%" height={340}>
        <AreaChart
          data={data}
          margin={{
            top: 18,
            right: 18,
            left: 0,
            bottom: 8,
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
              <stop
                offset="0%"
                stopColor={mainColor}
                stopOpacity={0.28}
              />

              <stop
                offset="65%"
                stopColor={mainColor}
                stopOpacity={0.08}
              />

              <stop
                offset="100%"
                stopColor={mainColor}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 8"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#71717a"
            tick={{
              fontSize: 11,
              fill: "#71717a",
            }}
            tickLine={false}
            axisLine={false}
            dy={8}
          />

          <YAxis
            stroke="#71717a"
            tick={{
              fontSize: 11,
              fill: "#71717a",
            }}
            tickLine={false}
            axisLine={false}
            width={78}
            tickFormatter={(value) =>
              formatMoney(Number(value))
            }
          />

          <Tooltip
            cursor={{
              stroke: "rgba(255,255,255,0.12)",
              strokeWidth: 1,
            }}
            formatter={(value) => [
              formatMoney(Number(value)),
              "Equity",
            ]}
            labelFormatter={(label) => `Data: ${label}`}
            contentStyle={{
              backgroundColor: "rgba(7,16,24,0.95)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: "18px",
              color: "white",
              boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
              backdropFilter: "blur(16px)",
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
            strokeWidth={3}
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