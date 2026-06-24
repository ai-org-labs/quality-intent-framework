# Decision Record: DEC-MQSAN8HN-WW8N75

- Record Format Version: 1.0.0
- Created At: 2026-06-24T16:34:44.025Z
- Canonical Markdown Path: .aof/decisions/DEC-MQSAN8HN-WW8N75.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-24T16:34:44.025Z
- Canonical Markdown Path: .aof/decisions/DEC-MQSAN8HN-WW8N75.md
- Scope: concept-approval
- Stage: planning
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
- Protocol Thread ID: SESS-MQSAL5T6-2P3E8G

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQSALHS9-ETFS6G

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
