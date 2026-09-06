# QIF v0.6.18

## Doctor CLI

QIF v0.6.18 adds a one-command structural health check:

```sh
node tools/qif.mjs doctor
```

The doctor command runs:

- `qif validate --all`
- `qif validate --fixtures`
- `qif release-ready <quality-gate-package.json>`
- `qif open-risks --all`

Use a specific release gate package with:

```sh
node tools/qif.mjs doctor --release-gate examples/quality-gate-package.json
```

## Verification

- `node tools/qif.mjs doctor`
- `node tools/qif.mjs release-ready examples/quality-gate-package.json`
- `node tools/qif.mjs validate --all`
- `npm test`

## Boundary

`qif doctor` aggregates structural QIF checks only. It does not prove semantic quality truth, business approval correctness, operational safety, or risk remediation sufficiency.
