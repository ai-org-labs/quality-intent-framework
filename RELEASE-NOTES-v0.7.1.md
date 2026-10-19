# QIF v0.7.1

QIF v0.7.1 adds an executable Outcome Collection Ledger for preserving how
empirical outcome evidence changes over time.

## Added

- `OutcomeCollectionPolicy`
- `OutcomeObservationRevision`
- `OutcomeSourceCorrection`
- `OutcomeCustodyEvent`
- `OutcomeLedgerAssessment`
- 21 retained negative fixtures for temporal lineage and custody rules

## Behavior

Outcome records are append-only. Revisions must form a contiguous supersession
chain, source corrections preserve before/after digests, custody events form a
declared sequence, late arrival is reproduced from timestamps, and the current
snapshot must match the latest revision.

The example advances the pilot to example-only `collecting` but does not invent
a completed operational outcome. Verifier success proves structural integrity,
not source truth, custody authenticity, causality, calibration, quality,
authorization, or authority.
