# QIF v0.6.9

QIF v0.6.9 adds Agent Containment and Safe Exit Boundary to the Action Quality Contract runtime.

## Added

- `containmentPolicies` for containment scope, allowed and prohibited external communication, safe-exit criteria, monitoring signals, incident response plan, shutdown authority, and restart authority.
- `containmentEvidence` for request-specific containment status, unauthorized external communication, safe-exit trigger status, incident response status, and evidence summary.
- Verifier enforcement that high-risk or write-like contracts reference containment policies and high-risk or write-like requests include containment evidence.
- Accepted-outcome blocking when containment is breached, unauthorized external communication occurred, or incident evidence remains unresolved.
- Retained negative fixture cases for the new containment and safe-exit rules.

## Boundary

The verifier checks structural traceability and rule compliance. It does not prove sandbox enforcement, monitor reliability, incident absence, semantic truth, or provider security compliance.

## Verification

Run:

```sh
npm test
```
