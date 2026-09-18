# QIF v0.6.26

QIF v0.6.26 adds `qif calibration-readiness`, a machine-readable preflight for entering Phase 4 empirical calibration.

## Added

- `node tools/qif.mjs calibration-readiness`
- Optional `--quality-gate`, `--ledger`, `--calibration`, and `--pilot-corpus` inputs.
- Explicit prerequisite checks for package validity, evidence origin, decision-outcome pairs, evaluation suite health, domain diversity, trial and infrastructure uncertainty, and framework learning from contradicted assumptions.
- Exact blockers and next actions when empirical calibration is not yet supportable.
- A regression check that keeps committed examples classified as example-only evidence.

## Boundary

`qif calibration-readiness` checks declared structure and provenance boundaries only. It does not prove semantic truth, outcome attribution, case representativeness, predictive validity, empirical calibration, or decision correctness.

## Verification

- `node tools/qif.mjs calibration-readiness`
- `node tools/check-calibration-readiness.mjs`
- `node tools/qif.mjs commands`
- `node tools/qif.mjs status`
- `node tools/qif.mjs validate --all`
- `npm test`
