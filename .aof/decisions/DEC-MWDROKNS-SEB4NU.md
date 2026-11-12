# Decision Record: DEC-MWDROKNS-SEB4NU

- Record Format Version: 1.0.0
- Created At: 2026-11-12T16:33:21.302Z
- Canonical Markdown Path: .aof/decisions/DEC-MWDROKNS-SEB4NU.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-12T16:33:21.302Z
- Canonical Markdown Path: .aof/decisions/DEC-MWDROKNS-SEB4NU.md
- Scope: concept-approval
- Stage: planning
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
- Protocol Thread ID: SESS-MWDRMRSZ-C4A062

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MWDRN1F4-R34MRM

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
