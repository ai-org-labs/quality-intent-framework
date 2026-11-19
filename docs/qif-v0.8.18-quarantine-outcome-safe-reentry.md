# QIF v0.8.18 Quarantine Outcome and Safe Re-entry Evidence

## Purpose

A quarantine decision is not the end of a quality decision. Organizations
must know what actually happened, what was changed, whether the relevant
failure was replayed, what was observed afterward, which risks remain, and why
re-entry is or is not ready for an accountable decision.

v0.8.18 makes that recovery chain explicit without turning QIF into a runtime
enforcement or restart system.

## Flow

```text
Quarantine Candidate and Decision
                 |
                 v
Observed Quarantine Outcome
                 |
                 v
Recorded Remediation Action
                 |
                 v
Failure-Trajectory Replay
                 |
                 v
Bounded Observation Window
                 |
                 v
Residual-Risk Assessment
                 |
                 v
Re-entry Readiness Assessment
                 |
                 v
Accountable Governance Decision
```

## What the Verifier Reproduces

The local verifier checks:

1. candidate, decision, outcome, remediation, replay, observation, risk, and
   re-entry references resolve and preserve lineage;
2. replay `resultMatched` agrees with the expected and observed result;
3. observed hours agree with the observation timestamps;
4. completion agrees with the required observation duration;
5. highest residual severity agrees with referenced open risks;
6. re-entry prerequisites agree with the linked evidence;
7. incomplete, failed, high-risk, or non-verified evidence fails closed into
   governance review;
8. no record authorizes restart, automatic re-entry, or remediation execution.

## Example Boundary

The committed package demonstrates the full chain with example-only evidence.
It can prove that the records are structurally connected and that calculations
are reproducible. It cannot prove that containment worked, remediation was
effective, the replay represents the real incident, the observation window
demonstrates stability, or re-entry is safe.

Therefore its re-entry disposition remains `governance-required`.

## Authority Boundary

QIF records evidence and prepares an accountable decision. It does not isolate,
patch, remove, reconfigure, restart, enable, trust, or grant permissions to a
dependency. `ready-for-governance-decision`, when supported by verified
evidence, still means a qualified authority must decide. It never means QIF
executed or authorized re-entry.

## Use

```bash
node tools/qif.mjs validate examples/skill-supply-chain-package.json
node tools/validate-skill-supply-chain.mjs my-package.json
```
