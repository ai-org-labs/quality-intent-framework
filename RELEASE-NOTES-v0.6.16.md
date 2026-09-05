# QIF v0.6.16

QIF v0.6.16 hardens the release-ready hook with executable fixture checks.

## Added

- `tools/check-release-ready-hook-fixtures.mjs`.
- Fixture coverage for both release-ready success and fail-closed behavior.
- npm test integration for the hook fixture runner.

## Boundary

The fixture runner verifies structural hook behavior. It does not prove semantic quality truth, business approval correctness, or operational safety.

## Verification

- `node tools/check-release-ready-hook-fixtures.mjs`
- `node tools/qif-release-ready-hook.mjs examples/quality-gate-package.json`
- `node tools/qif-release-ready-hook.mjs examples/review-run-package.json` fails closed as expected
- `node tools/qif.mjs validate --all`
- `npm test`
