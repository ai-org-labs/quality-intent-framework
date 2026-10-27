# QIF v0.8.4: Portable Trust Policy and Attestation Binding

QIF now binds recorded attestation evidence to a versioned local trust policy
before portable quality knowledge can become a policy-conformant candidate.

## Added

- Provider-neutral portable trust policies.
- Exact item-digest attestation records.
- Deterministic issuer, subject, predicate, trust-root, validity,
  cryptographic-evidence, transparency, and revocation checks.
- Fail-closed trust decisions and governance routing.
- 15 retained negative fixtures and portable AI guidance.

## Boundary

QIF does not perform live cryptographic verification or prove artifact safety,
semantic fitness, authorization, activation, or authority. A passing decision
means only that recorded evidence conforms to one named local policy revision.
