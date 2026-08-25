const validator = "tools/validate-action-quality-contract.mjs";

function contract(pkg) { return pkg.actionContracts[0]; }
function request(pkg) { return pkg.actionRequests[0]; }
function surface(pkg) { return pkg.toolSurfaces[0]; }
function environment(pkg) { return pkg.executionEnvironments[0]; }
function policy(pkg) { return pkg.permissionPolicies[0]; }
function approval(pkg) { return pkg.approvalGates[0]; }
function persistencePolicy(pkg) { return pkg.approvalPersistencePolicies[0]; }
function transition(pkg) { return pkg.expectedStateTransitions[0]; }
function rollback(pkg) { return pkg.rollbackPlans[0]; }
function evidence(pkg) { return pkg.evidenceRequirements[0]; }
function trace(pkg) { return pkg.runtimeTraces[0]; }
function approvalEvidence(pkg) { return pkg.traceApprovalEvidence[0]; }
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
    id: "approval-persistence-policies-array",
    rule: "approval persistence policies are retained",
    expect: "approvalPersistencePolicies must be an array.",
    mutate: (pkg) => { pkg.approvalPersistencePolicies = null; }
  },
  {
    id: "approval-persistence-decisions-required",
    rule: "approval persistence policy names allowed decisions",
    expect: "APP-AQC-001 appliesToApprovalDecisions must include at least one decision.",
    mutate: (pkg) => { persistencePolicy(pkg).appliesToApprovalDecisions = []; }
  },
  {
    id: "approval-persistence-no-wildcard-identity",
    rule: "approval persistence identity scope is bounded",
    expect: "APP-AQC-001 approval persistence identity scope must not be wildcard.",
    mutate: (pkg) => { persistencePolicy(pkg).allowedToolIdentity = "*"; }
  },
  {
    id: "approval-persistence-reuse-bound",
    rule: "cross-run approval reuse requires canonical invocation binding",
    expect: "APP-AQC-001 reuseAcrossRuns requires requiresSameCanonicalInvocation true.",
    mutate: (pkg) => {
      persistencePolicy(pkg).reuseAcrossRuns = true;
      persistencePolicy(pkg).requiresSameCanonicalInvocation = false;
    }
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
    id: "trace-approval-evidence-array",
    rule: "trace approval evidence must be retained",
    expect: "traceApprovalEvidence must be an array.",
    mutate: (pkg) => { pkg.traceApprovalEvidence = null; }
  },
  {
    id: "approval-gated-request-needs-evidence",
    rule: "approval-gated request has trace approval evidence",
    expect: "AQR-AQC-001 approval-gated request requires traceApprovalEvidence.",
    mutate: (pkg) => { pkg.traceApprovalEvidence = []; }
  },
  {
    id: "approval-evidence-trace-belongs-to-request",
    rule: "approval evidence trace belongs to the same request",
    expect: "TAE-AQC-001 runtimeTraceRef must belong to its actionRequestRef.",
    mutate: (pkg) => {
      pkg.actionRequests.push({
        id: "AQR-AQC-OTHER",
        actionContractRef: "ACT-AQC-001",
        requestedToolSurfaceRef: "TLS-AQC-001",
        requestedBy: "ai-agent",
        targetRef: "QIF repository",
        operation: "inspect package only",
        reason: "Fixture mutation for mismatched trace approval evidence.",
        status: "approved-for-execution"
      });
      approvalEvidence(pkg).actionRequestRef = "AQR-AQC-OTHER";
    }
  },
  {
    id: "approved-evidence-needs-approver",
    rule: "approved trace evidence records approver",
    expect: "TAE-AQC-001 must include non-empty string approvedBy.",
    mutate: (pkg) => { approvalEvidence(pkg).approvedBy = ""; }
  },
  {
    id: "approval-evidence-persistence-applied-boolean",
    rule: "approval evidence declares persistence application",
    expect: "TAE-AQC-001 persistenceApplied must be boolean.",
    mutate: (pkg) => { approvalEvidence(pkg).persistenceApplied = "yes"; }
  },
  {
    id: "approval-evidence-persistence-ref-resolves",
    rule: "approval evidence persistence policy resolves",
    expect: "TAE-AQC-001 references missing approval persistence policy: APP-NOPE-999",
    mutate: (pkg) => { approvalEvidence(pkg).approvalPersistencePolicyRef = "APP-NOPE-999"; }
  },
  {
    id: "approval-evidence-decision-allowed-by-policy",
    rule: "approval evidence decision is allowed by persistence policy",
    expect: "TAE-AQC-001 approvalDecision must be allowed by its approval persistence policy.",
    mutate: (pkg) => { persistencePolicy(pkg).appliesToApprovalDecisions = ["rejected"]; }
  },
  {
    id: "required-approval-cannot-be-not-required",
    rule: "required approval cannot be marked not required",
    expect: "TAE-AQC-001 approvalDecision not-required cannot be used when approvalRequired is true.",
    mutate: (pkg) => { approvalEvidence(pkg).approvalDecision = "not-required"; }
  },
  {
    id: "replayed-call-bound-to-original",
    rule: "replayed tool call is bound to original invocation",
    expect: "TAE-AQC-001 replayed or resumed tool call must be boundToOriginalInvocation.",
    mutate: (pkg) => {
      approvalEvidence(pkg).replayStatus = "replayed";
      approvalEvidence(pkg).boundToOriginalInvocation = false;
    }
  },
  {
    id: "accepted-outcome-needs-approved-evidence",
    rule: "accepted approval-gated outcome has approved evidence",
    expect: "AOC-AQC-001 accepted outcome for approval-gated contract requires approved traceApprovalEvidence.",
    mutate: (pkg) => { approvalEvidence(pkg).approvalDecision = "denied"; }
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
