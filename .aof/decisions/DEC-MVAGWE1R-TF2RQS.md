# Decision Record: DEC-MVAGWE1R-TF2RQS

- Record Format Version: 1.0.0
- Created At: 2026-10-16T04:28:29.343Z
- Canonical Markdown Path: .aof/decisions/DEC-MVAGWE1R-TF2RQS.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-16T04:28:29.343Z
- Canonical Markdown Path: .aof/decisions/DEC-MVAGWE1R-TF2RQS.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.6.50として、エージェントのスナップショット復元・再実行時に古い状態、別主体への復元、完了済み外部作用の再実行、未知の副作用、再試行上限超過を構造的に検出し、証拠不足や危険な自動再開をガバナンスへ送るDurable Recovery State and Retry Side-Effect Safetyを実装・検証・公開する。QIFは意味的真実や運用判断を自動化せず、件数を品質と扱わない。
- Need: 対象はQIFのcalibration-report package、スキーマ、ローカル検証器、例、fixture、文書、portable packageである。外部システム統合、UI、実運用の自動再開、意味的真実の自動判定は対象外。
- Intent: 成功は、復元状態・完了済み作用・未完了作用・未知作用・再水和主体・再開権限・冪等性キー・再試行予算を機械検証でき、危険または証拠不足をQIF判断でなくガバナンスへ送ること。npm test、portable検証、AOF組織検証、公開リリースの完了で確認する。
- Context: context: 対象はQIFのcalibration-report package、スキーマ、ローカル検証器、例、fixture、文書、portable packageである。外部システム統合、UI、実運用の自動再開、意味的真実の自動判定は対象外。 | success: 成功は、復元状態・完了済み作用・未完了作用・未知作用・再水和主体・再開権限・冪等性キー・再試行予算を機械検証でき、危険または証拠不足をQIF判断でなくガバナンスへ送ること。npm test、portable検証、AOF組織検証、公開リリースの完了で確認する。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVAGW80S-DLR6B5
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はQIFのcalibration-report package、スキーマ、ローカル検証器、例、fixture、文書、portable packageである。外部システム統合、UI、実運用の自動再開、意味的真実の自動判定は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、復元状態・完了済み作用・未完了作用・未知作用・再水和主体・再開権限・冪等性キー・再試行予算を機械検証でき、危険または証拠不足をQIF判断でなくガバナンスへ送ること。npm test、portable検証、AOF組織検証、公開リリースの完了で確認する。
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
- Protocol Thread ID: SESS-MVAGW80S-DLR6B5

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVAGWE1O-5ZGCBU

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
