# QIF v0.6.3

QIF v0.6.3 hardens diagrams as communication evidence.

The practical change: an authoring template can no longer treat diagram presence as sufficient. The package must record whether the intended audience could restate the diagram meaning, what they misunderstood, what was revised, and whether governance is required.

## Added

- `diagramComprehensionEvidence` in `authoring-template` packages
- verifier checks that every audience explanation contract has diagram comprehension evidence
- verifier checks for audience sample, restatement, misunderstanding summary, revision action, and understood status
- governance requirement when diagram evidence shows the audience did not understand
- retained negative fixtures for missing and invalid diagram comprehension evidence

## Guardrails

- diagram presence is not quality
- diagram comprehension evidence is sample evidence, not universal proof
- unresolved misunderstanding must trigger revision or governance
