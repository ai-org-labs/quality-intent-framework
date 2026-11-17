# QIF v0.8.16

QIF v0.8.16 adds an executable Skill supply-chain package for inspecting what
an Agent Skill is made of and what it depends on.

## Added

- Typed Skill components and dependency nodes for Skills, packages, runtimes,
  services, tools, and models.
- Dependency manifests, exact-version and digest lock records, graph cycle
  detection, unresolved and stale dependency checks.
- Direct and transitive upstream risk propagation with reproducible readiness
  and governance triggers.
- A schema, example package, local verifier, CLI integration, portable package
  integration, and 22 retained negative fixtures.

## Boundary

Identity, digest, lineage, and lock evidence do not prove source authenticity,
behavioral equivalence, dependency safety, Skill trustworthiness, permission,
or authority. The committed example remains `governance-required` because its
risk evidence is illustrative rather than independently verified.
