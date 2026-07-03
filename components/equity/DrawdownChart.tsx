"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import EmptyState from "@/components/EmptyState";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

type DrawdownPoint = {
  date: string;
  drawdown: number;
};

type Props = {
  data: DrawdownPoint[];
  language?: string;
};

const tooltipLabels: Record<
  AppLanguage,
  { drawdown: string; date: string }
> = {
  en: { drawdown: "Underwater", date: "Date:" },
  it: { drawdown: "Underwater", date: "Data:" },
  uk: { drawdown: "Underwater", date: "Дата:" },
  ru: { drawdown: "Underwater", date: "Дата:" },
  es: { drawdown: "Underwater", date: "Fecha:" },
  fr: { drawdown: "Underwater", date: "Date :" },
  de: { drawdown: "Underwater", date: "Datum:" },
};

const emptyLabels: Record<
  AppLanguage,
  { title: string; description: string }
> = {
  en: { title: "No drawdown data yet", description: "The underwater curve appears once trades are recorded." },
  it: { title: "Nessun dato drawdown", description: "La curva underwater apparirà quando registrerai dei trade." },
  uk: { title: "Немає даних drawdown", description: "Крива underwater з'явиться після перших угод." },
  ru: { title: "Нет данных drawdown", description: "Кривая underwater появится после первых сделок." },
  es: { title: "Sin datos de drawdown", description: "La curva underwater aparecerá con los primeros trades." },
  fr: { title: "Aucune donnée drawdown", description: "La courbe underwater apparaîtra avec les premiers trades." },
  de: { title: "Keine Drawdown-Daten", description: "Die Underwater-Kurve erscheint nach den ersten Trades." },
};

/**
 * Underwater equity curve: percent below the running peak at each point.
 * This is the page's "Protect" differentiator from Dashboard's plain
 * equity hero — the drawdown zone itself is the visual (the red fill
 * under the line), not a separate annotation.
 */
export default function DrawdownChart({ data, language }: Props) {
  const lang = normalizeAppLanguage(language);

  if (data.length === 0) {
    const el = emptyLabels[lang];
    return <EmptyState title={el.title} description={el.description} />;
  }

  const tl = tooltipLabels[lang];

  return (
    <div className="relative h-[220px] min-h-[220px] w-full min-w-0 overflow-hidden rounded-inner border-[0.5px] border-white/[0.08] bg-surface-2 p-4">
      <ResponsiveContainer width="100%" height={190}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 16, left: 4, bottom: 4 }}
        >
          <defs>
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F87171" stopOpacity={0} />
              <stop offset="100%" stopColor="#F87171" stopOpacity={0.28} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 10"
            stroke="rgba(255,255,255,0.06)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            stroke="#71717a"
            tick={{ fontSize: 10, fill: "#8b98ad" }}
            tickLine={false}
            axisLine={false}
            dy={8}
          />

          <YAxis
            stroke="#71717a"
            tick={{ fontSize: 10, fill: "#8b98ad" }}
            tickLine={false}
            axisLine={false}
            width={48}
            tickFormatter={(value) => `${Number(value).toFixed(0)}%`}
          />

          <Tooltip
            cursor={{ stroke: "rgba(248,113,113,0.3)", strokeWidth: 1 }}
            formatter={(value) => [`${Number(value).toFixed(2)}%`, tl.drawdown]}
            labelFormatter={(label) => `${tl.date} ${label}`}
            contentStyle={{
              backgroundColor: "rgba(7,11,20,0.94)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "12px",
              color: "white",
            }}
            labelStyle={{
              color: "#a1a1aa",
              fontSize: 12,
              marginBottom: 4,
            }}
          />

          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#F87171"
            strokeWidth={2}
            fill="url(#drawdownGradient)"
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
