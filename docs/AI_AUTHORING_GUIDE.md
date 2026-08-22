# AI Authoring Guide for QIF

## Purpose

This is the first document an AI agent should read before using or extending QIF.

The goal is to make the agent act in QIF style:

- discover what quality means in the current context;
- identify what failure or loss must be prevented;
- connect quality claims to evidence;
- avoid treating activity counts as quality;
- produce auditable outputs that humans and other agents can challenge.

QIF is not a checklist framework. QIF is a framework for representing, evaluating, and governing discovered quality intent.

## Core Rule

Never start from a fixed quality checklist.

Do not begin with:

```text
Security checked
Performance checked
Tests passed
Review count sufficient
```

Begin with:

```text
Who can be harmed?
What loss must be prevented?
Which Quality Intent protects that boundary?
What evidence would show the boundary is protected?
What uncertainty remains?
Who can accept or reject the residual risk?
```

## Read Order

For most tasks, read in this order:

1. `README.md`
2. `docs/AI_AUTHORING_GUIDE.md`
3. `docs/qif-operational-framework.md`
4. `docs/qif-pre-implementation-review.md`
5. `docs/qif-negative-acceptance.md`
6. `docs/qif-v0.2-discovery-application-runtime.md`

Use additional documents when needed:

| Need | Read |
| --- | --- |
| Help a user who cannot yet express quality intent in QIF terms | `docs/qif-guided-elicitation-design.md`, `docs/qif-v0.5.4-guided-elicitation-runtime.md`, `schemas/guided-elicitation-package.schema.json`, `examples/guided-elicitation-package.json` |
| Converge a Level 4 requirement whose world model is still ambiguous | `docs/qif-v0.5.5-world-model-elicitation.md`, `schemas/world-model-elicitation-package.schema.json`, `examples/world-model-elicitation-package.json` |
| Govern an AI agent tool action before or after execution | `docs/qif-v0.6.0-action-quality-contract.md`, `schemas/action-quality-contract-package.schema.json`, `examples/action-quality-contract-package.json` |
| Author QIF packages from machine-readable templates | `docs/qif-v0.6.1-authoring-template-runtime.md`, `schemas/authoring-template-package.schema.json`, `examples/authoring-template-package.json` |
| Avoid blind spots across functional, non-functional, usability, performance, security, UX, and organizational concerns | `docs/qif-quality-aspect-taxonomy.md` |
| Discover quality intent from stakeholders or documents | `docs/qif-v0.3-discovery-layer-design.md` |
| Extract veteran or expert judgment | `docs/expert-judgment-framework.md` |
| Review QIF model consistency | `docs/qif-v0.2.1-consolidation-review.md` |
| Plan future quality gate/runtime work | `docs/qif-v0.4-quality-gate-runtime-requirements.md` |
| Author a release gate decision (Go / Conditional Go / No-Go / Pending) | `schemas/quality-gate-package.schema.json`, `examples/quality-gate-package.json` |
| Prepare real pilot cases for world-model calibration | `docs/qif-v0.5.3-world-model-pilot-corpus.md`, `schemas/world-model-pilot-corpus-package.schema.json`, `examples/world-model-pilot-corpus-package.json` |
| Understand quality theory background | `docs/quality-theory-report.md` |

## Required Framing

Before producing QIF artifacts, write these three fields:

### Need

The real problem or loss the organization is trying to prevent.

Bad:

```text
Add test checklist.
```

Better:

```text
Prevent release decisions from being made without evidence for high-impact user paths and rollback readiness.
```

### Intent

What QIF should help decide or make explicit.

Example:

```text
Determine which Quality Intents apply to this release candidate and whether evidence supports Go, Conditional Go, No-Go, or Pending.
```

### Context

The domain, target, stakeholders, constraints, available evidence, and uncertainty.

Example:

```text
Target is a public documentation release. Evidence includes package metadata, changelog, release notes, verifier output, and GitHub Release state. No runtime schema changes are in scope.
```

Do not turn the raw user request directly into a QIF project or verdict.

## Standard QIF Thinking Flow

Use this flow unless the task clearly requires a narrower subset:

```text
Need / Intent / Context
-> Evaluation Target
-> Stakeholders
-> Risks
-> Loss Boundaries
-> Quality Intents
-> Applicability Rules or Decisions
-> Evidence Plan
-> Evidence Items
-> Finding Evidence
-> Trust Metadata
-> Confidence
-> Verdict
-> Residual Risks
-> Governance Triggers
```

For pre-implementation work, use:

```text
Proposed Change
-> User Problem
-> Assumptions Under Review
-> Loss Boundaries
-> Negative Acceptance Criteria
-> Evidence Plan
-> Pre-Implementation Verdict
```

For expert judgment extraction, use:

```text
Concrete Case
-> Expert Judgment
-> Cue
-> Concern
-> Loss Boundary
-> Decision Pattern
-> Quality Intent Derivation
-> Reproduction Test
```

For world-model pilot corpus preparation, use:

```text
Pilot Source
-> Privacy Control
-> Pilot Case
-> Case Normalization Step
-> Sampling Policy
-> Expert Panel
-> Adjudication Rubric
-> Ingestion Run
-> Governance Trigger when readiness fails
```

Use this flow before calibration when the organization needs real, unseen, privacy-screened cases. Do not use it to store raw confidential material, hidden chain-of-thought, or unredacted source details.

For guided elicitation with a user who is not fluent in QIF terms, use:

```text
Concrete Target
-> Plain-Language Explanation
-> Stepwise Probe
-> User Answer
-> Clarification Move when needed
-> Candidate Concern / Loss Boundary / Evidence Requirement
-> Teach-Back Check
-> QIF Candidate Artifact
```

Ask one answerable question at a time. If the user cannot answer, explain the concept in plain language, offer an optional answer scaffold, and preserve the ambiguity instead of forcing completion.

## Output Contract

When asked to evaluate something with QIF, produce these sections:

1. Scope
2. Need / Intent / Context
3. Evaluation Target
4. Candidate Quality Intents
5. Loss Boundaries
6. Required Evidence
7. Evidence Found
8. Missing or Weak Evidence
9. Verdict
10. Residual Risks
11. Governance Triggers
12. Next Actions

When asked to define QIF check items for a requirement, produce:

1. Requirement Under Review
2. Stakeholders and Harmed Parties
3. Quality Intents
4. Negative Acceptance Criteria
5. Evidence Required
6. Evaluation Timing
7. Applicability Conditions
8. Exceptions or Waivers
9. Gate Verdict Rules

When asked to author a QIF package or schema change, produce:

1. Purpose
2. Entities
3. Attributes
4. Lifecycle
5. Relationships
6. Verifier Rules
7. Example Package
8. Non-Goals

## Evidence Rules

Evidence must be connected to a Quality Intent and Loss Boundary.

For quality-gate packages, declare `evidenceTypeVocabulary` before writing evidence items or gate rules.

Use it to define:

- which evidence types are allowed;
- what each evidence type is for;
- expected independence;
- whether `trust` is required;
- whether `findingEvidence` is required;
- anti-patterns for misuse.

Do not invent a new `evidenceType` inside an evidence item or `requiredEvidenceTypes` list unless you also add it to the vocabulary. Evidence type names are control vocabulary, not quality itself.

For quality-gate packages, declare `evidenceRetentionPolicies` before finalizing evidence items.

Use them to define:

- which evidence types the policy covers;
- retention period;
- sensitivity;
- integrity protection;
- access control;
- disposal rule;
- owner;
- anti-patterns.

Every evidence item must cite a retention policy through `retentionPolicyRef`. Do not keep only a count or summary when the verdict depends on reconstructable evidence.

For quality-gate packages, create `qualityReports` only after the gate decision exists.

Use Quality Reports to summarize, not to create new proof. Every reported score and
report section must cite:

- the `qualityGateDecision` it summarizes;
- the Quality Intents covered by the relevant gate verdicts;
- the evidence items cited by those verdicts;
- a calculation or interpretation note that explains what the score means.

Set reported score `interpretation` to `report-summary-only`. Do not present a
report score, dashboard value, or readiness rating as quality itself. If a score
cannot be decomposed into gate decisions, intents, and verdict evidence, do not
write the score.

For quality-gate packages, define evaluation timing before writing the final gate decision.

Use `evaluationTimingRules` to state reusable timing logic:

- which Quality Intents the timing protects;
- whether evaluation is required before a gate decision;
- trigger conditions;
- latest allowed stage;
- anti-patterns.

Use `evaluationTimingDecisions` to record the target-specific timing decision:

- which timing rule was selected;
- why the timing applies;
- what evidence proves completion;
- which gate decision it applies before;
- owner, confidence, and status.

Do not approve a Go or Conditional Go by assuming evidence can be collected later when the cited timing rule says it is required before decision.

Do not write:

```text
120 tests passed, therefore quality is high.
```

Write:

```text
The release-readiness Quality Intent requires evidence that critical user paths still work. The E2E report covers the three defined critical paths at release candidate commit X. The pass rate is 100%, and the report artifact is retained. This supports the release gate, but does not prove unrelated risks.
```

Quantitative values are evidence metadata:

- counts;
- rates;
- coverage;
- duration;
- frequency;
- impact values.

They are useful only when interpreted through:

- Quality Intent;
- Loss Boundary;
- Evaluation Context;
- Evidence Method;
- Gate Rule;
- Residual Risk.

For AI-generated quality or security findings, record finding evidence before using the finding in a verdict.

External YAML-style expression:

```yaml
finding_evidence:
  generated_by:
  source_artifact:
  reproducible:
  reproduced_by:
  false_positive_checked:
  impact_confirmed:
  final_status:
```

QIF JSON packages use `findingEvidence` with camelCase fields:

```json
{
  "findingEvidence": {
    "generatedBy": "ai-quality-security-reviewer",
    "sourceArtifact": "scan-output.json",
    "reproducible": true,
    "reproducedBy": "security-reviewer",
    "falsePositiveChecked": true,
    "impactConfirmed": true,
    "finalStatus": "confirmed"
  }
}
```

`findingEvidence` records how a finding was produced and challenged. It is not quality itself.

Record trust metadata separately when an AI-generated finding, artifact, or evidence item needs source and freshness control.

External YAML-style expression:

```yaml
trust:
  sources: []
  generated_by:
  verified_by: []
  status: draft
  stale_after:
```

QIF JSON packages use `trust` with camelCase fields:

```json
{
  "trust": {
    "sources": ["scan-output.json", "operator-note.md"],
    "generatedBy": "ai-quality-security-reviewer",
    "verifiedBy": ["security-reviewer"],
    "status": "verified",
    "staleAfter": "2026-10-31"
  }
}
```

`trust` records source grounding, reviewer confirmation, status, and freshness. It does not replace `findingEvidence`, confidence, evidence polarity, or verdicts.

## World Model Review

Before evaluating quality, check whether the target world is modeled well enough for humans and AI agents to mean the same thing.

Use `world-model-elicitation` before `world-model-review` when the user has concrete examples but the underlying model is not settled.

Do not prematurely choose one interpretation. Hold competing Model Hypotheses until a Discriminating Question or Counterexample Sequence removes them.

For Level 4 requirements, write:

```text
Raw Intent
-> competing Model Hypotheses
-> Discriminating Question
-> Human Answer
-> Hypothesis Elimination
-> Counterexample Sequences
-> Invariant Candidate
-> Invariant Confirmation
-> Closure Assessment
-> Derived World Model
-> Acceptance Scenario
-> Quality Intent Candidate
```

The key question is not "what is the quality intent?" The key question is "which concrete case would make two plausible world models disagree?"

Use `world-model-review` when the risk is conceptual mismatch:

- a key term is undefined or overloaded;
- an actor, authority, responsibility, data, time, risk, or loss boundary is missing;
- a state such as approved, complete, active, blocked, waived, or retired is not defined;
- a relationship between entities is implied but not modeled;
- a coordinate axis such as severity, authority, reversibility, evidence freshness, operational impact, or confidence is missing;
- an AI assumption is unverified but affects a verdict.

Do not write only:

```text
Conceptual modeling is insufficient.
```

Write a `worldModelGapFinding` that names the exact missing part:

```json
{
  "id": "WMG-WM-001",
  "gapObjectType": "Boundary",
  "missingItem": "Final approval authority boundary for the human release approver.",
  "expectedDefinition": "Define who can approve, under which conditions, what evidence they must cite, how delegation works, and how approval differs from AI review pass status.",
  "observedProblem": "The release request says approved but does not name the approving actor, authority scope, approval conditions, delegation rules, or audit evidence.",
  "whyItMatters": "An AI reviewer could treat a passing review or implied approval phrase as final approval, producing a release verdict over an undefined authority model.",
  "affectedQualityIntentRefs": ["QIN-WM-001"],
  "affectedDecisionRefs": ["release verdict", "governance escalation"],
  "evidenceRefs": ["EVD-WM-001"],
  "requiredResolutionActionRefs": ["RSA-WM-001"],
  "verdictEffect": "block-evaluation"
}
```

A World Model Gap Finding must answer:

- what exact concept, actor, boundary, relationship, state, event, invariant, coordinate axis, perspective, assumption, or domain entity is missing;
- what definition would be sufficient;
- what was observed instead;
- why the gap can cause wrong judgment;
- which Quality Intents and decisions are affected;
- what evidence supports the finding;
- what resolution action will close it;
- whether evaluation must be blocked, confidence degraded, governance required, or residual risk recorded.

World Model Review does not prove the domain model is true. It makes missing model parts explicit enough to block, downgrade, or govern a quality verdict.

## World Model Calibration

Use `world-model-calibration` when you need to evaluate whether AI-generated World Model Gap Findings agree with expert judgment on unseen cases.

Do not claim:

```text
The AI can identify conceptual-modeling gaps because the world-model-review verifier passed.
```

The correct claim is narrower:

```text
The World Model Review package is structurally valid. Calibration must still
show whether AI findings agree with expert findings on unseen cases.
```

A calibration package should include:

- a `calibrationPolicy` with minimum cases, required domains, expert assessor count, unseen-case requirement, agreement threshold, false-positive limit, false-negative limit, and governance-on-failure behavior;
- `calibrationCases` that were not used to author the pattern;
- `expertAssessments` with expected findings;
- `agentAssessments` with generated findings;
- `findingMatches` with `exact`, `partial`, `missed`, `spurious`, or `disagreement`;
- a `calibrationRun` with reproduced agreement, false-positive, and false-negative rates;
- `governanceTriggers` when thresholds fail.

A failed calibration run can be a valid QIF package:

```json
{
  "agreementScore": 0.5,
  "falseNegativeRate": 0.33,
  "conclusion": "failed",
  "governanceTriggerRefs": ["GTR-WMC-001", "GTR-WMC-002"]
}
```

That means QIF is doing its job. It is preserving the difference between:

- structurally valid findings;
- calibrated findings;
- semantically true domain knowledge.

## Evidence Independence

Classify evidence strength.

| Independence | Meaning |
| --- | --- |
| high | Observes the target through the real user, operator, public, or external path. |
| medium | Exercises real output through a local or internal path. |
| low | Infers correctness from code reading, naming, analogy, screenshots without scoring, or happy-path assumptions. |

High-severity loss boundaries should not rely only on low-independence evidence.

## Negative Acceptance

Always ask:

```text
What must not be true even if positive checks pass?
```

Examples:

- A release must not be marked Go if rollback evidence is missing for a high-impact change.
- A dashboard must not report a quality score unless the score is traceable to evidence and rules.
- A generated recommendation must not appear as approved judgment without delegated authority or reviewer evidence.
- A screenshot must not count as visual evidence unless it was evaluated against a rubric.

## Verdict Discipline

Use explicit verdicts.

Common review verdicts:

- achieved;
- partially achieved;
- not achieved;
- inconclusive;
- waived.

Release gate verdicts:

- Go;
- Conditional Go;
- No-Go;
- Pending.

Pre-implementation verdicts:

- proceed;
- reframe;
- split;
- defer;
- reject.

Never return a confident verdict if evidence is missing, weak, conflicting, or out of scope.

## Governance Triggers

Trigger governance when:

- evidence confidence is low;
- evidence conflicts;
- high-severity loss boundaries are unresolved;
- an exception or waiver is requested;
- release is conditional;
- semantic interpretation requires accountable human review;
- post-release incidents reveal a missed Quality Intent.

Governance Trigger records why governance is needed.

Governance Event records what decision was made.

## Domain-General Use

QIF must work beyond software development.

When the target is not software, translate concepts:

| Software Term | Domain-General Interpretation |
| --- | --- |
| release | deployment, publication, handoff, policy activation, operational change |
| test | evaluation, inspection, rehearsal, audit, sampling, review |
| CI log | retained execution or verification record |
| bug | defect, incident, exception, discrepancy, nonconformance |
| rollback | reversal, fallback, withdrawal, containment |
| monitoring | observation, follow-up, audit, customer feedback, operational control |

## Verifier Boundary

A verifier may check:

- required fields exist;
- references resolve;
- confidence calculations are reproducible;
- verdicts link to evidence;
- activity-count metrics are not treated as quality itself;
- low-confidence or conflicting results trigger governance.

A verifier must not claim:

- semantic quality truth;
- the organization selected the right Quality Intents;
- the evidence is sufficient in the real world;
- a dashboard score proves quality;
- expert opinion is automatically correct.

Semantic validity requires expert review, stakeholder review, reproduction tests, operational feedback, and governance.

## Common Failure Modes

Avoid these:

- treating the user's requested solution as the real need;
- using fixed quality categories as a checklist;
- counting tests, pages, reviews, or screenshots as quality;
- accepting automated evidence without checking relevance;
- omitting the harmed stakeholder;
- omitting the loss boundary;
- omitting negative acceptance;
- giving a Go verdict without residual risk;
- treating QIF as software-only;
- hiding uncertainty.

## Minimal Response Template

Use this when the user asks for a quick QIF evaluation:

```text
Scope:

Need / Intent / Context:

Evaluation Target:

Candidate Quality Intents:

Loss Boundaries:

Evidence Found:

Missing or Weak Evidence:

Verdict:

Residual Risks:

Governance Triggers:

Next Actions:
```

## Authoring Checklist For AI Agents

Before finalizing your QIF output, confirm:

- the raw request was reframed into Need / Intent / Context;
- every Quality Intent protects a Loss Boundary;
- evidence is tied to the target and context;
- quantitative metrics are not treated as quality itself;
- negative acceptance is present for high-risk claims;
- verdict confidence matches evidence strength;
- unresolved uncertainty becomes residual risk or governance;
- the output is domain-general unless the user explicitly limits the domain;
- verifier claims are structural, not semantic.
