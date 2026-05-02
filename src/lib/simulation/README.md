# Reux Business Simulator Frontend Integration

This folder contains the simulation contract used by the Reuben website business simulator.

The UI keeps one internal shape for forms, charts, cards, and comparison tables. The service layer decides whether to use the hosted Reux backend or the local mock engine.

## Runtime Path

```text
Simulator pages
  -> mock-service.ts facade
    -> api-client.ts when NEXT_PUBLIC_REUX_DEMO_URL is configured
    -> local mock engine when the live backend is unavailable
```

This means the public website can use Railway in production while local development still works without a backend.

## Environment Variable

Set this in Vercel for Production and Preview:

```env
NEXT_PUBLIC_REUX_DEMO_URL=https://reux-pilot-demo-production.up.railway.app
```

Do not include a trailing slash.

## Hosted Backend Contract

The live Reux demo exposes two compatible simulator paths. The public Business Simulator uses the product-specific adapter as its primary path because that route persists shareable result runs while still executing Reux-backed decision logic.

### Business Simulator Adapter API

This is the primary path for `/simulator`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check deployment health and available executable models. |
| `GET` | `/api/simulations` | List available simulation templates. |
| `GET` | `/api/simulations/operations-decision` | Load default assumptions and starter scenarios. |
| `POST` | `/api/simulations/run` | Run a baseline and scenario set, persist a temporary saved run, and return metrics/recommendations. |
| `GET` | `/api/simulation-runs` | List recent saved runs for the current visitor session. |
| `GET` | `/api/simulation-runs/:id` | Reload a known saved run for shareable result pages. |
| `POST` | `/api/scenarios/compare` | Compare already-run scenario results. |

For the Business Simulator, `api-client.ts` runs:

```text
POST /api/simulations/run
```

The response is normalized back into the shared UI shape used by the dashboard, charts, recommendation panel, and Reux transparency panel. If the server returns `run.id`, the website routes to `/simulator/live_...`, which can be reloaded or shared until the temporary saved run expires.

### Generic Reux Simulation API

This route powers the Reux model catalog and remains a fallback execution path if the adapter is temporarily unavailable.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/reux/simulations` | List executable Reux models for the website catalog. |
| `GET` | `/api/reux/simulations/:name` | Load one model's dimensions, assumptions, objectives, metrics, and scenarios. |
| `POST` | `/api/reux/simulations/:name/run` | Execute a model with runtime assumption/scenario overrides. |

New simulations are cached in browser `localStorage` under `reux_business_simulations` after the live response is normalized. The API client also stores a stable anonymous visitor id under `reux_demo_session_id` and sends it as `x-reux-demo-session` so recent run lists are isolated per browser session. If the live backend is unavailable, `mock-service.ts` falls back to the local mock engine so the UI remains usable during local development.

## Shape Mapping

The UI form uses visitor-friendly names:

| Frontend field | Backend field |
| --- | --- |
| `avgHourlyCost` | `averageHourlyCost` |
| `productivityGainPct` | `productivityGainRate` |
| `overtimeReductionPct` | `overtimeReductionRate` |
| `supplierDelayRiskPct` | `supplierDelayRiskRate` |
| `errorDefectRatePct` | `defectRate` |
| `forecastWeeks` | `forecastPeriods` plus `forecastUnit: "week"` |

Percent fields are displayed as `0-100` values in the UI and sent as decimal rates to the backend.

The frontend also supplies these backend assumptions until the UI exposes them directly:

```ts
averageOrderValue: 85
grossMarginRate: 0.42
```

## Frontend Validation & API Limits

The frontend mirrors backend API limits locally to prevent unnecessary network requests and to provide immediate user feedback. These constants live in `constants.ts`:

- `MAX_RUN_SCENARIOS`: 8
- `MAX_COMPARE_SCENARIOS`: 12 
- `MAX_FORECAST_PERIODS`: 52
- `MAX_TIMELINE_POINTS`: 52
- `MAX_SCENARIO_ID_LENGTH`: 64
- `MAX_SCENARIO_NAME_LENGTH`: 120
- `MAX_SCENARIO_DESCRIPTION_LENGTH`: 500
- `SCENARIO_ID_REGEX`: `/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/`

When saving scenarios, names and IDs are validated against these rules. If an ID is left blank, `slugify` will auto-generate one from the name.

## Files

| File | Responsibility |
| --- | --- |
| `types.ts` | UI-facing TypeScript types. |
| `api-client.ts` | Live Reux API adapter and response normalizer. |
| `mock-service.ts` | Public service facade with live-first, mock-fallback behavior. |
| `engine.ts` | Local preview and mock calculation engine. |
| `mock-data.ts` | Seeded examples for local/mock mode. |

## Verification

Run these from the website repo:

```bash
npm run lint
npm run build
```

For a live smoke test, set `NEXT_PUBLIC_REUX_DEMO_URL` and create a simulation from `/simulator/new`.
The repository also includes:

```bash
npm run check:live-demo
```

That script checks the hosted website, hosted Reux catalog, adapter execution, saved-run reload, and session-scoped recent-run listing.
