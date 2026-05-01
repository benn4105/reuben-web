# Reux Backend Integration Guide

This document explains how the frontend simulation engine connects to the future Reux backend API.

## Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (Next.js)                                     │
│                                                         │
│  ┌──────────────┐    ┌───────────────────┐              │
│  │  Pages/Views  │───▶│  Mock Service     │              │
│  │  (React)      │    │  (mock-service.ts)│              │
│  └──────────────┘    └───────────────────┘              │
│                              │                          │
│                      ┌───────▼───────────┐              │
│                      │  Simulation Engine │              │
│                      │  (engine.ts)       │              │
│                      └───────────────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Future Architecture

```
┌────────────────────────────┐     ┌──────────────────────────┐
│  Frontend (Next.js)        │     │  Reux Backend             │
│                            │     │                          │
│  ┌──────────┐  ┌────────┐  │     │  ┌────────────────────┐  │
│  │  Pages   │──│  API    │──┼────▶│  │  Reux Engine       │  │
│  │          │  │  Client │  │     │  │  (schemas, txns,   │  │
│  └──────────┘  └────────┘  │     │  │   simulations,     │  │
│                            │     │  │   forecasts)        │  │
└────────────────────────────┘     │  └────────────────────┘  │
                                   └──────────────────────────┘
```

## API Contract

All interfaces are defined in `src/lib/simulation/types.ts`. The mock service in `src/lib/simulation/mock-service.ts` implements the exact same request/response shapes that the Reux backend should provide.

### Endpoints

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|-------------|----------|-------------|
| `POST` | `/api/simulations/run` | `RunSimulationRequest` | `RunSimulationResponse` | Run a new simulation |
| `GET` | `/api/simulations` | — | `ListSimulationsResponse` | List all saved simulations |
| `GET` | `/api/simulations/:id` | — | `GetSimulationResponse` | Get full simulation detail |
| `POST` | `/api/scenarios/compare` | `CompareRequest` | `CompareResponse` | Compare scenarios |

### Request/Response Types

#### `POST /api/simulations/run`

```typescript
// Request
interface RunSimulationRequest {
  name: string;
  baseline: ScenarioInputs;
  scenarios: ScenarioInputs[];
}

// Response
interface RunSimulationResponse {
  simulation: Simulation;
}
```

#### `GET /api/simulations`

```typescript
// Response
interface ListSimulationsResponse {
  simulations: SimulationSummary[];
}
```

#### `GET /api/simulations/:id`

```typescript
// Response
interface GetSimulationResponse {
  simulation: Simulation;
}
```

#### `POST /api/scenarios/compare`

```typescript
// Request
interface CompareRequest {
  baselineId: string;
  scenarioIds: string[];
}

// Response
interface CompareResponse {
  comparison: ComparisonResult;
}
```

## How to Switch to the Real Backend

### Step 1: Create an API client

Create `src/lib/simulation/api-client.ts`:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_REUX_API_URL || 'http://localhost:8080';

async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export async function runSimulation(request: RunSimulationRequest) {
  return apiRequest<RunSimulationResponse>('POST', '/api/simulations/run', request);
}

export async function listSimulations() {
  return apiRequest<ListSimulationsResponse>('GET', '/api/simulations');
}

export async function getSimulation(id: string) {
  return apiRequest<GetSimulationResponse>('GET', `/api/simulations/${id}`);
}

export async function compareScenarios(request: CompareRequest) {
  return apiRequest<CompareResponse>('POST', '/api/scenarios/compare', request);
}
```

### Step 2: Update imports

In every page/component that currently imports from `mock-service.ts`, change the import to point to `api-client.ts`:

```diff
- import { listSimulations } from "@/lib/simulation/mock-service";
+ import { listSimulations } from "@/lib/simulation/api-client";
```

### Step 3: Set the environment variable

Add to `.env.local`:

```
NEXT_PUBLIC_REUX_API_URL=https://your-reux-backend.example.com
```

### Step 4: Remove client-side engine (optional)

Once the Reux backend handles all simulation logic, the client-side `engine.ts` can be removed or kept as a local preview tool.

## Reux Backend Expectations

The Reux backend should:

1. **Accept `ScenarioInputs`** as defined in `types.ts`
2. **Return `Simulation` objects** with fully computed forecasts, metrics, and comparisons
3. **Generate Reux snippets** for each scenario (the `reuxSnippet` field)
4. **Persist simulations** so they appear in the list endpoint
5. **Handle comparison logic** including recommendation scoring

## Data Model Reference

See `src/lib/simulation/types.ts` for the complete data model. Key types:

- `ScenarioInputs` — User-provided assumptions
- `MetricSnapshot` — Computed point-in-time metrics
- `ForecastPoint` — One week of forecast data
- `ScenarioResult` — Full result for one scenario
- `ComparisonResult` — Multi-scenario comparison with recommendation
- `Simulation` — Top-level container

## File Structure

```
src/lib/simulation/
├── types.ts          # All TypeScript interfaces (the contract)
├── engine.ts         # Client-side calculation logic (temporary)
├── mock-data.ts      # Seeded example data
├── mock-service.ts   # Mock API (replace with api-client.ts)
└── README.md         # This file
```
