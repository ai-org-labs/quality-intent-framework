# QIF v0.6.30

QIF v0.6.30 makes the framework-learning loop executable.

## Added

- First-class Framework Learning records linked bidirectionally to calibration
  runs.
- Traceability from a prior assumption and contradiction evidence to a
  proposed framework change, accountable governance, implementation,
  validation evidence, and rollback criteria.
- Lifecycle consistency for proposed, accepted, implemented, rejected,
  rolled-back, and stale learning records.
- Deterministic `CRD-LEARNING` readiness that requires verified empirical
  origins, accepted governance, implemented artifacts, validation evidence,
  rollback criteria, and resolved triggers.
- Thirteen retained negative cases, bringing the suite to 651 checks.

## Boundary

A change log, change count, evaluator recommendation, accepted proposal, or
passing verifier does not prove learning. The verifier establishes structure,
traceability, lifecycle consistency, and readiness only. It does not prove
that an assumption was false or that a framework change improved quality.

## Verify

```sh
node tools/qif.mjs calibration-readiness
node tools/check-calibration-readiness.mjs
npm test
```

