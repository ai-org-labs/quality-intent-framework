# QIF v0.8.10: Drift Signal Integrity and Incident Closure

## Purpose

A demotion marked complete is not the same as a resolved incident. Monitoring
signals can be stale, duplicated, derived from the same underlying source, or
in direct conflict. v0.8.10 makes those weaknesses visible and prevents signal
volume from becoming a proxy for confidence or quality.

```text
identified sources
       |
       v
current signals ---- stale signals are excluded
       |
       v
correlation groups -- same origin counts once
       |
       v
conflict preserved -- disagreement is not averaged away
       |
       v
post-demotion observation window
       |
       v
human closure decision -- or keep open / governance
```

## Signal Source

`PortableKnowledgeSignalSource` records the declared source identity, capture
mode, owner, correlation group, independence status and basis, freshness
window, privacy handling, and evidence. Independence is a reviewed claim, not
a fact inferred from different labels. A correlated source may remain useful
context, but it cannot satisfy independent-confirmation requirements.

QIF does not retain raw sensitive telemetry or use monitoring records for
employee surveillance. Activity and alert counts remain evidence only.

## Signal Reconciliation

`PortableKnowledgeSignalReconciliation` binds signals to their sources and
reproduces:

- which signals are current or stale;
- which current signals qualify as independent confirmation;
- which signals share a correlation group;
- which current signals disagree about the same dimension;
- which critical signals remain unresolved; and
- whether recovery is corroborated, conflicted, insufficient, or unverified.

Two labels do not count as two independent sources when both come from one
correlation group. Conflicts remain explicit and route to governance. The
verifier never resolves disagreement by majority or signal count.

## Incident Closure

`PortableKnowledgeIncidentClosure` records a bounded post-demotion observation
window, demotion and execution state, signal reconciliation, unresolved
signals, residual-risk disposition, accountable decision authority, evidence,
and conditions that reopen the incident.

Closure is reproducible only when:

1. emergency demotion is complete;
2. execution reconciliation matches;
3. the observation window has ended and all cited signals fall inside it;
4. the required number of independent correlation groups corroborates
   recovery;
5. no stale, conflicting, or unresolved critical signal remains;
6. residual risk is accepted or mitigated by accountable human authority; and
7. closure evidence and reopen conditions are preserved.

Failure of any condition keeps the incident open or routes it to governance.
QIF does not close a provider incident or authorize an operational action.

## Trend Basis

NIST AI 800-4 identifies fragmented logging, drift detection, trusted
monitoring methods, information sharing, and integration of automated and
human-validated monitoring as open post-deployment challenges. OpenTelemetry
is standardizing end-to-end agent traces, while Microsoft guidance requires
telemetry sufficient for incident reconstruction, shared correlation
identifiers, behavioral baselines, and accountable response.

QIF moves one step ahead by making source correlation, conflict preservation,
and closure evidence portable before any monitoring backend is trusted. The
next slice will make late signals and incident reopening executable rather
than leaving reopen conditions as prose.

## Verifier Boundary

The verifier proves declared source resolution, freshness arithmetic,
correlation-group separation, conflict preservation, observation-window
completeness, closure-policy reproduction, history preservation, and
governance routing. It does not prove source authenticity, causal
independence, monitoring completeness, live provider state, future safety,
operational recovery, authority to close, or semantic fitness.
