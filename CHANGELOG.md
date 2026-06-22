# Changelog

## Unreleased

- No unreleased changes.

## v0.2.1

- Added a QIF v0.2.1 consolidation review covering concept inventory, entity responsibilities, runtime flow integrity, schema/docs/example/verifier alignment, verifier boundaries, package architecture, naming improvements, v0.3 pilot readiness, and v0.2.2 cleanup tasks.
- Added first-class Raw Expert Answer and Question Log Entry records to discovery-session packages.
- Added first-class Quality Intent Derivation records that point to separate Quality Intent records.
- Made Applicability Rules executable through structured match conditions, selected intents, selected patterns, and exclusion conditions.
- Added Applicability Decision consistency checks for selected and excluded intents and patterns.
- Added Confidence Policy records and verifier checks that reproduce confidence from evidence inputs, verdict aggregation rules, and review-run aggregation rules.
- Added Governance Event records and optional `resultingGovernanceEventRef` links from Governance Triggers.
- Repositioned Organizational Quality Culture as `context-only` aggregation context.
- Hardened runtime examples and verifier rules for traceability, low confidence, conflicting evidence, context mismatch, and activity-count guardrails.

## v0.2.0

- Split reusable Applicability Rules from target-specific Applicability Decisions.
- Added Extraction Steps and Quality Intent Derivations to discovery-session packages.
- Repositioned Organizational Quality Culture as an aggregation/context layer, not a prerequisite for Quality Intent derivation.
- Promoted Governance Trigger to a first-class review-run entity with source run, affected target, owner, action, and status.
- Clarified verifier boundaries: structural integrity, traceability, reference resolution, confidence reproducibility, and rule compliance only; no semantic-truth claim.
- Hardened runtime examples and verifier rules for selected/excluded patterns, low confidence, conflicting evidence, and context mismatch.

- Added QIF v0.2 discovery and application runtime documentation.
- Added discovery-session, organizational-quality-culture, evaluation-target, and review-run schemas.
- Added example packages for discovery sessions, quality culture aggregation, evaluation targets, and review runs.
- Added runtime verifier coverage for discovery linkage, applicability discipline, verdict traceability, activity-count guardrails, and governance-trigger rules.

## v0.1.0

- Established the first executable QIF baseline with operational framework, expert judgment framework, schemas, sample packages, local verifiers, and AOF runtime evidence.
