# QIF Packages And CLI

Use a machine-readable package when traceability, repeatable verification,
cross-agent handoff, or governance history matters. A short conversational
review does not always require a package.

## Select A Package

- `qif-package`: quality intents, risks, evidence, verdicts, and governance.
- `discovery-session`: expert answers and extraction traceability.
- `evaluation-target`: domain-general target context and stakeholder impact.
- `review-run`: applicability decisions, evidence, verdicts, and residual risk.
- `quality-gate`: pre-release or bounded go/no-go decision.
- `expert-judgment`: concrete judgments, cues, concerns, decision patterns,
  counterexamples, and reproduction tests.
- `guided-elicitation`: stepwise plain-language stakeholder questioning.
- `world-model-elicitation`: competing hypotheses, discriminating questions,
  counterexamples, invariants, and closure.
- `action-quality-contract`: quality conditions for a proposed or executed AI
  action.
- `qif-ledger`: append-only quality knowledge and governance history.

Run `node scripts/run-qif.mjs package-types` for the current complete catalog.

## Authoring Procedure

1. Inspect the schema and closest example in `runtime/schemas/` and
   `runtime/examples/` when using a built bundle.
2. Create a new file; never overwrite source evidence or a historical record.
3. Replace example values with target-specific facts and references.
4. Keep evidence, inference, confidence, and authority separate.
5. Validate the package.
6. Trace important entities and inspect open risks.
7. Treat every verifier boundary as part of the result.

## Commands

```bash
node scripts/run-qif.mjs commands
node scripts/run-qif.mjs package-types
node scripts/run-qif.mjs new review-run --out review.json
node scripts/run-qif.mjs validate review.json
node scripts/run-qif.mjs trace <entity-id> review.json
node scripts/run-qif.mjs open-risks review.json
node scripts/run-qif.mjs inventory review.json
```

The wrapper looks for `QIF_ROOT`, a bundled `runtime/`, or a containing QIF
source/portable directory. Node.js 18 or newer is required for these commands.

The bundled skill omits the large retained negative fixture corpus to remain
within common Agent Skill upload limits. Run the repository's full `npm test`
when changing QIF itself. Package validation in the skill is useful for local
structure and traceability but is not a release certification.
