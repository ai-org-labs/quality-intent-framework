---
name: quality-intent-framework
description: Discover context-specific quality intent, find requirement and non-functional gaps, define target-specific quality checks, and produce evidence-backed QIF reviews or artifacts. Use when evaluating a repository, document, requirement, product, service, operation, or expert judgment; when the user asks what must not fail; or when quality, risk, evidence, verdict, world-model, or acceptance criteria need to be made explicit. Do not use for generic copyediting or for merely running tests without interpreting quality risk.
metadata:
  author: ai-org-labs
  version: "0.8.13"
---

# Quality Intent Framework

Use QIF to discover what quality means for the actual target, then connect the
protected loss boundary to evidence and an explainable verdict. QIF is not a
fixed checklist and this skill is not an autonomous authority.

## Start Here

1. Inspect the supplied target and available evidence before judging it.
2. State `Need`, `Intent`, and `Context`. Do not turn the raw request directly
   into a project, checklist, or verdict.
3. Ask what must not fail, who could be harmed, and what loss is unacceptable.
4. Select only the QIF mode needed for the request.
5. Preserve unknowns and disagreements. Never invent evidence to complete a
   framework field.

For the shared model and non-negotiable boundaries, read
[references/core-model.md](references/core-model.md).

## Select A Mode

| User need | Mode | Read |
| --- | --- | --- |
| Discover quality intent from a vague request, documents, operations, or stakeholder answers | Discovery | [references/discovery.md](references/discovery.md) |
| Review a target or find missing functional, non-functional, security, usability, performance, UX, operational, or organizational requirements | Evaluation | [references/evaluation.md](references/evaluation.md) |
| Define target-specific quality checks or acceptance criteria | Evaluation, then authoring | [references/evaluation.md](references/evaluation.md), [references/packages-and-cli.md](references/packages-and-cli.md) |
| Resolve ambiguous concepts, states, relationships, spatial frames, or rules | World-model elicitation | [references/world-model.md](references/world-model.md) |
| Convert veteran or expert judgment into reusable decision patterns | Expert-judgment discovery | [references/discovery.md](references/discovery.md) |
| Create, validate, trace, or inspect a QIF JSON package | Package authoring | [references/packages-and-cli.md](references/packages-and-cli.md) |

Use more than one mode only when the output of the first is genuinely required
by the next. Do not load every reference by default.

## Shared Decision Flow

Use the narrowest useful portion of this flow:

```text
Need / Intent / Context
-> Evaluation Target and Stakeholders
-> Risks and Loss Boundaries
-> Quality Intents
-> Applicability Decisions
-> Evidence and Trust
-> Findings and Confidence
-> Verdict
-> Residual Risks and Governance Triggers
```

Activity counts such as pages, reviews, tests, findings, or prompts are not
quality. They may be evidence only when linked to a quality intent and loss
boundary.

## Evidence Rules

- Separate observed facts, source claims, inferences, and recommendations.
- For AI-generated findings, record origin, reproducibility, false-positive
  checking, impact confirmation, and final status.
- Record trust sources, generator, verifiers, status, and staleness.
- Lower confidence or route to governance when evidence conflicts, is stale,
  is not independently reproduced, or does not cover the loss boundary.
- A structurally valid QIF package does not prove semantic truth, safety,
  business acceptance, reviewer competence, or decision authority.

## Output

Explain the result in language the intended user can understand. Include:

1. the protected failure or loss;
2. what applies and why;
3. evidence actually examined;
4. concrete gaps, each with impact and needed evidence or action;
5. verdict and confidence;
6. residual risks, unknowns, and governance owner;
7. a simple diagram when it improves understanding, followed by a teach-back
   question that checks whether the diagram communicated the intended model.

Use [assets/qif-review-template.md](assets/qif-review-template.md) when a
reusable review document is useful.

## Deterministic Tools

When this bundle contains `runtime/`, run the canonical QIF CLI through:

```bash
node scripts/run-qif.mjs commands
node scripts/run-qif.mjs validate <package.json>
node scripts/run-qif.mjs trace <entity-id> <package.json>
node scripts/run-qif.mjs open-risks <package.json>
```

In a QIF source repository, the same wrapper locates the repository runtime.
Do not claim verifier success establishes semantic quality. Do not run write or
high-impact external actions without the user's authorization at the point of
action.

## Stop Conditions

Stop and ask one plain-language question when a missing answer would materially
change the loss boundary, applicable intent, coordinate frame, or authority.
Route to human governance instead of forcing a verdict when risk acceptance,
waiver, escalation, or organizational authority is unresolved.
