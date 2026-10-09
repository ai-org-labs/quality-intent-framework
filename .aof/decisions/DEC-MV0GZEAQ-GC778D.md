# Decision Record: DEC-MV0GZEAQ-GC778D

- Record Format Version: 1.0.0
- Created At: 2026-10-09T04:33:07.874Z
- Canonical Markdown Path: .aof/decisions/DEC-MV0GZEAQ-GC778D.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-09T04:33:07.874Z
- Canonical Markdown Path: .aof/decisions/DEC-MV0GZEAQ-GC778D.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.6.42として、校正評価の解答・期待ラベル・採点ロジックへの事前アクセスを隔離し、実行時の許可されたaffordance、外部化された行動トランスクリプト、汚染兆候、grader gaming/loopholeを追跡するSequestered Replay and Policy-Gaming Detectionを実装・検証・リリースする。意味的真実、内的思考、能力、誠実性、権限を構造検証から推定しない。
- Need: 対象はcalibration-report packageと関連schema/example/verifier/fixtures/docs/roadmap/AOF evidence。隔離実行プロトコル、実行記録、policy-gaming assessmentを対象とし、UI、外部連携、秘密推論収集、自動選抜・自動権限付与、既存概念の再設計は対象外。
- Intent: 成功は、blind/sequestered状態と許可affordance、外部化行動、汚染・loophole所見を参照解決可能な構造で記録し、集計を再現し、違反・不足をgovernanceへ送ること。npm test、負例fixture全件、AOF verify全件が通り、v0.6.42タグとGitHub Releaseが公開されること。
- Context: context: 対象はcalibration-report packageと関連schema/example/verifier/fixtures/docs/roadmap/AOF evidence。隔離実行プロトコル、実行記録、policy-gaming assessmentを対象とし、UI、外部連携、秘密推論収集、自動選抜・自動権限付与、既存概念の再設計は対象外。 | success: 成功は、blind/sequestered状態と許可affordance、外部化行動、汚染・loophole所見を参照解決可能な構造で記録し、集計を再現し、違反・不足をgovernanceへ送ること。npm test、負例fixture全件、AOF verify全件が通り、v0.6.42タグとGitHub Releaseが公開されること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MV0GZ8F0-Z4KWNM
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はcalibration-report packageと関連schema/example/verifier/fixtures/docs/roadmap/AOF evidence。隔離実行プロトコル、実行記録、policy-gaming assessmentを対象とし、UI、外部連携、秘密推論収集、自動選抜・自動権限付与、既存概念の再設計は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、blind/sequestered状態と許可affordance、外部化行動、汚染・loophole所見を参照解決可能な構造で記録し、集計を再現し、違反・不足をgovernanceへ送ること。npm test、負例fixture全件、AOF verify全件が通り、v0.6.42タグとGitHub Releaseが公開されること。
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
- Protocol Thread ID: SESS-MV0GZ8F0-Z4KWNM

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MV0GZEAN-UB7SOV

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
