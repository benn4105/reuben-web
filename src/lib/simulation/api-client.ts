import { generateReuxSnippet } from "./engine";
import type {
  CompareRequest,
  CompareResponse,
  ComparisonResult,
  ForecastPoint,
  GetSimulationResponse,
  ListSimulationsResponse,
  MetricDelta,
  MetricSnapshot,
  RunSimulationRequest,
  RunSimulationResponse,
  ScenarioInputs,
  ScenarioResult,
  Simulation,
  SimulationSummary,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_REUX_DEMO_URL?.replace(/\/$/, "");
const STORAGE_KEY = "reux_business_simulations";
const DEFAULT_AVERAGE_ORDER_VALUE = 85;
const DEFAULT_GROSS_MARGIN_RATE = 0.42;

export function hasLiveApi(): boolean {
  return Boolean(API_BASE_URL);
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
    reasons: string[];
    tradeoffs: string[];
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

export async function runSimulation(request: RunSimulationRequest): Promise<RunSimulationResponse> {
  const backendResponse = await fetchWithRetry<BackendRunResponse>("/api/simulations/run", {
    method: "POST",
    body: JSON.stringify(toBackendRunRequest(request)),
    retries: 3,
  });
  const simulation = toFrontendSimulation(request.name, backendResponse);
  saveCachedSimulation(simulation);
  return { simulation };
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
  const template = await fetchWithRetry<BackendTemplateResponse>("/api/simulations/operations-decision");
  const baseline = toFrontendInputs("Current Operations", template.defaultAssumptions);

  return {
    baseline,
    scenarios: template.exampleScenarios.map(scenario =>
      toFrontendInputs(scenario.name, {
        ...template.defaultAssumptions,
        ...scenario.assumptions,
      })
    ),
  };
}

function toBackendRunRequest(request: RunSimulationRequest) {
  return {
    simulationId: "operations-decision",
    baseline: toBackendAssumptions(request.baseline),
    scenarios: request.scenarios.map(toBackendScenarioInput),
    options: {
      includeTimeline: true,
      includeReuxSource: true,
    },
  };
}

function toBackendScenarioInput(inputs: ScenarioInputs): BackendScenarioInput {
  return {
    id: slugify(inputs.name),
    name: inputs.name,
    assumptions: toBackendAssumptions(inputs),
  };
}

function toBackendAssumptions(inputs: ScenarioInputs): BackendAssumptions {
  return {
    employees: inputs.employees,
    averageHourlyCost: inputs.avgHourlyCost,
    weeklyDemand: inputs.weeklyDemand,
    averageOrderValue: DEFAULT_AVERAGE_ORDER_VALUE,
    grossMarginRate: DEFAULT_GROSS_MARGIN_RATE,
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

function toFrontendSimulation(name: string, response: BackendRunResponse): Simulation {
  const createdAt = response.generatedAt;
  const baseline = toScenarioResult(response.baseline, response.reuxSource);
  const scenarios = response.scenarios.map(scenario => toScenarioResult(scenario, response.reuxSource));
  const comparison = toComparisonResult(response.comparison, baseline, scenarios);

  return {
    id: `live_${Date.now()}`,
    name,
    createdAt,
    updatedAt: response.generatedAt,
    status: "completed",
    baselineInputs: baseline.inputs,
    scenarios: [baseline, ...scenarios],
    comparison,
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

function toFrontendInputs(name: string, assumptions: BackendAssumptions): ScenarioInputs {
  return {
    name,
    employees: assumptions.employees,
    avgHourlyCost: assumptions.averageHourlyCost,
    weeklyDemand: assumptions.weeklyDemand,
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
      recommendation?.summary,
      ...(recommendation?.reasons ?? []),
      ...(recommendation?.tradeoffs ?? []).map(tradeoff => `Tradeoff: ${tradeoff}`),
    ].filter(Boolean).join(" "),
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
