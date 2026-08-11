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
| Avoid blind spots across functional, non-functional, usability, performance, security, UX, and organizational concerns | `docs/qif-quality-aspect-taxonomy.md` |
| Discover quality intent from stakeholders or documents | `docs/qif-v0.3-discovery-layer-design.md` |
| Extract veteran or expert judgment | `docs/expert-judgment-framework.md` |
| Review QIF model consistency | `docs/qif-v0.2.1-consolidation-review.md` |
| Plan future quality gate/runtime work | `docs/qif-v0.4-quality-gate-runtime-requirements.md` |
| Author a release gate decision (Go / Conditional Go / No-Go / Pending) | `schemas/quality-gate-package.schema.json`, `examples/quality-gate-package.json` |
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
6. Applicability Conditions
7. Exceptions or Waivers
8. Gate Verdict Rules

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
