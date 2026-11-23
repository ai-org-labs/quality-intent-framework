# QIF v0.8.21: Challenge Corpus Mutation and Coverage Calibration

## Purpose

QIF v0.8.21 checks whether a recovery challenge result survives controlled
variation. Replaying one fixed set of attacks can reveal known weaknesses, but
it cannot show that a monitor handles new forms of the same problem.

The runtime therefore records four kinds of corpus item:

- **seed:** the known starting scenario;
- **mutant:** a traceable variation of a seed;
- **holdout:** a sequestered variation not used to tune the target;
- **benign control:** a harmless lookalike used to expose false alarms.

## Flow

```text
seed case -> controlled mutation -> holdout and benign controls
                                      |
                                      v
                         challenger / target / judge
                                      |
                                      v
                         misses, false alarms, governance
```

Every derived item names its parent and mutation operator. Holdouts and benign
controls must be sequestered. The challenger, target harness, and judge must be
separate declared roles.

## Calibration

`RecoveryChallengeCorpusCalibration` reproduces:

- exact seed, mutant, holdout, and benign-control partitions;
- detected threats, missed threats, false alarms, and correct benign results;
- covered and previously unseen holdout mutation operators;
- holdout detection and benign false-alarm rates;
- evidence readiness, role separation, grade, and governance triggers.

A missing holdout, a missed threat, a false alarm, unverified evidence, or a
role conflict keeps the grade `insufficient`. Complete structure is necessary,
but it is not evidence of real-world robustness.

## Example Result

The committed example deliberately fails calibration. It misses a sequestered
cross-context holdout and flags a benign lookalike. This demonstrates that QIF
reports both sides of detection quality instead of rewarding raw alert volume.

## Boundaries

The verifier can reproduce declared lineage, partitions, observations, rates,
role separation, grades, and governance routing. It cannot prove corpus
completeness, mutation adequacy, holdout representativeness, generalization,
false-alarm acceptability, adversarial robustness, or operational safety.

Corpus counts, detection rates, and mutation scores are evidence. They are not
quality itself and do not authorize attacks, remediation, quarantine, or
re-entry.
