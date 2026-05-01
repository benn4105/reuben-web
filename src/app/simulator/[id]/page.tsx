"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import MetricCard from "@/components/simulator/MetricCard";
import ForecastChart from "@/components/simulator/ForecastChart";
import RecommendationPanel from "@/components/simulator/RecommendationPanel";
import ScenarioComparisonTable from "@/components/simulator/ScenarioComparisonTable";
import ReuxSnippetPanel from "@/components/simulator/ReuxSnippetPanel";
import { LoadingMetrics, LoadingChart } from "@/components/simulator/LoadingState";
import { ErrorState } from "@/components/simulator/EmptyState";
import { getSimulation } from "@/lib/simulation/mock-service";
import type { Simulation } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";

// shadcn / Radix components
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CHART_COLORS = [
  "#64748b", // slate (baseline)
  "#06b6d4", // cyan
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
];

const METRIC_TABS = [
  { key: "margin" as const, label: "Margin" },
  { key: "revenue" as const, label: "Revenue" },
  { key: "operatingCost" as const, label: "Cost" },
  { key: "productivity" as const, label: "Productivity" },
  { key: "riskScore" as const, label: "Risk" },
  { key: "workforceLoad" as const, label: "Load" },
];

export default function SimulationResultsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<
    "margin" | "revenue" | "operatingCost" | "productivity" | "riskScore" | "workforceLoad"
  >("margin");

  const loadSimulation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getSimulation(id);
      setSimulation(response.simulation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load simulation");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadSimulation();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [loadSimulation]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-7 w-64 rounded bg-white/[0.06] animate-pulse mb-2" />
          <div className="h-4 w-48 rounded bg-white/[0.04] animate-pulse" />
        </div>
        <LoadingMetrics />
        <LoadingChart />
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <ErrorState
        message={error || "Simulation not found"}
        onRetry={loadSimulation}
      />
    );
  }

  const baseline = simulation.scenarios[0];
  const altScenarios = simulation.scenarios.slice(1);
  const comparison = simulation.comparison;

  // Find recommended scenario
  const recommended = comparison
    ? simulation.scenarios.find(s => s.id === comparison.recommendedId)
    : baseline;

  const baselineMetrics = baseline.summary;

  // Chart format map
  const formatMap: Record<string, "currency" | "percent" | "number"> = {
    margin: "currency",
    revenue: "currency",
    operatingCost: "currency",
    productivity: "number",
    riskScore: "number",
    workforceLoad: "percent",
  };

  // Chart title map
  const titleMap: Record<string, string> = {
    margin: "Weekly Margin Forecast",
    revenue: "Revenue Forecast",
    operatingCost: "Operating Cost Forecast",
    productivity: "Productivity Forecast",
    riskScore: "Risk Score Forecast",
    workforceLoad: "Workforce Load Forecast",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {simulation.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {simulation.scenarios.length} scenario{simulation.scenarios.length !== 1 ? "s" : ""} · {baseline.inputs.forecastWeeks}-week forecast
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push("/simulator/new")}
            variant="outline"
            size="sm"
          >
            New Simulation
          </Button>
        </div>
      </div>

      {/* Baseline Metrics */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Baseline Metrics — {baseline.inputs.name}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <MetricCard
            label="Weekly Revenue"
            value={baselineMetrics.revenue}
            format="currency"
            icon="revenue"
          />
          <MetricCard
            label="Operating Cost"
            value={baselineMetrics.operatingCost}
            format="currency"
            icon="cost"
          />
          <MetricCard
            label="Weekly Margin"
            value={baselineMetrics.margin}
            format="currency"
            icon="margin"
            delta={
              recommended && recommended.id !== baseline.id
                ? ((recommended.summary.margin - baselineMetrics.margin) / Math.abs(baselineMetrics.margin)) * 100
                : undefined
            }
          />
          <MetricCard
            label="Productivity"
            value={`${baselineMetrics.productivity} u/e/w`}
            icon="productivity"
          />
          <MetricCard
            label="Risk Score"
            value={`${baselineMetrics.riskScore}/100`}
            icon="risk"
          />
        </div>
      </div>

      {/* Recommendation */}
      {comparison && recommended && (
        <RecommendationPanel
          scenarioName={recommended.inputs.name}
          marginImprovement={recommended.summary.margin - baseline.summary.margin}
          riskChange={recommended.summary.riskScore - baseline.summary.riskScore}
          firstDivergenceWeek={comparison.firstDivergenceWeek}
          reason={comparison.recommendationReason}
        />
      )}

      {/* Forecast Chart */}
      <div className="space-y-3">
        <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as typeof activeMetric)}>
          <TabsList variant="line" className="h-auto p-0">
            {METRIC_TABS.map(tab => (
              <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <ForecastChart
          datasets={simulation.scenarios.map((s, i) => ({
            label: s.inputs.name,
            data: s.forecast,
            color: CHART_COLORS[i % CHART_COLORS.length],
          }))}
          metricKey={activeMetric}
          title={titleMap[activeMetric]}
          format={formatMap[activeMetric]}
        />
      </div>

      {/* Comparison Table */}
      {comparison && altScenarios.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Scenario Comparison
          </h2>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <ScenarioComparisonTable
              baseline={baseline}
              scenarios={altScenarios}
              deltas={comparison.deltas}
              recommendedId={comparison.recommendedId}
            />
          </div>
        </div>
      )}

      {/* Decision Summary */}
      {comparison && recommended && (
        <Card className="border-none ring-white/[0.06] bg-card/30">
          <CardContent className="p-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Decision Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Recommended</div>
                <div className="text-sm font-semibold text-amber-400">
                  {recommended.inputs.name}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Expected Margin Impact</div>
                <Badge
                  variant={recommended.summary.margin >= baseline.summary.margin ? "secondary" : "destructive"}
                  className={cn(
                    "font-mono text-xs",
                    recommended.summary.margin >= baseline.summary.margin && "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {recommended.summary.margin >= baseline.summary.margin ? "+" : ""}
                  ${(recommended.summary.margin - baseline.summary.margin).toLocaleString()}/week
                </Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Risk Change</div>
                <Badge
                  variant={recommended.summary.riskScore <= baseline.summary.riskScore ? "secondary" : "destructive"}
                  className={cn(
                    "font-mono text-xs",
                    recommended.summary.riskScore <= baseline.summary.riskScore && "bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  {recommended.summary.riskScore > baseline.summary.riskScore ? "+" : ""}
                  {(recommended.summary.riskScore - baseline.summary.riskScore).toFixed(1)} pts
                </Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">First Meaningful Divergence</div>
                <Badge variant="outline" className="font-mono text-xs">
                  Week {comparison.firstDivergenceWeek}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reux Snippet */}
      <ReuxSnippetPanel
        snippet={recommended?.reuxSnippet || baseline.reuxSnippet}
        defaultOpen={false}
      />
    </div>
  );
}
