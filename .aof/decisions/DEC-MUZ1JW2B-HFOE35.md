# Decision Record: DEC-MUZ1JW2B-HFOE35

- Record Format Version: 1.0.0
- Created At: 2026-10-08T04:33:23.987Z
- Canonical Markdown Path: .aof/decisions/DEC-MUZ1JW2B-HFOE35.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-08T04:33:23.987Z
- Canonical Markdown Path: .aof/decisions/DEC-MUZ1JW2B-HFOE35.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Advance standalone QIF after v0.6.40 using AOF v12.2.0 and current primary-source evaluation evidence. Build and release v0.6.41 Judge Consequence and Abstention Robustness: test whether identical evidence receives different judgments when downstream-use framing, consequence framing, or an explicit abstain option changes, while keeping correct classification, incorrect classification, justified abstention, unjustified abstention, refusal, and malformed output distinct. Complete Need Validation before Charter, use Visionary/Builder/Guardian judgment, preserve identical evidence and accountable authority, prohibit automatic judge replacement or policy mutation, and keep QIF domain-general.
- Need: Scope only the standalone, domain-general calibration-report runtime: controlled judge-condition variants that preserve identical case evidence while varying downstream-use framing, consequence framing, and abstain availability; per-trial outputs that distinguish correct classification, incorrect classification, justified abstention, unjustified abstention, refusal, and malformed output; deterministic robustness assessment, governance, schemas, verifier, examples, fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, judge optimization or replacement, automatic policy or rubric mutation, hidden chain-of-thought collection, employee scoring, causal claims, operational guarantees, and unrelated package types.
- Intent: Success means a human or AI can reproduce the unchanged evidence, exact judge-condition differences, expected label, returned output category, classification correctness, abstention justification, consequence sensitivity, aggregate counts, sufficiency, and governance route. A decline is not malformed output; an abstention is not automatically correct; a correct label under one framing is not proof of robust judgment; counts and lower error rates remain evidence, never quality, semantic truth, competence, optimality, or authority.
- Context: context: Scope only the standalone, domain-general calibration-report runtime: controlled judge-condition variants that preserve identical case evidence while varying downstream-use framing, consequence framing, and abstain availability; per-trial outputs that distinguish correct classification, incorrect classification, justified abstention, unjustified abstention, refusal, and malformed output; deterministic robustness assessment, governance, schemas, verifier, examples, fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, judge optimization or replacement, automatic policy or rubric mutation, hidden chain-of-thought collection, employee scoring, causal claims, operational guarantees, and unrelated package types. | success: Success means a human or AI can reproduce the unchanged evidence, exact judge-condition differences, expected label, returned output category, classification correctness, abstention justification, consequence sensitivity, aggregate counts, sufficiency, and governance route. A decline is not malformed output; an abstention is not automatically correct; a correct label under one framing is not proof of robust judgment; counts and lower error rates remain evidence, never quality, semantic truth, competence, optimality, or authority.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MUZ1J0XW-8EHIM9
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope only the standalone, domain-general calibration-report runtime: controlled judge-condition variants that preserve identical case evidence while varying downstream-use framing, consequence framing, and abstain availability; per-trial outputs that distinguish correct classification, incorrect classification, justified abstention, unjustified abstention, refusal, and malformed output; deterministic robustness assessment, governance, schemas, verifier, examples, fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, judge optimization or replacement, automatic policy or rubric mutation, hidden chain-of-thought collection, employee scoring, causal claims, operational guarantees, and unrelated package types. / How should improvement success be judged: which metric or end state matters most? => Success means a human or AI can reproduce the unchanged evidence, exact judge-condition differences, expected label, returned output category, classification correctness, abstention justification, consequence sensitivity, aggregate counts, sufficiency, and governance route. A decline is not malformed output; an abstention is not automatically correct; a correct label under one framing is not proof of robust judgment; counts and lower error rates remain evidence, never quality, semantic truth, competence, optimality, or authority.
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
- Protocol Thread ID: SESS-MUZ1J0XW-8EHIM9

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUZ1JW28-8US4T7

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
