# Changelog

## v0.4.0

- Added an executable `quality-gate` package type that turns the v0.4 quality gate runtime requirements from documentation into a runnable baseline.
- Added `schemas/quality-gate-package.schema.json` covering evaluation perspectives, quantitative evidence records, automated evaluation detail, evidence items with independence ratings, quality gate rules, release gate decisions, post-release reviews, improvement actions, traceability links, and governance.
- Added `examples/quality-gate-package.json`, a domain-general customer-support refund-authority policy activation that produces a Conditional Go decision and closes the loop through a post-release review and improvement action.
- Extended `tools/validate-qif-runtime.mjs` to validate quality gate packages: quantitative records must stay evidence-only with unit, method, and interpretation rule; gate verdicts must link to evidence and reproduce confidence; Go and Conditional Go decisions must carry rollback, monitoring, approval owner, and residual risk; Conditional Go must list conditions with owners and monitoring; No-Go must cite a violated boundary or rule; Pending must list missing evidence; high-severity boundaries cannot rely only on low-independence evidence without governance and cannot yield a Go; low-confidence, conflicting, and weak-evidence verdicts trigger governance; post-release high-severity incidents must link improvement actions; and traceability links must resolve on both ends.
- Hardened gate enforcement so gate rules are executable rather than decorative: every intent a cited gate rule protects must have a verdict; Go and Conditional Go decisions must satisfy each cited rule's required evidence types; a Go is blocked while a high-severity boundary verdict is not-achieved or inconclusive or while a high-severity governance trigger remains open; achieved verdicts must cite supporting evidence; each gated intent needs perspective coverage and exactly one verdict; automated evaluation pass rates and count sums must be reproducible; and improvement actions must be cross-referenced by their source post-release review.
- Updated `README.md`, `docs/AI_AUTHORING_GUIDE.md`, and `docs/qif-v0.4-quality-gate-runtime-requirements.md` to point to the executable baseline and record which entities remain future work.
- Added `docs/qif-roadmap.md`, a long-term roadmap stating QIF's permanent verifier limits, six phased milestones with structural or empirical exit evidence (runtime completion, Living QIF Ledger, AI-native authoring and gate hooks, empirical calibration, organizational memory, standard candidacy), and permanent non-goals.
- Added a standing negative fixture suite (`tools/run-fixture-tests.mjs`) wired into `npm test`, delivering the first slice of Roadmap Phase 1: every quality gate verifier rule has a retained invalid fixture under `tests/fixtures/quality-gate/` that must be rejected with a specific error, so silently weakening or deleting a rule breaks the build. The corpus is generated from `tools/fixtures/quality-gate-cases.mjs` by `npm run build-fixtures`, and the suite fails on drift between the source of truth and the committed files. Negative coverage for the other verifiers remains follow-on work.

## v0.3.2

- Added `docs/AI_AUTHORING_GUIDE.md` so AI agents can quickly learn QIF framing, evidence, verdict, governance, and authoring conventions before evaluating or extending QIF artifacts.
- Changed `README.md` to include the AI authoring guide in the current baseline document list.
- Fixed: none.

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
