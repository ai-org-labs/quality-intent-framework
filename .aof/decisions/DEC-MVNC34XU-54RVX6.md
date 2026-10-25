# Decision Record: DEC-MVNC34XU-54RVX6

- Record Format Version: 1.0.0
- Created At: 2026-10-25T04:34:46.338Z
- Canonical Markdown Path: .aof/decisions/DEC-MVNC34XU-54RVX6.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-25T04:34:46.338Z
- Canonical Markdown Path: .aof/decisions/DEC-MVNC34XU-54RVX6.md
- Scope: concept-approval
- Stage: planning
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
- Protocol Thread ID: SESS-MVNC25GX-0OT8F3

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVNC296Q-BZ4MAG

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
