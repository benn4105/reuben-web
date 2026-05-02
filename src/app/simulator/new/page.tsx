"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ScenarioInputPanel from "@/components/simulator/ScenarioInputPanel";
import MetricCard from "@/components/simulator/MetricCard";
import ReuxSnippetPanel from "@/components/simulator/ReuxSnippetPanel";
import TemplatePicker from "@/components/simulator/TemplatePicker";
import { calculateMetrics, generateReuxSnippet } from "@/lib/simulation/engine";
import { runSimulation, getOperationsDecision } from "@/lib/simulation/mock-service";
import { SimulationApiError, type ValidationErrorIssue } from "@/lib/simulation/api-client";
import { decodeShareLink, encodeShareLink, copyToClipboard } from "@/lib/simulation/share";
import { saveDraft, loadDraft, clearDraft, formatDraftAge } from "@/lib/simulation/drafts";
import type { SimulationTemplate } from "@/lib/simulation/templates";
import type { ScenarioInputs, MetricSnapshot } from "@/lib/simulation/types";
import { Plus, Trash2, Wand2, Share2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SIMULATION_LIMITS } from "@/lib/simulation/constants";

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
  const [validationIssues, setValidationIssues] = useState<ValidationErrorIssue[] | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [showTemplates, setShowTemplates] = useState(false);
  const [restoredDraftInfo, setRestoredDraftInfo] = useState<string | null>(null);

  function loadPreset(presetKey: PresetKey) {
    const preset = buildGuidedPreset(presetKey);
    setSimulationName(preset.name);
    setBaseline(preset.baseline);
    setScenarios(preset.scenarios);
    setSelectedPreset(presetKey);
    setSelectedTemplateId(null);
    setError(null);
    setValidationIssues(null);
    setActiveTab("baseline");
    setLiveMetrics(calculateMetrics(preset.baseline));
    setLiveSnippet(generateReuxSnippet(preset.baseline));
  }

  function loadTemplate(template: SimulationTemplate) {
    setSimulationName(template.name);
    setBaseline(template.baseline);
    setScenarios(template.scenarios);
    setSelectedTemplateId(template.id);
    setSelectedPreset(null);
    setError(null);
    setValidationIssues(null);
    setActiveTab("baseline");
    setLiveMetrics(calculateMetrics(template.baseline));
    setLiveSnippet(generateReuxSnippet(template.baseline));
  }

  async function handleShare() {
    if (!baseline) return;
    const url = encodeShareLink(simulationName, baseline, scenarios);
    const ok = await copyToClipboard(url);
    if (ok) {
      setShareState("copied");
      setTimeout(() => setShareState("idle"), 2500);
    }
  }

  useEffect(() => {
    async function fetchDefaults() {
      try {
        setIsLoadingDefaults(true);
        setError(null);
        const { baseline: defaultBaseline, scenarios: defaultScenarios } = await getOperationsDecision();

        // Priority: share link > local draft > URL preset > defaults
        const sharedConfig = typeof window !== "undefined" 
          ? decodeShareLink(window.location.search) 
          : null;

        if (sharedConfig) {
          setSimulationName(sharedConfig.name);
          setBaseline(sharedConfig.baseline);
          setScenarios(sharedConfig.scenarios);
          setLiveMetrics(calculateMetrics(sharedConfig.baseline));
          setLiveSnippet(generateReuxSnippet(sharedConfig.baseline));
        } else {
          const draft = typeof window !== "undefined" ? loadDraft() : null;
          if (draft) {
            setSimulationName(draft.name);
            setBaseline(draft.baseline);
            setScenarios(draft.scenarios);
            setRestoredDraftInfo(`Restored draft from ${formatDraftAge(draft.savedAt)}`);
            setLiveMetrics(calculateMetrics(draft.baseline));
            setLiveSnippet(generateReuxSnippet(draft.baseline));
            // Auto-hide the draft restored message after 5 seconds
            setTimeout(() => setRestoredDraftInfo(null), 5000);
          } else {
            const guidedPreset = guidedPresetFromSearch();
            if (guidedPreset) {
              const preset = buildGuidedPreset(guidedPreset);
              setSimulationName(preset.name);
              setBaseline(preset.baseline);
              setScenarios(preset.scenarios);
              setSelectedPreset(guidedPreset);
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
          }
        }
      } catch (err) {
        console.error("Failed to load defaults", err);
        setError("Could not load the simulation model. The backend may be temporarily unavailable — try refreshing the page.");
      } finally {
        setIsLoadingDefaults(false);
      }
    }
    fetchDefaults();
  }, []);

  // Auto-save draft whenever configuration changes
  useEffect(() => {
    if (baseline && scenarios && typeof window !== "undefined") {
      // Small debounce to avoid thrashing localStorage on rapid typing
      const timeoutId = setTimeout(() => {
        saveDraft(simulationName, baseline, scenarios);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [simulationName, baseline, scenarios]);

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
      setSelectedPreset(null);
      setError(null);
      setValidationIssues(null);
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
    setScenarios(prev => prev.filter((_, i) => i !== idx));
    setActiveTab("baseline");
  };

  const duplicateScenario = (idx: number) => {
    if (scenarios.length >= SIMULATION_LIMITS.MAX_RUN_SCENARIOS) {
      setError(`Cannot exceed ${SIMULATION_LIMITS.MAX_RUN_SCENARIOS} scenarios.`);
      return;
    }
    const source = scenarios[idx];
    setScenarios(prev => [
      ...prev,
      {
        ...source,
        name: `${source.name} (Copy)`,
        id: undefined, // ensure ID is regenerated or empty
      },
    ]);
    setActiveTab(scenarios.length);
  };

  const handleRun = async () => {
    if (!baseline) return;

    // Frontend Validation mirroring backend limits
    const issues: ValidationErrorIssue[] = [];

    if (scenarios.length > SIMULATION_LIMITS.MAX_RUN_SCENARIOS) {
      issues.push({ path: "scenarios", message: `Cannot exceed ${SIMULATION_LIMITS.MAX_RUN_SCENARIOS} scenarios per run.` });
    }

    if (simulationName.length > SIMULATION_LIMITS.MAX_SCENARIO_NAME_LENGTH) {
      issues.push({ path: "simulation.name", message: `Simulation name must be under ${SIMULATION_LIMITS.MAX_SCENARIO_NAME_LENGTH} characters.` });
    }

    const checkScenario = (scenario: ScenarioInputs, pathPrefix: string) => {
      if (scenario.name.length > SIMULATION_LIMITS.MAX_SCENARIO_NAME_LENGTH) {
        issues.push({ path: `${pathPrefix}.name`, message: `Name must be under ${SIMULATION_LIMITS.MAX_SCENARIO_NAME_LENGTH} characters.` });
      }
      if (scenario.id && !SIMULATION_LIMITS.SCENARIO_ID_REGEX.test(scenario.id)) {
        issues.push({ path: `${pathPrefix}.id`, message: "ID must start with a letter/number and contain only letters, numbers, hyphens, and underscores." });
      }
      if (scenario.id && scenario.id.length > SIMULATION_LIMITS.MAX_SCENARIO_ID_LENGTH) {
        issues.push({ path: `${pathPrefix}.id`, message: `ID must be under ${SIMULATION_LIMITS.MAX_SCENARIO_ID_LENGTH} characters.` });
      }
      if (scenario.description && scenario.description.length > SIMULATION_LIMITS.MAX_SCENARIO_DESCRIPTION_LENGTH) {
        issues.push({ path: `${pathPrefix}.description`, message: `Description must be under ${SIMULATION_LIMITS.MAX_SCENARIO_DESCRIPTION_LENGTH} characters.` });
      }
      if (scenario.forecastWeeks > SIMULATION_LIMITS.MAX_FORECAST_PERIODS) {
        issues.push({ path: `${pathPrefix}.forecastPeriods`, message: `Cannot forecast more than ${SIMULATION_LIMITS.MAX_FORECAST_PERIODS} periods.` });
      }
    };

    checkScenario(baseline, "baseline");
    scenarios.forEach((s, idx) => checkScenario(s, `scenarios[${idx}]`));

    // Check for duplicate IDs
    const ids = new Set<string>();
    const checkDuplicateId = (scenario: ScenarioInputs, pathPrefix: string) => {
      const id = scenario.id || scenario.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (ids.has(id)) {
        issues.push({ path: `${pathPrefix}.id`, message: `Duplicate scenario ID: ${id}. Ensure names or IDs are unique.` });
      }
      ids.add(id);
    };
    checkDuplicateId(baseline, "baseline");
    scenarios.forEach((s, idx) => checkDuplicateId(s, `scenarios[${idx}]`));

    if (issues.length > 0) {
      setError("Please fix the validation errors before running the simulation.");
      setValidationIssues(issues);
      return;
    }

    try {
      setIsRunning(true);
      setError(null);
      setValidationIssues(null);
      const response = await runSimulation({
        name: simulationName,
        baseline,
        scenarios,
      });

      // Clear the draft upon successful run
      clearDraft();
      
      // Prefer the server-persisted run ID (shareable) over the local simulation ID
      const routeId = response.run?.id || response.simulation.id;
      router.push(`/simulator/${routeId}`);
    } catch (err: unknown) {
      console.error("Simulation failed:", err);
      setIsRunning(false);
      
      if (err instanceof SimulationApiError) {
        setError(err.message);
        setValidationIssues(err.issues || []);
      } else {
        const errorMsg = err instanceof Error ? err.message : "An unexpected error occurred";
        setError(errorMsg);
        setValidationIssues(null);
      }
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Build Simulation
            </h1>
            {restoredDraftInfo && (
              <span className="text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full animate-in fade-in zoom-in duration-300">
                {restoredDraftInfo}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Start by setting a <strong>Baseline</strong> that reflects your current operations, then add <strong>Scenarios</strong> to test changes. The Reux engine will evaluate each one and recommend the strongest path.
          </p>
        </div>
        {baseline && (
          <Button
            onClick={handleShare}
            variant="outline"
            size="sm"
            className="gap-2 shrink-0 border-white/[0.08] text-gray-400 hover:text-white"
          >
            {shareState === "copied" ? (
              <><Check size={14} className="text-emerald-400" /> Link Copied</>
            ) : (
              <><Share2 size={14} /> Share Config</>
            )}
          </Button>
        )}
      </div>

      {/* Presets and Simulation Name */}
      <div className="flex flex-col gap-6">
        {/* Template Picker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Start from a Template
            </label>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="text-xs text-gray-500 hover:text-cyan-400 transition-colors"
            >
              {showTemplates ? "Hide templates" : "Browse industry templates"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => loadPreset("expansion")}
              className={cn(
                "text-left p-4 rounded-xl border transition-all group",
                selectedPreset === "expansion"
                  ? "bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(0,200,255,0.15)] ring-1 ring-cyan-500/20"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/30"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={16} className="text-cyan-400" />
                <h3 className="text-sm font-medium text-white">Workforce Expansion</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">Adds 15 employees to meet higher demand, but increases cost and defect rates temporarily.</p>
              <div className="mt-3 text-[11px] font-semibold text-cyan-400/80 uppercase tracking-wider">Best for: Scaling Ops</div>
            </button>
            <button
              onClick={() => loadPreset("optimization")}
              className={cn(
                "text-left p-4 rounded-xl border transition-all group",
                selectedPreset === "optimization"
                  ? "bg-violet-500/10 border-violet-500/50 shadow-[0_0_15px_rgba(138,43,226,0.15)] ring-1 ring-violet-500/20"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-violet-500/30"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={16} className="text-violet-400" />
                <h3 className="text-sm font-medium text-white">Process Optimization</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">Focuses on productivity gains (+18%) to handle more demand without hiring new staff.</p>
              <div className="mt-3 text-[11px] font-semibold text-violet-400/80 uppercase tracking-wider">Best for: Lean Ops</div>
            </button>
            <button
              onClick={() => loadPreset("surge")}
              className={cn(
                "text-left p-4 rounded-xl border transition-all group",
                selectedPreset === "surge"
                  ? "bg-rose-500/10 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)] ring-1 ring-rose-500/20"
                  : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] hover:border-rose-500/30"
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 size={16} className="text-rose-400" />
                <h3 className="text-sm font-medium text-white">Demand Surge</h3>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">Models a 50% demand spike with higher labor cost, supplier risk, and defect pressure.</p>
              <div className="mt-3 text-[11px] font-semibold text-rose-400/80 uppercase tracking-wider">Best for: Stress Testing</div>
            </button>
          </div>

          {showTemplates && (
            <div className="pt-2 border-t border-white/[0.06]">
              <TemplatePicker
                onSelect={loadTemplate}
                selectedId={selectedTemplateId}
              />
            </div>
          )}
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
              "transition-colors duration-150 placeholder:text-gray-500"
            )}
            placeholder="e.g. Q2 Workforce Planning"
          />
          <p className="text-[10px] text-gray-500 mt-1">A short label for this run. This will appear in your results and history.</p>
        </div>
      </div>

      {isLoadingDefaults ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
            <p className="text-sm font-medium">Preparing simulation model…</p>
          </div>
        </div>
      ) : error && validationIssues === null ? (
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
            
            {/* Inline Error Panel for Validation Errors */}
            {validationIssues !== null && error && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-4">
                <h3 className="text-sm font-semibold text-amber-500 mb-2">Please fix the following issues:</h3>
                {validationIssues.length > 0 ? (
                  <ul className="space-y-2">
                    {validationIssues.map((issue, idx) => {
                      // Map common backend paths to readable labels
                      const friendlyPath = issue.path
                        .replace('$.baseline.grossMarginRate', 'Baseline Gross Margin Rate')
                        .replace('$.baseline.productivityGainRate', 'Baseline Productivity Gain')
                        .replace('$.baseline.averageHourlyCost', 'Baseline Hourly Cost')
                        .replace('$.baseline.overtimeReductionRate', 'Baseline Overtime Reduction')
                        .replace('$.baseline.', 'Baseline ')
                        .replace('$.scenarios[0].', 'Scenario A ')
                        .replace('$.scenarios[1].', 'Scenario B ')
                        .replace('$.scenarios[2].', 'Scenario C ')
                        .replace('.assumptions.forecastPeriods', ' Forecast Weeks')
                        .replace('.assumptions.', ' ');

                      return (
                        <li key={idx} className="text-xs text-amber-400/90 flex gap-2">
                          <span className="shrink-0">-</span>
                          <span>
                            <strong className="text-amber-500">{friendlyPath}:</strong> {issue.message}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-amber-400">{error}</p>
                )}
              </div>
            )}
            {/* Scenario Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
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
                <div key={i} className="flex items-center gap-1 shrink-0 group">
                  <button
                    onClick={() => handleTabChange(i)}
                    disabled={isRunning}
                    className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                    activeTab === i
                      ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                      : "text-gray-500 hover:text-gray-300",
                    isRunning && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {s.name || `Scenario ${String.fromCharCode(65 + i)}`}
                </button>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => duplicateScenario(i)}
                    disabled={isRunning}
                    className="p-1 text-gray-700 hover:text-emerald-400 transition-colors disabled:opacity-50"
                    title="Duplicate scenario"
                  >
                    <Plus size={12} className="rotate-0" />
                  </button>
                  <button
                    onClick={() => removeScenario(i)}
                    disabled={isRunning}
                    className="p-1 text-gray-700 hover:text-rose-400 transition-colors disabled:opacity-50"
                    title="Remove scenario"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            {scenarios.length === 0 && (
              <span className="text-xs text-gray-600 px-2 italic">No custom scenarios</span>
            )}
            {scenarios.length < SIMULATION_LIMITS.MAX_RUN_SCENARIOS && (
              <button
                onClick={addScenario}
                disabled={isRunning}
                className="shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs text-gray-500 hover:text-cyan-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} />
                Add
              </button>
            )}
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
            <p className="text-[10px] text-gray-500 -mt-1 mb-3">Metrics update in real time as you adjust inputs. These are local estimates — the final run uses the Reux engine for a full forecast.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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
          <div>
            <p className="text-[10px] text-gray-500 mb-2">This is the Reux source that will be compiled and evaluated on the backend when you run the simulation.</p>
            <ReuxSnippetPanel snippet={liveSnippet} defaultOpen={true} />
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
