# QIF v0.6.46 Evaluation-to-Deployment Transfer and Long-Horizon Drift

## Purpose

A short evaluation is a sample, not a deployment-safety certificate. QIF v0.6.46 records whether externally visible behavior transfers from evaluation to shadow or operational use, and whether it changes during a longer trajectory.

```text
Evaluation trajectory ─┐
Shadow trajectory ─────┼─ same intent, evidence, tools, output, policy? ─► Transfer gap
Operation trajectory ──┘
          │
          └─ ordered checkpoints ─► Long-horizon drift
```

## Model

- `TransferDriftPolicy` declares required stages, minimum evidence, and the five matching controls.
- `DeploymentTrajectory` records a stage and at least two time-ordered checkpoints. Each checkpoint needs externalized action evidence.
- `TransferComparison` compares an evaluation trajectory with a later-stage trajectory. A transfer gap exists only when all five controls match and terminal behavior differs.
- `TransferDriftAssessment` recomputes evidence counts, stage coverage, transfer gaps, within-trajectory drift, sufficiency, and the resulting structural signal.

## Plain-language reading

1. Confirm the runs were trying to do the same thing.
2. Confirm they saw the same evidence, had the same tools, owed the same output, and used the same policy.
3. Compare what they visibly did, not what they may have thought.
4. Inspect more than the first and last action to see whether behavior changed over time.
5. Route missing evidence, mismatches, gaps, and drift to governance.

## Boundaries

Verifier success proves structure, reference resolution, timestamp arithmetic, matching, and count reproduction. It does not prove deployment safety, causality, intent, semantic quality, actor selection, authorization, or authority. QIF records evidence; accountable humans or authorized governance decide deployment, pause, rollback, and recovery.

## Trend basis

The design responds to current evidence that long-running systems can expose failures missed by pre-deployment evaluations and that action sequences must be monitored as trajectories. It also preserves the boundary that evaluations depend on their environment and setup, so unmatched runs cannot support a transfer claim.

