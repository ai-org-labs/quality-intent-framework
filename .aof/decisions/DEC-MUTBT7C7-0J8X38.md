# Decision Record: DEC-MUTBT7C7-0J8X38

- Record Format Version: 1.0.0
- Created At: 2026-10-04T04:33:57.607Z
- Canonical Markdown Path: .aof/decisions/DEC-MUTBT7C7-0J8X38.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-04T04:33:57.607Z
- Canonical Markdown Path: .aof/decisions/DEC-MUTBT7C7-0J8X38.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Advance QIF after v0.6.36 using the latest released AOF and current reviewer-disagreement evidence. Build and release v0.6.37 Reviewer Disagreement Calibration.
- Need: Scope the standalone, domain-general calibration-report runtime: disagreement policies; independent reviewer judgments; explicit disagreement records; accountable adjudication outcomes; aggregate disagreement assessments; governance triggers; schemas, verifier, examples, retained fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, employee scoring, automatic majority or seniority authority, forced consensus, hidden dissent, causal claims, and changes to unrelated package types.
- Intent: Success means a human or AI can reproduce which independent reviewers judged the same case, preserve each verdict, rationale, evidence and confidence, identify exact disagreement dimensions, trace any override or adjudication without deleting originals, and route low independence, unresolved conflict, unsupported override, adjudicator conflict, insufficient data, or unverified evidence to governance. Agreement rate and majority count remain evidence, never semantic truth, quality, competence, or authority.
- Context: context: Scope the standalone, domain-general calibration-report runtime: disagreement policies; independent reviewer judgments; explicit disagreement records; accountable adjudication outcomes; aggregate disagreement assessments; governance triggers; schemas, verifier, examples, retained fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, employee scoring, automatic majority or seniority authority, forced consensus, hidden dissent, causal claims, and changes to unrelated package types. | success: Success means a human or AI can reproduce which independent reviewers judged the same case, preserve each verdict, rationale, evidence and confidence, identify exact disagreement dimensions, trace any override or adjudication without deleting originals, and route low independence, unresolved conflict, unsupported override, adjudicator conflict, insufficient data, or unverified evidence to governance. Agreement rate and majority count remain evidence, never semantic truth, quality, competence, or authority.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MUTBSTHE-NWLTNY
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope the standalone, domain-general calibration-report runtime: disagreement policies; independent reviewer judgments; explicit disagreement records; accountable adjudication outcomes; aggregate disagreement assessments; governance triggers; schemas, verifier, examples, retained fixtures, plain-language docs, roadmap, and release evidence. Exclude UI, external integrations, employee scoring, automatic majority or seniority authority, forced consensus, hidden dissent, causal claims, and changes to unrelated package types. / How should improvement success be judged: which metric or end state matters most? => Success means a human or AI can reproduce which independent reviewers judged the same case, preserve each verdict, rationale, evidence and confidence, identify exact disagreement dimensions, trace any override or adjudication without deleting originals, and route low independence, unresolved conflict, unsupported override, adjudicator conflict, insufficient data, or unverified evidence to governance. Agreement rate and majority count remain evidence, never semantic truth, quality, competence, or authority.
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
- Protocol Thread ID: SESS-MUTBSTHE-NWLTNY

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MUTBT7C3-EGGY1N

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
