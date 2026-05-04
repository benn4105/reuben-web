"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import MetricCard from "@/components/simulator/MetricCard";
import SimulationCard from "@/components/simulator/SimulationCard";
import ReuxModelCatalog from "@/components/simulator/ReuxModelCatalog";
import PilotRequestPanel from "@/components/simulator/PilotRequestPanel";
import { EmptyState } from "@/components/simulator/EmptyState";
import { LoadingCards, LoadingMetrics } from "@/components/simulator/LoadingState";
import { SimulatorOnboarding } from "@/components/simulator/SimulatorOnboarding";
import { listSimulations, deleteSimulation, renameSimulation, listSavedRuns } from "@/lib/simulation/mock-service";
import type { SimulationSummary, SavedRunSummary } from "@/lib/simulation/types";
import { PlusCircle, Clock, ArrowRight, ShieldCheck, Share2, TimerReset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function SimulatorDashboard() {
  const [simulations, setSimulations] = useState<SimulationSummary[]>([]);
  const [savedRuns, setSavedRuns] = useState<SavedRunSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [simResponse, runsResponse] = await Promise.all([
        listSimulations(),
        listSavedRuns().catch(() => ({ runs: [] as SavedRunSummary[] })),
      ]);
      setSimulations(simResponse.simulations);
      setSavedRuns(runsResponse.runs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load simulations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteSimulation(id);
      setSimulations((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete simulation");
    }
  }

  async function handleRename(id: string, newName: string) {
    try {
      await renameSimulation(id, newName);
      setSimulations((prev) => 
        prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rename simulation");
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
            Test operational decisions like staffing, pricing, capacity, or process optimization before committing to them. Reux models the assumptions, forecasts margin, and returns a saved recommendation your team can revisit.
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
            <button type="button" onClick={() => document.getElementById('pilot-cta')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm font-medium h-9 px-3 rounded-md transition-colors">
              Bring one spreadsheet decision
            </button>
            <Button asChild variant="ghost" className="gap-2 text-gray-400 hover:text-white hidden sm:flex">
              <Link href="/projects/reux/roadmap">
                Roadmap
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

          {/* Trust Signals */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 pt-4 border-t border-white/[0.04]">
            {[
              "No account required",
              "Public demo backend",
              "Scenario data is for demo use only",
              "Powered by Reux prototype",
            ].map((signal) => (
              <span key={signal} className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
                <span className="w-1 h-1 rounded-full bg-gray-600" />
                {signal}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <ShieldCheck className="mb-3 h-5 w-5 text-emerald-400" />
          <h2 className="text-sm font-semibold text-white">Safe public sandbox</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            No login, admin token, or customer data is required. Templates use sample assumptions you can edit freely.
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <TimerReset className="mb-3 h-5 w-5 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white">Fast demo path</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Load a guided demo, run the simulation, and review the recommendation in under two minutes.
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <Share2 className="mb-3 h-5 w-5 text-violet-400" />
          <h2 className="text-sm font-semibold text-white">Temporary share links</h2>
          <p className="mt-1 text-xs leading-relaxed text-gray-500">
            Results can be shared for review, then expire automatically so the public demo stays clean.
          </p>
        </div>
      </section>

      <div id="pilot-cta" className="scroll-mt-8">
        <PilotRequestPanel />
      </div>

      <ReuxModelCatalog />

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

      {/* Recent Runs (server-persisted, shareable) */}
      {!loading && savedRuns.length > 0 && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Recent Runs
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Server-saved runs from this session. Shareable links — these expire automatically.
              </p>
            </div>
            <span className="text-xs text-gray-500 bg-white/[0.05] px-2 py-1 rounded-md">
              {savedRuns.length} run{savedRuns.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {savedRuns.map(run => (
              <RecentRunCard key={run.id} run={run} />
            ))}
          </div>
        </div>
      )}

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
            <span className="text-xs text-gray-500 bg-white/[0.05] px-2 py-1 rounded-md">
              {simulations.length} simulation{simulations.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <LoadingCards rows={3} />
        ) : error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <p className="text-sm text-rose-400 mb-2">{error}</p>
            <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">The Reux demo backend may be temporarily offline. Your simulations will appear once the connection is restored.</p>
            <Button
              onClick={loadData}
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
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 border-none hover:shadow-[0_0_20px_rgba(0,200,255,0.25)]">
                  <Link href="/simulator/new">
                    <PlusCircle size={16} />
                    Create First Simulation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2 border-white/[0.08] text-gray-300 hover:text-white">
                  <Link href="/simulator/new?preset=optimization">
                    Load Guided Demo
                  </Link>
                </Button>
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {simulations.map(sim => (
              <SimulationCard key={sim.id} simulation={sim} onDelete={handleDelete} onRename={handleRename} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Recent Run Card ─────────────────────────────────────────────────────────

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
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function expiryLabel(expiresAt: string): { text: string; isExpired: boolean } {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffMs = expiry.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { text: "Expired", isExpired: true };
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) return { text: `Expires in ${diffMins}m`, isExpired: false };
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return { text: `Expires in ${diffHours}h`, isExpired: false };
  const diffDays = Math.floor(diffHours / 24);
  return { text: `Expires in ${diffDays}d`, isExpired: false };
}

function RecentRunCard({ run }: { run: SavedRunSummary }) {
  const expiry = run.expiresAt ? expiryLabel(run.expiresAt) : null;

  return (
    <Link href={`/simulator/${run.id}`}>
      <Card
        className={cn(
          "border-none ring-white/[0.06] bg-card/50 hover:ring-cyan-500/20 hover:bg-card/80 transition-all duration-200 cursor-pointer group",
          expiry?.isExpired && "opacity-50"
        )}
      >
        <CardHeader>
          <div className="flex items-center gap-2 pr-8 min-w-0 flex-1">
            <div className={cn(
              "w-2 h-2 rounded-full shrink-0",
              expiry?.isExpired ? "bg-gray-500" : "bg-cyan-500"
            )} />
            <CardTitle className="text-sm font-semibold text-foreground truncate">
              {run.name}
            </CardTitle>
          </div>
          <CardAction className="flex items-center gap-1">
            <ArrowRight
              size={16}
              className="text-muted-foreground/30 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all"
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
                {formatCurrency(run.bestMargin)}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Risk Range
              </div>
              <div className="text-sm font-semibold font-mono text-foreground/70 tabular-nums">
                {run.riskRange[0]}–{run.riskRange[1]}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                Scenarios
              </div>
              <div className="text-sm font-semibold text-foreground/70">
                {run.scenarioCount}
              </div>
            </div>
          </div>
        </CardContent>

        <div className="bg-transparent border-none p-0 px-4 pb-3">
          <div className="flex items-center gap-3 text-muted-foreground/60">
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span className="text-[11px]">{timeAgo(run.createdAt)}</span>
            </div>
            {expiry && (
              <span className={cn(
                "text-[10px]",
                expiry.isExpired ? "text-rose-400/70" : "text-amber-500/70"
              )}>
                {expiry.text}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

