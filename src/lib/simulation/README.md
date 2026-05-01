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

The live Reux demo exposes:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/simulations` | List available simulation templates. |
| `GET` | `/api/simulations/operations-decision` | Load default assumptions and starter scenarios. |
| `POST` | `/api/simulations/run` | Run a baseline and scenario set. |
| `POST` | `/api/scenarios/compare` | Compare already-run scenario results. |

The frontend currently calls `POST /api/simulations/run` for new simulations and caches the normalized result in browser `localStorage` under `reux_business_simulations`.

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
