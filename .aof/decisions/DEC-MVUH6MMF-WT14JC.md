# Decision Record: DEC-MVUH6MMF-WT14JC

- Record Format Version: 1.0.0
- Created At: 2026-10-30T04:31:50.535Z
- Canonical Markdown Path: .aof/decisions/DEC-MVUH6MMF-WT14JC.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-30T04:31:50.535Z
- Canonical Markdown Path: .aof/decisions/DEC-MVUH6MMF-WT14JC.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Need: organizations need an auditable bridge from a complete trust-policy rollout preview to a bounded activation decision with monitored rollback. Intent: define provider-neutral activation, observation, abort, and rollback records that remain human-governed and non-authoritative. Context: QIF v0.8.6 freezes and evaluates the full knowledge population but deliberately stops before activation; current agent-governance practice emphasizes scoped authorization, continuous evaluation, canary rollout, circuit breakers, and rollback.
- Need: Scope only the qif-ledger trust-policy path after a sufficient v0.8.6 rollout preview: accountable activation decision, bounded observation window, abort conditions, rollback plan and execution evidence, plus governance. Exclude UI, live deployment, external integrations, cryptographic verification, automatic authority, and semantic-truth claims.
- Intent: Success means every activation decision references a sufficient rollout preview and accountable approver; every activated policy has explicit observation signals, stop conditions, rollback target and deadline; adverse or incomplete observations deterministically block or roll back; fixtures, npm test, portable build, and AOF verification pass.
- Context: context: Scope only the qif-ledger trust-policy path after a sufficient v0.8.6 rollout preview: accountable activation decision, bounded observation window, abort conditions, rollback plan and execution evidence, plus governance. Exclude UI, live deployment, external integrations, cryptographic verification, automatic authority, and semantic-truth claims. | success: Success means every activation decision references a sufficient rollout preview and accountable approver; every activated policy has explicit observation signals, stop conditions, rollback target and deadline; adverse or incomplete observations deterministically block or roll back; fixtures, npm test, portable build, and AOF verification pass.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVUH6J0A-GHV0QG
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope only the qif-ledger trust-policy path after a sufficient v0.8.6 rollout preview: accountable activation decision, bounded observation window, abort conditions, rollback plan and execution evidence, plus governance. Exclude UI, live deployment, external integrations, cryptographic verification, automatic authority, and semantic-truth claims. / How should improvement success be judged: which metric or end state matters most? => Success means every activation decision references a sufficient rollout preview and accountable approver; every activated policy has explicit observation signals, stop conditions, rollback target and deadline; adverse or incomplete observations deterministically block or roll back; fixtures, npm test, portable build, and AOF verification pass.
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
- Protocol Thread ID: SESS-MVUH6J0A-GHV0QG

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVUH6MMD-VY8QRD

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
