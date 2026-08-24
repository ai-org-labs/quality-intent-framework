# QIF v0.6.5

QIF v0.6.5 hardens Action Quality Contract with Trace Approval Evidence.

## Added

- `traceApprovalEvidence` in action-quality-contract packages.
- Structural evidence for approval-required tool calls, approved or denied decisions, approver/time, replay or resume binding, and redaction state.
- Verifier checks that approval-gated requests and accepted approval-gated outcomes are backed by approved trace approval evidence.

## Verification

- `npm test`
- AOF runtime log updated with source check, Need / Intent / Context, council judgment, verifier boundary, and release outcome.

## Boundary

The verifier proves traceability and rule compliance. It does not prove that a tool call was safe, that approval was wise, or that the runtime enforced isolation correctly.
