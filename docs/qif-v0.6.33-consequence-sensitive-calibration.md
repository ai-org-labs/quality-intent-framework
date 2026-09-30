# QIF v0.6.33 Consequence-Sensitive Calibration

## Purpose

Two forecasts can be wrong by the same amount and still have very different
consequences. A cautious delay may create inconvenience. A confident decision
to proceed may cross a loss boundary that the organization considers severe.

v0.6.33 makes that difference explicit, reproducible, and governable.

## Plain-Language Flow

```text
Quality Intent and loss boundary
              |
              v
Reviewed rule: when is confidence high enough to proceed?
              |
              v
Forecast says proceed or defer
              |
              v
Observed result says protected outcome held or failed
              |
              v
Classify: aligned / false alarm / false assurance
              |
              v
Apply local governance priority -> review severe errors
```

The diagram does not turn harm into a number. It shows how a declared policy
connects a decision to a real outcome and a named loss boundary.

## Three Records

### Consequence Policy

The policy owns:

- the source Quality Intent and exact loss-boundary statement;
- the loss-boundary severity;
- a reviewed threshold for `proceed` versus `defer`;
- separate false-assurance and false-alarm governance weights;
- minimum evidence and tolerated weighted-error rate;
- accountable reviewers and governance references.

For a high or critical loss boundary, false assurance must receive greater
priority than false alarm. The weights are meaningful only inside that policy.

### Decision Consequence

Each decision-outcome pair is classified mechanically:

| Forecast action | Observed outcome | Class |
| --- | --- | --- |
| proceed | held | aligned-proceed |
| defer | failed | aligned-defer |
| proceed | failed | false-assurance |
| defer | held | false-alarm |

The verifier reproduces the action, class, applicable weight, and weighted
error from the source forecast, outcome, and policy.

### Consequence Assessment

The assessment summarizes records under one policy. It reproduces class counts,
total applicable weight, total weighted error, and weighted-error rate. It also
checks evidence sufficiency and policy tolerance.

## Governance

Governance is required when:

- a high or critical boundary has a false-assurance outcome;
- a consequence policy is not active and reviewed;
- evidence is below the policy minimum;
- the weighted-error rate exceeds policy tolerance.

## What The Verifier Cannot Prove

The verifier cannot prove that:

- the threshold is morally, legally, or operationally correct;
- a weight measures money or the true magnitude of harm;
- weights can be compared between policies, teams, or domains;
- a low weighted-error rate means quality;
- a reproduced recommendation has authority to act.

Those questions require stakeholders, experts, operational evidence, and
accountable governance.

## Example Boundary

The committed example contains one example-only false-assurance outcome at a
high-severity financial-limit boundary. It is insufficient evidence, exceeds
the local tolerance, and remains governance-open.

## Verify

```sh
node tools/qif.mjs calibration-report
npm test
```
