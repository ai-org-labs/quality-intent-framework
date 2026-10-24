# QIF v0.8.1 Portable Pattern Library Import

## Purpose

QIF v0.8.1 lets an organization receive reusable Decision Patterns and
Quality Intents without silently treating foreign knowledge as locally valid.

Portable means the knowledge can travel. It does not mean the knowledge is
true, applicable, safe to execute, active, or authoritative in the receiving
organization.

## Plain-Language Model

```text
Source quality knowledge
        |
        v
exact snapshot + digest + provenance
        |
        v
candidate-only import
        |
        +--> applicability still unknown
        +--> counterexamples still unresolved
        +--> no execution or authority
        |
        v
future local validation (v0.8.2)
```

The diagram means: preserve what arrived and where it came from, but do not
turn it into a local rule until the target organization tests it.

## Entities

| Entity | Purpose |
| --- | --- |
| `PortableKnowledgeImportPolicy` | Defines allowed knowledge types and the non-negotiable source, digest, applicability, counterexample, instruction, activation, and authority boundaries. |
| `PortableKnowledgeGovernanceTrigger` | Records why source trust, integrity, applicability, counterexamples, or assessment needs accountable review. |
| `PortableKnowledgeLibrary` | Identifies a versioned published collection, its items, digest, origin, license declaration, and trust metadata. |
| `PortableKnowledgeItem` | Preserves one exact source entity snapshot, its digest, provenance, applicability boundary, counterexamples, evidence, and non-executable instruction boundary. |
| `PortableKnowledgeImportDecision` | Records why library items were rejected or admitted as candidates for a declared target context. |
| `PortableKnowledgeAssessment` | Reproduces source integrity, counts, unresolved local validation work, insufficiency, and governance routing. |

## Required Flow

1. Resolve the source Decision Pattern or Quality Intent.
2. Preserve the exact source entity as `sourceSnapshot`.
3. Reproduce the canonical SHA-256 `sourceDigest`.
4. Declare provenance, applicability boundaries, counterexamples, and source evidence.
5. Verify the containing library digest and trust metadata.
6. Record either `candidate-import` or `reject-import` for a named target context.
7. Keep every admitted item `candidate`, non-executable, non-activating, and non-authoritative.
8. Route unverified sources, unresolved applicability, counterexamples, and insufficient assessment to governance.

## Integrity Rule

The verifier canonicalizes JSON by sorting object keys while retaining array
order. An item's digest must match the resolved source entity, and its embedded
snapshot must be exactly equal to that source entity. A library digest is then
reproduced from its ordered item ids and source digests.

The digest detects a mismatch between declared content and resolved content.
It does not prove source authenticity, ownership, licensing, safety, or truth.

## Example

`examples/qif-ledger-package.json` packages one Decision Pattern and one
Quality Intent from the discovery-session example. Their source snapshots and
digests match, but the library trust status is `draft`, target applicability
has not been assessed, and local counterexamples have not been reproduced.

The import decision is therefore `candidate-import`, `governance-required`,
and explicitly non-executable. The aggregate assessment remains
`insufficient` even though structural integrity is verified.

## Verifier Boundary

The local verifier can prove or reproduce:

- package, source entity, and evidence reference resolution;
- exact source snapshot equality;
- item and library digest consistency;
- knowledge type and source collection consistency;
- applicability and counterexample presence;
- trust-source resolution;
- candidate-only, non-executable, non-activating, and non-authoritative import;
- assessment counts, signals, insufficiency, and governance routing.

It cannot prove:

- source authenticity, ownership, or license sufficiency;
- semantic truth or target-context applicability;
- evidence authenticity or completeness;
- that a counterexample is complete or correctly interpreted;
- that imported knowledge is safe to execute;
- authorization or decision authority.

## Non-Goals

v0.8.1 does not provide a registry, network protocol, UI, signature authority,
automatic skill loader, automatic activation, local reproduction test, or
cross-domain validity claim. Local applicability and reproduction are the
v0.8.2 boundary.
