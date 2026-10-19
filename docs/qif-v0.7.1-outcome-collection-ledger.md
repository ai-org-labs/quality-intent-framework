# QIF v0.7.1 Outcome Collection Ledger

## Purpose

The Outcome Collection Ledger preserves how an empirical outcome record changes
after a decision. It answers five plain questions:

1. What did we know at this time?
2. What changed next?
3. Why did it change?
4. Who was declared to hold the evidence?
5. Does the current snapshot still match the latest recorded revision?

It does not collect operational data, prove that a source is true, authenticate
custody, or authorize a decision.

## Flow

```text
Prospective enrollment
        |
        v
Empirical outcome observation (current snapshot)
        |
        v
Observation revision 1 -> revision 2 -> revision 3
        |                    |              |
        |                    |              +-> source correction
        |                    +-----------------> custody event
        +--------------------------------------> custody event
                             |
                             v
                    Ledger assessment
```

The arrows mean "added later". An older revision remains present and is never
rewritten by QIF.

## Canonical Entities

### OutcomeCollectionPolicy

Declares append-only behavior, sequence start, immediate supersession, source
correction mode, custody requirements, late-arrival handling, and the boundary
between structural verification and semantic judgment.

### OutcomeObservationRevision

Captures one immutable snapshot of an `EmpiricalOutcomeObservation`. Revision
1 is `initial`. Every later revision must supersede the immediately preceding
revision for the same observation. A revision may represent a state transition,
late outcome, source correction, or evidence amendment.

### OutcomeSourceCorrection

Explains which prior revision contained an incorrect source value, which new
revision corrects it, why the correction was made, which fields changed, and
who authorized the correction. Digests preserve before/after identity without
pretending that either value is true.

### OutcomeCustodyEvent

Records a declared custody transition for a specific revision. Custody events
are sequenced and must connect from the prior custodian to the next. This is an
audit statement, not proof that custody was authentic.

### OutcomeLedgerAssessment

Reproduces counts, latest revisions, sequence gaps, orphan revisions, snapshot
mismatches, evidence sufficiency, and ledger state. Activity counts are never
quality and an internally consistent ledger is not a truthful outcome claim.

## Verifier Rules

- Revision numbering starts at 1 and is contiguous per observation.
- Revision 1 has no predecessor; later revisions supersede the immediate prior
  revision for the same observation.
- Source-correction revisions and correction records link in both directions.
- Late arrival is recomputed from the enrollment due time and recorded time.
- Every revision has at least one matching custody event.
- Custody event sequence and custodian handoff are reproducible.
- The current observation snapshot matches its latest revision.
- Non-verified ledger evidence routes an explicit governance trigger.
- Insufficient evidence keeps the assessment descriptive and non-authoritative.

## Example Boundary

The committed example demonstrates three revisions: planned, observing, and a
source-locator correction. It remains `example-only`, has no completed empirical
outcome, and therefore cannot establish calibration, source truth, custody
authenticity, causality, or quality.
