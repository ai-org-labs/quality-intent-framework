# QIF v0.6.36 Escalation Resolution and Timeliness

## Purpose

Selecting an escalation route is not the same as resolving the case. v0.6.36
records whether the route was accepted, rejected, redirected, or timed out,
whether accountable capacity was available, and whether the declared response
window was met.

## Plain-Language Flow

~~~text
A case is sent to a governed route
                 |
                 v
Did someone with the required authority and capability respond?
        |                                |
       yes                              no
        |                                |
        v                                v
accepted / rejected / redirected      timed out
        |                                |
        +---------------+----------------+
                        v
      Record elapsed time, availability, and evidence
                        |
                        v
     Policy mismatch or uncertainty? -> Governance review
~~~

The diagram answers one question: what happened after routing? It does not say
that a fast response was good, that a timeout was caused by one person, or that
an accepted decision was correct.

## Records

- **Escalation Resolution Policy** defines allowed dispositions, a response
  window, an availability requirement, timeout action, and valid redirect
  routes for every governed route.
- **Escalation Resolution** links one selective escalation decision to the
  actual disposition, timestamps, reproduced elapsed time, availability,
  evidence, observed outcome, and governance.
- **Escalation Resolution Assessment** reproduces disposition, timeliness,
  verification, and availability summaries for one policy.
- **Governance Trigger** is required for late or timed-out resolution,
  unavailable capacity, unverified evidence, invalid redirection, or
  insufficient data.

## Example

The committed example sends a case to human review with a 60-minute response
limit. The route is only partially available and has no accountable
disposition after 90 minutes. The resolution is therefore `timed-out`, late,
example-only, and governance-open.

This is an intentionally adverse example. It proves the runtime can preserve a
failure to resolve without hiding it behind the fact that escalation was
attempted.

## Verifier Boundary

The verifier checks structure, reference resolution, route-policy coverage,
allowed dispositions, timestamp arithmetic, response-time conformance,
availability state, evidence status, aggregate arithmetic, and governance
routing. It does not prove resolution quality, reviewer competence, actual
service availability, causality, decision correctness, or authority.

Response time, resolution volume, and disposition are operational evidence.
They are not quality.

## Verify

~~~sh
node tools/qif.mjs calibration-report
npm test
~~~
