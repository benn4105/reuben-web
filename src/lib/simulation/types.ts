// ─── Simulation Engine Types ─────────────────────────────────────────────────
// These interfaces define the contract between the frontend and the Reux backend.
// The mock service implements these exactly so swapping to the real API is trivial.

export interface ScenarioInputs {
  id?: string;
  name: string;
  description?: string;
  employees: number;
  avgHourlyCost: number;
  weeklyDemand: number;
  averageOrderValue: number;
  grossMarginPct: number;
  productivityGainPct: number;    // 0–100
  overtimeReductionPct: number;   // 0–100
  supplierDelayRiskPct: number;   // 0–100
  errorDefectRatePct: number;     // 0–100
  forecastWeeks: number;          // 4, 8, 12, or 26
}

export interface MetricSnapshot {
  revenue: number;
  operatingCost: number;
  margin: number;
  marginPct: number;
  productivity: number;          // units per employee per week
  workforceLoad: number;         // 0–100 (percentage of capacity)
  riskScore: number;             // 0–100
  overtimeCost: number;
  defectCost: number;
  supplierDelayCost: number;
}

export interface MetricDelta {
  label: string;
  baseline: number;
  scenario: number;
  delta: number;
  deltaPct: number;
  direction: "positive" | "negative" | "neutral";
}

export interface ForecastPoint {
  week: number;
  label: string;                 // "Week 1", "Week 2", etc.
  revenue: number;
  operatingCost: number;
  margin: number;
  productivity: number;
  riskScore: number;
  workforceLoad: number;
}

export interface ScenarioResult {
  id: string;
  inputs: ScenarioInputs;
  summary: MetricSnapshot;
  forecast: ForecastPoint[];
  reuxSnippet: string;
}

export interface ComparisonResult {
  baseline: ScenarioResult;
  scenarios: ScenarioResult[];
  deltas: Record<string, MetricDelta[]>;  // scenarioId → deltas
  recommendedId: string;
  recommendationReason: string; // Keep for backwards compatibility
  recommendationSummary?: string;
  decisionSummary?: string;
  recommendedAction?: string;
  confidence?: "low" | "medium" | "high";
  confidenceSummary?: string;
  whyThisWon?: string;
  whatChangedFromBaseline?: string[];
  keyMetricDeltas?: MetricDelta[];
  riskSummary?: string;
  tradeoffSummary?: string;
  watchouts?: string[];
  recommendationReasons?: string[];
  recommendationTradeoffs?: string[];
  firstDivergenceWeek: number;
}

export interface Simulation {
  id: string;
  name: string;
  templateId?: string;
  templateName?: string;
  createdAt: string;
  updatedAt: string;
  status: "draft" | "running" | "completed" | "error";
  baselineInputs: ScenarioInputs;
  scenarios: ScenarioResult[];
  comparison?: ComparisonResult;
  savedRun?: SavedRunMeta;
}

export interface SimulationSummary {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: Simulation["status"];
  scenarioCount: number;
  bestMargin: number;
  bestMarginScenario: string;
  riskRange: [number, number];
}

// ─── API Request/Response Shapes ─────────────────────────────────────────────

export interface RunSimulationRequest {
  name: string;
  simulationId?: string;
  baseline: ScenarioInputs;
  scenarios: ScenarioInputs[];
}

export interface RunSimulationResponse {
  simulation: Simulation;
  run?: SavedRunMeta;
}

export interface ListSimulationsResponse {
  simulations: SimulationSummary[];
}

export interface GetSimulationResponse {
  simulation: Simulation;
}

export interface CompareRequest {
  baselineId: string;
  scenarioIds: string[];
}

export interface CompareResponse {
  comparison: ComparisonResult;
}

export type ReuxSimulationValue = boolean | number | string;

export interface ReuxSimulationAssumption {
  name: string;
  type: "boolean" | "number" | "string";
  value: ReuxSimulationValue;
  unit?: string;
}

export interface ReuxSimulationMetadata {
  name: string;
  dimensions: Record<string, string>;
  forecast: {
    periods: number;
    unit: "day" | "week" | "month" | "quarter" | "year";
  };
  assumptions: ReuxSimulationAssumption[];
  metrics: string[];
  objectives: Array<{
    metric: string;
    direction: "maximize" | "minimize";
  }>;
  scenarios: string[];
  sourceFile?: string;
}

export interface ListReuxSimulationsResponse {
  simulations: ReuxSimulationMetadata[];
}

export interface GetReuxSimulationResponse {
  simulation: ReuxSimulationMetadata;
  sourceFile?: string;
}

// ─── Saved Run Types ─────────────────────────────────────────────────────────
// These types describe the temporary server-persisted run records
// returned by POST /api/simulations/run and GET /api/simulation-runs.

export interface SavedRunMeta {
  id: string;          // "live_..." id
  name: string;
  storage?: "postgres" | "memory";
  persistenceWarning?: string;
  expiryNote?: string;
  createdAt: string;
  expiresAt?: string;  // ISO timestamp — when the backend will garbage-collect the run
}

export interface SavedRunSummary {
  id: string;
  name: string;
  displayTitle?: string;
  displaySubtitle?: string;
  resultSummary?: string;
  expiryNote?: string;
  storage?: "postgres" | "memory";
  persistenceWarning?: string;
  createdAt: string;
  scenarioCount: number;
  bestMargin: number;
  bestMarginScenario?: string;
  riskRange: [number, number];
  expiresAt?: string;
}

export interface ListSavedRunsResponse {
  runs: SavedRunSummary[];
}

export interface GetSavedRunResponse {
  simulation: Simulation;
}
