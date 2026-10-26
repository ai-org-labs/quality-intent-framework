# QIF v0.8.3: Portable Knowledge Supply-Chain Revocation

## Purpose

QIF can import and locally test reusable quality knowledge. v0.8.3 adds the
missing response path for knowledge that is later disputed, compromised,
superseded, stale, withdrawn, or invalidated. The response is fail-closed:
affected reuse is suspended while the original records remain auditable.

```text
Revocation notice
       |
       v
Exact source subject -> affected portable item
                               |
                               v
                    dependency graph traversal
                     /                    \
             direct dependents      transitive dependents
                     \                    /
                      v                  v
                    impact assessment -> revalidation decision
                                             |
                                             v
                           suspend, reject, or governed revalidation
```

## Entities

| Entity | Owns | Must not own |
| --- | --- | --- |
| `PortableKnowledgeRevocationPolicy` | Accepted notice states, exact subject kinds, closure and fail-closed rules | Source authenticity or decision authority |
| `PortableKnowledgeRevocationNotice` | Subject, reason, time, evidence, issuer trust, replacement hint | Proof that compromise really occurred |
| `PortableKnowledgeDependencyEdge` | One evidence-backed dependency between portable and local records | A semantic claim that the dependency is correct |
| `PortableKnowledgeRevocationImpactAssessment` | Reproducible direct/transitive closure, unresolved refs, suspension effect | Destructive deletion or silent mutation |
| `PortableKnowledgeRevalidationDecision` | Accountable local use status and replacement evidence | Automatic reactivation or authority |

## Runtime Rules

1. Match the notice to an exact library, item, digest, evidence origin, or
   publisher. An item notice also reproduces its source digest.
2. Resolve current dependency edges from affected items into applicability,
   reproduction, and eligibility records.
3. Reproduce affected items, direct dependents, transitive dependents, edge
   coverage, and counts. Unknown impact fails closed and routes governance.
4. An active or disputed notice suspends reuse even when issuer trust is not
   yet verified. Unverified notices are not declared authentic; they are both
   quarantined and governed.
5. Revalidation requires a trusted replacement item, replacement evidence,
   complete impact traversal, and accountable review. It never activates
   knowledge automatically.
6. Preserve all prior records. Revocation changes local reuse status, not
   history.

## Verifier Boundary

The verifier proves reference resolution, digest equality, graph closure,
set/count reproduction, fail-closed status, evidence presence, governance
routing, and non-destructive history preservation. It does not prove notice
authenticity, compromise truth, source safety, semantic fitness, authorization,
or authority.

## Example

`examples/qif-ledger-package.json` contains an active, unverified pilot notice
for `PKI-001`. Four dependency edges show two direct local dependents and one
transitive assessment. The impact is suspended, history is preserved, and
revalidation remains blocked because no trusted replacement evidence exists.
