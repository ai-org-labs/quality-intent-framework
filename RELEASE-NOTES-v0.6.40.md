# QIF v0.6.40: Policy Counterfactual Replay

QIF can now compare a preserved decision under its current route policy and a
reviewed candidate policy while keeping the evidence identical.

## Added

- Reviewed, non-authoritative Policy Counterfactual Variants with exact changes.
- Deterministic same-evidence Policy Counterfactual Replays.
- Reproducible baseline and candidate rule and route selection.
- Hypothetical loss-boundary impacts linked to source Quality Intents.
- Aggregate Counterfactual Assessments and governance triggers.
- 55 retained negative fixtures for replay, authority, evidence, impact, and
  semantic-boundary failures.

## Boundary

Counterfactual replay exposes how a candidate policy changes a declared result.
It does not establish what would have happened, which policy is better, or who
may authorize it. Replay count, route-change rate, and hypothesized impact
direction remain evidence, never quality, optimality, causality, competence,
selection, authorization, or authority.

## Verification

Release verification requires the full `npm test` suite, AOF v12.2.0
organization verification, direction, self-review, Council review,
retrospective evidence, residue scanning, and remote tag/release verification.
