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
  decisionSummary?: string;
  recommendedAction?: string;
  confidence?: "low" | "medium" | "high";
  confidenceSummary?: string;
  whatChangedFromBaseline?: string[];
  riskSummary?: string;
  tradeoffSummary?: string;
  watchouts?: string[];
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
  decisionSummary,
  recommendedAction,
  confidence,
  confidenceSummary,
  whatChangedFromBaseline,
  riskSummary,
  tradeoffSummary,
  watchouts,
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
                Best Path Forward
              </h3>
              <Badge className="bg-amber-500/20 text-amber-400 text-[10px] border-none">
                RECOMMENDED
              </Badge>
              {confidence && (
                <Badge className="bg-white/[0.06] text-gray-300 text-[10px] border-none uppercase">
                  {confidence} confidence
                </Badge>
              )}
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
              {(decisionSummary || summary) && (
                <p className="text-sm text-foreground/90 font-medium">
                  {decisionSummary || summary}
                </p>
              )}
              {recommendedAction && (
                <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-3">
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">Recommended action</h4>
                  <p className="text-sm text-gray-300">{recommendedAction}</p>
                </div>
              )}
              {confidenceSummary && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {confidenceSummary}
                </p>
              )}
              {whatChangedFromBaseline && whatChangedFromBaseline.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What changed from baseline</h4>
                  <ul className="grid gap-1.5 sm:grid-cols-2">
                    {whatChangedFromBaseline.map((change, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-cyan-400 shrink-0">-</span> {change}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {(riskSummary || tradeoffSummary) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {riskSummary && (
                    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Risk summary</h4>
                      <p className="text-xs text-gray-300">{riskSummary}</p>
                    </div>
                  )}
                  {tradeoffSummary && (
                    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Tradeoff summary</h4>
                      <p className="text-xs text-gray-300">{tradeoffSummary}</p>
                    </div>
                  )}
                </div>
              )}
              {reasons && reasons.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Why this scenario wins</h4>
                  <ul className="space-y-1.5">
                    {reasons.map((r, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-emerald-400 shrink-0">✓</span> {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {((watchouts && watchouts.length > 0) || (tradeoffs && tradeoffs.length > 0)) && (
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-3">Tradeoffs to watch</h4>
                  <ul className="space-y-1.5">
                    {(watchouts && watchouts.length > 0 ? watchouts : tradeoffs ?? []).map((t, i) => (
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
