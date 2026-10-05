# QIF v0.6.38 Route Policy Drift and Revalidation

## Why This Exists

A review decision may be correct under the policy used at the time and still
need another look after the policy changes. For example, the required reviewer,
evidence, response time, or risk threshold may change.

QIF must answer four plain questions:

1. Which policy version governed the original decision?
2. What exactly changed?
3. Which earlier decisions are affected?
4. What happened when those decisions were reviewed again?

## Simple Flow

```text
Old policy snapshot        New policy snapshot
        |                          |
        +------ exact change ------+
                       |
              affected decisions
                       |
          stale? -> revalidation
                       |
             evidence + outcome
                       |
                  governance
```

The old snapshot is never overwritten. A new policy can require revalidation,
but it does not retroactively become the authority for an earlier decision.

## Records

| Record | What it says | What it must not say |
| --- | --- | --- |
| Route Policy Snapshot | The exact routes, thresholds, evidence, capability, authority, and timing rules in force for one version. | That the policy was semantically correct. |
| Route Policy Change | The reproducible difference between two snapshots and who authorized it. | That a changed policy is automatically better. |
| Route Policy Drift Assessment | Which preserved decisions are affected, stale, and in need of revalidation. | That age or change count proves risk or quality. |
| Revalidation Outcome | The current reviewed route, authority, evidence, rationale, and unresolved state for one decision. | That the historical decision has been rewritten. |
| Revalidation Assessment | Whether required revalidations are complete and sufficiently verified. | That revalidation volume proves safety or authority. |

## Verifier Behavior

The local verifier can prove that references resolve, snapshot versions are
consistent, the current snapshot matches the declared policy, changes reproduce
snapshot differences, drift dimensions match the affected route, counts and
signals reproduce, and required governance triggers exist.

It cannot prove that the policy is wise, that the evidence is true, that a
change caused an outcome, or that a reviewer has legitimate real-world
authority. Those claims require expert review, observed outcomes, independent
evidence, and governance.

## Example Boundary

The committed package changes the authority and evidence required for the
human-review route. Its earlier decision becomes stale and is conditionally
revalidated under the current route. The evidence remains illustrative and
unverified, so governance stays open. This demonstrates the mechanism; it does
not claim operational safety or semantic quality.
