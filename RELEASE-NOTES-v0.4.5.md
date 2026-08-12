# QIF v0.4.5

QIF v0.4.5 adds executable Evaluation Timing Rules and Evaluation Timing Decisions to the quality-gate runtime.

This release targets the current agentic AI control gap: quality evidence must not only be valid and traceable, it must be collected at the right time. Required pre-decision evaluation can now be structurally enforced before a Go or Conditional Go decision proceeds.

## Highlights

- Added `evaluationTimingRules` to quality-gate packages.
- Added `evaluationTimingDecisions` to record target-specific timing choices, rationale, evidence, owner, confidence, and status.
- Required-before-decision timing rules now require completed timing decisions before a gate decision can proceed.
- Added verifier checks for linked intents, timing enums, selected timing consistency, completed timing evidence, gate-decision linkage, and governance-backed waivers.
- Updated the quality-gate example with pre-release boundary evidence timing and continuous post-activation monitoring timing.
- Updated AI authoring guidance and v0.4 runtime requirements so agents decide when evaluation is required before writing a final gate decision.
- Added retained negative fixtures covering evaluation timing misuse.

## Verification

- `npm test`
- Positive checks: 3/3
- Negative fixture checks: 233/233
- Self-evaluation package validation: `node tools/validate-qif-runtime.mjs assessments/qif-self-evaluation-v0.4.5.json`
- AOF organization verification: 231/231 using AOF v10.8.0
- AOF command routing audit: passed using AOF v10.8.0
- AOF review provenance audit: passed using AOF v10.8.0
- Public-readiness scan: no personal account, email, old repository, or local path residue outside `.git`

## Verifier Boundary

Verifier success proves structural integrity, traceability, reference resolution, confidence reproducibility, evidence vocabulary declaration and usage, timing rule enforcement, and rule compliance.

It does not prove semantic quality truth, pilot success, or that the organization chose the right evaluation timing. Semantic validity still requires expert review, operational feedback, reproduction tests, and governance.
