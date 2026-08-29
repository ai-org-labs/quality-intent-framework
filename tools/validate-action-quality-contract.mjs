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
  const approvalPersistencePolicies = array(pkg, "approvalPersistencePolicies", packagePath);
  const toolGuardrailPolicies = array(pkg, "toolGuardrailPolicies", packagePath);
  const contextMemoryBoundaries = array(pkg, "contextMemoryBoundaries", packagePath);
  const containmentPolicies = array(pkg, "containmentPolicies", packagePath);
  const handoffPolicies = array(pkg, "handoffPolicies", packagePath);
  const transitions = array(pkg, "expectedStateTransitions", packagePath);
  const rollbacks = array(pkg, "rollbackPlans", packagePath);
  const evidenceRequirements = array(pkg, "evidenceRequirements", packagePath);
  const runtimeTraces = array(pkg, "runtimeTraces", packagePath);
  const traceApprovalEvidence = array(pkg, "traceApprovalEvidence", packagePath);
  const guardrailEvidence = array(pkg, "guardrailEvidence", packagePath);
  const contextMemoryEvidence = array(pkg, "contextMemoryEvidence", packagePath);
  const containmentEvidence = array(pkg, "containmentEvidence", packagePath);
  const handoffEvidence = array(pkg, "handoffEvidence", packagePath);
  const outcomes = array(pkg, "actionOutcomes", packagePath);
  const triggers = array(pkg, "governanceTriggers", packagePath);

  const contractIndex = index(contracts, `${packagePath}:actionContracts`);
  const requestIndex = index(requests, `${packagePath}:actionRequests`);
  const toolIndex = index(toolSurfaces, `${packagePath}:toolSurfaces`);
  const environmentIndex = index(environments, `${packagePath}:executionEnvironments`);
  const policyIndex = index(permissionPolicies, `${packagePath}:permissionPolicies`);
  const approvalIndex = index(approvalGates, `${packagePath}:approvalGates`);
  const persistencePolicyIndex = index(approvalPersistencePolicies, `${packagePath}:approvalPersistencePolicies`);
  const guardrailPolicyIndex = index(toolGuardrailPolicies, `${packagePath}:toolGuardrailPolicies`);
  const contextMemoryBoundaryIndex = index(contextMemoryBoundaries, `${packagePath}:contextMemoryBoundaries`);
  const containmentPolicyIndex = index(containmentPolicies, `${packagePath}:containmentPolicies`);
  const handoffPolicyIndex = index(handoffPolicies, `${packagePath}:handoffPolicies`);
  const transitionIndex = index(transitions, `${packagePath}:expectedStateTransitions`);
  const rollbackIndex = index(rollbacks, `${packagePath}:rollbackPlans`);
  const evidenceIndex = index(evidenceRequirements, `${packagePath}:evidenceRequirements`);
  const traceIndex = index(runtimeTraces, `${packagePath}:runtimeTraces`);
  const approvalEvidenceIndex = index(traceApprovalEvidence, `${packagePath}:traceApprovalEvidence`);
  const guardrailEvidenceIndex = index(guardrailEvidence, `${packagePath}:guardrailEvidence`);
  const contextMemoryEvidenceIndex = index(contextMemoryEvidence, `${packagePath}:contextMemoryEvidence`);
  const containmentEvidenceIndex = index(containmentEvidence, `${packagePath}:containmentEvidence`);
  const handoffEvidenceIndex = index(handoffEvidence, `${packagePath}:handoffEvidence`);
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

  for (const policy of approvalPersistencePolicies) {
    optionalRefs(policy.governanceTriggerRefs, triggerIndex, "governance trigger", policy.id);
    for (const field of ["persistenceMode", "decisionScope", "allowedToolIdentity", "allowedServerIdentity", "maxDuration", "expiresAt", "revocationCondition", "status"]) str(policy, field, policy.id);
    if (!Array.isArray(policy.appliesToApprovalDecisions) || policy.appliesToApprovalDecisions.length === 0) {
      errors.push(`${policy.id} appliesToApprovalDecisions must include at least one decision.`);
    }
    if (typeof policy.reuseAcrossRuns !== "boolean") {
      errors.push(`${policy.id} reuseAcrossRuns must be boolean.`);
    }
    if (typeof policy.requiresSameCanonicalInvocation !== "boolean") {
      errors.push(`${policy.id} requiresSameCanonicalInvocation must be boolean.`);
    }
    if (policy.reuseAcrossRuns && !policy.requiresSameCanonicalInvocation) {
      errors.push(`${policy.id} reuseAcrossRuns requires requiresSameCanonicalInvocation true.`);
    }
    if (policy.allowedToolIdentity === "*" || policy.allowedServerIdentity === "*") {
      errors.push(`${policy.id} approval persistence identity scope must not be wildcard.`);
    }
    if (policy.persistenceMode === "always-approve" && !policy.expiresAt) {
      errors.push(`${policy.id} always-approve persistence requires expiresAt.`);
    }
  }

  for (const policy of toolGuardrailPolicies) {
    refs([policy.toolSurfaceRef], toolIndex, "tool surface", policy.id);
    for (const field of ["guardrailStage", "guardrailType", "protectedBoundary", "triggerCondition", "tripwireBehavior", "onTripAction", "sideEffectBoundary", "status"]) str(policy, field, policy.id);
    if (typeof policy.runsBeforeToolExecution !== "boolean") {
      errors.push(`${policy.id} runsBeforeToolExecution must be boolean.`);
    }
    if (policy.guardrailStage === "pre-execution" && policy.runsBeforeToolExecution !== true) {
      errors.push(`${policy.id} pre-execution guardrail must run before tool execution.`);
    }
    if (!["allow", "rejectContent", "throwException"].includes(policy.tripwireBehavior)) {
      errors.push(`${policy.id} tripwireBehavior must be allow, rejectContent, or throwException.`);
    }
    const boundary = String(policy.sideEffectBoundary ?? "").toLowerCase();
    if (!boundary.includes("not") || !boundary.includes("undo")) {
      errors.push(`${policy.id} sideEffectBoundary must state that guardrails do not undo side effects.`);
    }
  }

  for (const boundary of contextMemoryBoundaries) {
    optionalRefs(boundary.governanceTriggerRefs, triggerIndex, "governance trigger", boundary.id);
    for (const field of ["contextKind", "visibility", "sourceTrust", "freshnessPolicy", "staleAfter", "compactionPolicy", "contaminationPolicy", "status"]) str(boundary, field, boundary.id);
    if (!Array.isArray(boundary.allowedUse) || boundary.allowedUse.length === 0) {
      errors.push(`${boundary.id} allowedUse must include at least one use.`);
    }
    if (!Array.isArray(boundary.prohibitedUse) || boundary.prohibitedUse.length === 0) {
      errors.push(`${boundary.id} prohibitedUse must include at least one use.`);
    }
    const contamination = String(boundary.contaminationPolicy ?? "").toLowerCase();
    if (boundary.visibility === "llm-visible" && !contamination.includes("instruction")) {
      errors.push(`${boundary.id} llm-visible context must explicitly handle embedded instructions.`);
    }
    if (boundary.visibility === "local-only" && String(boundary.compactionPolicy ?? "").toLowerCase().includes("llm-visible")) {
      const policyText = String(boundary.compactionPolicy ?? "").toLowerCase();
      if (!policyText.includes("not")) errors.push(`${boundary.id} local-only context must not be compacted into LLM-visible history.`);
    }
  }

  for (const policy of containmentPolicies) {
    refs([policy.toolSurfaceRef], toolIndex, "tool surface", policy.id);
    refs([policy.executionEnvironmentRef], environmentIndex, "execution environment", policy.id);
    optionalRefs(policy.governanceTriggerRefs, triggerIndex, "governance trigger", policy.id);
    for (const field of ["containmentScope", "safeExitCriteria", "incidentResponsePlan", "shutdownAuthority", "restartAuthority", "status"]) str(policy, field, policy.id);
    if (!Array.isArray(policy.allowedExternalCommunication)) {
      errors.push(`${policy.id} allowedExternalCommunication must be an array.`);
    }
    if (!Array.isArray(policy.prohibitedExternalCommunication) || policy.prohibitedExternalCommunication.length === 0) {
      errors.push(`${policy.id} prohibitedExternalCommunication must include at least one communication boundary.`);
    }
    if (!Array.isArray(policy.monitoringSignals) || policy.monitoringSignals.length === 0) {
      errors.push(`${policy.id} monitoringSignals must include at least one signal.`);
    }
    const safeExit = String(policy.safeExitCriteria ?? "").toLowerCase();
    if (!safeExit.includes("stop") && !safeExit.includes("pause")) {
      errors.push(`${policy.id} safeExitCriteria must include stop or pause behavior.`);
    }
    const incidentPlan = String(policy.incidentResponsePlan ?? "").toLowerCase();
    if (!incidentPlan.includes("governance")) {
      errors.push(`${policy.id} incidentResponsePlan must route incidents to governance.`);
    }
  }

  for (const policy of handoffPolicies) {
    refs([policy.toolSurfaceRef], toolIndex, "tool surface", policy.id);
    optionalRefs(policy.governanceTriggerRefs, triggerIndex, "governance trigger", policy.id);
    for (const field of ["sourceAgentRole", "targetAgentRole", "authorityScope", "authorizationPoint", "handoffInputFilter", "contextTransferPolicy", "approvalRequirement", "status"]) str(policy, field, policy.id);
    if (!Array.isArray(policy.prohibitedDelegations) || policy.prohibitedDelegations.length === 0) {
      errors.push(`${policy.id} prohibitedDelegations must include at least one delegation boundary.`);
    }
    if (!Array.isArray(policy.requiredLifecycleEvents) || policy.requiredLifecycleEvents.length === 0) {
      errors.push(`${policy.id} requiredLifecycleEvents must include at least one event.`);
    }
    const authorizationPoint = String(policy.authorizationPoint ?? "").toLowerCase();
    if (!authorizationPoint.includes("before")) {
      errors.push(`${policy.id} authorizationPoint must require authorization before delegated side effects.`);
    }
    const transferPolicy = String(policy.contextTransferPolicy ?? "").toLowerCase();
    if (!transferPolicy.includes("filter")) {
      errors.push(`${policy.id} contextTransferPolicy must require filtered handoff context.`);
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
    optionalRefs(contract.containmentPolicyRefs, containmentPolicyIndex, "containment policy", contract.id);
    optionalRefs(contract.handoffPolicyRefs, handoffPolicyIndex, "handoff policy", contract.id);
    for (const field of ["qualityIntentRef", "lossBoundary", "riskClass", "status"]) str(contract, field, contract.id);
    const policy = policyIndex.get(contract.permissionPolicyRef);
    const needsApproval = contract.riskClass === "high" || ["write", "delete", "publish", "external-call"].includes(policy?.permissionClass);
    if (needsApproval && (!Array.isArray(contract.approvalGateRefs) || contract.approvalGateRefs.length === 0)) {
      errors.push(`${contract.id} high-risk or write-like action contract requires approvalGateRefs.`);
    }
    if (needsApproval && (!Array.isArray(contract.containmentPolicyRefs) || contract.containmentPolicyRefs.length === 0)) {
      errors.push(`${contract.id} high-risk or write-like action contract requires containmentPolicyRefs.`);
    }
    if (needsApproval && (!Array.isArray(contract.handoffPolicyRefs) || contract.handoffPolicyRefs.length === 0)) {
      errors.push(`${contract.id} high-risk or write-like action contract requires handoffPolicyRefs.`);
    }
  }

  const containmentEvidenceByRequest = new Map();
  for (const evidence of containmentEvidence) {
    refs([evidence.actionRequestRef], requestIndex, "action request", evidence.id);
    refs([evidence.runtimeTraceRef], traceIndex, "runtime trace", evidence.id);
    refs([evidence.containmentPolicyRef], containmentPolicyIndex, "containment policy", evidence.id);
    optionalRefs(evidence.governanceTriggerRefs, triggerIndex, "governance trigger", evidence.id);
    for (const field of ["monitoringObserved", "externalCommunicationObserved", "safeExitAssessment", "incidentStatus", "evidenceSummary", "status"]) str(evidence, field, evidence.id);
    for (const field of ["containmentMaintained", "unauthorizedExternalCommunication", "safeExitTriggered", "incidentResponseOpened"]) {
      if (typeof evidence[field] !== "boolean") errors.push(`${evidence.id} ${field} must be boolean.`);
    }
    const request = requestIndex.get(evidence.actionRequestRef);
    const trace = traceIndex.get(evidence.runtimeTraceRef);
    if (request && trace && trace.actionRequestRef !== request.id) {
      errors.push(`${evidence.id} runtimeTraceRef must belong to its actionRequestRef.`);
    }
    if (evidence.containmentMaintained === false && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} containment breach requires governanceTriggerRefs.`);
    }
    if (evidence.unauthorizedExternalCommunication && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} unauthorized external communication requires governanceTriggerRefs.`);
    }
    if (evidence.safeExitTriggered && !evidence.incidentResponseOpened) {
      errors.push(`${evidence.id} safe-exit trigger requires incidentResponseOpened true.`);
    }
    if (!containmentEvidenceByRequest.has(evidence.actionRequestRef)) containmentEvidenceByRequest.set(evidence.actionRequestRef, []);
    containmentEvidenceByRequest.get(evidence.actionRequestRef).push(evidence);
  }

  const handoffEvidenceByRequest = new Map();
  for (const evidence of handoffEvidence) {
    refs([evidence.actionRequestRef], requestIndex, "action request", evidence.id);
    refs([evidence.runtimeTraceRef], traceIndex, "runtime trace", evidence.id);
    refs([evidence.handoffPolicyRef], handoffPolicyIndex, "handoff policy", evidence.id);
    optionalRefs(evidence.governanceTriggerRefs, triggerIndex, "governance trigger", evidence.id);
    for (const field of ["selectedTargetAgent", "authorizationResult", "transferredContextSummary", "evidenceSummary", "status"]) str(evidence, field, evidence.id);
    for (const field of ["authorizationChecked", "contextFilterApplied", "authorityScopeRespected", "prohibitedDelegationAttempted"]) {
      if (typeof evidence[field] !== "boolean") errors.push(`${evidence.id} ${field} must be boolean.`);
    }
    if (!Array.isArray(evidence.lifecycleEventRefs) || evidence.lifecycleEventRefs.length === 0) {
      errors.push(`${evidence.id} lifecycleEventRefs must include at least one event.`);
    }
    const request = requestIndex.get(evidence.actionRequestRef);
    const trace = traceIndex.get(evidence.runtimeTraceRef);
    if (request && trace && trace.actionRequestRef !== request.id) {
      errors.push(`${evidence.id} runtimeTraceRef must belong to its actionRequestRef.`);
    }
    if (!evidence.authorizationChecked) {
      errors.push(`${evidence.id} authorizationChecked must be true for handoff evidence.`);
    }
    if (["denied", "failed", "unauthorized"].includes(evidence.authorizationResult) && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} denied or failed handoff authorization requires governanceTriggerRefs.`);
    }
    if (!evidence.authorityScopeRespected && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} handoff authority scope breach requires governanceTriggerRefs.`);
    }
    if (evidence.prohibitedDelegationAttempted && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} prohibited delegation attempt requires governanceTriggerRefs.`);
    }
    if (!handoffEvidenceByRequest.has(evidence.actionRequestRef)) handoffEvidenceByRequest.set(evidence.actionRequestRef, []);
    handoffEvidenceByRequest.get(evidence.actionRequestRef).push(evidence);
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
    if (typeof evidence.persistenceApplied !== "boolean") {
      errors.push(`${evidence.id} persistenceApplied must be boolean.`);
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
    if (evidence.persistenceApplied) {
      refs([evidence.approvalPersistencePolicyRef], persistencePolicyIndex, "approval persistence policy", evidence.id);
      const persistencePolicy = persistencePolicyIndex.get(evidence.approvalPersistencePolicyRef);
      if (persistencePolicy && !persistencePolicy.appliesToApprovalDecisions.includes(evidence.approvalDecision)) {
        errors.push(`${evidence.id} approvalDecision must be allowed by its approval persistence policy.`);
      }
      if (persistencePolicy?.requiresSameCanonicalInvocation && !evidence.boundToOriginalInvocation) {
        errors.push(`${evidence.id} persistence policy requires boundToOriginalInvocation.`);
      }
    }
    if (trace?.containsSensitiveData && evidence.redactionStatus !== "redacted") {
      errors.push(`${evidence.id} approval evidence for sensitive trace data requires redactionStatus redacted.`);
    }
    if (!approvalEvidenceByRequest.has(evidence.actionRequestRef)) approvalEvidenceByRequest.set(evidence.actionRequestRef, []);
    approvalEvidenceByRequest.get(evidence.actionRequestRef).push(evidence);
  }

  const guardrailEvidenceByRequest = new Map();
  for (const evidence of guardrailEvidence) {
    refs([evidence.actionRequestRef], requestIndex, "action request", evidence.id);
    refs([evidence.runtimeTraceRef], traceIndex, "runtime trace", evidence.id);
    refs([evidence.toolGuardrailPolicyRef], guardrailPolicyIndex, "tool guardrail policy", evidence.id);
    optionalRefs(evidence.governanceTriggerRefs, triggerIndex, "governance trigger", evidence.id);
    for (const field of ["guardrailStage", "evaluatedInputRef", "result", "evidenceSummary", "status"]) str(evidence, field, evidence.id);
    if (typeof evidence.executionOrder !== "number" || evidence.executionOrder < 1) {
      errors.push(`${evidence.id} executionOrder must be a positive number.`);
    }
    if (typeof evidence.tripwireTriggered !== "boolean") {
      errors.push(`${evidence.id} tripwireTriggered must be boolean.`);
    }
    if (typeof evidence.sideEffectBoundaryAcknowledged !== "boolean") {
      errors.push(`${evidence.id} sideEffectBoundaryAcknowledged must be boolean.`);
    }
    const request = requestIndex.get(evidence.actionRequestRef);
    const trace = traceIndex.get(evidence.runtimeTraceRef);
    const policy = guardrailPolicyIndex.get(evidence.toolGuardrailPolicyRef);
    if (request && trace && trace.actionRequestRef !== request.id) {
      errors.push(`${evidence.id} runtimeTraceRef must belong to its actionRequestRef.`);
    }
    if (policy && evidence.guardrailStage !== policy.guardrailStage) {
      errors.push(`${evidence.id} guardrailStage must match its tool guardrail policy.`);
    }
    if (policy?.guardrailStage === "post-execution" && !evidence.sideEffectBoundaryAcknowledged) {
      errors.push(`${evidence.id} post-execution guardrail evidence must acknowledge side effect boundary.`);
    }
    if (evidence.tripwireTriggered && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} tripwire-triggered guardrail evidence requires governanceTriggerRefs.`);
    }
    if (!guardrailEvidenceByRequest.has(evidence.actionRequestRef)) guardrailEvidenceByRequest.set(evidence.actionRequestRef, []);
    guardrailEvidenceByRequest.get(evidence.actionRequestRef).push(evidence);
  }

  const contextMemoryEvidenceByRequest = new Map();
  for (const evidence of contextMemoryEvidence) {
    refs([evidence.actionRequestRef], requestIndex, "action request", evidence.id);
    refs([evidence.runtimeTraceRef], traceIndex, "runtime trace", evidence.id);
    refs([evidence.contextMemoryBoundaryRef], contextMemoryBoundaryIndex, "context memory boundary", evidence.id);
    optionalRefs(evidence.governanceTriggerRefs, triggerIndex, "governance trigger", evidence.id);
    for (const field of ["observedContextRef", "freshnessStatus", "trustStatus", "evidenceSummary", "status"]) str(evidence, field, evidence.id);
    for (const field of ["usedInDecision", "contaminationChecked", "compactionApplied"]) {
      if (typeof evidence[field] !== "boolean") errors.push(`${evidence.id} ${field} must be boolean.`);
    }
    const request = requestIndex.get(evidence.actionRequestRef);
    const trace = traceIndex.get(evidence.runtimeTraceRef);
    const boundary = contextMemoryBoundaryIndex.get(evidence.contextMemoryBoundaryRef);
    if (request && trace && trace.actionRequestRef !== request.id) {
      errors.push(`${evidence.id} runtimeTraceRef must belong to its actionRequestRef.`);
    }
    if (boundary?.visibility === "llm-visible" && evidence.contaminationChecked !== true) {
      errors.push(`${evidence.id} llm-visible context evidence requires contaminationChecked true.`);
    }
    if (evidence.freshnessStatus !== "current" && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} non-current context memory evidence requires governanceTriggerRefs.`);
    }
    if (evidence.trustStatus === "untrusted" && evidence.usedInDecision && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} untrusted context used in decision requires governanceTriggerRefs.`);
    }
    if (!contextMemoryEvidenceByRequest.has(evidence.actionRequestRef)) contextMemoryEvidenceByRequest.set(evidence.actionRequestRef, []);
    contextMemoryEvidenceByRequest.get(evidence.actionRequestRef).push(evidence);
  }

  for (const request of requests) {
    const contract = contractIndex.get(request.actionContractRef);
    if (contract && Array.isArray(contract.approvalGateRefs) && contract.approvalGateRefs.length > 0) {
      const matches = approvalEvidenceByRequest.get(request.id) ?? [];
      if (matches.length === 0) errors.push(`${request.id} approval-gated request requires traceApprovalEvidence.`);
    }
    const permission = contract ? policyIndex.get(contract.permissionPolicyRef) : null;
    const needsGuardrails = contract?.riskClass === "high" || ["write", "delete", "publish", "external-call"].includes(permission?.permissionClass);
    if (needsGuardrails) {
      const matchingGuardrails = guardrailEvidenceByRequest.get(request.id) ?? [];
      if (!matchingGuardrails.some((evidence) => evidence.guardrailStage === "pre-execution")) {
        errors.push(`${request.id} high-risk or write-like request requires pre-execution guardrailEvidence.`);
      }
      if (!matchingGuardrails.some((evidence) => evidence.guardrailStage === "post-execution")) {
        errors.push(`${request.id} high-risk or write-like request requires post-execution guardrailEvidence.`);
      }
      const matchingContextMemory = contextMemoryEvidenceByRequest.get(request.id) ?? [];
      if (matchingContextMemory.length === 0) {
        errors.push(`${request.id} high-risk or write-like request requires contextMemoryEvidence.`);
      }
      const matchingContainment = containmentEvidenceByRequest.get(request.id) ?? [];
      if (matchingContainment.length === 0) {
        errors.push(`${request.id} high-risk or write-like request requires containmentEvidence.`);
      }
      const matchingHandoff = handoffEvidenceByRequest.get(request.id) ?? [];
      if (matchingHandoff.length === 0) {
        errors.push(`${request.id} high-risk or write-like request requires handoffEvidence.`);
      }
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
    const guardrails = guardrailEvidenceByRequest.get(outcome.actionRequestRef) ?? [];
    if (outcome.verdict === "accepted" && guardrails.some((evidence) => evidence.tripwireTriggered || evidence.result !== "allow")) {
      errors.push(`${outcome.id} accepted outcome must not have tripped or rejected guardrail evidence.`);
    }
    const contextEvidence = contextMemoryEvidenceByRequest.get(outcome.actionRequestRef) ?? [];
    if (outcome.verdict === "accepted" && contextEvidence.some((evidence) => evidence.freshnessStatus !== "current" || (evidence.trustStatus === "untrusted" && evidence.usedInDecision))) {
      errors.push(`${outcome.id} accepted outcome must not rely on stale or untrusted context memory evidence.`);
    }
    const containmentResults = containmentEvidenceByRequest.get(outcome.actionRequestRef) ?? [];
    if (outcome.verdict === "accepted" && containmentResults.some((evidence) => !evidence.containmentMaintained || evidence.unauthorizedExternalCommunication || !["none", "resolved"].includes(evidence.incidentStatus))) {
      errors.push(`${outcome.id} accepted outcome must not rely on breached containment or unresolved incident evidence.`);
    }
    const handoffResults = handoffEvidenceByRequest.get(outcome.actionRequestRef) ?? [];
    if (outcome.verdict === "accepted" && handoffResults.some((evidence) => !evidence.authorizationChecked || !["authorized", "not-applicable"].includes(evidence.authorizationResult) || !evidence.contextFilterApplied || !evidence.authorityScopeRespected || evidence.prohibitedDelegationAttempted)) {
      errors.push(`${outcome.id} accepted outcome must not rely on unauthorized, unfiltered, or out-of-scope handoff evidence.`);
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
      approvalPersistencePolicies: approvalPersistencePolicies.length,
      toolGuardrailPolicies: toolGuardrailPolicies.length,
      contextMemoryBoundaries: contextMemoryBoundaries.length,
      containmentPolicies: containmentPolicies.length,
      handoffPolicies: handoffPolicies.length,
      expectedStateTransitions: transitions.length,
      rollbackPlans: rollbacks.length,
      evidenceRequirements: evidenceRequirements.length,
      runtimeTraces: runtimeTraces.length,
      traceApprovalEvidence: traceApprovalEvidence.length,
      guardrailEvidence: guardrailEvidence.length,
      contextMemoryEvidence: contextMemoryEvidence.length,
      containmentEvidence: containmentEvidence.length,
      handoffEvidence: handoffEvidence.length,
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
