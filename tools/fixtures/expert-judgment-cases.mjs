// Negative fixture cases for the expert-judgment verifier.
//
// Each mutation starts from examples/expert-judgment-sample-package.json and
// targets one existing structural rule in tools/validate-expert-judgment.mjs.
// These fixtures preserve the QIF boundary: structural verifier failure is not
// a claim about semantic expert validity.

const validator = "tools/validate-expert-judgment.mjs";

function cue(pkg, id) {
  return pkg.cues.find((entry) => entry.id === id);
}

function judgment(pkg, id) {
  return pkg.expertJudgments.find((entry) => entry.id === id);
}

function pattern(pkg) {
  return pkg.decisionPatterns[0];
}

function reproductionTest(pkg) {
  return pkg.reproductionTests[0];
}

export const cases = [
  {
    id: "case-missing-presented-facts",
    rule: "case presented facts required",
    expect: "CAS-SW-001 must include presentedFacts.",
    mutate: (pkg) => { pkg.cases[0].presentedFacts = []; }
  },
  {
    id: "cue-salience-out-of-range",
    rule: "cue salience score range",
    expect: "CUE-SW-001 salience must be a number from 0 to 1.",
    mutate: (pkg) => { cue(pkg, "CUE-SW-001").salience = 1.5; }
  },
  {
    id: "judgment-broken-case-ref",
    rule: "expert judgment case reference resolves",
    expect: "JDG-SW-001 references missing case",
    mutate: (pkg) => { judgment(pkg, "JDG-SW-001").caseRef = "CAS-NOPE-999"; }
  },
  {
    id: "pattern-missing-source-judgments",
    rule: "decision pattern source judgments required",
    expect: "PAT-EVD-001 must include at least one source judgment.",
    mutate: (pkg) => { pattern(pkg).sourceJudgmentRefs = []; }
  },
  {
    id: "reproduction-test-low-agreement",
    rule: "passing reproduction test agreement threshold",
    expect: "RPT-EVD-001 is pass below acceptable agreement threshold 0.75.",
    mutate: (pkg) => { reproductionTest(pkg).observedAgreement = 0.5; }
  },
  {
    id: "pattern-missing-applicability-boundary",
    rule: "decision pattern requires applicability boundary",
    expect: "PAT-EVD-001 must have an applicability boundary.",
    mutate: (pkg) => { pkg.applicabilityBoundaries = []; }
  }
];

export const spec = {
  suiteId: "expert-judgment",
  basePackage: "examples/expert-judgment-sample-package.json",
  validator,
  corpusDir: "tests/fixtures/expert-judgment",
  filePrefix: "expert-judgment"
};
