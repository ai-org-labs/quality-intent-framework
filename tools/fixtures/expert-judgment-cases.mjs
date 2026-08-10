// Complete retained negative coverage for tools/validate-expert-judgment.mjs.
//
// Each mutation targets one distinct error branch in the verifier. Warnings
// are documented separately because a negative fixture must exit non-zero.

const validator = "tools/validate-expert-judgment.mjs";

function byId(items, id) {
  return items.find((entry) => entry.id === id);
}

function cue(pkg, id = "CUE-SW-001") {
  return byId(pkg.cues, id);
}

function judgment(pkg, id = "JDG-SW-001") {
  return byId(pkg.expertJudgments, id);
}

function pattern(pkg) {
  return pkg.decisionPatterns[0];
}

function reproductionTest(pkg) {
  return pkg.reproductionTests[0];
}

function gate(pkg) {
  return pkg.acceptanceGates[0];
}

function topArrayCase(key) {
  return {
    id: `top-level-${key}-not-array`,
    rule: `top-level ${key} must be an array`,
    expect: `Top-level ${key} must be an array.`,
    mutate: (pkg) => { pkg[key] = null; }
  };
}

export const cases = [
  {
    id: "package-missing-framework-version",
    rule: "package frameworkVersion required",
    expect: "package must include non-empty string frameworkVersion.",
    mutate: (pkg) => { pkg.frameworkVersion = ""; }
  },
  {
    id: "package-missing-package-id",
    rule: "package packageId required",
    expect: "package must include non-empty string packageId.",
    mutate: (pkg) => { pkg.packageId = ""; }
  },
  ...[
    "stakeholders", "knowledgeSources", "cases", "expertJudgments", "cues",
    "concerns", "lossBoundaries", "decisionPatterns", "applicabilityBoundaries",
    "counterexamples", "qualityIntentDerivations", "reproductionTests",
    "organizationalQualityCultures", "reviewHistoryInferences", "governanceEvents",
    "acceptanceGates"
  ].map(topArrayCase),
  {
    id: "stakeholder-non-object-item",
    rule: "indexed entity must be an object",
    expect: "stakeholders contains a non-object item.",
    mutate: (pkg) => { pkg.stakeholders.push(null); }
  },
  {
    id: "stakeholder-missing-id",
    rule: "indexed entity requires string id",
    expect: "stakeholders item is missing string id.",
    mutate: (pkg) => { delete pkg.stakeholders[0].id; }
  },
  {
    id: "stakeholder-duplicate-id",
    rule: "indexed entity ids are unique",
    expect: "Duplicate id STK-CUST-001 in stakeholders.",
    mutate: (pkg) => { pkg.stakeholders[1].id = "STK-CUST-001"; }
  },
  {
    id: "source-missing-title",
    rule: "knowledge source title required",
    expect: "SRC-INT-001 must include non-empty string title.",
    mutate: (pkg) => { pkg.knowledgeSources[0].title = ""; }
  },
  {
    id: "source-reliability-out-of-range",
    rule: "knowledge source reliability score range",
    expect: "SRC-INT-001 reliability must be a number from 0 to 1.",
    mutate: (pkg) => { pkg.knowledgeSources[0].reliability = 1.1; }
  },
  {
    id: "case-missing-title",
    rule: "case title required",
    expect: "CAS-SW-001 must include non-empty string title.",
    mutate: (pkg) => { pkg.cases[0].title = ""; }
  },
  {
    id: "case-missing-context",
    rule: "case context required",
    expect: "CAS-SW-001 must include non-empty string context.",
    mutate: (pkg) => { pkg.cases[0].context = ""; }
  },
  {
    id: "case-broken-stakeholder-ref",
    rule: "case stakeholder references resolve",
    expect: "CAS-SW-001 references missing stakeholder: STK-NOPE-999",
    mutate: (pkg) => { pkg.cases[0].stakeholderRefs = ["STK-NOPE-999"]; }
  },
  {
    id: "case-broken-source-ref",
    rule: "case knowledge source reference resolves",
    expect: "CAS-SW-001 references missing knowledge source: SRC-NOPE-999",
    mutate: (pkg) => { pkg.cases[0].sourceRef = "SRC-NOPE-999"; }
  },
  {
    id: "case-missing-presented-facts",
    rule: "case presented facts required",
    expect: "CAS-SW-001 must include presentedFacts.",
    mutate: (pkg) => { pkg.cases[0].presentedFacts = []; }
  },
  {
    id: "case-missing-available-evidence",
    rule: "case available evidence required",
    expect: "CAS-SW-001 must include availableEvidence.",
    mutate: (pkg) => { pkg.cases[0].availableEvidence = []; }
  },
  {
    id: "cue-missing-statement",
    rule: "cue statement required",
    expect: "CUE-SW-001 must include non-empty string statement.",
    mutate: (pkg) => { cue(pkg).statement = ""; }
  },
  {
    id: "cue-missing-detection-method",
    rule: "cue detection method required",
    expect: "CUE-SW-001 must include non-empty string detectionMethod.",
    mutate: (pkg) => { cue(pkg).detectionMethod = ""; }
  },
  {
    id: "cue-salience-out-of-range",
    rule: "cue salience score range",
    expect: "CUE-SW-001 salience must be a number from 0 to 1.",
    mutate: (pkg) => { cue(pkg).salience = 1.5; }
  },
  {
    id: "concern-missing-statement",
    rule: "concern statement required",
    expect: "CON-SW-001 must include non-empty string statement.",
    mutate: (pkg) => { pkg.concerns[0].statement = ""; }
  },
  {
    id: "concern-missing-harm-mode",
    rule: "concern harm mode required",
    expect: "CON-SW-001 must include non-empty string harmMode.",
    mutate: (pkg) => { pkg.concerns[0].harmMode = ""; }
  },
  {
    id: "concern-missing-affected-parties",
    rule: "concern affected parties required",
    expect: "CON-SW-001 must include affectedParties.",
    mutate: (pkg) => { pkg.concerns[0].affectedParties = []; }
  },
  {
    id: "loss-boundary-missing-statement",
    rule: "loss boundary statement required",
    expect: "LSB-SW-001 must include non-empty string statement.",
    mutate: (pkg) => { pkg.lossBoundaries[0].statement = ""; }
  },
  {
    id: "loss-boundary-missing-waiver-authority",
    rule: "loss boundary waiver authority required",
    expect: "LSB-SW-001 must include non-empty string waiverAuthority.",
    mutate: (pkg) => { pkg.lossBoundaries[0].waiverAuthority = ""; }
  },
  {
    id: "loss-boundary-broken-stakeholder-ref",
    rule: "loss boundary stakeholder references resolve",
    expect: "LSB-SW-001 references missing stakeholder: STK-NOPE-999",
    mutate: (pkg) => { pkg.lossBoundaries[0].stakeholderRefs = ["STK-NOPE-999"]; }
  },
  {
    id: "judgment-broken-case-ref",
    rule: "expert judgment case reference resolves",
    expect: "JDG-SW-001 references missing case: CAS-NOPE-999",
    mutate: (pkg) => { judgment(pkg).caseRef = "CAS-NOPE-999"; }
  },
  {
    id: "judgment-broken-cue-ref",
    rule: "expert judgment cue references resolve",
    expect: "JDG-SW-001 references missing cue: CUE-NOPE-999",
    mutate: (pkg) => { judgment(pkg).primaryCueRefs = ["CUE-NOPE-999"]; }
  },
  {
    id: "judgment-broken-concern-ref",
    rule: "expert judgment concern reference resolves",
    expect: "JDG-SW-001 references missing concern: CON-NOPE-999",
    mutate: (pkg) => { judgment(pkg).concernRef = "CON-NOPE-999"; }
  },
  {
    id: "judgment-broken-loss-boundary-ref",
    rule: "expert judgment loss boundary reference resolves",
    expect: "JDG-SW-001 references missing loss boundary: LSB-NOPE-999",
    mutate: (pkg) => { judgment(pkg).lossBoundaryRef = "LSB-NOPE-999"; }
  },
  {
    id: "judgment-confidence-out-of-range",
    rule: "expert judgment confidence score range",
    expect: "JDG-SW-001 confidence must be a number from 0 to 1.",
    mutate: (pkg) => { judgment(pkg).confidence = -0.1; }
  },
  ...[
    ["acceptanceConditions", "acceptanceConditions"],
    ["requiredEvidence", "requiredEvidence"],
    ["waiverConditions", "waiverConditions"]
  ].map(([field, label]) => ({
    id: `judgment-missing-${field}`,
    rule: `expert judgment ${label} required`,
    expect: `JDG-SW-001 must include ${label}.`,
    mutate: (pkg) => { judgment(pkg)[field] = []; }
  })),
  {
    id: "pattern-missing-title",
    rule: "decision pattern title required",
    expect: "PAT-EVD-001 must include non-empty string title.",
    mutate: (pkg) => { pattern(pkg).title = ""; }
  },
  {
    id: "pattern-missing-applicable-context",
    rule: "decision pattern applicable context required",
    expect: "PAT-EVD-001 must include non-empty string applicableContext.",
    mutate: (pkg) => { pattern(pkg).applicableContext = ""; }
  },
  {
    id: "pattern-broken-trigger-cue-ref",
    rule: "decision pattern trigger cue references resolve",
    expect: "PAT-EVD-001 references missing cue: CUE-NOPE-999",
    mutate: (pkg) => { pattern(pkg).triggerCueRefs = ["CUE-NOPE-999"]; }
  },
  {
    id: "pattern-broken-concern-ref",
    rule: "decision pattern concern reference resolves",
    expect: "PAT-EVD-001 references missing concern: CON-NOPE-999",
    mutate: (pkg) => { pattern(pkg).concernRef = "CON-NOPE-999"; }
  },
  {
    id: "pattern-broken-loss-boundary-ref",
    rule: "decision pattern loss boundary reference resolves",
    expect: "PAT-EVD-001 references missing loss boundary: LSB-NOPE-999",
    mutate: (pkg) => { pattern(pkg).lossBoundaryRef = "LSB-NOPE-999"; }
  },
  {
    id: "pattern-broken-counterexample-ref",
    rule: "decision pattern counterexample references resolve",
    expect: "PAT-EVD-001 references missing counterexample: CEX-NOPE-999",
    mutate: (pkg) => { pattern(pkg).counterexampleRefs = ["CEX-NOPE-999"]; }
  },
  {
    id: "pattern-missing-source-judgments",
    rule: "decision pattern source judgments required",
    expect: "PAT-EVD-001 must include at least one source judgment.",
    mutate: (pkg) => { pattern(pkg).sourceJudgmentRefs = []; }
  },
  {
    id: "pattern-broken-reproduction-test-ref",
    rule: "decision pattern reproduction test reference resolves",
    expect: "PAT-EVD-001 references missing reproduction test: RPT-NOPE-999",
    mutate: (pkg) => { pattern(pkg).reproductionTestRef = "RPT-NOPE-999"; }
  },
  {
    id: "pattern-confidence-out-of-range",
    rule: "decision pattern confidence score range",
    expect: "PAT-EVD-001 confidence must be a number from 0 to 1.",
    mutate: (pkg) => { pattern(pkg).confidence = 1.1; }
  },
  ...[
    ["acceptanceConditions", "acceptanceConditions"],
    ["evidenceRequired", "evidenceRequired"],
    ["exceptions", "exceptions"]
  ].map(([field, label]) => ({
    id: `pattern-missing-${field}`,
    rule: `decision pattern ${label} required`,
    expect: `PAT-EVD-001 must include ${label}.`,
    mutate: (pkg) => { pattern(pkg)[field] = []; }
  })),
  {
    id: "applicability-broken-pattern-ref",
    rule: "applicability boundary pattern reference resolves",
    expect: "APB-EVD-001 references missing decision pattern: PAT-NOPE-999",
    mutate: (pkg) => { pkg.applicabilityBoundaries[0].patternRef = "PAT-NOPE-999"; }
  },
  ...["includedContexts", "excludedContexts", "assumptions", "invalidationSignals"].map((field) => ({
    id: `applicability-missing-${field}`,
    rule: `applicability boundary ${field} required`,
    expect: `APB-EVD-001 must include ${field}.`,
    mutate: (pkg) => { pkg.applicabilityBoundaries[0][field] = []; }
  })),
  {
    id: "counterexample-broken-case-ref",
    rule: "counterexample case reference resolves",
    expect: "CEX-SW-001 references missing case: CAS-NOPE-999",
    mutate: (pkg) => { pkg.counterexamples[0].caseRef = "CAS-NOPE-999"; }
  },
  {
    id: "counterexample-broken-pattern-ref",
    rule: "counterexample pattern reference resolves",
    expect: "CEX-SW-001 references missing decision pattern: PAT-NOPE-999",
    mutate: (pkg) => { pkg.counterexamples[0].patternRef = "PAT-NOPE-999"; }
  },
  {
    id: "counterexample-missing-distinguishing-factors",
    rule: "counterexample distinguishing factors required",
    expect: "CEX-SW-001 must include distinguishingFactors.",
    mutate: (pkg) => { pkg.counterexamples[0].distinguishingFactors = []; }
  },
  {
    id: "derivation-broken-pattern-ref",
    rule: "quality intent derivation pattern references resolve",
    expect: "QDR-EVD-001 references missing decision pattern: PAT-NOPE-999",
    mutate: (pkg) => { pkg.qualityIntentDerivations[0].patternRefs = ["PAT-NOPE-999"]; }
  },
  {
    id: "derivation-missing-intent-statement",
    rule: "quality intent derivation statement required",
    expect: "QDR-EVD-001 must include non-empty string derivedIntentStatement.",
    mutate: (pkg) => { pkg.qualityIntentDerivations[0].derivedIntentStatement = ""; }
  },
  {
    id: "derivation-missing-rationale",
    rule: "quality intent derivation rationale required",
    expect: "QDR-EVD-001 must include non-empty string rationale.",
    mutate: (pkg) => { pkg.qualityIntentDerivations[0].rationale = ""; }
  },
  {
    id: "reproduction-test-broken-pattern-ref",
    rule: "reproduction test pattern reference resolves",
    expect: "RPT-EVD-001 references missing decision pattern: PAT-NOPE-999",
    mutate: (pkg) => { reproductionTest(pkg).patternRef = "PAT-NOPE-999"; }
  },
  {
    id: "reproduction-test-seen-cases",
    rule: "reproduction test uses unseen cases",
    expect: "RPT-EVD-001 must use unseen cases.",
    mutate: (pkg) => { reproductionTest(pkg).usesUnseenCases = false; }
  },
  {
    id: "reproduction-test-broken-unseen-case-ref",
    rule: "reproduction test unseen case references resolve",
    expect: "RPT-EVD-001 references missing unseen case: CAS-NOPE-999",
    mutate: (pkg) => { reproductionTest(pkg).unseenCaseRefs = ["CAS-NOPE-999"]; }
  },
  {
    id: "reproduction-test-agreement-out-of-range",
    rule: "reproduction test observed agreement score range",
    expect: "RPT-EVD-001 observedAgreement must be a number from 0 to 1.",
    mutate: (pkg) => { reproductionTest(pkg).observedAgreement = 1.1; }
  },
  {
    id: "reproduction-test-missing-expected-decisions",
    rule: "reproduction test expected decisions required",
    expect: "RPT-EVD-001 must include expectedDecisions.",
    mutate: (pkg) => { reproductionTest(pkg).expectedDecisions = []; }
  },
  {
    id: "reproduction-test-non-object-expected-decision",
    rule: "reproduction test expected decision must be object",
    expect: "RPT-EVD-001 expectedDecisions contains a non-object item.",
    mutate: (pkg) => { reproductionTest(pkg).expectedDecisions = [null]; }
  },
  {
    id: "reproduction-test-broken-expected-case-ref",
    rule: "reproduction test expected decision case reference resolves",
    expect: "RPT-EVD-001/expectedDecision references missing case: CAS-NOPE-999",
    mutate: (pkg) => { reproductionTest(pkg).expectedDecisions[0].caseRef = "CAS-NOPE-999"; }
  },
  {
    id: "reproduction-test-missing-failure-analysis",
    rule: "reproduction test failure analysis must be an array",
    expect: "RPT-EVD-001 must include failureAnalysis.",
    mutate: (pkg) => { reproductionTest(pkg).failureAnalysis = null; }
  },
  {
    id: "reproduction-test-low-agreement",
    rule: "passing reproduction test agreement threshold",
    expect: "RPT-EVD-001 is pass below acceptable agreement threshold 0.75.",
    mutate: (pkg) => { reproductionTest(pkg).observedAgreement = 0.5; }
  },
  {
    id: "culture-broken-loss-boundary-ref",
    rule: "culture loss boundary references resolve",
    expect: "CUL-ORG-001 references missing loss boundary: LSB-NOPE-999",
    mutate: (pkg) => { pkg.organizationalQualityCultures[0].nonNegotiableLossBoundaryRefs = ["LSB-NOPE-999"]; }
  },
  {
    id: "culture-broken-pattern-ref",
    rule: "culture decision pattern references resolve",
    expect: "CUL-ORG-001 references missing decision pattern: PAT-NOPE-999",
    mutate: (pkg) => { pkg.organizationalQualityCultures[0].patternRefs = ["PAT-NOPE-999"]; }
  },
  ...["preferredEvidence", "escalationNorms", "waiverPractices", "repeatedFears", "qualityTradeoffs", "subgroupDifferences"].map((field) => ({
    id: `culture-missing-${field}`,
    rule: `culture ${field} required`,
    expect: `CUL-ORG-001 must include ${field}.`,
    mutate: (pkg) => { pkg.organizationalQualityCultures[0][field] = []; }
  })),
  {
    id: "culture-missing-risk-appetite",
    rule: "culture risk appetite required",
    expect: "CUL-ORG-001 must include non-empty string riskAppetite.",
    mutate: (pkg) => { pkg.organizationalQualityCultures[0].riskAppetite = ""; }
  },
  {
    id: "inference-missing-source-refs",
    rule: "review history inference source refs required",
    expect: "INF-REV-001 must include sourceRefs.",
    mutate: (pkg) => { pkg.reviewHistoryInferences[0].sourceRefs = []; }
  },
  {
    id: "inference-missing-supporting-clues",
    rule: "review history inference supporting clues required",
    expect: "INF-REV-001 must include supportingClues.",
    mutate: (pkg) => { pkg.reviewHistoryInferences[0].supportingClues = []; }
  },
  {
    id: "inference-missing-summary",
    rule: "review history inference summary required",
    expect: "INF-REV-001 must include non-empty string inferredPatternSummary.",
    mutate: (pkg) => { pkg.reviewHistoryInferences[0].inferredPatternSummary = ""; }
  },
  {
    id: "inference-confidence-out-of-range",
    rule: "review history inference confidence score range",
    expect: "INF-REV-001 confidence must be a number from 0 to 1.",
    mutate: (pkg) => { pkg.reviewHistoryInferences[0].confidence = 1.1; }
  },
  {
    id: "gate-missing-required-artifacts",
    rule: "acceptance gate required artifact references required",
    expect: "GAT-EJF-001 must include requiredArtifactRefs.",
    mutate: (pkg) => { gate(pkg).requiredArtifactRefs = []; }
  },
  {
    id: "gate-required-artifact-missing",
    rule: "acceptance gate required artifacts exist",
    expect: "GAT-EJF-001 required artifact does not exist: docs/does-not-exist.md",
    mutate: (pkg) => { gate(pkg).requiredArtifactRefs.push("docs/does-not-exist.md"); }
  },
  {
    id: "gate-missing-criteria",
    rule: "acceptance gate criteria required",
    expect: "GAT-EJF-001 must include criteria.",
    mutate: (pkg) => { gate(pkg).criteria = []; }
  },
  {
    id: "gate-non-passing-criterion",
    rule: "acceptance gate criteria must pass",
    expect: "GAT-EJF-001 has non-passing criteria: Every validated pattern cites cues, concern, loss boundary, source judgments, and reproduction test.",
    mutate: (pkg) => { gate(pkg).criteria[0].status = "fail"; }
  },
  {
    id: "pattern-missing-applicability-boundary",
    rule: "decision pattern requires applicability boundary",
    expect: "PAT-EVD-001 must have an applicability boundary.",
    mutate: (pkg) => { pkg.applicabilityBoundaries = []; }
  }
];

export const warningRulesRescoped = [
  {
    rule: "review history inference should remain candidate until independently validated",
    rationale: "This branch is intentionally a warning and exits zero; it cannot be represented by a retained failing fixture without changing verifier semantics."
  }
];

export const spec = {
  suiteId: "expert-judgment",
  basePackage: "examples/expert-judgment-sample-package.json",
  validator,
  corpusDir: "tests/fixtures/expert-judgment",
  filePrefix: "expert-judgment"
};
