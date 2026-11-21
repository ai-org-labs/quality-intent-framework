# QIF v0.8.19 Recovery Evidence Independence and Cross-Layer Attestation

## Purpose

Recovery evidence can be internally consistent and still fail together. A
runtime log and a replay transcript may be produced by different processes but
share the same host, operator, provider, collection path, or reviewer. More
records do not automatically mean more independent evidence.

v0.8.19 extends the existing `skill-supply-chain` package so a human or AI can
show where recovery evidence came from, which layers are covered, which failure
domains are shared, and why an independence grade was produced.

## Plain-Language Flow

```text
Recovery claim
     |
     v
Evidence sources: who, where, how collected, who reviewed
     |
     +--> missing layer? ------------------------> governance
     |
     +--> shared host/provider/control plane? ---> governance
     |
     +--> self-attested or unverified? ----------> governance
     |
     v
Reproduce five separation axes and an independence grade
     |
     v
Accountable review; never automatic restart
```

## New Records

- `RecoveryEvidenceSource` identifies the evidence layer, principal, substrate,
  collection path, reviewer, source mode, and declared failure domains.
- `SharedFailureDomain` names a control plane, model family, provider, runtime,
  host, network, identity, logging, data source, or reviewer shared by sources.
- `CrossLayerAttestation` records who attested what, the receipt form, evidence,
  verification state, expiry, and whether the source attested to itself.
- `RecoveryIndependenceAssessment` reproduces required, covered, and missing
  layers plus principal, substrate, evidence, collection, and review separation.

## Grade Rules

1. A missing required layer produces `insufficient`.
2. Complete but unverified evidence produces `declared-separated`.
3. Verified evidence with incomplete separation produces `verified-separated`.
4. Only complete, verified evidence with every declared separation axis true
   produces `multi-axis-independent`.

The fourth grade is still a classification over declared and linked records.
It does not prove actual independence, authenticity, monitor validity,
common-cause freedom, sufficient recovery evidence, operational safety, or
authority to restart.

## Governance

QIF requires explicit governance triggers for coverage gaps, correlated
sources, unverified or self-attestation, and any assessment below
`multi-axis-independent`. The example intentionally includes a missing monitor
layer, a shared host, pending attestations, and example-only evidence.

## Use

```bash
node tools/qif.mjs validate examples/skill-supply-chain-package.json
node tools/validate-skill-supply-chain.mjs my-package.json
```

The local verifier checks structure, reference closure, reciprocal failure
domain links, coverage, declared separation, grade reproduction, and governance
routing. Semantic and operational validity require independent review,
attestation verification, shared-failure analysis, observed outcomes, and an
accountable governance decision.
