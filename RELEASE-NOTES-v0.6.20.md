# QIF v0.6.20

## Package Types Manifest CLI

QIF v0.6.20 adds a machine-readable package type catalog:

```sh
node tools/qif.mjs package-types
```

The command lists each supported package type with:

- purpose
- lifecycle role
- source template
- validator
- creation command
- validation command
- verifier boundary

This helps humans, AI agents, and harnesses choose the correct QIF package shape without relying on hidden conversation context or prose-only documentation.

## Verification

- `node tools/qif.mjs package-types`
- `node tools/qif.mjs commands`
- `node tools/qif.mjs doctor`
- `node tools/qif.mjs validate --all`
- `npm test`

## Boundary

`qif package-types` describes supported package shapes only. It does not validate concrete package content, prove semantic quality truth, or authorize release.
