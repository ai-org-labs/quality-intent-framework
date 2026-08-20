# QIF v0.5.1

QIF v0.5.1 adds the first executable World Model Review baseline.

This release lets QIF identify concrete conceptual-modeling gaps before AI or
humans rely on a quality verdict. A finding must say what exact concept,
boundary, actor, relationship, state, event, assumption, or coordinate axis is
missing, why that matters, which decisions are affected, what evidence supports
the finding, and what resolution work is required.

## Added

- `world-model-review` package type.
- `schemas/world-model-review-package.schema.json`.
- `examples/world-model-review-package.json`.
- `tools/validate-world-model-review.mjs`.
- `tools/fixtures/world-model-review-cases.mjs`.
- Retained negative fixtures under `tests/fixtures/world-model-review/`.
- `docs/qif-v0.5.1-world-model-review.md`.

## Updated

- `npm test` now runs the World Model Review verifier.
- The retained fixture suite now covers 9 positive checks and 412 negative checks.
- The Living QIF Ledger example can reference World Model Review packages and preserve the chain from a world-model gap to a candidate Quality Intent.
- README, roadmap, AI authoring guide, changelog, and Living Ledger docs now describe World Model Review.

## Verifier Boundary

The verifier checks structural integrity, references, finding specificity,
trust metadata, finding evidence metadata, and governance linkage.

It does not claim semantic truth, business correctness, or expert correctness.
Semantic validity still requires domain expert review, stakeholder confirmation,
operational feedback, and governance decisions.
