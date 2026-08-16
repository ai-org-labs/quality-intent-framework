# QIF v0.4.9

## Summary

QIF v0.4.9 extends retained negative fixture coverage to the
`organizational-quality-culture` runtime package surface.

This release protects the boundary that Organizational Quality Culture is
aggregation context, not a mandatory prerequisite or shortcut for deriving
Quality Intents.

## Highlights

- Added `tools/fixtures/organizational-quality-culture-cases.mjs`.
- Added committed invalid culture packages under
  `tests/fixtures/organizational-quality-culture/`.
- Extended `tools/run-fixture-tests.mjs` to run culture positive and negative
  checks.
- Increased standing fixture coverage to 5/5 positive checks and 294/294
  negative checks.
- Covered context-only aggregation, forbidden derivation-prerequisite misuse,
  required culture context fields, broken loss-boundary and pattern references,
  and grounding in multiple patterns or explicit provisional status.

## Verification

- `npm test` passed.
- Positive package checks: 5/5.
- Negative fixture checks: 294/294.
- `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.9.json` passed.
- AOF v11.4.0 `organization-verify --project .` passed with 231/231 checks.
- Public-readiness scan found no personal account, email, legacy repository, user-home, or temporary checkout path residue outside `.git`.

## Verifier Boundary

The retained fixtures prove that covered structural rules still fire. They do
not prove that an organizational culture summary is semantically complete or
correct.
