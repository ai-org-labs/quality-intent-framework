# QIF v0.6.32

QIF v0.6.32 makes the cohort behind a calibration aggregate executable and
auditable.

## Added

- Calibration Cohort records with eligible decisions, candidate pairs, and
  structured inclusion and exclusion rules.
- Deterministic membership, exclusion, missing-outcome, duplicate-group, and
  dependence-state verification.
- Segment definitions and reproduced pair counts, outcome prevalence, Brier
  scores, and high-risk designation.
- Cohort completeness and drift records with governance routing for missing
  outcomes, duplicate or unresolved dependence, adverse high-risk segments,
  unassessed drift, and detected drift.
- 22 retained negative cases, bringing the suite to 701 checks across 16
  positive package types.

## Boundary

Cohort size, coverage, class balance, and segment counts do not prove
representativeness, independence, or quality. The verifier proves declared
structure and arithmetic only; semantic and empirical validity remain human
and operational responsibilities.

## Verify

```sh
node tools/qif.mjs calibration-report
npm test
```
