# QIF v0.6.7

QIF v0.6.7 hardens Action Quality Contract with Tool Guardrail Policy.

## Added

- `toolGuardrailPolicies` in action-quality-contract packages.
- `guardrailEvidence` records for pre-execution and post-execution tool checks.
- Verifier rules for tripwire behavior, side-effect boundary statements, stage matching, governance routing, and accepted-outcome blocking when guardrails trip or reject.

## Verification

- `npm test`
- AOF runtime log updated with source check, Need / Intent / Context, council judgment, verifier boundary, and release outcome.

## Boundary

The verifier proves guardrail structure and traceability. It does not prove that a guardrail is sufficient, that a tool call was safe, or that rejected terminal outputs undo external side effects.
