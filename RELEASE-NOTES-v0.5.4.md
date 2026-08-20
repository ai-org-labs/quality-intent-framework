# QIF v0.5.4

QIF v0.5.4 adds the executable Guided Elicitation Runtime.

This release turns the recent Guided Elicitation design into a schema-backed, verifier-backed package type for helping users who do not know QIF terminology express candidate quality knowledge.

## Added

- `guided-elicitation` package type.
- Schema: `schemas/guided-elicitation-package.schema.json`.
- Example: `examples/guided-elicitation-package.json`.
- Verifier: `tools/validate-guided-elicitation.mjs`.
- Negative fixture source: `tools/fixtures/guided-elicitation-cases.mjs`.
- Retained negative fixture corpus: `tests/fixtures/guided-elicitation/`.
- Runtime documentation: `docs/qif-v0.5.4-guided-elicitation-runtime.md`.

## Verifier Coverage

The verifier checks language/profile metadata, plain-language explanations, anti-checklist question strategies, stepwise probes, optional scaffolds, raw answer preservation, clarification traceability, teach-back confirmation before finalization, low-confidence governance routing, and verifier-boundary honesty.

`npm test` now validates 12 positive packages and 468 retained negative fixtures.

## Boundary

Verifier success does not prove semantic truth, user consent, expert correctness, or that the best possible question was asked. It also explicitly rejects treating question count as quality.
