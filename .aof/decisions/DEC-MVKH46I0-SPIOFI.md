# Decision Record: DEC-MVKH46I0-SPIOFI

- Record Format Version: 1.0.0
- Created At: 2026-10-23T04:32:14.568Z
- Canonical Markdown Path: .aof/decisions/DEC-MVKH46I0-SPIOFI.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-23T04:32:14.568Z
- Canonical Markdown Path: .aof/decisions/DEC-MVKH46I0-SPIOFI.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Develop and release QIF v0.8.0 Multi-Agent Judgment Memory. Need: cooperating evaluators can overwrite dissent, hide shared dependencies, keep stale judgments, or forget inconvenient evidence. Intent: make lane-local judgment memory, dependency disclosure, revision lineage, governed retirement, and aggregate join decisions structurally executable and auditable. Context: extend the standalone QIF Living Ledger without UI or external integrations; verifier proves structure and reproducibility, never semantic truth, competence, consensus correctness, or authority.
- Need: Scope: extend the standalone qif-ledger schema, example, verifier, retained negative fixtures, documentation, AI guide, roadmap, portable package, changelog, and release. Out of scope: UI, external integrations, provider-specific memory stores, employee surveillance, automatic authority, and real operational claims.
- Intent: to be refined after clarification
- Context: context: Non-negotiable: preserve every lane-local judgment, dissent, source, dependency, and revision; retirement must be governed and auditable rather than destructive deletion; never collect hidden chain-of-thought or infer competence, truth, consensus correctness, authorization, or authority from counts or joins. / Scope: extend the standalone qif-ledger schema, example, verifier, retained negative fixtures, documentation, AI guide, roadmap, portable package, changelog, and release. Out of scope: UI, external integrations, provider-specific memory stores, employee surveillance, automatic authority, and real operational claims. | prohibited: Non-negotiable: preserve every lane-local judgment, dissent, source, dependency, and revision; retirement must be governed and auditable rather than destructive deletion; never collect hidden chain-of-thought or infer competence, truth, consensus correctness, authorization, or authority from counts or joins.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVKH3Y7V-AYX3MB
- Clarifications or Assumptions: For safety, legal, authentication, or personal-data concerns, what conditions are absolutely non-negotiable? => Non-negotiable: preserve every lane-local judgment, dissent, source, dependency, and revision; retirement must be governed and auditable rather than destructive deletion; never collect hidden chain-of-thought or infer competence, truth, consensus correctness, authorization, or authority from counts or joins. / Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope: extend the standalone qif-ledger schema, example, verifier, retained negative fixtures, documentation, AI guide, roadmap, portable package, changelog, and release. Out of scope: UI, external integrations, provider-specific memory stores, employee surveillance, automatic authority, and real operational claims.
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
- Protocol Thread ID: SESS-MVKH3Y7V-AYX3MB

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVKH46HX-3BBFYE

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
