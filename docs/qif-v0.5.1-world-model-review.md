# QIF v0.5.1 World Model Review

QIF World Model Review is the pre-verdict layer that checks whether humans and
AI agents are looking at the same conceptual world before they evaluate quality.

It exists because a quality verdict can be structurally traceable and still be
wrong when the target world is undefined. If key concepts, actors, authority
boundaries, state transitions, or coordinate axes are missing, the right QIF
behavior is to name the exact missing part and explain why evaluation is unsafe
or lower-confidence.

## Purpose

World Model Review detects quality risks caused by conceptual mismatch:

- undefined or overloaded concepts;
- missing actor, responsibility, or authority boundaries;
- missing state and event definitions;
- unclear relationships between domain entities;
- unverified assumptions used by humans or AI;
- missing coordinate axes for severity, authority, time, reversibility,
  confidence, or operational impact;
- loss boundaries that are not connected to the model used for judgment.

This is not a checklist of generic modeling tasks. A finding must say what is
specifically missing from this target and which quality decision it affects.

## Runtime Flow

```text
World Model
-> Concept Definition
-> Domain Entity / Actor / Boundary / Relationship
-> State / Event / Invariant
-> Coordinate System / Coordinate Axis
-> Assumption
-> Model Evidence
-> World Model Gap Finding
-> Resolution Action
-> Quality Intent
-> Governance Trigger
```

The package type is:

```text
world-model-review
```

The executable example is:

```text
examples/world-model-review-package.json
```

The local verifier is:

```text
tools/validate-world-model-review.mjs
```

## Core Entities

### World Model

Defines the target world being evaluated: scope, context, owner, and status.

It must not become a generic enterprise ontology. It is the model needed to
prevent quality judgment mismatch for a specific target.

### Concept Definition

Defines terms such as approval, done, incident, customer impact, or exception.

The verifier requires concepts to belong to a World Model. Ambiguous concepts
are allowed, but ambiguity must remain explicit and can be referenced by a gap
finding.

### Domain Entity

Represents a business, operational, product, software, administrative,
maintenance, support, or AI-agent entity inside the model.

It must link to a Concept Definition and at least one Boundary.

### Actor

Represents a human, team, organization, AI agent, system, or external party.

It must link to a responsibility boundary and at least one authority boundary.
This prevents AI recommendations from being mistaken for accountable approval.

### Boundary

Defines scope, responsibility, authority, data, time, risk, or loss boundaries.

Loss boundaries connect World Model Review to standard QIF Quality Intents.

### Relationship

Defines how model entities depend on, authorize, review, own, produce, consume,
or affect each other.

Relationships must resolve both ends and must not point an entity to itself.

### State / Event / Invariant

Defines what states exist, what events cause state changes, and what must never
be violated.

These are required when quality depends on phrases such as approved, complete,
active, rejected, blocked, waived, or retired.

### Coordinate System / Coordinate Axis

Defines how judgments are located in a shared evaluation space.

Examples:

- authority explicitness;
- evidence freshness;
- severity;
- reversibility;
- responsibility;
- operational state;
- confidence.

The verifier requires axes to define a scale and how missing values are handled.

### Perspective

Defines whose view of quality is being represented.

AI must not silently collapse governance, operator, customer, auditor, and
developer perspectives into one implied viewpoint.

### Assumption

Records a model assumption, its status, evidence, affected entities, and
confidence.

Unverified assumptions are not forbidden. They must be explicit.

### Model Evidence

Records the artifact or observation that supports the world model.

It carries `trust` metadata and may carry `findingEvidence` metadata when an AI
or reviewer produced a concrete finding from the artifact.

### World Model Gap Finding

The central v0.5.1 entity.

A gap finding must specify:

- `gapObjectType`: what kind of model part is missing or insufficient;
- `missingItem`: the exact missing thing;
- `expectedDefinition`: what definition would have been sufficient;
- `observedProblem`: what was observed instead;
- `whyItMatters`: how the gap can cause wrong judgment;
- `affectedQualityIntentRefs`: which Quality Intents are affected;
- `affectedDecisionRefs`: which decisions become unsafe or lower-confidence;
- `evidenceRefs`: what supports the finding;
- `requiredResolutionActionRefs`: what must be done to resolve it;
- `verdictEffect`: whether evaluation is blocked, confidence is degraded,
  governance is required, or residual risk is recorded;
- `findingEvidence` and `trust`: how the finding was generated, reproduced,
  verified, and freshness-controlled.

This makes the required behavior concrete:

```text
Do not say only: Conceptual modeling is insufficient.

Say: The final approval authority boundary is missing. The expected definition
must name who can approve, under which conditions, with what evidence, and how
delegation works. Without that, the AI may mistake a passing review status for
accountable release approval. This blocks release verdict evaluation until the
authority boundary is defined.
```

### Resolution Action

Defines the work required to close a gap.

It must link back to the finding and include acceptance criteria. A finding's
referenced resolution actions must reference the same finding.

### Governance Trigger

Routes model gaps to governance when the verdict effect blocks evaluation or
requires governance.

## Verifier Rules

The v0.5.1 verifier checks that:

- every entity id is unique within its collection;
- every World Model Review entity references an existing World Model when
  required;
- Domain Entities link to concepts and boundaries;
- Actors link to responsibility and authority boundaries;
- Relationships resolve both ends and do not self-reference;
- States, Events, Invariants, Coordinate Systems, Perspectives, and Assumptions
  resolve their references;
- Coordinate Axes define scales, examples, and missing-value handling;
- Model Evidence carries confidence and `trust`;
- verified trust has at least one source and verifier;
- confirmed `findingEvidence` is reproducible, false-positive checked, and
  impact-confirmed;
- every World Model Gap Finding names the exact missing item, expected
  definition, observed problem, why it matters, affected quality intents,
  affected decisions, evidence, resolution actions, verdict effect, confidence,
  finding evidence, trust, and status;
- blocking or governance-required findings cite Governance Triggers;
- referenced Resolution Actions and Governance Triggers point back to the same
  finding;
- the verifier boundary explicitly does not claim semantic truth.

## Verifier Boundary

The verifier proves structural integrity and traceability. It does not prove:

- semantic truth;
- business correctness;
- expert correctness;
- that the actual domain model is sufficient;
- that stakeholder disagreement has been resolved.

Semantic validity requires domain expert review, stakeholder confirmation,
operational feedback, and governance decisions.

## Acceptance Criteria

QIF v0.5.1 is working when `npm test` proves:

1. a valid `world-model-review` package passes;
2. invalid packages that omit the specific missing item, expected definition,
   affected decisions, evidence, resolution actions, governance trigger, trust,
   or finding evidence fail;
3. the Living QIF Ledger can reference a World Model Gap Finding and the
   Quality Intent derived from it;
4. no verifier output claims semantic truth.
