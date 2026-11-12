# World-Model Elicitation

Use this mode when the target depends on original concepts, state rules,
spatial relations, coordinate systems, perspectives, or interactions that are
not yet precise enough to review.

## Required Model Elements

- concepts and identities;
- attributes and units;
- relationships and cardinality;
- states, events, transitions, and illegal transitions;
- invariants and loss boundaries;
- coordinate frames, origin, axes, orientation, handedness, scale, and units;
- observer or actor perspective;
- time model, ordering, concurrency, and persistence;
- assumptions, exceptions, and applicability boundaries;
- representative examples and counterexamples.

## Elicitation Loop

```text
Raw Intent
-> Competing Model Hypotheses
-> Discriminating Question
-> Human Answer
-> Hypothesis Elimination or Revision
-> Counterexample / Sequence Exploration
-> Candidate Invariant
-> Confirmation or Refutation
-> Gap Review
-> Closure
```

Keep multiple plausible models until evidence distinguishes them. Do not select
the first model that makes one example work.

## High-Value Questions

Generate the smallest question that separates the most competing hypotheses.
For each question record:

- hypotheses being compared;
- concrete scenario;
- expected answer under each hypothesis;
- answer received;
- hypotheses eliminated or retained;
- model update and remaining ambiguity.

Probe repetition, inverse operations, boundaries, orthogonal operations,
composition, reference-frame changes, and recovery sequences. Ask for expected
outcomes on concrete cases before proposing an invariant.

## Concrete Gap Language

Bad:

```text
The coordinate system is unclear.
```

Better:

```text
"back" has no declared reference frame. After the object moves onto a wall,
the requirement does not say whether "back" follows world coordinates, the
object's local orientation, the current surface, or a fixed camera. These
models produce different results for Up -> Back. Ask for that expected result
and declare the control-frame invariant before implementation.
```

## Closure

Close elicitation only when unresolved material hypotheses are zero, major
transitions have discriminating cases, candidate invariants survived relevant
counterexamples, terms and frames are explicit, and acceptance scenarios can
be generated. Closure is scoped and revisable.
