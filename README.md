# Reuben Web — Frontend

The public website for the Reuben ecosystem: homepage, project pages, Business Simulator, developer preview, and marketing pages.

Built with **Next.js 16**, React, Tailwind CSS, and shadcn/ui.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_REUX_DEMO_URL` | For live demo | URL of the hosted Reux pilot demo service. When unset, the simulator falls back to the local mock engine. |

**Production value:**

```env
NEXT_PUBLIC_REUX_DEMO_URL=https://reux-pilot-demo-production.up.railway.app
```

Do not include a trailing slash.

## Key Routes

Check these before each deployment:

| Route | Purpose | Notes |
|---|---|---|
| `/` | Homepage | Primary CTA → Simulator |
| `/simulator` | Simulator dashboard | Lists saved simulations, shows intro |
| `/simulator/new` | Scenario builder | Input validation mirrors backend limits |
| `/simulator/[id]` | Simulation results | Charts, metrics, recommendation |
| `/simulator/[id]/compare` | Scenario comparison | Side-by-side charts and table |
| `/projects` | All projects | Grouped by status: Live / Prototype / Planned |
| `/projects/reux` | Reux product page | Features, pilots, roadmap summary |
| `/projects/reux/roadmap` | Full roadmap | Available Now / Beta / Next / Future |
| `/projects/reux/demo` | Live Reux demos | Requires `NEXT_PUBLIC_REUX_DEMO_URL` |
| `/projects/plos` | PLOS product page | Planned product — no live features |
| `/docs` | Developer preview | Syntax examples, editor support, run-from-source |
| `/about` | About Reuben | Vision, ecosystem diagram, team |

## Simulator API Limits

The frontend mirrors these backend constraints locally in `src/lib/simulation/constants.ts` to provide immediate validation feedback:

- **Max run scenarios:** 8
- **Max compare scenarios:** 12
- **Max forecast periods:** 52
- **Max timeline points:** 52
- **Scenario ID max:** 64 characters
- **Scenario name max:** 120 characters
- **Scenario description max:** 500 characters
- **Scenario ID regex:** `^[a-zA-Z0-9][a-zA-Z0-9_-]*$`

## Build & Lint

```bash
npm run lint
npm run build
```

Both must pass before merging to main.

## Railway Deployment

This repo includes `railway.json`. Create a Railway service from `benn4105/reuben-web` and set the `NEXT_PUBLIC_REUX_DEMO_URL` variable.

## Architecture Notes

- **Marketing pages** live under `src/app/(marketing)/` with a shared layout.
- **Simulator pages** live under `src/app/simulator/` with a separate sidebar layout.
- **Simulation logic** is in `src/lib/simulation/` — see the [simulation README](src/lib/simulation/README.md) for the API contract.
- The simulator uses a **live-first, mock-fallback** pattern: it tries the real Reux backend first, and falls back to a local engine when the backend is unavailable.
