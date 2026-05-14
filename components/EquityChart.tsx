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
      <div className="flex h-[340px] items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-sm text-gray-500">
        Nessun dato equity disponibile.
      </div>
    );
  }

  const firstEquity = data[0]?.equity || 0;
  const lastEquity = data[data.length - 1]?.equity || 0;
  const isPositive = lastEquity >= firstEquity;

  return (
    <div className="h-[340px] min-h-[340px] w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data}>
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
                stopColor={isPositive ? "#22c55e" : "#ef4444"}
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor={isPositive ? "#22c55e" : "#ef4444"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
          />

          <XAxis
            dataKey="date"
            stroke="#71717a"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            stroke="#71717a"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={72}
            tickFormatter={(value) =>
              formatMoney(Number(value))
            }
          />

          <Tooltip
            formatter={(value) => [
              formatMoney(Number(value)),
              "Equity",
            ]}
            labelFormatter={(label) => `Data: ${label}`}
            contentStyle={{
              backgroundColor: "#0f172a",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "white",
            }}
            labelStyle={{
              color: "#d4d4d8",
            }}
          />

          <Area
            type="monotone"
            dataKey="equity"
            stroke="transparent"
            fill="url(#equityGradient)"
          />

          <Line
            type="monotone"
            dataKey="equity"
            stroke={isPositive ? "#22c55e" : "#ef4444"}
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 6,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}