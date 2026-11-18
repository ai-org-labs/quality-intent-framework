# QIF v0.8.17 Skill Dependency Change Impact and Quarantine

## Purpose

Two dependency manifests can each be structurally valid while the transition
between them introduces a material risk. v0.8.17 makes that transition an
explicit review object.

It answers:

1. Which nodes, edges, locks, and risks were added, removed, or changed?
2. Which upstream dependents inherit exposure from the changed subjects?
3. Which loss boundaries could the blast radius cross?
4. Does the transition need a quarantine candidate and governance review?
5. Who made the decision, using what evidence, and what remains unproven?

## Flow

```text
Baseline Manifest Snapshot
          |
          v
Candidate Manifest Snapshot
          |
          v
Dependency Change Set
  - node / edge / lock / risk delta
  - material and unresolved changes
          |
          v
Change Impact Assessment
  - direct subjects
  - upstream blast radius
  - affected loss boundaries
          |
          v
Quarantine Candidate
          |
          v
Accountable Quarantine Decision
```

The verifier reproduces the delta from the two snapshots. Edges point from a
dependent to its dependency, so blast-radius traversal follows the reverse
direction. Both baseline and candidate edges participate so removal cannot
erase historical exposure.

## Fail-Closed Rules

A material change, unresolved required dependency, or non-verified transition
evidence requires `governance-required` status and a quarantine candidate.
Examples of material changes include a required dependency or edge addition,
node identity change, lock change, or new open risk.

The committed example adds a required remote tool and open provenance risk.
Its evidence is example-only, so the accountable decision is `defer`.

## Authority Boundary

`hold-for-review` is a proposal, not an enforcement action. QIF does not
install, remove, disable, isolate, allow, or deny a dependency. It does not
prove exploitability, safety, source authenticity, containment effectiveness,
live runtime state, permission, or authority. Those require independent
security and behavioral evidence plus an accountable operational system.

## Use

```bash
node tools/qif.mjs validate examples/skill-supply-chain-package.json
node tools/validate-skill-supply-chain.mjs my-package.json
```
