# QIF v0.7.2 Missingness and Attrition Sensitivity

## Purpose

QIF v0.7.2 makes unavailable outcomes visible before a calibration conclusion
is accepted. It preserves the prospectively registered eligible population,
classifies every enrollment exactly once, and shows whether a conclusion would
change under binary outcome bounds.

It does not guess missing outcomes or explain why they are missing.

## Plain-Language Flow

```text
Who was eligible?
       |
       v
Classify every case once
       |
       +--> observed
       +--> missing / excluded / withdrawn
       +--> delayed / untraceable
       |
       v
How much was actually observed?
       |
       v
Calculate worst and best possible bounds
       |
       v
Would the decision change?
       |
       +--> no: retain the bounded result
       +--> yes: governance review; no empirical conclusion
```

## Canonical Entities

### MissingnessPolicy

Owns the frozen eligibility source, the six allowed disposition classes,
coverage and decision thresholds, evidence rules, and governance behavior. It
forbids treating unavailable outcomes as successes and forbids optimizing
exclusions after outcomes are known.

### OutcomeDisposition

Classifies one eligible enrollment as `observed`, `missing`, `excluded`,
`withdrawn`, `delayed`, or `untraceable`. It records a reason, supporting
evidence, owner, and review state. It is classification evidence, not proof of
the causal missingness mechanism.

### MissingnessSensitivityAnalysis

Reproduces eligible, observed, and unavailable counts; the observed success
rate; best-case and worst-case binary success bounds; threshold decisions; and
whether the conclusion is sensitive to unavailable outcomes.

### MissingnessAssessment

Checks aggregate disposition coverage, class counts, observed coverage,
unexplained unavailable outcomes, sensitive analyses, evidence sufficiency,
and required governance triggers.

## Reproducible Arithmetic

Let `N` be all eligible enrollments, `O` observed outcomes, `U = N - O`
unavailable outcomes, and `S` observed successes.

```text
observation coverage       = O / N
observed success rate      = S / O, or unavailable when O = 0
worst-case success rate    = S / N
best-case success rate     = (S + U) / N
```

The observed success rate and observation coverage answer different questions
and must never be substituted for one another. Best and worst cases are
hypothetical bounds. They are not observed outcomes.

## Verifier Rules

The local verifier checks that:

- the eligible denominator comes from prospective enrollments;
- every eligible enrollment has exactly one disposition;
- observed dispositions link to completed binary observations;
- unavailable dispositions retain a null outcome value;
- counts, rates, bounds, and threshold decisions reproduce exactly;
- threshold-sensitive conclusions and insufficient assessments route to
  governance; and
- verifier-boundary language does not claim semantic truth.

The verifier can prove structure, references, arithmetic, and declared policy
compliance. It cannot prove the reason an outcome is unavailable,
representativeness, causality, statistical validity, calibration truth,
quality, authorization, or authority.

## Example Boundary

The committed example contains one eligible enrollment classified as delayed
and no completed empirical outcome. Its worst-case rate is 0 and best-case rate
is 1, so a 0.7 threshold conclusion is sensitive. The package therefore
remains example-only, collecting, insufficient, and governed. It is not
evidence that QIF is empirically calibrated.
