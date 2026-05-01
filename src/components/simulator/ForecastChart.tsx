"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ForecastPoint } from "@/lib/simulation/types";

interface ForecastChartProps {
  datasets: {
    label: string;
    data: ForecastPoint[];
    color: string;
  }[];
  metricKey: keyof ForecastPoint;
  title: string;
  format?: "currency" | "percent" | "number";
  className?: string;
}

const CHART_HEIGHT = 200;
const CHART_PADDING = { top: 20, right: 16, bottom: 32, left: 60 };

function formatTick(value: number, format?: string): string {
  switch (format) {
    case "currency":
      return value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`;
    case "percent":
      return `${value}%`;
    default:
      return value.toLocaleString();
  }
}

export default function ForecastChart({
  datasets,
  metricKey,
  title,
  format,
  className,
}: ForecastChartProps) {
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);

  const { minY, maxY, points, width } = useMemo(() => {
    const allValues = datasets.flatMap(ds =>
      ds.data.map(d => d[metricKey] as number)
    );
    const rawMin = Math.min(...allValues);
    const rawMax = Math.max(...allValues);
    const padding = (rawMax - rawMin) * 0.1 || rawMax * 0.1 || 10;
    const minY = Math.floor(rawMin - padding);
    const maxY = Math.ceil(rawMax + padding);

    const maxWeeks = Math.max(...datasets.map(ds => ds.data.length));
    const width = Math.max(600, maxWeeks * 50);

    const points = datasets.map(ds => ({
      ...ds,
      coords: ds.data.map((d, i) => {
        const x = CHART_PADDING.left + (i / Math.max(1, ds.data.length - 1)) * (width - CHART_PADDING.left - CHART_PADDING.right);
        const y = CHART_PADDING.top + (1 - (((d[metricKey] as number) - minY) / (maxY - minY))) * (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom);
        return { x, y, value: d[metricKey] as number, week: d.week };
      }),
    }));

    return { minY, maxY, points, width };
  }, [datasets, metricKey]);

  // Y-axis ticks
  const yTicks = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => {
      const value = minY + (maxY - minY) * (i / (count - 1));
      const y = CHART_PADDING.top + (1 - (i / (count - 1))) * (CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom);
      return { value: Math.round(value), y };
    });
  }, [minY, maxY]);

  // X-axis ticks
  const xTicks = useMemo(() => {
    if (datasets.length === 0 || datasets[0].data.length === 0) return [];
    const data = datasets[0].data;
    const step = Math.max(1, Math.floor(data.length / 8));
    return data
      .filter((_, i) => i % step === 0 || i === data.length - 1)
      .map((d) => {
        const idx = datasets[0].data.indexOf(d);
        const x = CHART_PADDING.left + (idx / Math.max(1, datasets[0].data.length - 1)) * (width - CHART_PADDING.left - CHART_PADDING.right);
        return { label: d.label, x };
      });
  }, [datasets, width]);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-300">{title}</h4>
        <div className="flex items-center gap-4">
          {datasets.map(ds => (
            <div key={ds.label} className="flex items-center gap-2">
              <div
                className="w-3 h-[2px] rounded-full"
                style={{ backgroundColor: ds.color }}
              />
              <span className="text-xs text-gray-500">{ds.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.01]">
        <svg
          width={width}
          height={CHART_HEIGHT}
          className="min-w-full"
          onMouseLeave={() => setHoveredWeek(null)}
        >
          {/* Grid lines */}
          {yTicks.map(tick => (
            <g key={tick.value}>
              <line
                x1={CHART_PADDING.left}
                y1={tick.y}
                x2={width - CHART_PADDING.right}
                y2={tick.y}
                stroke="rgba(255,255,255,0.04)"
                strokeDasharray="4,4"
              />
              <text
                x={CHART_PADDING.left - 8}
                y={tick.y + 4}
                textAnchor="end"
                className="text-[10px] fill-gray-600"
              >
                {formatTick(tick.value, format)}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {xTicks.map(tick => (
            <text
              key={tick.label}
              x={tick.x}
              y={CHART_HEIGHT - 6}
              textAnchor="middle"
              className="text-[10px] fill-gray-600"
            >
              {tick.label}
            </text>
          ))}

          {/* Hover column */}
          {hoveredWeek !== null && points[0]?.coords[hoveredWeek - 1] && (
            <line
              x1={points[0].coords[hoveredWeek - 1].x}
              y1={CHART_PADDING.top}
              x2={points[0].coords[hoveredWeek - 1].x}
              y2={CHART_HEIGHT - CHART_PADDING.bottom}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
            />
          )}

          {/* Area fills */}
          {points.map(ds => {
            if (ds.coords.length < 2) return null;
            const areaPath =
              `M${ds.coords[0].x},${CHART_HEIGHT - CHART_PADDING.bottom} ` +
              ds.coords.map(c => `L${c.x},${c.y}`).join(" ") +
              ` L${ds.coords[ds.coords.length - 1].x},${CHART_HEIGHT - CHART_PADDING.bottom} Z`;
            return (
              <path
                key={`area-${ds.label}`}
                d={areaPath}
                fill={ds.color}
                opacity={0.05}
              />
            );
          })}

          {/* Lines */}
          {points.map(ds => {
            if (ds.coords.length < 2) return null;
            const linePath = ds.coords
              .map((c, i) => `${i === 0 ? "M" : "L"}${c.x},${c.y}`)
              .join(" ");
            return (
              <path
                key={`line-${ds.label}`}
                d={linePath}
                fill="none"
                stroke={ds.color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Dots */}
          {points.map(ds =>
            ds.coords.map((c) => (
              <circle
                key={`dot-${ds.label}-${c.week}`}
                cx={c.x}
                cy={c.y}
                r={hoveredWeek === c.week ? 5 : 3}
                fill={hoveredWeek === c.week ? ds.color : "transparent"}
                stroke={ds.color}
                strokeWidth={hoveredWeek === c.week ? 2 : 0}
                className="transition-all duration-150"
              />
            ))
          )}

          {/* Hover targets */}
          {points[0]?.coords.map((c) => (
            <rect
              key={`hover-${c.week}`}
              x={c.x - 15}
              y={CHART_PADDING.top}
              width={30}
              height={CHART_HEIGHT - CHART_PADDING.top - CHART_PADDING.bottom}
              fill="transparent"
              onMouseEnter={() => setHoveredWeek(c.week)}
            />
          ))}

          {/* Tooltip */}
          {hoveredWeek !== null && (
            <g>
              {points.map(ds => {
                const coord = ds.coords.find(c => c.week === hoveredWeek);
                if (!coord) return null;
                return (
                  <g key={`tooltip-${ds.label}`}>
                    <rect
                      x={coord.x + 8}
                      y={coord.y - 12}
                      width={80}
                      height={20}
                      rx={4}
                      fill="rgba(0,0,0,0.8)"
                      stroke={ds.color}
                      strokeWidth={0.5}
                    />
                    <text
                      x={coord.x + 48}
                      y={coord.y + 2}
                      textAnchor="middle"
                      className="text-[10px] fill-white font-mono"
                    >
                      {formatTick(coord.value, format)}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
