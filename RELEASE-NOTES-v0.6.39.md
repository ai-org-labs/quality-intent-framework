# QIF v0.6.39: Adjudication Feedback and Rubric Revision

QIF can now trace an ambiguity from reviewer disagreement and adjudication into
an exact, reviewable, reversible rubric revision without changing rules
silently.

## Added

- Adjudication Feedback Observations grounded in preserved cases.
- Rubric Revision Candidates with exact old/new values, dissent, replay scope,
  and selected, rejected, and deferred alternatives.
- Accountable Rubric Revision Decisions.
- Implementation records with policy fidelity, replay status, immutable
  historical judgments, and rollback plans.
- Aggregate Rubric Revision Assessments, governance triggers, and retained
  negative fixtures.

## Boundary

Feedback volume, revision acceptance, replay count, and post-revision score
changes are evidence. They do not prove quality, truth, evaluator competence,
causality, or authority. Structural verifier success does not prove the revised
rubric is semantically better.

## Verification

Release verification requires the full `npm test` suite, AOF v12.2.0
organization verification, direction, self-review, Council review,
retrospective evidence, residue scanning, and remote tag/release verification.
