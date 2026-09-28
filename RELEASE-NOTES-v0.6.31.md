# QIF v0.6.31

QIF v0.6.31 makes confidence-versus-outcome calibration reports executable.

## Added

- A standalone `calibration-report` package type composed from existing
  quality-gate decisions and post-release reviews.
- Decision Outcome Pair records that separate source confidence, forecast
  probability, declared meaning, transformation rationale, outcome, evidence
  origin, and observation window.
- Deterministic Brier score, calibration bucket, sample, empirical-origin,
  sufficiency, signal, and governance checks.
- `qif calibration-report` plus CLI discovery, starter generation, inventory,
  tracing, and validation integration.
- 28 retained negative cases, bringing the suite to 679 checks across 16
  positive package types.

## Boundary

Existing QIF confidence is not automatically a probability of success. The
v0.6.31 identity mapping requires an explicit meaning, rationale, and reviewer,
but semantic validity still requires human and empirical review. A Brier score,
bucket gap, sample count, report, or verifier pass is evidence only and never
an automatic quality verdict.

## Verify

```sh
node tools/qif.mjs calibration-report
node tools/qif.mjs validate --all
npm test
```
