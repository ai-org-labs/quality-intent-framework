# QIF v0.6.23

QIF v0.6.23 adds `qif inventory`, a machine-readable structural inventory command for humans, AI agents, and eval harnesses.

## Added

- `node tools/qif.mjs inventory [package.json...]`
- `node tools/qif.mjs inventory --all`
- Package ids, package types, entity collection counts, entity counts, and outbound reference counts.
- Totals, warnings, cache metadata, and verifier-boundary language.
- `qif commands`, `qif status`, and `npm test` coverage for the new inventory surface.

## Boundary

`qif inventory` reports structural package contents only. It does not validate packages, prove semantic quality truth, prove package completeness, or prove evidence sufficiency.

## Verification

- `node tools/qif.mjs inventory --all`
- `node tools/qif.mjs commands`
- `node tools/qif.mjs status`
- `node tools/qif.mjs validate --all`
- `npm test`
