# QIF v0.3.1

QIF v0.3.1 publishes the pre-implementation review guidance as a documentation milestone.

This release keeps QIF standalone and does not add runtime schemas or verifier rules. It strengthens how QIF should be used before implementation and before marking work done.

## Highlights

- Adds QIF Pre-Implementation Review guidance.
- Adds QIF Negative Acceptance guidance for forbidden states tied to Quality Intents and Loss Boundaries.
- Extends the Discovery Layer taxonomy with Solution Bias Discovery, Boundary Confusion Discovery, and Concept Comprehension Discovery.
- Adds evidence independence guidance so code reading, symmetry assumptions, and screenshots without scoring are treated as weak evidence.
- Adds done-before Guardian questions for adjacent paths, shared assumptions, and public or irreversible impact.
- Adds rubric-based visual verification for UI, document, diagram, and rendered-output evidence.
- Adds Living QIF Ledger guidance so bugs and review misses update Quality Intents, Loss Boundaries, residual risks, and follow-up tasks.
- Adds v0.4 quality gate runtime requirements for quantitative evidence, evaluation timing, release decisions, post-release review, traceability, and reporting while preserving the rule that metrics are evidence metadata, not quality itself.

## Not Included

- No v0.3.1 runtime schemas.
- No v0.3.1 example packages.
- No v0.3.1 verifier rule implementation.
- No UI or external integrations.
- No claim that structural verification proves semantic quality truth.

## Verification

- `npm test`
- AOF Need Validation benchmark
- AOF command routing audit
- AOF organization verification
- Public-readiness scan for local paths and legacy personal identifiers

## Notes

QIF can be used independently of AOF. AOF evidence in this repository records governance and release traceability; it is not required to evaluate repositories, documents, requirements, or work products with QIF.
