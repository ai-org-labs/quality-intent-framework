# QIF v0.8.5: Trust Policy Rotation and Historical Replay

## Purpose

Trust policy changes. Roots rotate, identities move, predicates are tightened,
and evidence requirements evolve. v0.8.5 preserves what policy was in force
when a decision was made and shows what a later policy would decide from the
same recorded inputs.

```text
Original policy + frozen attestation -> original decision (unchanged)
                         |
                         v
                later policy revision
                         |
                         v
                  historical replay
                         |
          unchanged / tightened / relaxed / indeterminate
                         |
               changed or weak -> governance
```

## Policy Lineage

Each `PortableKnowledgeTrustPolicy` records its revision kind, reason,
effective boundary, predecessor or successor, and lifecycle status. The
verifier requires one initial revision, one active revision, bidirectional
succession, and contiguous effective boundaries.

## Historical Replay

`PortableKnowledgeTrustReplay` owns:

- the original decision, policy, value, and evaluation time;
- the later policy revision and replay time;
- the same item and attestation references;
- reproduced policy checks and replay decision;
- outcome delta and material-change state;
- governance references and explicit non-authority boundaries.

The example replays a v1 decision under v2 after a recorded trust-root
rotation. The frozen attestation still names v1, so the result changes from
`policy-conformant-candidate` to `governance-required`. The original decision
remains intact.

## Verifier Boundary

The verifier proves declared lineage, frozen-input equality, deterministic
policy checks, outcome-delta classification, and required governance routing.
It does not perform key rotation, retrieve roots, verify signatures live,
prove the historical evidence authentic, authorize present use, activate
knowledge, grant authority, or establish semantic quality.
