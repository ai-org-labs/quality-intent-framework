# QIF v0.6.1

QIF v0.6.1 adds the Authoring Template Runtime.

This release makes AI-assisted QIF authoring more executable. A template can now define the instructions, input contract, output contract, validation pipeline, golden case, scoring rubric, agent run, and conformance result needed to generate a QIF package without relying on conversation history.

## Added

- `authoring-template` package type
- `schemas/authoring-template-package.schema.json`
- `examples/authoring-template-package.json`
- `tools/validate-authoring-template.mjs`
- retained negative fixtures under `tests/fixtures/authoring-template/`
- documentation at `docs/qif-v0.6.1-authoring-template-runtime.md`

## Guardrails

- checklist completion cannot be treated as quality
- local QIF validators must be used for validation pipelines
- hidden reasoning must not be stored as evidence
- non-pass conformance results must trigger governance
- verifier success does not claim semantic truth or agent authoring competence

## Validation

- `npm test`
- AOF runtime verification
