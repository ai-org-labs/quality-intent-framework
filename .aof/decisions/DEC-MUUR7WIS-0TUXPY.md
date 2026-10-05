# Decision Record: DEC-MUUR7WIS-0TUXPY

- Record Format Version: 1.0.0
- Created At: 2026-10-05T04:33:03.844Z
- Canonical Markdown Path: .aof/decisions/DEC-MUUR7WIS-0TUXPY.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-05T04:33:03.844Z
- Canonical Markdown Path: .aof/decisions/DEC-MUUR7WIS-0TUXPY.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Advance QIF after v0.6.37 using the latest released AOF and current policy-drift evidence. Build and release v0.6.38 Route Policy Drift and Revalidation.
- Need: Scope the standalone, domain-general calibration-report runtime: versioned route-policy snapshots; policy-change records; target-specific drift assessments; revalidation requirements and outcomes; stale-policy governance; schemas, verifier, examples, fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, automatic policy mutation, employee scoring, causality claims, operational guarantees, and changes to unrelated package types.
- Intent: Success means a human or AI can reproduce which route-policy version governed an earlier decision, what authority, capability, threshold, or evidence requirement changed, which decisions became stale or materially affected, what revalidation was required and observed, and why governance remains open or closes. Change count, policy age, and revalidation volume remain evidence, never quality, authority, safety, causality, or semantic truth.
- Context: context: Scope the standalone, domain-general calibration-report runtime: versioned route-policy snapshots; policy-change records; target-specific drift assessments; revalidation requirements and outcomes; stale-policy governance; schemas, verifier, examples, fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, automatic policy mutation, employee scoring, causality claims, operational guarantees, and changes to unrelated package types. | success: Success means a human or AI can reproduce which route-policy version governed an earlier decision, what authority, capability, threshold, or evidence requirement changed, which decisions became stale or materially affected, what revalidation was required and observed, and why governance remains open or closes. Change count, policy age, and revalidation volume remain evidence, never quality, authority, safety, causality, or semantic truth.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MUUR7ETV-1HP9P1
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope the standalone, domain-general calibration-report runtime: versioned route-policy snapshots; policy-change records; target-specific drift assessments; revalidation requirements and outcomes; stale-policy governance; schemas, verifier, examples, fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, automatic policy mutation, employee scoring, causality claims, operational guarantees, and changes to unrelated package types. / How should improvement success be judged: which metric or end state matters most? => Success means a human or AI can reproduce which route-policy version governed an earlier decision, what authority, capability, threshold, or evidence requirement changed, which decisions became stale or materially affected, what revalidation was required and observed, and why governance remains open or closes. Change count, policy age, and revalidation volume remain evidence, never quality, authority, safety, causality, or semantic truth.
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
- Protocol Thread ID: SESS-MUUR7ETV-1HP9P1

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUUR7WIP-180UDY

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
