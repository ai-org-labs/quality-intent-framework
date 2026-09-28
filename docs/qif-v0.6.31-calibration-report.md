# QIF v0.6.31 Calibration Report

## Purpose

A quality decision can say "confidence: 0.7". That number is not useful as a
prediction until later outcomes are compared with it.

QIF v0.6.31 adds a separate `calibration-report` package for that comparison.
It does not change the original gate decision and does not turn a score into a
quality verdict.

## Plain-Language Flow

```text
Earlier decision: "70% chance the protected outcome will hold"
                         |
                         v
Later observed result: held (1) or failed (0)
                         |
                         v
Calculate error and group similar predictions
                         |
                         v
State sample limits and route uncertainty to a named owner
```

The picture means: compare what was predicted with what later happened. It
does not mean that one score proves the decision was good or bad.

## Records

### Decision Outcome Pair

Links one quality-gate decision to one later review. It preserves:

- the source gate confidence;
- the probability used for calculation;
- why those two numbers may be treated as the same;
- who reviewed that interpretation;
- the observation window and evidence origin;
- the binary outcome used by the score.
- the original outcome-review Evidence Origin and the rationale for mapping the
  review to a binary outcome.

The identity mapping is intentionally narrow in v0.6.31. Existing QIF
confidence often means strength of evidence, not probability of future
success. A reviewer must confirm that the source number has the declared
probabilistic meaning before relying on the report.

### Calibration Policy

Defines the prediction meaning, outcome meaning, score rule, rounding,
minimum sample, empirical sample requirement, tolerance, and complete bucket
boundaries.

### Calibration Report

Lists the exact included and excluded pairs, evidence origins, reproduced
Brier score, non-empty calibration buckets, and the sample boundary. Its
`calibrationSignal` is evidence for review, not a quality verdict.

### Governance Trigger

Names who must act when data is insufficient, non-empirical, stale,
semantically mismatched, arithmetically inconsistent, or outside policy
tolerance.

## Calculation

For each included pair:

```text
error = (forecast probability - observed outcome)^2
Brier score = sum of errors / number of included pairs
```

For each non-empty probability bucket, QIF reproduces:

- pair membership;
- mean forecast probability;
- observed success rate;
- absolute gap between those values.

## What The Verifier Can Prove

The local verifier can prove that repository-local references resolve and
that the declared score, bucket membership, means, rates, gaps, sample counts,
evidence-origin counts, sufficiency state, signal, and governance routing are
consistent with the package.

It cannot prove:

- that the original confidence really was a probability forecast;
- that the cases are representative or independent;
- that a gate decision caused the later outcome;
- that the environment or evaluator was unbiased;
- that a low Brier score is quality;
- that the resulting quality decision is semantically correct.

## Commands

```sh
node tools/qif.mjs calibration-report
node tools/qif.mjs validate examples/calibration-report-package.json
npm test
```

The committed example is deliberately `insufficient-data` and example-only.
It demonstrates the contract without pretending to be empirical calibration.
