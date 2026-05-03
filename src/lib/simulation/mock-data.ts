// ─── Mock Data ───────────────────────────────────────────────────────────────
// Realistic seeded example data for the simulation dashboard.
// This data represents what a small manufacturing/services business might see.

import type { ScenarioInputs, Simulation } from "./types";
import { runScenario, findRecommendation } from "./engine";

// ─── Preset Scenario Templates ──────────────────────────────────────────────

export const BASELINE_INPUTS: ScenarioInputs = {
  name: "Current Operations",
  employees: 50,
  avgHourlyCost: 28,
  weeklyDemand: 1200,
  averageOrderValue: 85,
  grossMarginPct: 42,
  productivityGainPct: 0,
  overtimeReductionPct: 0,
  supplierDelayRiskPct: 15,
  errorDefectRatePct: 4,
  forecastWeeks: 12,
};

export const SCENARIO_PRESETS: ScenarioInputs[] = [
  {
    name: "Hire + Scale",
    employees: 55,
    avgHourlyCost: 28,
    weeklyDemand: 1200,
    averageOrderValue: 85,
    grossMarginPct: 42,
    productivityGainPct: 0,
    overtimeReductionPct: 5,
    supplierDelayRiskPct: 15,
    errorDefectRatePct: 4,
    forecastWeeks: 12,
  },
  {
    name: "Process Improvement",
    employees: 50,
    avgHourlyCost: 28,
    weeklyDemand: 1200,
    averageOrderValue: 85,
    grossMarginPct: 42,
    productivityGainPct: 8,
    overtimeReductionPct: 10,
    supplierDelayRiskPct: 12,
    errorDefectRatePct: 2.5,
    forecastWeeks: 12,
  },
  {
    name: "Demand Surge",
    employees: 50,
    avgHourlyCost: 28,
    weeklyDemand: 1500,
    averageOrderValue: 85,
    grossMarginPct: 42,
    productivityGainPct: 0,
    overtimeReductionPct: 0,
    supplierDelayRiskPct: 20,
    errorDefectRatePct: 5,
    forecastWeeks: 12,
  },
];

// ─── Generate Seeded Simulations ────────────────────────────────────────────

function buildSimulation(
  id: string,
  name: string,
  baselineInputs: ScenarioInputs,
  scenarioInputsList: ScenarioInputs[],
  daysAgo: number
): Simulation {
  const baseline = runScenario(baselineInputs);
  const scenarios = scenarioInputsList.map(s => runScenario(s));

  const { recommendedId, reason, divergenceWeek } = findRecommendation(baseline, scenarios);

  const now = new Date();
  const created = new Date(now.getTime() - daysAgo * 86400000);

  return {
    id,
    name,
    createdAt: created.toISOString(),
    updatedAt: created.toISOString(),
    status: "completed",
    baselineInputs,
    scenarios: [baseline, ...scenarios],
    comparison: {
      baseline,
      scenarios,
      deltas: Object.fromEntries(
        scenarios.map(s => [
          s.id,
          [
            {
              label: "Operating Cost",
              baseline: baseline.summary.operatingCost,
              scenario: s.summary.operatingCost,
              delta: s.summary.operatingCost - baseline.summary.operatingCost,
              deltaPct: baseline.summary.operatingCost > 0
                ? ((s.summary.operatingCost - baseline.summary.operatingCost) / baseline.summary.operatingCost) * 100
                : 0,
              direction: s.summary.operatingCost <= baseline.summary.operatingCost ? "positive" : "negative" as const,
            },
            {
              label: "Productivity",
              baseline: baseline.summary.productivity,
              scenario: s.summary.productivity,
              delta: s.summary.productivity - baseline.summary.productivity,
              deltaPct: baseline.summary.productivity > 0
                ? ((s.summary.productivity - baseline.summary.productivity) / baseline.summary.productivity) * 100
                : 0,
              direction: s.summary.productivity >= baseline.summary.productivity ? "positive" : "negative" as const,
            },
            {
              label: "Margin",
              baseline: baseline.summary.margin,
              scenario: s.summary.margin,
              delta: s.summary.margin - baseline.summary.margin,
              deltaPct: baseline.summary.margin > 0
                ? ((s.summary.margin - baseline.summary.margin) / baseline.summary.margin) * 100
                : 0,
              direction: s.summary.margin >= baseline.summary.margin ? "positive" : "negative" as const,
            },
            {
              label: "Risk Score",
              baseline: baseline.summary.riskScore,
              scenario: s.summary.riskScore,
              delta: s.summary.riskScore - baseline.summary.riskScore,
              deltaPct: baseline.summary.riskScore > 0
                ? ((s.summary.riskScore - baseline.summary.riskScore) / baseline.summary.riskScore) * 100
                : 0,
              direction: s.summary.riskScore <= baseline.summary.riskScore ? "positive" : "negative" as const,
            },
          ],
        ])
      ),
      recommendedId,
      recommendationReason: reason,
      firstDivergenceWeek: divergenceWeek,
    },
  };
}

export const MOCK_SIMULATIONS: Simulation[] = [
  buildSimulation(
    "sim_001",
    "Q2 Workforce Planning",
    BASELINE_INPUTS,
    [SCENARIO_PRESETS[0], SCENARIO_PRESETS[1]],
    3
  ),
  buildSimulation(
    "sim_002",
    "Demand Surge Analysis",
    BASELINE_INPUTS,
    [SCENARIO_PRESETS[2]],
    7
  ),
  buildSimulation(
    "sim_003",
    "Process Optimization Study",
    { ...BASELINE_INPUTS, employees: 45 },
    [SCENARIO_PRESETS[1]],
    14
  ),
];

export const DEFAULT_SCENARIO_INPUTS: ScenarioInputs = {
  name: "New Scenario",
  employees: 50,
  avgHourlyCost: 28,
  weeklyDemand: 1200,
  averageOrderValue: 85,
  grossMarginPct: 42,
  productivityGainPct: 0,
  overtimeReductionPct: 0,
  supplierDelayRiskPct: 10,
  errorDefectRatePct: 3,
  forecastWeeks: 12,
};
