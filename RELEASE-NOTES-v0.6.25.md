# QIF v0.6.25

QIF v0.6.25 adds `qif evaluator-packet`, a machine-readable handoff packet for independent evaluators, AI agents, and audit harnesses.

## Added

- `node tools/qif.mjs evaluator-packet`
- `node tools/qif.mjs evaluator-packet --release-gate examples/quality-gate-package.json`
- Scope, freshness, required commands, command surface summary, package type summary, inventory summary, status summary, review-plan summary, release-ready summary, open-risk summary, evidence refs, evaluator guidance, and trust boundaries.
- `qif commands` and `npm test` coverage for the new evaluator-packet surface.

## Boundary

`qif evaluator-packet` packages structural evidence for evaluation handoff only. It does not prove semantic quality truth, independent evaluator approval, business approval correctness, operational safety, or risk acceptability.

## Verification

- `node tools/qif.mjs evaluator-packet`
- `node tools/qif.mjs commands`
- `node tools/qif.mjs status`
- `node tools/qif.mjs validate --all`
- `npm test`
