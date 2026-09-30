# Decision Record: DEC-MUNM4CTT-R3VUO3

- Record Format Version: 1.0.0
- Created At: 2026-09-30T04:35:57.037Z
- Canonical Markdown Path: .aof/decisions/DEC-MUNM4CTT-R3VUO3.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-09-30T04:35:57.037Z
- Canonical Markdown Path: .aof/decisions/DEC-MUNM4CTT-R3VUO3.md
- Scope: concept-approval
- Stage: planning
- Organization: Civic Studio

## Input
- Request: Advance QIF after v0.6.32 using the current roadmap and latest AI evaluation evidence.
- Need: Scope the redesign to the standalone calibration-report runtime: policies, decision-outcome pairs, cohort records, consequence classification, aggregate consequence assessment, verifier rules, examples, fixtures, docs, and release evidence. Keep other package types, UI, external integrations, production data, and automatic deployment authority out of scope.
- Intent: Success means another human or AI can reproduce how each forecast crosses a governed action threshold, classify false assurance versus false alarm against an explicit loss boundary, reproduce consequence-weighted arithmetic, and force governance when a severe false-assurance boundary is crossed. Counts, monetary values, weights, thresholds, and scores remain evidence, never quality or semantic truth.
- Context: context: Scope the redesign to the standalone calibration-report runtime: policies, decision-outcome pairs, cohort records, consequence classification, aggregate consequence assessment, verifier rules, examples, fixtures, docs, and release evidence. Keep other package types, UI, external integrations, production data, and automatic deployment authority out of scope. | success: Success means another human or AI can reproduce how each forecast crosses a governed action threshold, classify false assurance versus false alarm against an explicit loss boundary, reproduce consequence-weighted arithmetic, and force governance when a severe false-assurance boundary is crossed. Counts, monetary values, weights, thresholds, and scores remain evidence, never quality or semantic truth.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MUNM1G6J-E7NJMW
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope the redesign to the standalone calibration-report runtime: policies, decision-outcome pairs, cohort records, consequence classification, aggregate consequence assessment, verifier rules, examples, fixtures, docs, and release evidence. Keep other package types, UI, external integrations, production data, and automatic deployment authority out of scope. / How should improvement success be judged: which metric or end state matters most? => Success means another human or AI can reproduce how each forecast crosses a governed action threshold, classify false assurance versus false alarm against an explicit loss boundary, reproduce consequence-weighted arithmetic, and force governance when a severe false-assurance boundary is crossed. Counts, monetary values, weights, thresholds, and scores remain evidence, never quality or semantic truth.
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
- Protocol Thread ID: SESS-MUNM1G6J-E7NJMW

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUNM1QZ1-YOPBRA

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
