# QIF v0.4.7

## Summary

QIF v0.4.7 adds executable Quality Reports to `quality-gate` packages.

Quality Reports are decomposable report views over gate decisions. They do not
create new quality proof, and their scores must not be treated as quality
itself.

## Highlights

- Added first-class `qualityReports` to the quality-gate schema.
- Added `reportedScores` and `sections` that must cite gate decisions, Quality
  Intents, and verdict evidence.
- Extended the runtime verifier to reject report scores or sections that cannot
  be decomposed into the referenced gate verdict evidence.
- Required report scores to use `report-summary-only` interpretation.
- Added six retained negative fixtures for Quality Report misuse.

## Verification

- `npm test` passed.
- Positive package checks: 3/3.
- Negative fixture checks: 245/245.
- `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.7.json` passed.
- AOF v11.2.0 `organization-verify --project .` passed with 231/231 checks.
- Public-readiness scan found no personal account, email, legacy repository, user-home, or temporary checkout path residue outside `.git`.

## Verifier Boundary

The verifier proves structure, traceability, reference resolution, confidence
reproducibility, decomposition of report scores into evidence-backed verdicts,
and rule compliance. It does not prove semantic quality truth.
