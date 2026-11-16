# QIF v0.8.15 Cross-Client Portability Evidence Intake

## Purpose

QIF v0.8.15 makes cross-client evidence intake explicit before a portability
corpus can be called ready. It extends the v0.8.14 matched-run protocol with:

```text
Client export -> Evidence Source -> Execution Attestation
                                      |
Custody Events -----------------------+
                                      v
                              Import Decision
                                      |
                                      v
                           Corpus Readiness Review
```

Each run must resolve to a source, declared executor and environment, exact
Skill/input/transcript digests, custody history, and reviewer attestation.
Digest alignment, custody closure, review state, conflicts, stale sources,
accepted pair count, and declared independence groups are reproducible.

## Readiness Boundary

`ready-for-external-review` means only that the declared package satisfies the
local intake policy. It does not prove source authenticity, actual client
independence, execution truth, Skill causality, semantic quality, safety, or
authority. Example-only, unreviewed, conflicted, stale, or custody-incomplete
evidence must remain `governance-required`.

The committed example intentionally demonstrates the blocked path. It contains
illustrative sources and unreviewed attestations, so its corpus is not ready.

## Research Direction

Current research treats Skills as dependency-bearing supply-chain artifacts,
recommends typed manifests and lockfile-like records, and separates identity or
lineage signals from behavioral and safety verdicts. Multi-trace work likewise
shows that provenance can span expression, implementation, and operational
structure. These findings motivate v0.8.16 dependency and Skill identity work.

Sources: [Agent Skill supply chains](https://arxiv.org/abs/2607.01136),
[per-component Skill identity](https://arxiv.org/abs/2606.31272),
[SkillTrace provenance auditing](https://arxiv.org/abs/2608.05204), and
[Agentic Skill evaluation](https://arxiv.org/abs/2606.17819).
