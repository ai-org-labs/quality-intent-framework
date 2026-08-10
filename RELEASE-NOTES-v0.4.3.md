# QIF v0.4.3

QIF v0.4.3 completes retained negative fixture coverage for the two core QIF
package verifiers and refreshes the forward roadmap for long-horizon agentic
work.

## What You Can Do Now

- Detect silent weakening of every implemented error branch in
  `tools/validate-qif.mjs`.
- Detect silent weakening of every implemented error branch in
  `tools/validate-expert-judgment.mjs`.
- Inspect portable invalid packages and their expected diagnostics under
  `tests/fixtures/`.
- Distinguish failing structural rules from the one intentionally non-failing
  expert-judgment warning through manifest `rescopedRules`.
- Plan QIF adoption against an explicit roadmap for trajectory/outcome
  evidence, protocol-neutral action boundaries, continuous calibration, and
  anticipatory Quality Intent simulation.

## Capability Delta

- Expanded `qif-package` retained negatives from 6 to 68.
- Expanded `expert-judgment` retained negatives from 6 to 96.
- Increased the standing fixture suite from 69 to 221 negative checks while
  preserving 3 positive checks and byte-for-byte corpus drift detection.
- Added `docs/qif-v0.4.3-core-fixture-coverage.md`.
- Updated the current and long-term roadmaps from primary-source 2026 agentic
  AI signals.
- Updated AOF runtime evidence from v9.7.0 to v10.8.0 for this release path.

## Verification

- `npm test`
- Positive checks: 3/3
- Negative fixture checks: 221/221
- AOF v10.8.0 Need Validation benchmark
- AOF v10.8.0 command routing audit
- AOF v10.8.0 organization verification
- AOF v10.8.0 review council with Builder, Visionary, and Guardian resolved to
  concrete actors

## Verifier Boundary

This release proves retained structural regression coverage. It does not prove
semantic quality truth, empirical calibration, production safety, or that the
implemented rule set is complete. Those claims remain subject to expert review,
operational outcomes, independent conformance, and governance.
