// Negative fixture cases for the core qif-package verifier.
//
// Each mutation starts from examples/qif-sample-package.json and targets one
// existing structural rule in tools/validate-qif.mjs. These fixtures are not
// semantic quality proof; they only prove that the verifier still rejects the
// invalid structures it claims to reject.

const validator = "tools/validate-qif.mjs";

function intent(pkg, id) {
  return pkg.qualityIntents.find((entry) => entry.id === id);
}

function evidence(pkg, id) {
  return pkg.evidenceItems.find((entry) => entry.id === id);
}

function evaluation(pkg) {
  return pkg.evaluations[0];
}

export const cases = [
  {
    id: "mission-broken-stakeholder-ref",
    rule: "mission stakeholder references resolve",
    expect: "MIS-QIF-001 references missing stakeholder",
    mutate: (pkg) => { pkg.missions[0].stakeholderRefs = ["STK-NOPE-999"]; }
  },
  {
    id: "intent-missing-acceptance-criteria",
    rule: "quality intent acceptance criteria required",
    expect: "QIN-METRIC-001 must have acceptance criteria.",
    mutate: (pkg) => { intent(pkg, "QIN-METRIC-001").acceptanceCriteria = []; }
  },
  {
    id: "evidence-confidence-not-reproducible",
    rule: "evidence confidence reproduces from inputs",
    expect: "EVD-METRIC-001 confidence 0.1 does not match expected 0.77.",
    mutate: (pkg) => { evidence(pkg, "EVD-METRIC-001").confidence = 0.1; }
  },
  {
    id: "activity-count-treated-as-quality",
    rule: "activity-count indicators remain evidence-only",
    expect: "IND-REVIEW-COUNT-001 is an activity-count indicator but is not evidence-only.",
    mutate: (pkg) => { pkg.indicators[0].interpretation = "quality-itself"; }
  },
  {
    id: "verdict-confidence-not-reproducible",
    rule: "verdict confidence reproduces from evidence mean",
    expect: "EVL-QIF-001/QIN-METRIC-001 confidence 0.1 does not match evidence mean 0.76.",
    mutate: (pkg) => { evaluation(pkg).verdicts[0].confidence = 0.1; }
  },
  {
    id: "gate-required-artifact-missing",
    rule: "acceptance gate required artifacts exist",
    expect: "GAT-QIF-001 required artifact does not exist",
    mutate: (pkg) => { pkg.acceptanceGates[0].requiredArtifactRefs.push("docs/does-not-exist.md"); }
  }
];

export const spec = {
  suiteId: "qif-package",
  basePackage: "examples/qif-sample-package.json",
  validator,
  corpusDir: "tests/fixtures/qif-package",
  filePrefix: "qif-package"
};
