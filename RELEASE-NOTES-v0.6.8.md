# QIF v0.6.8

QIF v0.6.8 hardens Action Quality Contract with Context Memory Boundary.

## Added

- `contextMemoryBoundaries` in action-quality-contract packages.
- `contextMemoryEvidence` records for session history, local runtime context, agent memory, and LLM-visible context.
- Verifier rules for freshness, source trust, compaction handling, contamination checks, governance routing, and accepted-outcome blocking when stale or untrusted context influenced a decision.

## Verification

- `npm test`
- AOF runtime log updated with source check, Need / Intent / Context, council judgment, verifier boundary, and release outcome.

## Boundary

The verifier proves context/memory structure and traceability. It does not prove that remembered context is semantically correct, complete, or safe to trust.
