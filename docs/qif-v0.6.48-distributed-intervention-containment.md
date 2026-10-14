# QIF v0.6.48 Distributed Intervention Coordination and Blast-Radius Containment

## Purpose

One intervention can be correct by itself and still become dangerous when
another agent, service, team, or operational lane acts at the same time.
QIF v0.6.48 records that combined situation without giving QIF authority to
run, stop, or approve the intervention.

## Plain-language flow

```text
Intervention events in two or more lanes
                 |
                 v
Who may act, in what order, and with which shared resources?
                 |
                 v
What conflicted, and did every lane agree to stand down?
                 |
                 v
Where did the effect actually travel?
                 |
                 v
Contained / partly contained / not contained / unknown
                 |
                 v
Evidence-backed assessment or governance review
```

## Canonical records

- `DistributedInterventionPolicy` defines minimum lanes, per-lane authority,
  dependency and conflict rules, concurrency and affected-scope limits,
  shared-resource limits, stand-down requirements, and fail-closed behavior.
- `InterventionCoordinationRun` binds source interventions to lane actions,
  authority evidence, sequence, dependencies, conflicts, stand-down state,
  resource claims, and externalized evidence.
- `BlastRadiusObservation` separates intended scope from observed and
  unexpected scope, records propagation edges, containment boundaries,
  shared-resource saturation, common-mode failure, and evidence status.
- `DistributedInterventionAssessment` reproduces counts, evidence sufficiency,
  unresolved conflict, scope exceedance, saturation, common-mode failure, and
  governance routing.

## Required questions

1. Which lane was allowed to perform each action?
2. Which action had to happen first, and what evidence proves the order?
3. Did two lanes compete for the same target, authority, or resource?
4. If conflict remained, did every affected lane actually stand down?
5. Which scopes were intended to change?
6. Which scopes changed in observation, including unexpected ones?
7. What propagation path and containment evidence were externally visible?
8. Which uncertainty or boundary breach requires governance?

## Verifier boundary

The verifier can reproduce declared references, lane authority, dependency
order, conflict and concurrency counts, shared-resource limits, observed scope,
propagation edges, containment classification, assessment arithmetic, and
governance rules. It cannot prove causality, coordination success, containment
effectiveness, systemic safety, semantic quality, authorization, or authority.

## Trend basis

Current multi-agent research shows that individually capable agents can still
escalate conflicting objectives, converge on the same bad action, or flood a
shared resource. QIF therefore keeps lane-local authority, cross-lane
dependencies, common-mode behavior, and observed impact attached to the
quality record instead of accepting aggregate success.
