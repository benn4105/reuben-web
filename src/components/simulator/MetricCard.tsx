"use client";

import { cn } from "@/lib/utils";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Users,
  Activity,
  Repeat,
} from "lucide-react";

// shadcn / Radix components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  label: string;
  value: string | number;
  format?: "currency" | "percent" | "number";
  icon?: "revenue" | "cost" | "margin" | "productivity" | "risk" | "workforce";
  delta?: number;
  className?: string;
}

const ICON_MAP = {
  revenue: { icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  cost: { icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
  margin: { icon: Repeat, color: "text-cyan-400", bg: "bg-cyan-500/10" },
  productivity: { icon: Activity, color: "text-violet-400", bg: "bg-violet-500/10" },
  risk: { icon: AlertTriangle, color: "text-rose-400", bg: "bg-rose-500/10" },
  workforce: { icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
};

function formatValue(value: string | number, format?: string): string {
  if (typeof value === "string") return value;
  switch (format) {
    case "currency": {
      const abs = Math.abs(value);
      const formatted = abs >= 1000 ? `$${(abs / 1000).toFixed(1)}k` : `$${abs.toLocaleString()}`;
      return value < 0 ? `-${formatted}` : formatted;
    }
    case "percent":
      return `${value}%`;
    default:
      return value.toLocaleString();
  }
}

export default function MetricCard({
  label,
  value,
  format,
  icon,
  delta,
  className,
}: MetricCardProps) {
  const config = icon ? ICON_MAP[icon] : null;
  const Icon = config?.icon;
  const hasDelta = delta !== undefined && delta !== 0;
  const isPositive = (delta ?? 0) > 0;

  return (
    <Card
      size="sm"
      className={cn(
        "border-none bg-card/50 ring-white/[0.06] hover:ring-white/[0.12] transition-all duration-200",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Icon */}
          {Icon && (
            <div className={cn("p-1.5 rounded-lg w-fit", config?.bg)}>
              <Icon size={16} className={config?.color} />
            </div>
          )}

          {/* Value */}
          <div>
            <div className="flex items-end gap-2">
              <span className="text-xl font-bold text-foreground font-mono tabular-nums tracking-tight leading-none">
                {formatValue(value, format)}
              </span>
              {hasDelta && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge
                      variant={isPositive ? "secondary" : "destructive"}
                      className={cn(
                        "gap-0.5 text-[10px] font-mono",
                        isPositive && "bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/15"
                      )}
                    >
                      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                      {isPositive ? "+" : ""}
                      {Math.round(delta! * 10) / 10}%
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    Change vs. baseline
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mt-1.5">
              {label}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
