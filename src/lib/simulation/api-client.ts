// ─── Real API Client Shell ───────────────────────────────────────────────────
// This file will replace mock-service.ts once the backend is ready.
// It implements the same interfaces but uses real fetch calls with retries.

import type {
  RunSimulationRequest,
  RunSimulationResponse,
  ListSimulationsResponse,
  GetSimulationResponse,
  CompareRequest,
  CompareResponse,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

interface FetchOptions extends RequestInit {
  retries?: number;
}

/**
 * Core fetch wrapper with standard error handling, auth injection, and retries.
 */
async function fetchWithRetry<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { retries = 2, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  // In the future, grab token from standard auth provider (e.g. NextAuth, Clerk, etc)
  const headers = {
    "Content-Type": "application/json",
    // "Authorization": `Bearer ${token}`,
    ...fetchOptions.headers,
  };

  let attempt = 0;
  let lastError: Error | null = null;

  while (attempt <= retries) {
    try {
      const response = await fetch(url, { ...fetchOptions, headers });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      attempt++;
      
      // Only wait if we're going to retry
      if (attempt <= retries) {
        // Exponential backoff: 500ms, 1000ms, etc.
        await new Promise(resolve => setTimeout(resolve, attempt * 500));
      }
    }
  }

  throw lastError;
}

// ─── API Methods ─────────────────────────────────────────────────────────────

/**
 * POST /api/simulations/run
 * Runs a new simulation with baseline + scenarios.
 */
export async function runSimulation(request: RunSimulationRequest): Promise<RunSimulationResponse> {
  return fetchWithRetry<RunSimulationResponse>("/simulations/run", {
    method: "POST",
    body: JSON.stringify(request),
    // Give simulations a longer timeout or more retries if they take a while
    retries: 3, 
  });
}

/**
 * GET /api/simulations
 * Returns all saved simulations as summaries.
 */
export async function listSimulations(): Promise<ListSimulationsResponse> {
  return fetchWithRetry<ListSimulationsResponse>("/simulations", {
    method: "GET",
  });
}

/**
 * GET /api/simulations/:id
 * Returns full simulation detail.
 */
export async function getSimulation(id: string): Promise<GetSimulationResponse> {
  return fetchWithRetry<GetSimulationResponse>(`/simulations/${id}`, {
    method: "GET",
  });
}

/**
 * POST /api/scenarios/compare
 * Compares specific scenarios within a simulation.
 */
export async function compareScenarios(request: CompareRequest): Promise<CompareResponse> {
  return fetchWithRetry<CompareResponse>("/scenarios/compare", {
    method: "POST",
    body: JSON.stringify(request),
  });
}
