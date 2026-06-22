# Decision Record: DEC-MQPCIFWN-BFPMQ9

- Record Format Version: 1.0.0
- Created At: 2026-06-22T15:03:41.063Z
- Canonical Markdown Path: .aof/decisions/DEC-MQPCIFWN-BFPMQ9.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-22T15:03:41.063Z
- Canonical Markdown Path: .aof/decisions/DEC-MQPCIFWN-BFPMQ9.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Migrate the Quality Intent Framework repository from a legacy personal-account development context to the AI Org Labs public account. Need: publish a sanitized repository state under ai-org-labs/quality-intent-framework with no legacy personal account identifiers in files or pushed history. Intent: remove legacy account references from tracked files, avoid preserving legacy author history by using a clean initial commit, point the repository at the new remote, and push only the sanitized branch without legacy tags. Context: keep QIF v0.2.1 content and AOF evidence, avoid new QIF features, and treat AOF source as moved to AI Org Labs.
- Need: The touchpoint is repository publication and developer handoff: tracked files, AOF evidence, Git remote configuration, clean initial commit, and push to ai-org-labs/quality-intent-framework. Out of scope: QIF feature changes, UI, external integrations, preserving legacy personal-account history, and pushing legacy tags.
- Intent: to be refined after clarification
- Context: context: The touchpoint is repository publication and developer handoff: tracked files, AOF evidence, Git remote configuration, clean initial commit, and push to ai-org-labs/quality-intent-framework. Out of scope: QIF feature changes, UI, external integrations, preserving legacy personal-account history, and pushing legacy tags. / Carry forward the accepted QIF v0.2.1 runtime content, release notes, docs, schemas, examples, verifier, and AOF evidence, but remove legacy personal account identifiers from files and avoid carrying old author metadata into the new public history.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MQPCHTJC-94FWQ8
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => The touchpoint is repository publication and developer handoff: tracked files, AOF evidence, Git remote configuration, clean initial commit, and push to ai-org-labs/quality-intent-framework. Out of scope: QIF feature changes, UI, external integrations, preserving legacy personal-account history, and pushing legacy tags. / In the current implementation or operation, what context must be carried forward into this decision? => Carry forward the accepted QIF v0.2.1 runtime content, release notes, docs, schemas, examples, verifier, and AOF evidence, but remove legacy personal account identifiers from files and avoid carrying old author metadata into the new public history.
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
- Protocol Thread ID: SESS-MQPCHTJC-94FWQ8

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQPCIFWH-W590TD

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
