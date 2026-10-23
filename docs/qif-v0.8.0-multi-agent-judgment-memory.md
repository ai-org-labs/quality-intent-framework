# QIF v0.8.0 Multi-Agent Judgment Memory

## Purpose

QIF v0.8.0 makes quality judgment reusable without flattening several people
or agents into one unexplained answer.

The runtime preserves:

- what each lane judged;
- which evidence and dependencies shaped that judgment;
- what changed between revisions;
- which dissent remained after synthesis;
- why a memory was retained or retired;
- who owns the authority boundary around a joined judgment.

It extends the Living QIF Ledger. It is not a provider-specific agent memory
store and does not require AOF at runtime.

## Plain-Language Model

```text
Reviewer A judgment ----\
                        +--> disclose shared sources --> governed join
Reviewer B judgment ----/             |                     |
                                      |                     +--> preserve dissent
Old revision --> new revision --------+                     +--> assess sufficiency

Retirement decision --> exclude from current use, keep history
```

The diagram means: keep the original lanes, name what they share, and retain
the old record even when it is no longer used.

## Entities

| Entity | Purpose |
| --- | --- |
| `JudgmentMemoryPolicy` | Defines minimum lanes and non-negotiable preservation, revision, privacy, forgetting, and authority boundaries. |
| `JudgmentMemoryGovernanceTrigger` | Records why evidence, dependency, conflict, retirement, or assessment needs accountable review. |
| `JudgmentMemoryEntry` | Identifies one lane, actor, role, source judgment, evidence origin, dependencies, current revision, and current/retired state. |
| `JudgmentMemoryDependency` | Declares a shared or independent source, model, prompt, tool, data, or operator relationship and its impact on independence. |
| `JudgmentMemoryRevision` | Stores an append-only judgment snapshot with rationale, evidence, applicability boundary, confidence, and evidence state. |
| `JudgmentRetirementDecision` | Records retain/retire decisions without deleting historical content. |
| `MultiAgentJudgmentJoin` | Synthesizes current lane memories while preserving exact dissent, conflict dimensions, dependencies, evidence, owner, and authority boundary. |
| `JudgmentMemoryAssessment` | Reproduces structural counts, evidence sufficiency, signals, and governance routing. |

## Required Flow

```text
Source judgments
-> lane-local memory entries
-> dependency disclosure
-> append-only revisions
-> governed join
-> assessment
-> later retain/retire review
```

Rules:

1. Each memory links to a source judgment and evidence origin.
2. Each memory has exactly one current revision, but superseded revisions stay.
3. Dependencies affecting joined memories must be disclosed by the join.
4. Retired memories cannot enter a current join.
5. Memories whose current judgment differs from the joined judgment are exact dissent.
6. Unverified evidence, shared dependencies, or conflicts make the example join insufficient and require governance.
7. Retirement is non-destructive. The entry and revisions remain auditable.
8. Hidden chain-of-thought is never stored as QIF memory evidence.

## Example

`examples/qif-ledger-package.json` retains three current reviewer lanes and one
retired legacy summary. One lane was corrected through a two-revision chain.
The three current lanes share an underlying escalation-resolution source and
disagree about whether the significant state is `timed-out` or `deferred`.

The join records `deferred`, preserves the `timed-out` lane as dissent, names
the shared-source dependency, and routes the result to governance. Because the
evidence is example-only, the assessment remains `insufficient`.

## Verifier Boundary

The local verifier can prove or reproduce:

- package and entity reference resolution;
- exact current-revision linkage and contiguous revision numbering;
- dependency backlinks and shared-dependency disclosure;
- retirement state consistency and non-destructive deletion policy;
- distinct-lane minimums;
- current revision, dissent, conflict, and dependency consistency in joins;
- assessment counts, signals, sufficiency, and required governance triggers.

It cannot prove:

- that a judgment is semantically true;
- that an agent or expert is competent;
- that consensus or adjudication is correct;
- that declared independence is real;
- that evidence is authentic or complete;
- that a join authorizes action or grants authority.

Semantic validity still requires accountable human or authorized-system
review, operational feedback, reproduction tests, and governance.

## Non-Goals

v0.8.0 does not provide:

- a UI or external memory service;
- automatic employee scoring or surveillance;
- hidden reasoning collection;
- automatic forgetting, authorization, or policy mutation;
- proof that quality knowledge transfers across organizations;
- the portable pattern-library import and local-validation flow planned for
  later v0.8 releases.
