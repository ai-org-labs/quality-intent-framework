# QIF v0.8.19

QIF v0.8.19 adds Recovery Evidence Independence and Cross-Layer Attestation.

Recovery evidence now records its principal, substrate, collection path,
reviewer, layer, source mode, and shared failure domains. Cross-layer
attestations expose self-attestation and verification state. A deterministic
assessment reproduces required coverage and five separation axes before
assigning an independence grade and governance triggers.

The example intentionally fails closed: it has no monitor source, two evidence
paths share a host, and attestations remain example-only or self-attested.
Structural success does not prove evidence independence, authenticity,
common-cause freedom, recovery sufficiency, operational safety, or restart
authority.
