# Decision Record: DEC-MVBWLKLH-R8620T

- Record Format Version: 1.0.0
- Created At: 2026-10-17T04:35:44.645Z
- Canonical Markdown Path: .aof/decisions/DEC-MVBWLKLH-R8620T.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-17T04:35:44.645Z
- Canonical Markdown Path: .aof/decisions/DEC-MVBWLKLH-R8620T.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.6.51として、回復や再試行を終了扱いする前に観測窓を設け、遅れて現れる外部副作用、停止後も継続する処理、観測時点間の作用状態変化、再照合結果、未解決作用を構造的に記録・再現検証し、証拠不足や不整合をガバナンスへ送るRecovery Observation Windows and Delayed Side-Effect Reconciliationを実装・検証・公開する。QIFは実運用の停止、再開、再試行、補償を実行せず、意味的真実や件数を品質として扱わない。
- Need: 対象はQIFのcalibration-report package、schema、local verifier、example、negative fixtures、docs、AI authoring guide、roadmap、runtime log、portable package、releaseである。UI、外部システム統合、実運用の停止・再開・再試行・補償実行、意味的真実の自動判定は対象外。
- Intent: 成功は、観測窓、観測時点、期待作用、遅延して観測された作用、状態遷移、再照合、未解決作用、終了判定の保留を機械検証し、窓不足・証拠不足・遅延作用・不整合をQIF判断ではなくガバナンスへ送ること。npm test、portable検証、AOF組織検証、公開releaseで確認する。
- Context: context: 対象はQIFのcalibration-report package、schema、local verifier、example、negative fixtures、docs、AI authoring guide、roadmap、runtime log、portable package、releaseである。UI、外部システム統合、実運用の停止・再開・再試行・補償実行、意味的真実の自動判定は対象外。 | success: 成功は、観測窓、観測時点、期待作用、遅延して観測された作用、状態遷移、再照合、未解決作用、終了判定の保留を機械検証し、窓不足・証拠不足・遅延作用・不整合をQIF判断ではなくガバナンスへ送ること。npm test、portable検証、AOF組織検証、公開releaseで確認する。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVBWLE9J-B1WTMH
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はQIFのcalibration-report package、schema、local verifier、example、negative fixtures、docs、AI authoring guide、roadmap、runtime log、portable package、releaseである。UI、外部システム統合、実運用の停止・再開・再試行・補償実行、意味的真実の自動判定は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、観測窓、観測時点、期待作用、遅延して観測された作用、状態遷移、再照合、未解決作用、終了判定の保留を機械検証し、窓不足・証拠不足・遅延作用・不整合をQIF判断ではなくガバナンスへ送ること。npm test、portable検証、AOF組織検証、公開releaseで確認する。
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
- Protocol Thread ID: SESS-MVBWLE9J-B1WTMH

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVBWLKLE-9GYEJA

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
