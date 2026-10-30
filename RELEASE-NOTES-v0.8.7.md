# QIF v0.8.7: Trust Policy Activation Decision and Rollback Contract

QIF now preserves the governed chain between a trust-policy rollout preview,
an accountable activation decision, bounded observation, and rollback.

## Added

- activation decisions bound to sufficient rollout previews and exact scope;
- explicit accountable authority basis, observation link, rollback target,
  and deadline;
- evidence-bearing observation signals with reproducible continue, hold, and
  rollback-required outcomes;
- rollback records that preserve history, execution state, evidence, residual
  risk, and governance;
- retained negative fixtures for the new authority and safe-exit boundary.

## Verification

- QIF positive package checks: 16/16
- retained negative checks: 1,435/1,435
- AOF v12.2.0 managed-project runtime with Need Validation and
  Visionary/Builder/Guardian review

QIF records and verifies the declared decision chain. It does not execute a
policy, grant authority, prove observation truth, guarantee rollback success,
or claim semantic fitness.
