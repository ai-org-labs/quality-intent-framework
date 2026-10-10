# Decision Record: DEC-MV1WI2OO-LG4LF3

- Record Format Version: 1.0.0
- Created At: 2026-10-10T04:35:19.704Z
- Canonical Markdown Path: .aof/decisions/DEC-MV1WI2OO-LG4LF3.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-10T04:35:19.704Z
- Canonical Markdown Path: .aof/decisions/DEC-MV1WI2OO-LG4LF3.md
- Scope: concept-approval
- Stage: clarification
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
- Protocol Thread ID: SESS-MV1WFKVT-8SSFVA

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MV1WI2OL-L55JWK

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
