const DEFAULT_SITE_URL = "https://reuben-web.vercel.app";
const DEFAULT_API_URL = "https://reux-pilot-demo-production.up.railway.app";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  const value = process.argv[index + 1];
  if (key?.startsWith("--") && value) args.set(key.slice(2), value);
}

const siteUrl = normalizeUrl(args.get("site") ?? process.env.REUBEN_SITE_URL ?? DEFAULT_SITE_URL);
const apiUrl = normalizeUrl(args.get("api") ?? process.env.NEXT_PUBLIC_REUX_DEMO_URL ?? DEFAULT_API_URL);
const checks = [];

async function main() {
  await checkWebsiteRoute("/", ["Try the Business Simulator", "Explore Reux", "Start Here"]);
  await checkWebsiteRoute("/projects/reux", ["Reux Programming Language", "Try the Business Simulator", "Developer Preview", "Roadmap"]);
  await checkWebsiteRoute("/simulator", ["Business Simulator", "Reux Model Catalog"]);
  await checkWebsiteRoute("/simulator/new", ["Build Simulation", "Preparing simulation model", "New Simulation"]);
  await checkWebsiteRoute("/projects/reux/demo", ["Try Business Simulator", "Open Fullscreen"]);
  await checkWebsiteRoute("/docs", ["Developer Preview", "VS Code", "Try Business Simulator", "View Roadmap"]);
  await checkWebsiteRoute("/projects/reux/roadmap", ["Roadmap", "Developer Preview Launch", "Business Simulator MVP"]);
  await checkApiHealth();
  await checkReuxCatalog();
  await checkOperationsRun();
  await checkBusinessSimulatorSavedRun();
  await checkPilotRequestRoute();
  await checkContactIntakeRoute();

  console.log("");
  for (const check of checks) {
    console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}${check.detail ? ` - ${check.detail}` : ""}`);
  }

  const failed = checks.filter((check) => !check.ok);
  if (failed.length > 0) {
    console.error(`\n${failed.length} live demo check${failed.length === 1 ? "" : "s"} failed.`);
    process.exitCode = 1;
    return;
  }

  console.log(`\nLive demo checks passed for ${siteUrl} and ${apiUrl}.`);
}

async function checkWebsiteRoute(path, requiredText) {
  const url = `${siteUrl}${path}`;
  const response = await fetch(url);
  const html = await response.text();
  const missing = requiredText.filter((text) => !html.includes(text));

  checks.push({
    name: `website ${path}`,
    ok: response.ok && missing.length === 0,
    detail: response.ok
      ? missing.length === 0
        ? `${html.length} bytes`
        : `missing: ${missing.join(", ")}`
      : `HTTP ${response.status}`,
  });
}

async function checkApiHealth() {
  const { body: health, headers } = await fetchJsonWithHeaders(`${apiUrl}/api/health`);
  const productSimulations = Array.isArray(health.productSimulations) ? health.productSimulations : [];
  const apiVersion = health.apiVersion ?? headers.get("x-reux-api-version");

  checks.push({
    name: "api health",
    ok: health.ok === true && productSimulations.includes("operations_decision"),
    detail: `${productSimulations.length} executable models${apiVersion ? `, api ${apiVersion}` : ", missing api version"}`,
  });
}

async function checkReuxCatalog() {
  const catalog = await fetchJson(`${apiUrl}/api/reux/simulations`);
  const simulations = Array.isArray(catalog.simulations) ? catalog.simulations : [];
  const names = simulations.map((simulation) => simulation.name);

  checks.push({
    name: "reux simulation catalog",
    ok: names.includes("operations_decision") && names.includes("personal_finance"),
    detail: names.join(", "),
  });
}

async function checkOperationsRun() {
  const response = await fetchJson(`${apiUrl}/api/reux/simulations/operations_decision/run`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      simulationName: "operations_decision",
      assumptions: {
        employees: 50,
        averageHourlyCost: 28,
        weeklyDemand: 1200,
        averageOrderValue: 85,
        grossMarginRate: 0.42,
        productivityGainRate: 0,
        overtimeReductionRate: 0,
        supplierDelayRiskRate: 0.15,
        defectRate: 0.04,
      },
      scenarios: [
        {
          name: "Process Optimization",
          overrides: {
            employees: 50,
            averageHourlyCost: 28,
            weeklyDemand: 1350,
            averageOrderValue: 85,
            grossMarginRate: 0.42,
            productivityGainRate: 0.18,
            overtimeReductionRate: 0.5,
            supplierDelayRiskRate: 0.1,
            defectRate: 0.02,
          },
        },
      ],
    }),
  });

  const periods = response.run?.periods ?? [];
  const scenarios = response.run?.scenarios ?? [];
  const finalScenario = scenarios.find((scenario) => scenario.name === "Process Optimization");
  const finalPeriod = finalScenario?.periods?.at(-1);

  checks.push({
    name: "operations_decision execution",
    ok: response.simulation?.name === "operations_decision" && periods.length === 12 && Boolean(finalPeriod?.metrics?.margin),
    detail: finalPeriod ? `final margin ${Math.round(finalPeriod.metrics.margin)}` : "missing final scenario period",
  });
}

async function checkContactIntakeRoute() {
  const response = await fetchJson(`${siteUrl}/api/contact`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Smoke Test",
      email: "smoke@example.com",
      topic: "business-simulator",
      message: "This honeypot payload should be accepted without delivery.",
      companyWebsite: "https://spam.invalid",
    }),
  });

  checks.push({
    name: "contact intake route",
    ok: response.ok === true && response.spamFiltered === true,
    detail: response.spamFiltered ? "honeypot accepted without delivery" : "unexpected response",
  });
}

async function checkPilotRequestRoute() {
  const response = await fetchJson(`${apiUrl}/api/pilot-requests`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "Smoke Test",
      email: "smoke@example.com",
      decision: "Smoke check that the Founder Pilot route accepts a public intake request.",
      pageUrl: `${siteUrl}/projects/reux/demo`,
    }),
  });

  const accepted = response.ok === true && Boolean(response.request?.id);
  const deliveryStatus = response.delivery?.status ?? "unknown";
  const fallbackEmail = response.delivery?.fallbackEmail;

  checks.push({
    name: "founder pilot intake route",
    ok: accepted && (deliveryStatus === "sent" || fallbackEmail === "buildreuben.dev@gmail.com"),
    detail: accepted
      ? `${response.request.id}, delivery ${deliveryStatus}${fallbackEmail ? `, fallback ${fallbackEmail}` : ""}`
      : "missing request id",
  });
}

async function checkBusinessSimulatorSavedRun() {
  const sessionId = `livecheck${Date.now().toString(36).slice(-6)}`;
  const headers = {
    "content-type": "application/json",
    "x-reux-demo-session": sessionId,
  };
  const run = await fetchJson(`${apiUrl}/api/simulations/run`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Live Check Business Simulation",
      simulationId: "operations-decision",
      baseline: {
        employees: 50,
        averageHourlyCost: 28,
        weeklyDemand: 1200,
        averageOrderValue: 85,
        grossMarginRate: 0.42,
        productivityGainRate: 0,
        overtimeReductionRate: 0,
        supplierDelayRiskRate: 0.15,
        defectRate: 0.04,
        forecastPeriods: 12,
        forecastUnit: "week",
      },
      scenarios: [
        {
          id: "process-improvement",
          name: "Process Improvement",
          assumptions: {
            productivityGainRate: 0.12,
            overtimeReductionRate: 0.18,
          },
        },
      ],
      options: {
        includeTimeline: true,
        includeReuxSource: true,
      },
    }),
  });

  const runId = run.run?.id;
  const runSummaryOk = Boolean(
    runId &&
    run.run?.name === "Live Check Business Simulation" &&
    typeof run.run?.bestMargin === "number" &&
    Array.isArray(run.run?.riskRange) &&
    run.run?.recommendedScenarioId === "process-improvement"
  );

  checks.push({
    name: "business simulator saved run",
    ok: runSummaryOk,
    detail: runId ? `${runId}, best margin ${Math.round(run.run.bestMargin ?? 0)}` : "missing run id",
  });

  if (!runId) return;

  const [saved, list] = await Promise.all([
    fetchJson(`${apiUrl}/api/simulation-runs/${encodeURIComponent(runId)}`, {
      headers: { "x-reux-demo-session": sessionId },
    }),
    fetchJson(`${apiUrl}/api/simulation-runs`, {
      headers: { "x-reux-demo-session": sessionId },
    }),
  ]);

  checks.push({
    name: "business simulator saved run reload",
    ok: saved.run?.id === runId && saved.run?.response?.run?.id === runId && saved.run?.response?.comparison?.recommendedScenarioId === "process-improvement",
    detail: saved.run?.expiresAt ? `expires ${saved.run.expiresAt}` : "missing expiry",
  });

  checks.push({
    name: "business simulator recent run list",
    ok: Array.isArray(list.runs) && list.runs.some((candidate) => candidate.id === runId && candidate.name === "Live Check Business Simulation"),
    detail: Array.isArray(list.runs) ? `${list.runs.length} session run(s)` : "missing runs array",
  });
}

async function fetchJson(url, options) {
  return (await fetchJsonWithHeaders(url, options)).body;
}

async function fetchJsonWithHeaders(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  }

  try {
    return {
      body: JSON.parse(text),
      headers: response.headers,
    };
  } catch (error) {
    throw new Error(`${url} did not return JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function normalizeUrl(value) {
  return value.replace(/\/$/, "");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
