# QIF v0.6.28 Evaluation Suite Health

## Purpose

Evaluation Suite Health records whether an evaluation setup is fit to support
its claim. A result is not trustworthy merely because the evaluator ran, a
score was produced, or many cases were counted.

## Plain-language model

```text
What are we evaluating?
          |
          v
Are the cases trustworthy and answerable?
          |
          v
Are grading, harness, and infrastructure reliable?
          |
          v
Who watches for change or failure?
          |
          v
healthy / provisional / degraded / blocked / stale
```

This diagram is a decision path, not a checklist score. A single material
failure can make the suite non-healthy even when the other dimensions look
good.

## Eight health dimensions

| Dimension | Question answered | Healthy state |
| --- | --- | --- |
| Task origin | Where did the cases come from, and what population do they represent? | `verified` |
| Contamination | Could the evaluated actor or grader already know the cases or answers? | `clear` |
| Solvability | Can a qualified actor solve the cases from the provided information? | `verified` |
| Saturation | Has the suite stopped separating meaningful capability differences? | `not-saturated` |
| Graders | Are human or automated judgments calibrated, and are disagreements governed? | `calibrated` |
| Harness | Can the same setup reproduce the evaluation conditions and result path? | `reproducible` |
| Infrastructure | Was the environment stable and correctly configured? | `stable` |
| Drift | Is someone accountable for detecting when cases, graders, tools, or context change? | `monitored` |

## Runtime rules

- Each `calibrationRun` links one or more records with
  `suiteHealthRecordRefs`.
- A health record links back to the same run, policy, and cases.
- Solvability review must cover the complete case set.
- `healthy` requires every dimension to have its healthy state, no unresolved
  cases, no saturation, verified observed or historical origins, and no
  unresolved health governance trigger.
- A non-healthy record must route its limitation through governance.
- A calibration run cannot conclude `calibrated` without a healthy linked
  suite record.

## Boundary

The verifier can prove declared structure, links, state consistency, and the
presence of governance routing. It cannot prove that contamination checking
was effective, cases are truly representative, graders are correct, the
harness is scientifically valid, or the suite predicts operational quality.
Those claims require source inspection, independent replication, expert
review, operational feedback, and governance.

Case counts, pass rates, review counts, and test counts remain evidence
signals. They never become quality or suite health by themselves.

