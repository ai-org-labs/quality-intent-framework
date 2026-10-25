# Decision Record: DEC-MVNC296T-7ZUHJ9

- Record Format Version: 1.0.0
- Created At: 2026-10-25T04:34:05.189Z
- Canonical Markdown Path: .aof/decisions/DEC-MVNC296T-7ZUHJ9.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-25T04:34:05.189Z
- Canonical Markdown Path: .aof/decisions/DEC-MVNC296T-7ZUHJ9.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Develop and release QIF v0.8.2 Local Applicability and Reproduction. Need: v0.8.1 can import portable Decision Patterns and Quality Intents as traceable candidates, but cannot determine whether they fit a local target or whether another evaluator can reproduce their decisions on unseen local cases. Intent: extend standalone qif-ledger with target-specific applicability decisions, local reproduction trials, deterministic sufficiency assessment, and governance so imported knowledge becomes only eligible for governed activation when source trust, context fit, counterexample challenges, independent reproduction, and evidence all pass. Context: reuse existing evaluation-target and expert-judgment packages through cross-package references; preserve candidate-only, non-executable, non-authoritative boundaries; do not implement automatic activation, semantic truth, external registries, UI, employee surveillance, or v0.8.3 revocation. Add schemas, example, verifier rules, negative fixtures, docs, AI guide, portable package, roadmap, changelog, AOF evidence, tag, and GitHub release.
- Need: Cover the standalone qif-ledger schema, source-linked local target and case records, applicability decisions, reproduction trials, validation assessment, governance, verifier, fixtures, docs, AI guide, roadmap, portable package, changelog, and release. Keep UI, external registries, provider-specific loaders, automatic activation, automatic authority, semantic truth claims, employee scoring, and v0.8.3 dependency revocation out of scope.
- Intent: Success means each candidate imported item is evaluated against a named local target with explicit matches and mismatches; challenged on unseen local cases including counterexamples; reproduced by a declared non-source evaluator with evidence; assessed deterministically against a policy; and either rejected, kept under governance, or marked only eligible for governed activation. Missing trust, context fit, independent cases, evidence, counterexample resolution, or threshold agreement must block eligibility and open governance.
- Context: context: Cover the standalone qif-ledger schema, source-linked local target and case records, applicability decisions, reproduction trials, validation assessment, governance, verifier, fixtures, docs, AI guide, roadmap, portable package, changelog, and release. Keep UI, external registries, provider-specific loaders, automatic activation, automatic authority, semantic truth claims, employee scoring, and v0.8.3 dependency revocation out of scope. | success: Success means each candidate imported item is evaluated against a named local target with explicit matches and mismatches; challenged on unseen local cases including counterexamples; reproduced by a declared non-source evaluator with evidence; assessed deterministically against a policy; and either rejected, kept under governance, or marked only eligible for governed activation. Missing trust, context fit, independent cases, evidence, counterexample resolution, or threshold agreement must block eligibility and open governance.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVNC25GX-0OT8F3
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Cover the standalone qif-ledger schema, source-linked local target and case records, applicability decisions, reproduction trials, validation assessment, governance, verifier, fixtures, docs, AI guide, roadmap, portable package, changelog, and release. Keep UI, external registries, provider-specific loaders, automatic activation, automatic authority, semantic truth claims, employee scoring, and v0.8.3 dependency revocation out of scope. / How should improvement success be judged: which metric or end state matters most? => Success means each candidate imported item is evaluated against a named local target with explicit matches and mismatches; challenged on unseen local cases including counterexamples; reproduced by a declared non-source evaluator with evidence; assessed deterministically against a policy; and either rejected, kept under governance, or marked only eligible for governed activation. Missing trust, context fit, independent cases, evidence, counterexample resolution, or threshold agreement must block eligibility and open governance.
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
- Protocol Thread ID: SESS-MVNC25GX-0OT8F3

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVNC296Q-BZ4MAG

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
