# QIF v0.6.51 Recovery Observation Windows and Delayed Side-Effect Reconciliation

## Purpose

A stopped, failed, or retried workflow can keep producing effects after its
immediate result is recorded. One clean check is therefore not enough to show
that recovery is finished.

This capability records a simple sequence:

```text
Saved effect state
        |
Observation window
        |
Several timestamped observations
        |
Delayed-effect reconciliation
        |
Accountable review or blocked closure
```

## Entity Model

| Entity | Owns | Must not own |
| --- | --- | --- |
| `RecoveryObservationPolicy` | minimum time and observations, reconciliation and fail-closed rules | a universal claim that the chosen window is sufficient |
| `RecoveryObservationWindow` | planned and actual time boundary, monitored effects, linked observations | authority to stop observing or close recovery |
| `EffectObservation` | timestamped externalized state for every monitored effect | inferred hidden state or semantic proof that an external system is truthful |
| `DelayedEffectReconciliation` | initial open effects, delayed completion, unresolved state, terminal-state conflicts, closure eligibility | retry, compensation, or recovery-closure authority |
| `RecoveryObservationAssessment` | reproducible counts, sufficiency, structural signal, governance refs | a quality or operational-safety verdict |

## Structural Rules

- Planned and actual durations reproduce from timestamps.
- Window sufficiency requires both reviewed duration and observation count.
- Window observations exactly match linked `EffectObservation` records.
- Observation sequence is contiguous, chronological, and covers every effect
  declared by the recovery snapshot.
- Initial open effects reproduce from snapshot `pending` and `unknown` sets.
- A delayed completed effect was open initially and appears as `completed` in
  a later observation.
- The final observation determines which initial effects remain unresolved.
- A terminal-state conflict occurs when an effect observed as `completed` or
  `failed` later changes to a different state.
- Closure remains blocked unless the window is sufficient, all evidence is
  verified, and no unresolved or conflicting effects remain.
- Even an eligible record requires accountable operational review. QIF never
  closes recovery or decides compensation.

## Plain-Language Review

Ask these questions in order:

1. How long could an already-started action take to become visible?
2. Which effects must we watch, including those believed complete?
3. What did each external system show at each observation time?
4. Did anything appear later than expected?
5. Is anything still pending, absent, unknown, or contradictory?
6. Who has authority to decide that observation can end?

The number of observations and waiting time are evidence. They are not quality.

## Governance

The example routes example-only evidence, a short observation window, a
delayed rollback completion, an unresolved audit effect, and insufficient
assessment evidence to accountable owners. A verifier pass proves declared
structure and calculations only. It does not prove effect truth, observation
completeness, causality, recovery safety, quality, closure authorization, or
authority.

## Current Evidence

The committed package is intentionally `example-only`. It shows three
observations over 25 minutes against a reviewed 30-minute boundary. The
rollback effect completes after the first observation, while the audit effect
remains unresolved. Recovery closure therefore stays blocked.
