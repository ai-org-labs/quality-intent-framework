# Decision Record: DEC-MVDC1WPD-CQODC3

- Record Format Version: 1.0.0
- Created At: 2026-10-18T04:36:07.249Z
- Canonical Markdown Path: .aof/decisions/DEC-MVDC1WPD-CQODC3.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-18T04:36:07.249Z
- Canonical Markdown Path: .aof/decisions/DEC-MVDC1WPD-CQODC3.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.7.0の最初のvalue sliceとして、実運用で得る意思決定と結果の対応を事前登録し、観測中・欠測・完了・除外を混同せず、複数領域かつ少なくとも1つの非ソフトウェア領域でEmpirical Calibration Pilotを開始できる構造を設計・実装・検証・公開する。実データは捏造せず、件数や指標を品質そのものとせず、パイロット計画の妥当性や意味的真実をverifierが断定しない。
- Need: 対象はQIFのcalibration-report package、schema、local verifier、example、negative fixtures、docs、AI authoring guide、roadmap、runtime log、portable package、release。外部システム統合、UI、実組織のデータ収集、被験者募集、実運用判断、意味的真実の判定は対象外。
- Intent: 成功は、pilot protocol、domain plan、prospective enrollment、outcome observation status、pilot assessment、governance routingを機械検証し、実データなしをreadyと誤認せず、複数領域と非ソフトウェア領域の計画を示し、npm test、portable検証、AOF組織検証、公開releaseを完了すること。
- Context: context: 対象はQIFのcalibration-report package、schema、local verifier、example、negative fixtures、docs、AI authoring guide、roadmap、runtime log、portable package、release。外部システム統合、UI、実組織のデータ収集、被験者募集、実運用判断、意味的真実の判定は対象外。 | success: 成功は、pilot protocol、domain plan、prospective enrollment、outcome observation status、pilot assessment、governance routingを機械検証し、実データなしをreadyと誤認せず、複数領域と非ソフトウェア領域の計画を示し、npm test、portable検証、AOF組織検証、公開releaseを完了すること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVDC1RDA-JW5Y6C
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はQIFのcalibration-report package、schema、local verifier、example、negative fixtures、docs、AI authoring guide、roadmap、runtime log、portable package、release。外部システム統合、UI、実組織のデータ収集、被験者募集、実運用判断、意味的真実の判定は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、pilot protocol、domain plan、prospective enrollment、outcome observation status、pilot assessment、governance routingを機械検証し、実データなしをreadyと誤認せず、複数領域と非ソフトウェア領域の計画を示し、npm test、portable検証、AOF組織検証、公開releaseを完了すること。
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
- Protocol Thread ID: SESS-MVDC1RDA-JW5Y6C

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVDC1WPA-U2P1RA

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
