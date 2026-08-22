const validator = "tools/validate-authoring-template.mjs";

function template(pkg) { return pkg.authoringTemplates[0]; }
function instruction(pkg) { return pkg.instructionBlocks[0]; }
function input(pkg) { return pkg.inputContracts[0]; }
function explanation(pkg) { return pkg.audienceExplanationContracts[0]; }
function output(pkg) { return pkg.outputContracts[0]; }
function pipeline(pkg) { return pkg.validationPipelines[0]; }
function golden(pkg) { return pkg.goldenCases[0]; }
function rubric(pkg) { return pkg.scoringRubrics[0]; }
function run(pkg) { return pkg.agentAuthoringRuns[0]; }
function result(pkg) { return pkg.conformanceResults[0]; }

export const cases = [
  {
    id: "templates-not-array",
    rule: "authoringTemplates must be an array",
    expect: "authoringTemplates must be an array.",
    mutate: (pkg) => { pkg.authoringTemplates = null; }
  },
  {
    id: "instruction-prohibited-claims-required",
    rule: "instruction block lists prohibited claims",
    expect: "INS-ATP-001 prohibitedClaims must include at least one claim.",
    mutate: (pkg) => { instruction(pkg).prohibitedClaims = []; }
  },
  {
    id: "instruction-rejects-checklist-quality",
    rule: "instruction does not treat checklist completion as quality",
    expect: "INS-ATP-001 instructionText must not treat checklist completion as quality.",
    mutate: (pkg) => { instruction(pkg).instructionText = "checklist completion proves quality"; }
  },
  {
    id: "input-required-fields",
    rule: "input contract declares required fields",
    expect: "INC-ATP-001 requiredFields must include at least one field.",
    mutate: (pkg) => { input(pkg).requiredFields = []; }
  },
  {
    id: "explanation-contracts-array",
    rule: "audience explanation contracts must be an array",
    expect: "audienceExplanationContracts must be an array.",
    mutate: (pkg) => { pkg.audienceExplanationContracts = null; }
  },
  {
    id: "explanation-general-public",
    rule: "audience explanation targets general public",
    expect: "AEC-ATP-001 audienceLevel must be general-public.",
    mutate: (pkg) => { explanation(pkg).audienceLevel = "expert-only"; }
  },
  {
    id: "explanation-terms-required",
    rule: "audience explanation lists terms to avoid without explanation",
    expect: "AEC-ATP-001 termsToAvoidWithoutExplanation must include at least one term.",
    mutate: (pkg) => { explanation(pkg).termsToAvoidWithoutExplanation = []; }
  },
  {
    id: "explanation-diagram-required",
    rule: "audience explanation requires a diagram spec",
    expect: "AEC-ATP-001 diagramSpecs must include at least one diagram spec.",
    mutate: (pkg) => { explanation(pkg).diagramSpecs = []; }
  },
  {
    id: "explanation-diagram-flow",
    rule: "diagram text shows simple flow",
    expect: "AEC-ATP-001 diagramText must show a simple flow using ->.",
    mutate: (pkg) => { explanation(pkg).diagramSpecs[0].diagramText = "user request becomes QIF package"; }
  },
  {
    id: "template-explanation-contract-ref-resolves",
    rule: "template links audience explanation contract",
    expect: "ATP-001 references missing audience explanation contract: AEC-NOPE-999",
    mutate: (pkg) => { template(pkg).audienceExplanationContractRef = "AEC-NOPE-999"; }
  },
  {
    id: "output-target-package-supported",
    rule: "output contract targets supported package type",
    expect: "OUC-ATP-001 targetPackageType is not supported: mystery-package",
    mutate: (pkg) => { output(pkg).targetPackageType = "mystery-package"; }
  },
  {
    id: "output-entity-families-required",
    rule: "output contract declares entity families",
    expect: "OUC-ATP-001 requiredEntityFamilies must include at least one family.",
    mutate: (pkg) => { output(pkg).requiredEntityFamilies = []; }
  },
  {
    id: "pipeline-output-ref-resolves",
    rule: "validation pipeline links output contract",
    expect: "VPL-ATP-001 references missing output contract: OUC-NOPE-999",
    mutate: (pkg) => { pipeline(pkg).outputContractRef = "OUC-NOPE-999"; }
  },
  {
    id: "pipeline-local-validator",
    rule: "validation pipeline uses local QIF validator",
    expect: "VPL-ATP-001 validationCommand must call a local QIF validator.",
    mutate: (pkg) => { pipeline(pkg).validationCommand = "curl https://example.com/validate"; }
  },
  {
    id: "golden-acceptance-criteria",
    rule: "golden case declares acceptance criteria",
    expect: "GCS-ATP-001 acceptanceCriteria must include at least one criterion.",
    mutate: (pkg) => { golden(pkg).acceptanceCriteria = []; }
  },
  {
    id: "rubric-criteria-required",
    rule: "scoring rubric declares criteria",
    expect: "SRB-ATP-001 criteria must include at least one criterion.",
    mutate: (pkg) => { rubric(pkg).criteria = []; }
  },
  {
    id: "template-target-matches-output",
    rule: "template target package matches output contract",
    expect: "ATP-001 targetPackageType must match output contract targetPackageType.",
    mutate: (pkg) => { template(pkg).targetPackageType = "review-run"; }
  },
  {
    id: "run-no-hidden-reasoning",
    rule: "agent run does not store hidden reasoning",
    expect: "AAR-ATP-001 hiddenReasoningStored must not be true.",
    mutate: (pkg) => { run(pkg).hiddenReasoningStored = true; }
  },
  {
    id: "pass-score-threshold",
    rule: "pass result score meets rubric threshold",
    expect: "CFR-ATP-001 pass verdict score is below rubric passThreshold.",
    mutate: (pkg) => { result(pkg).score = 0.5; }
  },
  {
    id: "non-pass-governance",
    rule: "non-pass result triggers governance",
    expect: "CFR-ATP-001 non-pass conformance result requires governanceTriggerRefs.",
    mutate: (pkg) => { result(pkg).verdict = "fail"; }
  },
  {
    id: "boundary-agent-competence",
    rule: "verifier boundary avoids agent competence claim",
    expect: "verifierBoundary must explicitly avoid claiming agent authoring competence.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["semantic truth"]; }
  }
];

export const spec = {
  suiteId: "authoring-template",
  basePackage: "examples/authoring-template-package.json",
  validator,
  corpusDir: "tests/fixtures/authoring-template",
  filePrefix: "authoring-template"
};
