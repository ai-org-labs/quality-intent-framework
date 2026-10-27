# QIF v0.8.4: Portable Trust Policy and Attestation Binding

## Purpose

v0.8.4 records which attestation evidence a local organization accepts for a
portable Quality Intent or Decision Pattern. It binds an exact item digest to
a versioned local policy and reproduces every policy check.

```text
Portable item digest
        +
Recorded attestation
        +
Versioned local trust policy
        |
        v
Deterministic trust decision
        |
        +-- all checks pass --> policy-conformant candidate
        |
        +-- any check fails --> reject or governance review
```

`policy-conformant-candidate` is deliberately narrow. It does not mean the
knowledge is true, safe, applicable, activated, authorized, or authoritative.

## Entities

| Entity | Owns | Must not own |
| --- | --- | --- |
| `PortableKnowledgeTrustPolicy` | Versioned accepted issuers, subject identities, predicate types, root revisions, validity window, and evidence requirements | Universal trust, key custody, or semantic quality |
| `PortableKnowledgeAttestation` | Exact item digest, recorded signer identity, predicate, root revision, time, transparency, revocation, and evidence state | A claim that cryptography was independently executed by QIF |
| `PortableKnowledgeTrustDecision` | Reproduced checks and a policy-local candidate, rejection, or governance result | Activation, authorization, safety approval, or authority |

## Checks

The verifier reproduces:

1. item and subject-digest equality;
2. pinned policy version;
3. accepted issuer and subject identity;
4. accepted predicate type and trust-root revision;
5. policy and attestation validity windows at evaluation time;
6. recorded cryptographic and transparency evidence status;
7. recorded revocation status;
8. fail-closed decision and governance routing.

Unknown, missing, expired, mismatched, failed, or revoked evidence cannot
produce a policy-conformant candidate. History remains intact.

## Verifier Boundary

The verifier checks declared structure and deterministic policy conformance.
It does not perform live signature verification, query a transparency log,
manage keys, prove source authenticity beyond recorded evidence, prove artifact
safety or semantic fitness, activate knowledge, authorize action, or grant
authority.

## Example

`examples/qif-ledger-package.json` binds `PKI-002` to a recorded SLSA
provenance attestation and `PKTP-001`. The example passes the local policy but
remains a candidate and inherits all earlier applicability, evidence, and
governance boundaries.
