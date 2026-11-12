# Target Evaluation And Requirement-Gap Review

Use this mode when a concrete target exists or the user asks for checks derived
from requirements.

## Establish The Target

Record:

- domain and target type;
- lifecycle stage and decision being supported;
- stakeholders and operational impact;
- constraints, dependencies, and environment;
- available evidence and evidence not available;
- authority that owns acceptance, waiver, or escalation.

## Derive Applicable Intents

For each plausible loss:

1. identify the stakeholder and harmful outcome;
2. state the loss boundary;
3. derive a Quality Intent in observable language;
4. explain why it applies to this target;
5. define evidence needed to support or reject it;
6. define acceptance, conditional acceptance, rejection, and unknown states.

Use quality aspects as prompts to search for risks, not as mandatory sections.
Omit a lens only after checking whether the target, stakeholder, domain, or
operational impact makes it relevant.

## Find Concrete Gaps

Do not stop at labels such as "security is missing". Each gap should state:

- exact missing or conflicting concept, requirement, rule, state, boundary,
  evidence item, owner, or decision;
- the scenario where the gap matters;
- stakeholder and possible loss;
- why current evidence is insufficient;
- the smallest clarification, evidence, or change that would close it;
- confidence and applicability boundary.

For requirements, inspect at least:

- intended behavior and negative behavior;
- state transitions, ordering, concurrency, retries, and cancellation;
- data ownership, lifecycle, retention, privacy, and recovery;
- identities, permissions, abuse, and trust boundaries;
- latency, capacity, degradation, scaling, and resource limits;
- accessibility, usability, learnability, error recovery, and UX consistency;
- operation, observability, support, incident response, rollback, and change;
- legal, financial, audit, organizational, and human consequences;
- conceptual model, terminology, relationships, invariants, coordinate frames,
  perspectives, and assumptions when the system has an original world model.

## Evidence And Trust

For AI-produced findings use:

```yaml
finding_evidence:
  generated_by:
  source_artifact:
  reproducible:
  reproduced_by:
  false_positive_checked:
  impact_confirmed:
  final_status:
```

For reusable claims use:

```yaml
trust:
  sources: []
  generated_by:
  verified_by: []
  status: draft
  stale_after:
```

These records do not authenticate sources or prove impact. They make the
declared verification state inspectable.

## Verdict

Use the verdict vocabulary required by the current decision. Common bounded
states are `Go`, `Conditional Go`, `No-Go`, and `Pending`, or `acceptable`,
`conditionally acceptable`, `unacceptable`, and `unknown`.

Never force a positive or negative verdict when material evidence is missing.
Name residual risks, conditions, owner, deadline, and governance trigger.
