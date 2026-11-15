# QIF v0.8.14 Agent Skill Behavioral Portability

## Purpose

QIF v0.8.14 adds a provider-neutral protocol for asking a practical question:
does loading the QIF Agent Skill change observable quality-evaluation behavior
across more than one compatible client?

It compares a frozen task twice for each client: once without the Skill and
once with the same versioned Skill. The comparison covers discovery and
routing, quality-intent reasoning, evidence traceability, non-functional
coverage, world-model gaps, authority boundaries, and auditable output.

```text
Frozen case + client
        |
        +--> baseline run -----+
        |                       |--> matched comparison --> assessment
        +--> Skill-enabled run-+                            |
                                                            +--> governance
```

## Package

The `agent-skill-portability` package owns versioned Skill artifacts, declared
client profiles, frozen cases, observable criteria, matched runs, aggregate
assessments, and governance triggers. Use
`node tools/qif.mjs new agent-skill-portability` to create one and
`node tools/qif.mjs validate <file>` to verify it.

## Interpretation Boundary

The verifier proves reference resolution, criterion coverage, matched
configuration declarations, score arithmetic, threshold application, and
governance routing. It does not prove semantic truth, actual independence
beyond declared groups, model competence, output equivalence, Skill causality,
or approval and execution authority. The committed package is example-only;
its result is therefore `governance-required`, never a portability claim.

Recent primary research reports that cross-platform Skill portability remains
aspirational and identifies routing and platform-specific portability defects.
QIF therefore measures observable matched behavior while preserving evidence
and authority boundaries. Sources: [Agent Skills 2026](https://openreview.net/pdf?id=Er0p92BsmW),
[Skill reusability study](https://openreview.net/attachment?id=n0AIlfxDU0&name=pdf),
[Open Agent Specification](https://doi.org/10.1145/3786335.3813130), and
[cross-agent specification portability](https://arxiv.org/abs/2608.21208).
