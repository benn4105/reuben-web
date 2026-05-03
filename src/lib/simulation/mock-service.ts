import type {
  CompareRequest,
  CompareResponse,
  GetSimulationResponse,
  ListSimulationsResponse,
  ListSavedRunsResponse,
  RunSimulationRequest,
  RunSimulationResponse,
  Simulation,
  SimulationSummary,
  ScenarioInputs,
} from "./types";
import { runScenario, findRecommendation } from "./engine";
import { MOCK_SIMULATIONS } from "./mock-data";
import * as liveApi from "./api-client";
import { SIMULATION_TEMPLATES } from "./templates";

let simulations: Simulation[] = [...MOCK_SIMULATIONS];

function delay(ms: number = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function mockRunSimulation(request: RunSimulationRequest): Promise<RunSimulationResponse> {
  await delay(800);

  const baseline = runScenario(request.baseline);
  const scenarios = request.scenarios.map(s => runScenario(s));
  const { recommendedId, reason, divergenceWeek } = findRecommendation(baseline, scenarios);

  const simulation: Simulation = {
    id: `sim_${Date.now()}`,
    name: request.name,
    templateId: request.simulationId,
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

async function mockListSimulations(): Promise<ListSimulationsResponse> {
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

async function mockGetSimulation(id: string): Promise<GetSimulationResponse> {
  await delay(400);

  const simulation = simulations.find(s => s.id === id);
  if (!simulation) {
    throw new Error(`Simulation not found: ${id}`);
  }

  return { simulation };
}

async function mockDeleteSimulation(id: string): Promise<void> {
  await delay(300);
  const index = simulations.findIndex(s => s.id === id);
  if (index === -1) {
    throw new Error(`Simulation not found: ${id}`);
  }
  simulations.splice(index, 1);
}

async function mockCompareScenarios(request: CompareRequest): Promise<CompareResponse> {
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

export async function runSimulation(request: RunSimulationRequest): Promise<RunSimulationResponse> {
  if (liveApi.hasLiveApi()) {
    try {
      const result = await liveApi.runSimulation(request);
      // Pass through both the simulation and any server-side run metadata
      return result;
    } catch (error) {
      if (error instanceof liveApi.SimulationApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      console.warn("Live Reux simulation failed; falling back to mock service.", error);
    }
  }

  return mockRunSimulation(request);
}

export async function listSimulations(): Promise<ListSimulationsResponse> {
  if (liveApi.hasLiveApi()) {
    try {
      return await liveApi.listSimulations();
    } catch (error) {
      console.warn("Live Reux simulation list failed; falling back to mock service.", error);
    }
  }

  return mockListSimulations();
}

export async function getSimulation(id: string): Promise<GetSimulationResponse> {
  // For live_ IDs, try the server-persisted run endpoint first
  if (id.startsWith("live_") && liveApi.hasLiveApi()) {
    try {
      return await liveApi.getSavedRun(id);
    } catch (error) {
      // If the server returns 404/410 (expired), fall through to local cache
      if (
        error instanceof liveApi.SimulationApiError &&
        error.status &&
        (error.status === 404 || error.status === 410)
      ) {
        // Try local cache before giving up
        try {
          return await liveApi.getSimulation(id);
        } catch {
          // Re-throw the original 404/410 so the UI can show expired state
          throw error;
        }
      }
      console.warn("Live saved run fetch failed; trying local cache.", error);
    }
  }

  if (liveApi.hasLiveApi()) {
    try {
      return await liveApi.getSimulation(id);
    } catch (error) {
      console.warn("Live Reux simulation detail failed; falling back to mock service.", error);
    }
  }

  return mockGetSimulation(id);
}

export async function deleteSimulation(id: string): Promise<void> {
  // If there's a live API, it should implement this too, but for now we only support it locally
  return mockDeleteSimulation(id);
}

export async function renameSimulation(id: string, name: string): Promise<void> {
  // Mock service rename
  await delay(300);
  const sim = simulations.find(s => s.id === id);
  if (!sim) {
    throw new Error(`Simulation not found: ${id}`);
  }
  sim.name = name;
  sim.updatedAt = new Date().toISOString();
}

export async function compareScenarios(request: CompareRequest): Promise<CompareResponse> {
  if (liveApi.hasLiveApi()) {
    try {
      return await liveApi.compareScenarios(request);
    } catch (error) {
      if (error instanceof liveApi.SimulationApiError && error.status && error.status >= 400 && error.status < 500) {
        throw error;
      }
      console.warn("Live Reux scenario comparison failed; falling back to mock service.", error);
    }
  }

  return mockCompareScenarios(request);
}

export async function listSavedRuns(): Promise<ListSavedRunsResponse> {
  if (liveApi.hasLiveApi()) {
    try {
      return await liveApi.listSavedRuns();
    } catch (error) {
      console.warn("Live saved runs fetch failed.", error);
    }
  }

  // No mock equivalent — return empty when live API is unavailable
  return { runs: [] };
}

export async function getOperationsDecision(): Promise<{ baseline: ScenarioInputs; scenarios: ScenarioInputs[] }> {
  if (liveApi.hasLiveApi()) {
    try {
      return await liveApi.getOperationsDecision();
    } catch (error) {
      console.warn("Live Reux operations template failed; falling back to mock service.", error);
    }
  }

  await delay(300);
  const { BASELINE_INPUTS, SCENARIO_PRESETS } = await import("./mock-data");
  return {
    baseline: { ...BASELINE_INPUTS, name: "Current Operations" },
    scenarios: SCENARIO_PRESETS.map((p) => ({ ...BASELINE_INPUTS, ...p })),
  };
}

export async function getBusinessSimulationTemplate(id: string): Promise<{ baseline: ScenarioInputs; scenarios: ScenarioInputs[] }> {
  if (liveApi.hasLiveApi()) {
    try {
      return await liveApi.getBusinessSimulationTemplate(id);
    } catch (error) {
      console.warn(`Live Reux template ${id} failed; falling back to local template.`, error);
    }
  }

  await delay(200);
  const template = SIMULATION_TEMPLATES.find((candidate) => candidate.id === id) ?? SIMULATION_TEMPLATES[0];
  return {
    baseline: template.baseline,
    scenarios: template.scenarios,
  };
}
