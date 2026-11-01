# Decision Record: DEC-MVXBYIGV-BAYLCA

- Record Format Version: 1.0.0
- Created At: 2026-11-01T04:28:52.351Z
- Canonical Markdown Path: .aof/decisions/DEC-MVXBYIGV-BAYLCA.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-11-01T04:28:52.351Z
- Canonical Markdown Path: .aof/decisions/DEC-MVXBYIGV-BAYLCA.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Need: QIF must detect when a promoted portable trust policy drifts from its approved state and preserve evidence for a bounded emergency demotion. Intent: add provider-neutral, non-authoritative policy-state observations, drift assessments, and human-governed emergency demotion records that fail closed without claiming external execution or semantic truth. Context: QIF v0.8.8 already reconciles activation and rollback outcomes and records promotion disposition; current official guidance from NIST, Microsoft, Google Cloud, and AWS emphasizes continuous drift monitoring, accountable owners, incident response, recovery, and lifecycle retirement. Preserve package portability, deterministic local verification, history immutability, governance escalation, and at least three future roadmap horizons.
- Need: Cover QIF's provider-neutral portable trust-policy lifecycle after a v0.8.8 promotion decision: observe approved versus current policy state over time, classify drift, and record a bounded human-authorized emergency demotion. Exclude live provider integrations, deployment execution, autonomous authority, background monitoring services, UI, cryptographic authenticity claims, employee surveillance, and semantic-truth claims.
- Intent: Success means every drift assessment is reproducible from a frozen approved baseline and evidence-backed observation; material or unverified drift deterministically triggers governance; emergency demotion requires accountable authority, target policy, reason, evidence, scope, deadline, and post-action reconciliation; history stays append-only; npm test, retained fixtures, portable build, and AOF verification pass.
- Context: context: Cover QIF's provider-neutral portable trust-policy lifecycle after a v0.8.8 promotion decision: observe approved versus current policy state over time, classify drift, and record a bounded human-authorized emergency demotion. Exclude live provider integrations, deployment execution, autonomous authority, background monitoring services, UI, cryptographic authenticity claims, employee surveillance, and semantic-truth claims. | success: Success means every drift assessment is reproducible from a frozen approved baseline and evidence-backed observation; material or unverified drift deterministically triggers governance; emergency demotion requires accountable authority, target policy, reason, evidence, scope, deadline, and post-action reconciliation; history stays append-only; npm test, retained fixtures, portable build, and AOF verification pass.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVXBYFXP-7KPV48
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Cover QIF's provider-neutral portable trust-policy lifecycle after a v0.8.8 promotion decision: observe approved versus current policy state over time, classify drift, and record a bounded human-authorized emergency demotion. Exclude live provider integrations, deployment execution, autonomous authority, background monitoring services, UI, cryptographic authenticity claims, employee surveillance, and semantic-truth claims. / How should improvement success be judged: which metric or end state matters most? => Success means every drift assessment is reproducible from a frozen approved baseline and evidence-backed observation; material or unverified drift deterministically triggers governance; emergency demotion requires accountable authority, target policy, reason, evidence, scope, deadline, and post-action reconciliation; history stays append-only; npm test, retained fixtures, portable build, and AOF verification pass.
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
- Protocol Thread ID: SESS-MVXBYFXP-7KPV48

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVXBYIGQ-YJJ0V9

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
