# QIF v0.6.44: Cross-Judge Correlation Calibration

## Purpose

Three judges saying the same thing is not automatically three independent
confirmations. They may use the same prompt, rubric, retrieval source,
evaluation harness, training lineage, organization, or reporting line.

v0.6.44 makes those shared dependencies visible before majority or unanimity
is trusted. It preserves each judgment, dissent, abstention, and adjudication.
It does not turn consensus into truth or authority.

## Plain-Language Flow

```text
Each judgment        How each judge was formed       What the panel means

Judge A -----\
Judge B ------>  Compare shared dependencies  ---->  Agreement + dependency risk
Judge C -----/       prompt / rubric / data           dissent stays visible
                    harness / lineage / org           uncertainty goes to governance
```

The useful question is not only "How many agreed?" It is also "Could the same
mistake have reached all of them through a shared source?"

## Entities

### Judge Dependency Policy

Defines which dependency dimensions must be declared and which are material.
It also defines minimum panel size and the permanent boundary that majority,
unanimity, confidence, and adjudication do not grant truth or authority.

### Judge Dependency Profile

Links exactly one Reviewer Judgment to its declared provider, model family,
prompt template, rubric, retrieval sources, harness, training lineage,
organization, and reporting line. Human, model, and hybrid judges use the same
shape because any of them can share dependencies.

### Cross-Judge Panel Assessment

Reproduces:

- exact verdict groups;
- majority, unanimity, split, or no-valid-quorum state;
- shared and independent dimensions;
- dependence and correlation-risk classification;
- dissent and unresolved-as-abstention references;
- evidence state and governance triggers.

A majority with material shared dependencies is correlated agreement evidence,
not independent confirmation.

### Cross-Judge Correlation Assessment

Aggregates referenced panels and reproduces dependent, independent, consensus,
adjudicated, unresolved, and verified panel counts. Evidence is sufficient only
when the reviewed policy's panel minimum is met, enough panels are verified,
and at least one panel is materially independent.

## Governance Rules

- A draft or retired dependency policy triggers review.
- Unverified or example-only dependency profiles trigger evidence review.
- Any material shared dependency triggers dependency-risk review.
- Majority or unanimity with a material shared dependency triggers correlated-
  agreement review.
- Too few, unverified, or entirely dependent panels trigger insufficient-
  evidence review.

## What The Verifier Proves

The verifier can prove declared structure, reference resolution, one-to-one
profile coverage, exact verdict grouping, shared-dimension reproduction,
derived classifications, count arithmetic, dissent preservation, and required
governance routing.

It cannot prove that declarations are factually complete, that judges are
semantically correct, or that a panel is representative. Those claims require
independent provenance review, human calibration, unseen cases, operational
feedback, and accountable governance.

## Sources

- [Anthropic: Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI: A shared playbook for trustworthy third-party evaluations](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)
- [Anthropic: How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- [NIST AI 800-3: statistical models for AI evaluation](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.800-3.pdf)
