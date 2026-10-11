# QIF v0.6.45 Evaluator Signal Leakage

QIF can now test whether declared evaluator signals change externalized
behavior while keeping the case, evidence, affordances, and output contract
matched.

## Added

- Evaluator Signal Policy, Variant, Trial, and Assessment entities.
- Explicit signal dimensions for evaluation identity, grader preference,
  reward cues, deployment consequences, monitor presence, and stakeholder
  preference.
- Deterministic checks for matched-condition identity, behavior-change
  reproduction, evidence sufficiency, and governance routing.
- 20 retained negative fixtures for missing lineage, condition mismatch,
  hidden-reasoning collection, count mismatch, and missing governance.
- A future v0.6.46 roadmap slice for evaluation-to-deployment transfer and
  long-horizon drift.

## Boundaries

The committed trial is example-only. Signal exposure, stated explanation, and
behavior change do not prove belief, intent, deception, honesty, semantic
truth, quality, competence, selection, authorization, or authority.

## Verification

- `npm test`: 16/16 positive checks and 1,126/1,126 negative checks.
- Portable package: 49 source-mapped files, mutation-tested and checksumed.
- AOF runtime: v12.2.0.
