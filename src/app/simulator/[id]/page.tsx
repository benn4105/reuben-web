"use client";

import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import MetricCard from "@/components/simulator/MetricCard";
import ForecastChart from "@/components/simulator/ForecastChart";
import RecommendationPanel from "@/components/simulator/RecommendationPanel";
import ScenarioComparisonTable from "@/components/simulator/ScenarioComparisonTable";
import ReuxSnippetPanel from "@/components/simulator/ReuxSnippetPanel";
import { LoadingMetrics, LoadingChart } from "@/components/simulator/LoadingState";
import { ErrorState } from "@/components/simulator/EmptyState";
import { getSimulation } from "@/lib/simulation/mock-service";
import { SimulationApiError } from "@/lib/simulation/api-client";
import type { Simulation } from "@/lib/simulation/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { encodeShareLink, copyToClipboard } from "@/lib/simulation/share";
import { exportToCsv, exportToPdf } from "@/lib/simulation/export";
import { Share2, Check, Download, FileText, FileSpreadsheet, Link2, Clock } from "lucide-react";

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
  const [isExpired, setIsExpired] = useState(false);
  const [activeMetric, setActiveMetric] = useState<
    "margin" | "revenue" | "operatingCost" | "productivity" | "riskScore" | "workforceLoad"
  >("margin");
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [linkCopyState, setLinkCopyState] = useState<"idle" | "copied">("idle");

  const isShareableRun = id.startsWith("live_");

  async function handleShareConfig() {
    if (!simulation) return;
    const url = encodeShareLink(
      simulation.name,
      simulation.baselineInputs,
      simulation.scenarios.slice(1).map(s => s.inputs)
    );
    const ok = await copyToClipboard(url);
    if (ok) {
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    }
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/simulator/${id}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setLinkCopyState("copied");
      setTimeout(() => setLinkCopyState("idle"), 2500);
    }
  }

  const loadSimulation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setIsExpired(false);
      const response = await getSimulation(id);
      setSimulation(response.simulation);
    } catch (err) {
      if (
        err instanceof SimulationApiError &&
        err.status &&
        (err.status === 404 || err.status === 410)
      ) {
        setIsExpired(true);
        setError(
          err.status === 410
            ? "This simulation run has expired. Saved runs are temporary and are automatically cleaned up after a period of inactivity."
            : "This simulation run was not found. It may have expired or the link may be invalid."
        );
      } else {
        setError(err instanceof Error ? err.message : "Failed to load simulation");
      }
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

  if (isExpired) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 mb-5">
          <Clock size={32} className="text-amber-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Run Expired
        </h3>
        <p className="text-sm text-gray-500 max-w-md mb-6">
          {error}
        </p>
        <div className="flex gap-3">
          <Button asChild className="gap-2 bg-white text-black hover:bg-gray-200">
            <Link href="/simulator/new">
              Start New Simulation
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-white/[0.08] text-gray-300 hover:text-white">
            <Link href="/simulator">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (error || !simulation) {
    return (
      <ErrorState
        message={error || "Simulation not found or backend unavailable. Check your connection."}
        onRetry={loadSimulation}
        secondaryAction={
          <Button asChild variant="outline" className="border-white/[0.08] text-gray-300 hover:text-white">
            <Link href="/simulator">Back to Dashboard</Link>
          </Button>
        }
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-white tracking-tight truncate">
            {simulation.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {simulation.scenarios.length} scenario{simulation.scenarios.length !== 1 ? "s" : ""} · {baseline.inputs.forecastWeeks}-week forecast
          </p>
        </div>
        <div className="flex gap-2 shrink-0 flex-wrap">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-white/[0.08] text-gray-400 hover:text-white"
              >
                <Download size={14} /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border-white/[0.08] bg-[#0a0a0a]">
              <DropdownMenuItem onClick={() => exportToPdf(simulation)} className="cursor-pointer gap-2 text-gray-300 hover:text-white focus:text-white">
                <FileText size={14} className="text-rose-400" /> PDF Report
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCsv(simulation)} className="cursor-pointer gap-2 text-gray-300 hover:text-white focus:text-white">
                <FileSpreadsheet size={14} className="text-emerald-400" /> CSV Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Copy direct link (for shareable server-persisted runs) */}
          {isShareableRun && (
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="gap-2 border-white/[0.08] text-gray-400 hover:text-white"
            >
              {linkCopyState === "copied" ? (
                <><Check size={14} className="text-emerald-400" /> Copied</>
              ) : (
                <><Link2 size={14} /> Copy Link</>
              )}
            </Button>
          )}

          {/* Share as re-runnable config */}
          <Button
            onClick={handleShareConfig}
            variant="outline"
            size="sm"
            className="gap-2 border-white/[0.08] text-gray-400 hover:text-white"
          >
            {shareState === "copied" ? (
              <><Check size={14} className="text-emerald-400" /> Copied</>
            ) : (
              <><Share2 size={14} /> Share Config</>
            )}
          </Button>
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

      {/* Decision Readout */}
      {comparison && recommended && (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Reux Decision Readout
          </h2>
          <RecommendationPanel
            scenarioName={recommended.inputs.name}
            marginImprovement={recommended.summary.margin - baseline.summary.margin}
            riskChange={recommended.summary.riskScore - baseline.summary.riskScore}
            firstDivergenceWeek={comparison.firstDivergenceWeek}
            reason={comparison.recommendationReason}
            summary={comparison.recommendationSummary}
            reasons={comparison.recommendationReasons}
            tradeoffs={comparison.recommendationTradeoffs}
          />
        </div>
      )}

      {/* Forecast Chart */}
      <div className="space-y-3">
        <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as typeof activeMetric)}>
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList variant="line" className="h-auto p-0 min-w-max">
              {METRIC_TABS.map(tab => (
                <TabsTrigger key={tab.key} value={tab.key} className="text-xs">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
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

      {/* Reux Snippet Transparency Layer */}
      <div className="pt-6 border-t border-white/[0.06]">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white tracking-wide">
            Model Transparency Layer
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-3xl">
            The simulation model is written in Reux. The UI is standard TypeScript and React, but the panel below shows the compiled Reux logic the backend engine used to forecast outcomes and produce its recommendation.
          </p>
        </div>
        <ReuxSnippetPanel
          snippet={recommended?.reuxSnippet || baseline.reuxSnippet}
          defaultOpen={false}
        />
      </div>
    </div>
  );
}
