# QIF v0.4.8

## Summary

QIF v0.4.8 extends retained negative fixture coverage to the
`discovery-session` runtime package surface.

This release reduces implementation ambiguity around expert-judgment discovery:
raw expert answers, question logs, extraction steps, derived entities, and
session-local provenance now have committed invalid packages that must fail
with specific verifier errors.

## Highlights

- Added `tools/fixtures/discovery-session-cases.mjs`.
- Added committed invalid discovery-session packages under
  `tests/fixtures/discovery-session/`.
- Extended `tools/run-fixture-tests.mjs` to run discovery-session positive and
  negative checks.
- Increased standing fixture coverage to 4/4 positive checks and 279/279
  negative checks.
- Covered raw-answer traceability, sensitive-data handling, extraction-step
  output justification, package-level extraction coverage, and session-local
  provenance.

## Verification

- `npm test` passed.
- Positive package checks: 4/4.
- Negative fixture checks: 279/279.
- `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.8.json` passed.
- AOF v11.3.0 `organization-verify --project .` passed with 231/231 checks.
- Public-readiness scan found no personal account, email, legacy repository, user-home, or temporary checkout path residue outside `.git`.

## Verifier Boundary

The retained fixtures prove that covered structural rules still fire. They do
not prove that extracted expert knowledge is semantically correct.
