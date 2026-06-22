# Decision Record: DEC-MQODIII3-BRTR1A

- Record Format Version: 1.0.0
- Created At: 2026-06-21T22:43:57.867Z
- Canonical Markdown Path: .aof/decisions/DEC-MQODIII3-BRTR1A.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-21T22:43:57.867Z
- Canonical Markdown Path: .aof/decisions/DEC-MQODIII3-BRTR1A.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Extend QIF into a discovery and application runtime that shows how expert judgments become reusable quality knowledge and how that knowledge is applied to real evaluation targets
- Need: Scope: extend QIF with a domain-general discovery and application runtime covering discovery sessions, organizational quality culture aggregation, evaluation targets, applicability rules, and review runs across software, product, service operations, accounting, administration, maintenance, and customer support. Out of scope: UI, external integrations, software-tool assumptions, checklist-only quality, and treating expert opinion or activity counts as quality truth.
- Intent: Success: QIF v0.2 can show how expert judgment was extracted, transformed into reusable quality knowledge, selected for a real target through explicit applicability rules, evaluated with evidence, and turned into a verdict with residual risk and governance triggers that a non-expert human or AI agent can inspect and replay.
- Context: context: Scope: extend QIF with a domain-general discovery and application runtime covering discovery sessions, organizational quality culture aggregation, evaluation targets, applicability rules, and review runs across software, product, service operations, accounting, administration, maintenance, and customer support. Out of scope: UI, external integrations, software-tool assumptions, checklist-only quality, and treating expert opinion or activity counts as quality truth. | success: Success: QIF v0.2 can show how expert judgment was extracted, transformed into reusable quality knowledge, selected for a real target through explicit applicability rules, evaluated with evidence, and turned into a verdict with residual risk and governance triggers that a non-expert human or AI agent can inspect and replay.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MQODID63-10U4EO
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope: extend QIF with a domain-general discovery and application runtime covering discovery sessions, organizational quality culture aggregation, evaluation targets, applicability rules, and review runs across software, product, service operations, accounting, administration, maintenance, and customer support. Out of scope: UI, external integrations, software-tool assumptions, checklist-only quality, and treating expert opinion or activity counts as quality truth. / How should improvement success be judged: which metric or end state matters most? => Success: QIF v0.2 can show how expert judgment was extracted, transformed into reusable quality knowledge, selected for a real target through explicit applicability rules, evaluated with evidence, and turned into a verdict with residual risk and governance triggers that a non-expert human or AI agent can inspect and replay.
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
- Protocol Thread ID: SESS-MQODID63-10U4EO

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQODIII0-1RE2H2

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
