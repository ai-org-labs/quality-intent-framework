# Decision Record: DEC-MVHM5IR9-JAHM0K

- Record Format Version: 1.0.0
- Created At: 2026-10-21T04:29:56.660Z
- Canonical Markdown Path: .aof/decisions/DEC-MVHM5IR9-JAHM0K.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-21T04:29:56.660Z
- Canonical Markdown Path: .aof/decisions/DEC-MVHM5IR9-JAHM0K.md
- Scope: concept-approval
- Stage: planning
- Organization: Civic Studio

## Input
- Request: QIF v0.7.2 Missingness and Attrition Sensitivityを実装・検証・公開する。観測欠測、除外、撤回、遅延、追跡不能、観測機会の差による偏りを明示し、best-case/worst-case boundsと感度判定を再現可能にする。欠測を成功や品質と誤認せず、domain-generalで、実データや意味的真実を捏造しない。
- Need: 対象はcalibration-report packageのschema、local verifier、example、negative fixtures、docs、roadmap、portable package、release。外部データ収集、UI、外部連携、実運用判断、個人評価、既存観測の破壊的更新は対象外。
- Intent: 成功は、eligible cohortの分母、観測・欠測・除外・撤回・遅延・追跡不能の分類、理由と責任主体、best/worst bounds、感度結果、governance routingを決定論的に再現し、欠測を品質や成功へ算入せず、npm test・portable・AOF組織検証・公開releaseを完了すること。
- Context: context: 対象はcalibration-report packageのschema、local verifier、example、negative fixtures、docs、roadmap、portable package、release。外部データ収集、UI、外部連携、実運用判断、個人評価、既存観測の破壊的更新は対象外。 | success: 成功は、eligible cohortの分母、観測・欠測・除外・撤回・遅延・追跡不能の分類、理由と責任主体、best/worst bounds、感度結果、governance routingを決定論的に再現し、欠測を品質や成功へ算入せず、npm test・portable・AOF組織検証・公開releaseを完了すること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVHM4JG8-J57TJ9
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はcalibration-report packageのschema、local verifier、example、negative fixtures、docs、roadmap、portable package、release。外部データ収集、UI、外部連携、実運用判断、個人評価、既存観測の破壊的更新は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、eligible cohortの分母、観測・欠測・除外・撤回・遅延・追跡不能の分類、理由と責任主体、best/worst bounds、感度結果、governance routingを決定論的に再現し、欠測を品質や成功へ算入せず、npm test・portable・AOF組織検証・公開releaseを完了すること。
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
- Protocol Thread ID: SESS-MVHM4JG8-J57TJ9

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVHM4OT1-70CGH9

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
