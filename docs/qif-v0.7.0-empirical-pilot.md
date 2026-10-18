# QIF v0.7.0 Empirical Calibration Pilot Contract

## Purpose

QIF v0.7.0 starts the empirical-calibration phase without pretending that
repository examples are real-world evidence.

The pilot contract answers a practical question:

> Before an organization collects outcomes, what must it decide and preserve
> so the later calibration report is interpretable and auditable?

The answer is a prospective record. The outcome definition, domain, forecast,
observation window, and evidence requirements are fixed before the governed
decision. Later records preserve whether the outcome is still planned, being
observed, completed, missing, or excluded.

## Plain-Language Flow

```text
Agree on the pilot rules
        |
        v
Name each domain and outcome before decisions occur
        |
        v
Register a decision and its forecast
        |
        v
Wait for the declared outcome window
        |
        v
Record completed, missing, or excluded evidence honestly
        |
        v
Check whether evidence is ready for calibration analysis
```

The final check is not a quality verdict. It only states whether the declared
pilot structure and evidence prerequisites are present.

## Entities

### EmpiricalPilotProtocol

Owns the pre-registered pilot boundary: required domains, minimum non-software
coverage, minimum verified outcomes, accepted empirical origin kinds,
prospective-registration rule, missingness handling, reviewers, and governance.

It must not claim that the planned study is valid or representative.

### EmpiricalPilotDomain

Defines one domain-specific population, decision type, outcome meaning,
observation window, evidence requirements, and accountable owner. `domainClass`
keeps software and non-software plans distinguishable.

It must not let QIF decide that a domain is adequate.

### EmpiricalPilotEnrollment

Freezes one governed decision before it happens: source decision, domain,
forecast probability, confidence meaning, outcome definition, due time, and
evidence state. The verifier reproduces whether registration preceded the
decision.

QIF does not select participants or authorize the decision.

### EmpiricalOutcomeObservation

Preserves the outcome state as one of:

- `planned`
- `observing`
- `completed`
- `missing`
- `excluded`

Only `completed` may carry a binary observed outcome. It requires a verified
`observed-operational` or `historical-record` Evidence Origin, a closed
observation window, and evidence references. Missing and excluded records stay
visible with reasons; they are not silently removed.

### EmpiricalPilotAssessment

Reproduces domain coverage, prospective enrollment count, outcome-state counts,
verified empirical outcomes, sufficiency, and pilot state. The possible pilot
states are `not-started`, `collecting`, `ready-for-calibration-analysis`, and
`blocked`.

Counts are evidence about collection progress. They are never quality.

## Example Status

The committed example defines two planned domains:

- software development;
- customer support as a non-software domain.

It includes one prospectively ordered illustrative enrollment, but its outcome
is still `planned`, its evidence is `not-collected`, and the assessment is
`not-started` with `insufficient` data. This is intentional. The repository
does not fabricate an operational result to make the package look ready.

## Verifier Boundary

The verifier can prove declared structure, reference resolution, timestamp
ordering, exact domain and enrollment coverage, outcome-state consistency,
eligible Evidence Origin kinds, deterministic counts, and governance rules.

It cannot prove:

- study design validity;
- domain or case representativeness;
- causal attribution;
- evidence truth;
- calibration truth;
- quality, authorization, or decision authority.

Those require accountable domain review, independent evidence verification,
real elapsed observation time, operational feedback, and governance.

## Trend Rationale

This contract follows the current shift from development-only evaluation to
production monitoring and periodic human calibration. NIST AI 800-4 identifies
post-deployment ground truth, longitudinal tracking, baselines, drift, and
common terminology as open monitoring challenges. Anthropic recommends
combining automated evaluation, production monitoring, and periodic human
review. OpenAI's third-party evaluation guidance likewise treats claim scope,
harness choices, and validity checks as part of the result.

The QIF step beyond those practices is to preserve the *prospective decision
contract* before outcomes arrive, including missing and excluded evidence, so
later calibration cannot silently rewrite what was meant or what was sampled.
