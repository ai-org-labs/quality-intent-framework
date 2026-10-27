# Decision Record: DEC-MVQ6T065-WJMD5U

- Record Format Version: 1.0.0
- Created At: 2026-10-27T04:30:14.045Z
- Canonical Markdown Path: .aof/decisions/DEC-MVQ6T065-WJMD5U.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-27T04:30:14.045Z
- Canonical Markdown Path: .aof/decisions/DEC-MVQ6T065-WJMD5U.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Develop and release QIF v0.8.4 Portable Trust Policy and Attestation Binding. Need: v0.8.3 records revocation and fails closed but cannot express which attestation issuers, signer identities, predicate types, trust roots, transparency evidence, validity windows, or policy revisions a local organization accepts. Intent: add provider-neutral, executable trust-policy and attestation-binding records to qif-ledger; verify exact subject digest, issuer and subject scope, predicate type, trust-root revision, validity time, transparency evidence status, policy decision and governance. Preserve the boundary that cryptographic verification and policy conformance do not prove semantic quality, source safety, authenticity beyond recorded evidence, authorization, or authority. Include schema, example, deterministic verifier, retained negative fixtures, docs, AI guidance, portable package, roadmap, AOF evidence, tag, and release.
- Need: Cover the standalone qif-ledger schema, portable libraries and items, revocation records, trust-policy records, attestation bindings, deterministic policy evaluation, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Exclude UI, external registry calls, live cryptographic verification, key management, secret handling, employee surveillance, automatic activation, automatic authority, and semantic truth claims.
- Intent: Success means each attestation binds to an exact portable item digest and a versioned local trust policy; issuer, subject, predicate, trust-root revision, time window, transparency evidence, and revocation state are evaluated deterministically; mismatch, expiry, unknown root, or incomplete evidence fails closed and opens governance; policy decisions never claim artifact safety, semantic fitness, authorization, or authority.
- Context: context: Cover the standalone qif-ledger schema, portable libraries and items, revocation records, trust-policy records, attestation bindings, deterministic policy evaluation, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Exclude UI, external registry calls, live cryptographic verification, key management, secret handling, employee surveillance, automatic activation, automatic authority, and semantic truth claims. | success: Success means each attestation binds to an exact portable item digest and a versioned local trust policy; issuer, subject, predicate, trust-root revision, time window, transparency evidence, and revocation state are evaluated deterministically; mismatch, expiry, unknown root, or incomplete evidence fails closed and opens governance; policy decisions never claim artifact safety, semantic fitness, authorization, or authority.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVQ6SV96-D0ZQ33
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Cover the standalone qif-ledger schema, portable libraries and items, revocation records, trust-policy records, attestation bindings, deterministic policy evaluation, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Exclude UI, external registry calls, live cryptographic verification, key management, secret handling, employee surveillance, automatic activation, automatic authority, and semantic truth claims. / How should improvement success be judged: which metric or end state matters most? => Success means each attestation binds to an exact portable item digest and a versioned local trust policy; issuer, subject, predicate, trust-root revision, time window, transparency evidence, and revocation state are evaluated deterministically; mismatch, expiry, unknown root, or incomplete evidence fails closed and opens governance; policy decisions never claim artifact safety, semantic fitness, authorization, or authority.
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
- Protocol Thread ID: SESS-MVQ6SV96-D0ZQ33

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVQ6T062-STPIEI

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
