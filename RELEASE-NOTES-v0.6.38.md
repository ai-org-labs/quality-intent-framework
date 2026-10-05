# QIF v0.6.38: Route Policy Drift and Revalidation

QIF can now preserve the route policy that governed a decision, reproduce what
changed in a later policy version, identify affected decisions, and record
their revalidation without rewriting history.

## Added

- Immutable Route Policy Snapshots with explicit version and effective time.
- Reproducible Route Policy Changes across authority, capability, evidence,
  response time, route, and threshold dimensions.
- Decision-specific Route Policy Drift Assessments.
- Evidence-backed Revalidation Outcomes and aggregate Revalidation Assessments.
- Governance triggers and retained negative fixtures for policy lineage,
  staleness, unresolved review, and unverified evidence.

## Boundary

Policy age, change count, drift count, and revalidation volume are evidence,
not quality, safety, causality, or authority. Current policy does not
retroactively overwrite the authority or result of a historical decision.

## Verification

Release verification requires the full `npm test` suite, AOF v12.2.0
organization verification, direction, self-review, Council review,
retrospective evidence, residue scanning, and remote tag/release verification.
