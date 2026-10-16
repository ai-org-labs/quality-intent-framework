# QIF v0.6.50 Durable Recovery State and Retry Side-Effect Safety

## Purpose

An interrupted agent or workflow can fail after changing files, sending a
message, updating a record, or calling another service. Restoring a snapshot
does not by itself establish that repeating the remaining work is safe.

This QIF capability records enough evidence to ask four plain questions:

```text
Is this the right saved state?
        |
Is this the right actor and authority?
        |
What already happened, what remains, and what is unknown?
        |
Can the unfinished part be retried without repeating harm?
```

## Entity Model

| Entity | Owns | Must not own |
| --- | --- | --- |
| `DurableRecoveryPolicy` | freshness boundary, retry budget, required checks, fail-closed rules | a decision that a specific retry is safe |
| `RecoveryStateSnapshot` | state artifact identity, capture/resume time, actor identity, effect-state partition, evidence | semantic proof that the saved state or external ledger is true |
| `RetryExecutionRecord` | idempotency key, attempt, completed-effect checks, proposed retry set, authority evidence | automatic retry authorization |
| `DurableRecoveryAssessment` | reproducible summaries, sufficiency, structural signal, governance refs | recovery-safety or quality verdict |

## Structural Rules

- Checkpoint age is reproduced from capture and resume-attempt timestamps.
- Freshness is reproduced against the policy boundary.
- Rehydration identity is reproduced by exact actor-reference equality.
- Completed, pending, and unknown effect sets are disjoint.
- Completed-effect checks exactly cover effects declared completed.
- Duplicate-effect risk is the intersection of completed and retried effects.
- Unknown effects remain unresolved and fail closed.
- Retry-budget status is reproduced from attempt number and policy maximum.
- Executed retries require resume-authority evidence.
- QIF never sets `automaticRetryDecision` or `qifResumedExecution` to true.

## Governance

The example routes unverified evidence, stale checkpoints, identity mismatch,
unknown effect state, duplicate side-effect risk, retry-budget excess, and
insufficient assessment evidence to accountable owners. A verifier pass proves
declared structure and calculations only. It does not prove state truth,
effect completion, idempotency of a real service, recovery safety, quality,
authorization, or authority.

## Current Evidence

The committed package is intentionally `example-only`. It demonstrates a
stale checkpoint, changed actor identity, unknown effect, completed effect in
the retry set, and exceeded retry budget. It is a teaching and verifier case,
not evidence about a production recovery.
