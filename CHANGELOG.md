# Changelog

## Unreleased

- Added `docs/AI_AUTHORING_GUIDE.md` so AI agents can quickly learn QIF framing, evidence, verdict, governance, and authoring conventions before evaluating or extending QIF artifacts.

## v0.3.1

- Added QIF pre-implementation review guidance for challenging solution bias, boundary confusion, concept comprehension, and evidence plans before implementation.
- Added QIF negative acceptance guidance for defining forbidden states tied to Quality Intents, Loss Boundaries, Evidence, Verdicts, and Governance Triggers.
- Extended the v0.3 Discovery Layer pattern taxonomy with Solution Bias Discovery, Boundary Confusion Discovery, and Concept Comprehension Discovery.
- Added done-before Guardian questions, evidence independence classification, rubric-based visual verification, and Living QIF Ledger guidance for turning QIF into a completion gate rather than a post-hoc record.
- Added v0.4 quality gate runtime requirements covering evaluation perspectives, quantitative evidence, automated evaluation detail, evidence management, evaluation timing, shift-left review, release gates, post-release review, traceability, and reports without treating metrics as quality itself.

## v0.3.0

- Added the QIF v0.3 Discovery Layer design as a versioned design milestone.
- Defined Discovery Layer boundaries so QIF remains a standalone Quality Intent representation and evaluation framework.
- Added a Discovery Pattern taxonomy for failure-oriented quality intent discovery without mandatory checklist categories.
- Defined dynamic discovery flow, candidate concerns, candidate loss boundaries, candidate Quality Intents, QIF Generation Maps, confidence, traceability, governance, and verifier boundaries.
- Clarified that v0.3.0 does not yet implement Discovery Layer schemas, example packages, verifier rules, UI, external integrations, or semantic-truth validation.

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
