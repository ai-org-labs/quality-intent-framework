# Decision Record: DEC-MWHC9BIR-MSCL9H

- Record Format Version: 1.0.0
- Created At: 2026-11-15T04:32:40.083Z
- Canonical Markdown Path: .aof/decisions/DEC-MWHC9BIR-MSCL9H.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-15T04:32:40.083Z
- Canonical Markdown Path: .aof/decisions/DEC-MWHC9BIR-MSCL9H.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.8.14として、標準Agent Skillが複数の独立クライアントで発見・選択・実行され、QIFの品質判断作法を再現できるかを、同一ケースの対照実験と観測可能な証拠で評価する。クライアント一致を真実とせず、外部クライアント統合や自動権限付与は行わない。
- Need: QIF Agent Skillのクライアント非依存な評価パッケージとローカル検証器。Codex、Claude、Gemini等のライブ統合、認証、課金、秘密情報、従業員評価は対象外。
- Intent: 同一ケース・同一入力でskillなし/ありの対照を取り、発見、選択、作法順守、証拠追跡、非機能・世界モデル欠落、安全境界をクライアント別に記録し、未検証データはgovernance-requiredになること。
- Context: context: QIF Agent Skillのクライアント非依存な評価パッケージとローカル検証器。Codex、Claude、Gemini等のライブ統合、認証、課金、秘密情報、従業員評価は対象外。 | success: 同一ケース・同一入力でskillなし/ありの対照を取り、発見、選択、作法順守、証拠追跡、非機能・世界モデル欠落、安全境界をクライアント別に記録し、未検証データはgovernance-requiredになること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MWHC96MK-JYK873
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => QIF Agent Skillのクライアント非依存な評価パッケージとローカル検証器。Codex、Claude、Gemini等のライブ統合、認証、課金、秘密情報、従業員評価は対象外。 / How should improvement success be judged: which metric or end state matters most? => 同一ケース・同一入力でskillなし/ありの対照を取り、発見、選択、作法順守、証拠追跡、非機能・世界モデル欠落、安全境界をクライアント別に記録し、未検証データはgovernance-requiredになること。
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
- Protocol Thread ID: SESS-MWHC96MK-JYK873

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MWHC9BIN-ZFBYCJ

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
