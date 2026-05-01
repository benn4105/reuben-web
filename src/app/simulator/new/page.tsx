"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ScenarioInputPanel from "@/components/simulator/ScenarioInputPanel";
import MetricCard from "@/components/simulator/MetricCard";
import ReuxSnippetPanel from "@/components/simulator/ReuxSnippetPanel";
import { calculateMetrics, generateReuxSnippet } from "@/lib/simulation/engine";
import { runSimulation } from "@/lib/simulation/mock-service";
import { DEFAULT_SCENARIO_INPUTS, BASELINE_INPUTS } from "@/lib/simulation/mock-data";
import type { ScenarioInputs, MetricSnapshot } from "@/lib/simulation/types";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function NewSimulationPage() {
  const router = useRouter();
  const [simulationName, setSimulationName] = useState("New Simulation");
  const [baseline, setBaseline] = useState<ScenarioInputs>({
    ...BASELINE_INPUTS,
    name: "Current Operations",
  });
  const [scenarios, setScenarios] = useState<ScenarioInputs[]>([
    { ...DEFAULT_SCENARIO_INPUTS, name: "Scenario A" },
  ]);
  const [activeTab, setActiveTab] = useState<"baseline" | number>("baseline");
  const [isRunning, setIsRunning] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<MetricSnapshot>(() =>
    calculateMetrics(baseline)
  );
  const [liveSnippet, setLiveSnippet] = useState(() =>
    generateReuxSnippet(baseline)
  );

  const activeInputs = activeTab === "baseline" ? baseline : scenarios[activeTab];

  const handleInputChange = useCallback(
    (values: ScenarioInputs) => {
      if (activeTab === "baseline") {
        setBaseline(values);
      } else {
        setScenarios(prev => {
          const next = [...prev];
          next[activeTab] = values;
          return next;
        });
      }
      setLiveMetrics(calculateMetrics(values));
      setLiveSnippet(generateReuxSnippet(values));
    },
    [activeTab]
  );

  const addScenario = () => {
    const idx = scenarios.length;
    setScenarios(prev => [
      ...prev,
      {
        ...DEFAULT_SCENARIO_INPUTS,
        name: `Scenario ${String.fromCharCode(65 + idx)}`,
      },
    ]);
    setActiveTab(idx);
  };

  const removeScenario = (idx: number) => {
    if (scenarios.length <= 1) return;
    setScenarios(prev => prev.filter((_, i) => i !== idx));
    setActiveTab("baseline");
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      const response = await runSimulation({
        name: simulationName,
        baseline,
        scenarios,
      });
      router.push(`/simulator/${response.simulation.id}`);
    } catch (err) {
      console.error("Simulation failed:", err);
      setIsRunning(false);
    }
  };

  const loadDemoData = () => {
    setSimulationName("Q3 Expansion Strategy");
    setBaseline({
      name: "Current Operations",
      employees: 50,
      avgHourlyCost: 28,
      weeklyDemand: 1200,
      productivityGainPct: 0,
      overtimeReductionPct: 0,
      supplierDelayRiskPct: 15,
      errorDefectRatePct: 4,
      forecastWeeks: 12,
    });
    setScenarios([
      {
        name: "Aggressive Hiring",
        employees: 65,
        avgHourlyCost: 28,
        weeklyDemand: 1500,
        productivityGainPct: 5,
        overtimeReductionPct: 20,
        supplierDelayRiskPct: 15,
        errorDefectRatePct: 5,
        forecastWeeks: 12,
      },
      {
        name: "Process Optimization",
        employees: 50,
        avgHourlyCost: 28,
        weeklyDemand: 1350,
        productivityGainPct: 18,
        overtimeReductionPct: 50,
        supplierDelayRiskPct: 10,
        errorDefectRatePct: 2,
        forecastWeeks: 12,
      }
    ]);
    setActiveTab("baseline");
    setLiveMetrics(calculateMetrics({
      name: "Current Operations",
      employees: 50,
      avgHourlyCost: 28,
      weeklyDemand: 1200,
      productivityGainPct: 0,
      overtimeReductionPct: 0,
      supplierDelayRiskPct: 15,
      errorDefectRatePct: 4,
      forecastWeeks: 12,
    }));
    setLiveSnippet(generateReuxSnippet({
      name: "Current Operations",
      employees: 50,
      avgHourlyCost: 28,
      weeklyDemand: 1200,
      productivityGainPct: 0,
      overtimeReductionPct: 0,
      supplierDelayRiskPct: 15,
      errorDefectRatePct: 4,
      forecastWeeks: 12,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Build Simulation
        </h1>
        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
          Set up your current operations as the <strong>Baseline</strong>, then create alternative <strong>Scenarios</strong> such as Aggressive Hiring or Lean Ops by adjusting the assumptions. The Reux engine will compare them and recommend the safest path.
        </p>
      </div>

      {/* Simulation Name & Demo Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
        <div className="space-y-2 flex-1 max-w-md">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Simulation Name
          </label>
          <input
            type="text"
            value={simulationName}
            onChange={e => setSimulationName(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white",
              "focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20",
              "transition-colors duration-150 placeholder:text-gray-600"
            )}
            placeholder="e.g. Q2 Workforce Planning"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={loadDemoData}
          className="gap-2 shrink-0 border-dashed"
        >
          <Wand2 size={16} className="text-cyan-400" />
          Load Demo Data
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input Panel */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-4">
          {/* Scenario Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => {
                setActiveTab("baseline");
                setLiveMetrics(calculateMetrics(baseline));
                setLiveSnippet(generateReuxSnippet(baseline));
              }}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                activeTab === "baseline"
                  ? "bg-white/[0.08] text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              Baseline
            </button>
            {scenarios.map((s, i) => (
              <div key={i} className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab(i);
                    setLiveMetrics(calculateMetrics(scenarios[i]));
                    setLiveSnippet(generateReuxSnippet(scenarios[i]));
                  }}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                    activeTab === i
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                      : "text-gray-500 hover:text-gray-300"
                  )}
                >
                  {s.name || `Scenario ${String.fromCharCode(65 + i)}`}
                </button>
                {scenarios.length > 1 && (
                  <button
                    onClick={() => removeScenario(i)}
                    className="p-1 text-gray-700 hover:text-rose-400 transition-colors"
                    title="Remove scenario"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addScenario}
              className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-600 hover:text-cyan-400 transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* Input Form */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
            <ScenarioInputPanel
              key={activeTab === "baseline" ? "baseline" : `scenario-${activeTab}`}
              initialValues={activeInputs}
              onChange={handleInputChange}
              onRun={handleRun}
              isRunning={isRunning}
            />
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Live Metrics Preview */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Live Preview — {activeTab === "baseline" ? "Baseline" : activeInputs.name}
            </h3>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
              <MetricCard
                label="Weekly Revenue"
                value={liveMetrics.revenue}
                format="currency"
                icon="revenue"
              />
              <MetricCard
                label="Operating Cost"
                value={liveMetrics.operatingCost}
                format="currency"
                icon="cost"
              />
              <MetricCard
                label="Weekly Margin"
                value={liveMetrics.margin}
                format="currency"
                icon="margin"
              />
              <MetricCard
                label="Margin %"
                value={liveMetrics.marginPct}
                format="percent"
                icon="margin"
              />
              <MetricCard
                label="Productivity"
                value={`${liveMetrics.productivity} u/e/w`}
                icon="productivity"
              />
              <MetricCard
                label="Workforce Load"
                value={liveMetrics.workforceLoad}
                format="percent"
                icon="workforce"
              />
              <MetricCard
                label="Risk Score"
                value={`${liveMetrics.riskScore}/100`}
                icon="risk"
              />
              <MetricCard
                label="Overtime Cost"
                value={liveMetrics.overtimeCost}
                format="currency"
                icon="cost"
              />
              <MetricCard
                label="Defect Cost"
                value={liveMetrics.defectCost}
                format="currency"
                icon="cost"
              />
            </div>
          </div>

          {/* Reux Snippet */}
          <ReuxSnippetPanel snippet={liveSnippet} defaultOpen={true} />
        </div>
      </div>
    </div>
  );
}
