import type { ScenarioInputs } from "./types";

// ─── Share Link Utilities ────────────────────────────────────────────────────
// Encode and decode simulation configurations into URL-safe strings.
// Uses base64-encoded JSON with a version prefix for forward compatibility.
// The share link encodes the scenario configuration, NOT the results.
// Recipients load the link into /simulator/new and run it themselves.

const SHARE_VERSION = "v1";
const SHARE_PARAM = "share";

/** Fields we encode — keeps the URL shorter by excluding optional/empty fields */
interface SharePayload {
  v: string;
  name: string;
  baseline: CompactScenario;
  scenarios: CompactScenario[];
}

/** Compact representation — shorter keys to minimize URL length */
interface CompactScenario {
  n: string;        // name
  e: number;        // employees
  h: number;        // avgHourlyCost
  d: number;        // weeklyDemand
  a: number;        // averageOrderValue
  g: number;        // grossMarginPct
  p: number;        // productivityGainPct
  o: number;        // overtimeReductionPct
  s: number;        // supplierDelayRiskPct
  r: number;        // errorDefectRatePct
  f: number;        // forecastWeeks
}

function toCompact(inputs: ScenarioInputs): CompactScenario {
  return {
    n: inputs.name,
    e: inputs.employees,
    h: inputs.avgHourlyCost,
    d: inputs.weeklyDemand,
    a: inputs.averageOrderValue,
    g: inputs.grossMarginPct,
    p: inputs.productivityGainPct,
    o: inputs.overtimeReductionPct,
    s: inputs.supplierDelayRiskPct,
    r: inputs.errorDefectRatePct,
    f: inputs.forecastWeeks,
  };
}

function fromCompact(compact: CompactScenario): ScenarioInputs {
  return {
    name: compact.n,
    employees: compact.e,
    avgHourlyCost: compact.h,
    weeklyDemand: compact.d,
    averageOrderValue: compact.a ?? 85,
    grossMarginPct: compact.g ?? 42,
    productivityGainPct: compact.p,
    overtimeReductionPct: compact.o,
    supplierDelayRiskPct: compact.s,
    errorDefectRatePct: compact.r,
    forecastWeeks: compact.f,
  };
}

/**
 * Encode a simulation configuration into a shareable URL string.
 * Returns the full URL path including the share parameter.
 */
export function encodeShareLink(
  simulationName: string,
  baseline: ScenarioInputs,
  scenarios: ScenarioInputs[]
): string {
  const payload: SharePayload = {
    v: SHARE_VERSION,
    name: simulationName,
    baseline: toCompact(baseline),
    scenarios: scenarios.map(toCompact),
  };

  const json = JSON.stringify(payload);
  const encoded = btoa(json);
  
  if (typeof window !== "undefined") {
    const url = new URL(window.location.origin + "/simulator/new");
    url.searchParams.set(SHARE_PARAM, encoded);
    return url.toString();
  }
  
  return `/simulator/new?${SHARE_PARAM}=${encodeURIComponent(encoded)}`;
}

/**
 * Try to decode a share link from the current URL search params.
 * Returns null if no share param is present or if decoding fails.
 */
export function decodeShareLink(searchParams: string): {
  name: string;
  baseline: ScenarioInputs;
  scenarios: ScenarioInputs[];
} | null {
  try {
    const params = new URLSearchParams(searchParams);
    const encoded = params.get(SHARE_PARAM);
    if (!encoded) return null;

    const json = atob(encoded);
    const payload: SharePayload = JSON.parse(json);

    if (payload.v !== SHARE_VERSION) {
      console.warn(`Share link version mismatch: expected ${SHARE_VERSION}, got ${payload.v}`);
      return null;
    }

    return {
      name: payload.name || "Shared Simulation",
      baseline: fromCompact(payload.baseline),
      scenarios: payload.scenarios.map(fromCompact),
    };
  } catch (err) {
    console.warn("Failed to decode share link:", err);
    return null;
  }
}

/**
 * Copy text to clipboard with fallback.
 * Returns true if copy succeeded.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for non-secure contexts
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    return true;
  } catch {
    return false;
  }
}
