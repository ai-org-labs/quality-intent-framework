# QIF v0.5.5 World Model Elicitation

## Purpose

World Model Elicitation helps humans and AI agents converge ambiguous Level 4 requirements before World Model Review.

World Model Review detects missing concepts, relationships, states, events, invariants, coordinate systems, and assumptions. It assumes there is a world model to inspect. Level 4 work often starts earlier: the user can describe concrete behavior, but the underlying model is still ambiguous.

World Model Elicitation fills that gap.

## Runtime Flow

```text
Raw Intent
-> Model Hypothesis Generation
-> Discriminating Question
-> Human Answer
-> Hypothesis Elimination
-> Counterexample Sequence
-> Sequence Expectation
-> Invariant Candidate
-> Invariant Confirmation
-> Elicitation Closure Assessment
-> Derived World Model
-> Acceptance Scenario
-> Quality Intent Candidate
```

## Executable Entities

| Entity | Purpose |
| --- | --- |
| World Model Elicitation Session | Bounded Level 4 elicitation run for one target. |
| Raw Intent | Original ambiguous requirement before interpretation. |
| Model Hypothesis | One plausible world model that could satisfy the raw intent. |
| Discriminating Question | A question selected because it separates competing hypotheses. |
| Human Answer | Raw answer to a question, sequence, or invariant confirmation. |
| Hypothesis Elimination | Record of which hypotheses were removed by an answer and which remain. |
| Counterexample Sequence | Multi-step transition probe such as repeat, inverse, orthogonal, reference-frame, composition, or boundary. |
| Sequence Expectation | Human-confirmed expected outcome for a counterexample sequence. |
| Invariant Candidate | General rule induced from confirmed cases. |
| Invariant Confirmation | Teach-back confirmation for the induced invariant. |
| Elicitation Closure Assessment | Decision that elicitation is closed or still open. |
| Derived World Model | Selected model ready for World Model Review. |
| Acceptance Scenario | Executable scenario derived from the closed model. |
| Quality Intent Candidate | Candidate Quality Intent and loss boundary derived from the model. |
| Governance Trigger | Review route for unresolved hypotheses, low confidence, or closure conflict. |

## Level 4 Requirement Boundary

Level 4 work is not complete when the AI detects a missing world model. It is complete only when the ambiguous model has been narrowed enough to produce acceptance scenarios and candidate quality intents.

The runtime therefore requires:

- at least two competing model hypotheses;
- at least one discriminating question comparing hypotheses;
- expected answer branches that eliminate hypotheses;
- multi-step counterexample sequences, not only single examples;
- invariant induction from examples;
- confirmation of accepted invariants;
- closure criteria that explicitly show no unresolved hypotheses remain.

## Cube Golden Case

The example package uses a cube rolling control problem:

- raw intent: cube movement should feel consistent;
- competing hypotheses: cube-local frame, current-surface frame, world XYZ frame, fixed-camera frame;
- discriminating question: after `up -> backward`, does backward mean fixed-camera backward or cube/surface backward;
- counterexample sequences: `up -> up`, `up -> down`, `up -> left`, `down -> left -> down`, `up -> backward`;
- invariant: control frame is fixed to camera and does not change with cube orientation or current surface;
- closure: unresolved hypotheses are zero, acceptance scenario exists, and a Quality Intent candidate is derived.

See `examples/world-model-elicitation-package.json`.

## Verifier Rules

`tools/validate-world-model-elicitation.mjs` checks:

- all references resolve within the package;
- each session is explicitly `level-4`;
- each session starts with at least two model hypotheses;
- each hypothesis cites raw intent evidence;
- each discriminating question compares at least two hypotheses;
- expected answer branches eliminate at least one hypothesis;
- human answers cite a question, sequence, or invariant candidate;
- hypothesis elimination leaves at least one remaining hypothesis;
- counterexample sequences contain at least two transitions and use a supported exploration type;
- sequence expectations cite human answers and affected hypotheses;
- invariant candidates cite source sequences and answers;
- accepted invariants require accepted accurate confirmation;
- low-confidence invariants require governance;
- derived world models cite a selected hypothesis and invariants;
- acceptance scenarios cite the derived model and source sequences;
- Quality Intent candidates cite acceptance scenarios and a loss boundary;
- closed elicitation has zero unresolved hypotheses and all closure criteria met;
- verifier boundary refuses semantic-truth and question-count-completeness claims.

## Boundary

The verifier proves traceability and rule compliance. It does not prove that the selected world model is true, that the question had maximum information gain, or that the requirement is complete in the semantic sense.

Semantic validity requires human confirmation, expert review when risk requires it, World Model Review validation, implementation acceptance testing, and governance for unresolved ambiguity.

## Non-Goals

- No UI.
- No physics or algorithm research engine.
- No claim that the number of questions asked proves requirement completeness.
- No replacement for World Model Review.
- No claim that AI-selected hypotheses are automatically correct.
