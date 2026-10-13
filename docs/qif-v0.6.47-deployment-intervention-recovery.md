# QIF v0.6.47 Deployment Intervention and Recovery Calibration

## Purpose

Detecting drift is not the same as responding safely. This release makes the response chain inspectable without giving QIF operational authority.

```text
Transfer gap or drift
        ↓
authorized intervention ── was it timely, scoped, reversible, fail-closed?
        ↓
rollback or containment ── is there external evidence?
        ↓
recovery checks ── did every required check pass?
        ↓
residual risk and governance
```

## Entities

- `InterventionRecoveryPolicy`: eligible signals, permitted actions, response SLA, authority roles, fail-closed and recovery requirements.
- `InterventionEvent`: detection, action start, authority evidence, affected scope, reversibility, rollback plan, and externalized action evidence.
- `RecoveryVerification`: rollback evidence, elapsed recovery time, individual verification results, restoration state, and residual risks.
- `InterventionRecoveryAssessment`: reproducible counts, evidence sufficiency, boundary breaches, failed recovery, and governance routing.

## Interpretation

An intervention count is activity, not quality. A quick response is not proof that the response was effective. A passed recovery check is not a general safety guarantee. The verifier proves declared structure, references, timestamp arithmetic, policy conformance, and count reproduction only. Accountable governance retains authority over intervention, risk acceptance, and redeployment.

## Trend basis

Current primary guidance for long-horizon systems calls for trajectory-level monitoring, rapid response with an SLA, fail-closed controls, rollback traceability, and recovery or redeployment under continued monitoring. QIF represents the auditable evidence chain while remaining vendor-neutral and domain-general.
