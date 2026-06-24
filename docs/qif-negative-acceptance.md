# QIF Negative Acceptance

## Mission

Negative Acceptance defines forbidden states that must not be present for a Quality Intent to be considered satisfied.

It complements positive acceptance.

Positive acceptance asks:

```text
What must be true?
```

Negative acceptance asks:

```text
What must not be true, even if the positive checks pass?
```

## Why It Matters

Many quality failures pass positive checks.

Examples:

- the button exists, but it hides a confused data boundary;
- the document exists, but users cannot tell whether it is a template or submitted record;
- the review count is high, but no one reviewed the actual loss boundary;
- the AI produced a recommendation, but it is displayed as if it were approved judgment;
- the handoff form is complete, but critical state remains ambiguous.

Negative Acceptance prevents QIF from becoming a checklist completion framework.

## Definition

A Negative Acceptance Criterion is a traceable statement of a forbidden state.

It must be grounded in:

- a Quality Intent;
- a Loss Boundary;
- a stakeholder, operator, reviewer, auditor, customer, or downstream process that would be harmed;
- evidence that can detect the forbidden state.

## Canonical Attributes

| Attribute | Purpose |
| --- | --- |
| criterion id | Stable identifier. |
| protected quality intent ref | Quality Intent this criterion protects. |
| loss boundary ref | Loss Boundary that would be crossed. |
| forbidden state | What must not be true. |
| rationale | Why this state is harmful. |
| applicability | When this criterion applies. |
| detection method | How the forbidden state can be detected. |
| evidence required | Evidence needed to show the state is absent or present. |
| severity | Impact if the forbidden state occurs. |
| owner | Role or group accountable for resolving violations. |
| exceptions | Explicit conditions where the criterion may be waived. |
| governance trigger | When violation or uncertainty requires governance. |
| lifecycle status | proposed, active, satisfied, violated, waived, retired. |

## Lifecycle

### Proposed

The criterion is identified during discovery, pre-implementation review, expert judgment extraction, incident review, or governance.

### Active

The criterion is accepted as part of the evaluation plan.

### Satisfied

Evidence indicates the forbidden state is absent for the evaluated target.

### Violated

Evidence indicates the forbidden state is present.

### Waived

The forbidden state is accepted temporarily or conditionally by an authorized governance decision.

Waivers must record:

- owner;
- reason;
- evidence;
- expiration or review date;
- affected target;
- residual risk.

### Retired

The criterion no longer applies because the Quality Intent, context, target, or loss boundary changed.

## Relationship To QIF Entities

```text
Quality Intent
-> Loss Boundary
-> Negative Acceptance Criterion
-> Evidence
-> Verdict
-> Governance Trigger
```

Negative Acceptance is not a separate definition of quality.

It is a guardrail that protects a Quality Intent from false satisfaction.

## Design Rules

### 1. Tie It To Loss

Bad:

```text
The UI must not have too many buttons.
```

Better:

```text
The editing surface must not contain controls that make users confuse editable source data with read-only analysis, because that can cause users to modify the wrong artifact or trust derived projections as source of truth.
```

### 2. State The Forbidden State Directly

Bad:

```text
Make sample project handling better.
```

Better:

```text
Sample data must not be loaded as the default state of a newly created user project.
```

### 3. Include Detection Evidence

Bad:

```text
Users should understand the screen.
```

Better:

```text
A first-use walkthrough must not leave the user unable to identify what is editable, what is generated, and what is sample data.
```

### 4. Avoid Activity Counts As Quality

Bad:

```text
At least ten negative acceptance checks were reviewed.
```

Better:

```text
Each high-severity loss boundary has at least one negative acceptance criterion with detection evidence or an explicit governance waiver.
```

### 5. Preserve Exceptions

Negative Acceptance is not always absolute.

If exceptions exist, record:

- who can waive it;
- under what condition;
- with what evidence;
- for how long;
- with what residual risk.

## Examples

### Software And UI

Quality Intent:

New users must understand whether they are editing their own project or inspecting an example.

Forbidden State:

Sample data is displayed as the default state of a newly created user project.

Detection Method:

Start the application without a project URL and inspect the loaded project file and visible data.

Evidence Required:

- default project file reference;
- absence of sample entities in default state;
- explicit sample URL or import path.

### Repository Review

Quality Intent:

Repository changes must not make release state ambiguous.

Forbidden State:

A changelog entry claims a feature is released while package version, tag, or release notes do not match.

Detection Method:

Compare package metadata, changelog, release notes, git tag, and release URL.

### Operations

Quality Intent:

Operators must be able to take over work safely after handoff.

Forbidden State:

Handoff is marked complete while the current equipment state is unknown or inferred without evidence.

Detection Method:

Run a handoff simulation with a substitute operator and inspect required evidence fields.

### Accounting

Quality Intent:

Payment approval must preserve delegated authority.

Forbidden State:

Urgent-payment workflow allows approval by a role below the required authority threshold.

Detection Method:

Review workflow path, authority matrix, and sample high-value payment scenario.

### Maintenance

Quality Intent:

Equipment must not be returned to service before safety status is clear.

Forbidden State:

Repair status implies safe-to-use before inspection evidence exists.

Detection Method:

Trace status transitions from repair complete to inspection complete to safe-to-use.

### Administration

Quality Intent:

Templates must guide users without becoming false records.

Forbidden State:

Placeholder text is submitted, stored, or routed as if it were user-provided content.

Detection Method:

Submit a request with unchanged placeholder text and inspect validation behavior.

### AI Agent Work

Quality Intent:

AI-generated recommendations must preserve judgment authority.

Forbidden State:

Generated recommendation text is displayed or stored as approved decision without reviewer evidence or delegated authority.

Detection Method:

Inspect decision metadata, reviewer reference, authority policy, and audit trail.

## Anti-Patterns

| Anti-pattern | Why it fails |
| --- | --- |
| Negative acceptance as a long generic checklist. | Reintroduces activity-count quality. |
| Forbidden state without loss boundary. | The criterion becomes preference, not quality. |
| No detection method. | The criterion cannot support a verdict. |
| No exceptions or waiver practice. | Real governance becomes invisible. |
| Verifier claims semantic truth. | Structural checks cannot prove organizational quality. |

## Verifier Boundary

A future verifier may check that:

- each Negative Acceptance Criterion links to a Quality Intent;
- each criterion links to a Loss Boundary;
- each criterion has a forbidden state and detection method;
- each violated or uncertain criterion links to evidence or a Governance Trigger;
- each waiver has owner, reason, evidence, expiration, and residual risk.

The verifier must not claim that:

- the criterion is semantically sufficient;
- the organization chose the right loss boundary;
- users truly understand the concept;
- governance made the correct decision.

## Use With Pre-Implementation Review

Negative Acceptance is most valuable before implementation.

Use it to ask:

- What failure would make this proposed solution unacceptable?
- What boundary must not be hidden by this UI, document, workflow, or automation?
- What would a positive acceptance check miss?
- What would a junior person, non-expert user, operator, or AI agent likely misunderstand?
- What evidence would prove that the forbidden state is absent?

