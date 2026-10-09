# QIF v0.6.42: Sequestered Replay and Policy-Gaming Detection

## Purpose

A test result is not trustworthy merely because its arithmetic can be repeated.
The tested person or AI may have seen the answer, recognized the benchmark,
used a forbidden tool, or found a shortcut through the grader.

v0.6.42 records the test conditions needed to inspect those risks. It does not
claim to read private thoughts, prove honesty, or prove that contamination is
absent.

## Plain-Language Flow

```text
Before the test                 During the test                 After the test

Hide answers and grader  ->  Record tools and actions  ->  Inspect the transcript
Name allowed access          Keep access logs               Record possible leaks
Approve the protocol         Lock externalized output       Record grader loopholes
                                                            Send uncertainty to governance
```

The diagram means: protect the answer first, observe what actually happened,
then interpret the result. A high score cannot skip any of these steps.

## Entities

### Sequestered Replay Protocol

Owns the reviewed rules for one replay:

- which judge trials are covered;
- which items stay hidden before execution;
- when hidden items may be revealed;
- which roles may access them;
- which environment affordances are allowed;
- whether access logs and externalized transcripts are required.

It must not select a judge, change a policy, request hidden chain-of-thought,
or grant authority.

### Sequestered Replay Run

Records what happened in one execution:

- whether blindness was confirmed, exposure was known, or the state is unknown;
- access-log and externalized-transcript references;
- observed affordances;
- transcript inspection state;
- contamination findings;
- grader-loophole findings;
- evidence status and governance triggers.

`confirmed-blind` is allowed only with verified access evidence and no observed
prohibited affordance. `unknown` is an honest valid state, but it must be
governed before the result is trusted.

### Policy-Gaming Assessment

Reproduces counts across referenced runs: confirmed-blind runs, exposed or
unknown runs, inspected transcripts, contamination alerts, loophole alerts,
and verified runs. Sufficiency requires enough runs, reviewed verified
protocols, verified evidence, confirmed blindness, and inspected transcripts.

Counts remain evidence. They are not quality, honesty, competence, optimality,
selection, authorization, or authority.

## What The Verifier Proves

The local verifier can prove declared structure, reference resolution,
required boundaries, count reproduction, and governance routing. It can reject
an unsupported blindness claim or a missing trigger.

It cannot prove that a private dataset was never seen, that an actor intended
to game a policy, that transcript inspection found every shortcut, or that the
evaluation measures the right real-world capability. Those require independent
operation, adversarial review, representative unseen cases, and accountable
governance.

## AI Authoring Rules

1. Never infer `confirmed-blind` from the word "private" or "held out" alone.
2. Record allowed and observed affordances separately.
3. Inspect externalized actions and outputs; do not require hidden reasoning.
4. Record `unknown` when provenance or access evidence is missing.
5. Treat suspected, confirmed, and unknown contamination as governance work.
6. Keep absence of detected gaming distinct from proof of no gaming.

## Sources

- [NIST: Cheating on AI Agent Evaluations](https://www.nist.gov/caissi/cheating-ai-agent-evaluations)
- [NIST AITE sequestered evaluation](https://ai-challenges.nist.gov/aite)
- [OpenAI: The Hugging Face incident and the road ahead](https://openai.com/index/hugging-face-incident-and-the-road-ahead/)
- [OpenAI: Studying metagaming latents](https://alignment.openai.com/metagaming-latents/)

