# Business Simulator Operational Runbook

This runbook is for keeping the public Business Simulator demo deliverable and safe to share.

## Production URLs

| Surface | URL | Purpose |
|---|---|---|
| Reuben website | `https://reuben-web.vercel.app` | Public marketing site and simulator frontend |
| Business Simulator | `https://reuben-web.vercel.app/simulator` | Public demo entry point |
| Scenario builder | `https://reuben-web.vercel.app/simulator/new` | Public template/scenario builder |
| Reux backend | `https://reux-pilot-demo-production.up.railway.app` | Railway API used by the public demo |
| Backend health | `https://reux-pilot-demo-production.up.railway.app/api/health` | API health and executable model check |

## Required Production Configuration

Vercel must have:

```env
NEXT_PUBLIC_REUX_DEMO_URL=https://reux-pilot-demo-production.up.railway.app
```

Rules:

- Do not include a trailing slash.
- Set it for Production and Preview if preview deploys should use the live backend.
- If this value is missing, the simulator intentionally falls back to local mock data and the header shows `Local Mock`.

Railway must have:

- A healthy Reux backend service.
- A healthy PostgreSQL service attached to the backend.
- The backend service able to reach `DATABASE_URL`.
- The business simulation schema/migrations applied.
- `operations_decision` available in `/api/health` and `/api/reux/simulations`.

## Before Sharing the Demo Link

Run these from the repo root:

```bash
npm run lint
npm run build
npm run test:e2e:simulator
npm run check:production
```

Then manually confirm:

- `/simulator` shows `Live Connected`, not `Local Mock`.
- `/simulator/new` loads all four templates.
- A guided demo can run without login, admin token, or private data.
- The result page shows recommendation, forecast chart, scenario comparison, Reux transparency, and pilot CTA.
- The pilot CTA opens `/contact` with `Business Simulator Pilot` selected and a prefilled message.

## Deployment Checklist

1. Push to `main`.
2. Wait for the Vercel production deployment to finish.
3. Open `https://reuben-web.vercel.app/simulator`.
4. Confirm the backend status badge says `Live Connected`.
5. Run `npm run check:production`.
6. Run one browser demo:
   - Open `/simulator/new?preset=optimization`.
   - Run the simulation.
   - Copy the saved result link.
   - Open the result link in a new tab.
   - Click `Start Pilot` and verify the contact form prefill.

## Smoke Check Details

`npm run check:production` verifies:

- Website routes render and contain expected demo CTAs.
- The Railway API health endpoint responds.
- Reux simulation catalog includes executable models.
- `operations_decision` can run through the Reux API.
- Business Simulator saved-run creation works.
- Saved-run reload works.
- Recent run listing works for the current demo session.

To test a preview deployment:

```bash
npm run check:live-demo -- --site https://your-preview.vercel.app --api https://your-railway-service.up.railway.app
```

## Expected Public Behavior

- Public users can run the demo without an account.
- Public users do not need an admin token.
- Templates use sample assumptions only.
- Saved result links are temporary.
- Configuration links remain useful even if a saved run expires.
- Contact/pilot CTA is the conversion path for real business data.

## Common Failure Modes

### Website Shows `Local Mock`

Likely cause:

- `NEXT_PUBLIC_REUX_DEMO_URL` is missing or wrong in Vercel.

Fix:

1. Open Vercel project settings.
2. Confirm `NEXT_PUBLIC_REUX_DEMO_URL` exists for the active environment.
3. Confirm value is `https://reux-pilot-demo-production.up.railway.app`.
4. Redeploy the website.
5. Run `npm run check:production`.

### Website Shows `Backend Fallback`

Likely causes:

- Railway backend is offline.
- Railway backend health endpoint is failing.
- Database is unavailable.
- Network check timed out.

Fix:

1. Open Railway project.
2. Confirm backend service is online.
3. Open backend logs.
4. Confirm PostgreSQL service is online.
5. Open `/api/health`.
6. Redeploy backend if needed.
7. Run `npm run check:production`.

### Saved Runs Do Not Reload

Likely causes:

- Backend saved-run storage is unavailable.
- Demo session header behavior changed.
- Saved run expired.

Fix:

1. Run `npm run check:production`.
2. Confirm the `business simulator saved run` and `saved run reload` checks.
3. If only old links fail, create a fresh run and use the new link.
4. If fresh links fail, check Railway logs for `/api/simulation-runs`.

### Templates Load but Runs Fail

Likely causes:

- Backend validation contract changed.
- `operations-decision` template IDs drifted.
- Assumption names no longer match the API.

Fix:

1. Run `npm run test:e2e:simulator`.
2. Run `npm run check:production`.
3. Check recent commits touching `src/lib/simulation/api-client.ts`, `src/lib/simulation/templates.ts`, or backend simulation schemas.
4. Align frontend request shape with backend validation errors.

## Quick Incident Checklist

When the public demo is not working:

1. Is Vercel production deployed successfully?
2. Is `NEXT_PUBLIC_REUX_DEMO_URL` set correctly?
3. Does `/simulator` show `Live Connected`?
4. Does Railway `/api/health` return `ok: true`?
5. Does `npm run check:production` pass?
6. Does a fresh guided demo run from `/simulator/new?preset=optimization`?
7. If not, check Railway logs first, then frontend adapter changes.

## Ownership Notes

- Website/frontend repo: `benn4105/reuben-web`.
- Backend/Reux repo: `benn4105/Reux`.
- Public demo frontend deploys from Vercel.
- Public demo backend deploys from Railway.
- This repo owns the visitor experience, frontend adapter, public docs, smoke script, and sales flow.
