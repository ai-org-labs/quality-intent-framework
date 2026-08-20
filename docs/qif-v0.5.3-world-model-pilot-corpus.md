# QIF v0.5.3 World Model Pilot Corpus

## Purpose

World Model Calibration requires unseen cases, but QIF also needs to know where those cases came from, whether they are safe to use, and whether the corpus is structurally ready for expert or AI assessment.

The `world-model-pilot-corpus` package type records that preparation layer.

It does not store raw confidential source material. It records sanitized source references, privacy controls, normalized pilot cases, sampling policy, expert panel readiness, adjudication rubric, ingestion outcome, and governance triggers.

## Boundary

This layer sits before `world-model-calibration`.

```text
Pilot Sources
-> Privacy Controls
-> Pilot Cases
-> Normalization Steps
-> Sampling Policy
-> Expert Panel / Rubric
-> Ingestion Run
-> World Model Calibration
```

The verifier can prove structural readiness. It cannot prove that the cases are representative, legally usable, or semantically sufficient.

## Core Entities

| Entity | Owns | Must Not Own |
| --- | --- | --- |
| Pilot Source | source type, artifact reference, domain, sensitivity, owner, trust | raw confidential content |
| Privacy Control | classification, redaction requirement, redaction state, allowed use, reviewer | legal determination beyond the recorded review |
| Sampling Policy | minimum cases, required domains, unseen requirement, synthetic policy, real-case ratio, source diversity, governance-on-failure | semantic coverage truth |
| Pilot Case | sanitized case identity, domain, source refs, decision context, case kind, unseen status, expected use | hidden expert rationale |
| Case Normalization Step | transformation method, preserved signals, removed sensitive data, confidence | unstated source edits |
| Expert Panel | members, roles, domains, independent quorum, conflict policy | final calibration judgment |
| Adjudication Rubric | criteria and disagreement policy for deciding whether a case is fit for calibration | checklist-based quality definition |
| Ingestion Run | reproducible corpus readiness metrics and conclusion | downstream calibration result |
| Governance Trigger | why readiness failure needs governance | governance decision outcome |

## Executable Checks

The local verifier `tools/validate-world-model-pilot-corpus.mjs` checks:

- package refs are repository-local and type-correct
- source trust metadata is present and verified sources name verifiers
- privacy controls resolve to pilot sources
- pilot cases resolve to source and privacy controls
- normalization steps resolve to cases and sources
- redaction-required cases have sensitive data removed during normalization
- expert panel quorum can be satisfied by independent members
- adjudication rubrics contain criteria
- ingestion run `caseCount` reproduces from `caseRefs`
- ingestion run `domainCoverage` reproduces from referenced case domains
- ingestion run `realCaseRatio` reproduces from case kinds
- ingestion run `privacyReady` reproduces from referenced privacy controls
- sampling policy failures trigger governance when configured
- failed readiness cannot be reported as `ready`
- verifier boundary explicitly refuses semantic-truth claims

## Example

See `examples/world-model-pilot-corpus-package.json`.

The example prepares three real-redacted pilot cases across software, maintenance, and accounting. Each source has trust metadata, each redaction-required case has verified privacy control and normalization, and the ingestion run concludes `ready`.

## Non-Goals

- No UI.
- No external system integration.
- No storage of raw confidential source material.
- No claim that fixture count or corpus count is quality.
- No claim that verifier success proves case representativeness or semantic truth.
