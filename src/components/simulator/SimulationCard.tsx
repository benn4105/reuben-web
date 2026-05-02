"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { SimulationSummary } from "@/lib/simulation/types";
import { ArrowRight, Clock, GitBranch, Trash2, Edit2 } from "lucide-react";

// shadcn / Radix components
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardAction } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface SimulationCardProps {
  simulation: SimulationSummary;
  className?: string;
  onDelete?: (id: string) => void;
  onRename?: (id: string, newName: string) => void;
}

function formatCurrency(value: number): string {
  if (Math.abs(value) >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toLocaleString()}`;
}

function timeAgo(date: string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;

  return then.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-500",
  running: "bg-amber-500 animate-pulse",
  failed: "bg-rose-500",
};

export default function SimulationCard({
  simulation,
  className,
  onDelete,
  onRename,
}: SimulationCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(simulation.name);

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== simulation.name) {
      onRename?.(simulation.id, renameValue.trim());
    }
    setIsRenaming(false);
  };

  return (
    <div className="relative group">
      <Link href={`/simulator/${simulation.id}`} className={cn(isRenaming && "pointer-events-none")}>
        <Card
          className={cn(
            "border-none ring-white/[0.06] bg-card/50 hover:ring-white/[0.14] hover:bg-card/80 transition-all duration-200 cursor-pointer group-hover:ring-white/[0.14] group-hover:bg-card/80",
            className
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2 pr-12 min-w-0 flex-1">
              <div className={cn("w-2 h-2 rounded-full shrink-0", STATUS_COLORS[simulation.status])} />
              {isRenaming ? (
                <div onClick={(e) => e.preventDefault()} className="flex-1 mr-2 pointer-events-auto">
                  <Input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRenameSubmit();
                      if (e.key === "Escape") {
                        setRenameValue(simulation.name);
                        setIsRenaming(false);
                      }
                    }}
                    onBlur={handleRenameSubmit}
                    autoFocus
                    className="h-7 text-sm font-semibold bg-black/50 border-white/20 focus-visible:ring-1 focus-visible:ring-white/30 px-2"
                  />
                </div>
              ) : (
                <CardTitle className="text-sm font-semibold text-foreground truncate">
                  {simulation.name}
                </CardTitle>
              )}
            </div>
            <CardAction className={cn("flex items-center gap-1", isRenaming && "hidden")}>
              {onRename && !isRenaming && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsRenaming(true);
                  }}
                  className="text-muted-foreground/30 hover:text-white transition-colors p-1 pointer-events-auto"
                  title="Rename simulation"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && !isRenaming && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(simulation.id);
                  }}
                  className="text-muted-foreground/30 hover:text-rose-400 transition-colors p-1 pointer-events-auto"
                  title="Delete simulation"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <ArrowRight
                size={16}
                className="text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all ml-1"
              />
            </CardAction>
          </CardHeader>

          <CardContent>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Best Margin
              </div>
              <div className="text-sm font-semibold font-mono text-emerald-400 tabular-nums">
                {formatCurrency(simulation.bestMargin)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Risk Range
              </div>
              <div className="text-sm font-semibold font-mono text-foreground/70 tabular-nums">
                {simulation.riskRange[0]}–{simulation.riskRange[1]}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Best Scenario
              </div>
              <div className="text-sm font-semibold text-foreground/70 truncate">
                {simulation.bestMarginScenario}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-transparent border-none p-0 px-4 pb-3">
          <div className="flex items-center gap-3 text-muted-foreground/60">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className="text-[11px]">{timeAgo(simulation.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <GitBranch size={12} />
              <span className="text-[11px]">{simulation.scenarioCount} scenarios</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
    </div>
  );
}
