# QIF v0.8.8: Activation Outcome Reconciliation and Policy Promotion

QIF now preserves the governed chain from an authorized trust-policy action to
observed execution state, recovery verification, and final policy disposition.

## Added

- activation and rollback execution reconciliations bound to exact policy,
  scope digest, evidence, and observed state;
- recovery verification with evidence-bearing effect checks and reproducible
  verified, failed, or incomplete outcomes;
- accountable promote, hold, retire, and failed-recovery decisions;
- fail-closed governance for missing evidence, state mismatch, incomplete or
  failed recovery, blocked promotion, and missing authority;
- retained negative fixtures for the new execution and promotion boundary.

## Verification

- QIF positive package checks: 16/16
- retained negative checks: 1,455/1,455
- AOF v12.2.0 managed-project runtime with Need Validation and
  Visionary/Builder/Guardian review

QIF reproduces the declared evidence chain. It does not authenticate provider
state, guarantee complete side-effect recovery, execute a promotion, grant
authority, or claim semantic fitness.
