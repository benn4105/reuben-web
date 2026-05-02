"use client";

import { cn } from "@/lib/utils";
import { Award, TrendingUp, TrendingDown, Calendar } from "lucide-react";

// shadcn / Radix components
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface RecommendationPanelProps {
  scenarioName: string;
  marginImprovement: number;
  riskChange: number;
  firstDivergenceWeek: number;
  reason?: string;
  summary?: string;
  reasons?: string[];
  tradeoffs?: string[];
  className?: string;
}

export default function RecommendationPanel({
  scenarioName,
  marginImprovement,
  riskChange,
  firstDivergenceWeek,
  reason,
  summary,
  reasons,
  tradeoffs,
  className,
}: RecommendationPanelProps) {
  const marginPositive = marginImprovement >= 0;
  const riskPositive = riskChange <= 0;

  return (
    <Card
      className={cn(
        "border-none ring-amber-500/20 bg-amber-500/[0.03]",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="shrink-0 p-2.5 rounded-xl bg-amber-500/10">
            <Award size={22} className="text-amber-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground">
                Recommended Scenario
              </h3>
              <Badge className="bg-amber-500/20 text-amber-400 text-[10px] border-none">
                RECOMMENDED
              </Badge>
            </div>

            {/* Scenario Name */}
            <div className="text-lg font-bold text-amber-400 mb-3">
              {scenarioName}
            </div>

            {/* Metrics Row */}
            <div className="flex flex-wrap items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5">
                {marginPositive ? (
                  <TrendingUp size={14} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={14} className="text-rose-400" />
                )}
                <span className="text-xs text-muted-foreground">Margin:</span>
                <Badge
                  variant={marginPositive ? "secondary" : "destructive"}
                  className={cn(
                    "text-[10px] font-mono",
                    marginPositive && "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {marginPositive ? "+" : ""}${marginImprovement.toLocaleString()}/week
                </Badge>
              </div>

              <Separator orientation="vertical" className="h-4 bg-border/30" />

              <div className="flex items-center gap-1.5">
                {riskPositive ? (
                  <TrendingDown size={14} className="text-emerald-400" />
                ) : (
                  <TrendingUp size={14} className="text-rose-400" />
                )}
                <span className="text-xs text-muted-foreground">Risk:</span>
                <Badge
                  variant={riskPositive ? "secondary" : "destructive"}
                  className={cn(
                    "text-[10px] font-mono",
                    riskPositive && "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {riskChange > 0 ? "+" : ""}{riskChange.toFixed(1)} pts
                </Badge>
              </div>

              <Separator orientation="vertical" className="h-4 bg-border/30" />

              <div className="flex items-center gap-1.5">
                <Calendar size={14} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Divergence:</span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Week {firstDivergenceWeek}
                </Badge>
              </div>
            </div>

            {/* Reason Details */}
            <div className="space-y-4 mt-2">
              {summary && (
                <p className="text-sm text-foreground/90 font-medium">
                  {summary}
                </p>
              )}
              {reasons && reasons.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Why this path?</h4>
                  <ul className="space-y-1.5">
                    {reasons.map((r, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-emerald-400 shrink-0">✓</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tradeoffs && tradeoffs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-3">Known Tradeoffs</h4>
                  <ul className="space-y-1.5">
                    {tradeoffs.map((t, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-amber-400 shrink-0">!</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!summary && !reasons?.length && !tradeoffs?.length && reason && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {reason}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
