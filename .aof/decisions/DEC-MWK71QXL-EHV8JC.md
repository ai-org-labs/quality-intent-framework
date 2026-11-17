# Decision Record: DEC-MWK71QXL-EHV8JC

- Record Format Version: 1.0.0
- Created At: 2026-11-17T04:30:07.257Z
- Canonical Markdown Path: .aof/decisions/DEC-MWK71QXL-EHV8JC.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-17T04:30:07.257Z
- Canonical Markdown Path: .aof/decisions/DEC-MWK71QXL-EHV8JC.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.8.16として、Agent Skillを単体ファイルではなくSkill・package・service・tool・modelの依存グラフとして扱い、typed manifest、component identity、lock record、risk propagation、governance readinessを検証できる provider-neutral Skill Supply Chain runtimeを開発する。identityやhash一致を安全性・信頼性・実行権限の証明として扱わない。
- Need: QIF Agent Skillのローカルmanifest、dependency graph、component identity、lock、risk signal、readiness検証のみ。marketplace integration、network scanning、dependency installation、credential access、automatic trust elevationは対象外。
- Intent: Success means every dependency is typed and evidence-linked, required nodes are locked, unresolved/cyclic/stale/risky dependencies are reproducibly detected, transitive risk is visible, and identity evidence never becomes a safety or authority claim.
- Context: context: QIF Agent Skillのローカルmanifest、dependency graph、component identity、lock、risk signal、readiness検証のみ。marketplace integration、network scanning、dependency installation、credential access、automatic trust elevationは対象外。 | success: Success means every dependency is typed and evidence-linked, required nodes are locked, unresolved/cyclic/stale/risky dependencies are reproducibly detected, transitive risk is visible, and identity evidence never becomes a safety or authority claim.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MWK71MX8-NG7Q7E
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => QIF Agent Skillのローカルmanifest、dependency graph、component identity、lock、risk signal、readiness検証のみ。marketplace integration、network scanning、dependency installation、credential access、automatic trust elevationは対象外。 / How should improvement success be judged: which metric or end state matters most? => Success means every dependency is typed and evidence-linked, required nodes are locked, unresolved/cyclic/stale/risky dependencies are reproducibly detected, transitive risk is visible, and identity evidence never becomes a safety or authority claim.
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
- Protocol Thread ID: SESS-MWK71MX8-NG7Q7E

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MWK71QXI-4WU84W

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
