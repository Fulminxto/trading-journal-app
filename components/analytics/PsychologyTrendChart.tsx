"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

type Props = {
  data: {
    date: string;
    execution: number | null;
    confidence: number | null;
  }[];
  executionLabel: string;
  confidenceLabel: string;
};

// Execution and confidence used to each get their own near-identical
// single-line chart card (plus 3 more composite-score charts blending the
// same inputs). Two cold-family series on one chart says the same thing
// without the echo, and lets the two actually be compared trade-to-trade.
export default function PsychologyTrendChart({
  data,
  executionLabel,
  confidenceLabel,
}: Props) {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="4 10"
            stroke="rgba(255,255,255,0.07)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#7d8db5" }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: "#7d8db5" }}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(7,16,24,0.94)",
              border: "1px solid rgba(234,247,255,0.12)",
              borderRadius: "16px",
              color: "white",
            }}
          />

          <Legend
            wrapperStyle={{ fontSize: 12, color: "#9fb4dd" }}
          />

          <Line
            type="monotone"
            dataKey="execution"
            name={executionLabel}
            stroke="#5BE0FF"
            strokeWidth={2.5}
            dot={false}
            connectNulls
            activeDot={{
              r: 5,
              fill: "#5BE0FF",
              stroke: "#0C1430",
              strokeWidth: 2,
            }}
          />

          <Line
            type="monotone"
            dataKey="confidence"
            name={confidenceLabel}
            stroke="#2E62E6"
            strokeWidth={2.5}
            dot={false}
            connectNulls
            activeDot={{
              r: 5,
              fill: "#2E62E6",
              stroke: "#0C1430",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
