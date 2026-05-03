# Reuben Web - Frontend

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
| `CONTACT_WEBHOOK_URL` | For real intake | Optional webhook URL for pilot/contact leads. Use a Zapier, Make, Slack-compatible, or custom webhook endpoint. |
| `RESEND_API_KEY` | For email intake | Optional Resend API key for contact email delivery. |
| `CONTACT_TO_EMAIL` | For email intake | Destination inbox for contact leads when using Resend. |
| `CONTACT_FROM_EMAIL` | For email intake | Verified sender address for Resend. Defaults to Resend onboarding sender if unset. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Fallback | Public email address used by the contact form's mail fallback when no server delivery is configured. |

**Production value:**

```env
NEXT_PUBLIC_REUX_DEMO_URL=https://reux-pilot-demo-production.up.railway.app
NEXT_PUBLIC_CONTACT_EMAIL=buildreuben.dev@gmail.com
```

Do not include a trailing slash.

## Key Routes

Check these before each deployment:

| Route | Purpose | Notes |
|---|---|---|
| `/` | Homepage | Primary CTA to Simulator |
| `/simulator` | Simulator dashboard | Lists saved simulations, shows intro |
| `/simulator/new` | Scenario builder | Input validation mirrors backend limits |
| `/simulator/[id]` | Simulation results | Charts, metrics, recommendation |
| `/simulator/[id]/compare` | Scenario comparison | Side-by-side charts and table |
| `/projects` | All projects | Grouped by status: Live / Prototype / Planned |
| `/projects/reux` | Reux product page | Features, pilots, roadmap summary |
| `/projects/reux/roadmap` | Full roadmap | Available Now / Beta / Next / Future |
| `/projects/reux/demo` | Live Reux demos | Requires `NEXT_PUBLIC_REUX_DEMO_URL` |
| `/projects/plos` | PLOS product page | Planned product; no live features |
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

## Browser E2E

Install the Playwright browser once after a fresh dependency install:

```bash
npx playwright install chromium
```

Then run the simulator browser flow:

```bash
npm run test:e2e:simulator
```

The E2E test starts the local Next.js dev server, opens Chromium, creates a simulation, verifies the results page, recommendation panel, chart/table surfaces, and confirms the scenario comparison table renders.

## Live Demo Smoke Check

After Vercel deploys, run:

```bash
npm run check:live-demo
```

The smoke check verifies:

- The homepage, Reux project page, docs, roadmap, and simulator start path expose the right first-visitor CTAs.
- `https://reuben-web.vercel.app/simulator` serves the public simulator and Reux model catalog.
- `https://reuben-web.vercel.app/projects/reux/demo` links visitors into the Business Simulator.
- The Railway demo service reports healthy executable Reux models.
- `operations_decision` executes through the Reux API.
- The Business Simulator adapter creates a saved run, reloads it by ID, and lists it in the current visitor session.

Override targets when testing preview deploys:

```bash
node scripts/check-live-demo.mjs --site https://your-preview.vercel.app --api https://your-railway-service.up.railway.app
```

## Public Demo Handoff

The Business Simulator is intended to be shareable with non-technical visitors at:

- `https://reuben-web.vercel.app/simulator`
- `https://reuben-web.vercel.app/simulator/new`

Before sending the link publicly, confirm:

- Vercel production has `NEXT_PUBLIC_REUX_DEMO_URL` set to the Railway backend URL.
- `/simulator` shows `Live Connected`, not `Local Mock`.
- `/simulator/new` loads all four templates without an admin token or login.
- A guided demo run creates a results page with recommendation, charts, Reux transparency, and a copyable saved-run link.
- `npm run check:live-demo` passes against production.

Visitor-facing behavior:

- The demo uses sample assumptions only.
- Saved run links are temporary and can expire.
- Users can share a re-runnable config link even if a saved run expires.
- The Founder Pilot form is the conversion path for real business data or custom pilots.

Full operational checklist: [Business Simulator runbook](docs/business-simulator-runbook.md).
Lead handling checklist: [Founder Pilot Delivery Playbook](docs/founder-pilot-delivery.md).

Production verification shortcut:

```bash
npm run check:production
```

## Railway Deployment

This repo includes `railway.json`. Create a Railway service from `benn4105/reuben-web` and set the `NEXT_PUBLIC_REUX_DEMO_URL` variable.

## Architecture Notes

- **Marketing pages** live under `src/app/(marketing)/` with a shared layout.
- **Simulator pages** live under `src/app/simulator/` with a separate sidebar layout.
- **Simulation logic** is in `src/lib/simulation/` - see the [simulation README](src/lib/simulation/README.md) for the API contract.
- The simulator uses a **live-first, mock-fallback** pattern: it tries the real Reux backend first, and falls back to a local engine when the backend is unavailable.
