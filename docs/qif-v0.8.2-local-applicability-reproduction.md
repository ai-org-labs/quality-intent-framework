# QIF v0.8.2: Local Applicability and Reproduction

## Purpose

QIF v0.8.1 can preserve foreign Decision Patterns and Quality Intents without
silently activating them. v0.8.2 answers the next question: does this imported
knowledge fit a named local target, and can a different evaluator reproduce its
decision on cases that were not used to create it?

`PortableKnowledgeAssessment` remains the historical import-time assessment.
It records what was unresolved when the candidate entered the local ledger.
The four v0.8.2 entities add a later local-validation stage; they do not rewrite
that earlier decision or erase its governance history. Import-time applicability,
counterexample, and assessment triggers close when that work is completed;
remaining source-trust and evidence gaps stay open under separate triggers.

The answer remains bounded. A passing structural assessment makes an item
eligible to be considered by governance. It does not activate the item, grant
authority, prove that an evaluator is genuinely independent, or prove semantic
fitness for operational use.

## Plain-Language Flow

```text
Imported candidate
        |
        v
Name the local target
        |
        v
Compare seven local dimensions
        |
        v
Try unseen cases and every counterexample
        |
        v
Reproduce agreement and evidence state
        |
        v
Eligible for governance, or blocked with a reason
```

The seven dimensions are context, stakeholder impact, risk, domain, loss
boundary, artifact type, and operational impact. A team must record both
matches and mismatches. It must not hide a mismatch inside one confidence
score.

## Entities

### PortableKnowledgeLocalValidationPolicy

Owns the required dimensions, minimum unseen-case count, minimum agreement,
source and evidence requirements, evaluator separation, counterexample
challenge, and permanent non-activation/non-authority boundaries.

### PortableKnowledgeApplicabilityDecision

Connects one imported item to one local Evaluation Target. It records the
dimensions examined, concrete matches, concrete mismatches, evidence,
decision, rationale, confidence, reviewer, and governance route.

### PortableKnowledgeReproductionTrial

Connects the same item and target to source cases, unseen cases, evaluator
identity, expected decisions, observed decisions, reproduced agreement,
counterexample outcomes, evidence state, and result. Hidden reasoning is not
stored or requested.

### PortableKnowledgeLocalValidationAssessment

Reproduces aggregate counts, source trust, unresolved counterexamples,
evidence status, sufficiency, and activation eligibility. Counts are evidence,
not quality. `eligible-for-governed-activation` means only that the record may
be submitted to an accountable governance decision.

## Executable Rules

The local verifier rejects a package when:

- a target or case reference does not resolve;
- a decision omits any required applicability dimension;
- an `applicable` decision retains an ungoverned mismatch;
- an unseen case overlaps a source case;
- expected or observed decisions do not cover unseen cases exactly once;
- the recorded agreement does not reproduce from case decisions;
- evaluator identity separation is recorded incorrectly;
- any imported counterexample is not challenged exactly once;
- trial result or assessment sufficiency does not reproduce;
- example-only or unverified evidence lacks governance;
- insufficient validation is marked eligible;
- eligibility is treated as activation, authority, or semantic truth.

## Example Boundary

The committed ledger tests two imported items against an operations target and
two unseen cross-domain cases. Both trials reproduce the expected decisions and
challenge all preserved counterexamples. The assessment still returns
`not-eligible` because the source trust and local evidence are example-only.
This is intentional: a worked example demonstrates the runtime but cannot
promote itself into operational evidence.

## What the Verifier Proves

It proves reference resolution, declared identity separation, exact case-set
separation, arithmetic reproduction, policy compliance, and governance
routing. It can calculate agreement and eligibility from recorded inputs.

It does not prove source authenticity, real evaluator independence,
representativeness, counterexample completeness, evidence truth, semantic
applicability, approval, authorization, or authority. Those require accountable
review, verified local evidence, operational feedback, and governance.

