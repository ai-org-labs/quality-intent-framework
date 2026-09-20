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

function run(pkg) {
  return pkg.calibrationRuns[0];
}

function trigger(pkg) {
  return pkg.governanceTriggers[0];
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
  }
];

export const spec = {
  suiteId: "world-model-calibration",
  basePackage: "examples/world-model-calibration-package.json",
  validator,
  corpusDir: "tests/fixtures/world-model-calibration",
  filePrefix: "world-model-calibration"
};
