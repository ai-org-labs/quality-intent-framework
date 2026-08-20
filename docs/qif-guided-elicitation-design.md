# QIF Guided Elicitation Design

## Purpose

QIF must help users who cannot yet describe quality intent, risk, or loss boundary in QIF terms.

The goal is not to ask more questions. The goal is to ask answerable questions that help a user move from concrete experience to evaluable quality knowledge.

This layer is called Guided Elicitation.

## Problem

Many users cannot answer questions such as:

```text
What are the Quality Intents?
What are the Loss Boundaries?
What evidence is sufficient?
```

Those questions assume the user already understands QIF concepts. In real use, the AI agent must translate QIF needs into plain, concrete prompts, then gradually build the QIF structure from the answers.

## Boundary

Guided Elicitation is not a checklist, quiz, survey, or fixed questionnaire.

It must not:

- force every user through the same questions;
- treat the number of answered questions as discovery quality;
- extract consent, agreement, or approval through confusing language;
- hide uncertainty to make an artifact look complete;
- blame users for incomplete answers;
- turn vague answers into final Quality Intents without validation.

Guided Elicitation may produce candidate QIF artifacts, but governance or expert review decides whether they become accepted organizational quality knowledge.

## Core Entities

| Entity | Purpose |
| --- | --- |
| Elicitation Session | Bounded conversation for discovering quality knowledge with a user. |
| User Comprehension Profile | Current estimate of the user's domain knowledge, QIF familiarity, uncertainty, and preferred explanation level. |
| Explanation Unit | Plain-language explanation of one QIF concept, scoped to the user's current task. |
| Question Strategy | Selection logic for what to ask next and why. |
| Stepwise Probe | One answerable question or micro-task that advances discovery. |
| Answer Scaffold | Structured answer format offered to reduce user burden. |
| User Answer | Captured user response before interpretation. |
| Clarification Move | Follow-up question triggered by ambiguity, contradiction, missing context, or low confidence. |
| Teach-Back Check | Request for the user to confirm whether the AI's interpretation matches their intent. |
| Elicitation State | Current progress, known facts, unresolved ambiguity, fatigue risk, and next recommended move. |
| Derived Candidate | Candidate Concern, Loss Boundary, Quality Intent, Evidence Requirement, or Decision Pattern derived from the session. |

## Requirements

### 1. Start From Concrete Situations

Do not ask users to define quality directly.

Ask for concrete examples:

```text
What would make this work unacceptable?
Can you describe a past case where this went wrong?
Who would complain first if this failed?
What would you need to see before saying this is safe enough?
```

### 2. Explain Before Asking Abstract Questions

If a QIF concept is needed, explain it in task language first.

Bad:

```text
What is the loss boundary?
```

Better:

```text
By "loss boundary", I mean the line we must not cross. For this work, what outcome would be serious enough that we would stop, escalate, or roll back?
```

### 3. Offer Answer Scaffolds

When users are unsure, provide structured choices without turning them into checklist completion.

Example:

```text
If it helps, answer in one of these forms:
- "This fails if..."
- "The person harmed would be..."
- "I would feel comfortable only if..."
```

The scaffold is optional. The raw answer remains valid even if it does not fit the scaffold.

### 4. Use Progressive Questioning

A single answer should determine the next question.

```text
Failure mentioned
-> ask who is harmed
-> ask what evidence would reduce concern
-> ask when the concern can be waived
-> ask what would make the waiver unsafe
```

Do not run every Discovery Pattern mechanically.

### 5. Detect Comprehension Gaps

The agent must flag when the user's answer shows misunderstanding or vocabulary mismatch.

Signals include:

- user answers with activity counts only;
- user repeats implementation details without naming harm;
- user names a quality category without failure condition;
- user gives a verdict without evidence;
- user contradicts a previous answer;
- user cannot distinguish preference from non-negotiable boundary.

### 6. Preserve Raw Answers Separately

The user's answer must be stored before interpretation.

Derived candidates must cite the raw answer, clarification moves, and teach-back checks that support them.

### 7. Ask Teach-Back Questions Before Finalizing

Before converting a candidate into QIF knowledge, ask the user to confirm the interpretation.

Example:

```text
I am interpreting your concern as:
"A release is unacceptable if rollback responsibility is unclear because users may remain stuck after failure."
Is that accurate, too strong, too weak, or wrong?
```

### 8. Track User Burden

The agent should stop or summarize when the session becomes too complex.

Signals include:

- repeated "I don't know";
- contradictory answers caused by unclear framing;
- too many open ambiguities;
- the user asks to move faster;
- answers become shorter and less specific.

When this happens, the agent should summarize what is known, name what is still missing, and ask one next question only.

## Question Quality Rules

A good QIF elicitation question is:

- concrete enough to answer;
- tied to a decision, failure, harmed party, evidence, or exception;
- short enough to answer without prior QIF training;
- explicit about why it is being asked;
- capable of producing a traceable candidate entity.

A bad question is:

- abstract without explanation;
- multiple questions hidden in one sentence;
- framed as a compliance checklist;
- optimized for speed over understanding;
- leading the user toward a desired answer;
- impossible to answer without missing context.

## Minimal Conversation Flow

```text
1. Ask for the target.
2. Ask what would make the target fail in the user's eyes.
3. Ask who is harmed by that failure.
4. Ask what evidence would make the user comfortable.
5. Ask what exception or waiver might exist.
6. Summarize the candidate Concern, Loss Boundary, Quality Intent, and Evidence Requirement.
7. Ask a teach-back confirmation.
8. Record unresolved ambiguity.
```

## Mapping To QIF

| Guided Elicitation Output | QIF Target |
| --- | --- |
| User Answer | Raw Expert Answer or Discovery Evidence |
| Stepwise Probe | Question Log Entry or Discovery Probe |
| Clarification Move | Question Log Entry with ambiguity rationale |
| Teach-Back Check | Review or governance evidence |
| Derived Candidate Concern | Concern |
| Derived Candidate Loss Boundary | Loss Boundary |
| Derived Candidate Quality Intent | Quality Intent Derivation |
| Evidence Comfort Statement | Required Evidence |
| Waiver Condition | Applicability Boundary or Governance Rule |

## Acceptance Criteria

Guided Elicitation is acceptable when:

1. A non-expert user can answer the first three prompts without knowing QIF terminology.
2. Every abstract QIF concept used in conversation is explained in plain language first.
3. Every derived candidate cites raw answers and clarification history.
4. The agent asks a teach-back question before finalizing candidate knowledge.
5. Uncertainty remains visible instead of being silently resolved.
6. The number of questions asked is never treated as discovery quality.

## Non-Goals

- No UI requirement.
- No mandatory questionnaire.
- No scoring users.
- No employee surveillance or blame assignment.
- No claim that a confirmed interpretation is semantically true.
