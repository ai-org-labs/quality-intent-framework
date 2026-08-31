# Changelog

## v0.6.12

- Added `qif trace <entity-id> [package...]` for local entity trace inspection.
- Trace output now reports matching entities, outbound `*Ref` / `*Refs` links, and inbound references from other entities.
- Added `qif trace <entity-id> --all` across committed example packages.
- Added npm test coverage for the trace CLI while preserving the verifier boundary: trace visibility is not semantic truth.

## v0.6.11

- Added `tools/qif.mjs` as the first minimal QIF CLI entrypoint.
- Added `qif validate <package...>` routing so humans and AI agents do not need to know each internal validator filename.
- Added `qif validate --all` for all example packages and `qif validate --fixtures` for retained negative fixture regression.
- Added package `bin` metadata and npm test integration for CLI validation.

## v0.6.10

- Added `handoffPolicies` and `handoffEvidence` to action-quality-contract packages.
- Added verifier rules for delegated-agent handoff authorization, context transfer filtering, authority scope, lifecycle evidence, high-risk request handoff evidence, and governance routing for denied or out-of-scope handoffs.
- Added accepted-outcome blocking when handoff evidence is unauthorized, unfiltered, out of scope, or includes prohibited delegation attempts.
- Added retained negative fixtures for handoff policy/evidence coverage.

## v0.6.9

- Added `containmentPolicies` and `containmentEvidence` to action-quality-contract packages.
- Added verifier rules for containment policy linkage, monitoring signals, safe-exit behavior, incident governance routing, high-risk request containment evidence, and accepted-outcome rejection when containment is breached or incidents remain unresolved.
- Added retained negative fixtures covering containment arrays, policy refs, monitoring signals, safe-exit criteria, incident routing, unauthorized external communication, and breached-containment outcomes.
- Updated docs, roadmap, examples, release notes, and AOF runtime artifacts for the v0.6.9 release path.

## v0.6.8

- Added first-class `contextMemoryBoundaries` and `contextMemoryEvidence` to `action-quality-contract` packages.
- Required context memory boundaries to distinguish session history, local runtime context, agent memory, and LLM-visible context with freshness, trust, compaction, and contamination policies.
- Required LLM-visible context boundaries and evidence to explicitly handle embedded-instruction contamination.
- Required high-risk or write-like requests to include context memory evidence.
- Required stale or untrusted context used in a decision to route to governance.
- Required accepted outcomes to avoid relying on stale or untrusted context memory evidence.
- Added retained negative fixtures for missing context boundaries/evidence, missing allowed use, missing instruction-contamination handling, unresolved refs, unchecked LLM-visible context, stale/untrusted context governance, and accepted outcomes relying on stale context.

## v0.6.7

- Added first-class `toolGuardrailPolicies` and `guardrailEvidence` to `action-quality-contract` packages.
- Required tool guardrail policies to define pre/post execution stage, input/output type, protected boundary, trigger condition, tripwire behavior, action on trip, and side-effect boundary.
- Required high-risk or write-like action requests to include both pre-execution and post-execution guardrail evidence.
- Required tripwire-triggered guardrail evidence to route to governance.
- Required accepted action outcomes to have no tripped or rejected guardrail evidence.
- Added retained negative fixtures for missing guardrail policies/evidence, broken policy refs, pre-execution ordering failure, missing side-effect boundary, missing pre/post evidence, stage mismatch, missing governance on tripwire, and accepted outcomes with rejected guardrails.

## v0.6.6

- Added first-class `approvalPersistencePolicies` to `action-quality-contract` packages.
- Required approval persistence policies to declare persistence mode, decision scope, allowed decisions, tool/server identity boundaries, expiry, revocation conditions, and whether reuse across runs is permitted.
- Required cross-run approval reuse to keep canonical invocation binding.
- Required trace approval evidence to declare whether persistence was applied and to link to a persistence policy when it was.
- Added retained negative fixtures for missing persistence policies, missing allowed decisions, wildcard identity scope, unsafe cross-run reuse, missing persistence refs, and policy/evidence decision mismatch.

## v0.6.5

- Added first-class `traceApprovalEvidence` to `action-quality-contract` packages.
- Required approval-gated action requests to include trace approval evidence.
- Required approved trace approval evidence to record approver and decision time.
- Required replayed or resumed tool calls to remain bound to the original invocation.
- Required accepted approval-gated outcomes to have approved trace approval evidence.
- Added retained negative fixtures for missing approval evidence, mismatched trace/request linkage, missing approver, invalid not-required approval decisions, replay binding failure, and accepted outcomes without approved evidence.

## v0.6.4

- Added first-class `untrustedInputBoundaries` to `authoring-template` packages.
- Required authoring templates to link to an untrusted input boundary.
- Required source kinds, allowed use, prohibited use, verification policy, sanitization policy, and instruction conflict policy.
- Required prohibited use to explicitly block embedded instructions.
- Required instruction conflict policy to rank system and explicit user instructions above source content.
- Added retained negative fixtures for missing untrusted input boundaries, missing source kinds, missing prohibited use, missing embedded-instruction blocking, weak authority ranking, and broken template refs.

## v0.6.3

- Added first-class `diagramComprehensionEvidence` to `authoring-template` packages.
- Required every audience explanation contract to have at least one diagram comprehension evidence item.
- Required diagram comprehension evidence to record audience sample, restatement, misunderstanding summary, revision action, and understood status.
- Required not-understood diagram evidence to cite governance triggers.
- Clarified that diagram presence does not prove communication success and verifier success does not claim universal user comprehension.

## v0.6.2

- Hardened the `authoring-template` package type with first-class `audienceExplanationContracts`.
- Required authoring templates to link to an audience explanation contract.
- Required general-public explanation targeting, terms to avoid without explanation, required expression rules, diagram specs, step-by-step question rules, and comprehension checks.
- Required diagram specs to include a simple flow using `->`.
- Updated the authoring template example so generated QIF artifacts must include plain-language explanation, simple diagrams, and one-question-at-a-time elicitation.
- Added retained negative fixtures for missing explanation contracts, expert-only audience targeting, missing terms, missing diagrams, non-flow diagrams, and broken template explanation refs.
- Increased the standing fixture suite to 15 positive checks and 528 retained negative checks.

## v0.6.1

- Added the executable `authoring-template` package type for machine-readable AI authoring templates.
- Added `schemas/authoring-template-package.schema.json`, `examples/authoring-template-package.json`, and `tools/validate-authoring-template.mjs`.
- Added first-class authoring entities: Authoring Template, Instruction Block, Input Contract, Output Contract, Validation Pipeline, Golden Case, Scoring Rubric, Agent Authoring Run, Conformance Result, and Governance Trigger.
- Required instruction blocks to reject checklist-completion-as-quality claims and declare prohibited claims.
- Required output contracts to target supported QIF package types and validation pipelines to call local QIF validators.
- Required agent authoring runs to avoid storing hidden reasoning.
- Required non-pass conformance results to trigger governance.
- Added retained negative fixtures under `tests/fixtures/authoring-template/`.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the Authoring Template verifier.
- Increased the standing fixture suite to 15 positive checks and 522 retained negative checks.

## v0.6.0

- Added the executable `action-quality-contract` package type for provider-neutral AI agent action governance.
- Added `schemas/action-quality-contract-package.schema.json`, `examples/action-quality-contract-package.json`, and `tools/validate-action-quality-contract.mjs`.
- Added first-class action entities: Tool Surface, Execution Environment, Permission Policy, Approval Gate, Expected State Transition, Rollback Plan, Evidence Requirement, Action Contract, Action Request, Runtime Trace, Action Outcome, and Governance Trigger.
- Required high-risk or write-like action contracts to cite approval gates.
- Required accepted action outcomes to match expected post-state and low-confidence outcomes to trigger governance.
- Added retained negative fixtures under `tests/fixtures/action-quality-contract/`.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the Action Quality Contract verifier.

## v0.5.5

- Added the executable `world-model-elicitation` package type for Level 4 requirements where the world model must be derived before it can be reviewed.
- Added `schemas/world-model-elicitation-package.schema.json`, `examples/world-model-elicitation-package.json`, and `tools/validate-world-model-elicitation.mjs`.
- Added first-class entities for Raw Intent, Model Hypothesis, Discriminating Question, Hypothesis Elimination, Counterexample Sequence, Invariant Candidate, Elicitation Closure Assessment, Derived World Model, Acceptance Scenario, and Quality Intent Candidate.
- Added a cube rolling control golden case that converges from competing reference-frame hypotheses to a fixed-camera control invariant.
- Added retained negative fixtures under `tests/fixtures/world-model-elicitation/` generated from `tools/fixtures/world-model-elicitation-cases.mjs`.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the World Model Elicitation verifier.
- Increased the standing fixture suite to 13 positive checks and 491 retained negative checks.

## v0.5.4

- Added `docs/qif-guided-elicitation-design.md` to define how AI agents should ask answerable, plain-language, stepwise questions when users cannot yet express quality intent in QIF terms.
- Updated the AI authoring guide and roadmap so Guided Elicitation becomes part of the Phase 3 AI-native authoring path without turning discovery into a checklist or treating question count as quality.
- Added the executable `guided-elicitation` package type.
- Added `schemas/guided-elicitation-package.schema.json`, `examples/guided-elicitation-package.json`, and `tools/validate-guided-elicitation.mjs`.
- Added retained negative fixtures under `tests/fixtures/guided-elicitation/` generated from `tools/fixtures/guided-elicitation-cases.mjs`.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the Guided Elicitation verifier.
- Increased the standing fixture suite to 12 positive checks and 468 retained negative checks.

## v0.5.3

- Added the executable `world-model-pilot-corpus` package type for preparing real, privacy-screened, unseen pilot cases before World Model Calibration.
- Added `schemas/world-model-pilot-corpus-package.schema.json`, `examples/world-model-pilot-corpus-package.json`, and `tools/validate-world-model-pilot-corpus.mjs`.
- Added first-class pilot corpus entities: Pilot Source, Privacy Control, Sampling Policy, Pilot Case, Case Normalization Step, Expert Panel, Adjudication Rubric, Ingestion Run, and Governance Trigger.
- Required Ingestion Runs to reproduce case count, domain coverage, real-case ratio, and privacy readiness from referenced cases and privacy controls.
- Required redaction-required pilot cases to remove sensitive data during normalization.
- Required source trust metadata, independent expert panel quorum, adjudication criteria, and governance-on-failure behavior.
- Added `tools/fixtures/world-model-pilot-corpus-cases.mjs` and retained `tests/fixtures/world-model-pilot-corpus/` negative fixtures.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the World Model Pilot Corpus verifier.
- Increased the standing fixture suite to 11 positive checks and 451 retained negative checks.
- Added `docs/qif-v0.5.3-world-model-pilot-corpus.md` and updated README, roadmap, and AI authoring guidance.

## v0.5.2

- Added the executable `world-model-calibration` package type for measuring AI/expert agreement on World Model Gap Findings.
- Added `schemas/world-model-calibration-package.schema.json`, `examples/world-model-calibration-package.json`, and `tools/validate-world-model-calibration.mjs`.
- Added first-class calibration entities: Calibration Policy, Calibration Case, Expert Assessment, Agent Assessment, Finding Match, Calibration Run, and Governance Trigger.
- Required Calibration Runs to reproduce case count, domain coverage, agreement score, false-positive rate, and false-negative rate from referenced cases and finding matches.
- Required each expert expected finding and agent generated finding to be covered by a Finding Match.
- Required threshold failures to trigger governance when the policy requires governance, and blocked failed thresholds from being reported as calibrated.
- Extended the Living QIF Ledger example and verifier entity index so ledger packages can reference World Model Calibration packages, calibration runs, and calibration governance triggers.
- Added `tools/fixtures/world-model-calibration-cases.mjs` and retained `tests/fixtures/world-model-calibration/` negative fixtures.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the World Model Calibration verifier.
- Increased the standing fixture suite to 10 positive checks and 433 retained negative checks.
- Added `docs/qif-v0.5.2-world-model-calibration.md` and updated README, roadmap, AI authoring guidance, and Living Ledger docs.

## v0.5.1

- Added the executable `world-model-review` package type for QIF World Model Review.
- Added `schemas/world-model-review-package.schema.json`, `examples/world-model-review-package.json`, and `tools/validate-world-model-review.mjs`.
- Added first-class World Model Review entities: World Model, Concept Definition, Domain Entity, Actor, Boundary, Relationship, State, Event, Invariant, Coordinate System, Coordinate Axis, Perspective, Assumption, Model Evidence, World Model Gap Finding, Resolution Action, and Governance Trigger.
- Required World Model Gap Findings to name the exact missing item, expected definition, observed problem, why it matters, affected Quality Intents, affected decisions, evidence, required resolution actions, verdict effect, finding evidence, trust, and governance linkage when evaluation is blocked.
- Extended the Living QIF Ledger example and verifier entity index so ledger packages can reference World Model Review packages and preserve the chain from a world-model gap to a candidate Quality Intent.
- Added `tools/fixtures/world-model-review-cases.mjs` and retained `tests/fixtures/world-model-review/` negative fixtures.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the World Model Review verifier.
- Increased the standing fixture suite to 9 positive checks and 412 retained negative checks.
- Added `docs/qif-v0.5.1-world-model-review.md` and updated README, roadmap, and AI authoring guidance.

## v0.5.0

- Added the first executable Living QIF Ledger package type.
- Added `schemas/qif-ledger-package.schema.json`, `examples/qif-ledger-package.json`, and `tools/validate-qif-ledger.mjs`.
- Added cross-package package refs and entity refs that resolve against existing QIF package files.
- Added Quality Intent lifecycle records, missed-intent records, agent trial/outcome records, and a ledger index.
- Added `tools/fixtures/qif-ledger-cases.mjs` and retained `tests/fixtures/qif-ledger/` negative fixtures.
- Extended `npm test` and `tools/run-fixture-tests.mjs` to include the ledger verifier.
- Increased the standing fixture suite to 8 positive checks and 392 retained negative checks.
- Added `docs/qif-v0.5-living-ledger.md` and updated the roadmap to move beyond v0.4.x single-package runtime closure.

## v0.4.11

- Added retained negative fixture coverage for the review-run runtime package surface.
- Added `tools/fixtures/review-run-cases.mjs` as the source of truth for review-run invalid packages.
- Extended `tools/run-fixture-tests.mjs` to include the review-run corpus and its positive package check.
- Increased the standing fixture suite to 7 positive checks and 376 retained negative checks.
- Covered review-run target selection, applicability decisions, evidence-backed verdicts, confidence reproducibility, governance triggers, activity-count boundaries, and verifier-boundary semantic-truth limits.
- Marked the planned v0.4.x runtime package fixture frontier complete; the next roadmap frontier is v0.5 Living QIF Ledger.

## v0.4.10

- Added retained negative fixture coverage for the evaluation-target runtime package surface.
- Added `tools/fixtures/evaluation-target-cases.mjs` as the source of truth for evaluation-target invalid packages.
- Extended `tools/run-fixture-tests.mjs` to include the evaluation-target corpus and its positive package check.
- Strengthened the runtime verifier with explicit evaluation target id uniqueness and supported-domain checks.
- Increased the standing fixture suite to 6 positive checks and 309 retained negative checks.
- Covered target identity, domain vocabulary, target type, artifact type, context, stakeholder impact, operational impact, risk summary, and source evidence.

## v0.4.9

- Added retained negative fixture coverage for the organizational-quality-culture runtime package surface.
- Added `tools/fixtures/organizational-quality-culture-cases.mjs` as the source of truth for culture invalid packages.
- Extended `tools/run-fixture-tests.mjs` to include the organizational-quality-culture corpus and its positive package check.
- Increased the standing fixture suite to 5 positive checks and 294 retained negative checks.
- Covered culture as context-only aggregation, forbidden derivation-prerequisite misuse, required culture context fields, and grounding in multiple patterns or explicit provisional status.

## v0.4.8

- Added retained negative fixture coverage for the discovery-session runtime package surface.
- Added `tools/fixtures/discovery-session-cases.mjs` as the source of truth for discovery-session invalid packages.
- Extended `tools/run-fixture-tests.mjs` to include the discovery-session corpus and its positive package check.
- Increased the standing fixture suite to 4 positive checks and 279 retained negative checks.
- Covered raw expert answer traceability, question/session consistency, extraction-step justification, and session-local provenance regressions.

## v0.4.7

- Added first-class `qualityReports` to quality-gate packages.
- Required Quality Report scores and sections to cite the gate decisions, Quality Intents, and verdict evidence they summarize.
- Extended the quality-gate verifier to reject report scores that cannot be decomposed into referenced gate verdict evidence.
- Required report scores to use `report-summary-only` interpretation so dashboard or report values are not treated as quality itself.
- Updated the quality-gate example and retained negative fixtures for Quality Report misuse.

## v0.4.6

- Added first-class `evidenceRetentionPolicies` to quality-gate packages.
- Required every quality-gate evidence item to cite a retention policy through `retentionPolicyRef`.
- Extended the quality-gate verifier to check retention policy evidence type coverage, sensitivity, integrity protection, access control, disposal ownership, and unused policy declarations.
- Updated the quality-gate example with release evidence and monitoring evidence retention policies.
- Added retained negative fixtures covering retention policy misuse.

## v0.4.5

- Added first-class `evaluationTimingRules` and `evaluationTimingDecisions` to quality-gate packages.
- Extended the quality-gate verifier so required-before-decision timing rules must have completed timing decisions before a gate decision can pass.
- Added verifier checks for timing enum validity, linked intents, selected timing consistency, completed timing evidence, and governance-backed waivers.
- Updated the quality-gate example with pre-release boundary evidence timing and continuous post-activation monitoring timing.
- Added retained negative fixtures covering evaluation timing misuse.

## v0.4.4

- Added first-class `evidenceTypeVocabulary` to quality-gate packages so evidence item types and gate-rule `requiredEvidenceTypes` are declared before use.
- Extended the quality-gate verifier to reject undeclared evidence item types, undeclared gate-rule required evidence types, unused vocabulary entries, and missing vocabulary-required `trust` or `findingEvidence` metadata.
- Updated the quality-gate example to declare sampled review, control test, regression sample, reversal rehearsal, and monitoring configuration evidence types.
- Updated AI authoring guidance and v0.4 runtime requirements so agents treat evidence type names as governed control vocabulary, not quality itself.
- Added retained negative fixtures covering evidence type vocabulary misuse.

## v0.4.3

- Completed retained negative fixture coverage for every implemented error branch in `tools/validate-qif.mjs` and `tools/validate-expert-judgment.mjs`.
- Expanded `qif-package` retained negative checks from 6 to 68 and `expert-judgment` checks from 6 to 96.
- Increased the standing fixture suite from 69 to 221 negative checks while preserving 3 positive checks and byte-for-byte corpus drift detection.
- Added manifest `rescopedRules` for the intentionally non-failing review-history inference warning.
- Added `docs/qif-v0.4.3-core-fixture-coverage.md` and `docs/releases/v0.4.3-release-checklist.md`.
- Revalidated the long-term roadmap against 2026 primary-source trends in multi-turn agent evals, long-horizon and multi-agent work, persistent tool-using harnesses, protocol-connected tools, and outcome economics.
- Added an explicit v0.9 Anticipatory Quality Intent Twin horizon while preserving the boundary that synthetic scenarios cannot satisfy operational verdicts.
- Recorded the v0.4.3 development and release path with AOF v10.8.0.

## v0.4.2

- Added `docs/qif-quality-aspect-taxonomy.md`, defining canonical Quality Aspects as discovery lenses rather than checklist categories.
- Added first-class `qualityAspects` to quality-gate packages with discovery questions, typical concerns, possible loss boundaries, evidence examples, anti-patterns, and `discovery-lens-only` interpretation.
- Linked evaluation perspectives to quality aspects through `linkedAspectRefs`.
- Extended the quality-gate verifier so aspects must use canonical names, remain discovery-lens-only, include required discovery metadata, resolve from perspectives, and not sit unused in a package.
- Added `findingEvidence` metadata for AI-generated quality and security findings, covering generator, source artifact, reproducibility, reproducer, false-positive check, impact confirmation, and final status.
- Added `trust` metadata for evidence items, covering source grounding, generator, verifiers, trust status, and freshness without replacing finding verification, confidence, or verdicts.
- Expanded the quality-gate example to demonstrate trust metadata and functional, non-functional, usability, performance, security, UX design, accessibility, privacy, data quality, auditability, safety, customer, trust, and organizational operability lenses without treating aspect coverage as quality itself.
- Added retained negative fixtures for unsupported aspects, aspect-as-quality misuse, missing discovery questions, unused aspects, broken perspective aspect references, and AI finding-evidence verification and trust metadata verification.

## v0.4.1

- Expanded the retained negative fixture suite beyond `quality-gate` to include selected `qif-package` and `expert-judgment` verifier rules.
- Added `tools/fixtures/qif-package-cases.mjs` and `tools/fixtures/expert-judgment-cases.mjs` as source-of-truth fixture generators.
- Generalized `tools/run-fixture-tests.mjs` so one runner verifies multiple fixture corpora, drift-checks committed JSON files against their generator modules, and preserves the existing quality-gate corpus.
- Added committed invalid fixture corpora under `tests/fixtures/qif-package/` and `tests/fixtures/expert-judgment/`.
- Updated `npm run build-fixtures` to regenerate all retained fixture corpora.
- Added `docs/qif-v0.4.x-release-roadmap.md` and updated README and roadmap language to record that fixture coverage now spans 58 negative checks across three verifier surfaces, while complete non-quality-gate coverage remains follow-on work.

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
