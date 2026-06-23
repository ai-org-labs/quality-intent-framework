# QIF v0.3.0

QIF v0.3.0 publishes the Discovery Layer design as a versioned milestone.

This release does not replace the v0.2.1 executable runtime baseline. It adds the accepted design boundary for discovering candidate Quality Intents before QIF artifacts are authored.

## Highlights

- Adds the QIF v0.3 Discovery Layer design.
- Keeps QIF as a standalone representation and evaluation framework for discovered quality knowledge.
- Defines Discovery Patterns as exploratory strategies, not mandatory checklist categories.
- Adds a failure-oriented discovery pattern taxonomy, including stakeholder harm, operational continuity, regulatory and audit, business impact, recovery cost, scalability, human error, exception and waiver, and precedent/incident discovery.
- Defines dynamic discovery flow from sources and stakeholder interviews to candidate concerns, candidate loss boundaries, candidate Quality Intents, and QIF Generation Maps.
- Adds confidence, traceability, discovery coverage, governance, and verifier boundary guidance for future implementation.

## Not Included

- No v0.3 Discovery Layer schemas yet.
- No v0.3 Discovery Layer example packages yet.
- No v0.3 verifier rules yet.
- No UI or external integrations.
- No claim that verifier success proves semantic quality truth.

## Verification

- `npm test`
- AOF Need Validation benchmark
- AOF command routing audit
- AOF organization verification

## Notes

QIF can be used independently of AOF. AOF evidence in this repository records governance and release traceability; it is not required to evaluate repositories, documents, requirements, or work products with QIF.
