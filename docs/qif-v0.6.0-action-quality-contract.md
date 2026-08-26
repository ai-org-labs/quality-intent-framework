# QIF v0.6.0 Action Quality Contract

## Purpose

Action Quality Contract makes AI agent tool use auditable before and after execution.

Modern agents can call shells, browsers, MCP servers, computer-use tools, code editors, hosted tools, and other agents. QIF must not depend on any single harness. The contract records the provider-neutral quality boundary around an action:

```text
Tool Surface
-> Execution Environment
-> Permission Policy
-> Approval Gate
-> Approval Persistence Policy
-> Tool Guardrail Policy
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
| Approval Persistence Policy | Scope, expiry, identity boundary, and revocation rule for sticky approval or rejection decisions. |
| Tool Guardrail Policy | Pre-execution or post-execution guardrail policy for validating tool input/output and defining tripwire behavior. |
| Expected State Transition | The intended pre-state, post-state, stop condition, and invariants. |
| Rollback Plan | How the action can be reversed or contained. |
| Evidence Requirement | Evidence needed to accept, reject, or conditionally accept the action. |
| Action Contract | The complete quality boundary around the action. |
| Action Request | A specific request to execute under a contract. |
| Runtime Trace | Trace/span reference proving what execution path occurred. |
| Trace Approval Evidence | Evidence that an approval-required tool call was approved, denied, resumed, or replayed against the same invocation. |
| Guardrail Evidence | Evidence that a tool guardrail ran, what it evaluated, whether a tripwire triggered, and whether side-effect limits were acknowledged. |
| Action Outcome | Actual state, verdict, confidence, evidence, and residual risk. |
| Governance Trigger | Review route for unsafe, low-confidence, or policy-conflicting outcomes. |

## Verifier Rules

`tools/validate-action-quality-contract.mjs` checks:

- all references resolve;
- tool surfaces declare capabilities;
- execution environments record isolation, identity, and network boundaries;
- permission policies declare allowed scope, prohibited operations, and approval requirements;
- approved approval gates include approval time;
- approval persistence policies declare scope, allowed decisions, expiry, identity boundary, and revocation conditions;
- approval persistence identity scope cannot be wildcard;
- cross-run approval reuse requires canonical invocation binding;
- tool guardrail policies link tool surfaces, define pre/post execution stage, tripwire behavior, and side-effect boundary;
- pre-execution tool guardrails must run before tool execution;
- guardrail policies must state that guardrails do not undo side effects;
- expected transitions include stop conditions;
- rollback plans link to expected transitions;
- evidence requirements name verdicts they support;
- high-risk or write-like contracts require approval gates;
- action requests use the same tool surface as their contract;
- runtime traces include spans and redact sensitive data when present;
- approval-gated requests include trace approval evidence;
- approved approval evidence records approver and decision time;
- approval evidence records whether persistence was applied and links to a persistence policy when it was;
- approval-required evidence cannot be marked `not-required`;
- approval decisions must be allowed by their persistence policy;
- replayed or resumed tool calls are bound to the original invocation;
- high-risk or write-like requests include both pre-execution and post-execution guardrail evidence;
- guardrail evidence links to the request, trace, and policy, and its stage matches the policy;
- tripwire-triggered guardrail evidence routes to governance;
- accepted outcomes cannot have tripped or rejected guardrail evidence;
- accepted approval-gated outcomes require approved trace approval evidence;
- accepted outcomes match expected post-state;
- low-confidence outcomes trigger governance;
- verifier boundary refuses semantic truth and tool-execution-safety claims.

## Boundary

The verifier proves structural action governance. It does not prove that a tool call was safe, that the runtime sandbox enforced policy correctly, or that human approval was correct.

Semantic and operational validity require runtime enforcement, security review for sensitive tools, human approval for external side effects, and post-action inspection.

## Example

See `examples/action-quality-contract-package.json`.

The example describes a provider-neutral local shell action for regenerating fixtures and running `npm test`. It records permission, approval, approval persistence policy, tool guardrail policy, expected repository state, rollback, evidence, trace summary, trace approval evidence, guardrail evidence, and accepted outcome.
