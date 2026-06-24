# Decision Record: DEC-MQSALHSP-64ZDU1

- Record Format Version: 1.0.0
- Created At: 2026-06-24T16:33:22.777Z
- Canonical Markdown Path: .aof/decisions/DEC-MQSALHSP-64ZDU1.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-24T16:33:22.777Z
- Canonical Markdown Path: .aof/decisions/DEC-MQSALHSP-64ZDU1.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Design QIF pre-implementation review and negative acceptance additions. Need: incorporate cross-project retrospective feedback showing QIF must prevent mistaken quality hypotheses before implementation, not only validate structure after implementation. Intent: add standalone QIF guidance for pre-implementation quality review, negative acceptance criteria, data boundary quality intent, concept comprehension quality intent, and solution-bias discovery patterns. Context: docs-only v0.3.1 candidate; QIF remains standalone and AOF is governance evidence only; do not implement runtime schemas, UI, external integrations, or release/tag in this slice.
- Need: Touchpoint is the pre-implementation quality decision point for repositories, documents, requirements, UI/UX changes, operational procedures, and agent work products. Out of scope: runtime schema implementation, UI, external integrations, AOF-specific worker enforcement, release/tagging, or changing v0.2.1 executable schemas in this slice.
- Intent: Success is judged by whether QIF can explain how to block solution-biased or boundary-confused work before implementation: documented review workflow, negative acceptance model, data boundary and concept comprehension quality intents, discovery patterns, examples, and verifier boundaries are added without making QIF depend on AOF.
- Context: context: Touchpoint is the pre-implementation quality decision point for repositories, documents, requirements, UI/UX changes, operational procedures, and agent work products. Out of scope: runtime schema implementation, UI, external integrations, AOF-specific worker enforcement, release/tagging, or changing v0.2.1 executable schemas in this slice. | success: Success is judged by whether QIF can explain how to block solution-biased or boundary-confused work before implementation: documented review workflow, negative acceptance model, data boundary and concept comprehension quality intents, discovery patterns, examples, and verifier boundaries are added without making QIF depend on AOF.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MQSAL5T6-2P3E8G
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Touchpoint is the pre-implementation quality decision point for repositories, documents, requirements, UI/UX changes, operational procedures, and agent work products. Out of scope: runtime schema implementation, UI, external integrations, AOF-specific worker enforcement, release/tagging, or changing v0.2.1 executable schemas in this slice. / How should improvement success be judged: which metric or end state matters most? => Success is judged by whether QIF can explain how to block solution-biased or boundary-confused work before implementation: documented review workflow, negative acceptance model, data boundary and concept comprehension quality intents, discovery patterns, examples, and verifier boundaries are added without making QIF depend on AOF.
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
- Protocol Thread ID: SESS-MQSAL5T6-2P3E8G

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQSALHS9-ETFS6G

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
