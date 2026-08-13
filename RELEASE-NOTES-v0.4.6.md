# QIF v0.4.6

QIF v0.4.6 adds executable Evidence Retention Policies to the quality-gate runtime.

This release targets the current agentic AI governance gap: auditability depends not only on producing evidence, but on retaining reconstructable evidence with explicit sensitivity, integrity, access control, disposal, and ownership rules.

## Highlights

- Added `evidenceRetentionPolicies` to quality-gate packages.
- Required every quality-gate evidence item to cite a policy through `retentionPolicyRef`.
- Added retention policy fields for covered evidence types, retention period, sensitivity, integrity protection, access control, disposal rule, owner, and anti-patterns.
- Extended verifier rules for missing policy refs, undeclared evidence types, uncovered evidence types, confidential/open-access conflicts, restricted/weak-integrity conflicts, and unused policy declarations.
- Updated the quality-gate example with release evidence and monitoring evidence retention policies.
- Updated AI authoring guidance and v0.4 runtime requirements so agents preserve reconstructable evidence rather than only summary counts.
- Added retained negative fixtures covering evidence retention policy misuse.

## Verification

- `npm test`
- Positive checks: 3/3
- Negative fixture checks: 239/239
- Self-evaluation package validation: `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.6.json`
- AOF organization verification: 231/231 using AOF v10.8.0
- AOF command routing audit: passed using AOF v10.8.0
- AOF review provenance audit: passed using AOF v10.8.0
- Public-readiness scan: no personal account, email, old repository, or local path residue outside `.git`

## Verifier Boundary

Verifier success proves structural integrity, traceability, reference resolution, confidence reproducibility, evidence vocabulary declaration and usage, timing rule enforcement, retention policy coverage, and rule compliance.

It does not prove semantic quality truth, pilot success, or that the organization chose the right evidence retention period. Semantic validity still requires expert review, operational feedback, reproduction tests, audit needs, and governance.
