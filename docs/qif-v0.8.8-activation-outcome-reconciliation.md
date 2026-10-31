# QIF v0.8.8: Activation Outcome Reconciliation and Policy Promotion

## Purpose

An authorization is not execution. A command success is not proof that the
intended policy became effective. A completed rollback label is not proof that
the prior state was restored. v0.8.8 makes these distinctions executable.

```text
Activation decision
        |
        v
Execution evidence --> declared state == observed state?
        |                         |
        | yes                     | no or unknown
        v                         v
Bounded observation          hold + governance
        |
        +--> continue --------------------> governed promotion decision
        |
        +--> rollback required
                    |
                    v
          rollback reconciliation
                    |
                    v
          recovery verification
             | verified     | failed/incomplete
             v              v
        retire candidate   failed recovery + governance
```

## Execution Reconciliation

`PortableKnowledgeExecutionReconciliation` binds an activation or rollback
record to the expected policy, frozen scope digest, observed policy, observed
scope, execution evidence, and accountable reconciler. The verifier reproduces
`matched`, `mismatch`, or `unverified` from those fields.

An execution is not matched merely because a command returned successfully.
Evidence must exist and both policy and scope state must agree with the
declared action. Missing evidence or state mismatch fails closed to governance.

## Recovery Verification

`PortableKnowledgeRecoveryVerification` connects a completed rollback to its
rollback execution reconciliation and evidence-bearing effect checks. It
reproduces `verified`, `failed`, or `incomplete` recovery while retaining
residual effects explicitly.

Verified recovery means the declared checks and restored policy state are
internally consistent. It does not prove that every delayed side effect was
observed or that the provider evidence is authentic.

## Policy Promotion Decision

`PortableKnowledgePromotionDecision` combines activation execution,
observation, rollback, and recovery evidence into one accountable disposition:

- `promote` when activation matched and complete observation says continue;
- `hold` when required execution or observation evidence is incomplete;
- `retire` when rollback was required and recovery was verified; or
- `failed-recovery` when rollback was required but recovery was not verified.

The decision preserves predecessor state and does not execute promotion. A
named decision maker and authority basis remain mandatory.

## Trend Basis

Production agent governance is separating shadow or evaluate-only mode from
enforcement, requiring explicit promotion criteria, recording deployment
outcomes, and testing rollback confirmation. QIF moves one step ahead by making
the declared-action to observed-state to governed-disposition chain portable
across providers before any deployment adapter is trusted.

## Verifier Boundary

The verifier proves reference integrity, expected-versus-observed state
arithmetic, evidence presence, recovery-check completeness, deterministic
disposition, history preservation, and governance routing. It does not prove
provider authenticity, complete side-effect recovery, operational safety,
semantic fitness, or authority to deploy or promote a policy.
