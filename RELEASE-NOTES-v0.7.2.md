# QIF v0.7.2

QIF v0.7.2 adds executable Missingness and Attrition Sensitivity so an
empirical calibration claim cannot silently discard unavailable outcomes.

## Added

- `MissingnessPolicy`
- `OutcomeDisposition`
- `MissingnessSensitivityAnalysis`
- `MissingnessAssessment`
- 20 retained negative fixtures for eligibility, disposition, arithmetic,
  sensitivity, governance, and verifier-boundary rules

## Behavior

Every prospectively eligible enrollment must be classified exactly once as
observed, missing, excluded, withdrawn, delayed, or untraceable. The verifier
reproduces observation coverage, observed success rate, best-case and
worst-case binary success bounds, threshold decisions, and conclusion
sensitivity.

The example has no completed empirical outcome and remains example-only,
collecting, insufficient, and governed. Verifier success proves structural
integrity and reproducible arithmetic, not missingness mechanism,
representativeness, causality, statistical validity, calibration truth,
quality, authorization, or authority.
