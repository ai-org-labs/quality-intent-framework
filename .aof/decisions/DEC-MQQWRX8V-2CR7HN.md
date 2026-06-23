# Decision Record: DEC-MQQWRX8V-2CR7HN

- Record Format Version: 1.0.0
- Created At: 2026-06-23T17:18:41.926Z
- Canonical Markdown Path: .aof/decisions/DEC-MQQWRX8V-2CR7HN.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-23T17:18:41.926Z
- Canonical Markdown Path: .aof/decisions/DEC-MQQWRX8V-2CR7HN.md
- Scope: concept-approval
- Stage: planning
- Organization: Civic Studio

## Input
- Request: Design exploration for QIF v0.3 Discovery Layer. Need: enable non-experts to discover quality intents through failure-oriented discovery patterns without checklist-driven quality definition. Intent: produce an AOF-reviewed concept boundary, discovery pattern taxonomy, dynamic discovery flow, evidence and confidence model, and v0.3 acceptance criteria before implementation. Context: QIF remains the representation layer for discovered quality intents; Discovery Layer is a separate mechanism for discovering quality intents; no UI, external integration, or fixed checklist coverage model is in scope for this slice.
- Need: Touchpoint is the pre-QIF discovery process: stakeholder interviews, document review, incident/history review, and AI-assisted exploration before QIF artifacts are generated. Out of scope for this slice: UI, external integrations, checklist-style quality categories, software-only assumptions, and changing the stable QIF representation layer.
- Intent: Success is judged by whether a non-expert can use discovery patterns to produce traceable candidate Quality Intents with source evidence, confidence, uncertainty, and explanation, without optimizing for checklist completion.
- Context: context: Touchpoint is the pre-QIF discovery process: stakeholder interviews, document review, incident/history review, and AI-assisted exploration before QIF artifacts are generated. Out of scope for this slice: UI, external integrations, checklist-style quality categories, software-only assumptions, and changing the stable QIF representation layer. | success: Success is judged by whether a non-expert can use discovery patterns to produce traceable candidate Quality Intents with source evidence, confidence, uncertainty, and explanation, without optimizing for checklist completion.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MQQWOH7W-5TIJE6
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Touchpoint is the pre-QIF discovery process: stakeholder interviews, document review, incident/history review, and AI-assisted exploration before QIF artifacts are generated. Out of scope for this slice: UI, external integrations, checklist-style quality categories, software-only assumptions, and changing the stable QIF representation layer. / How should improvement success be judged: which metric or end state matters most? => Success is judged by whether a non-expert can use discovery patterns to produce traceable candidate Quality Intents with source evidence, confidence, uncertainty, and explanation, without optimizing for checklist completion.
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
- Protocol Thread ID: SESS-MQQWOH7W-5TIJE6

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQQWP5C8-WQ5104

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
