# Decision Record: DEC-MUKR8MO4-V1FT4S

- Record Format Version: 1.0.0
- Created At: 2026-09-28T04:35:55.969Z
- Canonical Markdown Path: .aof/decisions/DEC-MUKR8MO4-V1FT4S.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-09-28T04:35:55.969Z
- Canonical Markdown Path: .aof/decisions/DEC-MUKR8MO4-V1FT4S.md
- Scope: concept-approval
- Stage: planning
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
- Option A: Advance to planning with the current frame
- Option B: Ask another clarification round before planning
- Option C: Stop and request manual intake review

## Decision
- Selected Option: Advance to planning with the current frame
- Decision Summary: Clarification has produced a usable frame and the session can advance to planning.

## Governance
- Governance Model: council-of-three
- Decision Makers: design-builder-01 (Builder), strategy-lead-01 (Visionary)
- Governance Rule Applied: majority-with-guardian-veto
- Veto Used: No

## Rationale
- Why this option: The request now has enough framed need, intent, and context to plan against.
- Why other options were not selected: Additional clarification is not required for the next planning step, and stopping would discard a usable frame.
- Policy priorities applied: value > safety > quality > speed > cost
- Policy tradeoffs accepted: planning starts once framing is usable, even though future review may still reopen the work

## Execution
- Actions: carry the framed need, intent, and context into planning
- Actions: prepare a Builder-led plan packet
- Actions: keep clarification history available for audit and reopen
- Expected Artifact: planning packet and initial implementation or design plan
- Expected Outcome: the session can enter Builder-led planning with a stable framed request
- Completion Criteria: framed request is recorded and a planning-stage decision exists
- Success Criteria: planning can proceed without reopening clarification immediately
- Completion Approval Scope: concept-approval
- Success Evaluation Scope: planning-stage startup review

## Forecast Optional
- Forecast Required: false
- Forecast Summary: not required before initial planning begins
- Uncertainty Notes: planning may still reopen clarification if feasibility or risk gaps emerge

## Actor Notes Optional
- Actor Performance Notes: not evaluated yet
- Capacity Notes: not evaluated yet
- Fit Notes: Builder-led planning is now appropriate because the framing gate is complete
- Protocol Thread ID: SESS-MUKR5IWG-FJ9AHE

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUKR6XZY-WT8PCO

## Review
- Change Trigger: clarification answers completed the initial frame
- Review Trigger: when planning yields a proposal or reopens clarification
- Review Date or Condition: at planning completion or on new blocking ambiguity
- Re-open Conditions: new conflicting signal, weak planning feasibility, or policy conflict

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
