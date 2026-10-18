# Decision Record: DEC-MVDC2W8Q-B5URBP

- Record Format Version: 1.0.0
- Created At: 2026-10-18T04:36:53.305Z
- Canonical Markdown Path: .aof/decisions/DEC-MVDC2W8Q-B5URBP.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-18T04:36:53.305Z
- Canonical Markdown Path: .aof/decisions/DEC-MVDC2W8Q-B5URBP.md
- Scope: concept-approval
- Stage: planning
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
- Protocol Thread ID: SESS-MVDC1RDA-JW5Y6C

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVDC1WPA-U2P1RA

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
