# QIF v0.8.5: Trust Policy Rotation and Historical Replay

QIF can now rotate local trust policy while preserving the exact policy and
decision that governed an earlier evaluation.

## Added

- Immutable trust-policy predecessor and successor lineage.
- Revision reasons, kinds, statuses, and contiguous effective boundaries.
- Frozen-input historical trust replay under a named later policy revision.
- Deterministic replay decisions, outcome deltas, material-change detection,
  and governance routing.
- Retained negative fixtures and portable AI guidance.

## Boundary

Historical replay is not live cryptographic verification and does not rewrite
the original decision. It does not activate knowledge or establish current
authorization, authority, safety, applicability, or semantic truth.
