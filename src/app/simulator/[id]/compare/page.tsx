"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import ScenarioComparisonTable from "@/components/simulator/ScenarioComparisonTable";
import RecommendationPanel from "@/components/simulator/RecommendationPanel";
import ForecastChart from "@/components/simulator/ForecastChart";
import ReuxSnippetPanel from "@/components/simulator/ReuxSnippetPanel";
import { LoadingChart } from "@/components/simulator/LoadingState";
import { ErrorState } from "@/components/simulator/EmptyState";
import { getSimulation } from "@/lib/simulation/mock-service";
import type { Simulation } from "@/lib/simulation/types";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const CHART_COLORS = [
  "#64748b",
  "#06b6d4",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
];

export default function ComparisonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const response = await getSimulation(id);
      setSimulation(response.simulation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-7 w-48 rounded bg-white/[0.06] animate-pulse" />
        <LoadingChart />
        <LoadingChart />
      </div>
    );
  }

  if (error || !simulation || !simulation.comparison) {
    return (
      <ErrorState
        message={error || "Comparison data not available"}
        onRetry={loadData}
      />
    );
  }

  const { comparison } = simulation;
  const baseline = comparison.baseline;
  const scenarios = comparison.scenarios;
  const recommended = [...simulation.scenarios].find(
    s => s.id === comparison.recommendedId
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/simulator/${id}`}
          className="p-2 rounded-lg border border-white/[0.06] text-gray-500 hover:text-white hover:border-white/[0.12] transition-colors"
        >
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Scenario Comparison
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {simulation.name} · {simulation.scenarios.length} scenarios
          </p>
        </div>
      </div>

      {/* Recommendation */}
      {recommended && (
        <RecommendationPanel
          scenarioName={recommended.inputs.name}
          marginImprovement={recommended.summary.margin - baseline.summary.margin}
          riskChange={recommended.summary.riskScore - baseline.summary.riskScore}
          firstDivergenceWeek={comparison.firstDivergenceWeek}
          reason={comparison.recommendationReason}
        />
      )}

      {/* Comparison Table */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Metric Comparison
        </h2>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
          <ScenarioComparisonTable
            baseline={baseline}
            scenarios={scenarios}
            deltas={comparison.deltas}
            recommendedId={comparison.recommendedId}
          />
        </div>
      </div>

      {/* Side-by-side Charts */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Forecast Comparisons
        </h2>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ForecastChart
            datasets={simulation.scenarios.map((s, i) => ({
              label: s.inputs.name,
              data: s.forecast,
              color: CHART_COLORS[i % CHART_COLORS.length],
            }))}
            metricKey="margin"
            title="Weekly Margin"
            format="currency"
          />
          <ForecastChart
            datasets={simulation.scenarios.map((s, i) => ({
              label: s.inputs.name,
              data: s.forecast,
              color: CHART_COLORS[i % CHART_COLORS.length],
            }))}
            metricKey="riskScore"
            title="Risk Score"
            format="number"
          />
          <ForecastChart
            datasets={simulation.scenarios.map((s, i) => ({
              label: s.inputs.name,
              data: s.forecast,
              color: CHART_COLORS[i % CHART_COLORS.length],
            }))}
            metricKey="productivity"
            title="Productivity"
            format="number"
          />
          <ForecastChart
            datasets={simulation.scenarios.map((s, i) => ({
              label: s.inputs.name,
              data: s.forecast,
              color: CHART_COLORS[i % CHART_COLORS.length],
            }))}
            metricKey="operatingCost"
            title="Operating Cost"
            format="currency"
          />
        </div>
      </div>

      {/* Scenario Reux Snippets */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Reux Definitions
        </h2>
        {simulation.scenarios.map(s => (
          <div key={s.id}>
            <div className="text-xs text-gray-600 mb-1.5 font-medium">
              {s.inputs.name}
              {s.id === comparison.recommendedId && (
                <span className="ml-2 text-amber-400">★ Recommended</span>
              )}
            </div>
            <ReuxSnippetPanel
              snippet={s.reuxSnippet}
              collapsible={true}
              defaultOpen={s.id === comparison.recommendedId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
