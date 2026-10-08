# QIF v0.6.41: Judge Consequence and Abstention Robustness

QIF can now test whether the same evidence receives a different evaluator
outcome when downstream-use framing, consequence framing, or abstain
availability changes.

## Added

- Reviewed Judge Condition Variants with identical evidence snapshots.
- Six distinct Judge Robustness Trial outcomes.
- Accountable abstention review without hidden reasoning collection.
- Reproducible condition-sensitivity and sufficiency assessment.
- Governance for unverified, sensitive, unjustified, invalid, or insufficient results.
- 53 retained negative fixtures for evidence, taxonomy, authority, privacy,
  arithmetic, governance, and semantic-boundary failures.

## Boundary

The runtime records controlled differences. It does not prove why an answer
changed, that an expected label is true, or which judge should be selected.
Accuracy, abstention, refusal, malformed-output, and sensitivity counts remain
evidence, never quality, competence, optimality, authorization, or authority.

## Verification

Release verification requires the full `npm test` suite, AOF v12.2.0
organization verification, direction, self-review, Council review,
retrospective evidence, residue scanning, and remote tag/release verification.
