// ─── Client-side Simulation Engine ───────────────────────────────────────────
// Performs the business logic calculations that will eventually run on the Reux backend.
// This module is a pure-function calculation layer — no side effects, no state.

import type { ScenarioInputs, MetricSnapshot, ForecastPoint, ScenarioResult } from "./types";

// ─── Constants ───────────────────────────────────────────────────────────────

const HOURS_PER_WEEK = 40;
const BASE_UNITS_PER_EMPLOYEE_PER_WEEK = 25;
const OVERTIME_COST_MULTIPLIER = 1.5;
const DEFECT_COST_PER_UNIT = 12;
const SUPPLIER_DELAY_COST_PER_WEEK = 2400;
const RISK_WEIGHT_SUPPLIER = 0.4;
const RISK_WEIGHT_DEFECT = 0.35;
const RISK_WEIGHT_OVERTIME = 0.25;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function generateId(): string {
  return `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ─── Core Calculations ──────────────────────────────────────────────────────

export function calculateMetrics(inputs: ScenarioInputs): MetricSnapshot {
  const productivityMultiplier = 1 + inputs.productivityGainPct / 100;
  const overtimeReduction = inputs.overtimeReductionPct / 100;
  const supplierRisk = inputs.supplierDelayRiskPct / 100;
  const defectRate = inputs.errorDefectRatePct / 100;
  const averageOrderValue = inputs.averageOrderValue || 85;
  const grossMarginRate = (inputs.grossMarginPct || 42) / 100;

  // Productivity
  const unitsPerEmployee = BASE_UNITS_PER_EMPLOYEE_PER_WEEK * productivityMultiplier;
  const totalCapacity = unitsPerEmployee * inputs.employees;
  const actualOutput = Math.min(totalCapacity, inputs.weeklyDemand);
  const workforceLoad = clamp((inputs.weeklyDemand / totalCapacity) * 100, 0, 100);

  // Overtime calculation
  const demandGap = Math.max(0, inputs.weeklyDemand - totalCapacity);
  const overtimeHours = demandGap > 0
    ? (demandGap / unitsPerEmployee) * HOURS_PER_WEEK * (1 - overtimeReduction)
    : 0;
  const overtimeCost = overtimeHours * inputs.avgHourlyCost * OVERTIME_COST_MULTIPLIER;

  // Base labor cost
  const baseLaborCost = inputs.employees * inputs.avgHourlyCost * HOURS_PER_WEEK;

  // Defect cost
  const defectUnits = actualOutput * defectRate;
  const defectCost = defectUnits * DEFECT_COST_PER_UNIT;

  // Supplier delay cost
  const supplierDelayCost = supplierRisk * SUPPLIER_DELAY_COST_PER_WEEK;

  // Totals
  const operatingCost = baseLaborCost + overtimeCost + defectCost + supplierDelayCost;
  const revenue = actualOutput * averageOrderValue;
  const margin = (revenue * grossMarginRate) - operatingCost;
  const marginPct = revenue > 0 ? (margin / revenue) * 100 : 0;

  // Risk score (weighted composite)
  const riskScore = clamp(
    supplierRisk * 100 * RISK_WEIGHT_SUPPLIER +
    defectRate * 100 * RISK_WEIGHT_DEFECT +
    (workforceLoad > 90 ? (workforceLoad - 90) * 2.5 : 0) * RISK_WEIGHT_OVERTIME,
    0,
    100
  );

  return {
    revenue: Math.round(revenue),
    operatingCost: Math.round(operatingCost),
    margin: Math.round(margin),
    marginPct: Math.round(marginPct * 10) / 10,
    productivity: Math.round(unitsPerEmployee * 10) / 10,
    workforceLoad: Math.round(workforceLoad * 10) / 10,
    riskScore: Math.round(riskScore * 10) / 10,
    overtimeCost: Math.round(overtimeCost),
    defectCost: Math.round(defectCost),
    supplierDelayCost: Math.round(supplierDelayCost),
  };
}

export function generateForecast(inputs: ScenarioInputs): ForecastPoint[] {
  const points: ForecastPoint[] = [];
  const baseMetrics = calculateMetrics(inputs);

  for (let week = 1; week <= inputs.forecastWeeks; week++) {
    // Add realistic variance over time (slight trend + noise)
    const trendFactor = 1 + (week / inputs.forecastWeeks) * 0.03; // slight upward trend
    const noise = 1 + (Math.sin(week * 1.7) * 0.02 + Math.cos(week * 0.9) * 0.015);
    const riskDrift = 1 + (week / inputs.forecastWeeks) * (inputs.supplierDelayRiskPct / 500);

    points.push({
      week,
      label: `Week ${week}`,
      revenue: Math.round(baseMetrics.revenue * trendFactor * noise),
      operatingCost: Math.round(baseMetrics.operatingCost * (trendFactor * 0.98) * noise),
      margin: Math.round(baseMetrics.margin * trendFactor * noise),
      productivity: Math.round(baseMetrics.productivity * trendFactor * noise * 10) / 10,
      riskScore: Math.round(clamp(baseMetrics.riskScore * riskDrift * noise, 0, 100) * 10) / 10,
      workforceLoad: Math.round(clamp(baseMetrics.workforceLoad * noise, 0, 100) * 10) / 10,
    });
  }

  return points;
}

export function generateReuxSnippet(inputs: ScenarioInputs): string {
  return `module business_simulator

simulate operations_decision {
  dimension product = business_simulation
  dimension domain = operations
  dimension audience = enterprise

  employees = ${inputs.employees}
  averageHourlyCost = ${inputs.avgHourlyCost} USD
  weeklyDemand = ${inputs.weeklyDemand}
  averageOrderValue = ${inputs.averageOrderValue || 85} USD
  grossMarginRate = ${inputs.grossMarginPct || 42} percent
  productivityGainRate = ${(inputs.productivityGainPct / 100).toFixed(2)}
  overtimeReductionRate = ${(inputs.overtimeReductionPct / 100).toFixed(2)}
  supplierDelayRiskRate = ${(inputs.supplierDelayRiskPct / 100).toFixed(2)}
  defectRate = ${(inputs.errorDefectRatePct / 100).toFixed(3)}

  formula revenue = weeklyDemand * averageOrderValue
  formula productivity = (weeklyDemand / employees) * (1 + productivityGainRate)
  formula workforceLoad = weeklyDemand / (employees * (1 + productivityGainRate))
  formula operatingCost = employees * averageHourlyCost
  formula margin = (revenue * grossMarginRate) - operatingCost
  formula riskScore = (supplierDelayRiskRate + defectRate) * 100

  objective maximize margin
  objective maximize productivity
  objective minimize operatingCost
  objective minimize riskScore

  forecast ${inputs.forecastWeeks} weeks
}`;
}

export function runScenario(inputs: ScenarioInputs): ScenarioResult {
  return {
    id: generateId(),
    inputs,
    summary: calculateMetrics(inputs),
    forecast: generateForecast(inputs),
    reuxSnippet: generateReuxSnippet(inputs),
  };
}

export function findRecommendation(
  baseline: ScenarioResult,
  scenarios: ScenarioResult[]
): { recommendedId: string; reason: string; divergenceWeek: number } {
  if (scenarios.length === 0) {
    return { recommendedId: baseline.id, reason: "No alternative scenarios to compare.", divergenceWeek: 1 };
  }

  let bestId = baseline.id;
  let bestScore = -Infinity;
  let bestReason = "";

  const allCandidates = [baseline, ...scenarios];

  for (const s of allCandidates) {
    // Composite score: maximize margin, minimize risk, consider productivity
    const score =
      (s.summary.marginPct * 2) +
      (s.summary.productivity * 0.5) -
      (s.summary.riskScore * 1.5) -
      (s.summary.workforceLoad > 90 ? (s.summary.workforceLoad - 90) * 3 : 0);

    if (score > bestScore) {
      bestScore = score;
      bestId = s.id;

      const marginDelta = s.summary.margin - baseline.summary.margin;
      const riskDelta = s.summary.riskScore - baseline.summary.riskScore;

      if (s.id === baseline.id) {
        bestReason = "The baseline configuration already offers the best balance of margin, risk, and productivity.";
      } else {
        const parts: string[] = [];
        if (marginDelta > 0) parts.push(`improves weekly margin by $${marginDelta.toLocaleString()}`);
        if (marginDelta < 0) parts.push(`reduces weekly margin by $${Math.abs(marginDelta).toLocaleString()}`);
        if (riskDelta < -2) parts.push(`reduces risk score by ${Math.abs(Math.round(riskDelta))} points`);
        if (s.summary.productivity > baseline.summary.productivity) {
          parts.push(`increases productivity to ${s.summary.productivity} units/employee/week`);
        }
        bestReason = `"${s.inputs.name}" is recommended because it ${parts.join(", ")}, yielding the best composite score across margin, risk, and operational efficiency.`;
      }
    }
  }

  // Find first divergence week
  const recommended = allCandidates.find(s => s.id === bestId)!;
  let divergenceWeek = 1;
  for (let i = 0; i < Math.min(baseline.forecast.length, recommended.forecast.length); i++) {
    const marginDiff = Math.abs(recommended.forecast[i].margin - baseline.forecast[i].margin);
    if (marginDiff > baseline.forecast[i].margin * 0.02) {
      divergenceWeek = i + 1;
      break;
    }
  }

  return { recommendedId: bestId, reason: bestReason, divergenceWeek };
}
