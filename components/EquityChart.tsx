"use client";

import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

type EquityPoint = {
  date: string;
  equity: number;
};

type Props = {
  data: EquityPoint[];
};

export default function EquityChart({
  data,
}: Props) {
  return (
    <div className="h-[340px] min-h-[340px] w-full min-w-0 overflow-hidden">
      <ResponsiveContainer
        width="100%"
        height={340}
      >
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
                stopColor="#22c55e"
                stopOpacity={0.35}
              />

              <stop
                offset="100%"
                stopColor="#22c55e"
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
            width={55}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              border:
                "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              color: "white",
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
            stroke="#22c55e"
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