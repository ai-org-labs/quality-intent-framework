# QIF v0.6.27

QIF v0.6.27 makes evidence provenance executable instead of implicit.

## Added

- First-class `evidenceOrigins` records in the four package types used by
  `qif calibration-readiness`.
- `evidenceOriginRef` links from post-release reviews, agent outcomes,
  calibration cases, and pilot cases.
- Origin fields for source artifact, observation window, environment,
  recorder, verifier, transformation summary, and lifecycle status.
- Positive and negative regression coverage for origin recognition and
  reference integrity.

## Readiness boundary

Only verified `observed-operational` and `historical-record` origins satisfy
`CRD-ORIGIN`. `example`, `simulated`, and `synthetic` origins remain
non-empirical. A passing verifier proves declared structure and reference
resolution only; it does not prove source truth, representativeness, causal
attribution, calibration, or decision correctness.

## Verify

```sh
node tools/qif.mjs calibration-readiness
node tools/check-calibration-readiness.mjs
npm test
```

