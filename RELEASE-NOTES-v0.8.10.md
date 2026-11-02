# QIF v0.8.10: Drift Signal Integrity and Incident Closure

QIF now distinguishes independent, correlated, stale, conflicting, and
unverified drift signals and prevents emergency-demotion incidents from being
closed before a bounded post-action observation and accountable decision.

## Added

- portable signal-source records with identity, ownership, correlation group,
  declared independence, freshness, privacy, evidence, and trust boundaries;
- deterministic signal reconciliation that excludes stale and correlated
  confirmation, preserves conflicts, and identifies unresolved critical
  signals;
- incident-closure records with observation windows, matched demotion
  execution, residual-risk disposition, human authority, reopen conditions,
  and governance routing;
- fail-closed governance for unverified sources, stale evidence, unresolved
  correlation, signal conflict, blocked closure, and approved closure;
- 24 retained negative fixtures for the new signal and closure boundary.

## Verification

- QIF positive package checks: 16/16
- retained negative checks: 1,504/1,504
- AOF v12.2.0 managed-project runtime with Need Validation and
  Visionary/Builder/Guardian review

QIF reproduces the declared evidence chain. It does not authenticate a signal
source, prove causal independence or monitoring completeness, observe live
provider state, close an operational incident, grant authority, or claim
future safety or semantic fitness.
