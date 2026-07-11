"use client";

import { useId } from "react";
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

const emptyLabels: Record<
  AppLanguage,
  { title: string; description: string }
> = {
  en: { title: "No equity data yet", description: "Start tracking executions to generate your equity curve and performance analytics." },
  it: { title: "Nessun dato equity", description: "Inizia a registrare trade per generare la curva equity e le analisi di performance." },
  uk: { title: "Немає даних equity", description: "Почніть записувати угоди для побудови кривої equity та аналітики." },
  ru: { title: "Нет данных equity", description: "Начните записывать сделки для построения кривой equity и аналитики." },
  es: { title: "Sin datos de equity", description: "Empieza a registrar operaciones para generar tu curva de equity y analítica." },
  fr: { title: "Aucune donnée equity", description: "Commencez à enregistrer des trades pour générer votre courbe equity et vos analyses." },
  de: { title: "Keine Equity-Daten", description: "Beginne mit der Aufzeichnung von Trades, um deine Equity-Kurve zu erstellen." },
};

const equityChartColors = {
  line: "#5BE0FF",
  fill: "#2C74E8",
  glow: "rgba(91,224,255,0.14)",
  cursor: "rgba(91,224,255,0.25)",
  dotStroke: "#0C1430",
};

export default function EquityChart({ data, language }: Props) {
  const gradientId = `equityGradient-${useId().replace(/:/g, "")}`;
  const hasData = data.length > 0;

  if (!hasData) {
    const lang = normalizeAppLanguage(language);
    const el = emptyLabels[lang];
    return (
      <EmptyState
        title={el.title}
        description={el.description}
      />
    );
  }

  const hasSeries = data.length > 1;

  const lang = normalizeAppLanguage(language);
  const tl = tooltipLabels[lang];

  return (
    <div className="relative h-[390px] min-h-[390px] w-full min-w-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
      {hasSeries && (
        <>
          <div
            className="pointer-events-none absolute inset-0 opacity-80 blur-3xl"
            style={{
              background: `radial-gradient(circle at 50% 10%, ${equityChartColors.glow}, transparent 45%)`,
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,color-mix(in_srgb,var(--color-accent-bright)_6%,transparent),transparent_35%)]" />
        </>
      )}

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
              id={gradientId}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={equityChartColors.line} stopOpacity={0.24} />
              <stop offset="55%" stopColor={equityChartColors.fill} stopOpacity={0.08} />
              <stop offset="100%" stopColor={equityChartColors.fill} stopOpacity={0} />
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
              stroke: equityChartColors.cursor,
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

          {hasSeries && (
            <Area
              type="monotone"
              dataKey="equity"
              stroke="transparent"
              fill={`url(#${gradientId})`}
              animationDuration={900}
            />
          )}

          <Line
            type="monotone"
            dataKey="equity"
            stroke={equityChartColors.line}
            strokeWidth={hasSeries ? 3.5 : 0}
            dot={
              hasSeries
                ? false
                : {
                    r: 5,
                    stroke: equityChartColors.dotStroke,
                    strokeWidth: 3,
                    fill: equityChartColors.line,
                  }
            }
            activeDot={{
              r: 6,
              stroke: equityChartColors.dotStroke,
              strokeWidth: 3,
              fill: equityChartColors.line,
            }}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
