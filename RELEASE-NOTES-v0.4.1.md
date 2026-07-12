# QIF v0.4.1

QIF v0.4.1 is a runtime hardening release.

It expands retained negative fixture coverage beyond the `quality-gate` verifier and records a concrete v0.4.x release roadmap.

## Highlights

- Generalized `tools/run-fixture-tests.mjs` to support multiple retained fixture corpora.
- Added selected `qif-package` negative fixtures.
- Added selected `expert-judgment` negative fixtures.
- Preserved the existing `quality-gate` negative fixture corpus and drift check.
- Updated `npm run build-fixtures` to regenerate all retained fixture corpora.
- Added `docs/qif-v0.4.x-release-roadmap.md`.
- Updated README, changelog, roadmap, and AOF runtime evidence.
- Refreshed AOF runtime metadata using AOF `v7.0.0`.

## Verification

- `npm test`
- Positive checks: 3/3
- Negative fixture checks: 58/58
- AOF organization verification: 201/201
- AOF review provenance audit: passed for `TASK-013`
- Public-readiness scan: no personal account, email, or local path residue

## Verifier Boundary

This release strengthens structural regression resistance.

Verifier success still does not prove semantic quality truth. Semantic validity requires expert review, operational feedback, reproduction tests, and governance.
