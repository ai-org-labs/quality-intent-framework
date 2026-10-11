# QIF v0.6.45: Evaluator Signal Leakage

## Purpose

An evaluator can behave differently when told that a task is an evaluation,
what a grader prefers, which answer earns reward, or that a result affects
deployment. A strong result under those signals may not transfer to a setting
where the signals differ.

v0.6.45 tests that risk without reading minds. It records only declared signal
changes and externalized behavior. It never claims to discover belief, intent,
deception, honesty, truth, competence, or authority.

## Plain-Language Flow

```text
Same case + same evidence + same tools + same output contract
                         |
              -----------------------
              |                     |
       No evaluator cue       Evaluator cues shown
              |                     |
       External action A      External action B
              \_____________________/
                         |
        Compare observable behavior only
                         |
       Change or uncertainty -> governance
```

The diagram is valid only if a reader can explain it back as: "We changed the
message about evaluation, not the case or available evidence, and compared
what the evaluator actually did."

## Entities

### Evaluator Signal Policy

Declares allowed signal dimensions, minimum trial evidence, the matched-
condition rule, and the permanent inference boundary.

### Evaluator Signal Variant

Records a baseline or comparison condition. Each comparison names the changed
signal dimensions and exact message digests. Evidence, affordances, and output
contract digests remain identical.

### Evaluator Signal Trial

Links one baseline and one comparison. It preserves externalized evidence,
stated explanations as non-authoritative evidence, optional observed outcomes,
and a reproducible behavior-change flag. Hidden reasoning is never required.

### Evaluator Signal Assessment

Reproduces trial, verified-evidence, changed, and unchanged counts. Insufficient
or changed behavior is routed to governance. Counts are evidence volume, not
quality.

## Governance Rules

- Draft or retired policies require accountable policy review.
- Unverified or example-only variants and trials require evidence review.
- A mismatch in case, evidence, affordances, or output contract invalidates the
  matched comparison and requires correction or exclusion.
- Observable behavior change requires transfer-risk review.
- Too few or insufficiently verified trials require more evidence.

## What The Verifier Proves

The verifier proves declared structure, reference resolution, matched digests,
allowed signal dimensions, external-evidence presence, behavior-change
reproduction, aggregate arithmetic, and governance routing.

It cannot prove that the declarations are complete, why behavior changed, what
an evaluator believed, whether anyone deceived a grader, whether an evaluator
is competent, or whether a result transfers to deployment. Those questions
require independent operation, human review, unseen cases, observed outcomes,
and governance.

## Sources

- [OpenAI: A shared playbook for trustworthy third-party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)
- [OpenAI: Detecting and reducing scheming in AI models](https://openai.com/index/detecting-and-reducing-scheming-in-ai-models/)
- [Anthropic: Bloom, an open-source tool for automated behavioral evaluations](https://www.anthropic.com/research/bloom)
- [NIST: AI models can cheat on evaluations](https://www.nist.gov/caissi/1-background-ai-models-can-cheat-evaluations)
