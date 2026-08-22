# QIF v0.6.1 Authoring Template Runtime

## Purpose

The Authoring Template Runtime makes QIF package authoring executable by AI agents, humans, or hybrid teams.

It does not replace QIF judgment. It defines how an agent should turn an input request into a structurally valid QIF package, how that output is validated, and how failures are governed.

## Boundary

QIF remains the quality-intent representation and evaluation framework. Authoring Template packages are an authoring-control layer.

They can prove:

- the template has explicit instructions, inputs, outputs, validation, examples, rubric, and conformance records;
- generated artifacts are checked by a local QIF verifier;
- failed or weak authoring results trigger governance.

They cannot prove:

- semantic quality truth;
- that an AI agent understands the domain;
- that the generated QIF package is the best possible package;
- that a human user understood every implication.

## Runtime Flow

```text
Authoring Template
-> Instruction Block
-> Input Contract
-> Output Contract
-> Validation Pipeline
-> Golden Case
-> Scoring Rubric
-> Agent Authoring Run
-> Conformance Result
-> Governance Trigger when conformance fails
```

## Core Entities

| Entity | Purpose | Must Own | Must Not Own |
| --- | --- | --- | --- |
| Authoring Template | A reusable recipe for generating one QIF package type. | Linked instructions, input contract, output contract, validation pipeline, golden cases, rubric, status. | Domain truth or final quality verdict. |
| Instruction Block | Stable authoring instructions for an AI or human. | Purpose, instruction text, prohibited claims, status. | Hidden reasoning or checklist-completion proof. |
| Input Contract | Required shape of the user's request or source material. | Input kind, required fields, missing-input policy, status. | Assumed facts not present in the input. |
| Output Contract | Required QIF package type and entity families. | Target package type, schema ref, example ref, required entity families, status. | Runtime validation results. |
| Validation Pipeline | Local validation command and success condition. | Output contract ref, command, success condition, negative fixtures. | Semantic approval. |
| Golden Case | A representative authoring scenario. | Input ref, output ref, expected output summary, acceptance criteria. | Broad coverage claims from one example. |
| Scoring Rubric | Human or AI grading rubric for generated output. | Weighted criteria, pass threshold, status. | Verifier result replacement. |
| Agent Authoring Run | A concrete attempt to generate a QIF artifact. | Template ref, golden case ref, agent ref, input summary, output artifact ref, status. | Hidden chain-of-thought. |
| Conformance Result | Recorded result of validating and scoring one authoring run. | Run ref, validation pipeline ref, rubric ref, verdict, score, governance refs when needed. | Proof of semantic correctness. |
| Governance Trigger | Reason authoring governance is needed. | Trigger type, reason, owner, status. | Governance decision outcome. |

## Executable Requirements

An authoring template package must:

- define every required entity family as an array;
- resolve all references between templates, contracts, pipelines, cases, rubrics, runs, and results;
- target only supported QIF package types;
- use a local QIF validator command;
- keep activity count, checklist completion, and structural verifier success out of the definition of quality;
- exclude hidden reasoning from stored evidence;
- route failed or weak authoring results to governance.

## Confidence and Governance

Conformance confidence comes from validation output, rubric score, reviewer evidence, and governance handling. It is not calculated from the existence of a generated file.

When a generated package fails validation, misses required entity families, falls below the rubric threshold, or depends on unclear input, the package should produce a governance trigger instead of silently passing.

## Example

The bundled example `examples/authoring-template-package.json` defines a template for generating a `quality-gate` package from a plain-language request. It requires:

- a plain-language input contract;
- a quality-gate output contract;
- local runtime validation;
- a golden case for a customer-support policy change;
- a scoring rubric for structural validity, traceability, loss-boundary clarity, and verifier-boundary honesty;
- a conformance result showing the sample run passed without storing hidden reasoning.
