# QIF Core in Plain Language

## What QIF Is

QIF is a way to make quality judgments explicit, evidence-backed, reproducible,
and challengeable. Humans, AI agents, and hybrid organizations can use it.

QIF is not an agent. It is a representation and evaluation framework an agent
can follow.

## Core Chain

```text
mission or need
      |
      v
unacceptable loss
      |
      v
quality intent
      |
      v
evidence and uncertainty
      |
      v
verdict and governance
```

- **Need:** the real problem or loss to address.
- **Quality Intent:** a contextual statement of what must be protected.
- **Risk:** a possible path to unacceptable loss.
- **Loss Boundary:** the point the organization is not willing to cross.
- **Evidence:** an observed or sourced item relevant to a claim.
- **Finding:** an interpretation tied to evidence and scope.
- **Verdict:** an accountable decision supported by applicable evidence.
- **Governance Trigger:** a reason the decision needs review, escalation, or
  revision.

## Discovery

When Quality Intents are unknown, do not ask, "What is quality?" Ask about
concrete cases:

- What outcome would make this a failure?
- Who would be affected?
- What did you notice first?
- What would make this acceptable?
- What evidence would make you comfortable?
- When would this concern not apply?

Turn answers into cues, concerns, loss boundaries, reusable decision patterns,
and candidate Quality Intents. Keep inferred knowledge provisional until it is
tested on unseen cases and can be reproduced by another person or AI.

## Evaluation

1. Describe the target and context.
2. Select only applicable Quality Intents and explain inclusion and exclusion.
3. Define evidence needed before looking for convenient evidence.
4. Record evidence origin, trust, freshness, reproduction, and limitations.
5. Produce a verdict for each intent.
6. Preserve residual risk and route uncertainty to accountable governance.

## World-Model Work

Some requirements cannot be evaluated because the intended world is unclear.
Check concepts, relationships, states, events, invariants, coordinate systems,
perspectives, and assumptions. Say exactly what is missing and which decision
it prevents. Use competing hypotheses and questions that distinguish them.

## Structural and Semantic Boundaries

A schema or verifier can prove that fields exist, references resolve, arithmetic
reproduces, and declared rules are followed. It cannot prove that the model of
the world is correct, evidence is honest, a decision is wise, or stakeholders
accept the risk. Those require semantic review and observed outcomes.
