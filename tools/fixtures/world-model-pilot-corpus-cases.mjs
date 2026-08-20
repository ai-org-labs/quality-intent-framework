const validator = "tools/validate-world-model-pilot-corpus.mjs";

function source(pkg, index = 0) {
  return pkg.pilotSources[index];
}

function privacy(pkg, index = 0) {
  return pkg.privacyControls[index];
}

function policy(pkg) {
  return pkg.samplingPolicies[0];
}

function pilotCase(pkg, index = 0) {
  return pkg.pilotCases[index];
}

function step(pkg, index = 0) {
  return pkg.caseNormalizationSteps[index];
}

function panel(pkg) {
  return pkg.expertPanels[0];
}

function rubric(pkg) {
  return pkg.adjudicationRubrics[0];
}

function run(pkg) {
  return pkg.ingestionRuns[0];
}

export const cases = [
  {
    id: "pilotSources-not-array",
    rule: "pilotSources must be an array",
    expect: "pilotSources must be an array.",
    mutate: (pkg) => { pkg.pilotSources = null; }
  },
  {
    id: "source-trust-verified-without-verifier",
    rule: "verified trust requires verifier",
    expect: "SRC-WMP-001 trust verified status requires verifiedBy.",
    mutate: (pkg) => { source(pkg).trust.verifiedBy = []; }
  },
  {
    id: "privacy-broken-source",
    rule: "privacy control source resolves",
    expect: "PRV-WMP-001 references missing pilot source: SRC-NOPE-999",
    mutate: (pkg) => { privacy(pkg).sourceRef = "SRC-NOPE-999"; }
  },
  {
    id: "policy-required-domains-empty",
    rule: "sampling policy requires domains",
    expect: "SAM-WMP-001 must include requiredDomains.",
    mutate: (pkg) => { policy(pkg).requiredDomains = []; }
  },
  {
    id: "case-broken-privacy-control",
    rule: "pilot case privacy control resolves",
    expect: "PC-WMP-001 references missing privacy control: PRV-NOPE-999",
    mutate: (pkg) => { pilotCase(pkg).privacyControlRef = "PRV-NOPE-999"; }
  },
  {
    id: "case-unseen-not-boolean",
    rule: "pilot case unseenCase is boolean",
    expect: "PC-WMP-001 unseenCase must be boolean.",
    mutate: (pkg) => { pilotCase(pkg).unseenCase = "yes"; }
  },
  {
    id: "normalization-source-mismatch",
    rule: "normalization step source matches case source",
    expect: "NORM-WMP-001 sourceRef must match its pilot case sourceRef.",
    mutate: (pkg) => { step(pkg).sourceRef = "SRC-WMP-002"; }
  },
  {
    id: "normalization-sensitive-not-removed",
    rule: "redaction-required cases remove sensitive data",
    expect: "NORM-WMP-001 must remove sensitive data for redaction-required case PC-WMP-001.",
    mutate: (pkg) => { step(pkg).removedSensitiveData = false; }
  },
  {
    id: "panel-quorum-not-independent",
    rule: "expert panel quorum is independent",
    expect: "PAN-WMP-001 quorum must be satisfied by independent panel members.",
    mutate: (pkg) => {
      panel(pkg).panelMembers[0].independent = false;
      panel(pkg).panelMembers[1].independent = false;
    }
  },
  {
    id: "rubric-criteria-empty",
    rule: "adjudication rubric has criteria",
    expect: "RUB-WMP-001 criteria must include at least one criterion.",
    mutate: (pkg) => { rubric(pkg).criteria = []; }
  },
  {
    id: "run-case-count-mismatch",
    rule: "ingestion run caseCount reproduces",
    expect: "ING-WMP-001 caseCount must equal caseRefs length.",
    mutate: (pkg) => { run(pkg).caseCount = 2; }
  },
  {
    id: "run-domain-coverage-mismatch",
    rule: "ingestion run domain coverage reproduces",
    expect: "ING-WMP-001 domainCoverage must equal the domains of caseRefs.",
    mutate: (pkg) => { run(pkg).domainCoverage = ["software"]; }
  },
  {
    id: "run-real-case-ratio-mismatch",
    rule: "real case ratio reproduces",
    expect: "ING-WMP-001 realCaseRatio must reproduce from real pilot cases: expected 1.",
    mutate: (pkg) => { run(pkg).realCaseRatio = 0.5; }
  },
  {
    id: "run-privacy-ready-mismatch",
    rule: "privacyReady reproduces",
    expect: "ING-WMP-001 privacyReady must reproduce from referenced privacy controls: expected false.",
    mutate: (pkg) => {
      privacy(pkg).redactionState = "pending";
      run(pkg).privacyReady = true;
    }
  },
  {
    id: "run-synthetic-not-allowed-ready",
    rule: "synthetic cases cannot pass when policy forbids them",
    expect: "ING-WMP-001 conclusion cannot be ready while ingestion failures exist: synthetic-case-not-allowed.",
    mutate: (pkg) => { pilotCase(pkg).caseKind = "synthetic"; }
  },
  {
    id: "run-threshold-failure-without-governance",
    rule: "ingestion failures require governance",
    expect: "ING-WMP-001 ingestion failures require governanceTriggerRefs",
    mutate: (pkg) => {
      run(pkg).caseRefs = ["PC-WMP-001", "PC-WMP-002"];
      run(pkg).caseCount = 2;
      run(pkg).domainCoverage = ["maintenance", "software"];
      run(pkg).realCaseRatio = 1;
    }
  },
  {
    id: "governance-trigger-broken-run",
    rule: "governance trigger source run resolves",
    expect: "GTR-WMP-001 references missing ingestion run: ING-NOPE-999",
    mutate: (pkg) => {
      pkg.governanceTriggers = [{
        id: "GTR-WMP-001",
        triggerType: "privacy-not-ready",
        reason: "Privacy controls are incomplete.",
        sourceIngestionRunRef: "ING-NOPE-999",
        severity: "high",
        requiredAction: "Complete redaction review.",
        owner: "pilot-owner",
        status: "open"
      }];
    }
  },
  {
    id: "verifier-boundary-claims-semantic-truth",
    rule: "verifier boundary avoids semantic truth",
    expect: "verifierBoundary must explicitly avoid claiming semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["case representativeness"]; }
  }
];

export const spec = {
  suiteId: "world-model-pilot-corpus",
  basePackage: "examples/world-model-pilot-corpus-package.json",
  validator,
  corpusDir: "tests/fixtures/world-model-pilot-corpus",
  filePrefix: "world-model-pilot-corpus"
};
