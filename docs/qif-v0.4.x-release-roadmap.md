# QIF v0.4.x Release Roadmap

This roadmap turns the long-term QIF roadmap into near-term release slices.

The v0.4.x line is a hardening line. Its purpose is to close the executable runtime gap without redesigning QIF's core model.

## Release Principle

Release when a slice has:

- a clear Quality Intent and loss boundary;
- retained examples or fixtures that make the claim executable;
- `npm test` evidence;
- AOF runtime evidence using the latest available AOF release;
- no local path, personal account, or private-machine residue;
- no semantic-truth claim from structural verification.

## v0.4.1 - Retained Fixture Expansion

Status: implemented for release.

Intent: expand verifier regression resistance beyond the quality-gate verifier.

Scope:

- generalize retained fixture execution across multiple corpora;
- add selected `qif-package` negative fixtures;
- add selected `expert-judgment` negative fixtures;
- preserve the existing quality-gate corpus and drift check.

Exit evidence:

- `npm test` passes;
- fixture suite reports 3/3 positive checks and 58/58 negative checks;
- AOF review provenance resolves for the implementation task.

## v0.4.2 - Complete Core Fixture Coverage

Intent: finish rule-by-rule retained negative coverage for the core package verifiers.

Scope:

- complete `qif-package` negative fixture coverage;
- complete `expert-judgment` negative fixture coverage;
- document uncovered rules explicitly if any are intentionally rescoped.

Exit evidence:

- every structural rule in `tools/validate-qif.mjs` and `tools/validate-expert-judgment.mjs` has at least one retained failing fixture;
- deleting or weakening any covered rule breaks `npm test`.

## v0.4.3 - Runtime Package Fixture Coverage

Intent: extend retained negative coverage to runtime package surfaces.

Scope:

- discovery-session;
- organizational-quality-culture;
- evaluation-target;
- review-run;
- shared runtime verifier guardrails.

Exit evidence:

- retained invalid fixtures exist for every implemented runtime verifier rule;
- coverage gaps are recorded as explicit follow-on work, not silent omissions.

## v0.4.4 - Evidence Vocabulary And Retention

Intent: make evidence naming and retention policies executable.

Scope:

- evidence-type vocabulary record;
- required evidence type matching against declared vocabulary;
- evidence retention policy;
- sensitivity and integrity metadata guardrails.

Exit evidence:

- example package validates;
- invalid vocabulary, retention, sensitivity, or integrity references fail local verification.

## v0.4.5 - Timing And Report Discipline

Intent: make evaluation timing and reporting structurally auditable.

Scope:

- Evaluation Timing Rule;
- Evaluation Timing Decision;
- Quality Report;
- score/report decomposition into referenced verdicts and evidence.

Exit evidence:

- a report that cannot decompose into verdicts and evidence fails verification;
- timing decisions record reusable rule and target-specific rationale.

## Gate To v0.5

Move to v0.5 only after v0.4.x can demonstrate:

- all implemented verifier rules have retained negative fixtures or explicit rescope rationale;
- every v0.4 requirements entity is either executable or explicitly deferred;
- the verifier boundary still says structural verification is not semantic truth.
