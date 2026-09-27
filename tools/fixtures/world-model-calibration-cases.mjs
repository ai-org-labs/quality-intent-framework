// Retained negative coverage for the world-model-calibration verifier.
//
// These cases protect the semantic calibration boundary: QIF may calculate
// agreement between expert and AI world-model gap findings, but must not treat
// structural verifier success as domain truth.

const validator = "tools/validate-world-model-calibration.mjs";

function packageRef(pkg) {
  return pkg.packageRefs[0];
}

function policy(pkg) {
  return pkg.calibrationPolicies[0];
}

function calibrationCase(pkg) {
  return pkg.calibrationCases[0];
}

function expertAssessment(pkg) {
  return pkg.expertAssessments[0];
}

function agentAssessment(pkg) {
  return pkg.agentAssessments[0];
}

function match(pkg, index = 0) {
  return pkg.findingMatches[index];
}

function suiteHealth(pkg) {
  return pkg.evaluationSuiteHealthRecords[0];
}

function trialVariance(pkg) {
  return pkg.trialVarianceRecords[0];
}

function frameworkLearning(pkg) {
  return pkg.frameworkLearningRecords[0];
}

function run(pkg) {
  return pkg.calibrationRuns[0];
}

function trigger(pkg) {
  return pkg.governanceTriggers[0];
}

function makeImplementedLearning(pkg) {
  pkg.evidenceOrigins[0].originKind = "historical-record";
  pkg.evidenceOrigins[0].status = "verified";
  const learning = frameworkLearning(pkg);
  learning.contradictedAssumption.status = "contradicted";
  learning.governanceDecision.decision = "accepted";
  learning.implementation.status = "implemented";
  learning.implementation.artifactRefs = ["docs/revised-guidance.md"];
  learning.implementation.validationEvidenceRefs = ["pilot/revalidation.json"];
  learning.overallStatus = "implemented";
  const governance = pkg.governanceTriggers.find((item) => item.id === learning.governanceTriggerRefs[0]);
  governance.status = "resolved";
}

export const cases = [
  {
    id: "packageRefs-not-array",
    rule: "packageRefs must be an array",
    expect: "packageRefs must be an array.",
    mutate: (pkg) => { pkg.packageRefs = null; }
  },
  {
    id: "package-ref-path-missing",
    rule: "package ref path exists",
    expect: "PKG-WORLD package path does not exist",
    mutate: (pkg) => { packageRef(pkg).path = "examples/missing-world-model-review.json"; }
  },
  {
    id: "package-ref-wrong-type",
    rule: "package ref type matches referenced package",
    expect: "PKG-WORLD expected packageType qif-ledger but found world-model-review.",
    mutate: (pkg) => { packageRef(pkg).packageType = "qif-ledger"; }
  },
  {
    id: "policy-missing-target-package",
    rule: "policy target package refs are required",
    expect: "CALPOL-WMC-001 must include at least one target package.",
    mutate: (pkg) => { policy(pkg).targetPackageRefs = []; }
  },
  {
    id: "case-source-world-model-broken",
    rule: "calibration case source world model ref resolves",
    expect: "CALCASE-WMC-001/sourceWorldModelRef references missing entity",
    mutate: (pkg) => { calibrationCase(pkg).sourceWorldModelRef.entityRef = "WMD-NOPE-999"; }
  },
  {
    id: "case-evidence-origin-broken",
    rule: "calibration cases resolve evidence origin",
    expect: "CALCASE-WMC-001 references missing evidence origin: EOR-NOPE-999",
    mutate: (pkg) => { calibrationCase(pkg).evidenceOriginRef = "EOR-NOPE-999"; }
  },
  {
    id: "empirical-origin-not-verified",
    rule: "empirical evidence origin is verified",
    expect: "EOR-WMC-001 empirical evidence origin must have status verified.",
    mutate: (pkg) => {
      pkg.evidenceOrigins[0].originKind = "historical-record";
      pkg.evidenceOrigins[0].status = "draft";
    }
  },
  {
    id: "expert-expected-findings-empty",
    rule: "expert assessments include expected findings",
    expect: "EXA-WMC-001 must include expectedFindings.",
    mutate: (pkg) => { expertAssessment(pkg).expectedFindings = []; }
  },
  {
    id: "expert-finding-duplicate-id",
    rule: "expert finding ids are unique inside assessment",
    expect: "Duplicate id EXF-WMC-001 in EXA-WMC-001/expectedFindings:findings.",
    mutate: (pkg) => { expertAssessment(pkg).expectedFindings.push(structuredClone(expertAssessment(pkg).expectedFindings[0])); }
  },
  {
    id: "agent-hidden-reasoning",
    rule: "agent assessment must not store hidden reasoning",
    expect: "AGA-WMC-001 must not store hidden chain-of-thought as calibration evidence.",
    mutate: (pkg) => { agentAssessment(pkg).transcriptHandling = "hidden-chain-of-thought"; }
  },
  {
    id: "match-missing-expert-finding",
    rule: "finding match expert finding resolves",
    expect: "FMA-WMC-001 references missing expert finding: EXF-NOPE-999",
    mutate: (pkg) => { match(pkg).expertFindingRef = "EXF-NOPE-999"; }
  },
  {
    id: "match-exact-score-wrong",
    rule: "match score reproduces from match type",
    expect: "FMA-WMC-001 score must be 1 for matchType exact.",
    mutate: (pkg) => { match(pkg).score = 0.5; }
  },
  {
    id: "match-missed-with-agent-finding",
    rule: "missed match must not include agent finding",
    expect: "FMA-WMC-003 missed match must not include agentFindingRef.",
    mutate: (pkg) => { match(pkg, 2).agentFindingRef = "AGF-WMC-001"; }
  },
  {
    id: "agent-generated-finding-uncovered",
    rule: "generated findings must be compared",
    expect: "AGA-WMC-001 generated finding AGF-WMC-001 is not covered by any findingMatch.",
    mutate: (pkg) => { match(pkg).agentFindingRef = "AGF-NOPE-999"; }
  },
  {
    id: "run-case-count-mismatch",
    rule: "run caseCount reproduces from cases",
    expect: "CALRUN-WMC-001 caseCount must equal caseRefs length.",
    mutate: (pkg) => { run(pkg).caseCount = 2; }
  },
  {
    id: "policy-minimum-trial-count-invalid",
    rule: "minimum trial count requires repeated trials",
    expect: "CALPOL-WMC-001 minimumTrialCount must be an integer of at least 2.",
    mutate: (pkg) => { policy(pkg).minimumTrialCount = 1; }
  },
  {
    id: "suite-health-broken-run-ref",
    rule: "suite health calibration run resolves",
    expect: "ESH-WMC-001 references missing calibration run: CALRUN-NOPE-999",
    mutate: (pkg) => { suiteHealth(pkg).calibrationRunRef = "CALRUN-NOPE-999"; }
  },
  {
    id: "suite-health-case-coverage-mismatch",
    rule: "suite health solvability review covers every case",
    expect: "ESH-WMC-001 solvability reviewedCaseRefs must equal caseRefs.",
    mutate: (pkg) => { suiteHealth(pkg).solvability.reviewedCaseRefs = ["CALCASE-WMC-001"]; }
  },
  {
    id: "suite-health-false-healthy-dimension",
    rule: "healthy suite requires healthy dimensions",
    expect: "ESH-WMC-001 overallStatus healthy conflicts with unhealthy dimensions",
    mutate: (pkg) => { suiteHealth(pkg).overallStatus = "healthy"; }
  },
  {
    id: "suite-health-example-origin-not-empirical",
    rule: "healthy suite requires empirical origins",
    expect: "ESH-WMC-001 overallStatus healthy requires verified observed-operational or historical-record origins.",
    mutate: (pkg) => {
      const health = suiteHealth(pkg);
      health.overallStatus = "healthy";
      health.taskOrigin.status = "verified";
      health.contamination.status = "clear";
      health.solvability.status = "verified";
      health.saturation.status = "not-saturated";
      health.graders.status = "calibrated";
      health.governanceTriggerRefs = [];
    }
  },
  {
    id: "suite-health-provisional-without-governance",
    rule: "non-healthy suite routes to governance",
    expect: "ESH-WMC-001 non-healthy suite status requires governanceTriggerRefs.",
    mutate: (pkg) => { suiteHealth(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "run-broken-suite-health-ref",
    rule: "calibration run suite health refs resolve",
    expect: "CALRUN-WMC-001 references missing evaluation suite health record: ESH-NOPE-999",
    mutate: (pkg) => { run(pkg).suiteHealthRecordRefs = ["ESH-NOPE-999"]; }
  },
  {
    id: "trial-variance-broken-run-ref",
    rule: "trial variance calibration run resolves",
    expect: "TVR-WMC-001 references missing calibration run: CALRUN-NOPE-999",
    mutate: (pkg) => { trialVariance(pkg).calibrationRunRef = "CALRUN-NOPE-999"; }
  },
  {
    id: "trial-variance-unsupported-metric",
    rule: "trial variance metric is supported",
    expect: "TVR-WMC-001 metric is not supported.",
    mutate: (pkg) => { trialVariance(pkg).metric = "quality"; }
  },
  {
    id: "trial-variance-needs-repeated-measurements",
    rule: "trial variance requires repeated measurements",
    expect: "TVR-WMC-001 must include at least two trialMeasurements.",
    mutate: (pkg) => {
      const variance = trialVariance(pkg);
      variance.trialMeasurements = [variance.trialMeasurements[0]];
      variance.summary.includedTrialRefs = ["TVM-WMC-001"];
      variance.summary.trialCount = 1;
      variance.summary.mean = 0.5;
      variance.summary.minimum = 0.5;
      variance.summary.maximum = 0.5;
      variance.summary.observedRange = 0;
      variance.uncertaintyRange.lower = 0.5;
      variance.uncertaintyRange.upper = 0.5;
    }
  },
  {
    id: "trial-variance-included-refs-mismatch",
    rule: "summary refs equal included measurements",
    expect: "TVR-WMC-001 summary includedTrialRefs must equal included trialMeasurements.",
    mutate: (pkg) => { trialVariance(pkg).summary.includedTrialRefs = ["TVM-WMC-001", "TVM-WMC-002"]; }
  },
  {
    id: "trial-variance-mean-mismatch",
    rule: "trial mean reproduces from included measurements",
    expect: "TVR-WMC-001 summary mean must reproduce from included trials: expected 0.5.",
    mutate: (pkg) => { trialVariance(pkg).summary.mean = 0.6; }
  },
  {
    id: "trial-variance-summary-count-mismatch",
    rule: "trial count reproduces from included measurements",
    expect: "TVR-WMC-001 summary trialCount must reproduce from included trials: expected 3.",
    mutate: (pkg) => { trialVariance(pkg).summary.trialCount = 2; }
  },
  {
    id: "trial-variance-range-mismatch",
    rule: "uncertainty range reproduces from included measurements",
    expect: "TVR-WMC-001 uncertaintyRange must equal the minimum and maximum included trial values.",
    mutate: (pkg) => { trialVariance(pkg).uncertaintyRange.upper = 0.9; }
  },
  {
    id: "trial-variance-broken-infrastructure-profile",
    rule: "trial measurements resolve infrastructure profiles",
    expect: "TVM-WMC-001 references missing infrastructure profile: INP-NOPE-999",
    mutate: (pkg) => { trialVariance(pkg).trialMeasurements[0].infrastructureProfileRef = "INP-NOPE-999"; }
  },
  {
    id: "trial-variance-profile-refs-mismatch",
    rule: "infrastructure assessment covers every profile",
    expect: "TVR-WMC-001 infrastructureAssessment profileRefs must equal infrastructureProfiles.",
    mutate: (pkg) => {
      trialVariance(pkg).infrastructureProfiles.push({
        id: "INP-WMC-002",
        environment: "second profile",
        runtime: "second runtime",
        resourceEnvelope: "second envelope",
        timeLimit: "second limit",
        concurrency: "second concurrency",
        incidentRefs: [],
        status: "stable"
      });
    }
  },
  {
    id: "trial-variance-unsupported-profile-status",
    rule: "infrastructure profile status is supported",
    expect: "INP-WMC-001 status is not supported.",
    mutate: (pkg) => { trialVariance(pkg).infrastructureProfiles[0].status = "perfect"; }
  },
  {
    id: "trial-variance-unsupported-assessment-status",
    rule: "infrastructure assessment status is supported",
    expect: "TVR-WMC-001 infrastructureAssessment status is not supported.",
    mutate: (pkg) => { trialVariance(pkg).infrastructureAssessment.status = "exact"; }
  },
  {
    id: "trial-variance-exact-comparison-forbidden",
    rule: "uncertainty does not allow exact comparison",
    expect: "TVR-WMC-001 comparisonBoundary exactComparisonAllowed must be false.",
    mutate: (pkg) => { trialVariance(pkg).comparisonBoundary.exactComparisonAllowed = true; }
  },
  {
    id: "trial-variance-provisional-without-governance",
    rule: "non-sufficient uncertainty routes to governance",
    expect: "TVR-WMC-001 non-sufficient uncertainty status requires governanceTriggerRefs.",
    mutate: (pkg) => { trialVariance(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "trial-variance-sufficient-requires-empirical-origin",
    rule: "sufficient uncertainty requires empirical origin",
    expect: "TVR-WMC-001 overallStatus sufficient requires verified observed-operational or historical-record origins.",
    mutate: (pkg) => {
      const variance = trialVariance(pkg);
      variance.overallStatus = "sufficient";
      variance.infrastructureAssessment.status = "controlled";
      variance.infrastructureAssessment.potentialConfounders = [];
      variance.governanceTriggerRefs = [];
    }
  },
  {
    id: "trial-variance-sufficient-requires-bounded-infrastructure",
    rule: "sufficient uncertainty requires bounded infrastructure",
    expect: "TVR-WMC-001 overallStatus sufficient requires controlled or bounded infrastructure without unresolved confounders.",
    mutate: (pkg) => {
      pkg.evidenceOrigins[0].originKind = "historical-record";
      const variance = trialVariance(pkg);
      variance.overallStatus = "sufficient";
      variance.governanceTriggerRefs = [];
    }
  },
  {
    id: "trial-variance-sufficient-requires-stable-profile",
    rule: "sufficient uncertainty requires stable infrastructure profiles",
    expect: "TVR-WMC-001 overallStatus sufficient requires stable infrastructure profiles.",
    mutate: (pkg) => {
      pkg.evidenceOrigins[0].originKind = "historical-record";
      const variance = trialVariance(pkg);
      variance.overallStatus = "sufficient";
      variance.infrastructureAssessment.status = "controlled";
      variance.infrastructureAssessment.potentialConfounders = [];
      variance.infrastructureProfiles[0].status = "degraded";
      variance.governanceTriggerRefs = [];
    }
  },
  {
    id: "trial-variance-sufficient-rejects-open-governance",
    rule: "sufficient uncertainty rejects unresolved governance",
    expect: "TVR-WMC-001 overallStatus sufficient cannot retain unresolved governance triggers.",
    mutate: (pkg) => {
      pkg.evidenceOrigins[0].originKind = "historical-record";
      const variance = trialVariance(pkg);
      variance.overallStatus = "sufficient";
      variance.infrastructureAssessment.status = "controlled";
      variance.infrastructureAssessment.potentialConfounders = [];
    }
  },
  {
    id: "run-broken-trial-variance-ref",
    rule: "calibration run trial variance refs resolve",
    expect: "CALRUN-WMC-001 references missing trial variance record: TVR-NOPE-999",
    mutate: (pkg) => { run(pkg).trialVarianceRecordRefs = ["TVR-NOPE-999"]; }
  },
  {
    id: "framework-learning-broken-run-ref",
    rule: "framework learning calibration runs resolve",
    expect: "FLR-WMC-001 references missing calibration run: CALRUN-NOPE-999",
    mutate: (pkg) => { frameworkLearning(pkg).calibrationRunRefs = ["CALRUN-NOPE-999"]; }
  },
  {
    id: "framework-learning-broken-evidence-origin-ref",
    rule: "framework learning evidence origins resolve",
    expect: "FLR-WMC-001 references missing evidence origin: EOR-NOPE-999",
    mutate: (pkg) => { frameworkLearning(pkg).evidenceOriginRefs = ["EOR-NOPE-999"]; }
  },
  {
    id: "framework-learning-broken-contradiction-evidence-ref",
    rule: "contradiction evidence resolves",
    expect: "FLR-WMC-001/contradictedAssumption references missing contradiction evidence: FMA-NOPE-999",
    mutate: (pkg) => { frameworkLearning(pkg).contradictedAssumption.contradictionEvidenceRefs = ["FMA-NOPE-999"]; }
  },
  {
    id: "framework-learning-run-missing-backlink",
    rule: "calibration runs link framework learning records bidirectionally",
    expect: "FLR-WMC-001 calibration run CALRUN-WMC-001 must link back through frameworkLearningRecordRefs.",
    mutate: (pkg) => { run(pkg).frameworkLearningRecordRefs = ["FLR-NOPE-999"]; }
  },
  {
    id: "framework-learning-proposed-requires-governance",
    rule: "proposed learning routes to governance",
    expect: "FLR-WMC-001 proposed learning requires governanceTriggerRefs.",
    mutate: (pkg) => { frameworkLearning(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "framework-learning-implemented-requires-empirical-origin",
    rule: "implemented learning requires empirical provenance",
    expect: "FLR-WMC-001 implemented learning requires verified observed-operational or historical-record origins.",
    mutate: (pkg) => {
      makeImplementedLearning(pkg);
      pkg.evidenceOrigins[0].originKind = "example";
    }
  },
  {
    id: "framework-learning-implemented-requires-contradiction",
    rule: "implemented learning requires contradicted assumption",
    expect: "FLR-WMC-001 implemented learning requires a contradicted assumption.",
    mutate: (pkg) => {
      makeImplementedLearning(pkg);
      frameworkLearning(pkg).contradictedAssumption.status = "contested";
    }
  },
  {
    id: "framework-learning-implemented-requires-accepted-governance",
    rule: "implemented learning requires accepted governance",
    expect: "FLR-WMC-001 implemented learning requires an accepted governance decision.",
    mutate: (pkg) => {
      makeImplementedLearning(pkg);
      frameworkLearning(pkg).governanceDecision.decision = "deferred";
    }
  },
  {
    id: "framework-learning-implemented-requires-artifact",
    rule: "implemented learning cites changed artifacts",
    expect: "FLR-WMC-001 implemented learning requires artifactRefs.",
    mutate: (pkg) => {
      makeImplementedLearning(pkg);
      frameworkLearning(pkg).implementation.artifactRefs = [];
    }
  },
  {
    id: "framework-learning-implemented-requires-validation",
    rule: "implemented learning cites validation evidence",
    expect: "FLR-WMC-001 implemented learning requires validationEvidenceRefs.",
    mutate: (pkg) => {
      makeImplementedLearning(pkg);
      frameworkLearning(pkg).implementation.validationEvidenceRefs = [];
    }
  },
  {
    id: "framework-learning-implemented-rejects-open-governance",
    rule: "implemented learning has no unresolved trigger",
    expect: "FLR-WMC-001 implemented learning cannot retain unresolved governance triggers.",
    mutate: (pkg) => {
      makeImplementedLearning(pkg);
      pkg.governanceTriggers.find((item) => item.id === "GTR-WMC-005").status = "open";
    }
  },
  {
    id: "framework-learning-rolled-back-requires-evidence",
    rule: "rolled-back learning cites rollback evidence",
    expect: "FLR-WMC-001 rolled-back learning requires rollbackEvidenceRefs.",
    mutate: (pkg) => {
      const learning = frameworkLearning(pkg);
      learning.overallStatus = "rolled-back";
      learning.governanceDecision.decision = "rolled-back";
      learning.implementation.status = "rolled-back";
      learning.implementation.rollbackEvidenceRefs = [];
    }
  },
  {
    id: "calibrated-run-requires-sufficient-variance",
    rule: "calibrated run requires sufficient trial variance",
    expect: "CALRUN-WMC-001 conclusion calibrated requires a sufficient trial variance record.",
    mutate: (pkg) => {
      policy(pkg).agreementThreshold = 0.5;
      policy(pkg).falseNegativeRateMax = 0.33;
      pkg.evidenceOrigins[0].originKind = "historical-record";
      const health = suiteHealth(pkg);
      health.taskOrigin.status = "verified";
      health.contamination.status = "clear";
      health.solvability.status = "verified";
      health.saturation.status = "not-saturated";
      health.graders.status = "calibrated";
      health.overallStatus = "healthy";
      health.governanceTriggerRefs = [];
      run(pkg).conclusion = "calibrated";
    }
  },
  {
    id: "calibrated-run-requires-healthy-suite",
    rule: "calibrated run requires healthy suite",
    expect: "CALRUN-WMC-001 conclusion calibrated requires a healthy evaluation suite health record.",
    mutate: (pkg) => {
      policy(pkg).agreementThreshold = 0.5;
      policy(pkg).falseNegativeRateMax = 0.33;
      run(pkg).conclusion = "calibrated";
    }
  },
  {
    id: "run-domain-coverage-mismatch",
    rule: "run domainCoverage equals case domains",
    expect: "CALRUN-WMC-001 domainCoverage must equal the domains of caseRefs.",
    mutate: (pkg) => { run(pkg).domainCoverage = ["software"]; }
  },
  {
    id: "run-agreement-score-mismatch",
    rule: "agreement score is reproducible",
    expect: "CALRUN-WMC-001 agreementScore must reproduce from findingMatch scores: expected 0.5.",
    mutate: (pkg) => { run(pkg).agreementScore = 0.7; }
  },
  {
    id: "run-false-positive-rate-mismatch",
    rule: "false positive rate is reproducible",
    expect: "CALRUN-WMC-001 falsePositiveRate must reproduce from spurious findingMatches: expected 0.",
    mutate: (pkg) => { run(pkg).falsePositiveRate = 0.2; }
  },
  {
    id: "run-false-negative-rate-mismatch",
    rule: "false negative rate is reproducible",
    expect: "CALRUN-WMC-001 falseNegativeRate must reproduce from missed findingMatches: expected 0.33.",
    mutate: (pkg) => { run(pkg).falseNegativeRate = 0; }
  },
  {
    id: "run-threshold-failure-without-governance",
    rule: "threshold failures require governance",
    expect: "CALRUN-WMC-001 calibration failures require governanceTriggerRefs",
    mutate: (pkg) => { run(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "run-calibrated-despite-failure",
    rule: "failed threshold cannot be called calibrated",
    expect: "CALRUN-WMC-001 conclusion cannot be calibrated while calibration failures exist",
    mutate: (pkg) => { run(pkg).conclusion = "calibrated"; }
  },
  {
    id: "governance-trigger-broken-run",
    rule: "governance trigger source calibration run resolves",
    expect: "GTR-WMC-001 references missing calibration run: CALRUN-NOPE-999",
    mutate: (pkg) => { trigger(pkg).sourceCalibrationRunRef = "CALRUN-NOPE-999"; }
  },
  {
    id: "verifier-boundary-claims-semantic-truth",
    rule: "calibration verifier boundary avoids semantic truth",
    expect: "verifierBoundary must explicitly avoid claiming semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["expert correctness"]; }
  },
  {
    id: "verifier-boundary-treats-change-count-as-learning",
    rule: "calibration verifier boundary rejects change count as learning",
    expect: "verifierBoundary must explicitly avoid claiming change count as learning.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["semantic truth"]; }
  }
];

export const spec = {
  suiteId: "world-model-calibration",
  basePackage: "examples/world-model-calibration-package.json",
  validator,
  corpusDir: "tests/fixtures/world-model-calibration",
  filePrefix: "world-model-calibration"
};
