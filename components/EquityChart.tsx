"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type EquityPoint = {
  date: string;
  equity: number;
};

export default function EquityChart({ data }: { data: EquityPoint[] }) {
  return (
    <div className="min-h-[280px] w-full overflow-hidden">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis
            dataKey="date"
            stroke="#71717a"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            stroke="#71717a"
            tick={{ fontSize: 11 }}
            width={45}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}