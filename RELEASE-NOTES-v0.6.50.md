# QIF v0.6.50

QIF v0.6.50 makes durable recovery state and retry side-effect safety executable.

- Adds policies for checkpoint freshness, retry budgets, completed-effect checks, idempotency, actor identity, resume authority, and fail-closed unknown effects.
- Adds recovery snapshots that separate completed, pending, and unknown external effects.
- Adds retry records that reproduce completed-effect coverage, duplicate-effect risk, retry-budget status, and authority evidence.
- Adds durable recovery assessments and governance for stale state, identity mismatch, unknown effects, duplicate effects, exceeded budgets, and insufficient evidence.
- Explicitly rejects snapshot presence, retry counts, idempotency-key presence, and recorded effect state as proof of state truth, recovery safety, quality, authorization, or authority.

The committed package is illustrative. It demonstrates the runtime without
claiming real state truth, effect completion, idempotency, recovery safety, or
operational authority.
