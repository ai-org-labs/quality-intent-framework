# QIF v0.6.22

## Summary

QIF v0.6.22 adds explicit cache metadata to the machine-readable discovery
surfaces used by humans, AI agents, and harnesses.

This aligns QIF with stateless agent and MCP-style clients that benefit from
freshness hints, private cache scope, and clear invalidation boundaries.

## Added

- `cache` metadata on `node tools/qif.mjs commands`
- `cache` metadata on `node tools/qif.mjs package-types`
- `cache` metadata on `node tools/qif.mjs status`

The cache metadata includes:

- `ttlMs`
- `cacheScope`
- `generatedAt`
- `invalidatedBy`
- `rationale`
- `verifierBoundary`

## Verification

- `node tools/qif.mjs commands`
- `node tools/qif.mjs package-types`
- `node tools/qif.mjs status`
- `node tools/qif.mjs doctor`
- `node tools/qif.mjs validate --all`
- `npm test`

## Boundary

Cache metadata is a freshness hint only. Cached QIF discovery output does not
prove semantic quality truth, business approval correctness, operational
safety, or authorization to act.
