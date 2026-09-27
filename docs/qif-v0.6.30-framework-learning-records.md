# QIF v0.6.30 Framework Learning Records

## Purpose

Calibration is useful only when contradictory evidence can change the
framework, be deliberately rejected, or be rolled back. A changelog entry or
a high number of changes does not prove learning.

Framework Learning records preserve this path:

```text
What we believed
       |
       v
Observed calibration evidence says otherwise
       |
       v
Human-governed decision: accept, reject, defer, or roll back
       |
       v
Changed artifact + validation evidence + rollback boundary
       |
       v
Framework learning is structurally ready
```

If a reader cannot tell what belief was challenged, who decided, what changed,
how it was checked, and when to undo it, the record is not complete.

## Record Shape

Each `frameworkLearningRecords` entry includes:

- calibration runs and Evidence Origins that ground the learning claim;
- the prior assumption, its rationale, contradiction evidence, and status;
- the proposed target artifact, change type, description, and expected effect;
- an accountable governance decision and rationale;
- implementation artifact refs, validation evidence, and rollback evidence;
- an owner, review point, success criteria, and rollback criteria;
- lifecycle status, governance triggers, and an assurance boundary.

Calibration runs link back through `frameworkLearningRecordRefs`. This makes
the calibration-to-change relationship inspectable in both directions.

## Lifecycle

| Status | Meaning | Structural expectation |
| --- | --- | --- |
| `proposed` | A change is being considered. | Governance is pending or deferred, implementation has not started, and a governance trigger remains visible. |
| `accepted` | An accountable authority accepted the change. | Implementation has not started and governance continues to track delivery. |
| `implemented` | The accepted change was made and checked. | The assumption is contradicted, origins are verified empirical records, changed artifacts and validation evidence exist, rollback criteria exist, and linked triggers are resolved. |
| `rejected` | Governance decided not to change the framework. | Rationale is retained and implementation is not applicable. |
| `rolled-back` | An earlier change was undone. | Governance and implementation both say rolled back, with rollback evidence. |
| `stale` | Context or evidence is no longer current. | Governance is reopened. |

Rejected and rolled-back records still preserve organizational knowledge, but
they do not satisfy `CRD-LEARNING`. The readiness check asks for at least one
implemented record that closes the complete governed evidence path.

## Readiness Boundary

`CRD-LEARNING` is met only when one record has all of the following:

1. The assumption status is `contradicted`.
2. Every cited Evidence Origin is verified `observed-operational` or
   `historical-record` evidence.
3. Governance explicitly accepted the change.
4. The change is implemented and cites changed artifacts.
5. Validation evidence and rollback criteria are present.
6. Linked governance triggers are resolved.

The committed example is intentionally `proposed`, grounded in `example`
evidence, and governance-open. It demonstrates the format without pretending
that QIF has already learned from a real organization.

## What Verification Does Not Prove

Verifier success does not prove that:

- the prior assumption was actually false;
- the calibration evidence caused the observed result;
- the accepted change was the best response;
- the implementation improved quality;
- the evidence is representative or independent;
- the accountable human decision was correct.

Those questions require expert review, operational feedback, empirical
comparison, and governance. Framework Learning records make that judgment
traceable; they do not replace it.

