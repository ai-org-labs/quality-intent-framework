# QIF v0.6.39 Adjudication Feedback and Rubric Revision

## Why This Exists

When reviewers disagree, the problem may be the case, the evidence, or the
rule used to judge it. QIF already preserves disagreement and adjudication.
This release adds the missing next step: changing an unclear rule without
silently rewriting it.

## Simple Flow

```text
Reviewers disagree
        |
Adjudicator explains the decision
        |
What part of the rule was unclear?
        |
Proposed change + rejected/deferred alternatives
        |
Accountable approval, rejection, or deferral
        |
Implementation + replay + rollback plan
        |
Governance keeps uncertainty open
```

The feedback is only an input. It cannot change the rubric by itself.

## Five Records

| Record | Plain meaning |
| --- | --- |
| Adjudication Feedback Observation | Names the ambiguity, source disagreement, adjudication, evidence, and exact affected clause. |
| Rubric Revision Candidate | Shows old wording, proposed wording, alternatives, dissent, expected impact, and cases to replay. |
| Rubric Revision Decision | Records who reviewed and authorized approval, rejection, deferral, or a request for more evidence. |
| Rubric Revision Implementation | Records the actual change, replay state, evidence, preserved history, and rollback plan. |
| Rubric Revision Assessment | Reproduces counts, verification and replay sufficiency, signal, and governance. |

## What Must Be Preserved

- Original reviewer judgments and adjudication.
- The prior rubric value.
- Selected, rejected, and deferred alternatives with reasons.
- Dissent and source evidence.
- The authority that made the decision.
- Replay scope and result.
- A practical rollback path.

## Verifier Boundary

The verifier checks structure, references, exact clause values, alternative
dispositions, authority fields, implementation fidelity, replay state, counts,
signals, and governance triggers. It does not prove that the revised rubric is
better, true, fair, safer, or operationally authorized.

The committed example is intentionally incomplete: one example-only
adjudication produces a bounded clarification, but replay is pending and the
evidence is not verified. That keeps the learning claim open instead of turning
one case into a universal rule.

## Trend Basis

- OpenAI describes grader prompts as iterative and recommends adding discovered
  edge cases to grader evaluations.
- NIST ARIA combines model testing, red teaming, and user testing in customized
  evaluation plans.
- Recent judge research shows that rubric wording and downstream consequences
  can alter classification behavior, so a wording change requires replay and
  explicit uncertainty rather than automatic adoption.
