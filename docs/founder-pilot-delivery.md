# Founder Pilot Delivery Playbook

This playbook turns a Founder Pilot request into a small, deliverable Reux-backed simulator without inventing a custom project process each time.

## Goal

The Founder Pilot is not a sales call with vague promises. It is a focused delivery package:

1. One real business decision.
2. One baseline model.
3. Three to five scenarios.
4. A Reux-backed recommendation flow.
5. A short decision report the customer can review.

The pilot should prove that Reux can make messy spreadsheet decisions explicit, repeatable, and explainable.

## Intake Sources

Founder Pilot requests can arrive from:

- `/simulator`
- `/simulator/[id]`
- `/projects/reux/demo`
- `/contact`
- Direct email to `buildreuben.dev@gmail.com`

The preferred path is the native Founder Pilot form because it submits to the Railway `/api/pilot-requests` endpoint and includes the page URL and, when available, a saved simulation run ID.

## First Response SLA

Reply within 24 hours.

Use this response:

```text
Subject: Reuben Founder Pilot - next steps

Hi [Name],

Thanks for requesting a Reuben Founder Pilot.

The best starting point is one real decision you are currently modeling in a spreadsheet or talking through with your team. Examples: hiring vs. automation, pricing changes, capacity planning, overtime reduction, supplier risk, or process improvement.

Please send:

1. The decision you need to make.
2. The baseline numbers you trust today.
3. Two to five possible options you are considering.
4. The metrics that matter most, such as margin, cost, risk, productivity, cycle time, or revenue.
5. Any constraints or assumptions that should not be violated.

Once I have that, I will scope the pilot model and send back the proposed simulation structure before building anything.

Steven
Reuben
```

## Intake Checklist

Before accepting a pilot, collect:

- Customer name and email.
- Company or project context.
- Decision owner.
- Decision deadline.
- Current spreadsheet, notes, or source assumptions.
- Baseline values.
- Scenario options.
- Metrics that define success.
- Risk factors or constraints.
- Whether the result can be shown publicly as a case study.

Do not request sensitive personal data, regulated health data, payment data, or private employee-level information for the public demo workflow.

## Qualification Rules

Accept the pilot if:

- The decision can be modeled with numeric assumptions.
- The baseline can be stated clearly.
- There are at least two realistic scenario options.
- The output can be judged by measurable metrics.
- The first version can be built without integrating private systems.

Defer or decline if:

- The request requires legal, medical, financial, or safety-critical advice.
- The model needs private production system access before it can be useful.
- The customer wants a broad platform build instead of one pilot decision.
- The data cannot be shared safely.

## Pilot Scope Template

Create this scope before implementation:

```text
Pilot name:
Decision:
Audience:
Decision deadline:

Baseline assumptions:
- [metric]: [value]

Scenarios:
1. [scenario name]
   - Changes:
   - Expected tradeoff:

2. [scenario name]
   - Changes:
   - Expected tradeoff:

Primary metrics:
- [metric]

Risk signals:
- [risk]

Recommendation rule:
- Prefer the scenario that [rule].

Out of scope:
- [anything explicitly excluded]
```

## Reux Modeling Workflow

Use this sequence:

1. Translate the customer baseline into named assumptions.
2. Normalize units before writing any model.
3. Write the initial Reux simulation in plain language comments first.
4. Add formulas for the core metrics.
5. Add scenarios as explicit assumption overrides.
6. Add recommendation objectives.
7. Run the model locally.
8. Compare output against the customer spreadsheet.
9. Adjust formulas only when the customer confirms the assumption.
10. Prepare a short decision report.

Keep the first pilot intentionally small. The goal is clarity, not a giant modeling engine.

## Delivery Checklist

Before sending the pilot result:

- The model has one clear baseline.
- Every scenario has a short name and explanation.
- Output metrics match the agreed scope.
- The recommendation explains why it won.
- The report lists at least two watchouts.
- The Reux snippet is visible or attached.
- Any assumptions that are estimates are marked as estimates.
- The customer can rerun or review the result without an admin token.

## Decision Report Template

```text
Subject: Reuben Founder Pilot result - [decision]

Hi [Name],

I modeled the decision we scoped:

[one sentence decision summary]

Recommended option:
[scenario name]

Why:
- [reason 1]
- [reason 2]
- [reason 3]

Watchouts:
- [watchout 1]
- [watchout 2]

What changed from the baseline:
- [metric delta]
- [metric delta]

Reux model summary:
[short explanation of the assumptions, formulas, and objectives]

Next step:
If this matches how you think about the decision, the next step is to turn the pilot into a reusable simulator workflow for your team.

Steven
Reuben
```

## Repository Handoff

If the pilot becomes a build task:

- Add customer-specific examples under a private project area, not the public demo.
- Keep public example data synthetic.
- Add documentation for assumptions, formulas, scenarios, and limitations.
- Do not hard-code private customer data into reusable Reux examples.

## Success Criteria

A Founder Pilot is successful when the customer can say:

- The model captures the decision accurately enough to discuss.
- The recommendation is explainable.
- The assumptions are easy to challenge.
- The scenario comparison is more useful than the spreadsheet they started with.
- They understand why Reux exists.
