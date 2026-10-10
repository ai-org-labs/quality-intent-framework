# Decision Record: DEC-MV1WJOMD-JZFDTU

- Record Format Version: 1.0.0
- Created At: 2026-10-10T04:36:34.788Z
- Canonical Markdown Path: .aof/decisions/DEC-MV1WJOMD-JZFDTU.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-10T04:36:34.788Z
- Canonical Markdown Path: .aof/decisions/DEC-MV1WJOMD-JZFDTU.md
- Scope: concept-approval
- Stage: planning
- Organization: Civic Studio

## Input
- Request: QIF v0.6.44 Cross-Judge Correlated Error and Adjudication Calibrationを実装・検証・リリースする。複数判定者の一致を独立確認と誤認せず、model family、provider、prompt、rubric、retrieval source、harness、training lineage、organization、reporting lineの共有依存を構造化する。多数決、全会一致、confidence、adjudicationを意味的真実、品質、能力、選抜、権限に変換しない。
- Need: 対象はQIF calibration-report packageのスキーマ、example、deterministic verifier、negative fixtures、docs、roadmap、AOF evidenceである。judge dependency policy/profile、cross-judge panel assessment、correlation aggregateを追加する。UI、外部連携、hidden reasoning、automatic selection/ranking/authority、semantic truthの主張は対象外とする。
- Intent: 成功は、共有依存と独立性、verdict group、dissent、集計値が参照解決と決定的再計算で検証でき、共有依存を持つ多数決・全会一致または未検証データがgovernance triggerを生み、npm testとAOF verifyが通り、v0.6.44としてreleaseされることで判断する。
- Context: context: 対象はQIF calibration-report packageのスキーマ、example、deterministic verifier、negative fixtures、docs、roadmap、AOF evidenceである。judge dependency policy/profile、cross-judge panel assessment、correlation aggregateを追加する。UI、外部連携、hidden reasoning、automatic selection/ranking/authority、semantic truthの主張は対象外とする。 | success: 成功は、共有依存と独立性、verdict group、dissent、集計値が参照解決と決定的再計算で検証でき、共有依存を持つ多数決・全会一致または未検証データがgovernance triggerを生み、npm testとAOF verifyが通り、v0.6.44としてreleaseされることで判断する。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MV1WFKVT-8SSFVA
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はQIF calibration-report packageのスキーマ、example、deterministic verifier、negative fixtures、docs、roadmap、AOF evidenceである。judge dependency policy/profile、cross-judge panel assessment、correlation aggregateを追加する。UI、外部連携、hidden reasoning、automatic selection/ranking/authority、semantic truthの主張は対象外とする。 / How should improvement success be judged: which metric or end state matters most? => 成功は、共有依存と独立性、verdict group、dissent、集計値が参照解決と決定的再計算で検証でき、共有依存を持つ多数決・全会一致または未検証データがgovernance triggerを生み、npm testとAOF verifyが通り、v0.6.44としてreleaseされることで判断する。
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
- Protocol Thread ID: SESS-MV1WFKVT-8SSFVA

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MV1WI2OL-L55JWK

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
