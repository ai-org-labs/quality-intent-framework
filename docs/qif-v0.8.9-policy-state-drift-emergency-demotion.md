# QIF v0.8.9: Policy State Drift and Emergency Demotion

## Purpose

A successful promotion is a point-in-time decision. It does not prove that the
approved policy, scope, authority, dependencies, configuration, or evidence
remain unchanged afterward. v0.8.9 makes post-promotion state history and
emergency demotion auditable without pretending that a local verifier observes
a live provider.

```text
Promoted policy + approved scope
              |
              v
     state observation 1 -------- approved baseline
              |
              v
     state observation 2 -------- current evidence
              |
       changed or missing?
          /          \
        no            yes
        |              |
      stable      drift assessment
                       |
             low / uncertain / critical
                |          |          |
             observe   governance   emergency demotion
                                      |
                                      v
                            execution reconciliation
```

## Policy State Observation

`PortableKnowledgePolicyStateObservation` records an append-only sequence for
one promoted policy decision. Each observation compares the approved policy
and frozen scope with the observed policy, scope, and evidence-bearing state
dimensions such as configuration, authority, dependency, and evidence state.

The verifier reproduces whether each dimension matches, mismatches, or lacks
evidence. Missing evidence is not a match. A state mismatch or incomplete
observation fails closed to governance.

## Drift Assessment

`PortableKnowledgeDriftAssessment` compares a matched baseline observation
with a later observation for the same promotion. Every changed or missing
dimension must appear exactly once in the assessment. The verifier reproduces
the highest declared severity and resulting decision:

- no drift becomes `stable`;
- low drift becomes `observe`;
- medium, high, or unknown drift becomes `governance-required`; and
- critical drift becomes `emergency-demotion-required`.

Severity remains a reviewed organizational judgment. The verifier checks its
consistent use; it does not prove the severity or root cause is true.

## Emergency Demotion

`PortableKnowledgeEmergencyDemotion` binds a critical drift assessment to the
promoted policy, predecessor target policy, exact scope, reason, accountable
human authority, deadline, execution reconciliation, and residual risk.

A completed demotion is reviewed only when its declared execution
reconciliation matches the target policy and scope. Planned, executing,
failed, unverified, or mismatched actions remain governance-required.

## Promotion Path Correction

v0.8.9 also corrects the v0.8.8 schema and example path so a successful
observation can omit a rollback record and a successful promotion can omit
rollback and recovery references. Rollback evidence remains mandatory when an
observation actually requires rollback. A canonical JSON syntax check now runs
before the full test suite, preventing malformed schemas from shipping
silently.

## Trend Basis

NIST now emphasizes risk-based post-deployment monitoring, drift detection,
rehearsed incident response, recovery, and lifecycle governance. Microsoft
describes agents as continuously owned products whose knowledge, integrations,
and usage can drift. Google Cloud documents continuous online evaluation for
quality drift, while AWS recommends both generative-AI drift monitoring and
continuous agent configuration-drift remediation.

QIF moves one step ahead by keeping the approved baseline, observation
lineage, drift judgment, authority, emergency action, and reconciliation in
one portable evidence chain before any provider adapter is trusted.

## Verifier Boundary

The verifier proves schema syntax, reference integrity, observation lineage,
expected-versus-observed arithmetic, evidence presence, deterministic routing,
history preservation, and governance requirements. It does not prove live
provider state, evidence authenticity, root cause, severity truth, operational
safety, authority to act, or semantic fitness.
