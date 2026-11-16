# Decision Record: DEC-MWIRMP6G-WWEWM0

- Record Format Version: 1.0.0
- Created At: 2026-11-16T04:30:44.728Z
- Canonical Markdown Path: .aof/decisions/DEC-MWIRMP6G-WWEWM0.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-16T04:30:44.728Z
- Canonical Markdown Path: .aof/decisions/DEC-MWIRMP6G-WWEWM0.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.8.15として、複数クライアントから得たAgent Skill評価証拠を、出所・実行者・環境・Skill同一性・チェーンオブカストディとともに取り込み、真正性を過剰主張せず corpus readiness を判定できる provider-neutral な Evidence Intake runtime を開発する。実クライアント実行、認証、秘密情報、外部API統合、自動承認は行わない。
- Need: QIF Agent Skill portability evidence intake and local verification only. Live client execution, authentication, secrets, external APIs, employee monitoring, and automatic authority remain out of scope.
- Intent: Success means every imported run resolves to source, executor, client/environment, exact Skill digest, input/transcript digest, custody history, and reviewer attestation; unverifiable or conflicting evidence must make corpus readiness governance-required.
- Context: context: QIF Agent Skill portability evidence intake and local verification only. Live client execution, authentication, secrets, external APIs, employee monitoring, and automatic authority remain out of scope. | success: Success means every imported run resolves to source, executor, client/environment, exact Skill digest, input/transcript digest, custody history, and reviewer attestation; unverifiable or conflicting evidence must make corpus readiness governance-required.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MWIRMIRJ-5N1XI4
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => QIF Agent Skill portability evidence intake and local verification only. Live client execution, authentication, secrets, external APIs, employee monitoring, and automatic authority remain out of scope. / How should improvement success be judged: which metric or end state matters most? => Success means every imported run resolves to source, executor, client/environment, exact Skill digest, input/transcript digest, custody history, and reviewer attestation; unverifiable or conflicting evidence must make corpus readiness governance-required.
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
- Protocol Thread ID: SESS-MWIRMIRJ-5N1XI4

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MWIRMP6E-69Q8QM

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
