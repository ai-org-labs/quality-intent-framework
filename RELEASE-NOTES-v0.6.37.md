# QIF v0.6.37: Reviewer Disagreement Calibration

QIF now preserves independent reviewer judgments and makes disagreement and
adjudication reproducible instead of flattening them into consensus.

## Added

- Reviewer Disagreement Policies with independence and anti-aggregation rules.
- Reviewer Judgments with verdict, rationale, evidence, confidence, and role.
- Reviewer Disagreements with exact dimensions and verdict grouping.
- Adjudication Outcomes with authority, independence, evidence, and preserved
  originals.
- Reviewer Disagreement Assessments with deterministic counts, sufficiency,
  signal, and governance.
- 34 retained negative fixtures, bringing the suite to 847 negative cases.

## Boundary

Agreement, majority, seniority, confidence, and adjudication are evidence. They
do not prove semantic truth, quality, reviewer competence, blame, or authority.
QIF records reviewer identity only for traceability; these records must not be
used for employee surveillance or ranking.

## Verification

Release verification requires `npm test`, AOF v12.2.0 organization verification,
direction, review, self-review, retrospective evidence, public-residue scanning,
and remote tag/release verification.

