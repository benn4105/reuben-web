"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScenarioInputPanel from "@/components/simulator/ScenarioInputPanel";
import MetricCard from "@/components/simulator/MetricCard";
import ReuxSnippetPanel from "@/components/simulator/ReuxSnippetPanel";
import { calculateMetrics, generateReuxSnippet } from "@/lib/simulation/engine";
import { runSimulation, getOperationsDecision } from "@/lib/simulation/mock-service";
import type { ScenarioInputs, MetricSnapshot } from "@/lib/simulation/types";
import { Plus, Trash2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type PresetKey = "expansion" | "optimization" | "surge";

interface GuidedPreset {
  name: string;
  baseline: ScenarioInputs;
  scenarios: ScenarioInputs[];
}

function guidedPresetFromSearch(): PresetKey | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const preset = params.get("preset");
  if (preset === "expansion" || preset === "optimization" || preset === "surge") return preset;
  return params.get("demo") === "true" ? "optimization" : null;
}

function buildGuidedPreset(presetKey: PresetKey): GuidedPreset {
  const baseline = {
    name: "Current Operations",
    employees: 50,
    avgHourlyCost: 28,
    weeklyDemand: 1200,
    productivityGainPct: 0,
    overtimeReductionPct: 0,
    supplierDelayRiskPct: 15,
    errorDefectRatePct: 4,
    forecastWeeks: 12,
  };

  if (presetKey === "expansion") {
    return {
      name: "Workforce Expansion",
      baseline,
      scenarios: [
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
      ],
    };
  }

  if (presetKey === "optimization") {
    return {
      name: "Process Optimization",
      baseline,
      scenarios: [
        {
          name: "Lean Ops",
          employees: 50,
          avgHourlyCost: 28,
          weeklyDemand: 1350,
          productivityGainPct: 18,
          overtimeReductionPct: 50,
          supplierDelayRiskPct: 10,
          errorDefectRatePct: 2,
          forecastWeeks: 12,
        },
      ],
    };
  }

  return {
    name: "Demand Surge",
    baseline,
    scenarios: [
      {
        name: "Overtime Max",
        employees: 50,
        avgHourlyCost: 35,
        weeklyDemand: 1800,
        productivityGainPct: 0,
        overtimeReductionPct: 0,
        supplierDelayRiskPct: 25,
        errorDefectRatePct: 8,
        forecastWeeks: 12,
      },
    ],
  };
}

export default function NewSimulationPage() {
  const router = useRouter();
  const [simulationName, setSimulationName] = useState("New Simulation");
  const [baseline, setBaseline] = useState<ScenarioInputs | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioInputs[]>([]);
  const [activeTab, setActiveTab] = useState<"baseline" | number>("baseline");
  const [isRunning, setIsRunning] = useState(false);
  const [isLoadingDefaults, setIsLoadingDefaults] = useState(true);
  const [liveMetrics, setLiveMetrics] = useState<MetricSnapshot | null>(null);
  const [liveSnippet, setLiveSnippet] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDefaults() {
      try {
        setIsLoadingDefaults(true);
        setError(null);
        const { baseline: defaultBaseline, scenarios: defaultScenarios } = await getOperationsDecision();

        const guidedPreset = guidedPresetFromSearch();
        if (guidedPreset) {
          const preset = buildGuidedPreset(guidedPreset);
          setSimulationName(preset.name);
          setBaseline(preset.baseline);
          setScenarios(preset.scenarios);
          setLiveMetrics(calculateMetrics(preset.baseline));
          setLiveSnippet(generateReuxSnippet(preset.baseline));
        } else {
          setBaseline(defaultBaseline);
          if (defaultScenarios && defaultScenarios.length > 0) {
            setScenarios([{ ...defaultScenarios[0], name: "Scenario A" }]);
          } else {
            setScenarios([{ ...defaultBaseline, name: "Scenario A" }]);
          }
          setLiveMetrics(calculateMetrics(defaultBaseline));
          setLiveSnippet(generateReuxSnippet(defaultBaseline));
        }
      } catch (err) {
        console.error("Failed to load defaults", err);
        setError("Failed to load the baseline model from the engine. The Reux backend might be unreachable.");
      } finally {
        setIsLoadingDefaults(false);
      }
    }
    fetchDefaults();
  }, []);

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
    if (!baseline) return;
    const idx = scenarios.length;
    setScenarios(prev => [
      ...prev,
      {
        ...baseline,
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
    if (!baseline) return;
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

  const loadPreset = useCallback((presetKey: PresetKey) => {
    const preset = buildGuidedPreset(presetKey);
    setSimulationName(preset.name);
    setBaseline(preset.baseline);
    setScenarios(preset.scenarios);
    setActiveTab("baseline");
    setLiveMetrics(calculateMetrics(preset.baseline));
    setLiveSnippet(generateReuxSnippet(preset.baseline));
  }, []);

  const handleTabChange = (tab: "baseline" | number) => {
    setActiveTab(tab);
    const target = tab === "baseline" ? baseline : scenarios[tab];
    if (target) {
      setLiveMetrics(calculateMetrics(target));
      setLiveSnippet(generateReuxSnippet(target));
    }
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

      {/* Presets and Simulation Name */}
      <div className="flex flex-col gap-6">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Guided Demo Presets
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => loadPreset("expansion")}
              className="text-left p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={16} className="text-cyan-400" />
                <h3 className="text-sm font-medium text-white">Workforce Expansion</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">Adds 15 employees to meet higher demand, but increases cost and defect rates temporarily.</p>
            </button>
            <button
              onClick={() => loadPreset("optimization")}
              className="text-left p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={16} className="text-violet-400" />
                <h3 className="text-sm font-medium text-white">Process Optimization</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">Focuses on productivity gains (+18%) to handle more demand without hiring new staff.</p>
            </button>
            <button
              onClick={() => loadPreset("surge")}
              className="text-left p-4 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-rose-500/30 transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={16} className="text-rose-400" />
                <h3 className="text-sm font-medium text-white">Demand Surge</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">Models a 50% demand spike with higher labor cost, supplier risk, and defect pressure.</p>
            </button>
          </div>
        </div>

        <div className="space-y-2 max-w-md">
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
      </div>

      {isLoadingDefaults ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            <p className="text-sm font-medium">Loading default assumptions...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
          <div className="max-w-md space-y-4">
            <p className="text-sm text-rose-400">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
            >
              Retry Connection
            </Button>
          </div>
        </div>
      ) : !baseline || !activeInputs || !liveMetrics ? null : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Input Panel */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            {/* Scenario Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => handleTabChange("baseline")}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                  activeTab === "baseline"
                    ? "bg-white/[0.08] text-white"
                    : "text-gray-500 hover:text-gray-300"
                )}
              >
                {baseline.name || "Baseline"}
              </button>
              {scenarios.map((s, i) => (
                <div key={i} className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTabChange(i)}
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
      )}
    </div>
  );
}
