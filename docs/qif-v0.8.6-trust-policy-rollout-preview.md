# QIF v0.8.6: Trust Policy Rollout Preview

## Purpose

A policy can be internally consistent and still surprise an organization when
it is applied to a population. v0.8.6 evaluates a draft portable-knowledge
trust policy against a frozen declared population before activation.

```text
Current policy + draft policy + frozen item population
                         |
                         v
              one preview result per item
                         |
        +----------------+----------------+
        |                |                |
     unchanged        changed       not evaluable
        |                |                |
        +----------------+----------------+
                         v
             affected-knowledge census
                         |
      complete and stable / governance / blocked
```

## Frozen Scope

`PortableKnowledgeRolloutPreview` states whether the scope contains every
portable item in the package or an explicitly bounded set. Its snapshot binds
each item reference to the recorded source digest. A canonical digest freezes
the whole declared population.

The verifier can prove the declared snapshot is intact. For an explicit scope,
it cannot prove that organizational judgment selected every relevant item.

## Per-Item Preview

Each `PortableKnowledgeRolloutItemPreview` represents exactly one scoped item.
Complete inputs bind a baseline result and a replay under the proposed policy.
Missing or ambiguous inputs remain visible as `not-evaluable`; the runtime
does not invent a result to improve apparent coverage.

The item result records:

- baseline and proposed-policy outcomes;
- unchanged, tightened, relaxed, or indeterminate delta;
- material-change state;
- unresolved input codes;
- required governance; and
- explicit non-activation and non-authority boundaries.

## Affected-Knowledge Census

The aggregate reproduces population size, unique coverage, decision outcomes,
outcome deltas, material changes, and unresolved inputs from the item records.
Coverage is complete only when every frozen item appears exactly once.

An incomplete population or unresolved input blocks rollout. A complete
population with material changes still requires governance. A stable preview
may become ready for a governance decision, but never authorizes activation.

## Trend Basis

GitHub ruleset Evaluate mode reports actions that would pass or fail before a
ruleset becomes active. Sigstore policy-controller warn mode observes policy
nonconformance without blocking admission. SLSA Verification Summary
Attestations identify the policy used for verification and recommend binding
its exact version by digest. QIF generalizes this pre-enforcement observation
pattern to portable organizational quality knowledge.

## Verifier Boundary

The verifier proves declared scope integrity, one-to-one item coverage,
reference consistency, deterministic outcome comparison, census arithmetic,
and required governance routing. It does not prove policy wisdom, source or
attestation authenticity, organizational scope completeness, operational
fitness, activation approval, enforcement authority, or semantic truth.
