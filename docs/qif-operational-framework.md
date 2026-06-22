# QIF Operational Framework

## Mission

Convert discovered quality theory into an operational framework that can be executed by humans, AI agents, or hybrid organizations.

QIF exists to discover what an organization means by quality, structure that meaning as Quality Intents, evaluate evidence against those intents, and govern changes as the organization learns.

## Non Goals

QIF must not:

- reduce quality to page count, review count, test count, ticket count, or any other activity volume
- assume software development is the default domain
- require a prior quality standards document
- require prior project history
- rely only on veteran intuition without externalizing cases and evidence

## Entity Model

### Mission

Purpose: States why the organization or initiative exists.

Attributes:

- id
- statement
- stakeholder_refs
- context_refs
- status

Lifecycle:

- proposed
- active
- revised
- retired

Relationships:

- Mission defines the top-level value context for Quality Intents.
- Mission is constrained by Risks and Loss Boundaries.

### Stakeholder

Purpose: Identifies who receives value, absorbs loss, or has legitimate authority.

Attributes:

- id
- name
- category
- needs
- harms_to_avoid

Lifecycle:

- identified
- validated
- monitored
- retired

Relationships:

- Stakeholders are referenced by Missions, Risks, Quality Intents, and Verdicts.

### Context

Purpose: Defines the operating situation in which quality is judged.

Attributes:

- id
- scope
- domain
- constraints
- assumptions
- time_horizon

Lifecycle:

- observed
- framed
- active
- changed
- archived

Relationships:

- Context qualifies every Risk, Quality Intent, Evidence item, and Verdict.

### Risk

Purpose: Represents uncertainty that can affect value or create loss.

Attributes:

- id
- statement
- stakeholder_refs
- context_refs
- severity
- likelihood
- detectability
- risk_appetite
- loss_boundary

Lifecycle:

- identified
- assessed
- treated
- monitored
- retired

Relationships:

- Risk motivates one or more Quality Intents.
- Risk is tested by Evidence and summarized in Verdicts.

### Quality Intent

Purpose: Defines what quality means for a specific value and loss boundary.

Attributes:

- id
- statement
- purpose
- stakeholder_refs
- context_refs
- risk_refs
- source_refs
- governance_owner
- status
- acceptance_criteria

Lifecycle:

- discovered
- candidate
- validated
- active
- revised
- deprecated
- retired

Relationships:

- Quality Intent is derived from Knowledge Sources.
- Quality Intent addresses Risks.
- Quality Intent is evaluated by Evidence.
- Quality Intent receives Verdicts.

### Knowledge Source

Purpose: Records where quality knowledge came from.

Attributes:

- id
- source_type
- title
- owner
- reliability
- access_mode
- extraction_method

Lifecycle:

- identified
- sampled
- analyzed
- trusted
- superseded
- archived

Relationships:

- Knowledge Sources produce candidate Quality Intents and Evidence.

### Evidence

Purpose: Provides observable support, contradiction, or uncertainty for a Quality Intent.

Attributes:

- id
- source_ref
- intent_refs
- method
- finding
- polarity
- confidence_inputs
- confidence
- collected_at

Lifecycle:

- planned
- collected
- normalized
- scored
- reviewed
- superseded

Relationships:

- Evidence references Knowledge Sources and Quality Intents.
- Evidence contributes to Verdict confidence.

### Indicator

Purpose: Represents a measurement used as evidence, not as quality itself.

Attributes:

- id
- name
- metric_kind
- value
- unit
- interpretation
- linked_intent_ref
- linked_risk_ref

Lifecycle:

- proposed
- instrumented
- observed
- interpreted
- retired

Relationships:

- Indicators can support Evidence only when linked to a Quality Intent and Risk.

### Evaluation Run

Purpose: Defines one bounded evaluation of evidence against Quality Intents.

Attributes:

- id
- scope
- evaluated_intent_refs
- evidence_refs
- confidence_policy
- verdicts
- evaluator_refs

Lifecycle:

- planned
- evidence-collected
- scored
- reviewed
- closed

Relationships:

- Evaluation Runs produce Verdicts.

### Verdict

Purpose: States the current quality judgment for one Quality Intent.

Attributes:

- intent_ref
- decision
- confidence
- evidence_refs
- rationale
- residual_risk

Lifecycle:

- draft
- reviewed
- accepted
- challenged
- superseded

Relationships:

- Verdict depends on Evidence and confidence policy.
- Verdict may trigger governance changes.

### Governance Event

Purpose: Records how quality knowledge changes over time.

Attributes:

- id
- event_type
- target_ref
- reason
- decision
- approver_refs
- evidence_refs

Lifecycle:

- proposed
- reviewed
- approved
- applied
- audited

Relationships:

- Governance Events introduce, revise, deprecate, or retire Quality Intents.

### Acceptance Gate

Purpose: Defines what must be true before a QIF package is accepted.

Attributes:

- id
- name
- required_artifact_refs
- criteria

Lifecycle:

- defined
- checked
- passed
- failed
- revised

Relationships:

- Acceptance Gates validate package completeness and operational readiness.

## Relationship Model

Canonical flow:

```text
Mission
  -> Stakeholder Value
  -> Risk and Loss Boundary
  -> Quality Intent
  -> Knowledge Source
  -> Evidence
  -> Confidence
  -> Verdict
  -> Governance Event
```

Operational trace:

```text
Discovery Session
  -> Candidate Quality Intent
  -> Validation
  -> Active Quality Intent
  -> Evaluation Run
  -> Verdict
  -> Acceptance Gate
  -> Governance Review
```

## Discovery Workflow

### When Documentation Exists

1. Inventory policy, standards, contracts, procedures, training, checklists, and audit reports.
2. Extract stated values, prohibited outcomes, approval criteria, and exception rules.
3. Convert each value and loss boundary into candidate Quality Intents.
4. Record contradictions between documents and actual behavior as Risks.
5. Validate candidates with stakeholders and evidence owners.

### When Project History Exists

1. Sample prior acceptance decisions, incidents, escalations, rework, complaints, and success stories.
2. Identify moments where the organization said "acceptable", "not acceptable", or "acceptable only if".
3. Extract decision cues, hidden thresholds, and tradeoffs.
4. Link each cue to stakeholders, risks, and evidence.
5. Convert repeated patterns into candidate Quality Intents.

### When Only Operations Exist

1. Observe work-as-done, handoffs, controls, informal checks, and exception handling.
2. Identify what operators protect even when no standard says so.
3. Map operational controls to risks and loss boundaries.
4. Compare normal work and stressed work to expose real quality priorities.
5. Create candidate Quality Intents from operational invariants.

### When Only Human Expertise Exists

1. Ask experts to judge concrete cases, not abstract definitions.
2. Capture pass, fail, and conditional pass decisions.
3. Ask what cue changed the verdict.
4. Convert cues into attributes, loss boundaries, and evidence requirements.
5. Use teach-back with another expert or AI agent to check whether the judgment can be reproduced.

## Evaluation Workflow

1. Define evaluation scope and active context.
2. Select Quality Intents to evaluate.
3. Collect Evidence from Knowledge Sources.
4. Score each Evidence item using confidence inputs:
   - source reliability
   - relevance
   - coverage
   - recency
   - independence
   - contradiction penalty
5. Calculate Evidence confidence:

```text
confidence =
  (source_reliability * 0.25)
  + (relevance * 0.25)
  + (coverage * 0.20)
  + (recency * 0.15)
  + (independence * 0.15)
  - contradiction_penalty
```

6. Calculate Verdict confidence as the mean confidence of referenced Evidence.
7. Produce a Verdict:
   - achieved
   - partially-achieved
   - not-achieved
   - inconclusive
   - waived
8. Record rationale and residual risk.
9. Route low confidence, contradiction, or waiver to governance review.

## Governance Workflow

### Introduce New Quality Intent

1. Create candidate intent from discovery.
2. Link it to stakeholders, context, risks, and sources.
3. Require review by:
   - Visionary for value alignment
   - Builder for executability
   - Guardian for risk and evidence quality
4. Promote to active only when evidence requirements and owner are clear.

### Revise Quality Intent

1. Trigger revision from new evidence, incident, context change, stakeholder change, or repeated inconclusive verdicts.
2. Preserve prior version and rationale.
3. Compare old and new loss boundaries.
4. Re-run acceptance gates.

### Retire Quality Intent

1. Identify obsolete intent through context change, replaced controls, or no longer relevant stakeholder need.
2. Confirm no active risk depends on it.
3. Record retirement governance event.
4. Archive evidence and verdict history.

## Acceptance Framework

A QIF package is acceptable only when all gates pass:

1. Entity completeness: required entity families exist.
2. Relationship integrity: all references resolve.
3. Lifecycle integrity: active Quality Intents have governance owners and status.
4. Evidence traceability: every Verdict links to Evidence and every Evidence links to a source.
5. Confidence reproducibility: stored confidence matches the canonical formula.
6. Volume metric guardrail: activity-count indicators are evidence-only and never quality-itself.
7. Verdict discipline: achieved verdicts meet confidence thresholds.
8. Governance readiness: changes to intents are represented by governance events.
9. Runtime evidence: implementation and review decisions have recorded artifact refs.

## Council Judgment Pattern

QIF uses three review perspectives:

- Visionary: protects purpose, stakeholder value, and long-horizon quality meaning.
- Builder: protects operational feasibility, schema clarity, and workflow executability.
- Guardian: protects risk boundaries, evidence quality, and misuse of weak metrics.

An AI agent may issue a verdict only if it can cite the Quality Intent, Evidence, confidence inputs, and applicable governance rule.

