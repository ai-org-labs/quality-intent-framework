# QIF v0.7.3 Cross-Domain Transportability Review

## Purpose

QIF v0.7.3 checks whether quality knowledge from one domain can be used in
another. It prevents a familiar-looking score, threshold, or Quality Intent
from silently changing meaning when the stakeholders, work, losses, evidence,
or monitoring change.

It does not prove generalization. It makes the transfer claim inspectable.

## Plain-Language Flow

```text
Source domain result                 Target domain result
        |                                    |
        +------------ keep separate --------+
                         |
                         v
            Compare meaning and evidence
                         |
            +------------+------------+
            |                         |
        differences                unknowns
            |                         |
            v                         v
       unsupported              unestablished

Only exact, verified alignment with target-domain evidence
can become supported-for-declared-scope.
```

## Canonical Entities

### TransportabilityPolicy

Defines the dimensions that must be compared, requires target-domain evidence,
and forbids pooled performance or QIF itself from authorizing transfer.

### DomainTransportProfile

Describes one source or target domain: construct, stakeholder population,
operating context, loss boundary, outcome, evidence origin, observation window,
threshold and confidence meaning, monitoring integrity, and assumptions.

### DomainLocalCalibrationResult

Preserves one domain's eligible, observed, and verified outcome counts and
local evidence sufficiency. It is never pooled with another domain.

### TransportabilityComparison

Compares source and target profiles dimension by dimension. Each dimension is
`equivalent`, `different`, or `unverified`, with rationale and evidence.
It reproduces counts and one bounded status:

- `unsupported`: at least one dimension differs;
- `unestablished`: no known mismatch, but evidence or local calibration is
  insufficient; or
- `supported-for-declared-scope`: every dimension is equivalent and both
  domains have sufficient verified local evidence.

### TransportabilityAssessment

Summarizes comparisons, verified profiles, sufficient local results, evidence
sufficiency, and governance requirements without turning counts into quality.

## Required Comparison Dimensions

1. Construct
2. Stakeholder population
3. Operating context
4. Loss boundary
5. Outcome definition
6. Evidence origin
7. Observation window
8. Threshold meaning
9. Confidence meaning
10. Monitoring integrity

The list is deliberately about meaning and evidence, not software categories.
It applies to operations, accounting, administration, maintenance, customer
support, product development, and software development.

## Verifier Boundary

The verifier checks reference resolution, exact dimension coverage,
domain-local count reproduction, result separation, mismatch and uncertainty
counts, transfer-status reproduction, and governance routing.

It cannot prove that two constructs are genuinely equivalent, that evidence is
representative, that a result generalizes, or that transfer is safe or
authorized. Those claims require domain experts, affected stakeholders,
verified target-domain outcomes, monitoring evidence, and accountable
governance.

## Example Boundary

The committed example compares software release governance with customer
support operations. Seven dimensions differ and three remain unverified. Both
local results are insufficient and example-only, so transfer is
`unsupported`. This is an explanation of why the conclusion must not travel,
not evidence about either domain's real quality.
