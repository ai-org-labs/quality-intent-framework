# QIF v0.6.12

QIF v0.6.12 adds the second CLI slice: trace inspection.

## Added

- `qif trace <entity-id> [package.json...]` to find matching entities in QIF packages.
- `qif trace <entity-id> --all` to inspect all committed example packages.
- JSON trace output with matching entity data, outbound references, and inbound references.
- npm test integration for the trace command.

## Boundary

`qif trace` exposes structural reference visibility. It does not prove semantic quality truth, evidence correctness, or organizational acceptance.

## Verification

- `node tools/qif.mjs validate --all`
- `node tools/qif.mjs trace ACT-AQC-001 examples/action-quality-contract-package.json`
- `npm test`
