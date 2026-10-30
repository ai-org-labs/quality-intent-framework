# QIF v0.8.7: Trust Policy Activation and Rollback

## Purpose

A complete preview is evidence for a decision. It is not the decision, and the
decision is not proof that activation happened safely. v0.8.7 keeps those
steps separate and traceable.

```text
Sufficient rollout preview
          |
          v
Accountable activation decision
          |
          v
Bounded observation window
     | pass       | missing       | stop failure
     v            v               v
  continue       hold       rollback required
                                    |
                                    v
                         rollback record + evidence
```

## Activation Decision

`PortableKnowledgeActivationDecision` binds one decision to the exact rollout
preview, baseline policy, proposed policy, and frozen scope digest. An
authorization requires a complete and sufficient preview, a named accountable
decision maker, an authority basis, an observation record, a baseline rollback
target, and a future rollback deadline.

A material outcome change must be acknowledged and governed. The record says
what was authorized; it does not execute a policy change.

## Observation

`PortableKnowledgePolicyObservation` defines a bounded time window and one or
more evidence-bearing signals. Each signal says what was expected, what was
observed, whether evidence exists, and whether failure is a stop condition.

The verifier reproduces three outcomes:

- `continue` when evidence is complete and no stop condition failed;
- `hold` when required observation evidence is missing; or
- `rollback-required` when a stop-on-failure signal fails.

No signal count becomes quality, and no result continues a rollout
automatically.

## Rollback Record

`PortableKnowledgeRollbackRecord` links the same activation and observation
chain to the proposed policy, baseline target, accountable initiator, deadline,
execution state, evidence, residual risk, and governance.

A planned, executing, or failed rollback remains incomplete. A completed
rollback must include completion time and execution evidence. Neither state
erases the preview, decision, observation, or prior policy history.

## Trend Basis

Current agent-governance guidance is converging on deployment-level
authorization, continuous evaluation, canary stages, human intervention,
circuit breakers, and rollback. QIF moves one step earlier: it makes the
authority, observation, stop, and recovery chain portable and auditable before
those controls are bound to any particular runtime.

## Verifier Boundary

The verifier proves declared reference integrity, preview sufficiency,
authority traceability, frozen-scope agreement, bounded observation arithmetic,
stop-condition reproduction, rollback linkage, evidence requirements, and
governance routing. It does not prove that authorization was wise, activation
occurred, signals were truthful, continuation is safe, rollback succeeded in
the real environment, or the policy is semantically fit.
