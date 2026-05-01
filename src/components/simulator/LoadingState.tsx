"use client";

import { cn } from "@/lib/utils";

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/[0.08]" />
          <div className="h-4 w-40 rounded bg-white/[0.06]" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-3">
        {[1, 2, 3].map(i => (
          <div key={i}>
            <div className="h-3 w-16 rounded bg-white/[0.04] mb-1.5" />
            <div className="h-5 w-20 rounded bg-white/[0.06]" />
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        <div className="h-3 w-16 rounded bg-white/[0.04]" />
        <div className="h-3 w-20 rounded bg-white/[0.04]" />
      </div>
    </div>
  );
}

function SkeletonMetricCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-white/[0.06]" />
        <div className="h-4 w-12 rounded bg-white/[0.04]" />
      </div>
      <div className="h-7 w-24 rounded bg-white/[0.06] mb-2" />
      <div className="h-3 w-20 rounded bg-white/[0.04]" />
    </div>
  );
}

export function LoadingCards({ rows = 3, className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function LoadingMetrics({ rows = 5, className }: LoadingStateProps) {
  return (
    <div className={cn("grid grid-cols-2 lg:grid-cols-5 gap-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonMetricCard key={i} />
      ))}
    </div>
  );
}

export function LoadingChart({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 animate-pulse", className)}>
      <div className="h-4 w-32 rounded bg-white/[0.06] mb-6" />
      <div className="h-48 w-full rounded bg-white/[0.03] flex items-end justify-around px-4 pb-4 gap-2">
        {[40, 65, 50, 80, 60, 75, 55, 70, 45, 85, 60, 72].map((h, i) => (
          <div
            key={i}
            className="w-full rounded-t bg-white/[0.04]"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
