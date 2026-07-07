# QIF v0.4.0

QIF v0.4.0 introduces the first executable quality gate runtime baseline.

## Highlights

- Added a `quality-gate` package type for running QIF as a structural quality gate.
- Added `schemas/quality-gate-package.schema.json`.
- Added `examples/quality-gate-package.json` as a domain-general quality gate example.
- Extended `tools/validate-qif-runtime.mjs` with quality gate verifier rules.
- Added `tools/run-fixture-tests.mjs` and integrated the fixture suite into `npm test`.
- Added a retained negative fixture corpus under `tests/fixtures/quality-gate/`.
- Added `docs/qif-roadmap.md`.
- Updated README, AI authoring guidance, and v0.4 quality gate runtime requirements.

## Verifier Boundary

The v0.4.0 verifier checks structure, traceability, reference resolution, confidence reproducibility, and executable rule compliance.

Verifier success does not prove semantic quality truth. Semantic validity still requires expert review, empirical feedback, operational learning, and governance.

## Validation

Release validation:

- `npm test`
- QIF package validation passed.
- Expert judgment package validation passed.
- Runtime package validation passed.
- Quality gate fixture suite passed with 3 positive checks and 46 negative checks.

