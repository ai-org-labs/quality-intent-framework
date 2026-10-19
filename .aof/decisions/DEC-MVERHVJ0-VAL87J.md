# Decision Record: DEC-MVERHVJ0-VAL87J

- Record Format Version: 1.0.0
- Created At: 2026-10-19T04:36:12.636Z
- Canonical Markdown Path: .aof/decisions/DEC-MVERHVJ0-VAL87J.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-19T04:36:12.636Z
- Canonical Markdown Path: .aof/decisions/DEC-MVERHVJ0-VAL87J.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.7.1 Outcome Collection Ledgerを実装・検証・公開する。実運用の結果観測をappend-only revisionsとして保持し、late-arriving outcomes、source corrections、custody history、supersessionを記録する。既存のprospective enrollmentを上書きせず、欠測・除外・訂正を品質や真実と誤認せず、複数領域で使えるdomain-general構造にする。
- Need: 対象はcalibration-report packageのschema、local verifier、example、negative fixtures、docs、roadmap、portable package、release。外部データ収集、UI、外部システム統合、実運用判断、既存のprospective enrollmentや過去revisionの破壊的更新は対象外。
- Intent: 成功は、観測revisionの連続性とsupersession、late-arrival、source correction、custody event、最新snapshot整合、governance routingを再現可能に検証し、実データなしやexample-onlyを真実と誤認せず、npm test・portable・AOF組織検証・公開releaseを完了すること。
- Context: context: 対象はcalibration-report packageのschema、local verifier、example、negative fixtures、docs、roadmap、portable package、release。外部データ収集、UI、外部システム統合、実運用判断、既存のprospective enrollmentや過去revisionの破壊的更新は対象外。 | success: 成功は、観測revisionの連続性とsupersession、late-arrival、source correction、custody event、最新snapshot整合、governance routingを再現可能に検証し、実データなしやexample-onlyを真実と誤認せず、npm test・portable・AOF組織検証・公開releaseを完了すること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVERHQS7-DSGHQE
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はcalibration-report packageのschema、local verifier、example、negative fixtures、docs、roadmap、portable package、release。外部データ収集、UI、外部システム統合、実運用判断、既存のprospective enrollmentや過去revisionの破壊的更新は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、観測revisionの連続性とsupersession、late-arrival、source correction、custody event、最新snapshot整合、governance routingを再現可能に検証し、実データなしやexample-onlyを真実と誤認せず、npm test・portable・AOF組織検証・公開releaseを完了すること。
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
- Protocol Thread ID: SESS-MVERHQS7-DSGHQE

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVERHVIX-7WNVXY

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
