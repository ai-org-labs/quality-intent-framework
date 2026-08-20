# QIF v0.5.2 World Model Calibration

QIF World Model Calibration measures whether AI-generated World Model Gap
Findings agree with expert judgment on unseen cases.

v0.5.1 made conceptual-modeling gaps specific and verifiable. v0.5.2 adds the
next boundary: a finding can be structurally valid but still not calibrated
against real domain judgment.

## Purpose

World Model Calibration answers:

- Which unseen cases were used?
- Which expert findings were expected?
- Which AI findings were generated?
- Which findings matched exactly, partially, were missed, were spurious, or
  remained in disagreement?
- What agreement score was reproduced?
- What false-positive and false-negative rates were reproduced?
- Did the result meet the calibration policy?
- If not, which governance trigger was opened?

The verifier does not decide that experts are correct. It only checks that the
calibration record is reproducible and that threshold failures cannot be hidden.

## Runtime Flow

```text
World Model Review Package
-> Calibration Policy
-> Calibration Case
-> Expert Assessment
-> Agent Assessment
-> Finding Match
-> Calibration Run
-> Governance Trigger
```

The package type is:

```text
world-model-calibration
```

The executable example is:

```text
examples/world-model-calibration-package.json
```

The local verifier is:

```text
tools/validate-world-model-calibration.mjs
```

## Core Entities

### Package Ref

References the World Model Review package being calibrated.

The verifier requires repository-local paths, existing files, and matching
package types.

### Calibration Policy

Defines the minimum conditions for calling World Model Gap Finding behavior
calibrated.

Required policy controls:

- minimum case count;
- required domains;
- required expert assessors per case;
- unseen-case requirement;
- agreement threshold;
- false-positive limit;
- false-negative limit;
- scoring rule;
- governance-on-failure behavior.

### Calibration Case

Defines an unseen target case used for calibration.

Cases are domain-general. The v0.5.2 example covers software, maintenance, and
accounting.

### Expert Assessment

Records the expected expert findings for a case.

Each expected finding must name the missing item, expected definition, verdict
effect, severity, and rationale.

### Agent Assessment

Records the AI-generated findings for the same case.

Generated findings may be empty. Hidden chain-of-thought is rejected as
calibration evidence.

### Finding Match

Compares one expert finding and/or one agent finding.

Allowed match types:

- `exact`: score 1;
- `partial`: score 0.5;
- `missed`: score 0;
- `spurious`: score 0;
- `disagreement`: score 0.

The verifier requires each expected expert finding and each generated agent
finding to be covered by a match.

### Calibration Run

Aggregates cases, assessments, matches, and policy results.

The verifier reproduces:

- `caseCount`;
- `domainCoverage`;
- `agreementScore`;
- `falsePositiveRate`;
- `falseNegativeRate`.

If policy thresholds fail and governance is required, the run must cite
Governance Triggers. A failed threshold cannot be reported as `calibrated`.

### Governance Trigger

Records why calibration is not sufficient for the intended use.

Example triggers:

- low agreement;
- high false-positive rate;
- high false-negative rate;
- insufficient cases;
- missing domain coverage;
- expert disagreement.

## v0.5.2 Example Result

The example run intentionally fails calibration:

```text
agreementScore: 0.50
agreementThreshold: 0.70
falseNegativeRate: 0.33
falseNegativeRateMax: 0.20
conclusion: failed
```

This is valid QIF because the failure is explicit and governance-triggered.

The important behavior is:

```text
QIF can now say:
The AI can produce structurally valid World Model Gap Findings, but its current
agreement with experts is not high enough for autonomous pilot use.
```

## Verifier Boundary

The verifier checks structure, references, match coverage, score
reproducibility, threshold compliance, and governance linkage.

It does not claim:

- semantic truth;
- expert correctness;
- domain correctness;
- production readiness.

Semantic validity still requires larger real-domain pilot corpora, independent
expert panel review, operational feedback, and governance decisions.

## Acceptance Criteria

QIF v0.5.2 is working when `npm test` proves:

1. a valid `world-model-calibration` package passes;
2. invalid packages with broken package refs, missing expected findings, hidden
   reasoning, uncovered findings, unreproducible scores, missing governance, or
   semantic-truth overclaim fail;
3. the Living QIF Ledger can reference calibration runs and calibration
   governance triggers;
4. verifier success still does not claim semantic truth.
