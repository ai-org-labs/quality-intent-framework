# QIF v0.8.13 Closure Policy Revision and Counterfactual Replay

## Purpose

QIF v0.8.13 turns adverse incident-closure calibration into a governed policy
learning loop. It records a candidate change, replays that change against
frozen historical inputs, and records an accountable adoption decision without
rewriting the original closure or executing a live policy change.

```text
Closure Calibration
        |
        v
Policy Revision Candidate (candidate only)
        |
        v
Frozen Historical Replay (what would the candidate decide?)
        |
        v
Revision Decision (adopt / revise / governance required)
```

## Entities

### Closure Policy Revision Candidate

Owns the baseline and candidate versions, source calibrations, targeted adverse
classifications, proposed disposition, structured changes, applicability
boundary, replay minimum, rationale, proposer, and governance trace. It must
remain candidate-only and cannot activate itself.

### Closure Policy Counterfactual Replay

Owns one frozen replay of a candidate against one historical calibration. Its
input set is exactly the calibration, original closure, and cited late signals.
The verifier reproduces the candidate decision and outcome delta. A replay does
not prove causality or predict future safety.

### Closure Policy Revision Decision

Owns the accountable disposition of one candidate after replay. It reproduces
coverage, minimum-case sufficiency, replay outcome counts, effective version,
and rollback version. A decision record does not execute a policy deployment.

## Deterministic Rules

1. Every candidate is grounded in one or more closure calibrations.
2. Target classifications must occur in those calibrations.
3. Replay inputs are frozen and history remains append-only.
4. A targeted classification receives the candidate disposition; other cases
   retain the original closure decision.
5. Avoiding a close decision on a frozen false-assurance case is recorded as
   `prevented-false-assurance`; this is a replay delta, not causal proof.
6. Example-only, unverified, incomplete, or governance-required source evidence
   forces the replay and revision decision to governance.
7. A candidate becomes an effective version only after an accountable
   `adopt-candidate` decision with complete, sufficient, reviewed replays.

## Verifier Boundary

The local verifier can prove schema conformance, reference resolution, frozen
input equality, deterministic decision reproduction, arithmetic, and recorded
governance routing. It cannot prove source authenticity, causal impact,
counterfactual truth, policy fitness, future safety, live execution, or human
authority. Counts are evidence about the replay set, never quality itself.

