const validator = "tools/validate-calibration-report.mjs";

function policy(pkg) { return pkg.calibrationPolicies[0]; }
function pair(pkg) { return pkg.decisionOutcomePairs[0]; }
function report(pkg) { return pkg.calibrationReports[0]; }

export const cases = [
  {
    id: "wrong-package-type",
    rule: "package type",
    expect: "must have packageType calibration-report.",
    mutate: (pkg) => { pkg.packageType = "quality-gate"; }
  },
  {
    id: "package-path-traversal",
    rule: "repository-local package path",
    expect: "path must be repository-relative without parent traversal.",
    mutate: (pkg) => { pkg.packageRefs[0].path = "../quality-gate-package.json"; }
  },
  {
    id: "wrong-package-role",
    rule: "package role",
    expect: "role must be decision-outcome-source.",
    mutate: (pkg) => { pkg.packageRefs[0].role = "decorative-input"; }
  },
  {
    id: "unsupported-origin-kind",
    rule: "evidence origin kind",
    expect: "originKind is not supported.",
    mutate: (pkg) => { pkg.evidenceOrigins[0].originKind = "rumor"; }
  },
  {
    id: "empirical-origin-unverified",
    rule: "empirical origin verification",
    expect: "empirical evidence origin must have status verified.",
    mutate: (pkg) => { pkg.evidenceOrigins[0].originKind = "observed-operational"; pkg.evidenceOrigins[0].status = "draft"; }
  },
  {
    id: "policy-bucket-gap",
    rule: "bucket coverage",
    expect: "buckets must be contiguous without gaps or overlap.",
    mutate: (pkg) => { policy(pkg).bucketDefinitions[1].lowerInclusive = 0.55; }
  },
  {
    id: "source-confidence-mismatch",
    rule: "source confidence reproduction",
    expect: "sourceConfidence must equal the referenced gate decision confidence.",
    mutate: (pkg) => { pair(pkg).sourceConfidence = 0.6; pair(pkg).forecastProbability = 0.6; }
  },
  {
    id: "identity-transform-mismatch",
    rule: "identity transformation reproduction",
    expect: "identity transformation must preserve sourceConfidence as forecastProbability.",
    mutate: (pkg) => { pair(pkg).forecastProbability = 0.6; }
  },
  {
    id: "transformation-reviewer-missing",
    rule: "confidence transformation review",
    expect: "confidenceTransformation must include reviewedBy.",
    mutate: (pkg) => { pair(pkg).confidenceTransformation.reviewedBy = []; }
  },
  {
    id: "confidence-meaning-mismatch",
    rule: "prediction meaning alignment",
    expect: "confidenceMeaning must match a calibration policy predictionMeaning.",
    mutate: (pkg) => { pair(pkg).confidenceMeaning = "Confidence that documentation looks complete."; }
  },
  {
    id: "outcome-value-mismatch",
    rule: "outcome binary mapping",
    expect: "protected-outcome-failed requires outcomeValue 0.",
    mutate: (pkg) => { pair(pkg).outcomeValue = 1; }
  },
  {
    id: "missing-gate-decision",
    rule: "gate decision reference",
    expect: "references missing gate decision",
    mutate: (pkg) => { pair(pkg).gateDecisionRef = "QGD-NOPE-999"; }
  },
  {
    id: "source-origin-mismatch",
    rule: "source outcome provenance",
    expect: "sourceEvidenceOriginRef must equal the referenced outcome review evidenceOriginRef.",
    mutate: (pkg) => { pair(pkg).sourceEvidenceOriginRef = "EOR-NOPE-999"; }
  },
  {
    id: "outcome-rationale-missing",
    rule: "outcome interpretation rationale",
    expect: "must include non-empty string outcomeRationale.",
    mutate: (pkg) => { delete pair(pkg).outcomeRationale; }
  },
  {
    id: "observation-window-mismatch",
    rule: "outcome window reproduction",
    expect: "observationWindow must equal the referenced outcome review window.",
    mutate: (pkg) => { pair(pkg).observationWindow = "30-day"; }
  },
  {
    id: "excluded-pair-rationale-missing",
    rule: "excluded pair rationale",
    expect: "excluded pair must include exclusionRationale.",
    mutate: (pkg) => { pair(pkg).included = false; report(pkg).includedPairRefs = []; report(pkg).excludedPairRefs = [pair(pkg).id]; }
  },
  {
    id: "evidence-origin-set-mismatch",
    rule: "report evidence origin closure",
    expect: "evidenceOriginRefs must exactly match included pair evidence origins.",
    mutate: (pkg) => { report(pkg).evidenceOriginRefs = ["EOR-NOPE-999"]; }
  },
  {
    id: "brier-score-mismatch",
    rule: "Brier score reproduction",
    expect: "brierScore must reproduce as 0.49.",
    mutate: (pkg) => { report(pkg).brierScore = 0.1; }
  },
  {
    id: "bucket-membership-mismatch",
    rule: "calibration bucket membership",
    expect: "pairRefs do not match policy bucket membership.",
    mutate: (pkg) => { report(pkg).buckets[0].pairRefs = ["DOP-NOPE-999"]; }
  },
  {
    id: "bucket-mean-mismatch",
    rule: "bucket mean reproduction",
    expect: "meanForecastProbability must reproduce as 0.7.",
    mutate: (pkg) => { report(pkg).buckets[0].meanForecastProbability = 0.6; }
  },
  {
    id: "sample-count-mismatch",
    rule: "sample count reproduction",
    expect: "uncertaintyBoundary.pairCount must reproduce as 1.",
    mutate: (pkg) => { report(pkg).uncertaintyBoundary.pairCount = 2; }
  },
  {
    id: "sufficiency-mismatch",
    rule: "data sufficiency reproduction",
    expect: "dataSufficiency must reproduce as insufficient.",
    mutate: (pkg) => { report(pkg).uncertaintyBoundary.dataSufficiency = "sufficient"; }
  },
  {
    id: "signal-mismatch",
    rule: "calibration signal reproduction",
    expect: "calibrationSignal must reproduce as insufficient-data.",
    mutate: (pkg) => { report(pkg).calibrationSignal = "within-policy-tolerance"; }
  },
  {
    id: "insufficient-trigger-missing",
    rule: "insufficient data governance",
    expect: "insufficient data requires an insufficient-data governance trigger.",
    mutate: (pkg) => { report(pkg).governanceTriggerRefs = ["GTR-CR-002"]; }
  },
  {
    id: "non-empirical-trigger-missing",
    rule: "non-empirical governance",
    expect: "empirical evidence shortfall requires a non-empirical-evidence governance trigger.",
    mutate: (pkg) => { report(pkg).governanceTriggerRefs = ["GTR-CR-001"]; }
  },
  {
    id: "interpretation-overclaim",
    rule: "evidence-only interpretation",
    expect: "interpretation must be evidence-only-not-quality-verdict.",
    mutate: (pkg) => { report(pkg).interpretation = "quality-approved"; }
  },
  {
    id: "resolved-trigger-event-missing",
    rule: "governance event traceability",
    expect: "resolved trigger must include resultingGovernanceEventRef.",
    mutate: (pkg) => { pkg.governanceTriggers[0].status = "resolved"; }
  },
  {
    id: "verifier-boundary-overclaim",
    rule: "verifier semantic boundary",
    expect: "verifierBoundary must explicitly avoid claiming a calibration statistic is quality.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "a calibration statistic is quality"); }
  }
];

export const spec = {
  suiteId: "calibration-report",
  filePrefix: "calibration-report",
  basePackage: "examples/calibration-report-package.json",
  validator,
  corpusDir: "tests/fixtures/calibration-report"
};
