# QIF v0.5.2

QIF v0.5.2 adds the first executable World Model Calibration baseline.

v0.5.1 made conceptual-modeling gaps specific. v0.5.2 adds a way to test
whether AI-generated World Model Gap Findings agree with expert judgment on
unseen cases.

## Added

- `world-model-calibration` package type.
- `schemas/world-model-calibration-package.schema.json`.
- `examples/world-model-calibration-package.json`.
- `tools/validate-world-model-calibration.mjs`.
- `tools/fixtures/world-model-calibration-cases.mjs`.
- Retained negative fixtures under `tests/fixtures/world-model-calibration/`.
- `docs/qif-v0.5.2-world-model-calibration.md`.

## Updated

- `npm test` now runs the World Model Calibration verifier.
- The retained fixture suite now covers 10 positive checks and 433 negative checks.
- The Living QIF Ledger example can reference World Model Calibration packages, calibration runs, and calibration governance triggers.
- README, roadmap, AI authoring guide, changelog, and Living Ledger docs now describe World Model Calibration.

## Verifier Boundary

The verifier checks package references, case coverage, expert/agent assessment
coverage, finding match coverage, agreement score reproduction, false-positive
and false-negative rate reproduction, threshold compliance, and governance
linkage.

It does not claim semantic truth, expert correctness, domain correctness, or
production readiness. Semantic validity still requires larger real-domain pilot
corpora, independent expert panel review, operational feedback, and governance
decisions.
