// Retained negative coverage for the evaluation-target runtime verifier.
//
// These cases protect QIF's domain-general target model. Passing this suite
// proves structural regression resistance only; it does not prove that the
// target description captures the complete real-world evaluation context.

const validator = "tools/validate-qif-runtime.mjs";

function target(pkg, id = "TGT-SW-001") {
  return pkg.evaluationTargets.find((entry) => entry.id === id);
}

export const cases = [
  {
    id: "top-level-evaluationTargets-not-array",
    rule: "top-level evaluationTargets must be an array",
    expect: "package evaluationTargets must be an array.",
    mutate: (pkg) => { pkg.evaluationTargets = null; }
  },
  {
    id: "target-missing-id",
    rule: "evaluation target id required",
    expect: "evaluationTargets item is missing string id.",
    mutate: (pkg) => { delete target(pkg).id; }
  },
  {
    id: "target-duplicate-id",
    rule: "evaluation target ids are unique",
    expect: "Duplicate id TGT-SW-001 in",
    mutate: (pkg) => { pkg.evaluationTargets[1].id = "TGT-SW-001"; }
  },
  {
    id: "target-missing-title",
    rule: "evaluation target title required",
    expect: "TGT-SW-001 must include non-empty string title.",
    mutate: (pkg) => { target(pkg).title = ""; }
  },
  {
    id: "target-missing-domain",
    rule: "evaluation target domain required",
    expect: "TGT-SW-001 must include non-empty string domain.",
    mutate: (pkg) => { target(pkg).domain = ""; }
  },
  {
    id: "target-unsupported-domain",
    rule: "evaluation target domain vocabulary",
    expect: "TGT-SW-001 domain must be one of the supported evaluation target domains.",
    mutate: (pkg) => { target(pkg).domain = "software-only"; }
  },
  {
    id: "target-missing-target-type",
    rule: "evaluation target targetType required",
    expect: "TGT-SW-001 must include non-empty string targetType.",
    mutate: (pkg) => { target(pkg).targetType = ""; }
  },
  {
    id: "target-missing-artifact-type",
    rule: "evaluation target artifactType required",
    expect: "TGT-SW-001 must include non-empty string artifactType.",
    mutate: (pkg) => { target(pkg).artifactType = ""; }
  },
  {
    id: "target-missing-context",
    rule: "evaluation target context required",
    expect: "TGT-SW-001 must include non-empty string context.",
    mutate: (pkg) => { target(pkg).context = ""; }
  },
  {
    id: "target-missing-stakeholder-impact",
    rule: "evaluation target stakeholder impact required",
    expect: "TGT-SW-001 must include stakeholderImpact.",
    mutate: (pkg) => { target(pkg).stakeholderImpact = []; }
  },
  {
    id: "target-stakeholder-impact-not-array",
    rule: "evaluation target stakeholder impact array",
    expect: "TGT-SW-001 must include stakeholderImpact.",
    mutate: (pkg) => { target(pkg).stakeholderImpact = "end users"; }
  },
  {
    id: "target-missing-operational-impact",
    rule: "evaluation target operational impact required",
    expect: "TGT-SW-001 must include non-empty string operationalImpact.",
    mutate: (pkg) => { target(pkg).operationalImpact = ""; }
  },
  {
    id: "target-missing-risk-summary",
    rule: "evaluation target risk summary required",
    expect: "TGT-SW-001 must include non-empty string riskSummary.",
    mutate: (pkg) => { target(pkg).riskSummary = ""; }
  },
  {
    id: "target-missing-source-evidence",
    rule: "evaluation target source evidence required",
    expect: "TGT-SW-001 must include sourceEvidence.",
    mutate: (pkg) => { target(pkg).sourceEvidence = []; }
  },
  {
    id: "target-source-evidence-not-array",
    rule: "evaluation target source evidence array",
    expect: "TGT-SW-001 must include sourceEvidence.",
    mutate: (pkg) => { target(pkg).sourceEvidence = "code diff"; }
  }
];

export const spec = {
  suiteId: "evaluation-target",
  basePackage: "examples/evaluation-target-package.json",
  validator,
  corpusDir: "tests/fixtures/evaluation-target",
  filePrefix: "evaluation-target"
};
