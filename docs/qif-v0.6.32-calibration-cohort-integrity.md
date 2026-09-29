# QIF v0.6.32 Calibration Cohort Integrity

## Purpose

A calibration calculation can be mathematically correct and still mislead.
The result depends on which decisions were included, which were excluded,
whether observations are duplicated or dependent, which outcomes are missing,
and whether one high-risk group is hidden by the aggregate.

v0.6.32 makes that population visible and reproducible.

## Plain-Language Flow

```text
All eligible decisions
        |
        v
Apply written include/exclude rules
        |
        v
Check missing outcomes and repeated/dependent observations
        |
        v
Show each important group beside the aggregate
        |
        v
Check change over time -> route unresolved risk to a named owner
```

The diagram does not say that a large or balanced sample is representative.
It says that another reviewer can reconstruct what was counted and see the
remaining limits.

## Calibration Cohort Record

Each record owns:

- eligible gate decisions and candidate decision-outcome pairs;
- structured inclusion and exclusion rules;
- reproduced included and excluded pairs;
- eligible decisions that still lack outcomes;
- the unit of analysis and duplicate-key fields;
- duplicate groups and known dependence risks;
- segment definitions and summaries;
- cohort coverage and outcome prevalence;
- drift comparison state;
- governance triggers and an evidence-only interpretation.

## Segment Protection

A segment definition names a dimension such as domain, outcome, or source
origin and identifies values that need special attention. QIF reproduces the
pair membership, count, outcome prevalence, and Brier score for every observed
segment value.

When a declared high-risk segment exceeds policy tolerance, the cohort must
route that finding to governance even if the aggregate appears acceptable.

## What The Verifier Can Prove

The verifier can reproduce rules, membership, exclusions, missing outcome
links, duplicate groups, independence status, segment arithmetic, cohort
summaries, baseline-reference consistency, and required governance routing.

It cannot prove:

- that the selected cohort represents future work or real users;
- that observations are statistically independent;
- that a balanced cohort reflects production prevalence;
- that a high coverage rate means quality;
- that an observed drift was caused by a specific change;
- that a cohort or calibration verdict is semantically correct.

## Example Boundary

The committed example contains one example-only observation. It exposes a
high-risk segment gap and has no drift baseline, so the cohort remains
`provisional` with open governance triggers.

## Verify

```sh
node tools/qif.mjs calibration-report
npm test
```
