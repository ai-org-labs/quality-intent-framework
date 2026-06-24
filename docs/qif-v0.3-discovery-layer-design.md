# QIF v0.3 Discovery Layer Design

## Mission

Design a Discovery Layer that helps humans and AI agents discover candidate Quality Intents before QIF artifacts are authored.

QIF remains the representation layer for discovered quality knowledge. The Discovery Layer is a separate mechanism for finding that knowledge.

## Design Status

This document is a v0.3 design proposal, not a schema implementation.

It is intended for human maintainers, Codex, Claude Code, and future implementation agents. It defines what v0.3 should build, what it should avoid, and what should remain deferred.

## Problem

QIF v0.2.1 can represent and evaluate discovered Quality Intents. It can trace expert judgment, decision patterns, applicability decisions, evidence, verdicts, and governance triggers.

The remaining upstream gap is discovery:

| Current strength | Current gap |
| --- | --- |
| QIF can record discovered Quality Intents. | Many users cannot discover Quality Intents without expert help. |
| QIF can validate structure and traceability. | QIF does not yet guide exploratory questioning. |
| QIF blocks activity-count metrics as quality itself. | Users may still substitute fixed checklists for discovery. |

The Discovery Layer exists to close this gap without turning QIF into a checklist framework.

## Non-Goals

The Discovery Layer must not:

- introduce mandatory quality category checklists;
- define quality by checklist completion;
- force a fixed questionnaire;
- treat AI-suggested Quality Intents as semantic truth;
- merge discovery strategy into QIF representation semantics;
- specialize the framework to software development only;
- build UI or external integrations in this design slice.

Examples of anti-patterns:

| Anti-pattern | Why it is rejected |
| --- | --- |
| Mandatory category coverage such as performance, security, availability, maintainability. | It invites compliance behavior instead of failure discovery. |
| Fixed control checks such as authentication exists, logging exists, backup exists. | It assumes the right quality concerns before stakeholders have expressed loss boundaries. |
| Discovery score based on number of questions asked. | Question count is activity volume, not discovery quality. |

## Architectural Boundary

### Layer Separation

| Layer | Purpose | Owns | Must not own |
| --- | --- | --- | --- |
| Discovery Layer | Find candidate quality knowledge. | Discovery strategy, prompts, source exploration, concern hypotheses, candidate intents, uncertainty. | Final QIF representation semantics, verdicts, governance decisions. |
| QIF Representation Layer | Represent discovered quality knowledge. | Quality Intent, Evidence, Verdict, Decision Pattern, Applicability, Review Run, Governance Trigger. | Discovery strategy or mandatory exploration paths. |
| Governance Layer | Decide whether candidate knowledge is accepted, revised, waived, or retired. | Semantic review, organizational acceptance, policy adoption. | Raw discovery prompting or structural verification claims. |

### Primary Boundary Rule

Discovery produces candidates. QIF represents accepted or explicitly provisional knowledge. Governance decides whether candidate knowledge becomes organizational quality knowledge.

## Core Concepts

### Discovery Source

A source that may contain quality-relevant concerns.

Examples:

- stakeholder interview;
- document;
- incident report;
- customer complaint;
- operational history;
- audit record;
- expert review;
- regulation;
- service metric narrative.

### Discovery Context

The environment in which discovery is happening.

Attributes:

| Attribute | Meaning |
| --- | --- |
| domain | Software, operations, accounting, maintenance, administration, customer support, product, or other domain. |
| target description | The work, service, process, product, or decision being explored. |
| stakeholders | People or groups who receive value or absorb loss. |
| operating constraints | Known time, cost, safety, legal, staffing, or service constraints. |
| known incidents | Prior failures or near misses. |
| unknowns | Explicit uncertainties that should guide exploration. |

### Discovery Pattern

A reusable exploration strategy for uncovering hidden quality concerns.

A Discovery Pattern is not a checklist item. It is a strategy that helps decide what to ask next and what kind of evidence to seek.

Canonical attributes:

| Attribute | Purpose |
| --- | --- |
| pattern id | Stable identifier. |
| name | Human-readable pattern name. |
| discovery goal | What hidden concern the pattern tries to reveal. |
| trigger context | When this pattern is likely relevant. |
| exploration prompts | Non-mandatory prompt templates. |
| evidence to seek | Source types or signals that can ground the exploration. |
| emerging outputs | Candidate concerns, loss boundaries, decision patterns, or Quality Intents. |
| stop conditions | When exploration is sufficient for the current slice. |
| anti-pattern warnings | Checklist or bias traps to avoid. |
| confidence signals | Signals that strengthen or weaken extracted candidates. |

### Discovery Probe

A single exploratory move generated from a Discovery Pattern.

Examples:

- ask a stakeholder what would make the effort a failure;
- compare two incidents to identify repeated loss boundaries;
- inspect a regulation for non-waivable obligations;
- ask an operator what happens when normal staffing is unavailable.

A probe may produce no Quality Intent. That is acceptable. Discovery is exploratory.

### Candidate Concern

A hypothesized failure, harm, burden, or unacceptable outcome discovered from sources.

Candidate Concerns are not final. They must be grounded in evidence and mapped to candidate Loss Boundaries.

### Candidate Loss Boundary

A proposed line that the organization or stakeholder appears unwilling to cross.

Examples:

- customer cannot lose access to purchased service during business hours;
- financial commitments cannot bypass delegated approval authority;
- maintenance work must not leave equipment in an unsafe ambiguous state;
- customer support must not give irreversible instructions without verification.

### Candidate Quality Intent

A proposed Quality Intent derived by the Discovery Layer.

It should include:

| Field | Requirement |
| --- | --- |
| statement | What quality must mean in this context. |
| source concern refs | Candidate Concerns that justify it. |
| loss boundary refs | Candidate Loss Boundaries it protects. |
| evidence refs | Sources or answers that support it. |
| confidence | Current confidence in the candidate. |
| uncertainty | What remains unclear. |
| review status | candidate, needs-review, accepted, rejected, superseded. |
| qif generation map | How it maps into QIF entities if accepted. |

### QIF Generation Map

A trace that explains how Discovery Layer outputs map into QIF representation entities.

Mapping examples:

| Discovery output | QIF representation target |
| --- | --- |
| Candidate Concern | Concern or Risk. |
| Candidate Loss Boundary | Loss Boundary. |
| Candidate Quality Intent | Quality Intent. |
| Source Evidence | Knowledge Source or Evidence Item. |
| Discovery Pattern | Discovery provenance, not a Quality Intent. |
| Discovery Coverage | Discovery metadata, not a Verdict. |

## Discovery Pattern Taxonomy

The following patterns are canonical candidates for v0.3. They are optional strategies, not mandatory coverage categories.

### 1. Failure Discovery

Goal: identify unacceptable outcomes.

Use when:

- the stakeholder cannot state quality requirements;
- the target is new or ambiguous;
- project success is being discussed abstractly.

Prompt examples:

- What would make this effort a failure?
- Who would be harmed if this passed as-is?
- What would trigger emergency response?
- What outcome would be hard to forgive even if all tasks were completed?

Outputs:

- Candidate Concern;
- Candidate Loss Boundary;
- Candidate Quality Intent.

Anti-pattern warning: do not convert common failures into a mandatory checklist.

### 2. Stakeholder Harm Discovery

Goal: identify who absorbs loss and what kind of loss matters.

Use when:

- stakeholder map is unclear;
- quality is being framed only from producer perspective;
- customer, operator, auditor, manager, or downstream team impact is unknown.

Prompt examples:

- Who notices first if this goes wrong?
- Who pays the cost of recovery?
- Who loses trust, time, money, safety, or authority?
- Which stakeholder has veto power even if they are not the sponsor?

Outputs:

- Stakeholder Impact;
- Candidate Concern;
- Escalation Norm.

### 3. Operational Continuity Discovery

Goal: reveal operational quality concerns.

Use when:

- the target will be operated after delivery;
- staffing, handoff, outage, or recovery matters;
- quality depends on repeated execution, not only initial delivery.

Prompt examples:

- Who operates this after handoff?
- What happens during an outage or exception?
- How quickly must service be restored?
- What must be observable before operators can act confidently?
- What happens when the usual expert is absent?

Outputs:

- Operational Risk;
- Evidence Need;
- Candidate Quality Intent;
- Governance Trigger candidate.

### 4. Regulatory And Audit Discovery

Goal: identify external obligations and audit boundaries.

Use when:

- law, regulation, contract, policy, or auditability may constrain quality;
- waiver authority is unclear;
- recordkeeping matters.

Prompt examples:

- Which rule or obligation applies even if stakeholders prefer speed?
- What record would an auditor expect?
- Which decisions require explicit approval?
- What cannot be waived locally?

Outputs:

- Non-negotiable Loss Boundary;
- Required Evidence;
- Governance Trigger candidate.

### 5. Business Impact Discovery

Goal: connect quality concerns to business loss without reducing quality to revenue alone.

Use when:

- business stakeholders describe goals but not failure boundaries;
- tradeoffs are likely;
- prioritization requires impact clarity.

Prompt examples:

- What business outcome is protected here?
- What cost appears later if this is accepted now?
- Which failure would damage trust or future options?
- What tradeoff is acceptable, and what tradeoff is not?

Outputs:

- Quality Tradeoff;
- Risk Appetite signal;
- Candidate Quality Intent.

### 6. Cost Of Recovery Discovery

Goal: discover quality concerns through repair burden.

Use when:

- failures may be recoverable but expensive;
- maintainers or operators carry hidden costs;
- rework is normalized.

Prompt examples:

- If this fails, how hard is it to recover?
- Who has to clean it up?
- What evidence would reduce recovery uncertainty?
- What small omission causes disproportionate recovery cost?

Outputs:

- Recovery Risk;
- Evidence Requirement;
- Candidate Loss Boundary.

### 7. Scalability And Load Discovery

Goal: reveal growth, capacity, and load-related quality concerns without assuming software-only performance categories.

Use when:

- demand, volume, queue length, staffing, or throughput may change;
- manual processes could break at scale;
- future growth is expected but underspecified.

Prompt examples:

- What happens if volume doubles?
- Which step becomes the bottleneck first?
- What cannot be handled manually anymore?
- What degradation is acceptable, and what degradation is not?

Outputs:

- Capacity Boundary;
- Degradation Policy;
- Candidate Quality Intent.

### 8. Human Error Discovery

Goal: identify predictable mistakes and design quality around human limits.

Use when:

- humans operate, review, approve, enter, transfer, or interpret information;
- errors may be blamed on individuals instead of system design;
- expert-only operation is a risk.

Prompt examples:

- What would a junior person likely miss?
- Which step is easy to perform incorrectly?
- What cue tells an operator they are in the wrong state?
- How should the system recover from a likely mistake?

Outputs:

- Error Trap;
- Evidence Need;
- Candidate Decision Pattern;
- Training or interface Quality Intent candidate.

### 9. Exception And Waiver Discovery

Goal: reveal quality through what can be waived, by whom, and under what evidence.

Use when:

- speed pressures exist;
- exceptional approval is common;
- governance is implicit.

Prompt examples:

- Under what condition would you waive this concern?
- Who can approve that waiver?
- What evidence makes the waiver comfortable?
- What must be recorded after the waiver?

Outputs:

- Waiver Practice;
- Escalation Norm;
- Governance Trigger candidate;
- Candidate Applicability Boundary.

### 10. Precedent And Incident Discovery

Goal: derive quality knowledge from prior events.

Use when:

- historical incidents, complaints, audit findings, or review comments exist;
- experts remember concrete cases better than abstract rules.

Prompt examples:

- Have you seen a similar case before?
- What happened then?
- What changed your decision last time?
- What would you never allow again?

Outputs:

- Review History Inference;
- Candidate Decision Pattern;
- Candidate Quality Intent;
- Confidence signal.

### 11. Solution Bias Discovery

Goal: detect when the work is framed around a proposed solution before the protected loss boundary is understood.

Use when:

- a task title names a UI control, workflow, automation, report, or mechanism;
- stakeholders request implementation but the underlying failure is unclear;
- alternatives have not been considered;
- acceptance criteria only describe the requested solution.

Prompt examples:

- What user problem can be stated without naming this solution?
- What would still be bad if this solution were implemented exactly as requested?
- What loss boundary is this solution supposed to protect?
- What simpler boundary, data model, or operational change could solve the same problem?
- What assumption would make this solution unnecessary?

Outputs:

- Assumption Under Review;
- Candidate Concern;
- Alternative Direction;
- Pre-Implementation Verdict candidate.

Anti-pattern warning: do not treat solution presence as evidence of quality.

### 12. Boundary Confusion Discovery

Goal: identify boundaries that may be hidden, merged, or confused by a proposed change.

Use when:

- sample, template, seed, draft, generated, approved, or user-owned data may be confused;
- editable work surfaces and read-only projections are close together;
- a source of truth is unclear;
- responsibility, authority, lifecycle, or evidence state may be ambiguous.

Prompt examples:

- What is the source of truth?
- What is editable, generated, read-only, sample, template, draft, or approved?
- Which boundary would a first-time user likely misunderstand?
- Is this boundary better represented by project files, data state, routing, authority, or UI controls?
- What forbidden state would indicate the boundary failed?

Outputs:

- Boundary Under Review;
- Candidate Loss Boundary;
- Negative Acceptance Criterion;
- Candidate Quality Intent.

Anti-pattern warning: do not hide a data or authority boundary behind a convenience toggle.

### 13. Concept Comprehension Discovery

Goal: discover whether intended users can understand the concepts needed to act safely.

Use when:

- the target exposes domain terms, generated analysis, projections, governance records, or expert concepts;
- a user may not know what they can edit, trust, approve, or ignore;
- verification currently checks that UI or documents exist, but not that they are understandable;
- junior users, non-experts, operators, or AI agents must apply the result.

Prompt examples:

- What does the user think they are looking at?
- What can the user change?
- What is only evidence, projection, analysis, template, or sample data?
- Which visible terms require prior expert knowledge?
- Can the target user explain the artifact or work surface in one sentence?
- What would a junior person or AI agent likely misunderstand?

Outputs:

- Concept Comprehension Risk;
- Evidence Need;
- Negative Acceptance Criterion;
- Candidate Quality Intent.

Anti-pattern warning: do not treat rendered text, controls, or documents as proof that the concept is understood.

## Dynamic Discovery Flow

The Discovery Layer should not run every pattern. It should select and sequence patterns dynamically.

### Flow

| Step | Purpose | Output |
| --- | --- | --- |
| 1. Intake | Capture target, domain, stakeholders, sources, known constraints. | Discovery Context. |
| 2. Initial pattern selection | Choose likely useful Discovery Patterns from context. | Pattern selection rationale. |
| 3. Probe generation | Generate non-mandatory questions or source-inspection tasks. | Discovery Probes. |
| 4. Source capture | Record answers, documents, incidents, observations, or gaps. | Discovery Evidence. |
| 5. Concern extraction | Extract candidate concerns and cues. | Candidate Concern set. |
| 6. Boundary mapping | Map concerns to loss boundaries. | Candidate Loss Boundaries. |
| 7. Intent hypothesis | Propose candidate Quality Intents. | Candidate Quality Intent set. |
| 8. Confidence and ambiguity assessment | Score support, contradiction, source strength, and unresolved questions. | Confidence and uncertainty. |
| 9. QIF generation mapping | Explain how candidates map to QIF entities. | QIF Generation Map. |
| 10. Governance handoff | Mark candidates for review, acceptance, rejection, or further discovery. | Governance Trigger or review queue. |

### Pattern Selection Heuristics

The system may select patterns using signals such as:

| Signal | Likely pattern |
| --- | --- |
| Stakeholders cannot define quality. | Failure Discovery. |
| User impact is unclear. | Stakeholder Harm Discovery. |
| Handoff or operation matters. | Operational Continuity Discovery. |
| Policy, audit, or law appears. | Regulatory And Audit Discovery. |
| Sponsor talks in business outcomes. | Business Impact Discovery. |
| Recovery is expensive or manual. | Cost Of Recovery Discovery. |
| Volume may grow. | Scalability And Load Discovery. |
| Human operation or review is central. | Human Error Discovery. |
| Exceptions are common. | Exception And Waiver Discovery. |
| Past incidents or reviews exist. | Precedent And Incident Discovery. |

Pattern selection must be explainable:

- why this pattern was selected;
- what source triggered it;
- what question or probe was generated;
- what candidate knowledge emerged;
- what uncertainty remains.

## Evidence Traceability

Every candidate Quality Intent should trace to discovery evidence.

Evidence should capture:

| Attribute | Meaning |
| --- | --- |
| source type | Interview, document, incident, review history, regulation, operation observation, complaint, audit record. |
| source ref | Stable reference to the source or captured answer. |
| captured content | The relevant answer, excerpt summary, observation, or structured record. |
| extraction rationale | Why the source suggests a concern, boundary, or intent. |
| sensitivity handling | Redaction or privacy constraints. |
| confidence contribution | Whether this source strengthens, weakens, or merely suggests the candidate. |

The Discovery Layer should preserve raw capture separately from extracted interpretation, following the v0.2.1 Raw Expert Answer and Extraction Step model.

## Confidence Model

Discovery confidence is not verdict confidence.

Discovery confidence estimates how well a candidate Quality Intent is grounded before governance review.

Suggested dimensions:

| Dimension | Meaning |
| --- | --- |
| source strength | Direct stakeholder statement, observed incident, regulation, or weak inference. |
| source diversity | Whether multiple independent sources point to the same concern. |
| cue clarity | Whether the signal that triggered the concern is explicit. |
| loss boundary clarity | Whether the unacceptable outcome is concrete. |
| contradiction level | Whether sources disagree. |
| applicability clarity | Whether context boundaries are known. |
| review maturity | Whether expert, stakeholder, or governance review has occurred. |

Suggested confidence states:

| State | Meaning |
| --- | --- |
| weak candidate | Interesting but under-evidenced. |
| grounded candidate | Evidence and loss boundary are explicit, but review is incomplete. |
| review-ready | Candidate has enough traceability to be reviewed for QIF inclusion. |
| accepted | Governance or authorized review accepted it into QIF representation. |
| rejected | Candidate was reviewed and rejected. |
| superseded | Candidate was replaced by a better framed intent. |

## Discovery Coverage Without Checklists

Discovery coverage measures exploration breadth and uncertainty reduction, not category completion.

Allowed coverage language:

| Coverage signal | Meaning |
| --- | --- |
| failure risks explored | The discovery process asked what failure means and captured unacceptable outcomes. |
| stakeholder concerns explored | Relevant stakeholder harms were investigated. |
| operational risks explored | Operation, recovery, handoff, and exception behavior were investigated. |
| evidence diversity | Multiple source types were considered. |
| uncertainty remaining | Known unanswered questions are explicit. |

Rejected coverage language:

| Rejected signal | Reason |
| --- | --- |
| all quality categories checked | Reintroduces checklist completion. |
| 20 questions answered | Activity count is not discovery quality. |
| security/performance/availability all reviewed | Assumes the relevant quality dimensions in advance. |

Discovery coverage may be high even if some common quality categories are never mentioned, provided the relevant failure concerns were explored and traceable.

## Output To QIF

The Discovery Layer should output a candidate bundle, not directly mutate QIF truth.

Candidate bundle contents:

| Output | Description |
| --- | --- |
| discovery context | What was explored and why. |
| selected patterns | Patterns used and selection rationale. |
| probes | Questions or source-inspection tasks generated. |
| captured evidence | Interview answers, document findings, incidents, or observations. |
| candidate concerns | Extracted concerns with source refs. |
| candidate loss boundaries | Proposed unacceptable loss lines. |
| candidate quality intents | Proposed Quality Intents with confidence and ambiguity. |
| qif generation map | Mapping into QIF entities if accepted. |
| governance handoff | Review requirements and unresolved risks. |

Only after review should accepted candidates become QIF representation artifacts.

## Governance Model

Discovery governance should answer:

- Is the candidate Quality Intent grounded in real evidence?
- Is the loss boundary explicit enough?
- Is the candidate too broad, too vague, or too context-specific?
- Does it conflict with existing QIF knowledge?
- Who can accept, reject, waive, or defer it?
- What additional evidence is required?

Governance outcomes:

| Outcome | Meaning |
| --- | --- |
| accept into QIF | Candidate becomes a Quality Intent or related QIF entity. |
| accept as provisional | Candidate can be used with explicit confidence and review limits. |
| request more discovery | More sources or probes are required. |
| reject | Candidate is not adopted. |
| split | Candidate contains multiple intents or boundaries. |
| merge | Candidate duplicates existing QIF knowledge. |
| retire | Candidate is obsolete or superseded. |

## v0.3 Implementation Recommendation

### Recommended v0.3 Scope

Build a minimal executable Discovery Layer package and verifier around the design.

Recommended additions:

1. Discovery Pattern schema.
2. Discovery Context schema.
3. Discovery Probe schema.
4. Discovery Evidence schema.
5. Candidate Quality Intent schema.
6. QIF Generation Map schema.
7. Example discovery package.
8. Verifier rules for traceability, non-checklist guardrails, and candidate status.

### Defer

Defer the following until after the first v0.3 discovery package exists:

- UI;
- external system integrations;
- automatic interview orchestration;
- LLM provider integration;
- scoring optimization;
- organization-specific pattern libraries;
- semantic acceptance automation.

### Verifier Boundaries

The v0.3 Discovery Layer verifier should check:

| Can verify | Cannot verify |
| --- | --- |
| Candidate intents link to evidence. | Candidate intent is semantically correct. |
| Discovery Patterns are exploratory, not mandatory checklist categories. | The best possible questions were asked. |
| Confidence inputs are present and reproducible. | Confidence inputs are truthful. |
| QIF generation map resolves references. | Governance should accept the candidate. |
| Uncertainty is explicit. | All relevant concerns were discovered. |

## Acceptance Criteria

The Discovery Layer design is accepted when it can show:

1. A non-expert can start from a vague target and stakeholder context.
2. The system selects Discovery Patterns with an explicit rationale.
3. The system generates exploratory probes, not mandatory checklist questions.
4. Captured evidence is separated from extracted interpretation.
5. Candidate Concerns map to Candidate Loss Boundaries.
6. Candidate Quality Intents are generated with source refs, confidence, and ambiguity.
7. Discovery coverage is expressed as exploration breadth and uncertainty, not checklist completion.
8. A QIF Generation Map explains how accepted candidates become QIF representation entities.
9. Governance can accept, reject, split, merge, or request more discovery.
10. The verifier can enforce traceability and anti-checklist guardrails without claiming semantic truth.

## North Star

QIF v0.3 succeeds when a non-expert can discover what stakeholders actually fear losing, produce candidate Quality Intents with evidence and uncertainty, and hand those candidates into QIF without reducing quality to checklist completion.
