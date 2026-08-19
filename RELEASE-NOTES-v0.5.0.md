# QIF v0.5.0

QIF v0.5.0 introduces the first executable Living QIF Ledger baseline.

The ledger is the cross-package layer that preserves quality knowledge across
discovery, review, gate decisions, incidents, improvements, and agent outcomes.

## Added

- `schemas/qif-ledger-package.schema.json`
- `examples/qif-ledger-package.json`
- `tools/validate-qif-ledger.mjs`
- `tools/fixtures/qif-ledger-cases.mjs`
- `tests/fixtures/qif-ledger/`
- `docs/qif-v0.5-living-ledger.md`

## Runtime Behavior

The ledger verifier checks:

- repository-local package refs resolve
- referenced package types match declarations
- cross-package entity refs resolve, including nested post-release incidents
- Quality Intent lifecycle records cite evidence
- missed-intent records close to a new derivation or accepted-gap rationale
- agent trials link target, review run, tool/action provenance, outcome, and evidence
- ledger indexes resolve active intents, open governance triggers, and residual-risk carriers
- verifier boundary explicitly avoids claiming semantic truth

## Verification

- `npm test`
- `node tools/validate-qif-ledger.mjs examples/qif-ledger-package.json`
- `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.5.0.json`
- AOF v11.7.0 `situation-assess`
- AOF v11.7.0 `organization-verify`
- AOF v11.7.0 `command-routing-audit`
- AOF v11.7.0 `review-provenance-audit`

## Boundary

v0.5.0 is intentionally narrow. It proves cross-package traceability mechanics
with local package files. It does not add a full CLI query engine, a remote
package registry, semantic validation, or empirical calibration.
