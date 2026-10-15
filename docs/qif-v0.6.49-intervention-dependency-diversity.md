# QIF v0.6.49: Intervention Dependency Diversity and Correlated Recovery Risk

## Plain-language purpose

Two recovery routes are not truly separate merely because they have different
names, agents, or vendors. They may still depend on the same model, account,
queue, data source, network, operator, or procedure. If that shared part fails,
both routes can fail together.

QIF v0.6.49 makes those dependencies visible and checkable. It does not choose
or activate a recovery route.

```text
Primary path  ----> shared model ----X
                         |
Fallback path -----------+----------> also fails

Different path names do not prove independent recovery.
```

## Quality intent

An organization must not rely on a fallback that shares the cause or critical
dependency that disabled the primary path unless that exposure is explicit,
evidence-backed, and accepted through governance.

## Records

| Record | What it owns | What it does not own |
| --- | --- | --- |
| `DependencyDiversityPolicy` | Minimum path and verified-independence requirements, shared-critical-dependency limit, evidence and fail-closed rules | Which route operators should choose |
| `RecoveryDependencyGraph` | Dependency nodes, path-to-dependency edges, overlap, common causes, and independence evidence | Proof that real systems are independent |
| `RecoveryPathTrial` | Required prerequisites, observed switch, authority evidence, shared failure, and observed recovery | Automatic failover or recovery authority |
| `CorrelatedRecoveryAssessment` | Reproducible aggregate counts, sufficiency, signal, and governance routing | Causal truth, recovery effectiveness, or systemic safety |

## Executable flow

```text
reviewed policy
      |
      v
dependency graph ---> shared critical dependency?
      |                         |
      v                         v
failover trial            governance
      |
      v
correlated recovery assessment ---> accountable decision
```

The verifier recalculates path membership from dependency edges, shared
dependencies from path overlap, critical overlap from node classification,
verified independent paths from evidence-backed claims, prerequisite results,
failover results, aggregate counts, sufficiency, and required governance.

## Governance triggers

Governance is required when dependency or trial evidence is not verified, a
critical dependency is shared beyond policy, independence is unverified, a
fallback prerequisite fails, a switch cannot be executed, or the assessment
lacks sufficient verified evidence.

## Permanent boundary

Path count, vendor count, agent count, dependency diversity, test count,
failover execution, and absence of an observed shared failure are evidence.
They are not quality, independence, causality, recovery effectiveness, safety,
authorization, or authority.
