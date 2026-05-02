"use client";

import { cn } from "@/lib/utils";
import type { ScenarioResult, MetricDelta } from "@/lib/simulation/types";
import { Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

// shadcn / Radix components
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface ScenarioComparisonTableProps {
  baseline: ScenarioResult;
  scenarios: ScenarioResult[];
  deltas: Record<string, MetricDelta[]>;
  recommendedId: string;
  className?: string;
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toLocaleString()}`;
}

function DeltaBadge({ delta }: { delta: MetricDelta }) {
  const isNeutral = Math.abs(delta.deltaPct) < 0.5;
  const isPositive = delta.direction === "positive";

  if (isNeutral) {
    return (
      <Badge variant="secondary" className="gap-1 text-[10px] bg-muted text-muted-foreground">
        <Minus size={10} />
        0%
      </Badge>
    );
  }

  return (
    <Badge
      variant={isPositive ? "secondary" : "destructive"}
      className={cn(
        "gap-1 text-[10px]",
        isPositive && "bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/15"
      )}
    >
      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {delta.deltaPct > 0 ? "+" : ""}
      {Math.round(delta.deltaPct * 10) / 10}%
    </Badge>
  );
}

const METRIC_ROWS = [
  { key: "operatingCost", label: "Operating Cost", format: formatCurrency, accessor: (s: ScenarioResult) => s.summary.operatingCost },
  { key: "productivity", label: "Productivity", format: (v: number) => `${v} u/e/w`, accessor: (s: ScenarioResult) => s.summary.productivity },
  { key: "margin", label: "Weekly Margin", format: formatCurrency, accessor: (s: ScenarioResult) => s.summary.margin },
  { key: "marginPct", label: "Margin %", format: (v: number) => `${v}%`, accessor: (s: ScenarioResult) => s.summary.marginPct },
  { key: "riskScore", label: "Risk Score", format: (v: number) => `${v}/100`, accessor: (s: ScenarioResult) => s.summary.riskScore },
  { key: "workforceLoad", label: "Workforce Load", format: (v: number) => `${v}%`, accessor: (s: ScenarioResult) => s.summary.workforceLoad },
];

const DELTA_LABEL_MAP: Record<string, string> = {
  operatingCost: "Operating Cost",
  productivity: "Productivity",
  margin: "Margin",
  marginPct: "Margin",
  riskScore: "Risk Score",
  workforceLoad: "Operating Cost",
};

export default function ScenarioComparisonTable({
  baseline,
  scenarios,
  deltas,
  recommendedId,
  className,
}: ScenarioComparisonTableProps) {
  const allScenarios = [baseline, ...scenarios];

  return (
    <div className={cn("relative", className)}>
      {/* Right scroll indicator */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0A0A0A] to-transparent z-10 pointer-events-none sm:hidden" />
      <div className="overflow-x-auto w-full scrollbar-none">
      <Table className="min-w-[600px]">
        <TableHeader>
          <TableRow className="border-white/[0.06] hover:bg-transparent">
            <TableHead className="w-40 text-xs uppercase tracking-wider text-muted-foreground">
              Metric
            </TableHead>
            {allScenarios.map((s) => (
              <TableHead key={s.id} className="text-right min-w-[140px]">
                <div className="flex items-center justify-end gap-2">
                  {s.id === recommendedId && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Trophy size={14} className="text-amber-400" />
                      </TooltipTrigger>
                      <TooltipContent>Recommended scenario</TooltipContent>
                    </Tooltip>
                  )}
                  <span
                    className={cn(
                      "text-xs font-semibold uppercase tracking-wider",
                      s.id === recommendedId ? "text-amber-400" : "text-muted-foreground"
                    )}
                  >
                    {s.inputs.name}
                  </span>
                </div>
                {s.id === baseline.id && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    BASELINE
                  </Badge>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {METRIC_ROWS.map((row) => (
            <TableRow
              key={row.key}
              className="border-white/[0.03] hover:bg-white/[0.02]"
            >
              <TableCell className="text-muted-foreground font-medium">
                {row.label}
              </TableCell>
              {allScenarios.map((s) => {
                const value = row.accessor(s);
                const scenarioDeltas = deltas[s.id];
                const matchedDelta = scenarioDeltas?.find(
                  d => d.label === DELTA_LABEL_MAP[row.key]
                );

                return (
                  <TableCell key={s.id} className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={cn(
                          "font-mono font-medium tabular-nums",
                          s.id === recommendedId ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {row.format(value)}
                      </span>
                      {matchedDelta && s.id !== baseline.id && (
                        <DeltaBadge delta={matchedDelta} />
                      )}
                    </div>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}
