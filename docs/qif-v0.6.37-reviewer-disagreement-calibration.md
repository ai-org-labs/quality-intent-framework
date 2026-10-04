# QIF v0.6.37 Reviewer Disagreement Calibration

## Why This Exists

Two careful reviewers can inspect the same case and disagree. QIF must not hide
that disagreement behind a vote, an average score, or the most senior person.
It must show what each person judged, why, what evidence they used, and how any
later decision was made.

In plain language:

```text
same case
   |
   +--> reviewer A: timed out ----+
   |                              |
   +--> reviewer B: keep deferred +--> disagreement --> adjudication
                                                     |
                                                     +--> originals stay visible
```

The diagram is useful only if a reader can answer: "Who disagreed, about what,
using which evidence, and what changed afterward?" The package stores those
answers directly.

## Entities

| Entity | Simple meaning |
| --- | --- |
| Reviewer Disagreement Policy | The rules for collecting independent views and handling conflict. |
| Reviewer Judgment | One reviewer's verdict, reasons, evidence, confidence, and context. |
| Reviewer Disagreement | The exact points of conflict and the judgments on each side. |
| Adjudication Outcome | The accountable decision about what to do next, without deleting earlier views. |
| Reviewer Disagreement Assessment | A reproducible summary of whether enough independent, verified cases exist. |

## Required Behavior

1. Keep at least two independently identified judgments for each disagreement.
2. Preserve verdict, rationale, evidence, confidence, reviewer role, and
   independence group separately.
3. Reproduce verdict groups from the source judgments. Do not hand-edit the
   summary to manufacture consensus.
4. Name the dimensions that differ, such as verdict, rationale, evidence,
   scope, authority, confidence, or loss boundary.
5. Record adjudicator identity, authority, independence group, mode, rationale,
   evidence, and final disposition.
6. Keep every original judgment after adjudication. A selected or new judgment
   changes the operational decision; it does not rewrite history.
7. Route insufficient, unverified, unresolved, conflicted, or unpreserved
   evidence to governance.

## Adjudication Modes

- `clarify-rubric`: the rule itself was ambiguous.
- `request-evidence`: the case cannot be resolved with current evidence.
- `accept-plurality`: more than one interpretation remains legitimate.
- `select-judgment`: one existing judgment is selected with rationale.
- `new-judgment`: the adjudicator records a distinct disposition.
- `defer`: no accountable conclusion can yet be made.

None of these modes proves that the adjudicator is semantically correct.

## What The Verifier Proves

The local verifier proves structural facts: references resolve, independent
groups are recorded, verdict groups reproduce, required disagreement dimensions
are present, originals remain preserved, adjudication links are bidirectional,
assessment counts reproduce, and required governance triggers exist.

It does not prove reviewer competence, semantic correctness, fair authority,
representativeness, or quality. Those require accountable review, real evidence,
operational feedback, and governance.

## Example Boundary

The committed example contains one illustrative disagreement. One reviewer
calls the route `timed-out`; another says the protected action remains
`deferred`. The adjudicator records both facts and keeps the action deferred.
Because the evidence is example-only and there is only one case, the assessment
is `insufficient-data` and governance remains open.

## Commands

```sh
node tools/validate-calibration-report.mjs examples/calibration-report-package.json
npm test
```

