# Quality Intent Framework

Quality Intent Framework (QIF) turns an organization's quality theory into an operational, AI-verifiable framework.

QIF does not define quality as output volume. Page count, review count, and test count are treated only as possible evidence signals when they are linked to a quality intent, a risk, and a loss boundary.

## Current Baseline

This repository contains the executable QIF baseline through v0.2.1, the v0.3.0 Discovery Layer design milestone, the v0.4.0 quality gate runtime baseline (release Go / Conditional Go / No-Go / Pending decisions with quantitative evidence, post-release review, and traceability), the v0.4.x retained runtime fixture frontier, and the v0.5.0 Living QIF Ledger baseline for cross-package references, Quality Intent lifecycle, missed-intent feedback, and agent trial/outcome records:

- Human-readable framework specification: `docs/qif-operational-framework.md`
- AI authoring guide: `docs/AI_AUTHORING_GUIDE.md`
- Expert judgment specification: `docs/expert-judgment-framework.md`
- QIF v0.2 runtime specification: `docs/qif-v0.2-discovery-application-runtime.md`
- QIF v0.2.1 consolidation review: `docs/qif-v0.2.1-consolidation-review.md`
- QIF v0.3 Discovery Layer design: `docs/qif-v0.3-discovery-layer-design.md`
- QIF pre-implementation review: `docs/qif-pre-implementation-review.md`
- QIF negative acceptance: `docs/qif-negative-acceptance.md`
- QIF v0.4 quality gate runtime requirements: `docs/qif-v0.4-quality-gate-runtime-requirements.md`
- QIF Quality Aspect taxonomy: `docs/qif-quality-aspect-taxonomy.md`
- QIF long-term roadmap: `docs/qif-roadmap.md`
- QIF v0.4.x release roadmap: `docs/qif-v0.4.x-release-roadmap.md`
- QIF v0.4.3 core fixture coverage: `docs/qif-v0.4.3-core-fixture-coverage.md`
- QIF v0.5 Living Ledger design: `docs/qif-v0.5-living-ledger.md`
- Quality theory summary: `docs/quality-theory-report.md`
- Canonical package schema: `schemas/qif-package.schema.json`
- QIF ledger package schema: `schemas/qif-ledger-package.schema.json`
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
- Example quality gate package: `examples/quality-gate-package.json`
- Local verifier: `tools/validate-qif.mjs`
- Local expert judgment verifier: `tools/validate-expert-judgment.mjs`
- Local runtime verifier: `tools/validate-qif-runtime.mjs`
- Local ledger verifier: `tools/validate-qif-ledger.mjs`
- Negative fixture suite runner: `tools/run-fixture-tests.mjs`
- Negative fixture case sources: `tools/fixtures/qif-package-cases.mjs`, `tools/fixtures/expert-judgment-cases.mjs`, `tools/fixtures/discovery-session-cases.mjs`, `tools/fixtures/organizational-quality-culture-cases.mjs`, `tools/fixtures/evaluation-target-cases.mjs`, `tools/fixtures/review-run-cases.mjs`, `tools/fixtures/qif-ledger-cases.mjs`, `tools/fixtures/quality-gate-cases.mjs`
- Retained negative fixture corpora: `tests/fixtures/qif-package/`, `tests/fixtures/expert-judgment/`, `tests/fixtures/discovery-session/`, `tests/fixtures/organizational-quality-culture/`, `tests/fixtures/evaluation-target/`, `tests/fixtures/review-run/`, `tests/fixtures/qif-ledger/`, `tests/fixtures/quality-gate/`
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

`npm test` also runs a standing negative fixture suite (`tools/run-fixture-tests.mjs`). The retained invalid corpora under `tests/fixtures/qif-package/`, `tests/fixtures/expert-judgment/`, `tests/fixtures/discovery-session/`, `tests/fixtures/organizational-quality-culture/`, `tests/fixtures/evaluation-target/`, `tests/fixtures/review-run/`, `tests/fixtures/qif-ledger/`, and `tests/fixtures/quality-gate/` must each be rejected with a specific error, so a covered verifier rule that is silently weakened or deleted fails the build. The committed corpora are generated from `tools/fixtures/*-cases.mjs` by `npm run build-fixtures`; the suite fails on drift if generated source of truth and committed files disagree. v0.5.0 retains 392 negative checks overall and adds Living QIF Ledger cross-package coverage (see `docs/qif-roadmap.md`).
