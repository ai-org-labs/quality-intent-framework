# QIF v0.6.19

## Commands Manifest CLI

QIF v0.6.19 adds a machine-readable command manifest:

```sh
node tools/qif.mjs commands
```

The command lists each canonical QIF CLI entrypoint with:

- purpose
- usage
- argument shape
- blocking behavior
- output description
- verifier boundary

This helps humans, AI agents, and harnesses discover how to operate QIF without relying on prose-only documentation or internal script names.

## Verification

- `node tools/qif.mjs commands`
- `node tools/qif.mjs doctor`
- `node tools/qif.mjs validate --all`
- `npm test`

## Boundary

`qif commands` describes available local command surfaces only. It does not execute validation, prove repository health, prove semantic quality truth, or authorize release.
