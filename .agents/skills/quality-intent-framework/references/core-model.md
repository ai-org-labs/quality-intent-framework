# QIF Core Model

## Purpose

QIF represents what an organization is trying to protect, why it matters, what
evidence supports the claim, and who must govern uncertainty. It does not
replace domain expertise or make evidence true.

## Core Entities

- **Evaluation Target**: the concrete object, decision, service, process,
  product, document, or operation being evaluated.
- **Stakeholder**: anyone who receives value, bears risk, operates the target,
  or accepts residual risk.
- **Risk**: a plausible path from the target or context to harm or loss.
- **Loss Boundary**: the outcome the organization is unwilling to cross.
- **Quality Intent**: a context-specific statement of what must be protected
  or achieved to avoid that loss.
- **Applicability Decision**: why an intent or decision pattern applies or does
  not apply to this target.
- **Evidence**: an observation or artifact used to support or challenge a
  quality claim.
- **Finding**: a specific evidence-linked condition, gap, conflict, or risk.
- **Verdict**: a bounded decision supported by evidence and confidence.
- **Governance Trigger**: a reason a human or accountable body must decide,
  revise, waive, escalate, or retire quality knowledge.

## Invariants

1. Quality is fitness relative to stakeholder value, loss boundaries, and
   context, not volume of activity or artifacts.
2. A Quality Intent must be traceable to a concern, risk, or loss boundary.
3. A verdict must cite evidence and preserve material unknowns.
4. Applicability is target-specific; a reusable rule is not itself proof that
   an intent applies.
5. Expert opinion is candidate knowledge until challenged and reproduced.
6. Historical decisions remain auditable when evidence or policy changes.
7. Verification can prove declared structure and calculations, not semantic
   truth, authenticity, causality, authority, or future safety.

## Quality Aspects Are Prompts, Not Checklists

Functional correctness, security, privacy, safety, reliability,
availability, performance, scalability, usability, accessibility, UX,
maintainability, operability, recoverability, compliance, financial control,
data quality, explainability, organizational fit, and sustainability are
exploration lenses. Select a lens because a stakeholder, context, risk, or
loss boundary makes it relevant. Never declare quality from lens coverage.

## Minimum Framing

```text
Need: the real problem or loss to prevent
Intent: what QIF should help decide or make explicit
Context: target, domain, stakeholders, constraints, evidence, and uncertainty
```

If these cannot yet be stated, use Discovery rather than guessing.
