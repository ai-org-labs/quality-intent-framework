# QIF v0.6.42

## Sequestered Replay and Policy-Gaming Detection

This release adds an executable evaluation-integrity layer to the existing
judge robustness model.

- `SequesteredReplayProtocol` declares hidden items, reveal stages, access
  roles, allowed affordances, and required access and transcript evidence.
- `SequesteredReplayRun` records actual blindness state, observed affordances,
  externalized transcript inspection, contamination findings, and grader
  loopholes.
- `PolicyGamingAssessment` reproduces run, blindness, inspection, finding, and
  evidence counts and routes insufficient or adverse evidence to governance.
- Retained negative fixtures reject unsupported blindness, missing evidence,
  prohibited affordances, privacy violations, missing governance, automatic
  selection, and semantic overclaiming.

The verifier does not prove contamination freedom, honesty, competence,
quality, optimality, selection, authorization, or authority. The committed
example is deliberately `example-only`, `unknown`, and `insufficient`.

