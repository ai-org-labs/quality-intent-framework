# QIF v0.5.4 Guided Elicitation Runtime

## Purpose

Guided Elicitation makes QIF usable with people who do not know QIF terminology.

The runtime records how an AI or human interviewer explains QIF concepts in plain language, asks stepwise questions, captures raw answers, clarifies ambiguity, confirms interpretation through teach-back, and derives candidate QIF knowledge.

## Runtime Flow

```text
Elicitation Session
-> User Comprehension Profile
-> Explanation Unit
-> Question Strategy
-> Stepwise Probe
-> Answer Scaffold
-> User Answer
-> Clarification Move
-> Derived Candidate
-> Teach-Back Check
-> Elicitation State
-> Governance Trigger when confidence or ambiguity requires review
```

## Executable Entities

| Entity | Purpose |
| --- | --- |
| Elicitation Session | Bounded conversation for a target and purpose. |
| User Comprehension Profile | Current estimate of the user's language, QIF familiarity, domain knowledge, and explanation preference. |
| Explanation Unit | Plain-language explanation for one QIF concept, with examples and prohibited jargon. |
| Question Strategy | Why a next question is selected; must explicitly be anti-checklist. |
| Stepwise Probe | One answerable question tied to a strategy, explanation, and expected candidate type. |
| Answer Scaffold | Optional answer format that reduces user burden without forcing a checklist response. |
| User Answer | Raw captured answer before interpretation. |
| Clarification Move | Follow-up question caused by ambiguity, contradiction, missing context, low confidence, or comprehension gap. |
| Teach-Back Check | User confirmation of the AI's interpretation before finalizing candidate knowledge. |
| Elicitation State | Known facts, unresolved ambiguity, fatigue signals, and next recommended move. |
| Derived Candidate | Candidate Concern, Loss Boundary, Quality Intent, Evidence Requirement, Decision Pattern, or Waiver Condition. |
| Governance Trigger | Review route for low confidence, unresolved ambiguity, checklist drift, coercion risk, or comprehension gap. |

## Verifier Rules

`tools/validate-guided-elicitation.mjs` checks:

- all references resolve within the package;
- profiles record language, QIF familiarity, domain knowledge, and uncertainty signals;
- explanation units provide plain-language explanations and do not merely repeat concept labels;
- question strategies explicitly set `antiChecklist: true`;
- probes link to sessions, strategies, and explanations;
- probes do not ask abstract QIF terminology such as "What are the Quality Intents?" without plain-language framing;
- answer scaffolds are optional;
- raw user answers are preserved before interpretation;
- clarification moves cite answers and resolved clarifications cite resulting answers;
- derived candidates cite raw answers and probes;
- finalized candidates require an accepted accurate teach-back check;
- low-confidence candidates require governance triggers;
- verifier boundary explicitly refuses semantic truth and question-count-as-quality claims.

## Boundary

The verifier proves traceability and rule compliance. It does not prove that the user truly understood, that the candidate is semantically correct, or that the interviewer asked the best possible question.

Semantic validity requires user confirmation, expert review where required, downstream QIF package validation, and governance for unresolved ambiguity.

## Example

See `examples/guided-elicitation-package.json`.

The example is in Japanese and demonstrates a refund-policy conversation where the user does not know QIF terminology. The package derives a loss boundary, evidence requirement, and waiver condition from raw answers and teach-back confirmation.

## Non-Goals

- No UI.
- No mandatory questionnaire.
- No user scoring.
- No employee surveillance or blame assignment.
- No claim that asking more questions improves quality.
