# Quality Intent Framework

Quality Intent Framework (QIF) turns an organization's quality theory into an operational, AI-verifiable framework.

QIF does not define quality as output volume. Page count, review count, and test count are treated only as possible evidence signals when they are linked to a quality intent, a risk, and a loss boundary.

## Current Baseline

This repository contains the executable QIF baseline through v0.2.1, the v0.3.0 Discovery Layer design milestone, the v0.4.0 quality gate runtime baseline, the v0.4.x retained runtime fixture frontier, the v0.5.x Living QIF Ledger and World Model runtimes, the v0.6.x Action Quality Contract runtime for governing AI agent tool actions with trace approval evidence, and the v0.6.x Authoring Template runtime for guiding AI agents to author valid, understandable QIF packages:

- Human-readable framework specification: `docs/qif-operational-framework.md`
- AI authoring guide: `docs/AI_AUTHORING_GUIDE.md`
- Expert judgment specification: `docs/expert-judgment-framework.md`
- QIF v0.2 runtime specification: `docs/qif-v0.2-discovery-application-runtime.md`
- QIF v0.2.1 consolidation review: `docs/qif-v0.2.1-consolidation-review.md`
- QIF guided elicitation design: `docs/qif-guided-elicitation-design.md`
- QIF v0.3 Discovery Layer design: `docs/qif-v0.3-discovery-layer-design.md`
- QIF pre-implementation review: `docs/qif-pre-implementation-review.md`
- QIF negative acceptance: `docs/qif-negative-acceptance.md`
- QIF v0.4 quality gate runtime requirements: `docs/qif-v0.4-quality-gate-runtime-requirements.md`
- QIF Quality Aspect taxonomy: `docs/qif-quality-aspect-taxonomy.md`
- QIF long-term roadmap: `docs/qif-roadmap.md`
- QIF v0.4.x release roadmap: `docs/qif-v0.4.x-release-roadmap.md`
- QIF v0.4.3 core fixture coverage: `docs/qif-v0.4.3-core-fixture-coverage.md`
- QIF v0.5 Living Ledger design: `docs/qif-v0.5-living-ledger.md`
- QIF v0.5.1 World Model Review design: `docs/qif-v0.5.1-world-model-review.md`
- QIF v0.5.2 World Model Calibration design: `docs/qif-v0.5.2-world-model-calibration.md`
- QIF v0.5.3 World Model Pilot Corpus design: `docs/qif-v0.5.3-world-model-pilot-corpus.md`
- QIF v0.5.4 Guided Elicitation Runtime: `docs/qif-v0.5.4-guided-elicitation-runtime.md`
- QIF v0.5.5 World Model Elicitation Runtime: `docs/qif-v0.5.5-world-model-elicitation.md`
- QIF v0.6.0 Action Quality Contract: `docs/qif-v0.6.0-action-quality-contract.md`
- QIF v0.6.1 Authoring Template Runtime: `docs/qif-v0.6.1-authoring-template-runtime.md`
- Quality theory summary: `docs/quality-theory-report.md`
- Canonical package schema: `schemas/qif-package.schema.json`
- QIF ledger package schema: `schemas/qif-ledger-package.schema.json`
- World model review package schema: `schemas/world-model-review-package.schema.json`
- World model calibration package schema: `schemas/world-model-calibration-package.schema.json`
- World model pilot corpus package schema: `schemas/world-model-pilot-corpus-package.schema.json`
- Guided elicitation package schema: `schemas/guided-elicitation-package.schema.json`
- World model elicitation package schema: `schemas/world-model-elicitation-package.schema.json`
- Action quality contract package schema: `schemas/action-quality-contract-package.schema.json`
- Authoring template package schema: `schemas/authoring-template-package.schema.json`
- Quality gate package schema: `schemas/quality-gate-package.schema.json`
- Expert judgment schema: `schemas/expert-judgment-package.schema.json`
- Discovery session schema: `schemas/discovery-session-package.schema.json`
- Organizational quality culture schema: `schemas/organizational-quality-culture-package.schema.json`
- Evaluation target schema: `schemas/evaluation-target-package.schema.json`
- Review run schema: `schemas/review-run-package.schema.json`
- Example QIF package: `examples/qif-sample-package.json`
- Example expert judgment package: `examples/expert-judgment-sample-package.json`
- Example discovery session package: `examples/discovery-session-package.json`
- Example organizational quality culture package: `examples/organizational-quality-culture-package.json`
- Example evaluation target package: `examples/evaluation-target-package.json`
- Example review run package: `examples/review-run-package.json`
- Example QIF ledger package: `examples/qif-ledger-package.json`
- Example world model review package: `examples/world-model-review-package.json`
- Example world model calibration package: `examples/world-model-calibration-package.json`
- Example world model pilot corpus package: `examples/world-model-pilot-corpus-package.json`
- Example guided elicitation package: `examples/guided-elicitation-package.json`
- Example world model elicitation package: `examples/world-model-elicitation-package.json`
- Example action quality contract package: `examples/action-quality-contract-package.json`
- Example authoring template package: `examples/authoring-template-package.json`
- Example quality gate package: `examples/quality-gate-package.json`
- Local verifier: `tools/validate-qif.mjs`
- Local expert judgment verifier: `tools/validate-expert-judgment.mjs`
- Local runtime verifier: `tools/validate-qif-runtime.mjs`
- Local ledger verifier: `tools/validate-qif-ledger.mjs`
- Local world model review verifier: `tools/validate-world-model-review.mjs`
- Local world model calibration verifier: `tools/validate-world-model-calibration.mjs`
- Local world model pilot corpus verifier: `tools/validate-world-model-pilot-corpus.mjs`
- Local guided elicitation verifier: `tools/validate-guided-elicitation.mjs`
- Local world model elicitation verifier: `tools/validate-world-model-elicitation.mjs`
- Local action quality contract verifier: `tools/validate-action-quality-contract.mjs`
- Local authoring template verifier: `tools/validate-authoring-template.mjs`
- Negative fixture suite runner: `tools/run-fixture-tests.mjs`
- Negative fixture case sources include `tools/fixtures/authoring-template-cases.mjs` and `tools/fixtures/action-quality-contract-cases.mjs` in addition to the retained QIF, expert-judgment, runtime, ledger, world-model, guided-elicitation, and quality-gate suites.
- Retained negative fixture corpora include `tests/fixtures/authoring-template/` and `tests/fixtures/action-quality-contract/` in addition to the retained QIF, expert-judgment, runtime, ledger, world-model, guided-elicitation, and quality-gate corpora.
- AOF runtime log: `docs/aof-runtime-log.md`
- Changelog: `CHANGELOG.md`

QIF is usable as a standalone framework. AOF evidence in this repository records the development and governance path; it is not required to use QIF.

## Verify

Run:

```sh
npm test
```

The verifier checks:

- required entity families exist
- entity ids are unique
- references resolve
- evidence confidence scores are reproducible
- verdict confidence scores are derived from evidence
- achieved verdicts meet confidence thresholds
- activity-count indicators are not treated as quality itself
- acceptance artifact references exist

The expert judgment verifier checks:

- cases, cues, concerns, loss boundaries, judgments, and patterns are connected
- inferred review-history patterns stay candidate until validated
- each pattern has an applicability boundary, counterexample, and reproduction test
- reproduction tests use unseen cases and meet agreement thresholds
- quality intent derivations remain grounded in source decision patterns

The runtime verifier checks:

- every Discovery Session links to cases and expert judgments
- every Question Log Entry and Raw Expert Answer is structured and traceable
- every Extraction Step links raw expert answers to derived entities
- every extracted Cue links to a Concern
- every Concern links to a Loss Boundary
- every derived Decision Pattern links back to source judgments
- Quality Intents may be derived directly from Decision Patterns
- every Organizational Quality Culture entry is grounded in multiple patterns or marked provisional, and is treated as aggregation context
- every Evaluation Target has context, stakeholder impact, and domain
- every Review Run uses executable Applicability Rules through target-specific Applicability Decisions
- every Review Run verdict links to evidence
- review confidence is reproducible from evidence inputs, confidence policies, verdict aggregation rules, and review-run aggregation rules
- no activity-count metric is treated as quality itself
- low-confidence, conflicting, or context-mismatched review results trigger governance review

The ledger verifier checks:

- package references resolve to repository-local package files
- referenced package types match their declared package refs
- cross-package entity references resolve, including nested post-release incidents
- Quality Intent lifecycle records cite evidence and valid lifecycle states
- missed-intent records close to either a new derivation or an accepted-gap rationale
- agent trials link targets, review runs, tool/action provenance, outcomes, and outcome evidence
- ledger indexes resolve active intents, open governance triggers, and open residual-risk carriers
- ledger verification explicitly does not claim semantic truth

The world model review verifier checks:

- every World Model Review entity references an existing World Model when required
- concepts, domain entities, actors, boundaries, relationships, states, events, invariants, coordinate systems, coordinate axes, perspectives, assumptions, and model evidence resolve their references
- actors carry responsibility and authority boundaries
- coordinate axes define their scale, examples, and missing-value handling
- model evidence and gap findings carry structurally valid `trust` and `findingEvidence` metadata
- each World Model Gap Finding names the specific missing item, expected definition, observed problem, why it matters, affected Quality Intents, affected decisions, evidence, resolution actions, verdict effect, confidence, and status
- blocking or governance-required findings cite governance triggers
- referenced Resolution Actions and Governance Triggers point back to the same finding
- verifier success explicitly does not claim semantic truth

The world model calibration verifier checks:

- calibration package refs resolve to repository-local package files
- calibration policies define minimum cases, required domains, expert assessor count, unseen-case requirements, agreement thresholds, false-positive limits, false-negative limits, and governance-on-failure behavior
- calibration cases link to source World Model Review packages
- expert assessments include expected findings
- agent assessments may include generated findings but must not store hidden chain-of-thought as evidence
- every expected expert finding and generated agent finding is covered by a Finding Match
- match scores reproduce from match type: exact 1, partial 0.5, missed/spurious/disagreement 0
- Calibration Run case count, domain coverage, agreement score, false-positive rate, and false-negative rate reproduce from referenced cases and matches
- threshold failures trigger governance when the policy requires governance
- a failed threshold cannot be reported as calibrated
- verifier success explicitly does not claim semantic truth

The world model pilot corpus verifier checks:

- pilot sources carry source type, artifact reference, domain, sensitivity, owner, status, and trust metadata
- privacy controls resolve to sources and reproduce readiness from redaction requirements and redaction state
- sampling policies define minimum case count, required domains, unseen-case requirements, synthetic-case policy, real-case ratio, source diversity, and governance-on-failure behavior
- pilot cases link to sources and privacy controls and preserve target, decision context, case kind, unseen-case status, expected use, and source summary
- normalization steps link cases to sources, preserve decision signals, remove sensitive data when redaction is required, and carry confidence
- expert panels define independent quorum and conflict policy
- adjudication rubrics define criteria and disagreement policy
- ingestion runs reproduce case count, domain coverage, real-case ratio, and privacy readiness from references
- ingestion failures trigger governance when policy requires governance, and cannot be reported as ready
- verifier success explicitly does not claim semantic truth, privacy-law compliance, or case representativeness

The guided elicitation verifier checks:

- profiles record the user's language, QIF familiarity, domain knowledge, explanation preference, and uncertainty signals
- explanations translate QIF concepts into plain language instead of repeating jargon
- question strategies explicitly remain anti-checklist
- probes link to sessions, strategies, and explanations, and avoid abstract QIF terminology without plain-language framing
- answer scaffolds are optional
- raw user answers are preserved before interpretation
- clarification moves link ambiguous answers to follow-up answers
- derived candidates cite raw answers and probes
- finalized candidates require accepted accurate teach-back checks
- low-confidence candidates trigger governance
- verifier success explicitly does not claim semantic truth or treat question count as quality

The world model elicitation verifier checks:

- each session is explicitly `level-4`
- each session starts with at least two competing Model Hypotheses
- each Model Hypothesis cites Raw Intent evidence
- each Discriminating Question compares at least two hypotheses
- expected answer branches eliminate at least one hypothesis
- Human Answers cite a question, sequence, or invariant candidate
- Hypothesis Eliminations leave at least one remaining hypothesis
- Counterexample Sequences include at least two transitions and use repeat, inverse, orthogonal, reference-frame, composition, or boundary exploration
- Sequence Expectations cite human answers and affected hypotheses
- Invariant Candidates cite source sequences and answers
- accepted invariants require accepted accurate confirmation
- low-confidence invariants trigger governance
- Derived World Models cite a selected hypothesis and confirmed invariants
- Acceptance Scenarios cite the derived model and source sequences
- Quality Intent Candidates cite acceptance scenarios and loss boundaries
- closed elicitation has zero unresolved hypotheses and all closure criteria met
- verifier success explicitly does not claim semantic truth or requirement completeness by question count

The action quality contract verifier checks:

- tool surfaces declare capabilities
- execution environments record isolation, identity, and network boundaries
- permission policies declare allowed scope, prohibited operations, and approval requirements
- approved approval gates include approval time
- approval persistence policies declare scope, expiry, identity boundary, and revocation conditions
- cross-run approval reuse requires canonical invocation binding
- tool guardrail policies define pre/post execution checks, tripwire behavior, and side-effect boundaries
- high-risk or write-like requests include both pre-execution and post-execution guardrail evidence
- context memory boundaries distinguish session history, local runtime context, agent memory, and LLM-visible context
- high-risk or write-like requests include context memory evidence
- expected transitions include stop conditions
- rollback plans link to expected transitions
- evidence requirements name the verdicts they support
- high-risk or write-like action contracts require approval gates
- action requests use the same tool surface as their contract
- runtime traces include spans and redact sensitive data when present
- approval-gated requests include trace approval evidence
- approval evidence links to a persistence policy when sticky approval or rejection was applied
- replayed or resumed tool calls remain bound to the original invocation
- tripwire-triggered guardrail evidence routes to governance
- accepted outcomes cannot have tripped or rejected guardrail evidence
- stale or untrusted context memory evidence routes to governance
- accepted outcomes cannot rely on stale or untrusted context memory evidence
- accepted approval-gated outcomes require approved trace approval evidence
- accepted outcomes match expected post-state
- low-confidence outcomes trigger governance

The authoring template verifier checks:

- authoring templates link instruction blocks, input contracts, output contracts, validation pipelines, golden cases, and scoring rubrics
- authoring templates link an untrusted input boundary
- authoring templates link an audience explanation contract
- instruction blocks declare prohibited claims and reject checklist-completion-as-quality language
- input contracts define required fields and missing-input policy
- untrusted input boundaries separate source material from agent instructions, block embedded instructions, and rank system/user instructions above source content
- audience explanation contracts target general-public comprehension, terms to avoid without explanation, required expression rules, simple diagrams, step-by-step questions, and comprehension checks
- diagram comprehension evidence records whether the intended audience could restate the diagram meaning, what they misunderstood, what was revised, and whether governance is needed
- output contracts target supported QIF package types and required entity families
- validation pipelines call local QIF validators
- golden cases include acceptance criteria
- scoring rubrics have reproducible weights and pass thresholds
- agent authoring runs do not store hidden reasoning
- conformance results link to validation pipelines and rubrics
- non-pass conformance results trigger governance
- verifier success explicitly does not claim semantic truth, agent authoring competence, or universal user comprehension
- verifier success explicitly does not claim semantic truth or tool execution safety

For quality gate packages (v0.4 baseline), the runtime verifier additionally checks:

- every Evaluation Perspective is a canonical perspective linked to Quality Intents
- every Quantitative Evidence Record carries a unit, measurement method, and interpretation rule, links to a Quality Intent and retained evidence, and stays evidence-only rather than being treated as quality itself
- every Automated Evaluation Detail reproduces its pass rate from its counts, and its counts sum to the executed count
- every Quality Gate Decision verdict links to evidence and reproduces its confidence from evidence inputs and the confidence policy
- the gate decision confidence reproduces from its verdict confidences
- each gated Quality Intent is covered by an Evaluation Perspective and has exactly one verdict
- an achieved verdict cites at least one supporting evidence item
- quality gate rules are enforced, not decorative: every intent a cited gate rule protects has a verdict, and a Go or Conditional Go satisfies each cited rule's required evidence types
- evidence item types and gate-rule required evidence types resolve against `evidenceTypeVocabulary`
- vocabulary-required `trust` and `findingEvidence` metadata is present
- required-before-decision evaluation timing rules have completed timing decisions before gate decisions proceed
- every evidence item cites an applicable evidence retention policy
- every Quality Report score and section decomposes into referenced gate decisions, gated Quality Intents, and verdict evidence
- a Go or Conditional Go decision includes a rollback plan, monitoring plan, approval owner, and residual risk
- a Conditional Go decision includes explicit conditions with owners and monitoring
- a No-Go decision cites a violated loss boundary or gate rule
- a Pending decision lists the missing evidence
- a high-severity loss boundary claimed achieved or partially achieved only on low-independence evidence triggers governance and cannot yield a Go
- a Go decision is blocked while a high-severity loss boundary verdict is not-achieved or inconclusive, or while a high-severity governance trigger remains open
- low-confidence, conflicting, or weak-evidence verdicts trigger governance review
- post-release reviews link high-severity incidents to improvement actions, and improvement actions cross-reference their source review
- traceability links resolve on both ends across every entity family

The verifier enforces structural integrity, traceability, reference resolution, confidence reproducibility, and rule compliance. It does not prove semantic truth; semantic validity requires expert review, reproduction tests, operational feedback, and governance.

`npm test` also runs a standing negative fixture suite (`tools/run-fixture-tests.mjs`). The retained invalid corpora under `tests/fixtures/qif-package/`, `tests/fixtures/expert-judgment/`, `tests/fixtures/discovery-session/`, `tests/fixtures/organizational-quality-culture/`, `tests/fixtures/evaluation-target/`, `tests/fixtures/review-run/`, `tests/fixtures/qif-ledger/`, `tests/fixtures/world-model-review/`, `tests/fixtures/world-model-calibration/`, `tests/fixtures/world-model-pilot-corpus/`, `tests/fixtures/guided-elicitation/`, `tests/fixtures/world-model-elicitation/`, `tests/fixtures/action-quality-contract/`, and `tests/fixtures/quality-gate/` must each be rejected with a specific error, so a covered verifier rule that is silently weakened or deleted fails the build. The committed corpora are generated from `tools/fixtures/*-cases.mjs` by `npm run build-fixtures`; the suite fails on drift if generated source of truth and committed files disagree. v0.6.0 retains 507 negative checks overall and adds Action Quality Contract coverage for permission, approval, rollback, trace, evidence, outcome, and governance behavior (see `docs/qif-roadmap.md`).


Action Quality Contract validation also checks containment policies, safe-exit criteria, monitoring signals, containment evidence, and incident routing for high-risk actions.


Action Quality Contract validation also checks delegated-agent handoff policies and evidence for authorization, context filtering, authority scope, lifecycle events, and governance routing.

## CLI

QIF includes a minimal local CLI entrypoint for validation and trace inspection:

```sh
node tools/qif.mjs validate examples/action-quality-contract-package.json
node tools/qif.mjs validate --all
node tools/qif.mjs validate --fixtures
node tools/qif.mjs trace ACT-AQC-001 examples/action-quality-contract-package.json
node tools/qif.mjs trace ACT-AQC-001 --all
```

`qif validate` routes each package to the correct local verifier from its `packageType` or legacy package shape. `qif trace <entity-id>` finds matching entities, outbound references, and inbound references across the provided packages or all committed examples. CLI success proves structural validity or reference visibility only; it does not claim semantic quality truth.
