# Decision Record: DEC-MQQWP5L8-L04DY1

- Record Format Version: 1.0.0
- Created At: 2026-06-23T17:16:32.780Z
- Canonical Markdown Path: .aof/decisions/DEC-MQQWP5L8-L04DY1.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-23T17:16:32.780Z
- Canonical Markdown Path: .aof/decisions/DEC-MQQWP5L8-L04DY1.md
- Scope: concept-approval
- Stage: clarification
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
- Protocol Thread ID: SESS-MQQWOH7W-5TIJE6

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQQWP5C8-WQ5104

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
