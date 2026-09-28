# Decision Record: DEC-MUKR6Y02-9M9K13

- Record Format Version: 1.0.0
- Created At: 2026-09-28T04:34:37.346Z
- Canonical Markdown Path: .aof/decisions/DEC-MUKR6Y02-9M9K13.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-09-28T04:34:37.346Z
- Canonical Markdown Path: .aof/decisions/DEC-MUKR6Y02-9M9K13.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.6.31: add a standalone calibration-report package that links quality-gate decisions to observed outcomes, deterministically reproduces Brier score and calibration buckets, preserves evidence origin and uncertainty boundaries, and routes insufficient or misleading reports to governance without producing an automatic quality verdict.
- Need: Scope: a standalone, domain-general calibration-report package that reads declared quality-gate decision and post-release outcome references; schema, verifier, example, CLI integration, tests, docs, roadmap, and release only. Exclude UI, external integrations, automatic quality verdicts, causal claims, and production pilot data.
- Intent: Success: a human or AI can reproduce decision-outcome pairing, Brier score, calibration buckets, sample boundaries, evidence-origin limits, and required governance actions from portable JSON; invalid arithmetic, references, empirical claims, or verdict substitutions fail deterministically.
- Context: context: Scope: a standalone, domain-general calibration-report package that reads declared quality-gate decision and post-release outcome references; schema, verifier, example, CLI integration, tests, docs, roadmap, and release only. Exclude UI, external integrations, automatic quality verdicts, causal claims, and production pilot data. | success: Success: a human or AI can reproduce decision-outcome pairing, Brier score, calibration buckets, sample boundaries, evidence-origin limits, and required governance actions from portable JSON; invalid arithmetic, references, empirical claims, or verdict substitutions fail deterministically.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MUKR5IWG-FJ9AHE
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope: a standalone, domain-general calibration-report package that reads declared quality-gate decision and post-release outcome references; schema, verifier, example, CLI integration, tests, docs, roadmap, and release only. Exclude UI, external integrations, automatic quality verdicts, causal claims, and production pilot data. / How should improvement success be judged: which metric or end state matters most? => Success: a human or AI can reproduce decision-outcome pairing, Brier score, calibration buckets, sample boundaries, evidence-origin limits, and required governance actions from portable JSON; invalid arithmetic, references, empirical claims, or verdict substitutions fail deterministically.
- Clarification Summary Optional: runtime captured first-round clarification answers and can proceed to need validation
- Unresolved Ambiguity Optional: 

## Options Considered
- Option A: Create need validation artifacts before planning
- Option B: Advance directly to planning
- Option C: Stop until more evidence exists

## Decision
- Selected Option: Create need validation artifacts before planning
- Decision Summary: Clarification has produced a usable frame, but planning must wait for need validation and project charter evidence.

## Governance
- Governance Model: council-of-three
- Decision Makers: strategy-lead-01 (Visionary), risk-reviewer-01 (Guardian)
- Governance Rule Applied: majority-with-guardian-veto
- Veto Used: No

## Rationale
- Why this option: A framed request is not yet a validated need, so project creation and planning remain gated.
- Why other options were not selected: Direct planning would bypass the need validation policy, and stopping completely would discard a usable frame.
- Policy priorities applied: value > safety > quality > speed > cost
- Policy tradeoffs accepted: speed is deferred until the underlying problem and value claim are validated

## Execution
- Actions: write problem statement and value hypothesis artifacts
- Actions: record alternatives and any required experiment
- Actions: produce a need validation record and project charter before planning
- Expected Artifact: need validation artifact set and project charter
- Expected Outcome: planning only starts after a validated need exists
- Completion Criteria: approved need validation record and project charter are linked into the session
- Success Criteria: the next planning step is grounded in a validated need rather than a raw request
- Completion Approval Scope: concept-approval
- Success Evaluation Scope: need validation gate review

## Forecast Optional
- Forecast Required: false
- Forecast Summary: not required before need validation completes
- Uncertainty Notes: the stated request may still be reframed, deferred, or rejected

## Actor Notes Optional
- Actor Performance Notes: not evaluated yet
- Capacity Notes: not evaluated yet
- Fit Notes: Visionary and Guardian judgment is required before Builder-led planning begins
- Protocol Thread ID: SESS-MUKR5IWG-FJ9AHE

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUKR6XZY-WT8PCO

## Review
- Change Trigger: clarification answers completed the initial frame
- Review Trigger: when a need validation record and project charter are produced
- Review Date or Condition: before planning starts
- Re-open Conditions: weak evidence, invalid value hypothesis, missing alternatives, or rejected project recommendation

## Escalation Optional
- Escalation Status: none
- Escalation Summary: none
- Approval Outcome Status: none
- Guardian Veto Used Optional: none
- Escalation Resolution: none
- Escalation Resolution Note: none

---

Project Note:
This generic starter keeps the same runtime shell but uses a non-AIDLC workflow.
