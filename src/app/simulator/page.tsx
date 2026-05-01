"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MetricCard from "@/components/simulator/MetricCard";
import SimulationCard from "@/components/simulator/SimulationCard";
import { EmptyState } from "@/components/simulator/EmptyState";
import { LoadingCards, LoadingMetrics } from "@/components/simulator/LoadingState";
import { SimulatorOnboarding } from "@/components/simulator/SimulatorOnboarding";
import { listSimulations } from "@/lib/simulation/api-client";
import type { SimulationSummary } from "@/lib/simulation/types";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SimulatorDashboard() {
  const [simulations, setSimulations] = useState<SimulationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSimulations();
  }, []);

  async function loadSimulations() {
    try {
      setLoading(true);
      setError(null);
      const response = await listSimulations();
      setSimulations(response.simulations);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load simulations");
    } finally {
      setLoading(false);
    }
  }

  // Aggregate metrics from all simulations
  const aggregateMetrics = simulations.length > 0
    ? {
        bestMargin: Math.max(...simulations.map(s => s.bestMargin)),
        avgRisk: Math.round(
          simulations.reduce((sum, s) => sum + (s.riskRange[0] + s.riskRange[1]) / 2, 0) / simulations.length * 10
        ) / 10,
        totalScenarios: simulations.reduce((sum, s) => sum + s.scenarioCount, 0),
        completedSims: simulations.filter(s => s.status === "completed").length,
        lowestRisk: Math.min(...simulations.flatMap(s => s.riskRange)),
      }
    : null;

  return (
    <div className="space-y-6">
      <SimulatorOnboarding />
      {/* Page Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Simulation Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Model operational decisions before making them.
          </p>
        </div>
      </div>

      {/* Aggregate Metrics */}
      {loading ? (
        <LoadingMetrics />
      ) : aggregateMetrics ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <MetricCard
            label="Best Weekly Margin"
            value={aggregateMetrics.bestMargin}
            format="currency"
            icon="margin"
          />
          <MetricCard
            label="Average Risk"
            value={aggregateMetrics.avgRisk}
            format="number"
            icon="risk"
          />
          <MetricCard
            label="Total Scenarios"
            value={aggregateMetrics.totalScenarios}
            format="number"
            icon="productivity"
          />
          <MetricCard
            label="Completed"
            value={aggregateMetrics.completedSims}
            format="number"
            icon="workforce"
          />
          <MetricCard
            label="Lowest Risk"
            value={aggregateMetrics.lowestRisk}
            format="number"
            icon="risk"
          />
        </div>
      ) : null}

      {/* Simulations List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Saved Simulations
          </h2>
          {simulations.length > 0 && (
            <span className="text-xs text-gray-600">
              {simulations.length} simulation{simulations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <LoadingCards rows={3} />
        ) : error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <p className="text-sm text-rose-400 mb-3">{error}</p>
            <Button
              onClick={loadSimulations}
              variant="ghost"
              size="sm"
            >
              Retry
            </Button>
          </div>
        ) : simulations.length === 0 ? (
          <EmptyState
            title="Ready to forecast your first decision?"
            description="The Business Simulator uses Reux to test operational assumptions—like hiring or process optimization—and predicts the safest path forward."
            action={
              <Button asChild className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 border-none hover:shadow-[0_0_20px_rgba(0,200,255,0.25)]">
                <Link href="/simulator/new">
                  <PlusCircle size={16} />
                  Create First Simulation
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {simulations.map(sim => (
              <SimulationCard key={sim.id} simulation={sim} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
