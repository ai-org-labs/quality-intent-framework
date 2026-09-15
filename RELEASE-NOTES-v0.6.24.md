# QIF v0.6.24

QIF v0.6.24 adds `qif review-plan`, a machine-readable structural review planning command for humans, independent reviewers, AI agents, and eval harnesses.

## Added

- `node tools/qif.mjs review-plan`
- `node tools/qif.mjs review-plan --release-gate examples/quality-gate-package.json`
- Required structural checks for validation, retained fixtures, release readiness, inventory visibility, and open-risk visibility.
- Evidence refs, unresolved governance prompts, low-confidence prompts, release disposition, source signal summaries, cache metadata, and verifier-boundary language.
- `qif commands` and `npm test` coverage for the new review-plan surface.

## Boundary

`qif review-plan` organizes structural review work only. It does not prove semantic quality truth, independent reviewer agreement, business approval correctness, operational safety, or whether an unresolved risk is acceptable.

## Verification

- `node tools/qif.mjs review-plan`
- `node tools/qif.mjs commands`
- `node tools/qif.mjs status`
- `node tools/qif.mjs validate --all`
- `npm test`
