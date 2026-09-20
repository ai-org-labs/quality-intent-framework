# QIF v0.6.28

QIF v0.6.28 adds executable Evaluation Suite Health records.

## Added

- Eight explicit health dimensions: task origin, contamination, solvability,
  saturation, graders, harness, infrastructure, and drift ownership.
- Bidirectional links between calibration runs and suite-health records.
- Consistency rules for healthy and non-healthy status, case coverage,
  empirical origins, governance, and calibrated conclusions.
- `qif calibration-readiness` reporting for record status, each health
  dimension, and run-to-health linkage.
- Seven retained negative cases and a positive regression proving that
  `CRD-SUITE-HEALTH` is structurally satisfiable.

## Boundary

A healthy record proves that required health claims are explicitly declared
and structurally consistent. It does not prove semantic validity,
representativeness, contamination freedom, grader correctness, scientific
validity, or operational quality. Activity counts are not suite health.

## Verify

```sh
node tools/qif.mjs calibration-readiness
node tools/check-calibration-readiness.mjs
npm test
```

