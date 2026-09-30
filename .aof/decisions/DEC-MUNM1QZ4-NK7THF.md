# Decision Record: DEC-MUNM1QZ4-NK7THF

- Record Format Version: 1.0.0
- Created At: 2026-09-30T04:33:55.408Z
- Canonical Markdown Path: .aof/decisions/DEC-MUNM1QZ4-NK7THF.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-09-30T04:33:55.408Z
- Canonical Markdown Path: .aof/decisions/DEC-MUNM1QZ4-NK7THF.md
- Scope: concept-approval
- Stage: clarification
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
- Protocol Thread ID: SESS-MUNM1G6J-E7NJMW

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUNM1QZ1-YOPBRA

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
