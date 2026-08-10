# QIF v0.4.3 Core Fixture Coverage

## Claim

QIF v0.4.3 gives every implemented error branch in the two core package
verifiers a retained negative fixture:

| Verifier | Retained failing fixtures | Source of truth |
| --- | ---: | --- |
| `tools/validate-qif.mjs` | 68 | `tools/fixtures/qif-package-cases.mjs` |
| `tools/validate-expert-judgment.mjs` | 96 | `tools/fixtures/expert-judgment-cases.mjs` |
| Existing quality-gate surface | 57 | `tools/fixtures/quality-gate-cases.mjs` |
| Total | 221 | `tools/run-fixture-tests.mjs` |

The corpus is generated into `tests/fixtures/`, committed, drift-checked, and
executed by `npm test`. Each manifest names the rule and expected diagnostic.
A verifier branch that is removed or weakened causes its retained fixture to
pass unexpectedly and therefore fails the build.

## Covered Rule Families

The `qif-package` corpus covers:

- required package identity and top-level entity arrays;
- entity object shape, string IDs, and ID uniqueness;
- Mission, Risk, Knowledge Source, and Quality Intent required fields and refs;
- Evidence source/intent refs, confidence inputs, score bounds, and confidence
  reproduction;
- Indicator intent/risk refs and the activity-count/quality-itself guardrails;
- Evaluation policy, thresholds, verdict refs, confidence reproduction,
  decision thresholds, and contradictory evidence;
- Governance target/evidence refs; and
- Acceptance Gate artifact existence and passing criteria.

The `expert-judgment` corpus covers:

- required package identity and every top-level entity array;
- indexed entity object shape, IDs, and uniqueness;
- Knowledge Source, Case, Cue, Concern, and Loss Boundary rules;
- Expert Judgment refs, confidence, acceptance, evidence, and waiver rules;
- Decision Pattern refs, boundary, counterexample, confidence, reproduction,
  evidence, acceptance, and exception rules;
- Applicability Boundary and Counterexample structure;
- Quality Intent Derivation lineage;
- Reproduction Test unseen-case, expected-decision, agreement, and failure
  analysis rules;
- Organizational Quality Culture and review-history inference structure; and
- Acceptance Gate artifact existence and passing criteria.

## Explicit Rescope

The expert-judgment verifier has one non-error branch: a non-`candidate`
review-history inference emits a warning because the record can be inspected
without making the entire package structurally invalid. A retained negative
fixture must exit non-zero, so this warning is explicitly listed as a
`rescopedRules` entry in the generated expert-judgment manifest instead of
being misrepresented as failing coverage.

## Boundary

Complete negative coverage means the implemented structural rules are
regression-protected. It does not prove:

- that the validators contain every rule QIF ought to have;
- that a fixture represents every possible invalid package;
- that a structurally valid Quality Intent, judgment, evidence item, or verdict
  is semantically correct; or
- that confidence predicts real outcomes.

Those claims require later runtime coverage, independent conformance,
operational outcomes, calibration, and accountable governance.
