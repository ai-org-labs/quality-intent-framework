# QIF v0.6.33

QIF v0.6.33 makes the decision consequence behind a calibration error
executable and auditable.

## Added

- Consequence Policies linked to source Quality Intent loss boundaries.
- Reviewed proceed/defer thresholds and asymmetric false-assurance versus
  false-alarm governance-priority weights.
- Decision Consequence records with deterministic action, outcome class,
  applicable weight, weighted error, and governance links.
- Consequence Assessments with reproducible counts, weighted-error rate,
  evidence sufficiency, tolerance signals, and governance routing.
- 34 retained negative cases, bringing the suite to 735 checks across 16
  positive package types.

## Boundary

Weights are policy-local governance priorities. They are not money, objective
harm magnitude, cross-policy utility, quality, or automatic authority. The
verifier proves declared references, classifications, and arithmetic only.

## Verify

```sh
node tools/qif.mjs calibration-report
npm test
```
