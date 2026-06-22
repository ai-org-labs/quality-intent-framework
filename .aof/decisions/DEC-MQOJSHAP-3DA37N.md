# Decision Record: DEC-MQOJSHAP-3DA37N

- Record Format Version: 1.0.0
- Created At: 2026-06-22T01:39:40.561Z
- Canonical Markdown Path: .aof/decisions/DEC-MQOJSHAP-3DA37N.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-22T01:39:40.561Z
- Canonical Markdown Path: .aof/decisions/DEC-MQOJSHAP-3DA37N.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Release QIF v0.2.1 from the validated consolidation state. Need: publish the executable v0.2.1 baseline and its AOF evidence so downstream pilot work can reference an immutable tag. Intent: commit all current v0.2/v0.2.1 runtime, schema, verifier, example, documentation, and AOF artifacts; verify with npm test and AOF checks; create and push tag v0.2.1; create GitHub release. Context: package version is 0.2.1, existing latest tag is v0.2.0, repository remote is legacy-personal-repository.
- Need: Scope is the current QIF repository release state for v0.2.1 only: runtime schemas, verifier, examples, docs, changelog, AOF runtime evidence, git tag, push, and GitHub Release. Out of scope: new QIF features, UI, external integration, and conceptual redesign.
- Intent: Success is judged by npm test passing, AOF structural checks passing, a clean committed release baseline, pushed tag v0.2.1, and a GitHub Release that references the validated v0.2.1 runtime/consolidation state.
- Context: context: Scope is the current QIF repository release state for v0.2.1 only: runtime schemas, verifier, examples, docs, changelog, AOF runtime evidence, git tag, push, and GitHub Release. Out of scope: new QIF features, UI, external integration, and conceptual redesign. | success: Success is judged by npm test passing, AOF structural checks passing, a clean committed release baseline, pushed tag v0.2.1, and a GitHub Release that references the validated v0.2.1 runtime/consolidation state.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MQOJRHLV-HVR0SV
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope is the current QIF repository release state for v0.2.1 only: runtime schemas, verifier, examples, docs, changelog, AOF runtime evidence, git tag, push, and GitHub Release. Out of scope: new QIF features, UI, external integration, and conceptual redesign. / How should improvement success be judged: which metric or end state matters most? => Success is judged by npm test passing, AOF structural checks passing, a clean committed release baseline, pushed tag v0.2.1, and a GitHub Release that references the validated v0.2.1 runtime/consolidation state.
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
- Protocol Thread ID: SESS-MQOJRHLV-HVR0SV

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQOJSHAN-8CJ7SQ

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
