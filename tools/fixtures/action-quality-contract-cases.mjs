const validator = "tools/validate-action-quality-contract.mjs";

function contract(pkg) { return pkg.actionContracts[0]; }
function request(pkg) { return pkg.actionRequests[0]; }
function surface(pkg) { return pkg.toolSurfaces[0]; }
function environment(pkg) { return pkg.executionEnvironments[0]; }
function policy(pkg) { return pkg.permissionPolicies[0]; }
function approval(pkg) { return pkg.approvalGates[0]; }
function persistencePolicy(pkg) { return pkg.approvalPersistencePolicies[0]; }
function guardrailPolicy(pkg) { return pkg.toolGuardrailPolicies[0]; }
function postGuardrailPolicy(pkg) { return pkg.toolGuardrailPolicies[1]; }
function contextBoundary(pkg) { return pkg.contextMemoryBoundaries[0]; }
function containmentPolicy(pkg) { return pkg.containmentPolicies[0]; }
function transition(pkg) { return pkg.expectedStateTransitions[0]; }
function rollback(pkg) { return pkg.rollbackPlans[0]; }
function evidence(pkg) { return pkg.evidenceRequirements[0]; }
function trace(pkg) { return pkg.runtimeTraces[0]; }
function approvalEvidence(pkg) { return pkg.traceApprovalEvidence[0]; }
function guardrailEvidence(pkg) { return pkg.guardrailEvidence[0]; }
function postGuardrailEvidence(pkg) { return pkg.guardrailEvidence[1]; }
function contextEvidence(pkg) { return pkg.contextMemoryEvidence[0]; }
function containmentEvidence(pkg) { return pkg.containmentEvidence[0]; }
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
    id: "tool-guardrail-policies-array",
    rule: "tool guardrail policies are retained",
    expect: "toolGuardrailPolicies must be an array.",
    mutate: (pkg) => { pkg.toolGuardrailPolicies = null; }
  },
  {
    id: "tool-guardrail-policy-tool-ref-resolves",
    rule: "tool guardrail policy links tool surface",
    expect: "TGP-AQC-001 references missing tool surface: TLS-NOPE-999",
    mutate: (pkg) => { guardrailPolicy(pkg).toolSurfaceRef = "TLS-NOPE-999"; }
  },
  {
    id: "pre-guardrail-runs-before-tool",
    rule: "pre-execution guardrail runs before tool execution",
    expect: "TGP-AQC-001 pre-execution guardrail must run before tool execution.",
    mutate: (pkg) => { guardrailPolicy(pkg).runsBeforeToolExecution = false; }
  },
  {
    id: "guardrail-side-effect-boundary",
    rule: "guardrail policy states side-effect boundary",
    expect: "TGP-AQC-002 sideEffectBoundary must state that guardrails do not undo side effects.",
    mutate: (pkg) => { postGuardrailPolicy(pkg).sideEffectBoundary = "post-execution guardrails inspect output"; }
  },
  {
    id: "context-memory-boundaries-array",
    rule: "context memory boundaries are retained",
    expect: "contextMemoryBoundaries must be an array.",
    mutate: (pkg) => { pkg.contextMemoryBoundaries = null; }
  },
  {
    id: "context-memory-boundary-allowed-use",
    rule: "context memory boundary declares allowed use",
    expect: "CMB-AQC-001 allowedUse must include at least one use.",
    mutate: (pkg) => { contextBoundary(pkg).allowedUse = []; }
  },
  {
    id: "llm-visible-context-handles-instructions",
    rule: "llm-visible context handles embedded instructions",
    expect: "CMB-AQC-001 llm-visible context must explicitly handle embedded instructions.",
    mutate: (pkg) => { contextBoundary(pkg).contaminationPolicy = "treat remembered content as source context"; }
  },
  {
    id: "containment-policies-array",
    rule: "containment policies are retained",
    expect: "containmentPolicies must be an array.",
    mutate: (pkg) => { pkg.containmentPolicies = null; }
  },
  {
    id: "containment-policy-tool-ref-resolves",
    rule: "containment policy links tool surface",
    expect: "CTP-AQC-001 references missing tool surface: TLS-NOPE-999",
    mutate: (pkg) => { containmentPolicy(pkg).toolSurfaceRef = "TLS-NOPE-999"; }
  },
  {
    id: "containment-policy-monitoring-signals",
    rule: "containment policy declares monitoring signals",
    expect: "CTP-AQC-001 monitoringSignals must include at least one signal.",
    mutate: (pkg) => { containmentPolicy(pkg).monitoringSignals = []; }
  },
  {
    id: "containment-policy-safe-exit-behavior",
    rule: "containment policy defines safe exit behavior",
    expect: "CTP-AQC-001 safeExitCriteria must include stop or pause behavior.",
    mutate: (pkg) => { containmentPolicy(pkg).safeExitCriteria = "continue and inspect later"; }
  },
  {
    id: "containment-policy-governance-route",
    rule: "containment incidents route to governance",
    expect: "CTP-AQC-001 incidentResponsePlan must route incidents to governance.",
    mutate: (pkg) => { containmentPolicy(pkg).incidentResponsePlan = "notify runtime operator only"; }
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
    id: "high-risk-contract-needs-containment",
    rule: "high-risk write action requires containment policy",
    expect: "ACT-AQC-001 high-risk or write-like action contract requires containmentPolicyRefs.",
    mutate: (pkg) => { contract(pkg).containmentPolicyRefs = []; }
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
    id: "guardrail-evidence-array",
    rule: "guardrail evidence is retained",
    expect: "guardrailEvidence must be an array.",
    mutate: (pkg) => { pkg.guardrailEvidence = null; }
  },
  {
    id: "context-memory-evidence-array",
    rule: "context memory evidence is retained",
    expect: "contextMemoryEvidence must be an array.",
    mutate: (pkg) => { pkg.contextMemoryEvidence = null; }
  },
  {
    id: "high-risk-request-needs-context-memory",
    rule: "high-risk request has context memory evidence",
    expect: "AQR-AQC-001 high-risk or write-like request requires contextMemoryEvidence.",
    mutate: (pkg) => { pkg.contextMemoryEvidence = []; }
  },
  {
    id: "containment-evidence-array",
    rule: "containment evidence is retained",
    expect: "containmentEvidence must be an array.",
    mutate: (pkg) => { pkg.containmentEvidence = null; }
  },
  {
    id: "high-risk-request-needs-containment-evidence",
    rule: "high-risk request has containment evidence",
    expect: "AQR-AQC-001 high-risk or write-like request requires containmentEvidence.",
    mutate: (pkg) => { pkg.containmentEvidence = []; }
  },
  {
    id: "containment-evidence-policy-ref-resolves",
    rule: "containment evidence links policy",
    expect: "CTE-AQC-001 references missing containment policy: CTP-NOPE-999",
    mutate: (pkg) => { containmentEvidence(pkg).containmentPolicyRef = "CTP-NOPE-999"; }
  },
  {
    id: "containment-breach-governance",
    rule: "containment breach routes to governance",
    expect: "CTE-AQC-001 containment breach requires governanceTriggerRefs.",
    mutate: (pkg) => { containmentEvidence(pkg).containmentMaintained = false; }
  },
  {
    id: "unauthorized-external-communication-governance",
    rule: "unauthorized external communication routes to governance",
    expect: "CTE-AQC-001 unauthorized external communication requires governanceTriggerRefs.",
    mutate: (pkg) => { containmentEvidence(pkg).unauthorizedExternalCommunication = true; }
  },
  {
    id: "safe-exit-trigger-opens-incident",
    rule: "safe-exit trigger opens incident response",
    expect: "CTE-AQC-001 safe-exit trigger requires incidentResponseOpened true.",
    mutate: (pkg) => { containmentEvidence(pkg).safeExitTriggered = true; }
  },
  {
    id: "accepted-outcome-no-containment-breach",
    rule: "accepted outcome has no containment breach or unresolved incident",
    expect: "AOC-AQC-001 accepted outcome must not rely on breached containment or unresolved incident evidence.",
    mutate: (pkg) => {
      pkg.governanceTriggers.push({
        id: "GTR-AQC-CONTAINMENT",
        triggerType: "containment-breach",
        reason: "Fixture mutation marks containment as breached.",
        severity: "high",
        requiredAction: "stop action and review containment evidence before acceptance",
        owner: "repository maintainer",
        status: "open"
      });
      containmentEvidence(pkg).containmentMaintained = false;
      containmentEvidence(pkg).incidentStatus = "open";
      containmentEvidence(pkg).governanceTriggerRefs = ["GTR-AQC-CONTAINMENT"];
    }
  },
  {
    id: "context-memory-evidence-boundary-ref-resolves",
    rule: "context memory evidence links boundary",
    expect: "CME-AQC-001 references missing context memory boundary: CMB-NOPE-999",
    mutate: (pkg) => { contextEvidence(pkg).contextMemoryBoundaryRef = "CMB-NOPE-999"; }
  },
  {
    id: "llm-visible-context-contamination-checked",
    rule: "llm-visible context evidence checks contamination",
    expect: "CME-AQC-001 llm-visible context evidence requires contaminationChecked true.",
    mutate: (pkg) => { contextEvidence(pkg).contaminationChecked = false; }
  },
  {
    id: "stale-context-governance",
    rule: "stale context memory evidence routes to governance",
    expect: "CME-AQC-001 non-current context memory evidence requires governanceTriggerRefs.",
    mutate: (pkg) => { contextEvidence(pkg).freshnessStatus = "stale"; }
  },
  {
    id: "untrusted-context-used-governance",
    rule: "untrusted context used in decision routes to governance",
    expect: "CME-AQC-001 untrusted context used in decision requires governanceTriggerRefs.",
    mutate: (pkg) => { contextEvidence(pkg).trustStatus = "untrusted"; }
  },
  {
    id: "accepted-outcome-no-stale-context",
    rule: "accepted outcome does not rely on stale context",
    expect: "AOC-AQC-001 accepted outcome must not rely on stale or untrusted context memory evidence.",
    mutate: (pkg) => {
      pkg.governanceTriggers.push({
        id: "GTR-AQC-CONTEXT",
        triggerType: "stale-context",
        reason: "Fixture mutation marks context stale.",
        severity: "medium",
        requiredAction: "review context memory before acceptance",
        owner: "repository maintainer",
        status: "open"
      });
      contextEvidence(pkg).freshnessStatus = "stale";
      contextEvidence(pkg).governanceTriggerRefs = ["GTR-AQC-CONTEXT"];
    }
  },
  {
    id: "high-risk-request-needs-pre-guardrail",
    rule: "high-risk request has pre-execution guardrail evidence",
    expect: "AQR-AQC-001 high-risk or write-like request requires pre-execution guardrailEvidence.",
    mutate: (pkg) => { pkg.guardrailEvidence = [postGuardrailEvidence(pkg)]; }
  },
  {
    id: "high-risk-request-needs-post-guardrail",
    rule: "high-risk request has post-execution guardrail evidence",
    expect: "AQR-AQC-001 high-risk or write-like request requires post-execution guardrailEvidence.",
    mutate: (pkg) => { pkg.guardrailEvidence = [guardrailEvidence(pkg)]; }
  },
  {
    id: "guardrail-evidence-policy-ref-resolves",
    rule: "guardrail evidence links policy",
    expect: "GRE-AQC-001 references missing tool guardrail policy: TGP-NOPE-999",
    mutate: (pkg) => { guardrailEvidence(pkg).toolGuardrailPolicyRef = "TGP-NOPE-999"; }
  },
  {
    id: "guardrail-evidence-stage-matches-policy",
    rule: "guardrail evidence stage matches policy",
    expect: "GRE-AQC-001 guardrailStage must match its tool guardrail policy.",
    mutate: (pkg) => { guardrailEvidence(pkg).guardrailStage = "post-execution"; }
  },
  {
    id: "post-guardrail-acknowledges-side-effect-boundary",
    rule: "post-execution guardrail evidence acknowledges side-effect boundary",
    expect: "GRE-AQC-002 post-execution guardrail evidence must acknowledge side effect boundary.",
    mutate: (pkg) => { postGuardrailEvidence(pkg).sideEffectBoundaryAcknowledged = false; }
  },
  {
    id: "tripwire-guardrail-governance",
    rule: "tripwire-triggered guardrail evidence routes to governance",
    expect: "GRE-AQC-001 tripwire-triggered guardrail evidence requires governanceTriggerRefs.",
    mutate: (pkg) => { guardrailEvidence(pkg).tripwireTriggered = true; }
  },
  {
    id: "accepted-outcome-no-rejected-guardrail",
    rule: "accepted outcome has no tripped or rejected guardrail",
    expect: "AOC-AQC-001 accepted outcome must not have tripped or rejected guardrail evidence.",
    mutate: (pkg) => { postGuardrailEvidence(pkg).result = "rejectContent"; }
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
