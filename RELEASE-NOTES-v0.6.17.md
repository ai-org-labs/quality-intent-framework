# QIF v0.6.17

## Release Ready CLI Command

QIF v0.6.17 exposes the release-ready gate through the canonical local CLI:

```sh
node tools/qif.mjs release-ready examples/quality-gate-package.json
```

This keeps the internal hook script available while giving humans and AI agents a stable QIF command surface for release gating.

## Verification

- `node tools/qif.mjs release-ready examples/quality-gate-package.json`
- `node tools/check-release-ready-hook-fixtures.mjs`
- `node tools/qif.mjs validate --all`
- `npm test`

## Boundary

`qif release-ready` checks structural gate readiness only. It does not prove semantic quality truth, business approval correctness, or operational safety.
