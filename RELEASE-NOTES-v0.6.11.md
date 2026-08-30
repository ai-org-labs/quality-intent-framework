# QIF v0.6.11

QIF v0.6.11 adds the first minimal `qif validate` CLI entrypoint.

## Added

- `tools/qif.mjs validate <package.json...>` routes package files to the correct local verifier.
- `tools/qif.mjs validate --all` validates all committed example packages.
- `tools/qif.mjs validate --fixtures` runs the retained negative fixture regression suite.
- `package.json` now exposes a `qif` bin entry and runs CLI validation in `npm test`.

## Boundary

The CLI is a local validation router. It does not replace the verifier boundary, does not claim semantic quality truth, and does not implement `qif new`, `qif trace`, or external integrations yet.

## Verification

Run:

```sh
node tools/qif.mjs validate --all
node tools/qif.mjs validate --fixtures
npm test
```
