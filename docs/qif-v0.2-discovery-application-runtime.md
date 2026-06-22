# QIF v0.2 Discovery And Application Runtime

## Mission

QIF v0.2 extends the current executable baseline into a discovery and application runtime.
QIF v0.2.1 hardens that runtime for schema implementation and verifier execution without redesigning the accepted v0.2 model.

The goal is to show, in inspectable artifacts, how:

1. expert judgment was extracted,
2. judgment became reusable quality knowledge,
3. quality knowledge was selected for a real target,
4. evidence was evaluated,
5. and the final verdict was reached.

QIF v0.2 remains domain-general. It supports software development, product development, service operations, accounting, administration, maintenance, and customer support without assuming software artifacts or external tools.

## Runtime Layers

QIF v0.2 is organized into five runtime layers:

1. Discovery Session:
   how tacit judgment is elicited and structured
2. Organizational Quality Culture:
   how repeated patterns become organization-level quality character
3. Evaluation Target:
   what object is currently being evaluated
4. Applicability:
   reusable selection logic and target-specific selection decisions
5. Review Run:
   how evidence is collected, confidence is judged, verdicts are produced, and governance is triggered

Hardening rule:

- Applicability Rules are reusable.
- Applicability Decisions are target-specific.
- Organizational Quality Culture is an aggregation and context layer, not a mandatory prerequisite for deriving Quality Intents.
- Raw Expert Answers and Question Log Entries are first-class records, not embedded transcript fragments.
- Quality Intent Derivation is a derivation record; it is not the Quality Intent itself.
- Confidence is reproduced from evidence confidence inputs, confidence policy, verdict aggregation rules, and review-run aggregation rules.
- Governance Triggers record why governance is needed; Governance Events record what decision was made.
- The verifier checks structure and traceability. It does not prove semantic truth.

## Discovery Session Model

### Purpose

The Discovery Session captures how expert judgment is elicited from concrete cases.

It is not just an interview transcript. It is a structured extraction artifact that connects raw answers to reusable quality knowledge.

### Required fields

- `expert`
- `case`
- `questionLogEntries`
- `rawExpertAnswers`
- `judgment`
- `extractedCues`
- `extractedConcerns`
- `mappedLossBoundaries`
- `derivedDecisionPatterns`
- `derivedQualityIntentDerivations`
- `extractionSteps`
- `confidence`
- `unresolvedAmbiguity`

### Entity definition

#### Discovery Session

Purpose: Captures one bounded elicitation session in which an expert reviews one or more concrete cases and externalizes decision logic.

Attributes:

- `id`
- `expertRef`
- `caseRefs`
- `questionLogEntryRefs`
- `rawExpertAnswerRefs`
- `judgmentRefs`
- `extractedCueRefs`
- `extractedConcernRefs`
- `mappedLossBoundaryRefs`
- `derivedDecisionPatternRefs`
- `derivedQualityIntentDerivationRefs`
- `extractionStepRefs`
- `confidence`
- `unresolvedAmbiguity`
- `sessionVerdict`

Lifecycle:

- opened
- eliciting
- structured
- pattern-derived
- reviewed
- archived

Relationships:

- A Discovery Session must link to at least one Case and one Expert Judgment.
- Discovery Sessions produce candidate Decision Patterns and Quality Intent Derivations.
- Discovery Sessions cite structured Question Log Entries and Raw Expert Answers so extraction remains auditable.

#### Question Log Entry

Purpose: Records one question asked during a discovery session.

Attributes:

- `id`
- `sessionRef`
- `questionText`
- `questionType`
- `targetCaseRef`
- `askedBy`
- `order`

Relationships:

- A Question Log Entry belongs to one Discovery Session.
- It targets the concrete Case being judged.
- Raw Expert Answers cite the question that produced them.

#### Raw Expert Answer

Purpose: Preserves the expert's captured answer before interpretation.

Attributes:

- `id`
- `sessionRef`
- `expertRef`
- `caseRef`
- `questionRef`
- `answerText`
- `captureMode`
- `ambiguity`
- `sensitiveDataHandling`

Relationships:

- A Raw Expert Answer belongs to one Discovery Session.
- It links to the Expert, Case, and Question Log Entry.
- Extraction Steps must cite at least one Raw Expert Answer.

#### Extraction Step

Purpose: Records how raw expert answers were transformed into Cues, Concerns, Loss Boundaries, Decision Patterns, or Quality Intent Derivations.

Attributes:

- `id`
- `sessionRef`
- `extractor`
- `extractionMethod`
- `rawExpertAnswerRefs`
- `outputCueRefs`
- `outputConcernRefs`
- `outputLossBoundaryRefs`
- `outputDecisionPatternRefs`
- `outputQualityIntentDerivationRefs`
- `rationale`
- `confidence`
- `ambiguity`

Lifecycle:

- proposed
- extracted
- challenged
- accepted-as-candidate
- revised
- archived

Relationships:

- Extraction Steps link raw expert answers to interpreted entities.
- An extracted Cue or Concern is not auditable unless an Extraction Step explains why it was created.
- AI extraction and human extraction use the same record shape so that both can be challenged.

#### Quality Intent Derivation

Purpose: Records how source Decision Patterns, Concerns, and Loss Boundaries justified a candidate Quality Intent.

Attributes:

- `id`
- `sourceDecisionPatternRefs`
- `sourceConcernRefs`
- `sourceLossBoundaryRefs`
- `derivedQualityIntentRef`
- `derivationRationale`
- `confidence`
- `status`
- `reviewerRefs`

Relationships:

- A Quality Intent Derivation points to a separate Quality Intent record.
- It must reference at least one Decision Pattern or Loss Boundary.
- It may be created without finalized Organizational Quality Culture when the source pattern trace is sufficient.

### Runtime workflow

1. Select representative cases:
   include pass, fail, and borderline cases.
2. Ask concrete questions:
   start with acceptability, not abstract quality definitions.
3. Capture raw answers verbatim:
   preserve ambiguity before structuring.
4. Extract cues:
   identify which observation changed the judgment.
5. Extract concerns:
   identify what failure or harm the expert was trying to avoid.
6. Map loss boundaries:
   define the unacceptable line behind the concern.
7. Derive candidate patterns:
   synthesize repeated judgment logic from multiple cases.
8. Record extraction steps:
   preserve how raw answers became structured knowledge.
9. Derive Quality Intent candidates:
   Quality Intents may be derived directly from Decision Patterns and Loss Boundaries.
10. Record unresolved ambiguity:
   preserve what still needs comparison, counterexamples, or follow-up evidence.

## Organizational Quality Culture Model

### Purpose

Organizational Quality Culture aggregates multiple Decision Patterns into organization-level quality character.

It is not a values poster. It is a runtime artifact grounded in repeated patterns, waivers, escalations, and tradeoffs.

It is also not a mandatory prerequisite for deriving Quality Intents. A Quality Intent may be derived directly from Decision Patterns when the source judgments, cues, concerns, and loss boundaries are sufficiently traceable. Culture summarizes repeated evidence over time and provides context for interpretation, escalation, waiver norms, and tradeoff tendencies.

### Required fields

- `nonNegotiableLossBoundaries`
- `aggregationRole`
- `recurringFears`
- `preferredEvidence`
- `riskAppetite`
- `escalationNorms`
- `waiverPractices`
- `qualityTradeoffs`
- `departmentOrRoleDifferences`

### Runtime rules

1. A culture entry must be grounded in multiple patterns, or explicitly marked `provisional`.
2. Universal boundaries and subgroup differences must not be flattened together.
3. Repeated fears are modeled as recurring concerns, not as personality claims about staff.
4. Waiver practices must identify who may waive, under what evidence, and with what follow-up accountability.
5. Culture entries must be marked as `context-only`.
6. Culture entries must not be required before Quality Intent derivation.

## Evaluation Target Model

### Purpose

The Evaluation Target defines the real object QIF is reviewing.

It must support:

- software development
- product development
- service operations
- accounting
- administration
- maintenance
- customer support

### Entity definition

#### Evaluation Target

Purpose: Represents the object, activity, release, transaction, process, event, or service instance currently being evaluated.

Attributes:

- `id`
- `title`
- `domain`
- `targetType`
- `artifactType`
- `context`
- `stakeholderImpact`
- `operationalImpact`
- `riskSummary`
- `sourceEvidence`

Lifecycle:

- proposed
- prepared
- under-review
- reviewed
- superseded
- archived

Relationships:

- Evaluation Targets are reviewed through Review Runs.
- Applicability Rules determine which Quality Intents and Decision Patterns apply to them.

### Modeling principle

The target is not assumed to be code.

A target may be:

- a code change
- a product launch decision
- an operating shift procedure
- an accounting booking
- an administrative approval path
- a maintenance restart decision
- a customer-support exception process

## Applicability Model

### Purpose

Applicability determines why specific Quality Intents and Decision Patterns apply to a given Evaluation Target.

It has two separate entities:

- Applicability Rule:
  reusable selection logic.
- Applicability Decision:
  target-specific record of what was selected, what was excluded, and why.

### Required factors

- context
- stakeholder
- risk
- domain
- loss boundary
- artifact type
- operational impact

### Entity definition

#### Applicability Rule

Purpose: Defines reusable selection logic for matching quality knowledge to classes of targets.

Attributes:

- `id`
- `title`
- `ruleScope`
- `matchConditions`
- `selectedIntentRefs`
- `selectedDecisionPatternRefs`
- `exclusionConditions`

Lifecycle:

- drafted
- validated
- reviewed
- revised
- retired

Relationships:

- Applicability Rules do not select a target by themselves.
- Applicability Decisions cite Applicability Rules when applying them to a specific Evaluation Target.
- Applicability Rules use structured match conditions instead of free-text selection logic so the verifier can check rule execution.

#### Applicability Decision

Purpose: Records why specific Quality Intents and Decision Patterns were selected or excluded for one Evaluation Target.

Attributes:

- `id`
- `targetRef`
- `ruleRefs`
- `matchedContext`
- `matchedStakeholderRefs`
- `matchedRiskRefs`
- `matchedDomain`
- `matchedLossBoundaryRefs`
- `matchedArtifactTypes`
- `matchedOperationalImpacts`
- `selectedIntentRefs`
- `selectedDecisionPatternRefs`
- `matchedConditionRefs`
- `excludedIntents`
- `excludedDecisionPatterns`
- `selectionRationale`
- `contextMismatches`
- `confidence`

Lifecycle:

- opened
- matched
- selected
- challenged
- accepted
- revised
- archived

Relationships:

- Every Review Run must cite at least one Applicability Decision.
- Applicability Decisions must cite the reusable Applicability Rules they applied.
- Excluded patterns are first-class evidence, because they explain which tempting but wrong review path was rejected.
- Every selected intent and selected pattern in a Review Run must be justified by an Applicability Decision.
- Every excluded intent or pattern must include an item-level exclusion rationale.

### Runtime workflow

1. Read target context and domain.
2. Identify affected stakeholders and operational impact.
3. Identify risks and loss boundaries exposed by the target.
4. Compare those conditions to pattern boundaries and Quality Intent scope.
5. Select intents and patterns only through explicit applicability decisions that cite reusable rules.
6. Record why other candidate patterns were excluded.
7. Trigger governance when a context mismatch is material to the final review path.

## Review Run Model

### Purpose

The Review Run is the execution record of an actual QIF review.

### Required fields

- `target`
- `selectedIntents`
- `selectedDecisionPatterns`
- `applicabilityDecisions`
- `collectedEvidence`
- `confidence`
- `confidencePolicy`
- `verdicts`
- `residualRisks`
- `recommendations`
- `governanceTriggers`

### Entity definition

#### Review Run

Purpose: Captures one bounded QIF evaluation against a real target.

Attributes:

- `id`
- `targetRef`
- `applicabilityRuleRefs`
- `applicabilityDecisionRefs`
- `selectedIntentRefs`
- `selectedDecisionPatternRefs`
- `collectedEvidenceRefs`
- `confidence`
- `confidencePolicyRef`
- `verdicts`
- `residualRisks`
- `recommendations`
- `governanceTriggerRefs`

Lifecycle:

- opened
- scoped
- evidence-collected
- judged
- reviewed
- closed

Relationships:

- Review Runs apply Quality Intents and Decision Patterns to Evaluation Targets.
- Review Runs trigger governance when confidence is low, evidence conflicts, or waivers are needed.

#### Confidence Policy

Purpose: Defines how confidence is reproduced from evidence and verdict inputs.

Attributes:

- `id`
- `evidenceAggregationRule`
- `verdictAggregationRule`
- `reviewRunAggregationRule`
- `rounding`

Relationships:

- Verdicts cite the policy used to aggregate their evidence confidence inputs.
- Review Runs cite the policy used to aggregate verdict confidence into review-run confidence.
- Confidence reproducibility does not prove semantic truth; it proves the recorded arithmetic and policy application are inspectable.

#### Governance Trigger

Purpose: Records why a review result must enter governance instead of being treated as final operational truth.

Attributes:

- `id`
- `triggerType`
- `reason`
- `sourceReviewRunRef`
- `affectedTargetRef`
- `severity`
- `requiredAction`
- `owner`
- `status`
- `resultingGovernanceEventRef`

Lifecycle:

- opened
- assigned
- reviewed
- actioned
- resolved
- archived

Relationships:

- Governance Triggers are created by Review Runs.
- Governance Triggers may be caused by low confidence, conflicting evidence, context mismatch, waiver need, indicator misuse, or another explicit reason.
- Open triggers may have no resulting event yet.
- Reviewed or resolved triggers must link to a Governance Event.

#### Governance Event

Purpose: Records the governance decision made in response to a Governance Trigger.

Attributes:

- `id`
- `sourceGovernanceTriggerRef`
- `decision`
- `decidedBy`
- `decisionRationale`
- `status`

Relationships:

- A Governance Event points back to the Governance Trigger that caused it.
- It records the decision outcome, while the trigger records why governance was needed.

### Governance trigger rules

Governance review is required when:

- verdict confidence is low
- evidence materially conflicts
- an activity-count indicator is being misused as quality itself
- a waiver is needed
- a selected pattern does not cleanly fit the target context

## End-To-End Runtime

Canonical v0.2 flow:

```text
Discovery Session
  -> Raw Expert Answer
  -> Expert Judgment
  -> Extraction Step
  -> Cue
  -> Concern
  -> Loss Boundary
  -> Decision Pattern
  -> Quality Intent Derivation
  -> Organizational Quality Culture (aggregation/context, not prerequisite)
  -> Evaluation Target
  -> Applicability Rule
  -> Applicability Decision
  -> Review Run
  -> Verdict
  -> Governance Trigger
  -> Governance Event
```

## Verifier Intent

The runtime verifier checks structural integrity, traceability, reference resolution, confidence reproducibility, and rule compliance.

It does not claim semantic truth. Semantic validity requires expert review, reproduction tests, operational feedback, and governance.

The runtime verifier checks that:

1. discovery is grounded in cases and judgments
2. cues map to concerns
3. concerns map to loss boundaries
4. extraction steps justify derived cues, concerns, boundaries, patterns, and Quality Intent derivations
5. derived patterns remain traceable to source judgments
6. Quality Intents can be derived from Decision Patterns without requiring finalized culture
7. quality culture is grounded in pattern evidence and marked as context-only
8. targets are explicitly modeled
9. applicability rules are reusable, executable, and applicability decisions are target-specific
10. verdicts remain evidence-backed
11. confidence values are reproducible from evidence inputs, confidence policy, verdict aggregation rules, and review-run aggregation rules
12. activity counts are not treated as quality itself
13. low-confidence, conflicting, or context-mismatched results trigger governance review

## Example Runtime Story

The v0.2 examples are intentionally separated by package type:

- discovery session package:
  shows how a veteran reviewer and operations lead were interviewed on concrete cases
- organizational quality culture package:
  shows how repeated patterns became a culture hypothesis, including one provisional subgroup
- evaluation target package:
  shows targets across seven supported domains
- review run package:
  shows Quality Intents derived directly from Decision Patterns, executable Applicability Rules, target-specific Applicability Decisions, selected and excluded patterns, confidence-policy-backed verdicts, Governance Triggers, and a resulting Governance Event

## North Star

QIF v0.2 succeeds when another person or AI agent can inspect the runtime artifacts and answer:

- which case taught this judgment
- which cue changed the decision
- which concern and loss boundary mattered
- which pattern and intent were selected for this target
- what evidence supported the verdict
- and why governance was or was not triggered
