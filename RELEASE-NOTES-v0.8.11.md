# QIF v0.8.11: Late-Signal Reopen and Closure Calibration

QIF now governs evidence received after an incident closure without rewriting
the closure that was made with the evidence available at the time.

## Added

- late-signal records with occurrence time, receipt time, source, materiality,
  evidence status, and immutable closure linkage;
- human incident-reopen decisions that cite original reopen conditions and
  retain a separate continuation incident;
- closure calibration across aligned, false-assurance, false-alarm, and
  unknown outcomes;
- governance for unverified or material late signals, reopen decisions,
  adverse calibration, and insufficient evidence;
- 33 retained negative fixtures for the new lifecycle boundary.

## Verification

- QIF positive package checks: 16/16
- retained negative checks: 1,537/1,537
- AOF v12.2.0 managed-project runtime with corrected Need Validation and
  Visionary/Builder/Guardian review

QIF reproduces the declared late-evidence chain. It does not authenticate a
source, prove material impact or causality, reopen an operational incident,
grant authority, predict future safety, or claim semantic fitness.
