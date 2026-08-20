# QIF v0.5 Living QIF Ledger

## Purpose

The Living QIF Ledger preserves quality knowledge across package boundaries.
It does not replace discovery-session, review-run, or quality-gate packages.
It records how those packages relate over time.

The ledger answers:

- Which Quality Intent came from which discovery evidence?
- Which review or gate used that intent?
- Which incident or outcome challenged it?
- Which world-model gap produced a candidate intent or governance trigger?
- Which calibration run showed whether AI gap findings agree with experts?
- Did the organization derive a new intent, accept a gap, or route work to governance?
- Which agent trial produced an outcome, and what provenance supports it?

## Boundary

The ledger is a traceability and lifecycle layer.

It verifies:

- package references resolve
- entity references resolve across packages
- lifecycle records cite evidence
- missed-intent records close to a derivation or accepted gap
- agent trials link target, review run, trajectory summary, environment state, tool/action provenance, outcome, and evidence
- index entries resolve to active intents, open governance triggers, and residual-risk carriers

It does not verify:

- semantic truth
- expert correctness
- incident root cause correctness
- whether an agent's hidden reasoning was valid

Semantic validity still requires expert review, operational feedback,
governance decisions, reproduction tests, and later calibration.

## Entity Model

### Package Ref

Purpose: identify another QIF package file that the ledger may reference.

Required fields:

- `id`
- `path`
- `packageType`
- `role`

Verifier behavior:

- path must be repository-local
- path must exist
- referenced package must have the declared `packageType`

### Cross Package Ref

Purpose: record an explicit relationship between two entities in possibly
different packages.

Required fields:

- `id`
- `from`
- `to`
- `purpose`
- `provenance`

Verifier behavior:

- both ends must resolve
- self-references are rejected

### Quality Intent Lifecycle Record

Purpose: track a Quality Intent over time.

Allowed states:

- `candidate`
- `validated`
- `active`
- `superseded`
- `retired`

Required fields:

- `id`
- `intent`
- `state`
- `rationale`
- `evidenceRefs`
- `owner`
- `status`

Verifier behavior:

- referenced intent must resolve
- evidence refs must resolve
- previous lifecycle record must resolve when present

### Missed Intent Record

Purpose: record an incident or outcome that suggests the active quality
knowledge was incomplete.

Required fields:

- `id`
- `sourceIncident`
- `matchedActiveIntentRefs`
- `outcome`
- `owner`
- `status`

Verifier behavior:

- source incident must resolve
- matched intents must have active lifecycle records
- `derive-new-intent` requires `newQualityIntentDerivation`
- `accepted-gap` requires `acceptedGapRationale`

### Agent Trial

Purpose: preserve an agent or hybrid evaluation trial without relying only on
the final answer.

Required fields:

- `id`
- `target`
- `reviewRun`
- `trajectorySummary`
- `environmentState`
- `toolActionProvenance`
- `outcomeRef`
- `evaluatorUncertainty`
- `transcriptHandling`

Verifier behavior:

- target and review run must resolve
- outcome must resolve
- tool/action provenance must be present
- hidden chain-of-thought must not be stored as ledger evidence

### Agent Outcome

Purpose: connect a trial to the actual observed result.

Required fields:

- `id`
- `trialRef`
- `actualOutcome`
- `outcomeEvidenceRefs`
- `status`

Verifier behavior:

- trial must resolve
- outcome evidence refs must resolve

### Ledger Index

Purpose: provide a queryable summary of current quality knowledge state.

Required fields:

- `activeQualityIntentRefs`
- `openGovernanceTriggerRefs`
- `openResidualRiskRefs`
- `lastUpdated`
- `summary`

Verifier behavior:

- all refs must resolve
- open governance trigger refs must reference triggers whose status is `open`

## v0.5.0 Minimal Runtime

v0.5.0 adds:

- `schemas/qif-ledger-package.schema.json`
- `examples/qif-ledger-package.json`
- `tools/validate-qif-ledger.mjs`
- `tools/fixtures/qif-ledger-cases.mjs`
- `tests/fixtures/qif-ledger/`

The example ledger links:

- discovery-session derived Quality Intent records
- world-model-review gap findings and candidate Quality Intents
- world-model-calibration runs and calibration governance triggers
- review-run governance escalation
- quality-gate post-release incident feedback
- a minimal agent trial and outcome record

This is the first executable cross-package layer. It is intentionally narrow:
it proves traceability mechanics before adding broader query tooling,
calibration, or package registries.

## v0.5.1 World Model Review Link

v0.5.1 extends the ledger example and verifier entity index so a ledger can
reference `world-model-review` packages.

The example preserves:

- a `worldModelGapFinding` that names the exact missing conceptual part;
- the `modelEvidence` supporting that finding;
- the candidate `qualityIntent` derived from the gap;
- the open `governanceTrigger` caused by the blocking gap.

This keeps the ledger boundary unchanged. The ledger verifies that references
resolve and lifecycle evidence exists. It does not decide whether the world
model itself is semantically correct.

## v0.5.2 World Model Calibration Link

v0.5.2 extends the ledger example and verifier entity index so a ledger can
reference `world-model-calibration` packages.

The example preserves:

- the calibration run that compares expert and AI World Model Gap Findings;
- agreement, false-positive, and false-negative residual risk through the run;
- open governance triggers caused by threshold failure.

This keeps calibration evidence connected to the living quality memory without
letting the ledger claim semantic truth.
