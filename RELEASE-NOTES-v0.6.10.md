# QIF v0.6.10

QIF v0.6.10 adds Handoff Authority Boundary to the Action Quality Contract runtime.

## Added

- `handoffPolicies` for source agent role, target agent role, delegated authority scope, authorization point, handoff input filter, context transfer policy, approval requirement, prohibited delegations, required lifecycle events, and governance refs.
- `handoffEvidence` for request-specific selected target agent, authorization result, context filtering, transferred context summary, authority scope, prohibited delegation attempts, lifecycle event refs, and evidence summary.
- Verifier enforcement that high-risk or write-like contracts reference handoff policies and high-risk or write-like requests include handoff evidence.
- Accepted-outcome blocking when handoff evidence is unauthorized, unfiltered, out of scope, or includes prohibited delegation attempts.
- Retained negative fixture cases for handoff policy and evidence rules.

## Boundary

The verifier checks structural traceability and rule compliance. It does not prove delegated-agent correctness, runtime authorization enforcement, semantic truth, or provider security compliance.

## Verification

Run:

```sh
npm test
```
