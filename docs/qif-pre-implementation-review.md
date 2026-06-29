# QIF Pre-Implementation Review

## Mission

Pre-Implementation Review uses QIF before work is built.

Its purpose is to prevent mistaken quality hypotheses, not merely to validate artifacts after implementation.

QIF remains a standalone framework. This review can be used by humans, AI agents, or hybrid teams without AOF.

## Problem

Teams can pass structural verification while still building the wrong thing.

Common failure modes:

- the task starts from a solution instead of a user problem;
- acceptance criteria only state what should exist, not what must be prevented;
- sample, template, seed, draft, and real user data are confused;
- editor, projection, governance, and analysis responsibilities are mixed;
- users can see UI elements but cannot understand what they mean;
- verification checks that elements exist, but not whether the concept is comprehensible;
- a prior implementation is later corrected, but the rejected assumption is not recorded.

Pre-Implementation Review exists to catch these failures before implementation.

## Non-Goals

Pre-Implementation Review must not:

- replace QIF Evidence, Verdict, or Governance workflows;
- create a fixed quality category checklist;
- treat the number of reviewed prompts as quality;
- require AOF;
- require software development artifacts;
- assume UI work;
- claim semantic truth from structural verification alone.

## Core Principle

Do not start by asking whether the proposed solution is implemented well.

Start by asking whether the proposed solution protects the right loss boundary.

```text
User problem
-> protected loss boundary
-> quality intent
-> proposed solution
-> negative acceptance
-> evidence plan
-> implementation decision
```

## When To Use

Use Pre-Implementation Review when a change:

- adds or removes a user-facing workflow;
- changes a data boundary, source of truth, template, sample, seed, or default state;
- changes operational handoff or responsibility;
- introduces AI-generated work products or agent decisions;
- turns expert judgment into reusable rules;
- adds review, governance, or compliance controls;
- increases conceptual load;
- begins with a solution-shaped task title.

Examples of solution-shaped task titles:

- add blank canvas mode;
- add a toggle for sample data;
- add approval dashboard;
- add automated review checklist;
- add retry workflow.

These may be valid solutions, but QIF should first ask which failure they prevent.

## Review Entities

### Proposed Change

The work being considered.

Owns:

- proposed change summary;
- target artifact, process, service, document, or decision;
- intended users or operators;
- proposed implementation direction;
- known constraints.

Must not own:

- final quality verdict;
- accepted organizational policy;
- post-implementation evidence.

### User Problem

The failure, confusion, burden, or risk that motivates the work.

Owns:

- affected party;
- current pain or risk;
- expected loss if unchanged;
- evidence source.

Must not own:

- the preferred implementation;
- solution acceptance.

### Assumption Under Review

A belief that must hold for the proposed change to be valid.

Examples:

- users need a switch, not a separate project file;
- sample data helps first use rather than confusing initial state;
- one screen can safely mix editing and analysis;
- operators can infer responsibility from labels;
- reviewers understand the domain terms.

### Boundary Under Review

A boundary that could be confused by the proposed change.

Boundary types:

- data boundary;
- responsibility boundary;
- source-of-truth boundary;
- lifecycle boundary;
- authority boundary;
- evidence boundary;
- user/comprehension boundary;
- operational handoff boundary.

### Negative Acceptance Criterion

A forbidden state that would invalidate the proposed solution even if positive acceptance passes.

Negative acceptance is defined in more detail in `docs/qif-negative-acceptance.md`.

### Pre-Implementation Verdict

The decision about whether implementation should proceed.

Allowed verdicts:

| Verdict | Meaning |
| --- | --- |
| proceed | The problem, loss boundary, negative acceptance, and evidence plan are clear enough to implement. |
| reframe | The task should be renamed or reframed around the real problem before implementation. |
| split | The proposed solution mixes responsibilities or boundaries and should be split. |
| defer | More discovery or evidence is needed before implementation. |
| reject | The proposed solution is likely to create the forbidden state or protect the wrong boundary. |

## Workflow

### 1. Capture The Proposed Change

Record:

- what is proposed;
- who asked for it;
- what target it changes;
- what the proposed solution assumes;
- what must remain out of scope.

Do not accept the proposed implementation as the project frame yet.

### 2. Reframe Problem Before Solution

Ask:

- What user, operator, reviewer, stakeholder, or downstream process is harmed today?
- What failure does this proposed work prevent?
- What would remain bad even if the proposed feature were implemented exactly as requested?
- Is the task title naming the problem or naming a solution?
- What alternative could solve the same problem with less conceptual load?

If the task cannot be stated without naming the solution, the review should produce `reframe`.

### 3. Identify Protected Loss Boundaries

Ask:

- What must not happen?
- Who is harmed if it happens?
- What boundary is crossed?
- Is the boundary about data, authority, comprehension, operation, trust, time, money, safety, compliance, or reversibility?
- Is the boundary non-negotiable, negotiable with evidence, or merely preferred?

The proposed solution should not proceed until it maps to at least one loss boundary.

### 4. Review Boundaries Before UI Or Process Shape

Use this step when the change touches data, defaults, samples, templates, files, handoffs, views, or authority.

Ask:

- What is the source of truth?
- What is sample, template, seed, draft, real, archived, or generated data?
- What is editable, review-only, projected, or governed?
- Which boundary would a first-time user likely misunderstand?
- Can two things be separated by data model or routing instead of by a UI toggle?
- Does the proposed solution hide the real boundary behind a control?

If boundary confusion is likely, the review should produce `split`, `reframe`, or `reject`.

### 5. Review Concept Comprehension

Ask:

- What does the user think they are looking at?
- What can the user change?
- What is read-only?
- What is generated or inferred?
- Which domain terms are visible?
- Which terms require prior expert knowledge?
- Can a non-expert explain the screen, document, process, or artifact in one sentence?

QIF should treat failure to understand the work surface as a quality risk, not merely a UX preference.

### 6. Define Negative Acceptance

For each Quality Intent, define at least one forbidden state when the risk warrants it.

Examples:

- sample data must not be presented as the default state of a new user project;
- review-only analysis must not appear inside the editing surface;
- a template must not be stored as if it were submitted production data;
- an AI-generated recommendation must not be presented as approved human judgment;
- a maintenance handoff must not leave equipment status ambiguous.

Negative acceptance must be tied to a loss boundary.

It must not be counted as quality by volume.

### 7. Plan Evidence Before Implementation

Define evidence that will be collected after implementation.

Evidence may include:

- source inspection;
- document review;
- scenario walkthrough;
- browser or interface verification;
- operator dry run;
- stakeholder review;
- unseen-case reproduction test;
- audit trace;
- incident comparison;
- counterexample check.

The evidence plan should say what would fail the review, not only what would pass.

Classify each evidence item by independence:

| Independence | Meaning | Examples |
| --- | --- | --- |
| high | Observes the target through a user-visible, operator-visible, or externally reproducible path. | Open the published URL and verify the behavior; run a handoff with a substitute operator; inspect an exported report as an auditor. |
| medium | Exercises the same behavior through a local or internal path, but still observes real output. | Local browser test; rendered document inspection; CLI verifier against the generated artifact. |
| low | Infers correctness from code reading, symmetry, naming, screenshots without scoring, or assumed equivalent paths. | "The editor path works, so the viewer path should work"; "the component renders in the contact sheet"; "the same function name is used." |

Low-independence evidence may support investigation, but it must not be the only evidence for a high-severity loss boundary.

### 8. Produce Pre-Implementation Verdict

Use the verdict table above.

If the verdict is `proceed`, the implementation task should include:

- problem statement;
- protected loss boundary;
- Quality Intent;
- negative acceptance;
- evidence plan;
- known assumptions;
- governance trigger conditions.

If the verdict is `reframe`, `split`, `defer`, or `reject`, record why.

## Done-Before Guardian Questions

Before a task, review, or agent run is marked done, ask three fixed questions:

1. What other path, surface, role, or downstream process could still violate the same loss boundary?
2. What other artifact depends on the same assumption that made this solution look safe?
3. Does the change affect a public, irreversible, delegated, financial, safety, compliance, or customer-visible state?

If any answer is uncertain, the verdict should not be plain `proceed`.

Use:

- `defer` when evidence is missing;
- `split` when another path or surface needs separate evaluation;
- `reframe` when the task is still solution-shaped;
- `governance trigger` when uncertainty affects a non-negotiable or high-severity loss boundary.

## Evidence Strength Rules

Evidence is stronger when it is:

- independent of the implementation assumption being tested;
- observed through the same path used by the affected stakeholder;
- reproducible by a non-expert or AI agent;
- tied to a specific negative acceptance criterion;
- able to detect failure, not only success.

Evidence is weaker when it is:

- based only on code reading;
- based on a happy path;
- based on analogy with a different path;
- based on rendered existence without interpretation;
- produced by the same agent that made the implementation decision.

QIF may record weak evidence, but weak evidence should increase residual risk or trigger follow-up review when the loss boundary is severe.

## Rubric-Based Visual Verification

For visual, document, UI, diagram, or rendered-output work, a screenshot or exported file is not automatically evidence.

Visual evidence should be scored against an explicit rubric.

Minimum rubric dimensions:

| Dimension | Question |
| --- | --- |
| grounding | Is the rendered state connected to the real target, source, or user data being evaluated? |
| visibility | Can the affected user see the critical state or distinction? |
| size and fit | Does text, control, diagram, or artifact content fit its container without truncation or overlap? |
| interpretation | Can the user tell what is editable, generated, sample, projected, approved, or read-only? |
| downstream path | Does the rendered state match what the downstream user, public URL, exported file, or operator will see? |

Negative acceptance example:

```text
The review must not pass merely because a screenshot exists if the screenshot was not scored against the visual rubric tied to the protected loss boundary.
```

## Living QIF Ledger

When a bug, incident, exception, review miss, or user correction is discovered, QIF should update the quality knowledge, not only fix the artifact.

Record:

- which Quality Intent was violated or under-specified;
- which Loss Boundary was crossed or nearly crossed;
- which evidence was weaker than assumed;
- which negative acceptance criterion was missing;
- which residual risk remains after the fix;
- whether a new task, governance event, or Decision Pattern is required.

The ledger prevents the same mistaken assumption from being rediscovered in every project.

Ledger flow:

```text
Bug or miss
-> affected Quality Intent
-> crossed or threatened Loss Boundary
-> evidence weakness
-> missing negative acceptance
-> residual risk
-> task, governance event, or Decision Pattern update
```

## Quality Intents

### QIN-PRE-IMPLEMENTATION-HONESTY

Quality Intent:

The proposed work must be framed around the stakeholder failure it prevents, not merely around the solution requested.

Loss Boundary:

The organization must not implement a solution that passes local acceptance while failing to protect the actual stakeholder loss boundary.

Evidence:

- problem statement does not require the proposed solution name;
- alternatives were considered;
- assumptions under review are explicit;
- negative acceptance exists for major failure modes.

### QIN-DATA-BOUNDARY-INTEGRITY

Quality Intent:

The work must preserve clear boundaries between data states, sources, and authority levels.

Examples:

- sample vs user data;
- template vs submitted artifact;
- draft vs approved record;
- generated recommendation vs accepted judgment;
- operational state vs historical incident;
- source evidence vs derived inference.

Loss Boundary:

Users, operators, auditors, or AI agents must not act on data whose status, source, or authority is ambiguous.

### QIN-CONCEPT-COMPREHENSION

Quality Intent:

The intended user or reviewer must be able to understand what the artifact, screen, process, or recommendation is for, what can be changed, and what is only evidence or projection.

Loss Boundary:

The work must not pass merely because controls render or documents exist while target users cannot understand the concepts needed to act safely.

### QIN-RESPONSIBILITY-SEPARATION

Quality Intent:

Editable work surfaces, projections, governance views, examples, templates, and loaders must not be mixed in a way that hides responsibility.

Loss Boundary:

A user, operator, reviewer, or agent must not mistake analysis for editable source, sample for live state, or recommendation for approved decision.

## Domain-General Examples

### Software Repository

Proposed solution:

Add a toggle between blank and sample project.

Pre-implementation review:

- User problem: first-time user does not know what the workspace means.
- Boundary under review: new project vs sample project.
- Negative acceptance: sample data must not appear as the default state of a new project.
- Verdict: reframe or split.

Better direction:

Load an empty project by default and load sample data only through an explicit sample project route.

### Operations

Proposed solution:

Add a shift handoff checklist.

Pre-implementation review:

- User problem: outgoing and incoming operators disagree about system state.
- Boundary under review: observed state vs assumed state.
- Negative acceptance: handoff must not allow equipment status to remain ambiguous.
- Evidence plan: dry run with a substitute operator.

### Accounting

Proposed solution:

Add an approval shortcut for urgent payments.

Pre-implementation review:

- User problem: urgent payments miss deadlines.
- Boundary under review: speed vs delegated authority.
- Negative acceptance: shortcut must not bypass required approval authority.
- Governance trigger: any waiver must record owner, reason, amount, and expiration.

### Maintenance

Proposed solution:

Add a repair status field.

Pre-implementation review:

- User problem: equipment returns to service with unclear safety status.
- Boundary under review: repaired, inspected, safe-to-use, and pending-review states.
- Negative acceptance: status must not imply safe-to-use before inspection evidence exists.

### Administration

Proposed solution:

Create a standard template for employee requests.

Pre-implementation review:

- User problem: requests arrive with missing context.
- Boundary under review: template guidance vs submitted record.
- Negative acceptance: template placeholder text must not be stored as if it were user-submitted content.

### AI Agent Work

Proposed solution:

Let an AI agent approve generated recommendations.

Pre-implementation review:

- User problem: review bottleneck delays low-risk work.
- Boundary under review: generated recommendation vs approved decision.
- Negative acceptance: generated text must not be represented as approved judgment without reviewer evidence or delegated authority.

## Verifier Boundary

A future verifier may check:

- required pre-implementation fields exist;
- Quality Intents link to loss boundaries;
- negative acceptance criteria link to protected Quality Intents;
- evidence plans include failure evidence, not only pass evidence;
- high-severity loss boundaries are not supported only by low-independence evidence;
- done-before Guardian questions were answered before completion;
- visual evidence includes rubric scores when visual interpretation is part of the loss boundary;
- bugs or review misses update the Living QIF Ledger;
- rejected or reframed assumptions are recorded;
- governance triggers exist for unresolved high-risk assumptions.

A verifier must not claim:

- the chosen solution is semantically correct;
- users truly understand the concept;
- the organization has accepted the policy;
- the negative acceptance criteria are sufficient.

Semantic validity still requires stakeholder review, expert review, reproduction tests, operational feedback, and governance.

## Relationship To Discovery Layer

Pre-Implementation Review uses the Discovery Layer before implementation begins.

Relevant Discovery Patterns include:

- Failure Discovery;
- Stakeholder Harm Discovery;
- Human Error Discovery;
- Exception And Waiver Discovery;
- Solution Bias Discovery;
- Boundary Confusion Discovery;
- Concept Comprehension Discovery.

These patterns are strategies for exploration, not mandatory checklist categories.
