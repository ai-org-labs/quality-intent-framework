// Retained negative coverage for the organizational-quality-culture runtime verifier.
//
// These cases protect the boundary that culture is aggregation context, not a
// prerequisite or shortcut for deriving Quality Intents. They prove covered
// structural rules still fire; they do not prove the culture summary is
// semantically correct.

const validator = "tools/validate-qif-runtime.mjs";

function topArrayCase(key) {
  return {
    id: `top-level-${key}-not-array`,
    rule: `top-level ${key} must be an array`,
    expect: `package ${key} must be an array.`,
    mutate: (pkg) => { pkg[key] = null; }
  };
}

function culture(pkg, id = "CUL-001") {
  return pkg.organizationalQualityCultures.find((entry) => entry.id === id);
}

export const cases = [
  topArrayCase("lossBoundaries"),
  topArrayCase("decisionPatterns"),
  topArrayCase("organizationalQualityCultures"),
  {
    id: "culture-broken-loss-boundary-ref",
    rule: "culture non-negotiable loss boundaries resolve",
    expect: "CUL-001 references missing loss boundary",
    mutate: (pkg) => { culture(pkg).nonNegotiableLossBoundaryRefs = ["LSB-NOPE-999"]; }
  },
  {
    id: "culture-broken-pattern-ref",
    rule: "culture pattern refs resolve",
    expect: "CUL-001 references missing decision pattern",
    mutate: (pkg) => { culture(pkg).patternRefs = ["PAT-NOPE-999"]; }
  },
  {
    id: "culture-missing-risk-appetite",
    rule: "culture risk appetite required",
    expect: "CUL-001 must include non-empty string riskAppetite.",
    mutate: (pkg) => { culture(pkg).riskAppetite = ""; }
  },
  {
    id: "culture-not-context-only",
    rule: "culture aggregation role is context only",
    expect: "CUL-001 must be marked as context-only.",
    mutate: (pkg) => { culture(pkg).aggregationRole = "quality-intent-prerequisite"; }
  },
  {
    id: "culture-derivation-prerequisite-field-forbidden",
    rule: "culture must not be derivation prerequisite",
    expect: "CUL-001 must not include qualityIntentDerivationPrerequisite; culture is context only.",
    mutate: (pkg) => { culture(pkg).qualityIntentDerivationPrerequisite = true; }
  },
  {
    id: "culture-missing-recurring-fears",
    rule: "culture recurring fears required",
    expect: "CUL-001 must include recurringFears.",
    mutate: (pkg) => { culture(pkg).recurringFears = []; }
  },
  {
    id: "culture-missing-preferred-evidence",
    rule: "culture preferred evidence required",
    expect: "CUL-001 must include preferredEvidence.",
    mutate: (pkg) => { culture(pkg).preferredEvidence = []; }
  },
  {
    id: "culture-missing-escalation-norms",
    rule: "culture escalation norms required",
    expect: "CUL-001 must include escalationNorms.",
    mutate: (pkg) => { culture(pkg).escalationNorms = []; }
  },
  {
    id: "culture-missing-waiver-practices",
    rule: "culture waiver practices required",
    expect: "CUL-001 must include waiverPractices.",
    mutate: (pkg) => { culture(pkg).waiverPractices = []; }
  },
  {
    id: "culture-missing-quality-tradeoffs",
    rule: "culture quality tradeoffs required",
    expect: "CUL-001 must include qualityTradeoffs.",
    mutate: (pkg) => { culture(pkg).qualityTradeoffs = []; }
  },
  {
    id: "culture-missing-role-differences",
    rule: "culture department or role differences required",
    expect: "CUL-001 must include departmentOrRoleDifferences.",
    mutate: (pkg) => { culture(pkg).departmentOrRoleDifferences = []; }
  },
  {
    id: "culture-nonprovisional-single-pattern",
    rule: "non-provisional culture grounded in multiple patterns",
    expect: "CUL-001 must reference multiple patterns or be explicitly provisional.",
    mutate: (pkg) => { culture(pkg).patternRefs = ["PAT-CUL-001"]; }
  }
];

export const spec = {
  suiteId: "organizational-quality-culture",
  basePackage: "examples/organizational-quality-culture-package.json",
  validator,
  corpusDir: "tests/fixtures/organizational-quality-culture",
  filePrefix: "organizational-quality-culture"
};
