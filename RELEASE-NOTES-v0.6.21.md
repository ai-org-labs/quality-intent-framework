# QIF v0.6.21

## Summary

QIF v0.6.21 adds `qif status`, a read-only current-state packet for humans,
AI agents, and harnesses that need to orient before acting in the repository.

## Added

- `node tools/qif.mjs status`
- Machine-readable aggregation of:
  - package version
  - command surface
  - supported package types
  - validation health
  - release-ready gate status
  - doctor result
  - open-risk summary
  - roadmap frontier
  - agentic AI trend rationale
  - next recommended action
  - verifier boundary

## Verification

- `node tools/qif.mjs status`
- `node tools/qif.mjs commands`
- `node tools/qif.mjs package-types`
- `node tools/qif.mjs doctor`
- `node tools/qif.mjs validate --all`
- `npm test`

## Boundary

`qif status` aggregates local structural evidence and roadmap context. It does
not prove semantic quality truth, business approval correctness, operational
safety, or future roadmap correctness.
