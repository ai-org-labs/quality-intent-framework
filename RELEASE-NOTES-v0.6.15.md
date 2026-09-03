# QIF v0.6.15

QIF v0.6.15 adds a local release-ready reference hook.

## Added

- `tools/qif-release-ready-hook.mjs <quality-gate-package.json>`.
- The hook runs QIF validation before checking release readiness.
- The hook requires a quality-gate package and at least one Go or Conditional Go quality-gate decision.
- Conditional Go requires conditions, approval owner, rollback plan, monitoring plan, gate rules, and intent verdicts.
- npm test integration for the hook.

## Boundary

The hook checks structural release readiness only. It does not prove semantic quality truth, business approval correctness, or operational safety.

## Verification

- `node tools/qif-release-ready-hook.mjs examples/quality-gate-package.json`
- `node tools/qif-release-ready-hook.mjs examples/review-run-package.json` fails closed as expected
- `node tools/qif.mjs validate --all`
- `npm test`
