# QIF v0.6.13

QIF v0.6.13 adds the third CLI slice: open risk extraction.

## Added

- `qif open-risks [package.json...]` to list unresolved risk carriers in QIF packages.
- `qif open-risks --all` to inspect all committed example packages.
- JSON output for unresolved governance triggers, residual-risk carriers, and low-confidence entities.
- npm test integration for the open-risks command.

## Boundary

`qif open-risks` exposes structural risk carriers. It does not prove semantic risk truth, business priority, or remediation sufficiency.

## Verification

- `node tools/qif.mjs validate --all`
- `node tools/qif.mjs trace ACT-AQC-001 examples/action-quality-contract-package.json`
- `node tools/qif.mjs open-risks examples/review-run-package.json`
- `npm test`
