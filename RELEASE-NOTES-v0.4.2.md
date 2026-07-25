# QIF v0.4.2

QIF v0.4.2 expands the quality-gate runtime with canonical Quality Aspects, AI finding verification metadata, and evidence trust metadata.

The release keeps QIF's anti-checklist boundary: aspects and metrics are discovery and evidence aids, not quality itself.

## Highlights

- Added canonical Quality Aspects as discovery lenses in `docs/qif-quality-aspect-taxonomy.md`.
- Added first-class `qualityAspects` to quality-gate packages.
- Linked evaluation perspectives to quality aspects through `linkedAspectRefs`.
- Extended the quality-gate verifier so aspects remain `discovery-lens-only`, resolve from perspectives, and cannot sit unused.
- Added `findingEvidence` metadata for AI-generated quality and security findings.
- Added `trust` metadata for evidence source grounding, generator, verifiers, trust status, and freshness.
- Expanded the quality-gate example across functional, non-functional, usability, performance, security, UX design, accessibility, privacy, data quality, auditability, safety, customer, trust, and organizational operability lenses.
- Added retained negative fixtures for aspect misuse, unsupported or unused aspects, broken aspect references, AI finding-evidence verification, and trust metadata verification.
- Added executable QIF self-evaluation artifacts under `assessments/`.

## Verification

- `npm test`
- Positive checks: 3/3
- Negative fixture checks: 69/69
- Self-evaluation package validation: `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.2.json`
- AOF organization verification: 221/221 using AOF v9.7.0
- Public-readiness scan: no personal account, email, old repository, or local path residue outside `.git`

## Self-Evaluation

QIF evaluated itself using the latest quality-gate runtime.

- Gate decision: Conditional Go
- Confidence: 0.82
- Achieved: concept coherence, executable baseline, AI usability
- Partially achieved: release readiness before publication

The release becomes publication-ready only when the verified commit is pushed, tagged, and released at the exact SHA.

## Verifier Boundary

Verifier success proves structural integrity, traceability, reference resolution, confidence reproducibility, and rule compliance.

It does not prove semantic quality truth, pilot success, or that an organization's quality judgment is correct. Semantic validity still requires expert review, operational feedback, reproduction tests, and governance.
