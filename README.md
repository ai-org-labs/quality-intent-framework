# Quality Intent Framework

Quality Intent Framework (QIF) turns an organization's quality theory into an operational, AI-verifiable framework.

QIF does not define quality as output volume. Page count, review count, and test count are treated only as possible evidence signals when they are linked to a quality intent, a risk, and a loss boundary.

## Current Baseline

This repository contains the executable QIF baseline through v0.2.1:

- Human-readable framework specification: `docs/qif-operational-framework.md`
- Expert judgment specification: `docs/expert-judgment-framework.md`
- QIF v0.2 runtime specification: `docs/qif-v0.2-discovery-application-runtime.md`
- QIF v0.2.1 consolidation review: `docs/qif-v0.2.1-consolidation-review.md`
- Quality theory summary: `docs/quality-theory-report.md`
- Canonical package schema: `schemas/qif-package.schema.json`
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
- Local verifier: `tools/validate-qif.mjs`
- Local expert judgment verifier: `tools/validate-expert-judgment.mjs`
- Local runtime verifier: `tools/validate-qif-runtime.mjs`
- AOF runtime log: `docs/aof-runtime-log.md`
- Changelog: `CHANGELOG.md`

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

The verifier enforces structural integrity, traceability, reference resolution, confidence reproducibility, and rule compliance. It does not prove semantic truth; semantic validity requires expert review, reproduction tests, operational feedback, and governance.
