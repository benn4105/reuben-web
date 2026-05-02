import type { ScenarioInputs } from "./types";

// ─── Draft Persistence ───────────────────────────────────────────────────────
// Auto-save simulation drafts to localStorage so users don't lose work on
// page refresh, accidental navigation, or browser crash.
// Drafts are keyed by a fixed key (one draft at a time).
// Drafts are cleared after a successful simulation run.

const DRAFT_KEY = "reuben_sim_draft";
const DRAFT_VERSION = 1;

interface SimulationDraft {
  version: number;
  savedAt: string;
  name: string;
  baseline: ScenarioInputs;
  scenarios: ScenarioInputs[];
}

/**
 * Save the current simulation configuration as a draft.
 * Silently fails if localStorage is unavailable.
 */
export function saveDraft(
  name: string,
  baseline: ScenarioInputs,
  scenarios: ScenarioInputs[]
): void {
  try {
    const draft: SimulationDraft = {
      version: DRAFT_VERSION,
      savedAt: new Date().toISOString(),
      name,
      baseline,
      scenarios,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    // localStorage unavailable or quota exceeded — silently ignore
  }
}

/**
 * Load a saved draft. Returns null if no draft exists, the draft is
 * corrupted, or the version doesn't match.
 */
export function loadDraft(): {
  name: string;
  baseline: ScenarioInputs;
  scenarios: ScenarioInputs[];
  savedAt: string;
} | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;

    const draft: SimulationDraft = JSON.parse(raw);
    if (draft.version !== DRAFT_VERSION) return null;
    if (!draft.baseline || !draft.scenarios) return null;

    return {
      name: draft.name,
      baseline: draft.baseline,
      scenarios: draft.scenarios,
      savedAt: draft.savedAt,
    };
  } catch {
    return null;
  }
}

/**
 * Clear any saved draft (e.g., after a successful simulation run).
 */
export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // silently ignore
  }
}

/**
 * Check if a draft exists without loading it.
 */
export function hasDraft(): boolean {
  try {
    return localStorage.getItem(DRAFT_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Format a relative time string from an ISO date (e.g., "2 minutes ago").
 */
export function formatDraftAge(savedAt: string): string {
  const diff = Date.now() - new Date(savedAt).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
