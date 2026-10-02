# QIF v0.6.35 Selective Escalation Calibration

## Purpose

A confidence score should not silently decide who may act. v0.6.35 records
which route a reviewed policy recommends, which route was actually used, who
was accountable, what evidence shows that route occurred, and what happened
afterward.

## The Four Routes

~~~text
Can we act directly?
|
+-- very low confidence ------> Defer
|                               Pause and gather evidence
|
+-- low confidence -----------> Specialist escalation
|                               Ask someone with named domain capability
|
+-- intermediate confidence --> Human review
|                               Ask the named accountable reviewer
|
+-- higher confidence --------> Proceed
                                Act only through the named authority
~~~

The score intervals are examples of reviewed policy, not universal defaults.
Every route still names an authority, required capability, evidence, and
response-time boundary.

## What Happens For One Decision

~~~text
Existing forecast and observed outcome
              |
              v
Find exactly one matching routing rule
              |
              v
Recommended route ------ compare ------ Actual route
              |                              |
              v                              v
Named authority                    Execution evidence
              \                              /
               +------------+---------------+
                            v
             Route-specific held/failed record
                            |
                            v
          Structural alert? -> Governance owner
~~~

A failed outcome after human or specialist review does not prove that the
reviewer caused the failure. It only keeps the route, evidence, outcome, and
unresolved concern connected for accountable investigation.

## Records

- **Selective Escalation Policy**: four routes and contiguous score rules.
- **Selective Escalation Decision**: recommended route, actual route,
  deviation, authority, execution evidence, and observed outcome.
- **Selective Escalation Assessment**: reproducible per-route held/failed
  summaries, evidence sufficiency, unresolved authority, and deviation counts.
- **Governance Trigger**: required for unreviewed policy, route deviation,
  unresolved authority, unverified evidence, failed escalated outcomes, or
  insufficient evidence.

## Example

The committed forecast is 0.70. Its reviewed rule selects human-review.
The example records that the human-review route was used and the protected
outcome later failed. Because the execution evidence is example-only and only
one decision exists, the assessment remains insufficient-data and governance
stays open.

This does not score the reviewer. It does not prove the review caused the
failure. It shows exactly what must be investigated.

## Boundary

Route volume and escalation frequency describe workload. They are not quality,
competence, causality, or authority. The verifier proves declared structure,
reference resolution, interval closure, route reproduction, summary
arithmetic, and governance rules only. Semantic validity still needs
accountable human review and operational evidence.

## Verify

~~~sh
node tools/qif.mjs calibration-report
npm test
~~~
