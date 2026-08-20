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
