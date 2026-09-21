# QIF v0.6.29 Trial and Infrastructure Uncertainty

## Purpose

The same AI or process can produce different results when it is evaluated
again. CPU, memory, time limits, concurrency, network conditions, provider
load, and shared state can also change the result. QIF must show that
uncertainty instead of presenting one score as exact truth.

## Plain-language model

```text
Run the same evaluation more than once
                 |
                 v
Record each result and its environment
                 |
                 v
Recalculate the mean and observed range
                 |
                 v
Name infrastructure differences and confounders
                 |
                 v
sufficient / provisional / blocked / stale
```

The diagram means: a score is interpretable only together with how much it
varied and what else changed. More trials do not automatically mean better
quality.

## Canonical record

A `trialVarianceRecord` owns:

- the calibration run, suite-health record, and Evidence Origins it depends on;
- one metric and the repeated measurements used to summarize it;
- which measurements were included or excluded, with reasons;
- a reproducible trial count, mean, minimum, maximum, and observed range;
- infrastructure profiles for environment, runtime, resources, time limit,
  concurrency, incidents, and stability;
- controlled variables, known differences, and unresolved confounders;
- an observed uncertainty range and a minimum meaningful difference;
- status, governance routing, and an explicit assurance boundary.

## Runtime rules

- Each calibration policy states `minimumTrialCount`; it is an evidence
  sufficiency rule, not a quality score.
- Each calibration run and Trial Variance record link to each other.
- Included measurement references must exactly match included trials.
- Count, mean, minimum, maximum, observed range, and uncertainty bounds must
  reproduce from included values.
- Every measurement resolves to a declared infrastructure profile.
- `exactComparisonAllowed` must remain `false`; a point difference is not
  automatically a capability difference.
- `sufficient` requires the policy minimum, verified observed or historical
  origins, controlled or bounded infrastructure, stable profiles, no open
  confounders, and no unresolved governance trigger.
- A non-sufficient record must route its limitation through governance.
- A calibration run cannot conclude `calibrated` without a sufficient linked
  Trial Variance record.

## What the range means

QIF v0.6.29 uses the minimum and maximum included trial values as an
`observed-trial-range`. This is deliberately simple and reproducible. It is not
automatically a statistical confidence interval and must not be labeled as
one. More advanced interval methods require their own assumptions, evidence,
and reproducibility rules in a later release.

## Boundary

The verifier can prove declared structure, reference resolution, arithmetic
reproduction, status consistency, and governance routing. It cannot prove
trials are independent, infrastructure caused a score difference, the sample
represents future work, the evaluation is scientifically valid, or a measured
system has high quality. Those claims require experimental design, replication,
expert review, operational feedback, and governance.
