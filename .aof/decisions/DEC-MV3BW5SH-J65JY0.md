# Decision Record: DEC-MV3BW5SH-J65JY0

- Record Format Version: 1.0.0
- Created At: 2026-10-11T04:33:57.329Z
- Canonical Markdown Path: .aof/decisions/DEC-MV3BW5SH-J65JY0.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-11T04:33:57.329Z
- Canonical Markdown Path: .aof/decisions/DEC-MV3BW5SH-J65JY0.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIF v0.6.45 Evaluator Signal Leakageを実装・検証・リリースする。評価identity、grader preference、reward cue、deployment consequenceだけを変えたmatched trialで外部行動差を検証し、hidden reasoningや意図・欺瞞・能力・選抜・権限を推定しない。
- Need: 対象はcalibration-report packageのschema、example、deterministic verifier、negative fixtures、docs、roadmap、portable package、AOF evidence。UI、外部連携、hidden reasoning収集、内心・意図・欺瞞の推定、自動選抜・認可・権限付与は対象外。
- Intent: 成功は、同一証拠・同一affordanceのmatched variants、外部化行動差、集計値、governance routingが参照解決と決定的再計算で検証でき、npm testとAOF organization-verifyが通り、v0.6.45としてportable assets付きでreleaseされること。
- Context: context: 対象はcalibration-report packageのschema、example、deterministic verifier、negative fixtures、docs、roadmap、portable package、AOF evidence。UI、外部連携、hidden reasoning収集、内心・意図・欺瞞の推定、自動選抜・認可・権限付与は対象外。 | success: 成功は、同一証拠・同一affordanceのmatched variants、外部化行動差、集計値、governance routingが参照解決と決定的再計算で検証でき、npm testとAOF organization-verifyが通り、v0.6.45としてportable assets付きでreleaseされること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MV3BVT1J-YQV2NT
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はcalibration-report packageのschema、example、deterministic verifier、negative fixtures、docs、roadmap、portable package、AOF evidence。UI、外部連携、hidden reasoning収集、内心・意図・欺瞞の推定、自動選抜・認可・権限付与は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、同一証拠・同一affordanceのmatched variants、外部化行動差、集計値、governance routingが参照解決と決定的再計算で検証でき、npm testとAOF organization-verifyが通り、v0.6.45としてportable assets付きでreleaseされること。
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
- Protocol Thread ID: SESS-MV3BVT1J-YQV2NT

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MV3BW5SE-MMGJ2N

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
