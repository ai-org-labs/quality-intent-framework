# QIF v0.8.17

QIF v0.8.17 makes changes between Agent Skill dependency manifests
reproducible and reviewable.

## Added

- Baseline and candidate manifest snapshots covering nodes, edges, locks, and
  risk state.
- Deterministic additions, removals, field changes, materiality, unresolved
  changes, and evidence-readiness reproduction.
- Direct and transitive upstream blast-radius assessment linked to explicit
  loss boundaries.
- Non-executing quarantine candidates and accountable quarantine decisions.
- Retained negative fixtures for chronology, delta arithmetic, graph impact,
  fail-closed routing, governance triggers, and authority boundaries.

## Boundary

A quarantine candidate does not disable, remove, install, isolate, allow, or
deny anything. Structural verification does not prove exploitability, safety,
authenticity, containment effectiveness, live runtime state, or authority.
