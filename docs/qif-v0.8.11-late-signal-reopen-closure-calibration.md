# QIF v0.8.11: Late-Signal Reopen and Closure Calibration

## Purpose

An incident can be closed correctly with the evidence available at the time
and still receive important evidence later. v0.8.11 records what happened
next without rewriting the original closure.

```text
original closure (kept unchanged)
            |
            v
late signal: when it happened / when it arrived
            |
            v
materiality review: does it cross a recorded boundary?
            |
            v
human reopen decision: reopen / keep closed / governance
            |
            v
closure calibration: aligned / false assurance / false alarm / unknown
```

The records live in `qif-ledger`, beside the signal sources,
reconciliations, and incident closures they govern. They are not duplicated
in the calibration-report package.

## Late Signal

`PortableKnowledgeLateSignal` keeps occurrence time separate from receipt
time. It resolves to the original closure and an identified signal source,
reproduces lateness and materiality, and preserves evidence status. A material
or unverified signal routes to governance. Signal count is evidence only.

## Incident Reopen Decision

`PortableKnowledgeIncidentReopenDecision` records which preserved reopen
condition matched, the cited late signals, rationale, human authority, and a
continuation incident reference. The decision does not execute an operational
reopen. The original closure remains unchanged and independently auditable.

## Closure Calibration

`PortableKnowledgeClosureCalibration` compares the recorded closure decision
with later declared evidence over a bounded horizon:

- `aligned`: later evidence remains consistent with the closure disposition;
- `false-assurance`: a close decision is followed by material adverse evidence;
- `false-alarm`: a non-close disposition is followed by recovery evidence; or
- `unknown`: the later state cannot be established from the declared record.

Adverse or incomplete calibration routes to governance. It may improve later
closure policy, but it does not establish root cause.

## Trend Basis

NIST AI 800-4 identifies delayed or unavailable post-deployment ground truth
and the overhead of longitudinal tracking as monitoring barriers. The
OpenTelemetry log data model distinguishes the time an event occurred from
the time it was observed. Microsoft incident guidance emphasizes explicit
closure authority, validation, documentation, and post-incident learning.

QIF moves one step ahead by making the late-evidence decision chain portable
and append-only before it is tied to a monitoring vendor.

## Verifier Boundary

The verifier proves declared reference resolution, occurrence/receipt timing,
lateness arithmetic, materiality reproduction, closure-condition citation,
human decision traceability, horizon containment, calibration classification,
history preservation, and governance routing. It does not prove signal
authenticity, material impact in reality, causality, monitoring completeness,
operational reopening, closure-calibration truth, future safety, authority, or
semantic fitness.
