# QIF v0.6.29

QIF v0.6.29 makes repeated-trial and infrastructure uncertainty executable.

## Added

- Trial Variance records linked to calibration runs and suite-health records.
- Repeated measurements with reproducible count, mean, minimum, maximum, and
  observed range.
- Infrastructure profiles for environment, runtime, resources, time limits,
  concurrency, incidents, and stability.
- Controlled-variable, known-difference, and potential-confounder records.
- Deterministic `CRD-UNCERTAINTY` readiness and a positive satisfiability
  regression.
- Twenty retained negative cases, bringing the suite to 638 checks.

## Boundary

An observed range is not automatically a statistical confidence interval.
Trial count, a narrow range, a stable environment, or verifier success does
not prove quality, trial independence, causation, representativeness, or
semantic truth.

## Verify

```sh
node tools/qif.mjs calibration-readiness
node tools/check-calibration-readiness.mjs
npm test
```
