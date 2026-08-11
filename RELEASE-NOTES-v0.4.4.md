# QIF v0.4.4

QIF v0.4.4 adds an executable Evidence Type Vocabulary to the quality-gate runtime.

This release targets the current agentic AI development gap: evidence and evaluation traces need governed type contracts before autonomous or AI-assisted reviewers can produce reliable verdicts.

## Highlights

- Added `evidenceTypeVocabulary` to quality-gate packages.
- Required evidence item types and gate-rule `requiredEvidenceTypes` to resolve against the declared vocabulary.
- Added vocabulary fields for purpose, source category, expected independence, `trustRequired`, `findingEvidenceRequired`, and anti-patterns.
- Extended verifier rules for undeclared evidence types, unused vocabulary entries, and missing vocabulary-required metadata.
- Updated the quality-gate example with five declared evidence types.
- Updated AI authoring guidance so agents do not invent evidence type strings without declaring them first.
- Updated the roadmap status for Phase 1 runtime closure.
- Added v0.4.4 self-evaluation artifacts.

## Verification

- `npm test`
- Positive checks: 3/3
- Negative fixture checks: 226/226
- Self-evaluation package validation: `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.4.json`
- AOF organization verification: 231/231 using AOF v10.8.0
- Public-readiness scan: no personal account, email, old repository, or local path residue outside `.git`

## Verifier Boundary

Verifier success proves structural integrity, traceability, reference resolution, confidence reproducibility, evidence vocabulary declaration and usage, and rule compliance.

It does not prove semantic quality truth, pilot success, or that the organization chose the right evidence types. Semantic validity still requires expert review, operational feedback, reproduction tests, and governance.
