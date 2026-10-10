# QIF v0.6.44

## Cross-Judge Correlation Calibration

This release prevents a panel majority from being mistaken for independent
confirmation when judges share material sources of error.

- `JudgeDependencyPolicy` declares reviewed dependency dimensions and
  materiality.
- `JudgeDependencyProfile` links each human, model, or hybrid judgment to
  provider, model family, prompt, rubric, retrieval, harness, lineage,
  organization, and reporting-line evidence.
- `CrossJudgePanelAssessment` reproduces verdict groups, consensus, dissent,
  abstention, shared dependencies, independence status, and correlation risk.
- `CrossJudgeCorrelationAssessment` reproduces panel-level evidence
  sufficiency and governance routing.
- The portable AI package is rebuilt for v0.6.44 and published with its
  checksum.

The verifier proves declared structure and deterministic calculations only.
Majority, unanimity, confidence, adjudication, and panel counts do not prove
independent confirmation, semantic truth, quality, competence, selection,
authorization, or authority.
