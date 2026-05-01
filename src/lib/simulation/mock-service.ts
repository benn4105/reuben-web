// ─── Mock Simulation Service ─────────────────────────────────────────────────
// Implements the same request/response contract as the future Reux backend API.
// Replace this module with real API calls when the backend is ready.

import type {
  RunSimulationRequest,
  RunSimulationResponse,
  ListSimulationsResponse,
  GetSimulationResponse,
  CompareRequest,
  CompareResponse,
  SimulationSummary,
  Simulation,
} from "./types";
import { runScenario, findRecommendation } from "./engine";
import { MOCK_SIMULATIONS } from "./mock-data";

// In-memory store
let simulations: Simulation[] = [...MOCK_SIMULATIONS];

// Simulate network latency
function delay(ms: number = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Typed direction helper (avoids `as const` on ternary which TS disallows)
function dir(positive: boolean): "positive" | "negative" {
  return positive ? "positive" : "negative";
}

function buildDeltas(baseline: ReturnType<typeof runScenario>, scenario: ReturnType<typeof runScenario>) {
  return [
    {
      label: "Operating Cost",
      baseline: baseline.summary.operatingCost,
      scenario: scenario.summary.operatingCost,
      delta: scenario.summary.operatingCost - baseline.summary.operatingCost,
      deltaPct: baseline.summary.operatingCost > 0
        ? ((scenario.summary.operatingCost - baseline.summary.operatingCost) / baseline.summary.operatingCost) * 100
        : 0,
      direction: dir(scenario.summary.operatingCost <= baseline.summary.operatingCost),
    },
    {
      label: "Productivity",
      baseline: baseline.summary.productivity,
      scenario: scenario.summary.productivity,
      delta: scenario.summary.productivity - baseline.summary.productivity,
      deltaPct: baseline.summary.productivity > 0
        ? ((scenario.summary.productivity - baseline.summary.productivity) / baseline.summary.productivity) * 100
        : 0,
      direction: dir(scenario.summary.productivity >= baseline.summary.productivity),
    },
    {
      label: "Margin",
      baseline: baseline.summary.margin,
      scenario: scenario.summary.margin,
      delta: scenario.summary.margin - baseline.summary.margin,
      deltaPct: baseline.summary.margin > 0
        ? ((scenario.summary.margin - baseline.summary.margin) / baseline.summary.margin) * 100
        : 0,
      direction: dir(scenario.summary.margin >= baseline.summary.margin),
    },
    {
      label: "Risk Score",
      baseline: baseline.summary.riskScore,
      scenario: scenario.summary.riskScore,
      delta: scenario.summary.riskScore - baseline.summary.riskScore,
      deltaPct: baseline.summary.riskScore > 0
        ? ((scenario.summary.riskScore - baseline.summary.riskScore) / baseline.summary.riskScore) * 100
        : 0,
      direction: dir(scenario.summary.riskScore <= baseline.summary.riskScore),
    },
  ];
}

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * POST /api/simulations/run
 * Runs a new simulation with baseline + scenarios.
 */
export async function runSimulation(request: RunSimulationRequest): Promise<RunSimulationResponse> {
  await delay(800);

  const baseline = runScenario(request.baseline);
  const scenarios = request.scenarios.map(s => runScenario(s));
  const { recommendedId, reason, divergenceWeek } = findRecommendation(baseline, scenarios);

  const simulation: Simulation = {
    id: `sim_${Date.now()}`,
    name: request.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: "completed",
    baselineInputs: request.baseline,
    scenarios: [baseline, ...scenarios],
    comparison: {
      baseline,
      scenarios,
      deltas: Object.fromEntries(
        scenarios.map(s => [s.id, buildDeltas(baseline, s)])
      ),
      recommendedId,
      recommendationReason: reason,
      firstDivergenceWeek: divergenceWeek,
    },
  };

  simulations = [simulation, ...simulations];
  return { simulation };
}

/**
 * GET /api/simulations
 * Returns all saved simulations as summaries.
 */
export async function listSimulations(): Promise<ListSimulationsResponse> {
  await delay(300);

  const summaries: SimulationSummary[] = simulations.map(sim => {
    const allScenarios = sim.scenarios;
    const margins = allScenarios.map(s => s.summary.margin);
    const risks = allScenarios.map(s => s.summary.riskScore);
    const bestMarginIdx = margins.indexOf(Math.max(...margins));

    return {
      id: sim.id,
      name: sim.name,
      createdAt: sim.createdAt,
      updatedAt: sim.updatedAt,
      status: sim.status,
      scenarioCount: allScenarios.length,
      bestMargin: Math.max(...margins),
      bestMarginScenario: allScenarios[bestMarginIdx]?.inputs.name ?? "Baseline",
      riskRange: [Math.min(...risks), Math.max(...risks)],
    };
  });

  return { simulations: summaries };
}

/**
 * GET /api/simulations/:id
 * Returns full simulation detail.
 */
export async function getSimulation(id: string): Promise<GetSimulationResponse> {
  await delay(400);

  const simulation = simulations.find(s => s.id === id);
  if (!simulation) {
    throw new Error(`Simulation not found: ${id}`);
  }

  return { simulation };
}

/**
 * POST /api/scenarios/compare
 * Compares specific scenarios within a simulation.
 */
export async function compareScenarios(request: CompareRequest): Promise<CompareResponse> {
  await delay(500);

  const simulation = simulations.find(s =>
    s.scenarios.some(sc => sc.id === request.baselineId)
  );

  if (!simulation) {
    throw new Error("Simulation not found for the given baseline.");
  }

  const baseline = simulation.scenarios.find(s => s.id === request.baselineId);
  if (!baseline) {
    throw new Error("Baseline scenario not found.");
  }

  const scenarios = simulation.scenarios.filter(s =>
    request.scenarioIds.includes(s.id)
  );

  const { recommendedId, reason, divergenceWeek } = findRecommendation(baseline, scenarios);

  return {
    comparison: {
      baseline,
      scenarios,
      deltas: Object.fromEntries(
        scenarios.map(s => [s.id, buildDeltas(baseline, s)])
      ),
      recommendedId,
      recommendationReason: reason,
      firstDivergenceWeek: divergenceWeek,
    },
  };
}
