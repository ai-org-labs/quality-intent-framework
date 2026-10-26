# Decision Record: DEC-MVORD5OG-AB0L64

- Record Format Version: 1.0.0
- Created At: 2026-10-26T04:30:14.272Z
- Canonical Markdown Path: .aof/decisions/DEC-MVORD5OG-AB0L64.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-26T04:30:14.272Z
- Canonical Markdown Path: .aof/decisions/DEC-MVORD5OG-AB0L64.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Develop and release QIF v0.8.3 Portable Knowledge Supply-Chain Revocation. Need: v0.8.2 can import portable Decision Patterns and Quality Intents, test local applicability, and mark them only eligible for governed activation, but it cannot respond when a source library, item digest, signer, evidence source, or upstream pattern is later revoked, compromised, superseded, disputed, or stale. Intent: extend standalone qif-ledger with source revocation notices, dependency lineage, deterministic direct and transitive impact assessment, fail-closed suspension, bounded revalidation, and governance. Preserve history; never delete or silently rewrite prior decisions. Do not grant automatic semantic truth, activation, execution, authorization, or authority. Add schemas, example, verifier rules, retained negative fixtures, documentation, AI authoring guidance, portable package integration, roadmap, changelog, AOF evidence, tag, and GitHub release.
- Need: Cover the standalone qif-ledger schema, source-linked portable libraries and items, local applicability/reproduction assessments, revocation dependency graph, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Keep UI, external registries, live key infrastructure, cryptographic signing implementation, automatic deletion, automatic activation, automatic authority, employee surveillance, v0.9 intent-twin work, and semantic truth claims out of scope.
- Intent: Success means an active or disputed revocation notice names exact affected source identities and evidence; direct and transitive dependents are reproduced from explicit dependency edges; prior eligibility fails closed into suspension without history deletion; stale or incomplete traversal opens governance; and revalidation requires a replacement source or reviewed evidence. Every count and status must be deterministic, while authenticity, compromise truth, safety, and authority remain human or governance judgments.
- Context: context: Cover the standalone qif-ledger schema, source-linked portable libraries and items, local applicability/reproduction assessments, revocation dependency graph, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Keep UI, external registries, live key infrastructure, cryptographic signing implementation, automatic deletion, automatic activation, automatic authority, employee surveillance, v0.9 intent-twin work, and semantic truth claims out of scope. | success: Success means an active or disputed revocation notice names exact affected source identities and evidence; direct and transitive dependents are reproduced from explicit dependency edges; prior eligibility fails closed into suspension without history deletion; stale or incomplete traversal opens governance; and revalidation requires a replacement source or reviewed evidence. Every count and status must be deterministic, while authenticity, compromise truth, safety, and authority remain human or governance judgments.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVORD031-BEPQNW
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Cover the standalone qif-ledger schema, source-linked portable libraries and items, local applicability/reproduction assessments, revocation dependency graph, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Keep UI, external registries, live key infrastructure, cryptographic signing implementation, automatic deletion, automatic activation, automatic authority, employee surveillance, v0.9 intent-twin work, and semantic truth claims out of scope. / How should improvement success be judged: which metric or end state matters most? => Success means an active or disputed revocation notice names exact affected source identities and evidence; direct and transitive dependents are reproduced from explicit dependency edges; prior eligibility fails closed into suspension without history deletion; stale or incomplete traversal opens governance; and revalidation requires a replacement source or reviewed evidence. Every count and status must be deterministic, while authenticity, compromise truth, safety, and authority remain human or governance judgments.
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
- Protocol Thread ID: SESS-MVORD031-BEPQNW

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVORD5OD-M5YW5X

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
