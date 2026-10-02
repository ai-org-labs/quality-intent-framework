# Decision Record: DEC-MUQH8SZ9-G5RGFM

- Record Format Version: 1.0.0
- Created At: 2026-10-02T04:42:45.045Z
- Canonical Markdown Path: .aof/decisions/DEC-MUQH8SZ9-G5RGFM.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-02T04:42:45.045Z
- Canonical Markdown Path: .aof/decisions/DEC-MUQH8SZ9-G5RGFM.md
- Scope: concept-approval
- Stage: planning
- Organization: Civic Studio

## Input
- Request: Advance QIF after v0.6.34 using the current roadmap and latest AI evaluation evidence. Build and release v0.6.35 Selective Escalation Calibration.
- Need: Scope the standalone, domain-general calibration-report runtime: governed proceed, defer, human-review, and specialist-escalation route policies; target-specific route decisions; route execution evidence; reproducible route outcome summaries; governance, schemas, verifier, examples, retained fixtures, documentation, and release evidence. Exclude UI, external integrations, production claims, automatic authority assignment, staff surveillance, causal attribution, and changes to unrelated package types.
- Intent: Success means a human or AI can reproduce which governed route was recommended for each existing decision-outcome pair, compare it with the route actually executed, resolve the accountable authority and execution evidence, reproduce per-route held/failed outcomes, and route mismatch, unresolved authority, failed escalated outcomes, insufficient data, or unverified evidence to governance. Route volume, escalation frequency, scores, and counts remain evidence, never quality, competence, or semantic truth.
- Context: context: Scope the standalone, domain-general calibration-report runtime: governed proceed, defer, human-review, and specialist-escalation route policies; target-specific route decisions; route execution evidence; reproducible route outcome summaries; governance, schemas, verifier, examples, retained fixtures, documentation, and release evidence. Exclude UI, external integrations, production claims, automatic authority assignment, staff surveillance, causal attribution, and changes to unrelated package types. | success: Success means a human or AI can reproduce which governed route was recommended for each existing decision-outcome pair, compare it with the route actually executed, resolve the accountable authority and execution evidence, reproduce per-route held/failed outcomes, and route mismatch, unresolved authority, failed escalated outcomes, insufficient data, or unverified evidence to governance. Route volume, escalation frequency, scores, and counts remain evidence, never quality, competence, or semantic truth.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MUQH2DHK-PUKAUZ
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope the standalone, domain-general calibration-report runtime: governed proceed, defer, human-review, and specialist-escalation route policies; target-specific route decisions; route execution evidence; reproducible route outcome summaries; governance, schemas, verifier, examples, retained fixtures, documentation, and release evidence. Exclude UI, external integrations, production claims, automatic authority assignment, staff surveillance, causal attribution, and changes to unrelated package types. / How should improvement success be judged: which metric or end state matters most? => Success means a human or AI can reproduce which governed route was recommended for each existing decision-outcome pair, compare it with the route actually executed, resolve the accountable authority and execution evidence, reproduce per-route held/failed outcomes, and route mismatch, unresolved authority, failed escalated outcomes, insufficient data, or unverified evidence to governance. Route volume, escalation frequency, scores, and counts remain evidence, never quality, competence, or semantic truth.
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
- Protocol Thread ID: SESS-MUQH2DHK-PUKAUZ

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUQH40W9-GFAYY0

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
