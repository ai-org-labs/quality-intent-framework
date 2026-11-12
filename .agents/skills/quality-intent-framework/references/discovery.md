# Quality Intent Discovery

Use this mode when quality intent is not already explicit.

## Sources

Prefer concrete evidence from the available source types:

- stakeholder interviews and concrete cases;
- requirements, policies, regulations, contracts, and operating procedures;
- incidents, complaints, audit records, review history, tickets, and meeting
  decisions;
- observed operations and workarounds;
- expert judgments and counterexamples.

Treat inferred patterns as candidates until validated.

## Conversation Pattern

Ask one answerable question at a time. Begin with concrete outcomes rather
than quality terminology:

1. What is the target and who relies on it?
2. What outcome would make this a failure?
3. Who would be harmed, blocked, misled, or forced into recovery work?
4. What did you notice first in a concrete acceptable or unacceptable case?
5. What changed the judgment?
6. What evidence would make the stakeholder comfortable?
7. Under what condition could the concern be waived, and by whom?
8. What would a less experienced person or AI likely miss?

When the user cannot answer, explain the concept with one concrete example and
offer an optional scaffold. Preserve ambiguity instead of selecting an answer
for them.

## Expert Judgment Path

```text
Concrete Case
-> Expert Judgment
-> Cue
-> Concern
-> Loss Boundary
-> Decision Pattern
-> Applicability Boundary and Counterexample
-> Reproduction Test
-> Candidate Quality Intent
```

Do not store vague advice. Record the source judgment, trigger cues, context,
acceptance conditions, required evidence, exceptions, confidence, and unseen
case reproduction result.

## Discovery Closure

Discovery is ready to hand off when:

- the target and affected stakeholders are explicit;
- major unacceptable outcomes map to loss boundaries;
- candidate Quality Intents cite their source evidence or judgments;
- competing interpretations and unresolved ambiguities are visible;
- material counterexamples have been explored;
- the user can explain the protected failure in their own words.

Closure means the current discovery scope is sufficient for the next decision.
It does not mean no unknown quality concern exists.
