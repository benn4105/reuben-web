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
  await checkWebsiteRoute("/simulator", ["Business Simulator", "Reux Model Catalog"]);
  await checkWebsiteRoute("/projects/reux/demo", ["Try Business Simulator", "Open Fullscreen"]);
  await checkApiHealth();
  await checkReuxCatalog();
  await checkOperationsRun();

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
  const health = await fetchJson(`${apiUrl}/api/health`);
  const productSimulations = Array.isArray(health.productSimulations) ? health.productSimulations : [];

  checks.push({
    name: "api health",
    ok: health.ok === true && productSimulations.includes("operations_decision"),
    detail: `${productSimulations.length} executable models`,
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

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}: ${text.slice(0, 240)}`);
  }

  try {
    return JSON.parse(text);
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
