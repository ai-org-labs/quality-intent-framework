# QIF v0.3.2

QIF v0.3.2 is an AI authoring usability patch.

It adds a first-read guide for AI agents that need to evaluate, author, or extend QIF artifacts while preserving QIF's core discipline: quality claims must be tied to Quality Intents, Loss Boundaries, Evidence, Verdicts, and Governance.

## Added

- Added `docs/AI_AUTHORING_GUIDE.md`.
- Added a recommended AI read order for QIF documents.
- Added required Need / Intent / Context framing before producing QIF artifacts.
- Added standard QIF thinking flows for:
  - general evaluation;
  - pre-implementation review;
  - expert judgment extraction.
- Added output contracts for:
  - QIF evaluation;
  - QIF check item definition;
  - QIF package or schema authoring.
- Added practical rules for:
  - evidence interpretation;
  - quantitative values as evidence metadata;
  - evidence independence;
  - negative acceptance;
  - verdict discipline;
  - governance triggers;
  - verifier boundaries;
  - domain-general terminology.

## Changed

- Updated `README.md` to list `docs/AI_AUTHORING_GUIDE.md` in the current baseline.
- Updated `CHANGELOG.md` for `v0.3.2`.

## Fixed

- None.

## Known Issues

- None.

## Verification

- `npm test`
- Public-readiness scan for local paths and legacy personal identifiers
- `git diff --check`

## Notes

This release does not add runtime schemas, verifier rules, UI, or external integrations.

QIF remains usable independently of AOF.
