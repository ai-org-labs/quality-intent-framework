// Complete retained negative coverage for tools/validate-qif.mjs.
//
// Every case starts from the valid sample and targets one distinct verifier
// branch. The suite proves structural regression resistance only; it does not
// prove that a package's quality claims are semantically true.

const validator = "tools/validate-qif.mjs";

function byId(items, id) {
  return items.find((entry) => entry.id === id);
}

function intent(pkg, id = "QIN-METRIC-001") {
  return byId(pkg.qualityIntents, id);
}

function evidence(pkg, id = "EVD-METRIC-001") {
  return byId(pkg.evidenceItems, id);
}

function evaluation(pkg) {
  return pkg.evaluations[0];
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
    id: "package-missing-qif-version",
    rule: "package qifVersion required",
    expect: "package must include non-empty string qifVersion.",
    mutate: (pkg) => { pkg.qifVersion = ""; }
  },
  {
    id: "package-missing-package-id",
    rule: "package packageId required",
    expect: "package must include non-empty string packageId.",
    mutate: (pkg) => { pkg.packageId = ""; }
  },
  ...[
    "missions", "stakeholders", "contexts", "risks", "knowledgeSources",
    "qualityIntents", "evidenceItems", "evaluations", "governanceEvents",
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
    expect: "Duplicate id STK-ORG-001 in stakeholders.",
    mutate: (pkg) => { pkg.stakeholders[1].id = "STK-ORG-001"; }
  },
  {
    id: "mission-missing-statement",
    rule: "mission statement required",
    expect: "MIS-QIF-001 must include non-empty string statement.",
    mutate: (pkg) => { pkg.missions[0].statement = ""; }
  },
  {
    id: "mission-missing-stakeholders",
    rule: "mission stakeholder references required",
    expect: "MIS-QIF-001 must include at least one stakeholder.",
    mutate: (pkg) => { pkg.missions[0].stakeholderRefs = []; }
  },
  {
    id: "mission-broken-stakeholder-ref",
    rule: "mission stakeholder references resolve",
    expect: "MIS-QIF-001 references missing stakeholder: STK-NOPE-999",
    mutate: (pkg) => { pkg.missions[0].stakeholderRefs = ["STK-NOPE-999"]; }
  },
  {
    id: "mission-missing-contexts",
    rule: "mission context references required",
    expect: "MIS-QIF-001 must include at least one context.",
    mutate: (pkg) => { pkg.missions[0].contextRefs = []; }
  },
  {
    id: "mission-broken-context-ref",
    rule: "mission context references resolve",
    expect: "MIS-QIF-001 references missing context: CTX-NOPE-999",
    mutate: (pkg) => { pkg.missions[0].contextRefs = ["CTX-NOPE-999"]; }
  },
  {
    id: "risk-missing-statement",
    rule: "risk statement required",
    expect: "RSK-METRIC-001 must include non-empty string statement.",
    mutate: (pkg) => { pkg.risks[0].statement = ""; }
  },
  {
    id: "risk-missing-loss-boundary",
    rule: "risk loss boundary required",
    expect: "RSK-METRIC-001 must include non-empty string lossBoundary.",
    mutate: (pkg) => { pkg.risks[0].lossBoundary = ""; }
  },
  {
    id: "risk-broken-stakeholder-ref",
    rule: "risk stakeholder references resolve",
    expect: "RSK-METRIC-001 references missing stakeholder: STK-NOPE-999",
    mutate: (pkg) => { pkg.risks[0].stakeholderRefs = ["STK-NOPE-999"]; }
  },
  {
    id: "risk-broken-context-ref",
    rule: "risk context references resolve",
    expect: "RSK-METRIC-001 references missing context: CTX-NOPE-999",
    mutate: (pkg) => { pkg.risks[0].contextRefs = ["CTX-NOPE-999"]; }
  },
  {
    id: "source-missing-title",
    rule: "knowledge source title required",
    expect: "SRC-THEORY-001 must include non-empty string title.",
    mutate: (pkg) => { pkg.knowledgeSources[0].title = ""; }
  },
  {
    id: "source-reliability-out-of-range",
    rule: "knowledge source reliability score range",
    expect: "SRC-THEORY-001 reliability must be a number from 0 to 1.",
    mutate: (pkg) => { pkg.knowledgeSources[0].reliability = 1.1; }
  },
  {
    id: "intent-missing-statement",
    rule: "quality intent statement required",
    expect: "QIN-METRIC-001 must include non-empty string statement.",
    mutate: (pkg) => { intent(pkg).statement = ""; }
  },
  {
    id: "intent-missing-purpose",
    rule: "quality intent purpose required",
    expect: "QIN-METRIC-001 must include non-empty string purpose.",
    mutate: (pkg) => { intent(pkg).purpose = ""; }
  },
  {
    id: "intent-active-missing-governance-owner",
    rule: "active quality intent governance owner required",
    expect: "QIN-METRIC-001 is active but has no governance owner.",
    mutate: (pkg) => { intent(pkg).governanceOwner = ""; }
  },
  {
    id: "intent-broken-stakeholder-ref",
    rule: "quality intent stakeholder references resolve",
    expect: "QIN-METRIC-001 references missing stakeholder: STK-NOPE-999",
    mutate: (pkg) => { intent(pkg).stakeholderRefs = ["STK-NOPE-999"]; }
  },
  {
    id: "intent-broken-context-ref",
    rule: "quality intent context references resolve",
    expect: "QIN-METRIC-001 references missing context: CTX-NOPE-999",
    mutate: (pkg) => { intent(pkg).contextRefs = ["CTX-NOPE-999"]; }
  },
  {
    id: "intent-broken-risk-ref",
    rule: "quality intent risk references resolve",
    expect: "QIN-METRIC-001 references missing risk: RSK-NOPE-999",
    mutate: (pkg) => { intent(pkg).riskRefs = ["RSK-NOPE-999"]; }
  },
  {
    id: "intent-broken-source-ref",
    rule: "quality intent knowledge source references resolve",
    expect: "QIN-METRIC-001 references missing knowledge source: SRC-NOPE-999",
    mutate: (pkg) => { intent(pkg).sourceRefs = ["SRC-NOPE-999"]; }
  },
  {
    id: "intent-missing-acceptance-criteria",
    rule: "quality intent acceptance criteria required",
    expect: "QIN-METRIC-001 must have acceptance criteria.",
    mutate: (pkg) => { intent(pkg).acceptanceCriteria = []; }
  },
  {
    id: "evidence-broken-source-ref",
    rule: "evidence knowledge source reference resolves",
    expect: "EVD-METRIC-001 references missing knowledge source: SRC-NOPE-999",
    mutate: (pkg) => { evidence(pkg).sourceRef = "SRC-NOPE-999"; }
  },
  {
    id: "evidence-broken-intent-ref",
    rule: "evidence quality intent references resolve",
    expect: "EVD-METRIC-001 references missing quality intent: QIN-NOPE-999",
    mutate: (pkg) => { evidence(pkg).intentRefs = ["QIN-NOPE-999"]; }
  },
  {
    id: "evidence-missing-finding",
    rule: "evidence finding required",
    expect: "EVD-METRIC-001 must include non-empty string finding.",
    mutate: (pkg) => { evidence(pkg).finding = ""; }
  },
  {
    id: "evidence-missing-confidence-inputs",
    rule: "evidence confidence inputs required",
    expect: "EVD-METRIC-001 is missing confidenceInputs.",
    mutate: (pkg) => { delete evidence(pkg).confidenceInputs; }
  },
  ...[
    "sourceReliability", "relevance", "coverage", "recency", "independence", "contradictionPenalty"
  ].map((field) => ({
    id: `evidence-${field}-out-of-range`,
    rule: `evidence confidence input ${field} score range`,
    expect: `EVD-METRIC-001 confidenceInputs.${field} must be a number from 0 to 1.`,
    mutate: (pkg) => { evidence(pkg).confidenceInputs[field] = 1.1; }
  })),
  {
    id: "evidence-confidence-not-reproducible",
    rule: "evidence confidence reproduces from inputs",
    expect: "EVD-METRIC-001 confidence 0.1 does not match expected 0.77.",
    mutate: (pkg) => { evidence(pkg).confidence = 0.1; }
  },
  {
    id: "indicator-broken-intent-ref",
    rule: "indicator quality intent reference resolves",
    expect: "IND-REVIEW-COUNT-001 references missing quality intent: QIN-NOPE-999",
    mutate: (pkg) => { pkg.indicators[0].linkedIntentRef = "QIN-NOPE-999"; }
  },
  {
    id: "indicator-broken-risk-ref",
    rule: "indicator risk reference resolves",
    expect: "IND-REVIEW-COUNT-001 references missing risk: RSK-NOPE-999",
    mutate: (pkg) => { pkg.indicators[0].linkedRiskRef = "RSK-NOPE-999"; }
  },
  {
    id: "activity-count-treated-as-quality",
    rule: "activity-count indicators remain evidence-only",
    expect: "IND-REVIEW-COUNT-001 is an activity-count indicator but is not evidence-only.",
    mutate: (pkg) => { pkg.indicators[0].interpretation = "quality-itself"; }
  },
  {
    id: "indicator-explicit-quality-itself",
    rule: "no indicator may claim to be quality itself",
    expect: "IND-REVIEW-COUNT-001 treats an indicator as quality itself.",
    mutate: (pkg) => { pkg.indicators[0].metricKind = "rate"; pkg.indicators[0].interpretation = "quality-itself"; }
  },
  {
    id: "evaluation-broken-intent-ref",
    rule: "evaluation quality intent references resolve",
    expect: "EVL-QIF-001 references missing quality intent: QIN-NOPE-999",
    mutate: (pkg) => { evaluation(pkg).evaluatedIntentRefs = ["QIN-NOPE-999"]; }
  },
  {
    id: "evaluation-broken-evidence-ref",
    rule: "evaluation evidence references resolve",
    expect: "EVL-QIF-001 references missing evidence: EVD-NOPE-999",
    mutate: (pkg) => { evaluation(pkg).evidenceRefs = ["EVD-NOPE-999"]; }
  },
  {
    id: "evaluation-missing-confidence-policy",
    rule: "evaluation confidence policy required",
    expect: "EVL-QIF-001 is missing confidencePolicy.",
    mutate: (pkg) => { delete evaluation(pkg).confidencePolicy; }
  },
  {
    id: "evaluation-partial-threshold-out-of-range",
    rule: "partial threshold score range",
    expect: "EVL-QIF-001 partialThreshold must be a number from 0 to 1.",
    mutate: (pkg) => { evaluation(pkg).confidencePolicy.partialThreshold = -0.1; }
  },
  {
    id: "evaluation-achieved-threshold-out-of-range",
    rule: "achieved threshold score range",
    expect: "EVL-QIF-001 achievedThreshold must be a number from 0 to 1.",
    mutate: (pkg) => { evaluation(pkg).confidencePolicy.achievedThreshold = 1.1; }
  },
  {
    id: "evaluation-threshold-order-invalid",
    rule: "partial threshold cannot exceed achieved threshold",
    expect: "EVL-QIF-001 partialThreshold cannot exceed achievedThreshold.",
    mutate: (pkg) => { evaluation(pkg).confidencePolicy.partialThreshold = 0.8; evaluation(pkg).confidencePolicy.achievedThreshold = 0.7; }
  },
  {
    id: "evaluation-missing-verdicts",
    rule: "evaluation verdicts required",
    expect: "EVL-QIF-001 must include verdicts.",
    mutate: (pkg) => { evaluation(pkg).verdicts = []; }
  },
  {
    id: "verdict-broken-intent-ref",
    rule: "verdict quality intent reference resolves",
    expect: "EVL-QIF-001/QIN-NOPE-999 references missing quality intent: QIN-NOPE-999",
    mutate: (pkg) => { evaluation(pkg).verdicts[0].intentRef = "QIN-NOPE-999"; }
  },
  {
    id: "verdict-broken-evidence-ref",
    rule: "verdict evidence references resolve",
    expect: "EVL-QIF-001/QIN-METRIC-001 references missing evidence: EVD-NOPE-999",
    mutate: (pkg) => { evaluation(pkg).verdicts[0].evidenceRefs = ["EVD-NOPE-999"]; }
  },
  {
    id: "verdict-confidence-not-reproducible",
    rule: "verdict confidence reproduces from evidence mean",
    expect: "EVL-QIF-001/QIN-METRIC-001 confidence 0.1 does not match evidence mean 0.76.",
    mutate: (pkg) => { evaluation(pkg).verdicts[0].confidence = 0.1; }
  },
  {
    id: "achieved-verdict-below-threshold",
    rule: "achieved verdict meets achieved threshold",
    expect: "EVL-QIF-001/QIN-METRIC-001 is achieved below achievedThreshold 0.8.",
    mutate: (pkg) => { evaluation(pkg).confidencePolicy.achievedThreshold = 0.8; }
  },
  {
    id: "partial-verdict-below-threshold",
    rule: "partially achieved verdict meets partial threshold",
    expect: "EVL-QIF-001/QIN-TACIT-001 is partially-achieved below partialThreshold 0.8.",
    mutate: (pkg) => { evaluation(pkg).confidencePolicy.partialThreshold = 0.8; evaluation(pkg).confidencePolicy.achievedThreshold = 0.8; }
  },
  {
    id: "achieved-verdict-with-contradictory-evidence",
    rule: "achieved verdict cannot ignore high-confidence contradictory evidence",
    expect: "EVL-QIF-001/QIN-METRIC-001 is achieved despite high-confidence contradictory evidence.",
    mutate: (pkg) => { evidence(pkg).polarity = "contradicts"; }
  },
  {
    id: "governance-broken-target-ref",
    rule: "governance target reference resolves",
    expect: "GOV-QIF-001 references missing governance target NOPE-999.",
    mutate: (pkg) => { pkg.governanceEvents[0].targetRef = "NOPE-999"; }
  },
  {
    id: "governance-broken-evidence-ref",
    rule: "governance evidence references resolve",
    expect: "GOV-QIF-001 references missing evidence: EVD-NOPE-999",
    mutate: (pkg) => { pkg.governanceEvents[0].evidenceRefs = ["EVD-NOPE-999"]; }
  },
  {
    id: "gate-missing-required-artifacts",
    rule: "acceptance gate required artifact references required",
    expect: "GAT-QIF-001 must include requiredArtifactRefs.",
    mutate: (pkg) => { gate(pkg).requiredArtifactRefs = []; }
  },
  {
    id: "gate-required-artifact-missing",
    rule: "acceptance gate required artifacts exist",
    expect: "GAT-QIF-001 required artifact does not exist: docs/does-not-exist.md",
    mutate: (pkg) => { gate(pkg).requiredArtifactRefs.push("docs/does-not-exist.md"); }
  },
  {
    id: "gate-missing-criteria",
    rule: "acceptance gate criteria required",
    expect: "GAT-QIF-001 must include criteria.",
    mutate: (pkg) => { gate(pkg).criteria = []; }
  },
  {
    id: "gate-non-passing-criterion",
    rule: "acceptance gate criteria must pass",
    expect: "GAT-QIF-001 has non-passing criteria: The package validates with the local verifier.",
    mutate: (pkg) => { gate(pkg).criteria[0].status = "fail"; }
  }
];

export const spec = {
  suiteId: "qif-package",
  basePackage: "examples/qif-sample-package.json",
  validator,
  corpusDir: "tests/fixtures/qif-package",
  filePrefix: "qif-package"
};
