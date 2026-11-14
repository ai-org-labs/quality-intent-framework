# Decision Record: DEC-MWFWYOLT-DQK95A

- Record Format Version: 1.0.0
- Created At: 2026-11-14T04:36:43.409Z
- Canonical Markdown Path: .aof/decisions/DEC-MWFWYOLT-DQK95A.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-14T04:36:43.409Z
- Canonical Markdown Path: .aof/decisions/DEC-MWFWYOLT-DQK95A.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.8.13で、既存の閉鎖較正から履歴を改変せず候補ポリシーを作り、凍結した過去ケースで反実仮想リプレイし、人間の統治判断へつなぐ。自動採用・因果真実・ライブ実行は行わない。
- Need: qif-ledgerのPortableKnowledgeIncidentClosure直後の政策学習ライフサイクル。外部サービス統合、ライブ実行、従業員監視、因果・意味的真実の主張は対象外。
- Intent: 候補・凍結リプレイ・責任ある判断がスキーマ、例、検証器、負例、文書で一貫し、npm testが通り、曖昧な証拠は必ずgovernance-requiredになること。
- Context: context: qif-ledgerのPortableKnowledgeIncidentClosure直後の政策学習ライフサイクル。外部サービス統合、ライブ実行、従業員監視、因果・意味的真実の主張は対象外。 | success: 候補・凍結リプレイ・責任ある判断がスキーマ、例、検証器、負例、文書で一貫し、npm testが通り、曖昧な証拠は必ずgovernance-requiredになること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MWFWYJIM-DKHP9L
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => qif-ledgerのPortableKnowledgeIncidentClosure直後の政策学習ライフサイクル。外部サービス統合、ライブ実行、従業員監視、因果・意味的真実の主張は対象外。 / How should improvement success be judged: which metric or end state matters most? => 候補・凍結リプレイ・責任ある判断がスキーマ、例、検証器、負例、文書で一貫し、npm testが通り、曖昧な証拠は必ずgovernance-requiredになること。
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
- Protocol Thread ID: SESS-MWFWYJIM-DKHP9L

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MWFWYOLL-S93NS7

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
