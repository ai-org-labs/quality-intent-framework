# Decision Record: DEC-MVRM3VF2-1GRIE8

- Record Format Version: 1.0.0
- Created At: 2026-10-28T04:26:21.518Z
- Canonical Markdown Path: .aof/decisions/DEC-MVRM3VF2-1GRIE8.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-28T04:26:21.518Z
- Canonical Markdown Path: .aof/decisions/DEC-MVRM3VF2-1GRIE8.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Develop and release QIF v0.8.5 Trust Policy Rotation and Historical Replay. Preserve superseded local trust policy revisions, express rotation reason and effective boundaries, replay historical trust decisions against a named later policy without overwriting the original decision, classify changed outcomes, and route material change or missing historical inputs to governance. Keep QIF provider-neutral and standalone; do not add live cryptographic verification, external registries, key management, UI, automatic activation, authorization, authority, or semantic-truth claims. Include schema, example, deterministic verifier, retained negative fixtures, docs, AI guidance, portable package, roadmap, AOF evidence, tag, and release.
- Need: Cover the standalone qif-ledger schema, v0.8.4 trust policies and decisions, immutable policy lineage, historical replay, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Exclude UI, external systems, live cryptography, key custody, automatic activation, authorization, authority, employee surveillance, and semantic truth.
- Intent: Success means an original trust decision remains unchanged; every policy revision has explicit predecessor, rotation reason, effective window, and status; replay names original and replay policy revisions plus frozen inputs; outcome changes are reproduced deterministically; incomplete inputs or material changes fail closed into governance; no replay rewrites history or grants authority.
- Context: context: Cover the standalone qif-ledger schema, v0.8.4 trust policies and decisions, immutable policy lineage, historical replay, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Exclude UI, external systems, live cryptography, key custody, automatic activation, authorization, authority, employee surveillance, and semantic truth. | success: Success means an original trust decision remains unchanged; every policy revision has explicit predecessor, rotation reason, effective window, and status; replay names original and replay policy revisions plus frozen inputs; outcome changes are reproduced deterministically; incomplete inputs or material changes fail closed into governance; no replay rewrites history or grants authority.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MVRM3RP6-T22G5C
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Cover the standalone qif-ledger schema, v0.8.4 trust policies and decisions, immutable policy lineage, historical replay, governance, verifier, fixtures, docs, AI guide, portable package, roadmap, changelog, and release. Exclude UI, external systems, live cryptography, key custody, automatic activation, authorization, authority, employee surveillance, and semantic truth. / How should improvement success be judged: which metric or end state matters most? => Success means an original trust decision remains unchanged; every policy revision has explicit predecessor, rotation reason, effective window, and status; replay names original and replay policy revisions plus frozen inputs; outcome changes are reproduced deterministically; incomplete inputs or material changes fail closed into governance; no replay rewrites history or grants authority.
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
- Protocol Thread ID: SESS-MVRM3RP6-T22G5C

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MVRM3VF0-MOPNGX

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
