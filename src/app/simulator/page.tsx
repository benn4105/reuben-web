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
      {/* Page Header / Demo Intro */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0A0C] p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-violet-500/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Live Demo
          </div>
          
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight mb-3">
            Business Simulator
          </h1>
          <p className="text-base text-gray-400 mb-6 leading-relaxed">
            Test operational decisions—like workforce expansion or process optimization—before committing to them. 
            This simulator uses <strong className="text-white">Reux</strong> as the backend engine to model assumptions, forecast margins, and surface risk across scenarios.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-8">
            <Button asChild className="gap-2 bg-white text-black hover:bg-gray-200">
              <Link href="/simulator/new">
                Start Simulator <PlusCircle size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 bg-transparent border-white/[0.1] text-white hover:bg-white/[0.05]">
              <Link href="/simulator/new?preset=optimization">
                Load Guided Demo
              </Link>
            </Button>
            <Button asChild variant="ghost" className="gap-2 text-gray-400 hover:text-white">
              <Link href="/docs">
                See Documentation
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">1. Model Assumptions</h4>
              <p className="text-xs text-gray-500">Define your current baseline: employees, demand, and costs.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">2. Build Scenarios</h4>
              <p className="text-xs text-gray-500">Propose changes like hiring spikes or efficiency gains.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">3. Evaluate Results</h4>
              <p className="text-xs text-gray-500">The Reux engine evaluates each scenario to surface the strongest margin with the lowest risk.</p>
            </div>
          </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Saved Simulation History
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Previous scenarios modeled and evaluated by Reux.
            </p>
          </div>
          {simulations.length > 0 && (
            <span className="text-xs text-gray-600 bg-white/[0.05] px-2 py-1 rounded-md">
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
