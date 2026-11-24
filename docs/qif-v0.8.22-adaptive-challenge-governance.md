# QIF v0.8.22: Adaptive Challenge Promotion and Regression Governance

## Purpose

QIF v0.8.22 governs what happens after a controlled challenge reveals a miss,
false alarm, novel mutation, context shift, unflagged sample, or evaluation
objective leak. A discovery is not automatically a useful regression case.
It must retain provenance, receive an accountable and independently reviewed
lifecycle decision, and survive post-decision challenge evidence.

## Plain-Language Flow

```text
a challenge teaches us something
             |
             v
record why it was discovered
             |
             v
independent people review the choice
             |
     +-------+--------+
     |                |
     v                v
keep or revise     reject, retire,
as regression      or defer
     |
     v
run it again and preserve the result
     |
     v
govern unresolved, exposed, or failed cases
```

## Entities

### Recovery Challenge Discovery

Records the source runs and corpus items, selection state, discovery type,
novelty, evaluation-objective exposure, proposed item, and evidence. An
unflagged sample is valid only when it was selected before its outcome was
known. This prevents a convenient failure from being relabeled as a random
audit after the fact.

### Recovery Challenge Lifecycle Decision

Records a promote, retain, revise, retire, reject, or defer decision. It binds
the decider, independent reviewers, holdout exposure, evaluation-objective
exposure, post-decision runs, evidence, and rationale. It never performs the
decision automatically.

### Recovery Challenge Regression Family

Preserves the lineage of active and retired cases, the decisions that created
that lineage, and any still-sequestered holdouts. Active and retired items
cannot overlap. An exposed holdout may become a visible regression case, but
it is no longer protected evidence of unseen behavior.

### Recovery Challenge Lifecycle Assessment

Reproduces unresolved discoveries, unflagged-sample audits, exposed or
contaminated holdouts, evaluation-objective exposure, missing independent
review, and failed post-decision regressions. The grade is `insufficient`,
`provisional`, or `governed`; anything below `governed` remains under
governance.

## Governance Rules

- Preserve the discovery source and the point at which the sample was chosen.
- Separate challenger, target, judge, lifecycle decider, and reviewer roles
  where the decision depends on their independence.
- Treat visible or reused holdouts as exposed and replace them before making
  future unseen-case claims.
- Treat evaluation-objective awareness as a threat to transfer from evaluation
  behavior to operational behavior.
- Keep failed regressions as evidence; do not convert their existence into a
  robustness claim.
- Route unresolved discoveries, contamination, objective exposure, missing
  review, failed regression, missing unflagged audit, or unverified evidence
  to accountable governance.

## Verifier Boundary

The verifier can prove reference resolution, set partitions, role separation,
selection timing declarations, exposure declarations, lineage closure,
post-decision outcome reproduction, and trigger compliance. It cannot prove
that a lifecycle decision was wise, a promoted case is valuable, retirement
is safe, the corpus is free of overfitting, objectives were actually hidden,
an unflagged sample is representative, regressions are complete, or behavior
generalizes to operations.

Discovery counts, promotion rates, family sizes, and pass rates are evidence
about the process. They are not quality, robustness, or safety themselves.

