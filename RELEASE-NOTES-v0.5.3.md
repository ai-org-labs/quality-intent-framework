# QIF v0.5.3

QIF v0.5.3 adds the executable World Model Pilot Corpus layer.

This release prepares the missing input layer before World Model Calibration: where pilot cases came from, whether they are privacy-screened, whether normalization preserved the decision cues, whether sampling policy is met, and whether expert adjudication can proceed.

## Added

- `world-model-pilot-corpus` package type.
- Schema: `schemas/world-model-pilot-corpus-package.schema.json`.
- Example: `examples/world-model-pilot-corpus-package.json`.
- Verifier: `tools/validate-world-model-pilot-corpus.mjs`.
- Negative fixture source: `tools/fixtures/world-model-pilot-corpus-cases.mjs`.
- Retained negative fixture corpus: `tests/fixtures/world-model-pilot-corpus/`.
- Documentation: `docs/qif-v0.5.3-world-model-pilot-corpus.md`.

## Verifier Coverage

The verifier checks source trust metadata, privacy controls, redaction readiness, pilot case references, normalization traceability, sampling policy reproduction, expert panel quorum, adjudication rubric presence, ingestion-run readiness, and governance routing for readiness failures.

`npm test` now validates 11 positive packages and 451 retained negative fixtures.

## Boundary

Verifier success does not prove semantic truth, privacy-law compliance, or case representativeness. Those require expert adjudication, privacy or legal review where applicable, downstream calibration, operational feedback, and governance.
