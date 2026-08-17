# QIF Self-Evaluation v0.4.10

## Scope

This assessment evaluates the QIF v0.4.10 release candidate after adding
retained negative fixture coverage for the `evaluation-target` runtime verifier
surface.

## Verdict

Conditional Go.

The package is structurally executable and release-packaged. The standing
fixture suite now includes evaluation-target invalid packages for identity,
supported domain, target type, artifact type, context, stakeholder impact,
operational impact, risk summary, and source evidence.

## Evidence

- `npm test` passed with 6/6 positive package checks and 309/309 negative fixture checks.
- `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.10.json` passed.
- AOF v11.4.0 `organization-verify --project .` passed with 231/231 checks.
- Public-readiness scan found no personal account, email, legacy repository, user-home, or temporary checkout path residue outside `.git`.

## Boundary

The retained fixtures prove that covered structural verifier rules still fire.
They do not prove an evaluation target description is semantically complete or
correct.
