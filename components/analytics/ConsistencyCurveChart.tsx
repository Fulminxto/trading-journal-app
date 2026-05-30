"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: {
    date: string;
    consistency: number;
  }[];
};

export default function ConsistencyCurveChart({
  data,
}: Props) {
  return (
    <div className="relative h-[360px] overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.10),transparent_35%)]" />

      <div className="relative z-10 mb-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">
          Consistency Curve
        </p>

        <h2 className="mt-2 text-3xl font-black text-white">
          Consistency Over Time
        </h2>
      </div>

      <div className="relative z-10 h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="4 10"
              stroke="rgba(255,255,255,0.07)"
              vertical={false}
            />

            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "#8b98ad" }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#8b98ad" }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(7,11,20,0.94)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "18px",
                color: "white",
              }}
            />

            <Line
              type="monotone"
              dataKey="consistency"
              stroke="#22d3ee"
              strokeWidth={3}
              dot={false}
              activeDot={{
                r: 6,
                fill: "#22d3ee",
                stroke: "#050b10",
                strokeWidth: 3,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
