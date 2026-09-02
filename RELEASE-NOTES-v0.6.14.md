# QIF v0.6.14

QIF v0.6.14 adds the fourth CLI slice: starter package generation.

## Added

- `qif new <package-type>` to emit a validated starter package from committed examples.
- `qif new <package-type> --out <file>` to write the starter package with overwrite protection.
- npm test integration for the new command.

## Boundary

`qif new` emits a validated starter shape. Users or AI agents must still replace sample content, preserve intent/evidence traceability, and run `qif validate` before relying on the package.

## Verification

- `node tools/qif.mjs validate --all`
- `node tools/qif.mjs new review-run`
- `node tools/qif.mjs trace ACT-AQC-001 examples/action-quality-contract-package.json`
- `node tools/qif.mjs open-risks examples/review-run-package.json`
- `npm test`
