# QIF v0.6.40: Policy Counterfactual Replay

## Plain-Language Purpose

Before changing a decision policy, QIF can now ask:

> If we kept the case and evidence exactly the same, but tried the candidate
> policy, would the recommended route change?

This is a controlled comparison. It does not choose the policy and does not
predict what would actually have happened.

## Simple Picture

```text
same case + same evidence
           |
           +---------------------+
           |                     |
           v                     v
   current policy          candidate policy
           |                     |
           v                     v
     human review              proceed
           |                     |
           +----------+----------+
                      v
          route changed: yes
                      |
                      v
       possible loss-boundary exposure
         (hypothesis, not an outcome)
                      |
                      v
             governance review
```

The diagram communicates one comparison only: the candidate changes the route.
It does not communicate that `proceed` is better, worse, authorized, or what
the real-world outcome would be.

## New Entities

| Entity | Owns | Must not own |
| --- | --- | --- |
| `PolicyCounterfactualVariant` | Baseline snapshot, exact candidate changes, complete candidate routes and rules, reviewers, evidence, candidate-only authority boundary | Active-policy authority, automatic selection, automatic mutation |
| `PolicyCounterfactualReplay` | Preserved decision, unchanged evidence snapshot, reproduced baseline and candidate rules/routes, route-change result, hypothetical loss-boundary impacts | Observed counterfactual outcome, causal proof, policy recommendation |
| `PolicyCounterfactualAssessment` | Variant/replay membership, reproducible counts, evidence sufficiency, alert signal, governance | Quality score, policy ranking, authorization decision |

## Required Flow

```text
Route Policy Snapshot
        |
        v
Reviewed Candidate Variant
        |
        +---- original case, forecast, origin, and window stay unchanged
        v
Counterfactual Replay
        |
        +---- baseline rule and route
        +---- candidate rule and route
        +---- explicit route change
        +---- hypothetical loss-boundary impact
        v
Counterfactual Assessment
        |
        v
Governance Trigger when evidence is weak or consequences need review
```

## Executable Rules

The local verifier checks that:

1. A variant resolves to an immutable baseline snapshot.
2. Candidate routes remain complete and candidate score intervals are closed,
   contiguous, and non-overlapping.
3. Declared change dimensions and exact old/new values reproduce the baseline
   and candidate definitions.
4. The variant is reviewed but remains non-authoritative and cannot select or
   mutate itself.
5. A replay resolves to one preserved decision and its original pair.
6. Forecast, source origin, local evidence origin, and observation window are
   unchanged.
7. Baseline and candidate rules and routes reproduce deterministically.
8. Every loss-boundary impact resolves through a Consequence Policy to the
   source Quality Intent and remains `counterfactual-not-observed`.
9. Route changes, severe or uncertain impacts, unverified evidence, and
   insufficient assessment data trigger governance.
10. Aggregate counts and sufficiency reproduce from referenced records.

## Worked Example

The committed example keeps forecast probability `0.70` unchanged.

- Current policy: `0.50 <= p < 0.75` routes to human review.
- Candidate policy: `0.65 <= p` routes to proceed.
- Replay result: the recommended route changes from human review to proceed.
- Possible impact: increased exposure to the high-severity refund-limit loss
  boundary.
- Interpretation: a review hypothesis requiring governance, not proof that the
  customer outcome would differ.

## What Verification Cannot Prove

A passing verifier cannot prove:

- the candidate policy is better or worse;
- the hypothesized impact would occur;
- the replay cases are representative or contamination-free;
- the route change caused an outcome;
- the reviewer or policy owner is competent;
- the candidate should be selected, authorized, or activated.

Those claims require independent cases, accountable domain review, empirical
outcomes, evaluation-harness review, and governance.

## Trend Basis

- OpenAI agent evaluation guidance recommends repeatable datasets and trace
  grading when comparing prompt or routing changes.
- Anthropic CHIVE tests explanations with counterfactual edits and measured
  outcomes while refusing to treat a plausible explanation as ground truth.
- NIST AITE emphasizes blind, sequestered evaluation data to reduce
  contamination, and TEVV-Athlon emphasizes context-specific assessment goals.
- NIST evaluation-cheating work shows why transcript inspection, explicit
  affordances, and loophole review must follow in v0.6.42.

These sources inform the evaluation method. They do not validate the committed
QIF example or transfer authority to the verifier.
