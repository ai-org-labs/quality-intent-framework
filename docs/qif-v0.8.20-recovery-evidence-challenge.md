# QIF v0.8.20 Recovery Evidence Challenge and Adversarial Validation

## Purpose

Recovery evidence can look independent on paper and still fail together, be
silently altered, contradict another source, disappear, or evade monitoring
when an interaction spans sessions. v0.8.20 adds a controlled way to challenge
those declarations before they are relied on.

This is an evidence model and local verifier. It does not attack live systems,
execute remediation, prove adversarial robustness, or authorize recovery.

## Plain-Language Model

```text
Declared recovery evidence
          |
          v
Choose a controlled challenge
          |
          v
Run it in an isolated harness
          |
          v
Record what was detected and exposed
          |
          v
Recalculate the declared grade
          |
          v
Route weaknesses or uncertainty to governance
```

The important question is not "How many challenges passed?" It is "Which loss
boundary remains exposed, under what condition, and what evidence supports
that conclusion?"

## Entities

### Recovery Challenge Protocol

Defines the independence assessment being challenged, required challenge
families, target evidence sources and attestations, declared failure domains,
isolated environment, stop conditions, and non-execution boundaries.

### Recovery Challenge Run

Records one bounded perturbation, its target sources, execution state,
observations, evidence, and reproduced outcome:

- `resisted`: observations report no exposed impact;
- `exposed`: impact was exposed and detected;
- `evaded`: impact was exposed but not detected;
- `inconclusive`: evidence cannot distinguish the outcome;
- `not-executed`: the controlled run did not occur.

### Recovery Challenge Observation

Records what the harness detected, what was exposed or resisted, which sources
or attestations were affected, and which shared failure domains surfaced.

### Recovery Challenge Assessment

Reproduces required, executed, missing, exposed, and evaded challenge types.
It starts from the declared recovery-independence grade and lowers the adjusted
grade to `insufficient` when required challenge coverage is missing or a
weakness is exposed.

## Required Challenge Families

| Family | Question |
| --- | --- |
| Source loss | Does the decision fail closed when a source disappears? |
| Evidence tamper | Is altered evidence detected before it is trusted? |
| Contradiction | Are incompatible sources exposed instead of silently merged? |
| Common cause | Can one failure disable supposedly separate evidence paths? |
| Multi-session | Can a weakness evade detection when context is split over time? |

These families are a minimum language for this release, not a universal threat
catalog. A protocol must still be designed for its target and loss boundary.

## Governance Rules

- Missing required challenge families trigger `recovery-challenge-incomplete`.
- Example-only or otherwise unverified evidence triggers
  `recovery-challenge-unverified`.
- Exposed weaknesses trigger `recovery-challenge-exposed`.
- Undetected exposed impact triggers `recovery-challenge-evasion`.
- Any unresolved challenge state triggers
  `recovery-challenge-review-required`.
- Every protocol and run remains controlled and non-executing.

## Verifier Boundary

The verifier can prove reference closure and reproduce declared coverage,
outcomes, exposed failure domains, adjusted grades, statuses, and required
governance triggers. It cannot prove that the challenge corpus is
representative, that an attacker could or could not bypass a defense, that
monitoring is complete, or that safety improved.

Semantic validity requires independent challenge-design review, trustworthy
execution evidence, operational feedback, and an accountable governance
decision.
