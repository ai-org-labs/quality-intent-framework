const validator = "tools/validate-action-quality-contract.mjs";

function contract(pkg) { return pkg.actionContracts[0]; }
function request(pkg) { return pkg.actionRequests[0]; }
function surface(pkg) { return pkg.toolSurfaces[0]; }
function environment(pkg) { return pkg.executionEnvironments[0]; }
function policy(pkg) { return pkg.permissionPolicies[0]; }
function approval(pkg) { return pkg.approvalGates[0]; }
function transition(pkg) { return pkg.expectedStateTransitions[0]; }
function rollback(pkg) { return pkg.rollbackPlans[0]; }
function evidence(pkg) { return pkg.evidenceRequirements[0]; }
function trace(pkg) { return pkg.runtimeTraces[0]; }
function outcome(pkg) { return pkg.actionOutcomes[0]; }

export const cases = [
  {
    id: "contracts-not-array",
    rule: "actionContracts must be an array",
    expect: "actionContracts must be an array.",
    mutate: (pkg) => { pkg.actionContracts = null; }
  },
  {
    id: "surface-capabilities-required",
    rule: "tool surface capabilities required",
    expect: "TLS-AQC-001 capabilities must include at least one capability.",
    mutate: (pkg) => { surface(pkg).capabilities = []; }
  },
  {
    id: "environment-isolation-required",
    rule: "environment isolation boundary required",
    expect: "ENV-AQC-001 must include non-empty string isolationBoundary.",
    mutate: (pkg) => { environment(pkg).isolationBoundary = ""; }
  },
  {
    id: "policy-prohibited-operations-array",
    rule: "permission policy prohibited operations are explicit",
    expect: "PER-AQC-001 prohibitedOperations must be an array.",
    mutate: (pkg) => { policy(pkg).prohibitedOperations = null; }
  },
  {
    id: "approved-gate-needs-approved-at",
    rule: "approved gate records approval time",
    expect: "APR-AQC-001 approved approval gate must include approvedAt.",
    mutate: (pkg) => { delete approval(pkg).approvedAt; }
  },
  {
    id: "transition-stop-condition-required",
    rule: "expected transition has stop condition",
    expect: "EST-AQC-001 must include non-empty string stopCondition.",
    mutate: (pkg) => { transition(pkg).stopCondition = ""; }
  },
  {
    id: "rollback-transition-ref-resolves",
    rule: "rollback plan links expected transition",
    expect: "RBP-AQC-001 references missing expected state transition: EST-NOPE-999",
    mutate: (pkg) => { rollback(pkg).expectedStateTransitionRef = "EST-NOPE-999"; }
  },
  {
    id: "evidence-required-verdicts",
    rule: "evidence requirement states required verdicts",
    expect: "EVR-AQC-001 requiredForVerdicts must include at least one verdict.",
    mutate: (pkg) => { evidence(pkg).requiredForVerdicts = []; }
  },
  {
    id: "contract-tool-ref-resolves",
    rule: "contract tool surface resolves",
    expect: "ACT-AQC-001 references missing tool surface: TLS-NOPE-999",
    mutate: (pkg) => { contract(pkg).toolSurfaceRef = "TLS-NOPE-999"; }
  },
  {
    id: "high-risk-contract-needs-approval",
    rule: "high-risk write action requires approval gate",
    expect: "ACT-AQC-001 high-risk or write-like action contract requires approvalGateRefs.",
    mutate: (pkg) => { contract(pkg).approvalGateRefs = []; }
  },
  {
    id: "request-tool-matches-contract",
    rule: "request uses contract tool surface",
    expect: "AQR-AQC-001 requestedToolSurfaceRef must match its action contract toolSurfaceRef.",
    mutate: (pkg) => {
      pkg.toolSurfaces.push({
        id: "TLS-AQC-OTHER",
        toolKind: "browser",
        providerNeutralName: "browser executor",
        operationClass: "local-runtime-tool",
        capabilities: ["open page"],
        status: "active"
      });
      request(pkg).requestedToolSurfaceRef = "TLS-AQC-OTHER";
    }
  },
  {
    id: "trace-spans-required",
    rule: "runtime trace has spans",
    expect: "RTR-AQC-001 spans must include at least one span.",
    mutate: (pkg) => { trace(pkg).spans = []; }
  },
  {
    id: "trace-sensitive-data-redacted",
    rule: "sensitive trace data requires redaction",
    expect: "RTR-AQC-001 traces with sensitive data require redactionStatus redacted.",
    mutate: (pkg) => {
      trace(pkg).containsSensitiveData = true;
      trace(pkg).redactionStatus = "not-required";
    }
  },
  {
    id: "accepted-outcome-matches-post-state",
    rule: "accepted outcome must match expected post state",
    expect: "AOC-AQC-001 accepted outcome actualState must equal expected postState.",
    mutate: (pkg) => { outcome(pkg).actualState = "tests failed"; }
  },
  {
    id: "low-confidence-outcome-governance",
    rule: "low confidence action outcome triggers governance",
    expect: "AOC-AQC-001 low-confidence outcome requires governanceTriggerRefs.",
    mutate: (pkg) => { outcome(pkg).confidence = 0.5; }
  },
  {
    id: "boundary-avoids-tool-safety-claim",
    rule: "verifier boundary rejects tool execution safety claim",
    expect: "verifierBoundary must explicitly avoid claiming tool execution safety.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["semantic truth"]; }
  }
];

export const spec = {
  suiteId: "action-quality-contract",
  basePackage: "examples/action-quality-contract-package.json",
  validator,
  corpusDir: "tests/fixtures/action-quality-contract",
  filePrefix: "action-quality-contract"
};
