# QIF v0.6.2

QIF v0.6.2 hardens the Authoring Template Runtime with audience explanation contracts.

The practical change: an AI cannot merely generate a structurally valid QIF artifact. The template must also define how the artifact will be explained in words a first-time user can understand, with a simple diagram, step-by-step questions, and a comprehension check.

## Added

- `audienceExplanationContracts` in `authoring-template` packages
- verifier checks for general-public audience targeting
- verifier checks for terms to avoid without explanation
- verifier checks for required expression rules
- verifier checks for simple diagram specs
- verifier checks for step-by-step question requirements
- verifier checks for comprehension checks
- retained negative fixtures for the new explanation contract rules

## Guardrails

- understandable explanation is required, but verifier success does not prove every user understood
- diagrams support understanding, but diagram presence is not quality itself
- comprehension checks must preserve ambiguity instead of forcing false certainty
