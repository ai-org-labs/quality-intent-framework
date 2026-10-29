# Decision Record: DEC-MVT1VOV1-F6IAXV

- Record Format Version: 1.0.0
- Created At: 2026-10-29T04:35:39.805Z
- Canonical Markdown Path: .aof/decisions/DEC-MVT1VOV1-F6IAXV.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-29T04:35:39.805Z
- Canonical Markdown Path: .aof/decisions/DEC-MVT1VOV1-F6IAXV.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Need: prevent proposed portable trust-policy changes from surprising operators by previewing every in-scope knowledge item before activation. Intent: implement v0.8.6 rollout preview and affected-knowledge census with frozen scope, per-item replay, exact reconciliation, governance, and non-authority boundaries. Context: v0.8.5 supports one historical replay but not population completeness; GitHub Evaluate mode and Sigstore warn mode show the value of non-enforcing policy observation.
- Need: Scope: qif-ledger portable-knowledge trust policy collections, schema, example, verifier, fixtures, docs, portable package, and release. Out of scope: UI, live registries, live cryptographic verification, automatic policy activation, or enforcement.
- Intent: Success: a frozen in-scope population is replayed exactly once per item under a proposed policy; changed, unresolved, missing, and unchanged outcomes reconcile to deterministic census totals; incomplete scope or weak outcomes trigger governance; npm test and AOF verification pass.
- Context: context: Scope: qif-ledger portable-knowledge trust policy collections, schema, example, verifier, fixtures, docs, portable package, and release. Out of scope: UI, live registries, live cryptographic verification, automatic policy activation, or enforcement. | success: Success: a frozen in-scope population is replayed exactly once per item under a proposed policy; changed, unresolved, missing, and unchanged outcomes reconcile to deterministic census totals; incomplete scope or weak outcomes trigger governance; npm test and AOF verification pass.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVT1VA57-97LBER
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope: qif-ledger portable-knowledge trust policy collections, schema, example, verifier, fixtures, docs, portable package, and release. Out of scope: UI, live registries, live cryptographic verification, automatic policy activation, or enforcement. / How should improvement success be judged: which metric or end state matters most? => Success: a frozen in-scope population is replayed exactly once per item under a proposed policy; changed, unresolved, missing, and unchanged outcomes reconcile to deterministic census totals; incomplete scope or weak outcomes trigger governance; npm test and AOF verification pass.
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
- Protocol Thread ID: SESS-MVT1VA57-97LBER

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVT1VOUX-NU8KTB

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
