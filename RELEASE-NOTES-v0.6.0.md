# QIF v0.6.0

QIF v0.6.0 adds Action Quality Contract, the first v0.6 AI-native enforcement runtime.

## Added

- New `action-quality-contract` package type.
- Schema: `schemas/action-quality-contract-package.schema.json`.
- Example: `examples/action-quality-contract-package.json`.
- Verifier: `tools/validate-action-quality-contract.mjs`.
- Retained negative fixtures generated from `tools/fixtures/action-quality-contract-cases.mjs`.
- Documentation: `docs/qif-v0.6.0-action-quality-contract.md`.

## Why

AI agents increasingly execute actions through shells, browsers, computer-use tools, MCP servers, hosted tools, and subagents. QIF now records the provider-neutral quality boundary around those actions:

- tool surface;
- execution environment;
- permission policy;
- approval gate;
- expected state transition;
- rollback plan;
- evidence requirement;
- runtime trace;
- action outcome;
- governance trigger.

## Verification

- `npm test` covers the new verifier and retained fixture suite.
- The verifier checks structure, traceability, approval, rollback, evidence, trace, and outcome consistency.
- It does not claim semantic truth or tool execution safety.
