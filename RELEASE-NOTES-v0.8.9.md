# QIF v0.8.9: Policy State Drift and Emergency Demotion

QIF now keeps a promoted trust policy under an append-only, evidence-backed
state history and preserves accountable emergency demotion evidence when
critical drift is declared.

## Added

- sequential policy-state observations bound to a promoted policy, approved
  scope, state dimensions, and evidence;
- deterministic drift assessments with exact changed-dimension coverage,
  severity, decision, and governance routing;
- human-authorized emergency demotion records linked to predecessor policy,
  deadline, execution reconciliation, and residual risk;
- fail-closed governance for missing state evidence, material drift, critical
  drift, incomplete demotion, failed demotion, and history mutation;
- 25 retained negative fixtures for the new drift and demotion boundary.

## Corrected

- successful observations and promotions no longer require rollback records;
- the ledger schema's rollout-scope array is now valid JSON;
- canonical schema and example JSON syntax is checked before the test suite.

## Verification

- QIF positive package checks: 16/16
- retained negative checks: 1,480/1,480
- AOF v12.2.0 managed-project runtime with Need Validation and
  Visionary/Builder/Guardian review

QIF reproduces the declared evidence chain. It does not observe live provider
state, authenticate evidence, prove drift root cause or severity, execute a
demotion, grant authority, or claim semantic fitness.
