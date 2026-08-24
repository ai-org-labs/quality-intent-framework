# QIF v0.6.0 Action Quality Contract

## Purpose

Action Quality Contract makes AI agent tool use auditable before and after execution.

Modern agents can call shells, browsers, MCP servers, computer-use tools, code editors, hosted tools, and other agents. QIF must not depend on any single harness. The contract records the provider-neutral quality boundary around an action:

```text
Tool Surface
-> Execution Environment
-> Permission Policy
-> Approval Gate
-> Expected State Transition
-> Rollback Plan
-> Evidence Requirement
-> Action Request
-> Runtime Trace
-> Trace Approval Evidence
-> Action Outcome
-> Governance Trigger
```

## Executable Entities

| Entity | Purpose |
| --- | --- |
| Tool Surface | Provider-neutral description of the action surface and capabilities. |
| Execution Environment | Runtime isolation, identity, and network boundaries. |
| Permission Policy | Allowed scope, prohibited operations, and approval requirement. |
| Approval Gate | Accountable approval for high-risk or write-like actions. |
| Expected State Transition | The intended pre-state, post-state, stop condition, and invariants. |
| Rollback Plan | How the action can be reversed or contained. |
| Evidence Requirement | Evidence needed to accept, reject, or conditionally accept the action. |
| Action Contract | The complete quality boundary around the action. |
| Action Request | A specific request to execute under a contract. |
| Runtime Trace | Trace/span reference proving what execution path occurred. |
| Trace Approval Evidence | Evidence that an approval-required tool call was approved, denied, resumed, or replayed against the same invocation. |
| Action Outcome | Actual state, verdict, confidence, evidence, and residual risk. |
| Governance Trigger | Review route for unsafe, low-confidence, or policy-conflicting outcomes. |

## Verifier Rules

`tools/validate-action-quality-contract.mjs` checks:

- all references resolve;
- tool surfaces declare capabilities;
- execution environments record isolation, identity, and network boundaries;
- permission policies declare allowed scope, prohibited operations, and approval requirements;
- approved approval gates include approval time;
- expected transitions include stop conditions;
- rollback plans link to expected transitions;
- evidence requirements name verdicts they support;
- high-risk or write-like contracts require approval gates;
- action requests use the same tool surface as their contract;
- runtime traces include spans and redact sensitive data when present;
- approval-gated requests include trace approval evidence;
- approved approval evidence records approver and decision time;
- approval-required evidence cannot be marked `not-required`;
- replayed or resumed tool calls are bound to the original invocation;
- accepted approval-gated outcomes require approved trace approval evidence;
- accepted outcomes match expected post-state;
- low-confidence outcomes trigger governance;
- verifier boundary refuses semantic truth and tool-execution-safety claims.

## Boundary

The verifier proves structural action governance. It does not prove that a tool call was safe, that the runtime sandbox enforced policy correctly, or that human approval was correct.

Semantic and operational validity require runtime enforcement, security review for sensitive tools, human approval for external side effects, and post-action inspection.

## Example

See `examples/action-quality-contract-package.json`.

The example describes a provider-neutral local shell action for regenerating fixtures and running `npm test`. It records permission, approval, expected repository state, rollback, evidence, trace summary, trace approval evidence, and accepted outcome.
