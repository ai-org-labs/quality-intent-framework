#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/action-quality-contract-package.json"];
const inputs = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultPackages;
const errors = [];
const results = [];

function readJson(filePath, owner) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${owner} cannot read JSON at ${filePath}: ${error.message}`);
    return null;
  }
}

function array(pkg, key, owner = "package") {
  if (!Array.isArray(pkg[key])) {
    errors.push(`${owner} ${key} must be an array.`);
    return [];
  }
  return pkg[key];
}

function str(item, field, owner) {
  if (typeof item[field] !== "string" || item[field].trim() === "") {
    errors.push(`${owner} must include non-empty string ${field}.`);
  }
}

function score(value, field, owner) {
  if (typeof value !== "number" || value < 0 || value > 1) {
    errors.push(`${owner} ${field} must be a number from 0 to 1.`);
  }
}

function index(items, label) {
  const map = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object") {
      errors.push(`${label} contains a non-object item.`);
      continue;
    }
    if (typeof item.id !== "string" || item.id.trim() === "") {
      errors.push(`${label} item is missing string id.`);
      continue;
    }
    if (map.has(item.id)) errors.push(`Duplicate id ${item.id} in ${label}.`);
    map.set(item.id, item);
  }
  return map;
}

function refs(refs, map, label, owner) {
  if (!Array.isArray(refs) || refs.length === 0) {
    errors.push(`${owner} must include at least one ${label}.`);
    return;
  }
  for (const ref of refs) {
    if (!map.has(ref)) errors.push(`${owner} references missing ${label}: ${ref}`);
  }
}

function optionalRefs(refsValue, map, label, owner) {
  if (refsValue === undefined) return;
  if (!Array.isArray(refsValue)) {
    errors.push(`${owner} ${label} refs must be an array.`);
    return;
  }
  for (const ref of refsValue) {
    if (!map.has(ref)) errors.push(`${owner} references missing ${label}: ${ref}`);
  }
}

function validate(pkg, packagePath) {
  if (pkg.packageType !== "action-quality-contract") {
    errors.push(`${packagePath} must have packageType action-quality-contract.`);
  }
  str(pkg, "runtimeVersion", packagePath);
  str(pkg, "packageId", packagePath);

  const contracts = array(pkg, "actionContracts", packagePath);
  const requests = array(pkg, "actionRequests", packagePath);
  const toolSurfaces = array(pkg, "toolSurfaces", packagePath);
  const environments = array(pkg, "executionEnvironments", packagePath);
  const permissionPolicies = array(pkg, "permissionPolicies", packagePath);
  const approvalGates = array(pkg, "approvalGates", packagePath);
  const transitions = array(pkg, "expectedStateTransitions", packagePath);
  const rollbacks = array(pkg, "rollbackPlans", packagePath);
  const evidenceRequirements = array(pkg, "evidenceRequirements", packagePath);
  const runtimeTraces = array(pkg, "runtimeTraces", packagePath);
  const traceApprovalEvidence = array(pkg, "traceApprovalEvidence", packagePath);
  const outcomes = array(pkg, "actionOutcomes", packagePath);
  const triggers = array(pkg, "governanceTriggers", packagePath);

  const contractIndex = index(contracts, `${packagePath}:actionContracts`);
  const requestIndex = index(requests, `${packagePath}:actionRequests`);
  const toolIndex = index(toolSurfaces, `${packagePath}:toolSurfaces`);
  const environmentIndex = index(environments, `${packagePath}:executionEnvironments`);
  const policyIndex = index(permissionPolicies, `${packagePath}:permissionPolicies`);
  const approvalIndex = index(approvalGates, `${packagePath}:approvalGates`);
  const transitionIndex = index(transitions, `${packagePath}:expectedStateTransitions`);
  const rollbackIndex = index(rollbacks, `${packagePath}:rollbackPlans`);
  const evidenceIndex = index(evidenceRequirements, `${packagePath}:evidenceRequirements`);
  const traceIndex = index(runtimeTraces, `${packagePath}:runtimeTraces`);
  const approvalEvidenceIndex = index(traceApprovalEvidence, `${packagePath}:traceApprovalEvidence`);
  const outcomeIndex = index(outcomes, `${packagePath}:actionOutcomes`);
  const triggerIndex = index(triggers, `${packagePath}:governanceTriggers`);

  for (const surface of toolSurfaces) {
    for (const field of ["toolKind", "providerNeutralName", "operationClass", "status"]) str(surface, field, surface.id);
    if (!Array.isArray(surface.capabilities) || surface.capabilities.length === 0) {
      errors.push(`${surface.id} capabilities must include at least one capability.`);
    }
  }

  for (const environment of environments) {
    for (const field of ["environmentType", "isolationBoundary", "identityBoundary", "networkBoundary", "status"]) str(environment, field, environment.id);
  }

  for (const policy of permissionPolicies) {
    for (const field of ["permissionClass", "allowedScope", "approvalRequirement", "status"]) str(policy, field, policy.id);
    if (!Array.isArray(policy.prohibitedOperations)) errors.push(`${policy.id} prohibitedOperations must be an array.`);
  }

  for (const gate of approvalGates) {
    refs([gate.permissionPolicyRef], policyIndex, "permission policy", gate.id);
    for (const field of ["approver", "approvalStatus", "rationale", "status"]) str(gate, field, gate.id);
    if (gate.approvalStatus === "approved" && !gate.approvedAt) {
      errors.push(`${gate.id} approved approval gate must include approvedAt.`);
    }
  }

  for (const transition of transitions) {
    for (const field of ["targetRef", "preState", "postState", "stopCondition", "status"]) str(transition, field, transition.id);
    if (!Array.isArray(transition.invariantRefs)) errors.push(`${transition.id} invariantRefs must be an array.`);
  }

  for (const rollback of rollbacks) {
    refs([rollback.expectedStateTransitionRef], transitionIndex, "expected state transition", rollback.id);
    for (const field of ["rollbackAction", "rollbackOwner", "verificationMethod", "status"]) str(rollback, field, rollback.id);
  }

  for (const evidence of evidenceRequirements) {
    for (const field of ["evidenceType", "collectionMethod", "retentionPolicy", "status"]) str(evidence, field, evidence.id);
    if (!Array.isArray(evidence.requiredForVerdicts) || evidence.requiredForVerdicts.length === 0) {
      errors.push(`${evidence.id} requiredForVerdicts must include at least one verdict.`);
    }
  }

  for (const contract of contracts) {
    refs([contract.toolSurfaceRef], toolIndex, "tool surface", contract.id);
    refs([contract.executionEnvironmentRef], environmentIndex, "execution environment", contract.id);
    refs([contract.permissionPolicyRef], policyIndex, "permission policy", contract.id);
    refs([contract.expectedStateTransitionRef], transitionIndex, "expected state transition", contract.id);
    refs([contract.rollbackPlanRef], rollbackIndex, "rollback plan", contract.id);
    refs(contract.evidenceRequirementRefs, evidenceIndex, "evidence requirement", contract.id);
    optionalRefs(contract.approvalGateRefs, approvalIndex, "approval gate", contract.id);
    optionalRefs(contract.governanceTriggerRefs, triggerIndex, "governance trigger", contract.id);
    for (const field of ["qualityIntentRef", "lossBoundary", "riskClass", "status"]) str(contract, field, contract.id);
    const policy = policyIndex.get(contract.permissionPolicyRef);
    const needsApproval = contract.riskClass === "high" || ["write", "delete", "publish", "external-call"].includes(policy?.permissionClass);
    if (needsApproval && (!Array.isArray(contract.approvalGateRefs) || contract.approvalGateRefs.length === 0)) {
      errors.push(`${contract.id} high-risk or write-like action contract requires approvalGateRefs.`);
    }
  }

  for (const request of requests) {
    refs([request.actionContractRef], contractIndex, "action contract", request.id);
    refs([request.requestedToolSurfaceRef], toolIndex, "tool surface", request.id);
    for (const field of ["requestedBy", "targetRef", "operation", "reason", "status"]) str(request, field, request.id);
    const contract = contractIndex.get(request.actionContractRef);
    if (contract && contract.toolSurfaceRef !== request.requestedToolSurfaceRef) {
      errors.push(`${request.id} requestedToolSurfaceRef must match its action contract toolSurfaceRef.`);
    }
  }

  for (const trace of runtimeTraces) {
    refs([trace.actionRequestRef], requestIndex, "action request", trace.id);
    refs([trace.actionContractRef], contractIndex, "action contract", trace.id);
    for (const field of ["traceProvider", "traceRef", "status"]) str(trace, field, trace.id);
    if (!Array.isArray(trace.spans) || trace.spans.length === 0) {
      errors.push(`${trace.id} spans must include at least one span.`);
    }
    if (trace.containsSensitiveData !== false && trace.redactionStatus !== "redacted") {
      errors.push(`${trace.id} traces with sensitive data require redactionStatus redacted.`);
    }
  }

  const approvalEvidenceByRequest = new Map();
  for (const evidence of traceApprovalEvidence) {
    refs([evidence.actionRequestRef], requestIndex, "action request", evidence.id);
    refs([evidence.runtimeTraceRef], traceIndex, "runtime trace", evidence.id);
    optionalRefs(evidence.approvalGateRef === undefined ? undefined : [evidence.approvalGateRef], approvalIndex, "approval gate", evidence.id);
    for (const field of ["approvalDecision", "rationale", "canonicalInvocationRef", "replayStatus", "redactionStatus", "status"]) str(evidence, field, evidence.id);
    if (typeof evidence.approvalRequired !== "boolean") {
      errors.push(`${evidence.id} approvalRequired must be boolean.`);
    }
    if (typeof evidence.boundToOriginalInvocation !== "boolean") {
      errors.push(`${evidence.id} boundToOriginalInvocation must be boolean.`);
    }
    const request = requestIndex.get(evidence.actionRequestRef);
    const trace = traceIndex.get(evidence.runtimeTraceRef);
    if (request && trace && trace.actionRequestRef !== request.id) {
      errors.push(`${evidence.id} runtimeTraceRef must belong to its actionRequestRef.`);
    }
    if (evidence.approvalRequired && evidence.approvalDecision === "approved") {
      for (const field of ["approvalGateRef", "approvedBy", "decisionAt"]) str(evidence, field, evidence.id);
    }
    if (evidence.approvalRequired && evidence.approvalDecision === "not-required") {
      errors.push(`${evidence.id} approvalDecision not-required cannot be used when approvalRequired is true.`);
    }
    if (["replayed", "resumed"].includes(evidence.replayStatus) && !evidence.boundToOriginalInvocation) {
      errors.push(`${evidence.id} replayed or resumed tool call must be boundToOriginalInvocation.`);
    }
    if (trace?.containsSensitiveData && evidence.redactionStatus !== "redacted") {
      errors.push(`${evidence.id} approval evidence for sensitive trace data requires redactionStatus redacted.`);
    }
    if (!approvalEvidenceByRequest.has(evidence.actionRequestRef)) approvalEvidenceByRequest.set(evidence.actionRequestRef, []);
    approvalEvidenceByRequest.get(evidence.actionRequestRef).push(evidence);
  }

  for (const request of requests) {
    const contract = contractIndex.get(request.actionContractRef);
    if (contract && Array.isArray(contract.approvalGateRefs) && contract.approvalGateRefs.length > 0) {
      const matches = approvalEvidenceByRequest.get(request.id) ?? [];
      if (matches.length === 0) errors.push(`${request.id} approval-gated request requires traceApprovalEvidence.`);
    }
  }

  for (const outcome of outcomes) {
    refs([outcome.actionRequestRef], requestIndex, "action request", outcome.id);
    refs([outcome.actionContractRef], contractIndex, "action contract", outcome.id);
    refs([outcome.runtimeTraceRef], traceIndex, "runtime trace", outcome.id);
    refs(outcome.evidenceRequirementRefs, evidenceIndex, "evidence requirement", outcome.id);
    optionalRefs(outcome.governanceTriggerRefs, triggerIndex, "governance trigger", outcome.id);
    for (const field of ["actualState", "verdict", "residualRisk", "status"]) str(outcome, field, outcome.id);
    score(outcome.confidence, "confidence", outcome.id);
    const contract = contractIndex.get(outcome.actionContractRef);
    const transition = contract ? transitionIndex.get(contract.expectedStateTransitionRef) : null;
    if (outcome.verdict === "accepted" && transition && outcome.actualState !== transition.postState) {
      errors.push(`${outcome.id} accepted outcome actualState must equal expected postState.`);
    }
    const approvals = approvalEvidenceByRequest.get(outcome.actionRequestRef) ?? [];
    const contractNeedsApproval = contract && Array.isArray(contract.approvalGateRefs) && contract.approvalGateRefs.length > 0;
    if (outcome.verdict === "accepted" && contractNeedsApproval && !approvals.some((evidence) => evidence.approvalDecision === "approved")) {
      errors.push(`${outcome.id} accepted outcome for approval-gated contract requires approved traceApprovalEvidence.`);
    }
    if (outcome.confidence < 0.7 && (!Array.isArray(outcome.governanceTriggerRefs) || outcome.governanceTriggerRefs.length === 0)) {
      errors.push(`${outcome.id} low-confidence outcome requires governanceTriggerRefs.`);
    }
  }

  for (const trigger of triggers) {
    optionalRefs(trigger.sourceActionContractRefs, contractIndex, "action contract", trigger.id);
    optionalRefs(trigger.sourceActionOutcomeRefs, outcomeIndex, "action outcome", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) str(trigger, field, trigger.id);
  }

  const boundary = pkg.verifierBoundary;
  if (!boundary || typeof boundary !== "object") {
    errors.push(`${packagePath} must include verifierBoundary.`);
  } else {
    for (const field of ["checks", "doesNotClaim", "semanticValidityRequires"]) {
      if (!Array.isArray(boundary[field]) || boundary[field].length === 0) {
        errors.push(`${packagePath} verifierBoundary must include ${field}.`);
      }
    }
    if (!(boundary.doesNotClaim ?? []).includes("semantic truth")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming semantic truth.`);
    if (!(boundary.doesNotClaim ?? []).includes("tool execution safety")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming tool execution safety.`);
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      actionContracts: contracts.length,
      actionRequests: requests.length,
      toolSurfaces: toolSurfaces.length,
      executionEnvironments: environments.length,
      permissionPolicies: permissionPolicies.length,
      approvalGates: approvalGates.length,
      expectedStateTransitions: transitions.length,
      rollbackPlans: rollbacks.length,
      evidenceRequirements: evidenceRequirements.length,
      runtimeTraces: runtimeTraces.length,
      traceApprovalEvidence: traceApprovalEvidence.length,
      actionOutcomes: outcomes.length,
      governanceTriggers: triggers.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) validate(pkg, relativePath);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF action quality contract package validation passed.",
  packages: results,
  errors
}, null, 2));
