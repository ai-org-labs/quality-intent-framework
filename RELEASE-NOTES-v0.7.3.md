# QIF v0.7.3

QIF v0.7.3 adds an executable Cross-Domain Transportability Review so a quality
claim cannot silently move between domains because its score or wording looks
similar.

## Added

- `TransportabilityPolicy`
- `DomainTransportProfile`
- `DomainLocalCalibrationResult`
- `TransportabilityComparison`
- `TransportabilityAssessment`
- 21 retained negative fixtures for profile lineage, local-result separation,
  dimension coverage, transfer classification, governance, and semantic limits

## Behavior

Source and target calibration results remain separate. Ten dimensions compare
construct and stakeholder meaning, context, loss boundary, outcome, evidence,
observation window, threshold, confidence, and monitoring integrity.
Comparisons reproduce as `unsupported`, `unestablished`, or
`supported-for-declared-scope`.

The committed software-to-support example is explicitly unsupported and
contains no independently verified domain-local calibration evidence.
Verifier success proves structural integrity and reproducible classification,
not generalization, construct validity, representativeness, causality,
calibration truth, quality, selection, authorization, or authority.
