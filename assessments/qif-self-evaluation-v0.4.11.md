# QIF Self-Evaluation v0.4.11

## Scope

This assessment evaluates the QIF v0.4.11 release candidate after adding
retained negative fixture coverage for the `review-run` runtime verifier
surface.

## Verdict

Conditional Go.

The package is structurally executable and release-packaged. The standing
fixture suite now includes review-run invalid packages for target selection,
applicability decisions, evidence-backed verdicts, confidence reproduction,
governance triggers, activity-count boundaries, and verifier-boundary honesty.

## Evidence

- `npm test` passed with 7/7 positive package checks and 376/376 negative fixture checks.
- `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.11.json` passed.
- AOF v11.6.0 `organization-verify --project .` passed with 231/231 checks.
- Public-readiness scan found no personal account, email, legacy repository, user-home, or temporary checkout path residue outside `.git`.

## Boundary

The retained fixtures prove that covered structural verifier rules still fire.
They do not prove a review run's verdict is semantically correct.
