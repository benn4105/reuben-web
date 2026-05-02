import type { Simulation } from "./types";

function formatCurrency(value: number): string {
  return `$${value.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

function filenameFor(simulation: Simulation, extension: string): string {
  return `${simulation.name.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_report.${extension}`;
}

function downloadTextFile(filename: string, content: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function exportToCsv(simulation: Simulation): void {
  const rows: Array<Array<string | number | undefined>> = [
    ["Report", simulation.name],
    ["Generated At", new Date().toISOString()],
    ["Recommended Scenario", recommendedScenarioName(simulation)],
    ["Recommendation", simulation.comparison?.recommendationReason ?? ""],
    [],
    ["Scenario Summary"],
    [
      "Scenario Name",
      "Role",
      "Employees",
      "Hourly Cost",
      "Weekly Demand",
      "Productivity (u/e/w)",
      "Weekly Margin",
      "Margin %",
      "Risk Score",
      "Workforce Load %",
    ],
    ...simulation.scenarios.map((scenario, index) => {
      const isBaseline = index === 0 || scenario.id === simulation.comparison?.baseline.id;
      const inputs = scenario.inputs;
      const metrics = scenario.summary;

      return [
        inputs.name,
        isBaseline ? "Baseline" : "Alternative",
        inputs.employees,
        inputs.avgHourlyCost,
        inputs.weeklyDemand,
        metrics.productivity.toFixed(1),
        metrics.margin,
        metrics.marginPct,
        metrics.riskScore,
        metrics.workforceLoad,
      ];
    }),
    [],
    ["Scenario Deltas"],
    ["Scenario Name", "Metric", "Baseline", "Scenario", "Delta", "Delta %", "Direction"],
    ...deltaRows(simulation),
    [],
    ["Forecast Timeline"],
    ["Scenario Name", "Period", "Revenue", "Operating Cost", "Margin", "Productivity", "Risk Score", "Workforce Load %"],
    ...simulation.scenarios.flatMap((scenario) =>
      scenario.forecast.map((point) => [
        scenario.inputs.name,
        point.label,
        point.revenue,
        point.operatingCost,
        point.margin,
        point.productivity,
        point.riskScore,
        point.workforceLoad,
      ])
    ),
  ];

  downloadTextFile(filenameFor(simulation, "csv"), rows.map(csvRow).join("\n"), "text/csv;charset=utf-8;");
}

export function exportToPdf(simulation: Simulation): void {
  const recommendation = simulation.comparison?.recommendationReason;
  const summaryRows = simulation.scenarios.map((scenario) => `
    <tr>
      <td>${escapeHtml(scenario.inputs.name)}${simulation.comparison?.recommendedId === scenario.id ? " (recommended)" : ""}</td>
      <td>${formatCurrency(scenario.summary.margin)}</td>
      <td>${formatPercent(scenario.summary.marginPct)}</td>
      <td>${scenario.summary.riskScore}/100</td>
      <td>${formatPercent(scenario.summary.workforceLoad)}</td>
      <td>${scenario.summary.productivity} u/e/w</td>
    </tr>
  `).join("");
  const deltaHtml = deltaRows(simulation).slice(0, 32).map(([scenarioName, metric, , , delta, deltaPct, direction]) => `
    <tr>
      <td>${escapeHtml(scenarioName)}</td>
      <td>${escapeHtml(metric)}</td>
      <td>${Number(delta).toLocaleString()}</td>
      <td>${Number(deltaPct).toFixed(1)}%</td>
      <td>${escapeHtml(direction)}</td>
    </tr>
  `).join("");
  const timelineRows = simulation.scenarios.flatMap((scenario) =>
    scenario.forecast.slice(-3).map((point) => `
      <tr>
        <td>${escapeHtml(scenario.inputs.name)}</td>
        <td>${escapeHtml(point.label)}</td>
        <td>${formatCurrency(point.revenue)}</td>
        <td>${formatCurrency(point.operatingCost)}</td>
        <td>${formatCurrency(point.margin)}</td>
        <td>${point.riskScore}/100</td>
      </tr>
    `)
  ).join("");
  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(simulation.name)} report</title>
  <style>
    body { color: #111827; font-family: Arial, sans-serif; margin: 32px; }
    h1 { font-size: 24px; margin: 0 0 4px; }
    h2 { font-size: 15px; margin: 28px 0 8px; }
    .meta { color: #6b7280; font-size: 12px; margin-bottom: 20px; }
    .recommendation { background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 14px; }
    table { border-collapse: collapse; font-size: 11px; width: 100%; }
    th, td { border: 1px solid #d1d5db; padding: 7px; text-align: left; }
    th { background: #111827; color: #fff; }
    tr:nth-child(even) td { background: #f8fafc; }
    @media print { button { display: none; } body { margin: 20px; } }
  </style>
</head>
<body>
  <h1>Reux Business Simulator Report</h1>
  <div class="meta">${escapeHtml(simulation.name)} | Generated ${new Date().toLocaleString()}</div>
  ${recommendation ? `<section class="recommendation"><strong>Recommendation</strong><br>${escapeHtml(recommendation)}</section>` : ""}
  <h2>Scenario Summary</h2>
  <table>
    <thead><tr><th>Scenario</th><th>Weekly Margin</th><th>Margin %</th><th>Risk</th><th>Load</th><th>Productivity</th></tr></thead>
    <tbody>${summaryRows}</tbody>
  </table>
  <h2>Scenario Deltas</h2>
  <table>
    <thead><tr><th>Scenario</th><th>Metric</th><th>Delta</th><th>Delta %</th><th>Direction</th></tr></thead>
    <tbody>${deltaHtml}</tbody>
  </table>
  <h2>Final Forecast Periods</h2>
  <table>
    <thead><tr><th>Scenario</th><th>Period</th><th>Revenue</th><th>Operating Cost</th><th>Margin</th><th>Risk</th></tr></thead>
    <tbody>${timelineRows}</tbody>
  </table>
  <script>window.print();</script>
</body>
</html>`;
  const report = window.open("", "_blank", "noopener,noreferrer");
  if (report) {
    report.document.write(html);
    report.document.close();
    return;
  }

  downloadTextFile(filenameFor(simulation, "html"), html, "text/html;charset=utf-8;");
}

function csvRow(values: Array<string | number | undefined>): string {
  return values
    .map((value) => {
      const text = value === undefined ? "" : String(value);
      return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
    })
    .join(",");
}

function recommendedScenarioName(simulation: Simulation): string {
  const recommended = simulation.scenarios.find((scenario) => scenario.id === simulation.comparison?.recommendedId);
  return recommended?.inputs.name ?? "";
}

function deltaRows(simulation: Simulation): Array<[string, string, number, number, number, number, string]> {
  if (!simulation.comparison) return [];

  return Object.entries(simulation.comparison.deltas).flatMap(([scenarioId, deltas]) => {
    const scenarioName = simulation.scenarios.find((scenario) => scenario.id === scenarioId)?.inputs.name ?? scenarioId;

    return deltas.map((delta): [string, string, number, number, number, number, string] => [
      scenarioName,
      delta.label,
      delta.baseline,
      delta.scenario,
      delta.delta,
      delta.deltaPct,
      delta.direction,
    ]);
  });
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
