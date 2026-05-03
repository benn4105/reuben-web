import { generateReuxSnippet } from "./engine";
import type {
  CompareRequest,
  CompareResponse,
  ComparisonResult,
  ForecastPoint,
  GetReuxSimulationResponse,
  GetSimulationResponse,
  GetSavedRunResponse,
  ListReuxSimulationsResponse,
  ListSimulationsResponse,
  ListSavedRunsResponse,
  MetricDelta,
  MetricSnapshot,
  RunSimulationRequest,
  RunSimulationResponse,
  SavedRunMeta,
  SavedRunSummary,
  ScenarioInputs,
  ScenarioResult,
  Simulation,
  SimulationSummary,
  ReuxSimulationMetadata,
  ReuxSimulationValue,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_REUX_DEMO_URL?.replace(/\/$/, "");
const STORAGE_KEY = "reux_business_simulations";
const SESSION_STORAGE_KEY = "reux_demo_session_id";
const DEFAULT_AVERAGE_ORDER_VALUE = 85;
const DEFAULT_GROSS_MARGIN_RATE = 0.42;
const DEFAULT_BUSINESS_SIMULATION_ID = "operations-decision";
const OPERATIONS_SIMULATION_NAME = "operations_decision";

export function hasLiveApi(): boolean {
  return Boolean(API_BASE_URL);
}

export interface LiveApiStatus {
  configured: boolean;
  ok: boolean;
  url?: string;
  message: string;
}

export async function checkLiveApiStatus(): Promise<LiveApiStatus> {
  if (!API_BASE_URL) {
    return {
      configured: false,
      ok: false,
      message: "No live backend is configured. The simulator will use local mock data.",
    };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return {
        configured: true,
        ok: false,
        url: API_BASE_URL,
        message: `The live backend responded with ${response.status}. The simulator can fall back to local mock data.`,
      };
    }

    const health = await response.json().catch(() => ({}));
    const productSimulations = Array.isArray(health.productSimulations)
      ? health.productSimulations.length
      : undefined;

    return {
      configured: true,
      ok: true,
      url: API_BASE_URL,
      message: productSimulations
        ? `Connected to the live Reux backend with ${productSimulations} executable models.`
        : "Connected to the live Reux backend.",
    };
  } catch (error) {
    return {
      configured: true,
      ok: false,
      url: API_BASE_URL,
      message: error instanceof Error
        ? `Live backend check failed: ${error.message}`
        : "Live backend check failed. The simulator can fall back to local mock data.",
    };
  }
}

export interface ValidationErrorIssue {
  path: string;
  message: string;
}

export class SimulationApiError extends Error {
  public code?: string;
  public issues?: ValidationErrorIssue[];
  public status?: number;

  constructor(message: string, code?: string, issues?: ValidationErrorIssue[], status?: number) {
    super(message);
    this.name = "SimulationApiError";
    this.code = code;
    this.issues = issues;
    this.status = status;
  }
}

interface FetchOptions extends RequestInit {
  retries?: number;
}

type BackendForecastUnit = "week" | "month" | "quarter";
type BackendMetricDirection = "increase" | "decrease" | "flat";
type BackendMetricName =
  | "revenue"
  | "operatingCost"
  | "laborCost"
  | "productivity"
  | "workforceLoad"
  | "margin"
  | "marginDelta"
  | "riskScore"
  | "defectCost";

interface BackendAssumptions {
  employees: number;
  averageHourlyCost: number;
  weeklyDemand: number;
  averageOrderValue: number;
  grossMarginRate: number;
  productivityGainRate: number;
  overtimeReductionRate: number;
  supplierDelayRiskRate: number;
  defectRate: number;
  forecastPeriods: number;
  forecastUnit: BackendForecastUnit;
}

interface BackendScenarioInput {
  id: string;
  name: string;
  description?: string;
  assumptions: Partial<BackendAssumptions>;
}

interface BackendMetricSnapshot {
  revenue: number;
  operatingCost: number;
  laborCost: number;
  productivity: number;
  workforceLoad: number;
  margin: number;
  marginDelta: number;
  riskScore: number;
  defectCost: number;
}

interface BackendTimelinePoint {
  period: number;
  label: string;
  metrics: BackendMetricSnapshot;
}

interface BackendScenarioResult {
  id: string;
  name: string;
  description?: string;
  assumptions: BackendAssumptions;
  finalMetrics: BackendMetricSnapshot;
  timeline: BackendTimelinePoint[];
}

interface BackendMetricDelta {
  metric: BackendMetricName;
  baseline: number;
  scenario: number;
  delta: number;
  direction: BackendMetricDirection;
  unit?: "USD" | "percent" | "count" | "index";
}

interface BackendComparison {
  baselineScenarioId: string;
  recommendedScenarioId?: string;
  metricDeltasByScenario: Record<string, BackendMetricDelta[]>;
  recommendation?: {
    scenarioId: string;
    scenarioName: string;
    score: number;
    summary: string;
    decisionSummary?: string;
    recommendedAction?: string;
    confidence?: "low" | "medium" | "high";
    confidenceSummary?: string;
    whyThisWon?: string;
    whatChangedFromBaseline?: string[];
    keyMetricDeltas?: BackendMetricDelta[];
    riskSummary?: string;
    tradeoffSummary?: string;
    reasons: string[];
    tradeoffs: string[];
    watchouts?: string[];
  };
}

interface BackendRunResponse {
  simulation: {
    id: string;
    name: string;
    description: string;
    domain: "operations" | "workforce" | "finance" | "custom";
    status: "draft" | "ready" | "archived";
    updatedAt: string;
  };
  baseline: BackendScenarioResult;
  scenarios: BackendScenarioResult[];
  comparison: BackendComparison;
  reuxSource?: string;
  generatedAt: string;
  run?: {
    id: string;
    name: string;
    createdAt: string;
    expiresAt?: string;
    storage?: "postgres" | "memory";
    persistenceWarning?: string;
    expiryNote?: string;
  };
}

interface BackendSavedRunRecord {
  id: string;
  name?: string;
  simulationId: string;
  createdAt: string;
  expiresAt?: string;
  session?: {
    id: string;
    isolated: boolean;
    schema?: string;
  };
  scenarioCount: number;
  bestMargin?: number;
  bestMarginScenario?: string;
  riskRange?: [number, number];
  recommendedScenarioId?: string;
  recommendedScenarioName?: string;
  displayTitle?: string;
  displaySubtitle?: string;
  resultSummary?: string;
  expiryNote?: string;
  storage?: "postgres" | "memory";
  persistenceWarning?: string;
  request: unknown;
  response: BackendRunResponse;
}

interface BackendCompareResponse {
  comparison: BackendComparison;
  generatedAt: string;
}

interface BackendTemplateResponse {
  simulation: {
    id: string;
    name: string;
    description: string;
    domain: "operations" | "workforce" | "finance" | "custom";
    status: "draft" | "ready" | "archived";
    updatedAt: string;
  };
  defaultAssumptions: BackendAssumptions;
  exampleScenarios: BackendScenarioInput[];
}

interface ReuxSimulationPeriodResult {
  period: number;
  label: string;
  assumptions: Record<string, ReuxSimulationValue>;
  assumptionUnits: Record<string, string>;
  metrics: Record<string, number>;
  metricUnits: Record<string, string>;
}

interface ReuxSimulationScenarioRunResult {
  name: string;
  periods: ReuxSimulationPeriodResult[];
}

interface ReuxSimulationRunComparison {
  baseline: string;
  finalPeriod: number;
  scenarios: Array<{
    name: string;
    metricDeltas: Record<string, number>;
    metricUnits: Record<string, string>;
    firstDivergence?: {
      period: number;
      label: string;
      metricDeltas: Record<string, number>;
      metricUnits: Record<string, string>;
    };
  }>;
  explanations: Array<{
    metric: string;
    objective?: "maximize" | "minimize";
    preferredScenario?: string;
    preferredDelta?: number;
    summary: string;
  }>;
}

interface ReuxSimulationRunResult {
  name: string;
  model: "prototype-formula-forecast";
  dimensions: Record<string, string>;
  forecast: ReuxSimulationMetadata["forecast"];
  objectives: ReuxSimulationMetadata["objectives"];
  periods: ReuxSimulationPeriodResult[];
  scenarios?: ReuxSimulationScenarioRunResult[];
  comparison?: ReuxSimulationRunComparison;
}

interface ReuxSimulationRunResponse {
  simulation: ReuxSimulationMetadata;
  run: ReuxSimulationRunResult;
  generatedAt: string;
  sourceFile?: string;
}

async function fetchWithRetry<T>(path: string, options: FetchOptions = {}): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_REUX_DEMO_URL is not configured.");
  }

  const { retries = 2, ...fetchOptions } = options;
  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...fetchOptions,
        headers: {
          "Content-Type": "application/json",
          ...demoSessionHeader(),
          ...fetchOptions.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.code || errorData.issues || errorData.error) {
          throw new SimulationApiError(
            errorData.message || errorData.error || `API error: ${response.status} ${response.statusText}`,
            errorData.code,
            errorData.issues,
            response.status
          );
        }

        throw new Error(errorData.message || `API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (lastError instanceof SimulationApiError && lastError.status && lastError.status >= 400 && lastError.status < 500) {
        throw lastError; // Do not retry validation errors
      }

      attempt += 1;

      if (attempt <= retries) {
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw lastError ?? new Error("API request failed.");
}

export async function listReuxSimulationModels(): Promise<ListReuxSimulationsResponse> {
  return fetchWithRetry<ListReuxSimulationsResponse>("/api/reux/simulations", {
    method: "GET",
    retries: 2,
  });
}

export async function getReuxSimulationModel(name: string): Promise<GetReuxSimulationResponse> {
  return fetchWithRetry<GetReuxSimulationResponse>(`/api/reux/simulations/${encodeURIComponent(name)}`, {
    method: "GET",
    retries: 2,
  });
}

export async function runReuxSimulationModel(
  name: string,
  request: Record<string, unknown> = {},
): Promise<ReuxSimulationRunResponse> {
  return fetchWithRetry<ReuxSimulationRunResponse>(`/api/reux/simulations/${encodeURIComponent(name)}/run`, {
    method: "POST",
    body: JSON.stringify({ simulationName: name, ...request }),
    retries: 3,
  });
}

export async function runSimulation(request: RunSimulationRequest): Promise<RunSimulationResponse> {
  try {
    const backendResponse = await fetchWithRetry<BackendRunResponse>("/api/simulations/run", {
      method: "POST",
      body: JSON.stringify(toBackendRunRequest(request)),
      retries: 2,
    });
    const simulation = toFrontendSimulation(request.name, backendResponse, request.simulationId);
    const runMeta = backendResponse.run
      ? toSavedRunMeta(backendResponse.run, request.name)
      : undefined;
    const savedSimulation = runMeta ? { ...simulation, id: runMeta.id } : simulation;

    saveCachedSimulation(savedSimulation);
    return { simulation: savedSimulation, run: runMeta };
  } catch (error) {
    if (
      error instanceof SimulationApiError &&
      error.status &&
      error.status >= 400 &&
      error.status < 500
    ) {
      throw error;
    }

    const genericResponse = await runReuxSimulationModel(OPERATIONS_SIMULATION_NAME, toReuxRunRequest(request));
    const simulation = toFrontendSimulationFromReuxRun(request.name, request, genericResponse);
    saveCachedSimulation(simulation);
    return { simulation };
  }
}

export async function listSimulations(): Promise<ListSimulationsResponse> {
  return { simulations: loadCachedSimulations().map(toSummary) };
}

export async function getSimulation(id: string): Promise<GetSimulationResponse> {
  const simulation = loadCachedSimulations().find(item => item.id === id);
  if (!simulation) {
    throw new Error(`Simulation not found: ${id}`);
  }
  return { simulation };
}

// ─── Saved Run Endpoints ────────────────────────────────────────────────────
// These hit the new server-side run persistence layer.
// They are only called when the live API is configured.

export async function listSavedRuns(): Promise<ListSavedRunsResponse> {
  interface BackendRunSummary {
    id: string;
    name?: string;
    displayTitle?: string;
    displaySubtitle?: string;
    resultSummary?: string;
    expiryNote?: string;
    storage?: "postgres" | "memory";
    persistenceWarning?: string;
    simulationId?: string;
    createdAt: string;
    scenarioCount: number;
    bestMargin?: number;
    bestMarginScenario?: string;
    riskRange?: [number, number];
    expiresAt?: string;
  }

  const data = await fetchWithRetry<{ runs: BackendRunSummary[] }>("/api/simulation-runs", {
    method: "GET",
    retries: 1,
  });

  return {
    runs: data.runs.map((r): SavedRunSummary => ({
      id: r.id,
      name: r.name ?? r.simulationId ?? "Saved Business Simulation",
      displayTitle: r.displayTitle,
      displaySubtitle: r.displaySubtitle,
      resultSummary: r.resultSummary,
      expiryNote: r.expiryNote,
      storage: r.storage,
      persistenceWarning: r.persistenceWarning,
      createdAt: r.createdAt,
      scenarioCount: r.scenarioCount,
      bestMargin: r.bestMargin ?? 0,
      bestMarginScenario: r.bestMarginScenario,
      riskRange: r.riskRange ?? [0, 0],
      expiresAt: r.expiresAt,
    })),
  };
}

export async function getBusinessSimulationTemplate(id = DEFAULT_BUSINESS_SIMULATION_ID): Promise<{ baseline: ScenarioInputs; scenarios: ScenarioInputs[] }> {
  const template = await fetchWithRetry<BackendTemplateResponse>(`/api/simulations/${encodeURIComponent(id)}`);
  const baseline = toFrontendInputs("Current Plan", template.defaultAssumptions);

  return {
    baseline,
    scenarios: template.exampleScenarios.map(scenario =>
      toFrontendInputs(scenario.name, {
        ...template.defaultAssumptions,
        ...scenario.assumptions,
      }, scenario.id, scenario.description)
    ),
  };
}

export async function getSavedRun(id: string): Promise<GetSavedRunResponse> {
  const data = await fetchWithRetry<{ run: BackendSavedRunRecord }>(`/api/simulation-runs/${encodeURIComponent(id)}`, {
    method: "GET",
    retries: 1,
  });

  const response = data.run.response;
  const simulation = toFrontendSimulation(data.run.name ?? response.simulation.name, response, data.run.simulationId);
  return {
    simulation: {
      ...simulation,
      id,
      savedRun: {
        ...simulation.savedRun,
        id,
        name: simulation.savedRun?.name ?? data.run.name ?? response.simulation.name,
        createdAt: simulation.savedRun?.createdAt ?? data.run.createdAt,
        expiresAt: simulation.savedRun?.expiresAt ?? data.run.expiresAt,
        storage: simulation.savedRun?.storage ?? data.run.storage,
        persistenceWarning: simulation.savedRun?.persistenceWarning ?? data.run.persistenceWarning,
        expiryNote: simulation.savedRun?.expiryNote ?? data.run.expiryNote,
      },
    },
  };
}

export async function compareScenarios(request: CompareRequest): Promise<CompareResponse> {
  const simulation = loadCachedSimulations().find(item =>
    item.scenarios.some(scenario => scenario.id === request.baselineId)
  );
  const comparison = simulation?.comparison;
  const baseline = simulation?.scenarios.find(scenario => scenario.id === request.baselineId);
  const selectedScenarios = simulation?.scenarios.filter(scenario => request.scenarioIds.includes(scenario.id)) ?? [];

  if (!comparison || !baseline) {
    throw new Error("Comparison data not found.");
  }

  if (API_BASE_URL) {
    const backendResponse = await fetchWithRetry<BackendCompareResponse>("/api/scenarios/compare", {
      method: "POST",
      body: JSON.stringify({
        baseline: toBackendScenarioResult(baseline),
        scenarios: selectedScenarios.map(toBackendScenarioResult),
      }),
      retries: 2,
    });

    return {
      comparison: toComparisonResult(backendResponse.comparison, baseline, selectedScenarios),
    };
  }

  return {
    comparison: {
      ...comparison,
      scenarios: selectedScenarios,
    },
  };
}

export async function getOperationsDecision(): Promise<{ baseline: ScenarioInputs; scenarios: ScenarioInputs[] }> {
  try {
    return await getBusinessSimulationTemplate(DEFAULT_BUSINESS_SIMULATION_ID);
  } catch {
    const response = await runReuxSimulationModel(OPERATIONS_SIMULATION_NAME);
    const baseline = toFrontendInputsFromReuxAssumptions(
      "Current Operations",
      response.run.periods[0]?.assumptions ?? {},
      response.run.forecast.periods,
    );

    const executableScenarios = (response.run.scenarios ?? []).filter((scenario) => slugify(scenario.name) !== "baseline");

    return {
      baseline,
      scenarios: executableScenarios.map((scenario) =>
        toFrontendInputsFromReuxAssumptions(
          labelFromId(scenario.name),
          scenario.periods[0]?.assumptions ?? {},
          response.run.forecast.periods,
        )
      ),
    };
  }
}

function toReuxRunRequest(request: RunSimulationRequest) {
  return {
    assumptions: toReuxAssumptionOverrides(request.baseline),
    scenarios: request.scenarios.map((scenario) => ({
      name: scenario.name,
      overrides: toReuxAssumptionOverrides(scenario),
    })),
  };
}

function toReuxAssumptionOverrides(inputs: ScenarioInputs): Record<string, ReuxSimulationValue> {
  return {
    employees: inputs.employees,
    averageHourlyCost: inputs.avgHourlyCost,
    weeklyDemand: inputs.weeklyDemand,
    averageOrderValue: inputs.averageOrderValue || DEFAULT_AVERAGE_ORDER_VALUE,
    grossMarginRate: (inputs.grossMarginPct || DEFAULT_GROSS_MARGIN_RATE * 100) / 100,
    productivityGainRate: inputs.productivityGainPct / 100,
    overtimeReductionRate: inputs.overtimeReductionPct / 100,
    supplierDelayRiskRate: inputs.supplierDelayRiskPct / 100,
    defectRate: inputs.errorDefectRatePct / 100,
  };
}

function toFrontendSimulationFromReuxRun(
  name: string,
  request: RunSimulationRequest,
  response: ReuxSimulationRunResponse,
): Simulation {
  const createdAt = response.generatedAt;
  const baseline = toScenarioResultFromReuxPeriods(
    "baseline",
    request.baseline.name,
    request.baseline,
    response.run.periods,
  );
  const executableScenarios = (response.run.scenarios ?? []).filter((scenario) => slugify(scenario.name) !== "baseline");
  const scenarios = executableScenarios.map((scenario, index) =>
    toScenarioResultFromReuxPeriods(
      slugify(scenario.name),
      request.scenarios[index]?.name ?? labelFromId(scenario.name),
      request.scenarios[index],
      scenario.periods,
    )
  );
  const comparison = toComparisonResultFromReuxRun(response.run, baseline, scenarios);

  return {
    id: `sim_${Date.now()}`,
    name,
    createdAt,
    updatedAt: response.generatedAt,
    status: "completed",
    baselineInputs: baseline.inputs,
    scenarios: [baseline, ...scenarios],
    comparison,
  };
}

function toScenarioResultFromReuxPeriods(
  id: string,
  name: string,
  providedInputs: ScenarioInputs | undefined,
  periods: ReuxSimulationPeriodResult[],
): ScenarioResult {
  const firstPeriod = periods[0];
  const finalPeriod = periods[periods.length - 1] ?? firstPeriod;
  const inputs = providedInputs ?? toFrontendInputsFromReuxAssumptions(name, finalPeriod?.assumptions ?? {}, periods.length);

  return {
    id,
    inputs,
    summary: toMetricSnapshotFromReuxMetrics(finalPeriod?.metrics ?? {}),
    forecast: periods.map(toForecastPointFromReuxPeriod),
    reuxSnippet: generateReuxSnippet(inputs),
  };
}

function toComparisonResultFromReuxRun(
  run: ReuxSimulationRunResult,
  baseline: ScenarioResult,
  scenarios: ScenarioResult[],
): ComparisonResult {
  const recommendation = findReuxRecommendation(run, baseline, scenarios);

  return {
    baseline,
    scenarios,
    deltas: Object.fromEntries(
      scenarios.map((scenario) => [
        scenario.id,
        buildReuxMetricDeltas(baseline, scenario),
      ])
    ),
    recommendedId: recommendation.recommendedId,
    recommendationReason: recommendation.reason,
    firstDivergenceWeek: recommendation.firstDivergenceWeek,
  };
}

function findReuxRecommendation(
  run: ReuxSimulationRunResult,
  baseline: ScenarioResult,
  scenarios: ScenarioResult[],
): { recommendedId: string; reason: string; firstDivergenceWeek: number } {
  const preferredName = run.comparison?.explanations.find((explanation) => explanation.preferredScenario)?.preferredScenario;
  const preferredSlug = preferredName ? slugify(preferredName) : undefined;
  const preferred = preferredName
    ? scenarios.find((scenario) => slugify(scenario.inputs.name) === preferredSlug)
    : undefined;

  if (preferred) {
    const divergence = run.comparison?.scenarios.find((scenario) => slugify(scenario.name) === preferredSlug)?.firstDivergence?.period ?? 1;
    const summaries = run.comparison?.explanations
      .filter((explanation) => explanation.preferredScenario === preferredName)
      .map((explanation) => explanation.summary);

    return {
      recommendedId: preferred.id,
      reason: summaries && summaries.length > 0
        ? summaries.join(" ")
        : `${preferred.inputs.name} is recommended by the Reux objective ranking.`,
      firstDivergenceWeek: divergence,
    };
  }

  const best = [baseline, ...scenarios].sort((a, b) => {
    const marginDelta = b.summary.margin - a.summary.margin;
    if (marginDelta !== 0) return marginDelta;
    return a.summary.riskScore - b.summary.riskScore;
  })[0] ?? baseline;

  return {
    recommendedId: best.id,
    reason: best.id === baseline.id
      ? "The baseline configuration is currently the strongest Reux-ranked option."
      : `${best.inputs.name} has the strongest margin profile among the evaluated Reux scenarios.`,
    firstDivergenceWeek: 1,
  };
}

function buildReuxMetricDeltas(baseline: ScenarioResult, scenario: ScenarioResult): MetricDelta[] {
  return [
    toReuxMetricDelta("Operating Cost", baseline.summary.operatingCost, scenario.summary.operatingCost, true),
    toReuxMetricDelta("Productivity", baseline.summary.productivity, scenario.summary.productivity, false),
    toReuxMetricDelta("Margin", baseline.summary.margin, scenario.summary.margin, false),
    toReuxMetricDelta("Risk Score", baseline.summary.riskScore, scenario.summary.riskScore, true),
  ];
}

function toReuxMetricDelta(label: string, baseline: number, scenario: number, lowerIsBetter: boolean): MetricDelta {
  const delta = scenario - baseline;
  const isPositive = lowerIsBetter ? delta <= 0 : delta >= 0;

  return {
    label,
    baseline,
    scenario,
    delta,
    deltaPct: baseline !== 0 ? (delta / Math.abs(baseline)) * 100 : 0,
    direction: delta === 0 ? "neutral" : isPositive ? "positive" : "negative",
  };
}

function toFrontendInputsFromReuxAssumptions(
  name: string,
  assumptions: Record<string, ReuxSimulationValue>,
  forecastWeeks: number,
): ScenarioInputs {
  return {
    name,
    employees: numberAssumption(assumptions.employees, 50),
    avgHourlyCost: numberAssumption(assumptions.averageHourlyCost, 32),
    weeklyDemand: numberAssumption(assumptions.weeklyDemand, 1200),
    averageOrderValue: numberAssumption(assumptions.averageOrderValue, DEFAULT_AVERAGE_ORDER_VALUE),
    grossMarginPct: numberAssumption(assumptions.grossMarginRate, DEFAULT_GROSS_MARGIN_RATE) * 100,
    productivityGainPct: numberAssumption(assumptions.productivityGainRate, 0) * 100,
    overtimeReductionPct: numberAssumption(assumptions.overtimeReductionRate, 0) * 100,
    supplierDelayRiskPct: numberAssumption(assumptions.supplierDelayRiskRate, 0) * 100,
    errorDefectRatePct: numberAssumption(assumptions.defectRate, 0) * 100,
    forecastWeeks: forecastWeeks || 12,
  };
}

function toMetricSnapshotFromReuxMetrics(metrics: Record<string, number>): MetricSnapshot {
  const revenue = Math.round(metrics.revenue ?? 0);
  const margin = Math.round(metrics.margin ?? metrics.marginDelta ?? 0);

  return {
    revenue,
    operatingCost: Math.round(metrics.operatingCost ?? 0),
    margin,
    marginPct: revenue > 0 ? Math.round((margin / revenue) * 1000) / 10 : 0,
    productivity: Math.round((metrics.productivity ?? 0) * 10) / 10,
    workforceLoad: Math.round((metrics.workforceLoad ?? 0) * 10) / 10,
    riskScore: Math.round((metrics.riskScore ?? 0) * 10) / 10,
    overtimeCost: 0,
    defectCost: Math.round(metrics.defectCost ?? 0),
    supplierDelayCost: 0,
  };
}

function toForecastPointFromReuxPeriod(point: ReuxSimulationPeriodResult): ForecastPoint {
  const metrics = toMetricSnapshotFromReuxMetrics(point.metrics);

  return {
    week: point.period,
    label: point.label,
    revenue: metrics.revenue,
    operatingCost: metrics.operatingCost,
    margin: metrics.margin,
    productivity: metrics.productivity,
    riskScore: metrics.riskScore,
    workforceLoad: metrics.workforceLoad,
  };
}

function numberAssumption(value: ReuxSimulationValue | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function labelFromId(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function toBackendRunRequest(request: RunSimulationRequest) {
  return {
    name: request.name,
    simulationId: request.simulationId ?? DEFAULT_BUSINESS_SIMULATION_ID,
    baseline: toBackendAssumptions(request.baseline),
    scenarios: request.scenarios.map(toBackendScenarioInput),
    options: {
      includeTimeline: true,
      includeReuxSource: true,
    },
  };
}

function toSavedRunMeta(run: BackendRunResponse["run"], fallbackName: string): SavedRunMeta | undefined {
  if (!run) return undefined;
  return {
    id: run.id,
    name: run.name ?? fallbackName,
    storage: run.storage,
    persistenceWarning: run.persistenceWarning,
    expiryNote: run.expiryNote,
    createdAt: run.createdAt,
    expiresAt: run.expiresAt,
  };
}

function toBackendScenarioInput(inputs: ScenarioInputs): BackendScenarioInput {
  return {
    id: inputs.id || slugify(inputs.name),
    name: inputs.name,
    description: inputs.description,
    assumptions: {
      employees: inputs.employees,
      averageHourlyCost: inputs.avgHourlyCost,
      weeklyDemand: inputs.weeklyDemand,
      averageOrderValue: inputs.averageOrderValue || DEFAULT_AVERAGE_ORDER_VALUE,
      grossMarginRate: (inputs.grossMarginPct || DEFAULT_GROSS_MARGIN_RATE * 100) / 100,
      productivityGainRate: inputs.productivityGainPct / 100,
      overtimeReductionRate: inputs.overtimeReductionPct / 100,
      supplierDelayRiskRate: inputs.supplierDelayRiskPct / 100,
      defectRate: inputs.errorDefectRatePct / 100,
    },
  };
}

function toBackendAssumptions(inputs: ScenarioInputs): BackendAssumptions {
  return {
    employees: inputs.employees,
    averageHourlyCost: inputs.avgHourlyCost,
    weeklyDemand: inputs.weeklyDemand,
    averageOrderValue: inputs.averageOrderValue || DEFAULT_AVERAGE_ORDER_VALUE,
    grossMarginRate: (inputs.grossMarginPct || DEFAULT_GROSS_MARGIN_RATE * 100) / 100,
    productivityGainRate: inputs.productivityGainPct / 100,
    overtimeReductionRate: inputs.overtimeReductionPct / 100,
    supplierDelayRiskRate: inputs.supplierDelayRiskPct / 100,
    defectRate: inputs.errorDefectRatePct / 100,
    forecastPeriods: inputs.forecastWeeks,
    forecastUnit: "week",
  };
}

function toBackendScenarioResult(result: ScenarioResult): BackendScenarioResult {
  return {
    id: result.id,
    name: result.inputs.name,
    assumptions: toBackendAssumptions(result.inputs),
    finalMetrics: toBackendMetricSnapshot(result.inputs, result.summary),
    timeline: result.forecast.map(point => ({
      period: point.week,
      label: point.label,
      metrics: toBackendMetricSnapshot(result.inputs, {
        ...result.summary,
        revenue: point.revenue,
        operatingCost: point.operatingCost,
        margin: point.margin,
        productivity: point.productivity,
        riskScore: point.riskScore,
        workforceLoad: point.workforceLoad,
      }),
    })),
  };
}

function toBackendMetricSnapshot(inputs: ScenarioInputs, metrics: MetricSnapshot): BackendMetricSnapshot {
  return {
    revenue: metrics.revenue,
    operatingCost: metrics.operatingCost,
    laborCost: inputs.employees * inputs.avgHourlyCost,
    productivity: metrics.productivity,
    workforceLoad: metrics.workforceLoad,
    margin: metrics.margin,
    marginDelta: metrics.margin,
    riskScore: metrics.riskScore,
    defectCost: metrics.defectCost,
  };
}

function toFrontendSimulation(name: string, response: BackendRunResponse, templateId = response.simulation.id): Simulation {
  const createdAt = response.generatedAt;
  const baseline = toScenarioResult(response.baseline, response.reuxSource);
  const scenarios = response.scenarios.map(scenario => toScenarioResult(scenario, response.reuxSource));
  const comparison = toComparisonResult(response.comparison, baseline, scenarios);
  const savedRun = toSavedRunMeta(response.run, name);

  return {
    id: `sim_${Date.now()}`,
    name,
    templateId,
    templateName: response.simulation.name,
    createdAt,
    updatedAt: response.generatedAt,
    status: "completed",
    baselineInputs: baseline.inputs,
    scenarios: [baseline, ...scenarios],
    comparison,
    ...(savedRun ? { savedRun } : {}),
  };
}

function toScenarioResult(result: BackendScenarioResult, reuxSource?: string): ScenarioResult {
  const inputs = toFrontendInputs(result.name, result.assumptions);

  return {
    id: result.id,
    inputs,
    summary: toMetricSnapshot(result.finalMetrics),
    forecast: result.timeline.map(point => toForecastPoint(point)),
    reuxSnippet: reuxSource || generateReuxSnippet(inputs),
  };
}

function toFrontendInputs(name: string, assumptions: BackendAssumptions, id?: string, description?: string): ScenarioInputs {
  return {
    ...(id ? { id } : {}),
    name,
    ...(description ? { description } : {}),
    employees: assumptions.employees,
    avgHourlyCost: assumptions.averageHourlyCost,
    weeklyDemand: assumptions.weeklyDemand,
    averageOrderValue: assumptions.averageOrderValue,
    grossMarginPct: assumptions.grossMarginRate * 100,
    productivityGainPct: assumptions.productivityGainRate * 100,
    overtimeReductionPct: assumptions.overtimeReductionRate * 100,
    supplierDelayRiskPct: assumptions.supplierDelayRiskRate * 100,
    errorDefectRatePct: assumptions.defectRate * 100,
    forecastWeeks: assumptions.forecastPeriods,
  };
}

function toMetricSnapshot(metrics: BackendMetricSnapshot): MetricSnapshot {
  return {
    revenue: Math.round(metrics.revenue),
    operatingCost: Math.round(metrics.operatingCost),
    margin: Math.round(metrics.margin),
    marginPct: metrics.revenue > 0 ? Math.round((metrics.margin / metrics.revenue) * 1000) / 10 : 0,
    productivity: Math.round(metrics.productivity * 10) / 10,
    workforceLoad: Math.round(metrics.workforceLoad * 10) / 10,
    riskScore: Math.round(metrics.riskScore * 10) / 10,
    overtimeCost: 0,
    defectCost: Math.round(metrics.defectCost),
    supplierDelayCost: 0,
  };
}

function toForecastPoint(point: BackendTimelinePoint): ForecastPoint {
  return {
    week: point.period,
    label: point.label,
    revenue: Math.round(point.metrics.revenue),
    operatingCost: Math.round(point.metrics.operatingCost),
    margin: Math.round(point.metrics.margin),
    productivity: Math.round(point.metrics.productivity * 10) / 10,
    riskScore: Math.round(point.metrics.riskScore * 10) / 10,
    workforceLoad: Math.round(point.metrics.workforceLoad * 10) / 10,
  };
}

function toComparisonResult(
  backendComparison: BackendComparison,
  baseline: ScenarioResult,
  scenarios: ScenarioResult[],
): ComparisonResult {
  const recommendedId = backendComparison.recommendedScenarioId || scenarios[0]?.id || baseline.id;
  const recommendation = backendComparison.recommendation;

  return {
    baseline,
    scenarios,
    deltas: Object.fromEntries(
      Object.entries(backendComparison.metricDeltasByScenario).map(([scenarioId, deltas]) => [
        scenarioId,
        deltas.map(toMetricDelta),
      ])
    ),
    recommendedId,
    recommendationReason: [
      recommendation?.decisionSummary,
      recommendation?.summary,
      ...(recommendation?.reasons ?? []),
      ...(recommendation?.tradeoffs ?? []).map(tradeoff => `Tradeoff: ${tradeoff}`),
    ].filter(Boolean).join(" "),
    recommendationSummary: recommendation?.summary,
    decisionSummary: recommendation?.decisionSummary,
    recommendedAction: recommendation?.recommendedAction,
    confidence: recommendation?.confidence,
    confidenceSummary: recommendation?.confidenceSummary,
    whyThisWon: recommendation?.whyThisWon,
    whatChangedFromBaseline: recommendation?.whatChangedFromBaseline ?? [],
    keyMetricDeltas: recommendation?.keyMetricDeltas?.map(toMetricDelta) ?? [],
    riskSummary: recommendation?.riskSummary,
    tradeoffSummary: recommendation?.tradeoffSummary,
    watchouts: recommendation?.watchouts ?? [],
    recommendationReasons: recommendation?.reasons ?? [],
    recommendationTradeoffs: recommendation?.tradeoffs ?? [],
    firstDivergenceWeek: 1,
  };
}

function toMetricDelta(delta: BackendMetricDelta): MetricDelta {
  const lowerIsBetter = ["operatingCost", "laborCost", "riskScore", "defectCost"].includes(delta.metric);
  const isPositive = lowerIsBetter ? delta.delta <= 0 : delta.delta >= 0;

  return {
    label: labelForMetric(delta.metric),
    baseline: delta.baseline,
    scenario: delta.scenario,
    delta: delta.delta,
    deltaPct: delta.baseline !== 0 ? (delta.delta / Math.abs(delta.baseline)) * 100 : 0,
    direction: delta.direction === "flat" ? "neutral" : isPositive ? "positive" : "negative",
  };
}

function labelForMetric(metric: BackendMetricName): string {
  const labels: Record<BackendMetricName, string> = {
    revenue: "Revenue",
    operatingCost: "Operating Cost",
    laborCost: "Labor Cost",
    productivity: "Productivity",
    workforceLoad: "Workforce Load",
    margin: "Margin",
    marginDelta: "Margin Delta",
    riskScore: "Risk Score",
    defectCost: "Defect Cost",
  };
  return labels[metric];
}

function toSummary(simulation: Simulation): SimulationSummary {
  const margins = simulation.scenarios.map(scenario => scenario.summary.margin);
  const risks = simulation.scenarios.map(scenario => scenario.summary.riskScore);
  const bestMargin = Math.max(...margins);
  const bestMarginIndex = margins.indexOf(bestMargin);

  return {
    id: simulation.id,
    name: simulation.name,
    createdAt: simulation.createdAt,
    updatedAt: simulation.updatedAt,
    status: simulation.status,
    scenarioCount: simulation.scenarios.length,
    bestMargin,
    bestMarginScenario: simulation.scenarios[bestMarginIndex]?.inputs.name ?? "Baseline",
    riskRange: [Math.min(...risks), Math.max(...risks)],
  };
}

function loadCachedSimulations(): Simulation[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as Simulation[];
  } catch {
    return [];
  }
}

function saveCachedSimulation(simulation: Simulation): void {
  if (typeof window === "undefined") return;

  const simulations = [simulation, ...loadCachedSimulations().filter(item => item.id !== simulation.id)].slice(0, 20);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
}

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return slug || `scenario-${Date.now()}`;
}

function demoSessionHeader(): Record<string, string> {
  const sessionId = demoSessionId();
  return sessionId ? { "x-reux-demo-session": sessionId } : {};
}

function demoSessionId(): string {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing && /^[a-z0-9]{8,16}$/.test(existing)) return existing;

    const generated = randomSessionId();
    window.localStorage.setItem(SESSION_STORAGE_KEY, generated);
    return generated;
  } catch {
    return "";
  }
}

function randomSessionId(): string {
  const bytes = new Uint8Array(8);
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, (byte) => (byte % 36).toString(36)).join("");
}
