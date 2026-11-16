# QIF v0.8.15

QIF v0.8.15 adds Cross-Client Portability Evidence Intake.

- Records evidence sources, execution attestations, custody events, import
  decisions, and corpus-readiness assessments.
- Reproduces digest alignment, custody closure, attestation review, conflicts,
  stale evidence, independent-group count, verified pairs, and readiness.
- Adds retained negative cases for every new evidence and governance boundary.
- Keeps the committed example `governance-required`; no external client run or
  source authenticity is fabricated.

Verification: `npm test`.
