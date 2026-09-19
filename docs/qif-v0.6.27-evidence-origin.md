# QIF v0.6.27 Evidence Origin

## Purpose

Evidence Origin records where an outcome or calibration case came from. It
prevents an example, simulation, or synthetic case from being mistaken for an
observed result merely because its narrative sounds realistic.

## Plain-language model

```text
Decision outcome or calibration case
              |
              | evidenceOriginRef
              v
      Evidence Origin record
              |
              +-- what source was used?
              +-- when was it observed?
              +-- in which environment?
              +-- who recorded it?
              +-- who verified it?
              +-- how was it transformed?
```

The diagram means only that the result has a traceable declared origin. It
does not prove that the source is true, representative, independent, or
causally attributable to the decision.

## Canonical fields

| Field | Meaning |
| --- | --- |
| `id` | Stable reference used by an outcome or case. |
| `originKind` | `observed-operational`, `historical-record`, `simulated`, `synthetic`, or `example`. |
| `sourceArtifact` | The record, log, document, or package from which the evidence was obtained. |
| `observationWindow` | The time or event window represented by the evidence. |
| `environment` | The operational, pilot, test, simulated, or example setting. |
| `generatedBy` | The human, agent, process, or recorder that produced this origin record. |
| `verifiedBy` | One or more parties that checked the declared origin. |
| `transformationSummary` | Redaction, normalization, aggregation, or other changes made to the source. |
| `status` | `draft`, `verified`, `stale`, or `retired`. |

## Required links

The following records carry `evidenceOriginRef`:

- quality-gate `postReleaseReview`;
- qif-ledger `agentOutcome`;
- world-model-calibration `calibrationCase`;
- world-model-pilot-corpus `pilotCase`.

The local verifier rejects unresolved references. An
`observed-operational` or `historical-record` origin must have `verified`
status. `qif calibration-readiness` accepts `CRD-ORIGIN` only when every
relevant outcome and case resolves to a verified origin of one of those two
kinds.

## Boundary rules

- `example`, `simulated`, and `synthetic` records are never empirical merely
  because they validate.
- A `real-redacted` case label does not replace an Evidence Origin record.
- Page counts, review counts, test counts, or other activity counts do not
  establish origin or quality.
- Verification proves declared structure and reference resolution only.
  Semantic validity still requires source inspection, independent review,
  operational feedback, and governance.

