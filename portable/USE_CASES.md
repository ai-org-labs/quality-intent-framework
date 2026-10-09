# QIF Portable Use Cases

## 1. Evaluate a Repository or Document

Give the AI the target and say:

```text
Evaluate this target using QIF. First state Need, Intent, and Context. Identify
stakeholders, loss boundaries, applicable Quality Intents, required evidence,
evidence found, missing evidence, verdicts, and residual risks. Do not equate
test or review counts with quality.
```

Use the canonical review-run schema and example when machine-readable output is
needed:

- `schemas/review-run-package.schema.json`
- `examples/review-run-package.json`

## 2. Define Quality Checks from Requirements

```text
Derive target-specific QIF checks from these requirements. Do not copy a generic
quality checklist. For every check show the protected stakeholder, unacceptable
loss, Quality Intent, applicability condition, required evidence, acceptance or
rejection condition, and unresolved assumption.
```

Use `docs/qif-pre-implementation-review.md` and
`docs/qif-quality-aspect-taxonomy.md` to search for blind spots after the first
target-specific intents exist.

## 3. Help a User Who Cannot State Quality Requirements

Explain the target in ordinary language and ask one concrete question at a
time. Give examples without forcing the user to choose one. Use teach-back to
check understanding.

- `docs/qif-guided-elicitation-design.md`
- `schemas/guided-elicitation-package.schema.json`
- `examples/guided-elicitation-package.json`

## 4. Resolve an Ambiguous World Model

Keep multiple possible interpretations. Ask the question that best separates
them. Generate sequences, reversals, boundary cases, and counterexamples. Infer
a candidate invariant only after examples support it.

- `docs/qif-v0.5.5-world-model-elicitation.md`
- `schemas/world-model-elicitation-package.schema.json`
- `examples/world-model-elicitation-package.json`

## 5. Govern an AI Tool Action

Before a consequential action, identify the target operation, expected state
change, permission, evidence, stop condition, rollback, and accountable approval.

- `docs/qif-v0.6.0-action-quality-contract.md`
- `schemas/action-quality-contract-package.schema.json`
- `examples/action-quality-contract-package.json`

## 6. Extract Expert Judgment

Ask an expert to judge concrete cases rather than define quality abstractly.
Capture cues, concerns, loss boundaries, exceptions, and counterexamples. Test
the resulting pattern on unseen cases.

- `docs/expert-judgment-framework.md`
- `schemas/expert-judgment-package.schema.json`
- `examples/expert-judgment-sample-package.json`

## Choosing a Package Type

Open `MANIFEST.json` to see every included schema and example. Use a schema only
when its purpose matches the decision you need to make. Completing more package
types is not evidence of higher quality.
