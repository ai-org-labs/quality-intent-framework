# QIF v0.8.1

## Portable Pattern Library Import

QIF v0.8.1 lets reusable Decision Patterns and Quality Intents travel between
teams, agents, and organizations without silently becoming local truth,
instructions, policy, or authority.

### What is new

- versioned Portable Knowledge Libraries with publisher, origin, license, and trust metadata;
- exact source entity snapshots and reproducible canonical SHA-256 digests;
- preserved provenance, applicability boundaries, counterexamples, and evidence;
- candidate-import and reject-import decisions for a declared target context;
- hard boundaries against executable imported instructions, hidden reasoning, automatic activation, and automatic authority;
- deterministic assessment of integrity, candidate state, unresolved applicability, unresolved counterexamples, insufficiency, and governance;
- `qif open-risks` visibility for portable-knowledge governance triggers;
- 25 new retained negative fixtures.

The committed example imports one Decision Pattern and one Quality Intent from
the discovery-session package. Their snapshots and digests match, but source
trust is still draft and no local applicability or reproduction test exists.
The result is therefore candidate-only, governance-required, and insufficient.

## Boundaries

A valid digest proves that declared source content matches resolved source
content. It does not prove authenticity, ownership, license sufficiency,
semantic truth, target applicability, safe execution, authorization, or
decision authority.

## Verification

- all positive package checks pass;
- all 1,331 retained negative fixtures are rejected with expected errors;
- the portable AI package builds, verifies, and rejects mutation;
- AOF v12.2.0 records Need Validation, Charter, Council, actor packet, review,
  self-review, and retrospective evidence.
