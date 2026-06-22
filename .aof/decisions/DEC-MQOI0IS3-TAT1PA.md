# Decision Record: DEC-MQOI0IS3-TAT1PA

- Record Format Version: 1.0.0
- Created At: 2026-06-22T00:49:56.499Z
- Canonical Markdown Path: .aof/decisions/DEC-MQOI0IS3-TAT1PA.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-06-22T00:49:56.499Z
- Canonical Markdown Path: .aof/decisions/DEC-MQOI0IS3-TAT1PA.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: Implement QIF v0.2.1 hardening for schema implementation and verifier execution: first-class Raw Expert Answer and Question Log Entry, derivation-record Quality Intent Derivation, executable Applicability Rules, confidence policy reproducibility, Governance Trigger to Governance Event linkage, and context-only Organizational Quality Culture without redesigning the accepted v0.2 baseline.
- Need: Scope: update the existing QIF v0.2 Discovery and Application Runtime implementation artifacts for v0.2.1: docs, runtime package schemas, discovery/culture/evaluation-target/review-run examples, local verifier, npm test integration, changelog, and AOF runtime log. Out of scope: UI, external integrations, software-development specialization, from-scratch redesign, and semantic-truth claims from verifier success.
- Intent: Success: npm test verifies an end-to-end v0.2.1 runtime showing Raw Expert Answers, Question Log Entries, Extraction Steps, cues, concerns, loss boundaries, Decision Patterns, Quality Intent Derivations as derivation records, context-only culture aggregation, Evaluation Targets, executable Applicability Rules, target-specific Applicability Decisions, evidence-backed Review Runs, Governance Triggers linked optionally to Governance Events, and confidence reproducibility from evidence inputs plus explicit confidence policies.
- Context: context: Scope: update the existing QIF v0.2 Discovery and Application Runtime implementation artifacts for v0.2.1: docs, runtime package schemas, discovery/culture/evaluation-target/review-run examples, local verifier, npm test integration, changelog, and AOF runtime log. Out of scope: UI, external integrations, software-development specialization, from-scratch redesign, and semantic-truth claims from verifier success. | success: Success: npm test verifies an end-to-end v0.2.1 runtime showing Raw Expert Answers, Question Log Entries, Extraction Steps, cues, concerns, loss boundaries, Decision Patterns, Quality Intent Derivations as derivation records, context-only culture aggregation, Evaluation Targets, executable Applicability Rules, target-specific Applicability Decisions, evidence-backed Review Runs, Governance Triggers linked optionally to Governance Events, and confidence reproducibility from evidence inputs plus explicit confidence policies.
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MQOI0C6D-VHA2NY
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => Scope: update the existing QIF v0.2 Discovery and Application Runtime implementation artifacts for v0.2.1: docs, runtime package schemas, discovery/culture/evaluation-target/review-run examples, local verifier, npm test integration, changelog, and AOF runtime log. Out of scope: UI, external integrations, software-development specialization, from-scratch redesign, and semantic-truth claims from verifier success. / How should improvement success be judged: which metric or end state matters most? => Success: npm test verifies an end-to-end v0.2.1 runtime showing Raw Expert Answers, Question Log Entries, Extraction Steps, cues, concerns, loss boundaries, Decision Patterns, Quality Intent Derivations as derivation records, context-only culture aggregation, Evaluation Targets, executable Applicability Rules, target-specific Applicability Decisions, evidence-backed Review Runs, Governance Triggers linked optionally to Governance Events, and confidence reproducibility from evidence inputs plus explicit confidence policies.
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
- Protocol Thread ID: SESS-MQOI0C6D-VHA2NY

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MQOI0IRS-0J7S62

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
