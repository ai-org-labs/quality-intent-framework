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
-> Context Memory Boundary
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
| Context Memory Boundary | Boundary for session history, local runtime context, agent memory, and LLM-visible context freshness and trust. |
| Expected State Transition | The intended pre-state, post-state, stop condition, and invariants. |
| Rollback Plan | How the action can be reversed or contained. |
| Evidence Requirement | Evidence needed to accept, reject, or conditionally accept the action. |
| Action Contract | The complete quality boundary around the action. |
| Action Request | A specific request to execute under a contract. |
| Runtime Trace | Trace/span reference proving what execution path occurred. |
| Trace Approval Evidence | Evidence that an approval-required tool call was approved, denied, resumed, or replayed against the same invocation. |
| Guardrail Evidence | Evidence that a tool guardrail ran, what it evaluated, whether a tripwire triggered, and whether side-effect limits were acknowledged. |
| Context Memory Evidence | Evidence about which memory/context influenced the action, whether it was fresh, trusted, compacted, and contamination-checked. |
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
- context memory boundaries distinguish session history, local runtime context, agent memory, and LLM-visible context;
- LLM-visible context boundaries explicitly handle embedded instructions;
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
- high-risk or write-like requests include context memory evidence;
- LLM-visible context memory evidence records contamination checks;
- stale or untrusted context used in a decision routes to governance;
- accepted outcomes cannot rely on stale or untrusted context memory evidence;
- accepted approval-gated outcomes require approved trace approval evidence;
- accepted outcomes match expected post-state;
- low-confidence outcomes trigger governance;
- verifier boundary refuses semantic truth and tool-execution-safety claims.

## Boundary

The verifier proves structural action governance. It does not prove that a tool call was safe, that the runtime sandbox enforced policy correctly, or that human approval was correct.

Semantic and operational validity require runtime enforcement, security review for sensitive tools, human approval for external side effects, and post-action inspection.

## Example

See `examples/action-quality-contract-package.json`.

The example describes a provider-neutral local shell action for regenerating fixtures and running `npm test`. It records permission, approval, approval persistence policy, tool guardrail policy, context memory boundary, expected repository state, rollback, evidence, trace summary, trace approval evidence, guardrail evidence, context memory evidence, and accepted outcome.


## v0.6.9 Containment and Safe Exit Boundary

QIF v0.6.9 adds containment as a first-class action-quality boundary. The intent is not to prove that a sandbox, monitor, or platform is secure. The intent is to require an action package to declare what the agent is allowed to affect, what external communication is forbidden, which signals are monitored, when the run must pause or stop, and how incidents are routed to governance.

New entities:

- `containmentPolicies`: reusable containment scope, allowed/prohibited external communication, safe-exit criteria, monitoring signals, incident response plan, shutdown authority, restart authority, and status.
- `containmentEvidence`: request-specific evidence that containment was maintained or breached, whether unauthorized external communication occurred, whether safe-exit triggered, whether incident response opened, and the current incident status.

Verifier rules:

- High-risk or write-like action contracts must reference containment policies.
- High-risk or write-like action requests must include containment evidence.
- Containment policies must link tool surface and execution environment, declare monitoring signals, include stop or pause behavior, and route incidents to governance.
- Containment evidence must link request, runtime trace, and containment policy.
- Containment breach and unauthorized external communication require governance triggers.
- A safe-exit trigger must open incident response.
- An accepted outcome must not rely on breached containment or unresolved incident evidence.

Verifier boundary:

Passing these rules proves structural containment traceability only. It does not prove sandbox enforcement, monitor reliability, incident absence, semantic safety, or provider security compliance.


## v0.6.10 Handoff Authority Boundary

QIF v0.6.10 adds delegated-agent handoff authority as a first-class action-quality boundary. The intent is not to implement multi-agent orchestration. The intent is to make the transfer of authority, context, and lifecycle evidence explicit whenever an agent may delegate work to another agent.

New entities:

- `handoffPolicies`: source agent role, target agent role, delegated authority scope, authorization point, handoff input filter, context transfer policy, approval requirement, prohibited delegations, required lifecycle events, governance triggers, and status.
- `handoffEvidence`: request-specific evidence for selected target agent, authorization result, context filtering, transferred context summary, authority scope, prohibited delegation attempts, lifecycle event references, governance triggers, and status.

Verifier rules:

- High-risk or write-like action contracts must reference handoff policies.
- High-risk or write-like action requests must include handoff evidence, even when no handoff occurred.
- Handoff policies must require authorization before delegated side effects and filtered handoff context.
- Handoff evidence must link action request, runtime trace, and handoff policy.
- Denied or failed handoff authorization, authority-scope breach, and prohibited delegation attempts require governance triggers.
- Accepted outcomes must not rely on unauthorized, unfiltered, or out-of-scope handoff evidence.

Verifier boundary:

Passing these rules proves structural handoff traceability only. It does not prove delegated-agent correctness, runtime authorization enforcement, semantic safety, or provider security compliance.
