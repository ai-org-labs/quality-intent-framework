# QIF v0.4 Quality Gate Runtime Requirements

## Implementation Status

The v0.4.0 quality gate runtime baseline is now executable, not documentation-only.
It is implemented as the `quality-gate` package type:

- Schema: `schemas/quality-gate-package.schema.json`
- Domain-general example: `examples/quality-gate-package.json`
- Verifier: `tools/validate-qif-runtime.mjs` (run with `npm test`)

The baseline covers Phase 1 (evaluation perspectives, quantitative evidence records,
automated evaluation detail, evidence management, quality gate rules, and release gate
decisions with Go / Conditional Go / No-Go / Pending verdicts) plus the Phase 2
post-release review, improvement action, and traceability link entities.
Phase 3 items (external connectors, monitoring integration, automated score calculation,
risk-based timing recommendation) and the standalone Evaluation Timing Decision,
Evidence Retention Policy, Quality Report, and Dashboard View entities remain future work.
The requirements below are retained as the full design target.

## Mission

QIF v0.4 should extend QIF from quality intent representation and review-run traceability into a domain-general quality gate runtime.

The runtime should help humans, AI agents, and hybrid organizations decide:

- which quality perspectives apply to a target;
- when evaluation should happen;
- what quantitative evidence is needed;
- whether evidence is sufficient for a gate decision;
- whether release, operation, or improvement should proceed.

This is not a request to turn QIF into a test-count dashboard.

Quantitative values such as case counts, pass rates, coverage, execution time, incident counts, and recovery time are evidence metadata. They are not quality itself unless they are interpreted through a Quality Intent, Loss Boundary, Evaluation Context, and Verdict rule.

## Background

Existing QIF covers:

- Quality Intents;
- Evidence;
- Verdicts;
- Governance;
- expert judgment extraction;
- discovery sessions;
- applicability rules;
- review runs.

The next gap is broader quality gate operation:

- quantitative evaluation;
- automated test detail;
- evidence management;
- evaluation timing;
- shift-left review;
- release decision support;
- post-release quality review;
- traceability from requirements through incidents and improvement;
- reporting for quality state without reducing quality to checklist completion.

## Non-Goals

QIF v0.4 must not:

- define quality by test count, page count, review count, or dashboard score;
- assume software development is the only domain;
- require GitHub, Jira, CI/CD, monitoring, or any specific external tool;
- treat automated tests as automatically stronger than human or operational evidence;
- treat missing metrics as automatically No-Go without context;
- claim semantic quality truth from structural verifier success;
- optimize for checklist completion instead of loss-boundary protection.

## Core Principle

Quality gate decisions must be evidence-backed but intent-led.

```text
Evaluation Target
-> Applicable Quality Intents
-> Loss Boundaries
-> Evaluation Perspectives
-> Required Evidence
-> Quantitative Evidence Metadata
-> Gate Rule
-> Gate Verdict
-> Residual Risk
-> Governance or Improvement
```

## Required Capability Areas

### 1. Evaluation Perspective Management

QIF should record which perspectives are used to evaluate a target.

Canonical perspectives:

| Perspective | Purpose |
| --- | --- |
| functional quality | Whether the target satisfies intended behavior or service outcome. |
| regression quality | Whether existing behavior, service, control, or obligation remains intact. |
| automation | Whether evaluation is repeatable through automated, semi-automated, or scheduled methods. |
| coverage | Whether important functions, states, roles, paths, interfaces, or risks were explored. |
| quantitative evidence | Whether counts, rates, durations, frequencies, and impact values are recorded. |
| evidence traceability | Whether evidence can be located, interpreted, and retained. |
| continuity | Whether evaluation happens repeatedly, not only once. |
| shift-left | Whether risks are detected during requirements, design, or early implementation. |
| release decision | Whether Go, Conditional Go, No-Go, or Pending can be justified. |
| operational quality | Whether post-release incidents, customer impact, recovery, and monitoring are evaluated. |
| improvement | Whether findings lead to recurrence prevention and measurable learning. |
| external dependency | Whether suppliers, services, libraries, regulators, or partner processes create quality risk. |

These perspectives are not mandatory checklist categories. They are selection candidates driven by applicability rules.

### 2. Quantitative Evidence Records

QIF should support quantitative values as structured evidence metadata.

| Quantity Type | Example Values |
| --- | --- |
| how many | test cases, target screens, target APIs, affected functions, defects, incidents, approvals. |
| how much | pass rate, failure rate, coverage, automation rate, critical-path coverage, evidence sufficiency. |
| how long | test execution time, evaluation period, recovery time, lead time, evidence retention period. |
| how often | per pull request, daily, weekly, pre-release, post-incident, scheduled audit. |
| impact | affected users, inquiries, outage duration, financial impact, safety exposure, compliance exposure. |

Each quantitative record should include:

- metric name;
- value;
- unit;
- measurement method;
- target reference;
- evidence reference;
- collection time;
- collection environment;
- interpretation rule;
- known limitation;
- related Quality Intent or Loss Boundary.

### 3. Automated Evaluation Detail

When automated or semi-automated evaluation exists, QIF should record execution details.

Attributes:

- evaluation type: unit, integration, E2E, API, performance, security, compliance, operational drill, audit sampling;
- execution mode: automated, manual, semi-automated;
- tool name;
- tool version where relevant;
- environment;
- trigger: pull request, merge, release candidate, schedule, incident, audit, manual gate;
- executed case count;
- passed, failed, skipped, blocked counts;
- pass rate;
- duration;
- report URL or artifact reference;
- screenshots, videos, logs, traces, or exported reports;
- evidence independence rating;
- associated negative acceptance criteria.

Automated evidence should still be evaluated for relevance and independence.

### 4. Evidence Management

QIF should link verdicts to retained evidence.

Evidence types:

- test report;
- CI/CD log;
- screenshot;
- video;
- coverage report;
- static analysis result;
- defect list;
- review record;
- approval history;
- risk acceptance;
- monitoring result;
- incident report;
- customer complaint;
- audit record;
- operational drill result.

Required metadata:

- evaluation target;
- execution time;
- target version, branch, release, or effective date;
- evaluator or approving role;
- environment;
- evidence URL or artifact reference;
- retention period;
- sensitivity or access handling;
- integrity or change-history policy.

### 5. Evaluation Timing Decisions

QIF should determine when evaluation is required based on target context and risk.

Timing candidates:

| Timing | Evaluation Focus |
| --- | --- |
| planning or requirements | Quality goals, acceptance conditions, non-functional concerns, stakeholder risks. |
| design completion | design review, architecture risk, impact analysis, operational handoff. |
| implementation or change review | automated tests, static analysis, review evidence, compatibility. |
| integration or staging | E2E, API, performance, security, regression, data migration. |
| release decision | Go/No-Go criteria, residual risk, approval, rollback, monitoring. |
| immediately after release | incidents, alerts, logs, customer impact, rollback readiness. |
| post-release interval | incident trends, inquiries, recurrence prevention, improvement effect. |
| major change | impact scope, focused regression, added evidence. |
| post-incident | root cause, corrective action, added tests, recurrence prevention. |

Example rules:

| Condition | Required Evaluation |
| --- | --- |
| critical user path changed | E2E evidence, regression evidence, release review. |
| API contract changed | contract test, compatibility evidence, impact analysis. |
| authentication, payment, authority, or safety boundary changed | focused E2E, security or control review, rollback evidence. |
| performance-sensitive behavior changed | load or response-time comparison. |
| external dependency changed | integration evidence, failure-mode evidence, SLA or support review. |
| production incident occurred | RCA, corrective action, added evidence, improvement review. |
| release candidate prepared | gate verdict, residual risk, approval, rollback, monitoring plan. |

### 6. Shift-Left Evaluation

QIF should evaluate whether quality was created early enough.

Shift-left evidence examples:

- requirement acceptance criteria;
- Quality Intent defined before implementation;
- non-functional concern identified early;
- design review completed;
- risk analysis completed;
- impact analysis completed;
- test strategy created before implementation;
- early automated checks in pull request;
- security or compliance check before release;
- defect detected before later-stage or production escape.

Quantitative values such as review rate, early defect detection rate, or late escape rate are useful only when they explain whether a Loss Boundary was protected earlier.

### 7. Release Gate Decisions

QIF should support release verdicts.

Allowed release verdicts:

| Verdict | Meaning |
| --- | --- |
| Go | Evidence supports release; residual risk is acceptable. |
| Conditional Go | Release is allowed only under explicit conditions, owners, and monitoring. |
| No-Go | A non-negotiable loss boundary or required gate rule is violated. |
| Pending | Required evidence, approval, or risk interpretation is missing. |

Gate decision inputs:

- required evidence status;
- test or evaluation result;
- unresolved critical or high defects;
- residual risks;
- risk acceptance owner;
- rollback plan;
- monitoring plan;
- customer impact plan;
- approval history;
- exception or waiver.

### 8. Post-Release Quality Review

QIF should track quality after release or operational change.

Post-release evidence:

- incidents in 7-day and 30-day windows;
- severity distribution;
- affected users or customers;
- inquiry, complaint, or support volume;
- MTTR and initial response time;
- change failure rate;
- rollback occurrence;
- RCA completion;
- CAPA completion;
- added test or control evidence;
- improvement effect in later releases.

Post-release review should feed the Living QIF Ledger.

### 9. Traceability

QIF should trace quality knowledge across lifecycle records.

Trace links:

| Source | Links To |
| --- | --- |
| requirement | acceptance criteria, design, test case, Quality Intent. |
| design | review record, risk, implementation change. |
| implementation | pull request, commit, CI result, review. |
| test or evaluation | case, execution result, evidence artifact, verdict. |
| defect | reproduction, fix, retest, residual risk. |
| release | gate verdict, approval, rollback, monitoring. |
| incident | root cause, recurrence prevention, added evidence. |
| improvement | corrective action, effect measurement, retired risk. |

### 10. Reports And Dashboards

QIF may produce reports or dashboards, but dashboards are secondary views over evidence and verdicts.

Possible report sections:

- quality perspective summary;
- evidence sufficiency by Quality Intent;
- quantitative evidence table;
- automation and execution frequency;
- release readiness;
- shift-left state;
- post-release incident trend;
- improvement status;
- unresolved residual risks;
- governance triggers.

Scores must be explainable and traceable to Quality Intents, Loss Boundaries, evidence, and rules.

## Candidate Entities

Future schema work should consider these entities:

- Evaluation Perspective;
- Quantitative Evidence Record;
- Automated Evaluation Detail;
- Evidence Retention Policy;
- Evaluation Timing Rule;
- Evaluation Timing Decision;
- Quality Gate Rule;
- Quality Gate Decision;
- Release Gate Verdict;
- Post-Release Review;
- Traceability Link;
- Evidence Sufficiency Finding;
- Quality Report;
- Dashboard View;
- Improvement Action.

## Workflow Requirements

### Evaluation Planning

```text
Evaluation Target
-> Applicability Rules
-> Evaluation Perspectives
-> Timing Decision
-> Required Evidence
-> Gate Plan
```

### Evaluation Execution And Evidence Collection

```text
Gate Plan
-> Evaluation Activity
-> Quantitative Evidence Records
-> Evidence Artifacts
-> Evidence Sufficiency Finding
```

### Evidence Gap Detection

```text
Required Evidence
-> Collected Evidence
-> Missing Evidence
-> Pending, Conditional Go, or Governance Trigger
```

### Quality Gate Decision

```text
Quality Intent
-> Loss Boundary
-> Gate Rule
-> Evidence
-> Residual Risk
-> Go / Conditional Go / No-Go / Pending
```

### Post-Release Review

```text
Release Gate Decision
-> Monitoring Evidence
-> Incident / Customer Impact
-> RCA / CAPA
-> Living QIF Ledger
-> Updated Quality Intents or Gate Rules
```

## Verifier Boundary

A future verifier may check:

- required entities exist;
- references resolve;
- gate decisions link to evidence;
- quantitative records include units and measurement methods;
- release decisions include residual risk and approval owner;
- No-Go and Pending triggers are structurally enforced;
- post-release reviews link incidents to improvement actions;
- dashboard scores are traceable to evidence and rules.

A verifier must not claim:

- the organization chose the right quality perspectives;
- the metrics prove quality by themselves;
- automated tests prove absence of defects;
- a Go verdict is semantically correct without accountable review;
- a dashboard score is quality itself.

## Phased Implementation

### Phase 1

- Evaluation Perspective management.
- Quantitative Evidence Records.
- Evidence management.
- Automated Evaluation Detail.
- Evaluation Timing Rules and Decisions.
- Release Gate Decisions.

### Phase 2

- Shift-left evaluation.
- Post-release quality review.
- Traceability links.
- Reports and dashboard views.

### Phase 3

- External evidence collection connectors.
- Monitoring integration.
- Automated quality score calculation.
- Risk-based timing recommendation.

## Acceptance Criteria

QIF v0.4 implementation should demonstrate:

1. Evaluation perspectives are selected for a target through explicit applicability logic.
2. Automated, manual, and semi-automated evaluation methods can be recorded.
3. How many, how much, how long, how often, and impact values can be recorded with units and evidence references.
4. Test reports, logs, screenshots, CI results, reviews, approvals, and monitoring records can be linked as evidence.
5. Evaluation timing can be selected or justified.
6. Shift-left evidence can be evaluated without treating early activity counts as quality itself.
7. Release Go, Conditional Go, No-Go, and Pending verdicts can be produced.
8. Residual risk, approval owner, rollback plan, and monitoring plan can be recorded.
9. Post-release incidents, customer impact, recurrence prevention, and improvement status can be recorded.
10. Reports or dashboards can explain their values through traceable QIF evidence and rules.

