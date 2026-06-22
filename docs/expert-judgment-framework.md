# Expert Judgment Definition Framework

## Mission

Transform tacit expert judgment into reproducible decision patterns that humans, AI agents, and hybrid organizations can apply to new cases.

This framework extends QIF upstream. QIF explains how organizations evaluate Quality Intents once they exist. The Expert Judgment Definition Framework explains how organizations discover those intents from concrete judgments when expertise is still tacit.

## Core Principle

Do not ask experts to define quality in the abstract.

Instead:

1. Present concrete cases.
2. Capture the expert's judgment.
3. Identify the cues that changed the judgment.
4. Map cues to concerns.
5. Map concerns to loss boundaries.
6. Derive reusable decision patterns.
7. Test whether another evaluator can reproduce the judgment on unseen cases.

## Non Goals

This framework must not:

- store vague advice as operational knowledge
- treat expert opinion as automatically correct
- reduce expertise to checklists only
- ignore context, exceptions, or counterexamples
- define quality through page counts, test counts, or review counts
- use extracted knowledge for employee surveillance, ranking, or blame assignment

## Entity Model

### Case

Purpose: Represents a concrete situation that an expert judged.

Attributes:

- id
- title
- domain
- context
- presented_facts
- available_evidence
- actual_outcome
- stakeholder_refs
- source_ref

Lifecycle:

- collected
- normalized
- judged
- reused-for-test
- archived

Relationships:

- Cases are judged through Expert Judgments.
- Cases supply the grounding material for Decision Patterns and Reproduction Tests.

### Expert Judgment

Purpose: Records one expert's decision on one concrete case.

Attributes:

- id
- case_ref
- expert_role
- judgment
- confidence
- primary_cue_refs
- concern_ref
- loss_boundary_ref
- acceptance_conditions
- required_evidence
- waiver_conditions
- similar_case_notes
- junior_miss_risk

Lifecycle:

- elicited
- clarified
- structured
- compared
- superseded

Relationships:

- Expert Judgments reference Cases, Cues, Concerns, and Loss Boundaries.
- Expert Judgments are source material for Decision Patterns.

### Cue

Purpose: Captures an observable signal that changed or anchored judgment.

Attributes:

- id
- statement
- cue_type
- detection_method
- salience
- ambiguity_notes

Lifecycle:

- noticed
- named
- normalized
- validated
- retired

Relationships:

- Cues appear in Expert Judgments and Decision Patterns.
- Multiple Cues may point to the same Concern.

### Concern

Purpose: States what the expert is worried about behind the cue.

Attributes:

- id
- statement
- harm_mode
- affected_parties
- escalation_trigger

Lifecycle:

- inferred
- clarified
- accepted
- revised
- retired

Relationships:

- Concerns are inferred from Cues.
- Concerns map to Loss Boundaries and Decision Patterns.

### Loss Boundary

Purpose: Defines the unacceptable harm or failure line the organization must not cross.

Attributes:

- id
- statement
- severity
- irreversibility
- stakeholder_refs
- waiver_authority

Lifecycle:

- proposed
- agreed
- active
- revised
- retired

Relationships:

- Loss Boundaries justify Concerns, Decision Patterns, and derived Quality Intents.

### Decision Pattern

Purpose: Converts repeated judgments into a reusable and testable decision rule.

Attributes:

- id
- title
- trigger_cue_refs
- applicable_context
- concern_ref
- loss_boundary_ref
- typical_decision
- acceptance_conditions
- evidence_required
- exceptions
- counterexample_refs
- source_judgment_refs
- confidence
- reproduction_test_ref

Lifecycle:

- candidate
- structured
- reproduced
- validated
- challenged
- revised
- retired

Relationships:

- Decision Patterns are synthesized from Expert Judgments.
- Decision Patterns derive candidate or active Quality Intents.
- Decision Patterns are bounded by Applicability Boundaries and Counterexamples.

### Applicability Boundary

Purpose: Defines where a Decision Pattern is valid and where it is not.

Attributes:

- id
- pattern_ref
- included_contexts
- excluded_contexts
- assumptions
- invalidation_signals

Lifecycle:

- drafted
- tested
- accepted
- revised
- retired

Relationships:

- Every validated Decision Pattern requires an Applicability Boundary.

### Counterexample

Purpose: Captures a case that looks similar but should not produce the same decision.

Attributes:

- id
- case_ref
- pattern_ref
- distinguishing_factors
- effect_on_pattern

Lifecycle:

- observed
- compared
- incorporated
- archived

Relationships:

- Counterexamples constrain Decision Patterns and Applicability Boundaries.

### Quality Intent Derivation

Purpose: Translates one or more Decision Patterns into reusable QIF Quality Intents.

Attributes:

- id
- pattern_refs
- derived_intent_statement
- rationale
- status
- qif_intent_ref

Lifecycle:

- drafted
- reviewed
- validated
- activated
- revised

Relationships:

- Quality Intent Derivations connect expert judgment extraction to QIF.

### Reproduction Test

Purpose: Verifies whether non-experts or AI agents can apply a pattern to unseen cases with acceptable agreement.

Attributes:

- id
- pattern_ref
- evaluator_type
- unseen_case_refs
- expected_decisions
- observed_agreement
- failure_analysis
- result

Lifecycle:

- designed
- executed
- reviewed
- passed
- failed
- rerun

Relationships:

- Reproduction Tests validate Decision Patterns.
- Failed tests trigger revision or retirement.

### Organizational Quality Culture

Purpose: Aggregates many Decision Patterns into an organizational decision character.

Attributes:

- id
- name
- non_negotiable_loss_boundary_refs
- preferred_evidence
- risk_appetite
- escalation_norms
- waiver_practices
- repeated_fears
- quality_tradeoffs
- subgroup_differences
- pattern_refs

Lifecycle:

- observed
- synthesized
- compared
- governed
- revised

Relationships:

- Organizational Quality Culture is inferred from repeated patterns, disagreements, waivers, and escalations across roles and departments.

### Review History Inference

Purpose: Records candidate patterns inferred from historical records before validation.

Attributes:

- id
- source_type
- source_refs
- inferred_pattern_summary
- supporting_clues
- confidence
- status

Lifecycle:

- mined
- clustered
- inferred
- candidate
- validated-or-rejected

Relationships:

- Review History Inferences feed candidate Decision Patterns.
- They remain provisional until concrete-case validation and reproduction testing.

## Relationship Model

Canonical extraction path:

```text
Case
  -> Expert Judgment
  -> Cue
  -> Concern
  -> Loss Boundary
  -> Decision Pattern
  -> Applicability Boundary
  -> Counterexample
  -> Reproduction Test
  -> Quality Intent Derivation
  -> QIF Quality Intent
```

Organizational aggregation path:

```text
Repeated Judgments
  -> Repeated Concerns
  -> Repeated Loss Boundaries
  -> Decision Pattern Set
  -> Organizational Quality Culture
  -> Governance
```

Historical inference path:

```text
Review Comments / Approvals / Rejections / Incidents / Notes / Tickets / Complaints / Audits
  -> Review History Inference
  -> Candidate Decision Pattern
  -> Reproduction Test
  -> Validated Pattern or Rejection
```

## Interview Prompts

Use case-grounded prompts:

- Is this case acceptable, unacceptable, or conditionally acceptable?
- What changed your judgment?
- What did you notice first?
- What failure are you trying to avoid?
- Who would be harmed if this passed?
- What evidence would make you comfortable?
- Under what condition would you waive this concern?
- Have you seen a similar case before?
- What happened then?
- What would a junior person likely miss here?

Add follow-ups only when needed:

- Which cue mattered most?
- Which cue was misleading?
- What would make the same cue harmless in another context?
- Which part is non-negotiable and which part is tradeoff?

## Tacit Knowledge Extraction Workflow

### 1. Expert Interview Extraction

1. Select concrete cases that include acceptable, unacceptable, and borderline examples.
2. Present one case at a time without asking for theory first.
3. Record the judgment outcome: acceptable, unacceptable, or conditionally acceptable.
4. Ask which cue was noticed first and which cue changed the decision.
5. Ask what failure the expert is trying to avoid.
6. Ask who would be harmed and where the unacceptable line sits.
7. Ask what evidence would reduce discomfort or justify acceptance.
8. Ask when the concern could be waived.
9. Ask for similar prior cases and what happened.
10. Structure the result into Case, Expert Judgment, Cue, Concern, and Loss Boundary artifacts.

### 2. Decision Pattern Extraction

1. Cluster judgments that cite similar cues and concerns.
2. Separate stable cues from incidental details.
3. Define the recurring concern and explicit loss boundary.
4. Write the typical decision and acceptance conditions.
5. Record required evidence, exceptions, and waiver conditions.
6. Add at least one counterexample that looks similar but should lead elsewhere.
7. Define applicability boundaries before calling the pattern reusable.
8. Mark the pattern `candidate` until reproduction testing passes.

## Review History Inference Workflow

1. Collect review comments, approvals, rejections, incident reports, meeting notes, tickets, complaints, and audit records.
2. Normalize them into case fragments with actor, decision, reason text, and available evidence.
3. Extract recurring decision language such as "cannot approve unless", "needs evidence of", "acceptable if", and "too risky because".
4. Cluster fragments by recurring cue, concern, and implied loss boundary.
5. Draft candidate Decision Patterns and Review History Inference records.
6. Mark all inferred patterns as `candidate`.
7. Validate them by replaying concrete cases with experts or through reproduction tests on unseen cases.

## Organizational Quality Culture Model

Decision Patterns become Organizational Quality Culture when the organization can observe stable regularities across people, teams, and time.

Culture must capture:

- non-negotiable loss boundaries
- preferred evidence forms
- risk appetite by topic
- escalation norms
- waiver practices
- repeated organizational fears
- quality tradeoffs
- differences between departments, roles, and seniority levels

Aggregation rules:

1. Count recurrence of concerns, not raw activity volume.
2. Separate universal boundaries from subgroup-specific practice.
3. Record disagreement explicitly instead of flattening it.
4. Preserve who can waive what and under which evidence.
5. Treat culture as a living synthesis, not a timeless truth.

## Reproduction Test Framework

### Purpose

A pattern is not validated just because an expert recognizes it. It becomes operational when another evaluator can use it on unseen cases with acceptable agreement.

### Test design

1. Select unseen cases that were not used to build the pattern.
2. Give the evaluator the Decision Pattern, Applicability Boundary, and allowed evidence.
3. Ask for a decision, cited cues, concern, and required evidence.
4. Compare with expected outcomes and rationale.
5. Record misses:
   - wrong decision
   - correct decision for wrong reason
   - missed cue
   - false cue
   - ignored applicability boundary
6. Mark the result:
   - pass
   - partial-pass
   - fail

### Validation threshold

Extracted knowledge is considered valid only when all of the following hold:

1. It is grounded in concrete cases.
2. It includes explicit cues.
3. It explains the concern behind the cues.
4. It maps to a loss boundary.
5. It defines acceptance or rejection conditions.
6. It identifies required evidence.
7. It includes applicability boundaries.
8. It has been tested on unseen cases.
9. It can be reproduced by a non-expert or AI agent with acceptable agreement.
10. It can be challenged and revised through governance.

## Governance Workflow

### Introduce or update knowledge

1. New case, incident, exception, or inference creates a candidate judgment update.
2. Compare it against existing Decision Patterns and counterexamples.
3. If it changes a loss boundary, escalate immediately.
4. If it only narrows applicability, revise the Applicability Boundary.
5. If it contradicts a validated pattern, run a focused reproduction test.
6. Update Quality Intent Derivations if the governing pattern changes.

### Challenge and revision

1. Any evaluator may challenge a pattern by citing a new counterexample, poor reproduction score, or changed context.
2. Guardian review checks whether the loss boundary is still correct.
3. Visionary review checks whether the pattern still serves stakeholder value.
4. Builder review checks whether the pattern remains operational and teachable.
5. Governance records whether the pattern is revised, deprecated, split, or retired.

## Decision Pattern Schema

Every Decision Pattern must include:

- trigger cues
- applicable context
- concern
- loss boundary
- typical decision
- acceptance conditions
- evidence required
- exceptions
- counterexamples
- source judgments
- confidence
- reproduction test result

## Example Cases

### Software review

Case: A change passes tests but introduces silent permission broadening.

- Cue: authorization rule changed without matching threat rationale
- Concern: unauthorized access will be normalized because tests only cover happy paths
- Loss Boundary: users must not gain access they were never entitled to
- Typical Decision: conditionally acceptable only with explicit threat rationale, negative evidence, and reviewer sign-off

### Operations

Case: A night-shift operator wants to skip a redundant physical check because the dashboard looks normal.

- Cue: dashboard is green but the last manual inspection is stale
- Concern: remote indicators may miss local degradation
- Loss Boundary: equipment must not remain in service when field state is unknown
- Typical Decision: unacceptable until local confirmation or approved substitute evidence exists

### Accounting

Case: Quarter-end revenue is ready to book, but one fulfillment confirmation is delayed.

- Cue: commercial approval exists but delivery evidence is incomplete
- Concern: premature recognition creates misstated reporting
- Loss Boundary: no revenue recognition without required completion evidence
- Typical Decision: unacceptable unless alternate documentary evidence meets policy

### Maintenance

Case: A technician proposes reusing a worn but still functioning gasket.

- Cue: part still seals now, but wear pattern is near failure threshold
- Concern: short-term success hides elevated failure probability after restart
- Loss Boundary: restarted equipment must not rely on components already beyond tolerated wear margin
- Typical Decision: unacceptable unless engineering waiver and risk-specific evidence exist

### Administration

Case: A procurement request lacks one approval but is urgently needed for onboarding.

- Cue: urgency claim conflicts with missing budget owner approval
- Concern: convenience overrides authority and auditability
- Loss Boundary: commitments must not bypass delegated approval authority
- Typical Decision: conditionally acceptable only under emergency waiver path with retrospective audit

## Connection To QIF

The framework does not replace QIF. It feeds QIF.

- Cases and Expert Judgments reveal Cues, Concerns, and Loss Boundaries.
- Decision Patterns package those into reusable logic.
- Quality Intent Derivation translates that logic into QIF Quality Intents.
- QIF then evaluates evidence and issues verdicts against those intents.

The north star is reached when a veteran's concrete judgment becomes a bounded, evidence-backed pattern that another person or AI agent can apply to a new case without losing context, exceptions, or loss boundaries.
