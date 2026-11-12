# Decision Record: DEC-MWDRN1F8-X4PG14

- Record Format Version: 1.0.0
- Created At: 2026-11-12T16:32:09.716Z
- Canonical Markdown Path: .aof/decisions/DEC-MWDRN1F8-X4PG14.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-12T16:32:09.716Z
- Canonical Markdown Path: .aof/decisions/DEC-MWDRN1F8-X4PG14.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIFをopen Agent Skills標準のSKILL.mdパッケージとして配布可能にする。QIFの品質意図発見・適用・証拠評価をAIが段階的に実行でき、Codex、ChatGPT、Claude、Gemini等で移植可能な構成にする。ただしQIFを自律権限主体にせず、意味的真実、実行権限、承認権限を付与しない。既存のポータブルパッケージと検証器を再利用し、SKILL.mdは簡潔なルーター、詳細はreferences、決定的処理はscriptsへ分離する。
- Need: 対象はQIFを利用する汎用AIエージェント環境。open Agent Skills標準を中核にし、Codex/ChatGPT互換のagents/openai.yamlと、他製品でも読めるSKILL.md・references・scripts・assetsを含める。外部サービス連携、UI、自律実行、承認代行、意味的真実の保証は対象外。
- Intent: 成功は、1つの配布可能なskill bundleが標準検証を通り、AIが依頼を品質意図発見・要件漏れ評価・証拠付き判定へ適切にルーティングし、既存QIF verifierを再利用でき、portable releaseへ毎回自動同梱されること。既存QIF全資料の単純コピーや巨大な一枚プロンプトにはしない。
- Context: context: 対象はQIFを利用する汎用AIエージェント環境。open Agent Skills標準を中核にし、Codex/ChatGPT互換のagents/openai.yamlと、他製品でも読めるSKILL.md・references・scripts・assetsを含める。外部サービス連携、UI、自律実行、承認代行、意味的真実の保証は対象外。 | success: 成功は、1つの配布可能なskill bundleが標準検証を通り、AIが依頼を品質意図発見・要件漏れ評価・証拠付き判定へ適切にルーティングし、既存QIF verifierを再利用でき、portable releaseへ毎回自動同梱されること。既存QIF全資料の単純コピーや巨大な一枚プロンプトにはしない。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MWDRMRSZ-C4A062
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はQIFを利用する汎用AIエージェント環境。open Agent Skills標準を中核にし、Codex/ChatGPT互換のagents/openai.yamlと、他製品でも読めるSKILL.md・references・scripts・assetsを含める。外部サービス連携、UI、自律実行、承認代行、意味的真実の保証は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、1つの配布可能なskill bundleが標準検証を通り、AIが依頼を品質意図発見・要件漏れ評価・証拠付き判定へ適切にルーティングし、既存QIF verifierを再利用でき、portable releaseへ毎回自動同梱されること。既存QIF全資料の単純コピーや巨大な一枚プロンプトにはしない。
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
- Protocol Thread ID: SESS-MWDRMRSZ-C4A062

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MWDRN1F4-R34MRM

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
