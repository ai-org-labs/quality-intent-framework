# QIF v0.6.6

QIF v0.6.6 hardens Action Quality Contract with Approval Persistence Policy.

## Added

- `approvalPersistencePolicies` in action-quality-contract packages.
- Policy fields for sticky approval/rejection scope, allowed decisions, tool/server identity boundary, expiry, revocation conditions, cross-run reuse, and canonical invocation binding.
- Trace approval evidence now records whether persistence was applied and links to a persistence policy when it was.

## Verification

- `npm test`
- AOF runtime log updated with source check, Need / Intent / Context, council judgment, verifier boundary, and release outcome.

## Boundary

The verifier proves persistence policy structure and linkage. It does not prove that a persisted approval was wise, that a human made the correct decision, or that the runtime enforced the policy.
