# QIF v0.8.6: Trust Policy Rollout Preview and Affected-Knowledge Census

QIF can now show what a draft portable-knowledge trust policy would change
before anyone activates it.

## Added

- frozen, digest-bound rollout scope;
- one item-preview result for every declared portable knowledge item;
- explicit unresolved-input outcomes instead of guessed results;
- deterministic affected-knowledge census and blast-radius accounting;
- governance for omissions, duplicates, unresolved inputs, material changes,
  census mismatch, and insufficient rollout evidence;
- 18 retained negative fixtures for the new runtime boundary.

## Verification

- QIF positive package checks: 16/16
- retained negative checks: 1,416/1,416
- AOF v12.2.0 managed-project runtime with Need Validation and
  Visionary/Builder/Guardian review

The preview remains non-enforcing and non-authoritative. It does not prove
that a policy is wise, evidence is authentic, the selected scope is
organizationally complete, or activation is approved.
