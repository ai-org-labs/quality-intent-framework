# Decision Record: DEC-MVQ6UQPD-1YOWLS

- Record Format Version: 1.0.0
- Created At: 2026-10-27T04:31:35.088Z
- Canonical Markdown Path: .aof/decisions/DEC-MVQ6UQPD-1YOWLS.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-27T04:31:35.088Z
- Canonical Markdown Path: .aof/decisions/DEC-MVQ6UQPD-1YOWLS.md
- Scope: concept-approval
- Stage: planning
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
- Protocol Thread ID: SESS-MVQ6SV96-D0ZQ33

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVQ6T062-STPIEI

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
