#!/usr/bin/env node

import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/qif-ledger-package.json"];
const packagePaths = process.argv.slice(2);
const inputs = packagePaths.length > 0 ? packagePaths : defaultPackages;
const projectRoot = process.cwd();

const errors = [];
const warnings = [];
const results = [];

const entityCollections = [
  "missions",
  "stakeholders",
  "contexts",
  "risks",
  "knowledgeSources",
  "experts",
  "cases",
  "questionLogEntries",
  "rawExpertAnswers",
  "expertJudgments",
  "cues",
  "concerns",
  "lossBoundaries",
  "qualityIntents",
  "qualityIntentDerivations",
  "decisionPatterns",
  "applicabilityBoundaries",
  "counterexamples",
  "reproductionTests",
  "organizationalQualityCultures",
  "reviewHistoryInferences",
  "extractionSteps",
  "discoverySessions",
  "evaluationTargets",
  "applicabilityRules",
  "applicabilityDecisions",
  "confidencePolicies",
  "evidenceItems",
  "indicators",
  "governanceTriggers",
  "governanceEvents",
  "reviewRuns",
  "qualityAspects",
  "evaluationPerspectives",
  "evaluationTimingRules",
  "evaluationTimingDecisions",
  "evidenceRetentionPolicies",
  "evidenceTypeVocabulary",
  "quantitativeEvidenceRecords",
  "automatedEvaluationDetails",
  "qualityGateRules",
  "qualityGateDecisions",
  "qualityReports",
  "postReleaseReviews",
  "improvementActions",
  "traceabilityLinks",
  "worldModels",
  "conceptDefinitions",
  "domainEntities",
  "actors",
  "boundaries",
  "relationships",
  "states",
  "events",
  "invariants",
  "coordinateSystems",
  "coordinateAxes",
  "perspectives",
  "assumptions",
  "modelEvidence",
  "worldModelGapFindings",
  "resolutionActions",
  "calibrationPolicies",
  "calibrationCases",
  "expertAssessments",
  "agentAssessments",
  "findingMatches",
  "calibrationRuns",
  "reviewerJudgments",
  "reviewerDisagreements",
  "escalationResolutions",
  "incidents"
];

function readJson(filePath, owner) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${owner} cannot read JSON at ${filePath}: ${error.message}`);
    return null;
  }
}

function checkRequiredString(item, field, ownerId) {
  if (typeof item[field] !== "string" || item[field].trim() === "") {
    errors.push(`${ownerId} must include non-empty string ${field}.`);
  }
}

function requireArray(pkg, key, owner = "package") {
  if (!Array.isArray(pkg[key])) {
    errors.push(`${owner} ${key} must be an array.`);
    return [];
  }
  return pkg[key];
}

const EVIDENCE_ORIGIN_KINDS = new Set(["observed-operational", "historical-record", "simulated", "synthetic", "example"]);
const EVIDENCE_ORIGIN_STATUSES = new Set(["draft", "verified", "stale", "retired"]);

function checkEvidenceOrigins(origins, packagePath) {
  const index = indexById(origins, `${packagePath}:evidenceOrigins`);
  for (const origin of origins) {
    for (const field of ["originKind", "sourceArtifact", "observationWindow", "environment", "generatedBy", "transformationSummary", "status"]) {
      checkRequiredString(origin, field, origin.id);
    }
    if (!EVIDENCE_ORIGIN_KINDS.has(origin.originKind)) errors.push(`${origin.id} originKind is not supported.`);
    if (!Array.isArray(origin.verifiedBy) || origin.verifiedBy.length === 0 || origin.verifiedBy.some((item) => typeof item !== "string" || item.trim() === "")) {
      errors.push(`${origin.id} verifiedBy must include at least one verifier.`);
    }
    if (!EVIDENCE_ORIGIN_STATUSES.has(origin.status)) errors.push(`${origin.id} status is not supported.`);
    if (["observed-operational", "historical-record"].includes(origin.originKind) && origin.status !== "verified") {
      errors.push(`${origin.id} empirical evidence origin must have status verified.`);
    }
  }
  return index;
}

function indexById(items, label) {
  const index = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object") {
      errors.push(`${label} contains a non-object item.`);
      continue;
    }
    if (typeof item.id !== "string" || item.id.trim() === "") {
      errors.push(`${label} item is missing string id.`);
      continue;
    }
    if (index.has(item.id)) {
      errors.push(`Duplicate id ${item.id} in ${label}.`);
      continue;
    }
    index.set(item.id, item);
  }
  return index;
}

function sameSet(left, right) {
  return Array.isArray(left) && Array.isArray(right) && left.length === right.length && new Set(left).size === left.length && new Set(right).size === right.length && left.every((item) => new Set(right).has(item));
}

function canonicalJson(value) {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256(value) {
  return `sha256:${crypto.createHash("sha256").update(canonicalJson(value)).digest("hex")}`;
}

function addEntity(index, collection, item) {
  if (!item || typeof item !== "object" || typeof item.id !== "string") {
    return;
  }
  if (!index.has(collection)) {
    index.set(collection, new Map());
  }
  index.get(collection).set(item.id, item);
}

function buildEntityIndex(pkg) {
  const index = new Map();
  for (const collection of entityCollections) {
    const items = Array.isArray(pkg[collection]) ? pkg[collection] : [];
    for (const item of items) {
      addEntity(index, collection, item);
      if (collection === "postReleaseReviews" && Array.isArray(item.incidents)) {
        for (const incident of item.incidents) {
          addEntity(index, "incidents", incident);
        }
      }
    }
  }
  return index;
}

function refLabel(ref) {
  return `${ref?.packageRef ?? "missing-package"}/${ref?.entityType ?? "missing-entity-type"}/${ref?.entityRef ?? "missing-entity-ref"}`;
}

function resolveEntity(ref, packageIndex, ownerId) {
  if (!ref || typeof ref !== "object") {
    errors.push(`${ownerId} must include structured entity reference.`);
    return null;
  }
  for (const field of ["packageRef", "entityType", "entityRef"]) {
    checkRequiredString(ref, field, `${ownerId}/entityRef`);
  }
  const pkg = packageIndex.get(ref.packageRef);
  if (!pkg) {
    errors.push(`${ownerId} references missing packageRef ${ref.packageRef}.`);
    return null;
  }
  const collection = pkg.entities.get(ref.entityType);
  if (!collection) {
    errors.push(`${ownerId} references unsupported entityType ${ref.entityType} in package ${ref.packageRef}.`);
    return null;
  }
  const item = collection.get(ref.entityRef);
  if (!item) {
    errors.push(`${ownerId} references missing entity ${refLabel(ref)}.`);
    return null;
  }
  return item;
}

function validateLedgerPackage(pkg, packagePath) {
  if (pkg.packageType !== "qif-ledger") {
    errors.push(`${packagePath} must have packageType qif-ledger.`);
  }
  checkRequiredString(pkg, "runtimeVersion", packagePath);
  checkRequiredString(pkg, "packageId", packagePath);

  const packageRefs = requireArray(pkg, "packageRefs", packagePath);
  const crossPackageRefs = requireArray(pkg, "crossPackageRefs", packagePath);
  const lifecycleRecords = requireArray(pkg, "qualityIntentLifecycleRecords", packagePath);
  const missedIntentRecords = requireArray(pkg, "missedIntentRecords", packagePath);
  const agentTrials = requireArray(pkg, "agentTrials", packagePath);
  const evidenceOrigins = requireArray(pkg, "evidenceOrigins", packagePath);
  const agentOutcomes = requireArray(pkg, "agentOutcomes", packagePath);
  const judgmentMemoryPolicies = requireArray(pkg, "judgmentMemoryPolicies", packagePath);
  const judgmentMemoryGovernanceTriggers = requireArray(pkg, "judgmentMemoryGovernanceTriggers", packagePath);
  const judgmentMemoryEntries = requireArray(pkg, "judgmentMemoryEntries", packagePath);
  const judgmentMemoryDependencies = requireArray(pkg, "judgmentMemoryDependencies", packagePath);
  const judgmentMemoryRevisions = requireArray(pkg, "judgmentMemoryRevisions", packagePath);
  const judgmentRetirementDecisions = requireArray(pkg, "judgmentRetirementDecisions", packagePath);
  const multiAgentJudgmentJoins = requireArray(pkg, "multiAgentJudgmentJoins", packagePath);
  const judgmentMemoryAssessments = requireArray(pkg, "judgmentMemoryAssessments", packagePath);
  const portableKnowledgeImportPolicies = requireArray(pkg, "portableKnowledgeImportPolicies", packagePath);
  const portableKnowledgeGovernanceTriggers = requireArray(pkg, "portableKnowledgeGovernanceTriggers", packagePath);
  const portableKnowledgeLibraries = requireArray(pkg, "portableKnowledgeLibraries", packagePath);
  const portableKnowledgeItems = requireArray(pkg, "portableKnowledgeItems", packagePath);
  const portableKnowledgeImportDecisions = requireArray(pkg, "portableKnowledgeImportDecisions", packagePath);
  const portableKnowledgeAssessments = requireArray(pkg, "portableKnowledgeAssessments", packagePath);
  const portableKnowledgeLocalValidationPolicies = requireArray(pkg, "portableKnowledgeLocalValidationPolicies", packagePath);
  const portableKnowledgeApplicabilityDecisions = requireArray(pkg, "portableKnowledgeApplicabilityDecisions", packagePath);
  const portableKnowledgeReproductionTrials = requireArray(pkg, "portableKnowledgeReproductionTrials", packagePath);
  const portableKnowledgeLocalValidationAssessments = requireArray(pkg, "portableKnowledgeLocalValidationAssessments", packagePath);
  const portableKnowledgeRevocationPolicies = requireArray(pkg, "portableKnowledgeRevocationPolicies", packagePath);
  const portableKnowledgeRevocationNotices = requireArray(pkg, "portableKnowledgeRevocationNotices", packagePath);
  const portableKnowledgeDependencyEdges = requireArray(pkg, "portableKnowledgeDependencyEdges", packagePath);
  const portableKnowledgeRevocationImpactAssessments = requireArray(pkg, "portableKnowledgeRevocationImpactAssessments", packagePath);
  const portableKnowledgeRevalidationDecisions = requireArray(pkg, "portableKnowledgeRevalidationDecisions", packagePath);
  const portableKnowledgeTrustPolicies = requireArray(pkg, "portableKnowledgeTrustPolicies", packagePath);
  const portableKnowledgeAttestations = requireArray(pkg, "portableKnowledgeAttestations", packagePath);
  const portableKnowledgeTrustDecisions = requireArray(pkg, "portableKnowledgeTrustDecisions", packagePath);
  const portableKnowledgeTrustReplays = requireArray(pkg, "portableKnowledgeTrustReplays", packagePath);
  const portableKnowledgeRolloutItemPreviews = requireArray(pkg, "portableKnowledgeRolloutItemPreviews", packagePath);
  const portableKnowledgeRolloutPreviews = requireArray(pkg, "portableKnowledgeRolloutPreviews", packagePath);
  const portableKnowledgeActivationDecisions = requireArray(pkg, "portableKnowledgeActivationDecisions", packagePath);
  const portableKnowledgePolicyObservations = requireArray(pkg, "portableKnowledgePolicyObservations", packagePath);
  const portableKnowledgeRollbackRecords = requireArray(pkg, "portableKnowledgeRollbackRecords", packagePath);
  const portableKnowledgeExecutionReconciliations = requireArray(pkg, "portableKnowledgeExecutionReconciliations", packagePath);
  const portableKnowledgeRecoveryVerifications = requireArray(pkg, "portableKnowledgeRecoveryVerifications", packagePath);
  const portableKnowledgePromotionDecisions = requireArray(pkg, "portableKnowledgePromotionDecisions", packagePath);
  const packageRefIndex = indexById(packageRefs, `${packagePath}:packageRefs`);
  const crossPackageRefIndex = indexById(crossPackageRefs, `${packagePath}:crossPackageRefs`);
  const lifecycleIndex = indexById(lifecycleRecords, `${packagePath}:qualityIntentLifecycleRecords`);
  const missedIntentIndex = indexById(missedIntentRecords, `${packagePath}:missedIntentRecords`);
  const trialIndex = indexById(agentTrials, `${packagePath}:agentTrials`);
  const evidenceOriginIndex = checkEvidenceOrigins(evidenceOrigins, packagePath);
  const outcomeIndex = indexById(agentOutcomes, `${packagePath}:agentOutcomes`);
  const judgmentMemoryPolicyIndex = indexById(judgmentMemoryPolicies, `${packagePath}:judgmentMemoryPolicies`);
  const judgmentMemoryGovernanceTriggerIndex = indexById(judgmentMemoryGovernanceTriggers, `${packagePath}:judgmentMemoryGovernanceTriggers`);
  const judgmentMemoryEntryIndex = indexById(judgmentMemoryEntries, `${packagePath}:judgmentMemoryEntries`);
  const judgmentMemoryDependencyIndex = indexById(judgmentMemoryDependencies, `${packagePath}:judgmentMemoryDependencies`);
  const judgmentMemoryRevisionIndex = indexById(judgmentMemoryRevisions, `${packagePath}:judgmentMemoryRevisions`);
  const judgmentRetirementDecisionIndex = indexById(judgmentRetirementDecisions, `${packagePath}:judgmentRetirementDecisions`);
  const multiAgentJudgmentJoinIndex = indexById(multiAgentJudgmentJoins, `${packagePath}:multiAgentJudgmentJoins`);
  const portableKnowledgeImportPolicyIndex = indexById(portableKnowledgeImportPolicies, `${packagePath}:portableKnowledgeImportPolicies`);
  const portableKnowledgeGovernanceTriggerIndex = indexById(portableKnowledgeGovernanceTriggers, `${packagePath}:portableKnowledgeGovernanceTriggers`);
  const portableKnowledgeLibraryIndex = indexById(portableKnowledgeLibraries, `${packagePath}:portableKnowledgeLibraries`);
  const portableKnowledgeItemIndex = indexById(portableKnowledgeItems, `${packagePath}:portableKnowledgeItems`);
  const portableKnowledgeImportDecisionIndex = indexById(portableKnowledgeImportDecisions, `${packagePath}:portableKnowledgeImportDecisions`);
  const portableKnowledgeLocalValidationPolicyIndex = indexById(portableKnowledgeLocalValidationPolicies, `${packagePath}:portableKnowledgeLocalValidationPolicies`);
  const portableKnowledgeApplicabilityDecisionIndex = indexById(portableKnowledgeApplicabilityDecisions, `${packagePath}:portableKnowledgeApplicabilityDecisions`);
  const portableKnowledgeReproductionTrialIndex = indexById(portableKnowledgeReproductionTrials, `${packagePath}:portableKnowledgeReproductionTrials`);
  const portableKnowledgeLocalValidationAssessmentIndex = indexById(portableKnowledgeLocalValidationAssessments, `${packagePath}:portableKnowledgeLocalValidationAssessments`);
  const portableKnowledgeRevocationPolicyIndex = indexById(portableKnowledgeRevocationPolicies, `${packagePath}:portableKnowledgeRevocationPolicies`);
  const portableKnowledgeRevocationNoticeIndex = indexById(portableKnowledgeRevocationNotices, `${packagePath}:portableKnowledgeRevocationNotices`);
  const portableKnowledgeDependencyEdgeIndex = indexById(portableKnowledgeDependencyEdges, `${packagePath}:portableKnowledgeDependencyEdges`);
  const portableKnowledgeRevocationImpactAssessmentIndex = indexById(portableKnowledgeRevocationImpactAssessments, `${packagePath}:portableKnowledgeRevocationImpactAssessments`);
  const portableKnowledgeTrustPolicyIndex = indexById(portableKnowledgeTrustPolicies, `${packagePath}:portableKnowledgeTrustPolicies`);
  const portableKnowledgeAttestationIndex = indexById(portableKnowledgeAttestations, `${packagePath}:portableKnowledgeAttestations`);
  const portableKnowledgeTrustDecisionIndex = indexById(portableKnowledgeTrustDecisions, `${packagePath}:portableKnowledgeTrustDecisions`);
  const portableKnowledgeTrustReplayIndex = indexById(portableKnowledgeTrustReplays, `${packagePath}:portableKnowledgeTrustReplays`);
  const portableKnowledgeRolloutItemPreviewIndex = indexById(portableKnowledgeRolloutItemPreviews, `${packagePath}:portableKnowledgeRolloutItemPreviews`);
  const portableKnowledgeRolloutPreviewIndex = indexById(portableKnowledgeRolloutPreviews, `${packagePath}:portableKnowledgeRolloutPreviews`);
  const portableKnowledgeActivationDecisionIndex = indexById(portableKnowledgeActivationDecisions, `${packagePath}:portableKnowledgeActivationDecisions`);
  const portableKnowledgePolicyObservationIndex = indexById(portableKnowledgePolicyObservations, `${packagePath}:portableKnowledgePolicyObservations`);
  const portableKnowledgeRollbackRecordIndex = indexById(portableKnowledgeRollbackRecords, `${packagePath}:portableKnowledgeRollbackRecords`);
  const portableKnowledgeExecutionReconciliationIndex = indexById(portableKnowledgeExecutionReconciliations, `${packagePath}:portableKnowledgeExecutionReconciliations`);
  const portableKnowledgeRecoveryVerificationIndex = indexById(portableKnowledgeRecoveryVerifications, `${packagePath}:portableKnowledgeRecoveryVerifications`);
  void crossPackageRefIndex;
  void missedIntentIndex;

  const packageIndex = new Map();
  for (const ref of packageRefs) {
    for (const field of ["path", "packageType", "role"]) {
      checkRequiredString(ref, field, ref.id);
    }
    if (typeof ref.path !== "string" || path.isAbsolute(ref.path) || ref.path.includes("..")) {
      errors.push(`${ref.id} path must be a relative repository path without parent traversal.`);
      continue;
    }
    const absolute = path.resolve(projectRoot, ref.path);
    if (!fs.existsSync(absolute)) {
      errors.push(`${ref.id} package path does not exist: ${ref.path}`);
      continue;
    }
    const referenced = readJson(absolute, ref.id);
    if (!referenced) {
      continue;
    }
    const referencedPackageType = referenced.packageType ?? (typeof referenced.frameworkVersion === "string" && Array.isArray(referenced.expertJudgments) && Array.isArray(referenced.decisionPatterns) ? "expert-judgment" : undefined);
    if (referencedPackageType !== ref.packageType) {
      errors.push(`${ref.id} expected packageType ${ref.packageType} but found ${referencedPackageType}.`);
    }
    packageIndex.set(ref.id, {
      ref,
      package: referenced,
      entities: buildEntityIndex(referenced)
    });
  }

  for (const xref of crossPackageRefs) {
    checkRequiredString(xref, "purpose", xref.id);
    checkRequiredString(xref, "provenance", xref.id);
    resolveEntity(xref.from, packageIndex, `${xref.id}/from`);
    resolveEntity(xref.to, packageIndex, `${xref.id}/to`);
    if (xref.from?.packageRef === xref.to?.packageRef && xref.from?.entityRef === xref.to?.entityRef) {
      errors.push(`${xref.id} must not point an entity to itself.`);
    }
  }

  const lifecycleStates = new Set(["candidate", "validated", "active", "superseded", "retired"]);
  const lifecycleByIntent = new Map();
  for (const record of lifecycleRecords) {
    resolveEntity(record.intent, packageIndex, `${record.id}/intent`);
    if (!lifecycleStates.has(record.state)) {
      errors.push(`${record.id} state must be one of candidate, validated, active, superseded, retired.`);
    }
    checkRequiredString(record, "rationale", record.id);
    checkRequiredString(record, "owner", record.id);
    checkRequiredString(record, "status", record.id);
    if (record.previousLifecycleRecordRef && !lifecycleIndex.has(record.previousLifecycleRecordRef)) {
      errors.push(`${record.id} references missing previousLifecycleRecordRef ${record.previousLifecycleRecordRef}.`);
    }
    if (!Array.isArray(record.evidenceRefs) || record.evidenceRefs.length === 0) {
      errors.push(`${record.id} must include evidenceRefs.`);
    }
    for (const evidenceRef of record.evidenceRefs ?? []) {
      resolveEntity(evidenceRef, packageIndex, `${record.id}/evidenceRef`);
    }
    const key = refLabel(record.intent);
    if (!lifecycleByIntent.has(key)) {
      lifecycleByIntent.set(key, []);
    }
    lifecycleByIntent.get(key).push(record);
  }

  for (const record of missedIntentRecords) {
    resolveEntity(record.sourceIncident, packageIndex, `${record.id}/sourceIncident`);
    if (!Array.isArray(record.matchedActiveIntentRefs)) {
      errors.push(`${record.id} must include matchedActiveIntentRefs array.`);
    }
    for (const intentRef of record.matchedActiveIntentRefs ?? []) {
      resolveEntity(intentRef, packageIndex, `${record.id}/matchedActiveIntentRef`);
      const lifecycles = lifecycleByIntent.get(refLabel(intentRef)) ?? [];
      if (!lifecycles.some((entry) => entry.state === "active")) {
        errors.push(`${record.id} matched intent ${refLabel(intentRef)} must have an active lifecycle record.`);
      }
    }
    if (record.outcome === "derive-new-intent") {
      if (!record.newQualityIntentDerivation) {
        errors.push(`${record.id} outcome derive-new-intent requires newQualityIntentDerivation.`);
      } else {
        resolveEntity(record.newQualityIntentDerivation, packageIndex, `${record.id}/newQualityIntentDerivation`);
      }
    } else if (record.outcome === "accepted-gap") {
      checkRequiredString(record, "acceptedGapRationale", record.id);
    } else {
      errors.push(`${record.id} outcome must be derive-new-intent or accepted-gap.`);
    }
    checkRequiredString(record, "owner", record.id);
    checkRequiredString(record, "status", record.id);
  }

  for (const trial of agentTrials) {
    resolveEntity(trial.target, packageIndex, `${trial.id}/target`);
    resolveEntity(trial.reviewRun, packageIndex, `${trial.id}/reviewRun`);
    checkRequiredString(trial, "trajectorySummary", trial.id);
    checkRequiredString(trial, "environmentState", trial.id);
    checkRequiredString(trial, "evaluatorUncertainty", trial.id);
    checkRequiredString(trial, "transcriptHandling", trial.id);
    if (trial.transcriptHandling === "hidden-chain-of-thought") {
      errors.push(`${trial.id} must not store hidden chain-of-thought as ledger evidence.`);
    }
    if (!Array.isArray(trial.toolActionProvenance) || trial.toolActionProvenance.length === 0) {
      errors.push(`${trial.id} must include toolActionProvenance.`);
    }
    if (!outcomeIndex.has(trial.outcomeRef)) {
      errors.push(`${trial.id} references missing outcomeRef ${trial.outcomeRef}.`);
    }
  }

  for (const outcome of agentOutcomes) {
    if (!trialIndex.has(outcome.trialRef)) {
      errors.push(`${outcome.id} references missing trialRef ${outcome.trialRef}.`);
    }
    checkRequiredString(outcome, "actualOutcome", outcome.id);
    checkRequiredString(outcome, "status", outcome.id);
    if (!evidenceOriginIndex.has(outcome.evidenceOriginRef)) {
      errors.push(`${outcome.id} references missing evidence origin: ${outcome.evidenceOriginRef}`);
    }
    if (!Array.isArray(outcome.outcomeEvidenceRefs) || outcome.outcomeEvidenceRefs.length === 0) {
      errors.push(`${outcome.id} must include outcomeEvidenceRefs.`);
    }
    for (const evidenceRef of outcome.outcomeEvidenceRefs ?? []) {
      resolveEntity(evidenceRef, packageIndex, `${outcome.id}/outcomeEvidenceRef`);
    }
  }

  const governanceTypes = (refs, ownerId) => new Set((refs ?? []).map((id) => {
    const trigger = judgmentMemoryGovernanceTriggerIndex.get(id);
    if (!trigger) errors.push(`${ownerId} references missing judgment-memory governance trigger ${id}.`);
    return trigger?.triggerType;
  }).filter(Boolean));

  for (const policy of judgmentMemoryPolicies) {
    if (!Number.isInteger(policy.minimumDistinctLanes) || policy.minimumDistinctLanes < 2) errors.push(`${policy.id} minimumDistinctLanes must be at least 2.`);
    if (policy.preserveDissent !== true || policy.dependencyDisclosureRequired !== true || policy.appendOnlyRevisions !== true) errors.push(`${policy.id} must require dissent preservation, dependency disclosure, and append-only revisions.`);
    if (policy.destructiveForgetAllowed !== false || policy.hiddenReasoningAllowed !== false || policy.automaticAuthority !== false) errors.push(`${policy.id} must forbid destructive forgetting, hidden reasoning storage, and automatic authority.`);
  }

  for (const trigger of judgmentMemoryGovernanceTriggers) {
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) checkRequiredString(trigger, field, trigger.id);
  }

  for (const memory of judgmentMemoryEntries) {
    if (!judgmentMemoryPolicyIndex.has(memory.policyRef)) errors.push(`${memory.id} references missing judgment memory policy ${memory.policyRef}.`);
    for (const field of ["laneId", "actorRef", "roleRef", "independenceGroup"]) checkRequiredString(memory, field, memory.id);
    resolveEntity(memory.sourceJudgment, packageIndex, `${memory.id}/sourceJudgment`);
    if (!evidenceOriginIndex.has(memory.evidenceOriginRef)) errors.push(`${memory.id} references missing evidence origin ${memory.evidenceOriginRef}.`);
    if (!Array.isArray(memory.dependencyRefs) || memory.dependencyRefs.length === 0) errors.push(`${memory.id} dependencyRefs must include at least one dependency.`);
    if (memory.hiddenReasoningStored !== false) errors.push(`${memory.id} hiddenReasoningStored must be false.`);
  }

  for (const dependency of judgmentMemoryDependencies) {
    if (!judgmentMemoryPolicyIndex.has(dependency.policyRef)) errors.push(`${dependency.id} references missing judgment memory policy ${dependency.policyRef}.`);
    const affected = (dependency.affectedMemoryRefs ?? []).map((id) => judgmentMemoryEntryIndex.get(id)).filter(Boolean);
    for (const id of dependency.affectedMemoryRefs ?? []) if (!judgmentMemoryEntryIndex.has(id)) errors.push(`${dependency.id} references missing judgment memory ${id}.`);
    if (new Set(dependency.affectedMemoryRefs ?? []).size !== (dependency.affectedMemoryRefs ?? []).length) errors.push(`${dependency.id} affectedMemoryRefs must not contain duplicates.`);
    if (dependency.dependencyType !== "declared-independent" && affected.length < 2) errors.push(`${dependency.id} shared dependency must affect at least two memories.`);
    for (const memory of affected) if (!(memory.dependencyRefs ?? []).includes(dependency.id)) errors.push(`${dependency.id} affected memory ${memory.id} must link back through dependencyRefs.`);
    for (const evidenceRef of dependency.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${dependency.id}/evidenceRef`);
    const types = governanceTypes(dependency.governanceTriggerRefs, dependency.id);
    if (dependency.independenceImpact !== "independent" && !types.has("memory-shared-dependency")) errors.push(`${dependency.id} non-independent dependency requires a memory-shared-dependency governance trigger.`);
  }

  const revisionsByMemory = new Map();
  for (const revision of judgmentMemoryRevisions) {
    const memory = judgmentMemoryEntryIndex.get(revision.memoryRef);
    if (!memory) errors.push(`${revision.id} references missing judgment memory ${revision.memoryRef}.`);
    for (const evidenceRef of revision.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${revision.id}/evidenceRef`);
    if (!revisionsByMemory.has(revision.memoryRef)) revisionsByMemory.set(revision.memoryRef, []);
    revisionsByMemory.get(revision.memoryRef).push(revision);
    if (revision.previousRevisionRef === null) {
      if (revision.revisionNumber !== 1) errors.push(`${revision.id} first revision must use revisionNumber 1.`);
    } else {
      const previous = judgmentMemoryRevisionIndex.get(revision.previousRevisionRef);
      if (!previous) errors.push(`${revision.id} references missing previous judgment memory revision ${revision.previousRevisionRef}.`);
      else if (previous.memoryRef !== revision.memoryRef || revision.revisionNumber !== previous.revisionNumber + 1) errors.push(`${revision.id} previous revision must belong to the same memory and increment revisionNumber by one.`);
    }
  }
  for (const memory of judgmentMemoryEntries) {
    const revisions = revisionsByMemory.get(memory.id) ?? [];
    const current = revisions.filter((item) => item.status === "current");
    if (current.length !== 1 || current[0]?.id !== memory.currentRevisionRef) errors.push(`${memory.id} must identify exactly one current revision through currentRevisionRef.`);
    const numbers = revisions.map((item) => item.revisionNumber).sort((a, b) => a - b);
    if (!numbers.every((value, index) => value === index + 1)) errors.push(`${memory.id} revision numbers must be contiguous from 1.`);
  }

  for (const decision of judgmentRetirementDecisions) {
    if (!judgmentMemoryPolicyIndex.has(decision.policyRef)) errors.push(`${decision.id} references missing judgment memory policy ${decision.policyRef}.`);
    const memory = judgmentMemoryEntryIndex.get(decision.memoryRef);
    if (!memory) errors.push(`${decision.id} references missing judgment memory ${decision.memoryRef}.`);
    for (const evidenceRef of decision.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${decision.id}/evidenceRef`);
    const expectedStatus = decision.action === "retire" ? "retired" : "current";
    if (decision.resultingStatus !== expectedStatus) errors.push(`${decision.id} resultingStatus must reproduce as ${expectedStatus}.`);
    if (decision.status === "approved" && memory?.status !== expectedStatus) errors.push(`${decision.id} approved decision must match memory status ${expectedStatus}.`);
    if (decision.destructiveDeletion !== false) errors.push(`${decision.id} destructiveDeletion must be false.`);
    const types = governanceTypes(decision.governanceTriggerRefs, decision.id);
    if (decision.action === "retire" && !types.has("memory-retirement-review")) errors.push(`${decision.id} retirement requires a memory-retirement-review governance trigger.`);
  }

  for (const join of multiAgentJudgmentJoins) {
    const policy = judgmentMemoryPolicyIndex.get(join.policyRef);
    if (!policy) errors.push(`${join.id} references missing judgment memory policy ${join.policyRef}.`);
    const memories = (join.memoryRefs ?? []).map((id) => judgmentMemoryEntryIndex.get(id)).filter(Boolean);
    for (const id of join.memoryRefs ?? []) if (!judgmentMemoryEntryIndex.has(id)) errors.push(`${join.id} references missing judgment memory ${id}.`);
    if (new Set(join.memoryRefs ?? []).size !== (join.memoryRefs ?? []).length) errors.push(`${join.id} memoryRefs must not contain duplicates.`);
    if (memories.some((item) => item.status !== "current")) errors.push(`${join.id} must not join retired memories.`);
    const laneCount = new Set(memories.map((item) => item.laneId)).size;
    if (laneCount < (policy?.minimumDistinctLanes ?? 2)) errors.push(`${join.id} must include at least ${policy?.minimumDistinctLanes ?? 2} distinct lanes.`);
    const expectedRevisionRefs = memories.map((item) => item.currentRevisionRef);
    if (!sameSet(join.revisionRefs, expectedRevisionRefs)) errors.push(`${join.id} revisionRefs must exactly match current revisions of joined memories.`);
    const revisions = expectedRevisionRefs.map((id) => judgmentMemoryRevisionIndex.get(id)).filter(Boolean);
    const relevantDependencies = judgmentMemoryDependencies.filter((dependency) => (dependency.affectedMemoryRefs ?? []).filter((id) => (join.memoryRefs ?? []).includes(id)).length >= 2).map((item) => item.id);
    if (!sameSet(join.dependencyRefs, relevantDependencies)) errors.push(`${join.id} dependencyRefs must disclose every dependency shared by joined memories.`);
    const expectedDissent = memories.filter((memory) => judgmentMemoryRevisionIndex.get(memory.currentRevisionRef)?.judgment !== join.joinedJudgment).map((memory) => memory.id);
    if (!sameSet(join.dissentMemoryRefs, expectedDissent)) errors.push(`${join.id} dissentMemoryRefs must reproduce every joined memory that differs from joinedJudgment.`);
    const hasConflict = new Set(revisions.map((item) => item.judgment)).size > 1;
    if (hasConflict && (!Array.isArray(join.conflictDimensions) || join.conflictDimensions.length === 0)) errors.push(`${join.id} conflicting judgments require conflictDimensions.`);
    if (join.dissentPreserved !== true || join.automaticAuthority !== false) errors.push(`${join.id} must preserve dissent and forbid automatic authority.`);
    const unverified = revisions.some((item) => item.evidenceStatus !== "verified");
    const dependent = relevantDependencies.some((id) => judgmentMemoryDependencyIndex.get(id)?.independenceImpact !== "independent");
    const sufficient = !unverified && !dependent && !hasConflict;
    if (join.dataSufficiency !== (sufficient ? "sufficient" : "insufficient")) errors.push(`${join.id} dataSufficiency must reproduce as ${sufficient ? "sufficient" : "insufficient"}.`);
    if (join.authorityBoundary !== "recorded-join-only-not-semantic-truth-quality-competence-authorization-or-authority") errors.push(`${join.id} authorityBoundary must remain recorded-join-only-not-semantic-truth-quality-competence-authorization-or-authority.`);
    const types = governanceTypes(join.governanceTriggerRefs, join.id);
    if (unverified && !types.has("memory-evidence-unverified")) errors.push(`${join.id} unverified memory evidence requires a memory-evidence-unverified governance trigger.`);
    if (dependent && !types.has("memory-shared-dependency")) errors.push(`${join.id} shared dependency requires a memory-shared-dependency governance trigger.`);
    if (hasConflict && !types.has("memory-conflict-unresolved")) errors.push(`${join.id} conflicting judgments require a memory-conflict-unresolved governance trigger.`);
    if (!sufficient && join.status !== "governance-required") errors.push(`${join.id} insufficient join must have status governance-required.`);
    for (const evidenceRef of join.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${join.id}/evidenceRef`);
  }

  for (const assessment of judgmentMemoryAssessments) {
    if (!judgmentMemoryPolicyIndex.has(assessment.policyRef)) errors.push(`${assessment.id} references missing judgment memory policy ${assessment.policyRef}.`);
    const memories = (assessment.memoryEntryRefs ?? []).map((id) => judgmentMemoryEntryIndex.get(id)).filter(Boolean);
    const revisions = (assessment.revisionRefs ?? []).map((id) => judgmentMemoryRevisionIndex.get(id)).filter(Boolean);
    const dependencies = (assessment.dependencyRefs ?? []).map((id) => judgmentMemoryDependencyIndex.get(id)).filter(Boolean);
    const retirementDecisions = (assessment.retirementDecisionRefs ?? []).map((id) => judgmentRetirementDecisionIndex.get(id)).filter(Boolean);
    const joins = (assessment.joinRefs ?? []).map((id) => multiAgentJudgmentJoinIndex.get(id)).filter(Boolean);
    for (const id of assessment.memoryEntryRefs ?? []) if (!judgmentMemoryEntryIndex.has(id)) errors.push(`${assessment.id} references missing judgment memory ${id}.`);
    for (const id of assessment.revisionRefs ?? []) if (!judgmentMemoryRevisionIndex.has(id)) errors.push(`${assessment.id} references missing judgment memory revision ${id}.`);
    for (const id of assessment.dependencyRefs ?? []) if (!judgmentMemoryDependencyIndex.has(id)) errors.push(`${assessment.id} references missing judgment memory dependency ${id}.`);
    for (const id of assessment.retirementDecisionRefs ?? []) if (!judgmentRetirementDecisionIndex.has(id)) errors.push(`${assessment.id} references missing judgment retirement decision ${id}.`);
    for (const id of assessment.joinRefs ?? []) if (!multiAgentJudgmentJoinIndex.has(id)) errors.push(`${assessment.id} references missing multi-agent judgment join ${id}.`);
    const expected = {
      laneCount: new Set(memories.map((item) => item.laneId)).size,
      currentMemoryCount: memories.filter((item) => item.status === "current").length,
      retiredMemoryCount: memories.filter((item) => item.status === "retired").length,
      dissentCount: new Set(joins.flatMap((item) => item.dissentMemoryRefs ?? [])).size,
      sharedDependencyCount: dependencies.filter((item) => item.independenceImpact !== "independent").length,
      unresolvedConflictCount: joins.filter((item) => (item.conflictDimensions ?? []).length > 0 && item.status === "governance-required").length,
      unverifiedMemoryCount: memories.filter((item) => judgmentMemoryRevisionIndex.get(item.currentRevisionRef)?.evidenceStatus !== "verified").length
    };
    for (const [field, value] of Object.entries(expected)) if (assessment[field] !== value) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    if (!sameSet(assessment.revisionRefs, revisions.map((item) => item.id))) errors.push(`${assessment.id} revisionRefs must resolve without duplicates.`);
    if (!sameSet(assessment.retirementDecisionRefs, retirementDecisions.map((item) => item.id))) errors.push(`${assessment.id} retirementDecisionRefs must resolve without duplicates.`);
    const sufficient = expected.currentMemoryCount >= 2 && expected.sharedDependencyCount === 0 && expected.unresolvedConflictCount === 0 && expected.unverifiedMemoryCount === 0;
    if (assessment.dataSufficiency !== (sufficient ? "sufficient" : "insufficient")) errors.push(`${assessment.id} dataSufficiency must reproduce as ${sufficient ? "sufficient" : "insufficient"}.`);
    const signals = [];
    if (expected.unverifiedMemoryCount > 0) signals.push("evidence-insufficient");
    if (expected.sharedDependencyCount > 0) signals.push("shared-dependency");
    if (expected.dissentCount > 0) signals.push("disagreement-preserved");
    if (expected.unresolvedConflictCount > 0) signals.push("unresolved-conflict");
    if (expected.retiredMemoryCount > 0) signals.push("retired-history-preserved");
    if (sufficient) signals.push("ready-for-governed-use");
    if (!sameSet(assessment.assessmentSignals, signals)) errors.push(`${assessment.id} assessmentSignals must reproduce as ${signals.join(", ")}.`);
    if (assessment.activityCountIsQuality !== false || assessment.automaticQualityVerdict !== false) errors.push(`${assessment.id} must not treat activity counts as quality or make an automatic quality verdict.`);
    const types = governanceTypes(assessment.governanceTriggerRefs, assessment.id);
    if (!sufficient && !types.has("memory-assessment-insufficient")) errors.push(`${assessment.id} insufficient memory evidence requires a memory-assessment-insufficient governance trigger.`);
  }

  const portableGovernanceTypes = (refs, ownerId) => new Set((refs ?? []).map((id) => {
    const trigger = portableKnowledgeGovernanceTriggerIndex.get(id);
    if (!trigger) errors.push(`${ownerId} references missing portable-knowledge governance trigger ${id}.`);
    return trigger?.triggerType;
  }).filter(Boolean));

  for (const policy of portableKnowledgeImportPolicies) {
    if (!sameSet(policy.allowedKnowledgeTypes, ["decision-pattern", "quality-intent"])) errors.push(`${policy.id} allowedKnowledgeTypes must include decision-pattern and quality-intent exactly once.`);
    if (policy.preserveSourceIdentity !== true || policy.requireContentDigest !== true || policy.requireApplicabilityBoundary !== true || policy.requireCounterexamples !== true) errors.push(`${policy.id} must require source identity, content digest, applicability boundary, and counterexamples.`);
    if (policy.importedInstructionsExecutable !== false || policy.hiddenReasoningAllowed !== false || policy.automaticActivation !== false || policy.automaticAuthority !== false) errors.push(`${policy.id} must forbid executable imported instructions, hidden reasoning, automatic activation, and automatic authority.`);
  }

  for (const trigger of portableKnowledgeGovernanceTriggers) {
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) checkRequiredString(trigger, field, trigger.id);
  }

  const integrityByItem = new Map();
  for (const item of portableKnowledgeItems) {
    if (!portableKnowledgeLibraryIndex.has(item.libraryRef)) errors.push(`${item.id} references missing portable knowledge library ${item.libraryRef}.`);
    const source = resolveEntity(item.sourceEntity, packageIndex, `${item.id}/sourceEntity`);
    const expectedType = item.knowledgeType === "decision-pattern" ? "decisionPatterns" : item.knowledgeType === "quality-intent" ? "qualityIntents" : null;
    if (expectedType && item.sourceEntity?.entityType !== expectedType) errors.push(`${item.id} knowledgeType ${item.knowledgeType} requires source entityType ${expectedType}.`);
    const snapshotMatches = Boolean(source) && canonicalJson(item.sourceSnapshot) === canonicalJson(source);
    if (!snapshotMatches) errors.push(`${item.id} sourceSnapshot must exactly reproduce the resolved source entity.`);
    const expectedDigest = source ? sha256(source) : null;
    const digestMatches = Boolean(expectedDigest) && item.sourceDigest === expectedDigest;
    if (!digestMatches) errors.push(`${item.id} sourceDigest must reproduce the canonical source entity digest ${expectedDigest ?? "unavailable"}.`);
    integrityByItem.set(item.id, snapshotMatches && digestMatches);
    checkRequiredString(item, "provenanceSummary", item.id);
    checkRequiredString(item, "applicabilityBoundary", item.id);
    if (!Array.isArray(item.counterexamples) || item.counterexamples.length === 0) errors.push(`${item.id} counterexamples must include at least one concrete challenge.`);
    if (item.instructionBoundary !== "reference-data-only-not-executable-agent-instructions" || item.hiddenReasoningStored !== false) errors.push(`${item.id} must remain reference data only and must not store hidden reasoning.`);
    if (!Array.isArray(item.evidenceRefs) || item.evidenceRefs.length === 0) errors.push(`${item.id} evidenceRefs must include source evidence.`);
    for (const evidenceRef of item.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${item.id}/evidenceRef`);
  }

  for (const library of portableKnowledgeLibraries) {
    if (!portableKnowledgeImportPolicyIndex.has(library.policyRef)) errors.push(`${library.id} references missing portable knowledge import policy ${library.policyRef}.`);
    if (!evidenceOriginIndex.has(library.evidenceOriginRef)) errors.push(`${library.id} references missing evidence origin ${library.evidenceOriginRef}.`);
    const items = (library.itemRefs ?? []).map((id) => portableKnowledgeItemIndex.get(id)).filter(Boolean);
    for (const id of library.itemRefs ?? []) if (!portableKnowledgeItemIndex.has(id)) errors.push(`${library.id} references missing portable knowledge item ${id}.`);
    if (new Set(library.itemRefs ?? []).size !== (library.itemRefs ?? []).length) errors.push(`${library.id} itemRefs must not contain duplicates.`);
    const ownedItems = portableKnowledgeItems.filter((item) => item.libraryRef === library.id).map((item) => item.id);
    if (!sameSet(library.itemRefs, ownedItems)) errors.push(`${library.id} itemRefs must exactly list items owned by the library.`);
    const expectedDigest = sha256((library.itemRefs ?? []).map((id) => ({ id, sourceDigest: portableKnowledgeItemIndex.get(id)?.sourceDigest })));
    if (library.libraryDigest !== expectedDigest) errors.push(`${library.id} libraryDigest must reproduce as ${expectedDigest}.`);
    const trust = library.trust;
    if (!trust || !Array.isArray(trust.sources) || trust.sources.length === 0 || !Array.isArray(trust.verifiedBy)) errors.push(`${library.id} trust must include sources and verifiedBy arrays.`);
    for (const field of ["generatedBy", "status", "staleAfter"]) checkRequiredString(trust ?? {}, field, `${library.id}/trust`);
    for (const sourceRef of trust?.sources ?? []) if (!packageRefIndex.has(sourceRef)) errors.push(`${library.id} trust references missing source package ${sourceRef}.`);
    void items;
  }

  for (const decision of portableKnowledgeImportDecisions) {
    if (!portableKnowledgeImportPolicyIndex.has(decision.policyRef)) errors.push(`${decision.id} references missing portable knowledge import policy ${decision.policyRef}.`);
    const library = portableKnowledgeLibraryIndex.get(decision.libraryRef);
    if (!library) errors.push(`${decision.id} references missing portable knowledge library ${decision.libraryRef}.`);
    for (const id of decision.importedItemRefs ?? []) if (!portableKnowledgeItemIndex.has(id)) errors.push(`${decision.id} references missing portable knowledge item ${id}.`);
    if (!(decision.importedItemRefs ?? []).every((id) => (library?.itemRefs ?? []).includes(id))) errors.push(`${decision.id} importedItemRefs must belong to the referenced library.`);
    if (new Set(decision.importedItemRefs ?? []).size !== (decision.importedItemRefs ?? []).length) errors.push(`${decision.id} importedItemRefs must not contain duplicates.`);
    const integrityVerified = (decision.importedItemRefs ?? []).every((id) => integrityByItem.get(id) === true);
    if (decision.sourceDigestVerified !== integrityVerified) errors.push(`${decision.id} sourceDigestVerified must reproduce as ${integrityVerified}.`);
    if (decision.provenancePreserved !== true) errors.push(`${decision.id} provenancePreserved must be true.`);
    if (decision.importedStatus !== "candidate" || decision.executable !== false || decision.automaticActivation !== false || decision.automaticAuthority !== false) errors.push(`${decision.id} imported knowledge must remain candidate-only, non-executable, non-activating, and non-authoritative.`);
    if (!['not-started', 'planned'].includes(decision.localValidationStatus)) errors.push(`${decision.id} localValidationStatus must remain not-started or planned in v0.8.1.`);
    const types = portableGovernanceTypes(decision.governanceTriggerRefs, decision.id);
    if (library?.trust?.status !== "verified" && !types.has("portable-source-unverified")) errors.push(`${decision.id} unverified source trust requires a portable-source-unverified governance trigger.`);
    if (decision.decision === "candidate-import" && !types.has("portable-applicability-unvalidated")) errors.push(`${decision.id} candidate import requires a portable-applicability-unvalidated governance trigger.`);
    if (decision.decision === "candidate-import" && !types.has("portable-counterexample-unresolved")) errors.push(`${decision.id} candidate import requires a portable-counterexample-unresolved governance trigger.`);
    if (decision.decision === "candidate-import" && decision.status !== "governance-required") errors.push(`${decision.id} candidate import must have status governance-required until local validation.`);
  }

  for (const assessment of portableKnowledgeAssessments) {
    if (!portableKnowledgeImportPolicyIndex.has(assessment.policyRef)) errors.push(`${assessment.id} references missing portable knowledge import policy ${assessment.policyRef}.`);
    const libraries = (assessment.libraryRefs ?? []).map((id) => portableKnowledgeLibraryIndex.get(id)).filter(Boolean);
    const items = (assessment.itemRefs ?? []).map((id) => portableKnowledgeItemIndex.get(id)).filter(Boolean);
    const decisions = (assessment.importDecisionRefs ?? []).map((id) => portableKnowledgeImportDecisionIndex.get(id)).filter(Boolean);
    for (const id of assessment.libraryRefs ?? []) if (!portableKnowledgeLibraryIndex.has(id)) errors.push(`${assessment.id} references missing portable knowledge library ${id}.`);
    for (const id of assessment.itemRefs ?? []) if (!portableKnowledgeItemIndex.has(id)) errors.push(`${assessment.id} references missing portable knowledge item ${id}.`);
    for (const id of assessment.importDecisionRefs ?? []) if (!portableKnowledgeImportDecisionIndex.has(id)) errors.push(`${assessment.id} references missing portable knowledge import decision ${id}.`);
    const candidateItems = new Set(decisions.filter((decision) => decision.decision === "candidate-import").flatMap((decision) => decision.importedItemRefs ?? []));
    const expected = {
      libraryCount: libraries.length,
      itemCount: items.length,
      candidateImportCount: decisions.filter((decision) => decision.decision === "candidate-import").length,
      rejectedImportCount: decisions.filter((decision) => decision.decision === "reject-import").length,
      locallyValidatedItemCount: 0,
      unresolvedApplicabilityCount: candidateItems.size,
      unresolvedCounterexampleCount: candidateItems.size
    };
    for (const [field, value] of Object.entries(expected)) if (assessment[field] !== value) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const sourceIntegrityStatus = items.every((item) => integrityByItem.get(item.id) === true) ? "verified" : "mismatch";
    if (assessment.sourceIntegrityStatus !== sourceIntegrityStatus) errors.push(`${assessment.id} sourceIntegrityStatus must reproduce as ${sourceIntegrityStatus}.`);
    const sourceUnverified = libraries.some((library) => library.trust?.status !== "verified");
    const signals = [];
    if (sourceUnverified) signals.push("source-unverified");
    if (sourceIntegrityStatus === "mismatch") signals.push("integrity-mismatch");
    if (expected.candidateImportCount > 0) signals.push("candidate-only");
    if (expected.unresolvedApplicabilityCount > 0) signals.push("applicability-unvalidated");
    if (expected.unresolvedCounterexampleCount > 0) signals.push("counterexample-unresolved");
    if (!sourceUnverified && sourceIntegrityStatus === "verified" && expected.candidateImportCount > 0) signals.push("ready-for-local-validation");
    if (!sameSet(assessment.assessmentSignals, signals)) errors.push(`${assessment.id} assessmentSignals must reproduce as ${signals.join(", ")}.`);
    if (assessment.dataSufficiency !== "insufficient") errors.push(`${assessment.id} dataSufficiency must remain insufficient before local validation.`);
    if (assessment.activityCountIsQuality !== false || assessment.automaticQualityVerdict !== false) errors.push(`${assessment.id} must not treat import counts as quality or make an automatic quality verdict.`);
    const types = portableGovernanceTypes(assessment.governanceTriggerRefs, assessment.id);
    if (!types.has("portable-assessment-insufficient")) errors.push(`${assessment.id} insufficient portable knowledge assessment requires a portable-assessment-insufficient governance trigger.`);
  }

  const requiredApplicabilityDimensions = ["context", "stakeholder-impact", "risk", "domain", "loss-boundary", "artifact-type", "operational-impact"];
  for (const policy of portableKnowledgeLocalValidationPolicies) {
    if (!sameSet(policy.requiredApplicabilityDimensions, requiredApplicabilityDimensions)) errors.push(`${policy.id} requiredApplicabilityDimensions must include all seven local target dimensions exactly once.`);
    if (!Number.isInteger(policy.minimumUnseenCases) || policy.minimumUnseenCases < 1) errors.push(`${policy.id} minimumUnseenCases must be a positive integer.`);
    if (typeof policy.minimumAgreement !== "number" || policy.minimumAgreement < 0 || policy.minimumAgreement > 1) errors.push(`${policy.id} minimumAgreement must be between 0 and 1.`);
    if (policy.requireIndependentEvaluator !== true || policy.requireCounterexampleChallenge !== true || policy.requireVerifiedSource !== true || policy.requireVerifiedEvidence !== true) errors.push(`${policy.id} must require independent evaluation, counterexample challenge, verified source, and verified evidence.`);
    if (policy.automaticActivation !== false || policy.automaticAuthority !== false || policy.semanticTruthClaimed !== false) errors.push(`${policy.id} must forbid automatic activation, automatic authority, and semantic truth claims.`);
  }

  for (const decision of portableKnowledgeApplicabilityDecisions) {
    const policy = portableKnowledgeLocalValidationPolicyIndex.get(decision.policyRef);
    if (!policy) errors.push(`${decision.id} references missing local validation policy ${decision.policyRef}.`);
    if (!portableKnowledgeItemIndex.has(decision.itemRef)) errors.push(`${decision.id} references missing portable knowledge item ${decision.itemRef}.`);
    resolveEntity(decision.targetRef, packageIndex, `${decision.id}/targetRef`);
    if (decision.targetRef?.entityType !== "evaluationTargets") errors.push(`${decision.id} targetRef must reference evaluationTargets.`);
    if (!sameSet(decision.evaluatedDimensions, policy?.requiredApplicabilityDimensions ?? requiredApplicabilityDimensions)) errors.push(`${decision.id} evaluatedDimensions must reproduce the policy dimensions exactly once.`);
    if (!Array.isArray(decision.matches) || decision.matches.length === 0) errors.push(`${decision.id} matches must include at least one concrete local match.`);
    for (const evidenceRef of decision.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${decision.id}/evidenceRef`);
    const mismatch = (decision.mismatches ?? []).length > 0;
    const types = portableGovernanceTypes(decision.governanceTriggerRefs, decision.id);
    if (decision.decision === "applicable" && mismatch) errors.push(`${decision.id} cannot be applicable while context mismatches remain.`);
    if ((decision.decision !== "applicable" || mismatch) && !types.has("portable-local-target-mismatch")) errors.push(`${decision.id} local mismatch or non-applicable decision requires a portable-local-target-mismatch governance trigger.`);
    if ((decision.decision !== "applicable" || mismatch) && decision.status !== "governance-required") errors.push(`${decision.id} local mismatch or non-applicable decision must require governance.`);
  }

  const trialState = new Map();
  for (const trial of portableKnowledgeReproductionTrials) {
    const policy = portableKnowledgeLocalValidationPolicyIndex.get(trial.policyRef);
    const item = portableKnowledgeItemIndex.get(trial.itemRef);
    const decision = portableKnowledgeApplicabilityDecisionIndex.get(trial.applicabilityDecisionRef);
    if (!policy) errors.push(`${trial.id} references missing local validation policy ${trial.policyRef}.`);
    if (!item) errors.push(`${trial.id} references missing portable knowledge item ${trial.itemRef}.`);
    if (!decision) errors.push(`${trial.id} references missing applicability decision ${trial.applicabilityDecisionRef}.`);
    if (decision && decision.itemRef !== trial.itemRef) errors.push(`${trial.id} applicability decision must evaluate the same portable knowledge item.`);
    if (decision && refLabel(decision.targetRef) !== refLabel(trial.targetRef)) errors.push(`${trial.id} targetRef must match its applicability decision target.`);
    resolveEntity(trial.targetRef, packageIndex, `${trial.id}/targetRef`);

    const sourceCaseKeys = new Set();
    for (const caseRef of trial.sourceCaseRefs ?? []) {
      resolveEntity(caseRef, packageIndex, `${trial.id}/sourceCaseRef`);
      if (caseRef?.entityType !== "cases") errors.push(`${trial.id} sourceCaseRefs must reference cases.`);
      sourceCaseKeys.add(refLabel(caseRef));
    }
    const unseenCaseKeys = new Set();
    for (const caseRef of trial.unseenCaseRefs ?? []) {
      resolveEntity(caseRef, packageIndex, `${trial.id}/unseenCaseRef`);
      if (caseRef?.entityType !== "cases") errors.push(`${trial.id} unseenCaseRefs must reference cases.`);
      unseenCaseKeys.add(refLabel(caseRef));
    }
    if (sourceCaseKeys.size !== (trial.sourceCaseRefs ?? []).length || unseenCaseKeys.size !== (trial.unseenCaseRefs ?? []).length) errors.push(`${trial.id} source and unseen case refs must not contain duplicates.`);
    if ([...unseenCaseKeys].some((key) => sourceCaseKeys.has(key))) errors.push(`${trial.id} unseen cases must not overlap source cases.`);

    const expectedMap = new Map((trial.expectedDecisions ?? []).map((entry) => [refLabel(entry.caseRef), entry.decision]));
    const observedMap = new Map((trial.observedDecisions ?? []).map((entry) => [refLabel(entry.caseRef), entry.decision]));
    for (const entry of [...(trial.expectedDecisions ?? []), ...(trial.observedDecisions ?? [])]) resolveEntity(entry.caseRef, packageIndex, `${trial.id}/caseDecision`);
    if (!sameSet([...expectedMap.keys()], [...unseenCaseKeys]) || expectedMap.size !== (trial.expectedDecisions ?? []).length) errors.push(`${trial.id} expectedDecisions must cover unseenCaseRefs exactly once.`);
    if (!sameSet([...observedMap.keys()], [...unseenCaseKeys]) || observedMap.size !== (trial.observedDecisions ?? []).length) errors.push(`${trial.id} observedDecisions must cover unseenCaseRefs exactly once.`);
    const agreementCount = [...unseenCaseKeys].filter((key) => expectedMap.get(key) === observedMap.get(key)).length;
    const expectedAgreement = unseenCaseKeys.size > 0 ? agreementCount / unseenCaseKeys.size : 0;
    if (Math.abs(trial.agreementScore - expectedAgreement) > 1e-9) errors.push(`${trial.id} agreementScore must reproduce as ${expectedAgreement}.`);

    const independent = !(trial.sourceEvaluatorRefs ?? []).includes(trial.evaluatorRef);
    if (trial.evaluatorIndependent !== independent) errors.push(`${trial.id} evaluatorIndependent must reproduce as ${independent}.`);
    const counterexampleTexts = (trial.counterexampleOutcomes ?? []).map((outcome) => outcome.counterexample);
    if (!sameSet(counterexampleTexts, item?.counterexamples ?? [])) errors.push(`${trial.id} counterexampleOutcomes must challenge every imported counterexample exactly once.`);
    for (const outcome of trial.counterexampleOutcomes ?? []) {
      resolveEntity(outcome.caseRef, packageIndex, `${trial.id}/counterexampleCaseRef`);
      for (const evidenceRef of outcome.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${trial.id}/counterexampleEvidenceRef`);
    }
    for (const evidenceRef of trial.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${trial.id}/evidenceRef`);
    const unresolvedCounterexampleCount = (trial.counterexampleOutcomes ?? []).filter((outcome) => ["contradicts", "unresolved"].includes(outcome.outcome)).length;
    const behaviorPass = decision?.decision === "applicable" && unseenCaseKeys.size >= (policy?.minimumUnseenCases ?? Infinity) && independent && expectedAgreement >= (policy?.minimumAgreement ?? Infinity) && unresolvedCounterexampleCount === 0 && sameSet(counterexampleTexts, item?.counterexamples ?? []);
    const expectedResult = behaviorPass ? "pass" : decision?.decision === "applicable" && expectedAgreement > 0 ? "partial-pass" : "fail";
    if (trial.result !== expectedResult) errors.push(`${trial.id} result must reproduce as ${expectedResult}.`);
    if (trial.hiddenReasoningStored !== false) errors.push(`${trial.id} must not store hidden reasoning.`);
    const types = portableGovernanceTypes(trial.governanceTriggerRefs, trial.id);
    if (trial.evidenceStatus !== "verified" && !types.has("portable-local-evidence-unverified")) errors.push(`${trial.id} unverified or example-only evidence requires a portable-local-evidence-unverified governance trigger.`);
    if (!behaviorPass && !types.has("portable-local-reproduction-insufficient")) errors.push(`${trial.id} insufficient reproduction requires a portable-local-reproduction-insufficient governance trigger.`);
    trialState.set(trial.id, { behaviorPass, independent, unresolvedCounterexampleCount });
  }

  for (const assessment of portableKnowledgeLocalValidationAssessments) {
    const policy = portableKnowledgeLocalValidationPolicyIndex.get(assessment.policyRef);
    if (!policy) errors.push(`${assessment.id} references missing local validation policy ${assessment.policyRef}.`);
    const items = (assessment.itemRefs ?? []).map((id) => portableKnowledgeItemIndex.get(id)).filter(Boolean);
    const decisions = (assessment.applicabilityDecisionRefs ?? []).map((id) => portableKnowledgeApplicabilityDecisionIndex.get(id)).filter(Boolean);
    const trials = (assessment.reproductionTrialRefs ?? []).map((id) => portableKnowledgeReproductionTrialIndex.get(id)).filter(Boolean);
    for (const id of assessment.itemRefs ?? []) if (!portableKnowledgeItemIndex.has(id)) errors.push(`${assessment.id} references missing portable knowledge item ${id}.`);
    for (const id of assessment.applicabilityDecisionRefs ?? []) if (!portableKnowledgeApplicabilityDecisionIndex.has(id)) errors.push(`${assessment.id} references missing applicability decision ${id}.`);
    for (const id of assessment.reproductionTrialRefs ?? []) if (!portableKnowledgeReproductionTrialIndex.has(id)) errors.push(`${assessment.id} references missing reproduction trial ${id}.`);
    if (!sameSet(assessment.itemRefs, decisions.map((decision) => decision.itemRef))) errors.push(`${assessment.id} applicability decisions must cover itemRefs exactly once.`);
    if (!sameSet(assessment.itemRefs, trials.map((trial) => trial.itemRef))) errors.push(`${assessment.id} reproduction trials must cover itemRefs exactly once.`);
    const targetCount = new Set(decisions.map((decision) => refLabel(decision.targetRef))).size;
    const applicableItemCount = decisions.filter((decision) => decision.decision === "applicable" && (decision.mismatches ?? []).length === 0).length;
    const rejectedItemCount = decisions.filter((decision) => decision.decision === "not-applicable").length;
    const reproducedItemCount = trials.filter((trial) => trialState.get(trial.id)?.behaviorPass).length;
    const independentTrialCount = trials.filter((trial) => trialState.get(trial.id)?.independent).length;
    const verifiedEvidenceTrialCount = trials.filter((trial) => trial.evidenceStatus === "verified").length;
    const unresolvedCounterexampleCount = trials.reduce((sum, trial) => sum + (trialState.get(trial.id)?.unresolvedCounterexampleCount ?? 0), 0);
    const libraries = items.map((item) => portableKnowledgeLibraryIndex.get(item.libraryRef)).filter(Boolean);
    const trustStates = libraries.map((library) => library.trust?.status);
    const sourceTrustStatus = trustStates.includes("retired") ? "retired" : trustStates.includes("stale") ? "stale" : trustStates.length > 0 && trustStates.every((state) => state === "verified") ? "verified" : "unverified";
    const expected = { targetCount, applicableItemCount, rejectedItemCount, reproducedItemCount, independentTrialCount, verifiedEvidenceTrialCount, unresolvedCounterexampleCount };
    for (const [field, value] of Object.entries(expected)) if (assessment[field] !== value) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    if (assessment.sourceTrustStatus !== sourceTrustStatus) errors.push(`${assessment.id} sourceTrustStatus must reproduce as ${sourceTrustStatus}.`);
    const allDimensionsTested = decisions.length === items.length && decisions.every((decision) => sameSet(decision.evaluatedDimensions, policy?.requiredApplicabilityDimensions ?? []));
    const sufficient = items.length > 0 && sourceTrustStatus === "verified" && allDimensionsTested && applicableItemCount === items.length && reproducedItemCount === items.length && independentTrialCount === trials.length && verifiedEvidenceTrialCount === trials.length && unresolvedCounterexampleCount === 0;
    if (assessment.dataSufficiency !== (sufficient ? "sufficient" : "insufficient")) errors.push(`${assessment.id} dataSufficiency must reproduce as ${sufficient ? "sufficient" : "insufficient"}.`);
    if (assessment.activationEligibility !== (sufficient ? "eligible-for-governed-activation" : "not-eligible")) errors.push(`${assessment.id} activationEligibility must reproduce as ${sufficient ? "eligible-for-governed-activation" : "not-eligible"}.`);
    const signals = [];
    if (sourceTrustStatus !== "verified") signals.push("source-unverified");
    if (applicableItemCount !== items.length) signals.push("target-mismatch");
    if (allDimensionsTested) signals.push("local-applicability-tested");
    if (reproducedItemCount === items.length) signals.push("reproduction-passed"); else signals.push("reproduction-insufficient");
    if (verifiedEvidenceTrialCount !== trials.length) signals.push("evidence-unverified");
    if (unresolvedCounterexampleCount > 0) signals.push("counterexample-unresolved");
    signals.push(sufficient ? "eligible-for-governed-activation" : "activation-eligibility-blocked");
    if (!sameSet(assessment.assessmentSignals, signals)) errors.push(`${assessment.id} assessmentSignals must reproduce as ${signals.join(", ")}.`);
    if (assessment.activityCountIsQuality !== false || assessment.automaticActivation !== false || assessment.automaticAuthority !== false || assessment.semanticTruthClaimed !== false) errors.push(`${assessment.id} must keep counts as evidence and forbid automatic activation, authority, and semantic truth claims.`);
    const types = portableGovernanceTypes(assessment.governanceTriggerRefs, assessment.id);
    if (!sufficient && !types.has("portable-local-validation-insufficient")) errors.push(`${assessment.id} insufficient local validation requires a portable-local-validation-insufficient governance trigger.`);
    if (sufficient && (assessment.governanceTriggerRefs ?? []).length > 0) warnings.push(`${assessment.id} is eligible but still has governance triggers; eligibility does not resolve governance automatically.`);
  }

  const revocationSubjectKinds = ["library", "item", "source-digest", "evidence-origin", "publisher"];
  for (const policy of portableKnowledgeRevocationPolicies) {
    if (!sameSet(policy.acceptedNoticeStates, ["active", "disputed"])) errors.push(`${policy.id} acceptedNoticeStates must contain active and disputed exactly once.`);
    if (!sameSet(policy.supportedSubjectKinds, revocationSubjectKinds)) errors.push(`${policy.id} supportedSubjectKinds must contain all five exact subject kinds.`);
    if (policy.requireEvidence !== true || policy.requireDependencyClosure !== true || policy.failClosedOnUnknownImpact !== true || policy.preserveHistory !== true) errors.push(`${policy.id} must require evidence, dependency closure, fail-closed handling, and history preservation.`);
    if (policy.destructiveDeletionAllowed !== false || policy.automaticActivation !== false || policy.automaticAuthority !== false || policy.semanticTruthClaimed !== false) errors.push(`${policy.id} must forbid destructive deletion, automatic activation, automatic authority, and semantic truth claims.`);
  }

  const portableRecordIndex = new Map();
  for (const collection of [portableKnowledgeLibraries, portableKnowledgeItems, portableKnowledgeImportDecisions, portableKnowledgeAssessments, portableKnowledgeApplicabilityDecisions, portableKnowledgeReproductionTrials, portableKnowledgeLocalValidationAssessments]) {
    for (const record of collection) portableRecordIndex.set(record.id, record);
  }
  const revocationTypes = (refs, owner) => portableGovernanceTypes(refs, owner);
  const noticeAffectedItems = new Map();
  for (const notice of portableKnowledgeRevocationNotices) {
    if (!portableKnowledgeRevocationPolicyIndex.has(notice.policyRef)) errors.push(`${notice.id} references missing revocation policy ${notice.policyRef}.`);
    for (const evidenceRef of notice.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${notice.id}/evidenceRef`);
    let items = [];
    if (notice.subjectKind === "item") {
      const item = portableKnowledgeItemIndex.get(notice.itemRef);
      if (!item) errors.push(`${notice.id} references missing portable knowledge item ${notice.itemRef}.`);
      else {
        items = [item];
        if (notice.sourceDigest !== item.sourceDigest) errors.push(`${notice.id} sourceDigest must exactly match ${item.id}.`);
      }
    } else if (notice.subjectKind === "library") {
      const library = portableKnowledgeLibraryIndex.get(notice.libraryRef);
      if (!library) errors.push(`${notice.id} references missing portable knowledge library ${notice.libraryRef}.`);
      items = portableKnowledgeItems.filter((item) => item.libraryRef === notice.libraryRef);
    } else if (notice.subjectKind === "source-digest") {
      items = portableKnowledgeItems.filter((item) => item.sourceDigest === notice.sourceDigest);
    } else if (notice.subjectKind === "evidence-origin") {
      items = portableKnowledgeItems.filter((item) => portableKnowledgeLibraryIndex.get(item.libraryRef)?.evidenceOriginRef === notice.evidenceOriginRef);
    } else if (notice.subjectKind === "publisher") {
      items = portableKnowledgeItems.filter((item) => portableKnowledgeLibraryIndex.get(item.libraryRef)?.publisherRef === notice.publisherRef);
    }
    if (items.length === 0) errors.push(`${notice.id} exact revocation subject must resolve to at least one portable knowledge item.`);
    noticeAffectedItems.set(notice.id, items.map((item) => item.id));
    const types = revocationTypes(notice.governanceTriggerRefs, notice.id);
    if (["active", "disputed"].includes(notice.noticeState) && (notice.evidenceRefs ?? []).length === 0) errors.push(`${notice.id} active or disputed notice requires evidenceRefs.`);
    if (["active", "disputed"].includes(notice.noticeState) && notice.issuerTrustStatus !== "verified" && !types.has("portable-revocation-source-unverified")) errors.push(`${notice.id} unverified revocation issuer requires a portable-revocation-source-unverified governance trigger.`);
  }

  const graph = new Map();
  const edgePairs = new Set();
  for (const edge of portableKnowledgeDependencyEdges) {
    if (!portableRecordIndex.has(edge.upstreamRef)) errors.push(`${edge.id} references missing upstream record ${edge.upstreamRef}.`);
    if (!portableRecordIndex.has(edge.downstreamRef)) errors.push(`${edge.id} references missing downstream record ${edge.downstreamRef}.`);
    if (edge.upstreamRef === edge.downstreamRef) errors.push(`${edge.id} must not self-reference.`);
    const pair = `${edge.upstreamRef}->${edge.downstreamRef}`;
    if (edgePairs.has(pair)) errors.push(`${edge.id} duplicates dependency ${pair}.`);
    edgePairs.add(pair);
    for (const evidenceRef of edge.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${edge.id}/evidenceRef`);
    if (edge.active && edge.status === "current") {
      if (!graph.has(edge.upstreamRef)) graph.set(edge.upstreamRef, []);
      graph.get(edge.upstreamRef).push(edge);
    }
  }

  for (const assessment of portableKnowledgeRevocationImpactAssessments) {
    const policy = portableKnowledgeRevocationPolicyIndex.get(assessment.policyRef);
    const notice = portableKnowledgeRevocationNoticeIndex.get(assessment.noticeRef);
    if (!policy) errors.push(`${assessment.id} references missing revocation policy ${assessment.policyRef}.`);
    if (!notice) errors.push(`${assessment.id} references missing revocation notice ${assessment.noticeRef}.`);
    if (notice && notice.policyRef !== assessment.policyRef) errors.push(`${assessment.id} policyRef must match its notice policy.`);
    const seeds = noticeAffectedItems.get(assessment.noticeRef) ?? [];
    const direct = new Set();
    const transitive = new Set();
    const usedEdges = new Set();
    const queue = seeds.map((id) => ({ id, depth: 0 }));
    const visited = new Set(seeds);
    while (queue.length > 0) {
      const current = queue.shift();
      for (const edge of graph.get(current.id) ?? []) {
        usedEdges.add(edge.id);
        if (current.depth === 0) direct.add(edge.downstreamRef); else if (!direct.has(edge.downstreamRef)) transitive.add(edge.downstreamRef);
        if (!visited.has(edge.downstreamRef)) {
          visited.add(edge.downstreamRef);
          queue.push({ id: edge.downstreamRef, depth: current.depth + 1 });
        }
      }
    }
    if (!sameSet(assessment.affectedItemRefs, seeds)) errors.push(`${assessment.id} affectedItemRefs must exactly reproduce the notice subject match.`);
    if (!sameSet(assessment.directDependentRefs, [...direct])) errors.push(`${assessment.id} directDependentRefs must exactly reproduce direct dependency impact.`);
    if (!sameSet(assessment.transitiveDependentRefs, [...transitive])) errors.push(`${assessment.id} transitiveDependentRefs must exactly reproduce transitive dependency impact.`);
    if (!sameSet(assessment.dependencyEdgeRefs, [...usedEdges])) errors.push(`${assessment.id} dependencyEdgeRefs must exactly reproduce traversed dependency edges.`);
    for (const id of assessment.dependencyEdgeRefs ?? []) if (!portableKnowledgeDependencyEdgeIndex.has(id)) errors.push(`${assessment.id} references missing dependency edge ${id}.`);
    const unresolved = (assessment.unresolvedDependencyRefs ?? []).filter((id) => !portableRecordIndex.has(id));
    const complete = unresolved.length === 0;
    const counts = { affectedItemCount: seeds.length, directDependentCount: direct.size, transitiveDependentCount: transitive.size };
    for (const [field, value] of Object.entries(counts)) if (assessment[field] !== value) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    if (assessment.traversalComplete !== complete) errors.push(`${assessment.id} traversalComplete must reproduce as ${complete}.`);
    const active = ["active", "disputed"].includes(notice?.noticeState);
    if (active && assessment.eligibilityEffect !== "suspended") errors.push(`${assessment.id} active or disputed notice must fail closed with suspended eligibility.`);
    const sufficient = complete && notice?.issuerTrustStatus === "verified";
    if (assessment.dataSufficiency !== (sufficient ? "sufficient" : "insufficient")) errors.push(`${assessment.id} dataSufficiency must reproduce as ${sufficient ? "sufficient" : "insufficient"}.`);
    const signals = ["revocation-recorded"];
    if (direct.size > 0) signals.push("direct-impact-found");
    if (transitive.size > 0) signals.push("transitive-impact-found");
    if (!complete) signals.push("dependency-closure-incomplete");
    if (notice?.issuerTrustStatus !== "verified") signals.push("issuer-unverified");
    if (active) signals.push("eligibility-suspended");
    if (!sameSet(assessment.assessmentSignals, signals)) errors.push(`${assessment.id} assessmentSignals must reproduce as ${signals.join(", ")}.`);
    if (assessment.preservationStatus !== "history-preserved" || assessment.destructiveDeletion !== false || assessment.automaticActivation !== false || assessment.automaticAuthority !== false || assessment.semanticTruthClaimed !== false) errors.push(`${assessment.id} must preserve history and forbid deletion, automatic activation, authority, and semantic truth claims.`);
    const types = revocationTypes(assessment.governanceTriggerRefs, assessment.id);
    if (!complete && !types.has("portable-revocation-impact-incomplete")) errors.push(`${assessment.id} incomplete impact traversal requires a portable-revocation-impact-incomplete governance trigger.`);
    if (active && !types.has("portable-revocation-dependent-suspended")) errors.push(`${assessment.id} suspended dependents require a portable-revocation-dependent-suspended governance trigger.`);
  }

  for (const decision of portableKnowledgeRevalidationDecisions) {
    const notice = portableKnowledgeRevocationNoticeIndex.get(decision.noticeRef);
    const assessment = portableKnowledgeRevocationImpactAssessmentIndex.get(decision.impactAssessmentRef);
    if (!portableKnowledgeRevocationPolicyIndex.has(decision.policyRef)) errors.push(`${decision.id} references missing revocation policy ${decision.policyRef}.`);
    if (!notice) errors.push(`${decision.id} references missing revocation notice ${decision.noticeRef}.`);
    if (!assessment) errors.push(`${decision.id} references missing impact assessment ${decision.impactAssessmentRef}.`);
    if (assessment && (assessment.noticeRef !== decision.noticeRef || assessment.policyRef !== decision.policyRef)) errors.push(`${decision.id} notice, policy, and impact assessment references must align.`);
    if (!sameSet(decision.affectedItemRefs, assessment?.affectedItemRefs ?? [])) errors.push(`${decision.id} affectedItemRefs must match its impact assessment.`);
    for (const evidenceRef of decision.replacementEvidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${decision.id}/replacementEvidenceRef`);
    if (decision.replacementItemRef && !portableKnowledgeItemIndex.has(decision.replacementItemRef)) errors.push(`${decision.id} references missing replacement item ${decision.replacementItemRef}.`);
    const trustedReplacement = Boolean(decision.replacementItemRef) && (decision.replacementEvidenceRefs ?? []).length > 0 && notice?.issuerTrustStatus === "verified" && assessment?.dataSufficiency === "sufficient";
    const active = ["active", "disputed"].includes(notice?.noticeState);
    if (active && !trustedReplacement && (decision.resultingUseStatus !== "suspended" || !["suspend", "keep-suspended"].includes(decision.decision))) errors.push(`${decision.id} must remain suspended until trusted replacement evidence is reviewed.`);
    if (decision.preserveHistory !== true || decision.automaticActivation !== false || decision.automaticAuthority !== false) errors.push(`${decision.id} must preserve history and forbid automatic activation and authority.`);
    const types = revocationTypes(decision.governanceTriggerRefs, decision.id);
    if (active && !trustedReplacement && !types.has("portable-revalidation-insufficient")) errors.push(`${decision.id} insufficient revalidation requires a portable-revalidation-insufficient governance trigger.`);
  }

  for (const policy of portableKnowledgeTrustPolicies) {
    for (const field of ["acceptedIssuers", "acceptedSubjectIdentities", "acceptedPredicateTypes", "trustedRootRevisions"]) {
      if (!Array.isArray(policy[field]) || policy[field].length === 0 || new Set(policy[field]).size !== policy[field].length) errors.push(`${policy.id} ${field} must contain unique non-empty values.`);
    }
    if (!(Date.parse(policy.validFrom) < Date.parse(policy.validUntil))) errors.push(`${policy.id} validFrom must precede validUntil.`);
    if (policy.requireCryptographicEvidence !== true || policy.requireTransparencyEvidence !== true || policy.requireRevocationCheck !== true || policy.failClosed !== true) errors.push(`${policy.id} must require cryptographic, transparency, and revocation evidence and fail closed.`);
    if (policy.automaticActivation !== false || policy.automaticAuthority !== false || policy.semanticTruthClaimed !== false) errors.push(`${policy.id} must forbid automatic activation, automatic authority, and semantic truth claims.`);
    if (policy.effectiveAt !== policy.validFrom) errors.push(`${policy.id} effectiveAt must equal validFrom.`);
    const previous = policy.previousPolicyRef ? portableKnowledgeTrustPolicyIndex.get(policy.previousPolicyRef) : null;
    if (policy.revisionKind === "initial" && policy.previousPolicyRef) errors.push(`${policy.id} initial revision must not reference a previous policy.`);
    if (policy.revisionKind !== "initial" && !policy.previousPolicyRef) errors.push(`${policy.id} non-initial revision requires previousPolicyRef.`);
    if (policy.previousPolicyRef && !previous) errors.push(`${policy.id} references missing previous policy ${policy.previousPolicyRef}.`);
    if (previous && policy.status !== "draft") {
      if (previous.supersededByPolicyRef !== policy.id) errors.push(`${policy.id} previous policy must point back through supersededByPolicyRef.`);
      if (previous.status !== "retired") errors.push(`${policy.id} previous policy must be retired.`);
    }
    if (previous && previous.validUntil !== policy.effectiveAt) errors.push(`${policy.id} effectiveAt must equal the previous policy validUntil boundary.`);
    if (policy.status === "active" && policy.supersededByPolicyRef) errors.push(`${policy.id} active policy must not name a superseding policy.`);
    if (policy.status === "retired" && !policy.supersededByPolicyRef) errors.push(`${policy.id} retired policy requires supersededByPolicyRef.`);
  }
  if (portableKnowledgeTrustPolicies.filter((policy) => policy.revisionKind === "initial").length !== 1) errors.push(`${packagePath} trust policy lineage must contain exactly one initial revision.`);
  if (portableKnowledgeTrustPolicies.filter((policy) => policy.status === "active").length !== 1) errors.push(`${packagePath} trust policy lineage must contain exactly one active revision.`);

  for (const attestation of portableKnowledgeAttestations) {
    const item = portableKnowledgeItemIndex.get(attestation.itemRef);
    if (!item) errors.push(`${attestation.id} references missing portable knowledge item ${attestation.itemRef}.`);
    else if (attestation.subjectDigest !== item.sourceDigest) errors.push(`${attestation.id} subjectDigest must exactly match ${item.id}.`);
    if (!(Date.parse(attestation.issuedAt) < Date.parse(attestation.expiresAt))) errors.push(`${attestation.id} issuedAt must precede expiresAt.`);
    for (const evidenceRef of attestation.evidenceRefs ?? []) resolveEntity(evidenceRef, packageIndex, `${attestation.id}/evidenceRef`);
    if (attestation.hiddenReasoningStored !== false) errors.push(`${attestation.id} must not store hidden reasoning.`);
  }

  const trustTriggerForCheck = {
    subjectDigestMatch: "portable-attestation-subject-mismatch",
    issuerAccepted: "portable-attestation-identity-mismatch",
    subjectIdentityAccepted: "portable-attestation-identity-mismatch",
    predicateTypeAccepted: "portable-attestation-predicate-mismatch",
    trustRootAccepted: "portable-attestation-root-untrusted",
    withinPolicyWindow: "portable-attestation-expired",
    withinAttestationWindow: "portable-attestation-expired",
    cryptographicEvidenceSatisfied: "portable-attestation-crypto-unverified",
    transparencyEvidenceSatisfied: "portable-attestation-transparency-insufficient",
    revocationCheckSatisfied: "portable-attestation-revocation-uncertain"
  };
  for (const decision of portableKnowledgeTrustDecisions) {
    const policy = portableKnowledgeTrustPolicyIndex.get(decision.policyRef);
    const attestation = portableKnowledgeAttestationIndex.get(decision.attestationRef);
    const item = portableKnowledgeItemIndex.get(decision.itemRef);
    if (!policy) errors.push(`${decision.id} references missing trust policy ${decision.policyRef}.`);
    if (!attestation) errors.push(`${decision.id} references missing attestation ${decision.attestationRef}.`);
    if (!item) errors.push(`${decision.id} references missing portable knowledge item ${decision.itemRef}.`);
    if (attestation && attestation.itemRef !== decision.itemRef) errors.push(`${decision.id} attestation and decision must reference the same item.`);
    if (policy && decision.policyVersion !== policy.version) errors.push(`${decision.id} policyVersion must exactly match ${policy.id}.`);
    const evaluatedAt = Date.parse(decision.evaluatedAt);
    const expectedChecks = {
      subjectDigestMatch: Boolean(item && attestation && attestation.subjectDigest === item.sourceDigest),
      issuerAccepted: Boolean(policy && attestation && policy.acceptedIssuers.includes(attestation.issuer)),
      subjectIdentityAccepted: Boolean(policy && attestation && policy.acceptedSubjectIdentities.includes(attestation.subjectIdentity)),
      predicateTypeAccepted: Boolean(policy && attestation && policy.acceptedPredicateTypes.includes(attestation.predicateType)),
      trustRootAccepted: Boolean(policy && attestation && policy.trustedRootRevisions.includes(attestation.trustRootRevision)),
      withinPolicyWindow: Boolean(policy && evaluatedAt >= Date.parse(policy.validFrom) && evaluatedAt <= Date.parse(policy.validUntil)),
      withinAttestationWindow: Boolean(attestation && evaluatedAt >= Date.parse(attestation.issuedAt) && evaluatedAt <= Date.parse(attestation.expiresAt)),
      cryptographicEvidenceSatisfied: attestation?.cryptographicEvidenceStatus === "recorded-verified",
      transparencyEvidenceSatisfied: attestation?.transparencyEvidenceStatus === "recorded-verified",
      revocationCheckSatisfied: attestation?.revocationStatus === "clear"
    };
    for (const [field, value] of Object.entries(expectedChecks)) if (decision[field] !== value) errors.push(`${decision.id} ${field} must reproduce as ${value}.`);
    const allSatisfied = Object.values(expectedChecks).every(Boolean);
    const hardReject = attestation?.cryptographicEvidenceStatus === "failed" || attestation?.revocationStatus === "revoked";
    const expectedDecision = allSatisfied ? "policy-conformant-candidate" : hardReject ? "rejected" : "governance-required";
    if (decision.decision !== expectedDecision) errors.push(`${decision.id} decision must reproduce as ${expectedDecision}.`);
    if (decision.status !== (allSatisfied ? "reviewed" : "governance-required")) errors.push(`${decision.id} status must reproduce as ${allSatisfied ? "reviewed" : "governance-required"}.`);
    const types = portableGovernanceTypes(decision.governanceTriggerRefs, decision.id);
    for (const [field, value] of Object.entries(expectedChecks)) if (!value && !types.has(trustTriggerForCheck[field])) errors.push(`${decision.id} failed ${field} requires a ${trustTriggerForCheck[field]} governance trigger.`);
    if (!allSatisfied && !types.has("portable-trust-decision-insufficient")) errors.push(`${decision.id} insufficient trust decision requires a portable-trust-decision-insufficient governance trigger.`);
    if (decision.activityCountIsQuality !== false || decision.automaticActivation !== false || decision.automaticAuthority !== false || decision.semanticTruthClaimed !== false) errors.push(`${decision.id} must treat checks as evidence and forbid automatic activation, authority, and semantic truth claims.`);
  }

  const trustRank = { rejected: 0, "governance-required": 1, "policy-conformant-candidate": 2 };
  for (const replay of portableKnowledgeTrustReplays) {
    const original = portableKnowledgeTrustDecisionIndex.get(replay.originalDecisionRef);
    const originalPolicy = portableKnowledgeTrustPolicyIndex.get(replay.originalPolicyRef);
    const replayPolicy = portableKnowledgeTrustPolicyIndex.get(replay.replayPolicyRef);
    const attestation = portableKnowledgeAttestationIndex.get(replay.attestationRef);
    const item = portableKnowledgeItemIndex.get(replay.itemRef);
    if (!original) errors.push(`${replay.id} references missing original trust decision ${replay.originalDecisionRef}.`);
    if (!originalPolicy) errors.push(`${replay.id} references missing original policy ${replay.originalPolicyRef}.`);
    if (!replayPolicy) errors.push(`${replay.id} references missing replay policy ${replay.replayPolicyRef}.`);
    if (!attestation) errors.push(`${replay.id} references missing attestation ${replay.attestationRef}.`);
    if (!item) errors.push(`${replay.id} references missing portable knowledge item ${replay.itemRef}.`);
    const originalSnapshotMatches = Boolean(original && original.policyRef === replay.originalPolicyRef && original.attestationRef === replay.attestationRef && original.itemRef === replay.itemRef && original.decision === replay.originalDecisionValue && original.evaluatedAt === replay.originalDecisionEvaluatedAt);
    if (!originalSnapshotMatches) errors.push(`${replay.id} frozen original decision inputs must exactly match ${replay.originalDecisionRef}.`);
    if (replayPolicy && replay.replayPolicyVersion !== replayPolicy.version) errors.push(`${replay.id} replayPolicyVersion must exactly match ${replayPolicy.id}.`);
    if (replay.originalPolicyRef === replay.replayPolicyRef) errors.push(`${replay.id} replay policy must differ from the original policy.`);
    const evaluatedAt = Date.parse(replay.replayEvaluatedAt);
    const expectedChecks = {
      subjectDigestMatch: Boolean(item && attestation && attestation.subjectDigest === item.sourceDigest),
      issuerAccepted: Boolean(replayPolicy && attestation && replayPolicy.acceptedIssuers.includes(attestation.issuer)),
      subjectIdentityAccepted: Boolean(replayPolicy && attestation && replayPolicy.acceptedSubjectIdentities.includes(attestation.subjectIdentity)),
      predicateTypeAccepted: Boolean(replayPolicy && attestation && replayPolicy.acceptedPredicateTypes.includes(attestation.predicateType)),
      trustRootAccepted: Boolean(replayPolicy && attestation && replayPolicy.trustedRootRevisions.includes(attestation.trustRootRevision)),
      withinPolicyWindow: Boolean(replayPolicy && evaluatedAt >= Date.parse(replayPolicy.validFrom) && evaluatedAt <= Date.parse(replayPolicy.validUntil)),
      withinAttestationWindow: Boolean(attestation && evaluatedAt >= Date.parse(attestation.issuedAt) && evaluatedAt <= Date.parse(attestation.expiresAt)),
      cryptographicEvidenceSatisfied: attestation?.cryptographicEvidenceStatus === "recorded-verified",
      transparencyEvidenceSatisfied: attestation?.transparencyEvidenceStatus === "recorded-verified",
      revocationCheckSatisfied: attestation?.revocationStatus === "clear"
    };
    for (const [field, value] of Object.entries(expectedChecks)) if (replay[field] !== value) errors.push(`${replay.id} ${field} must reproduce as ${value}.`);
    const allSatisfied = Object.values(expectedChecks).every(Boolean);
    const hardReject = attestation?.cryptographicEvidenceStatus === "failed" || attestation?.revocationStatus === "revoked";
    const expectedDecision = allSatisfied ? "policy-conformant-candidate" : hardReject ? "rejected" : "governance-required";
    if (replay.replayDecision !== expectedDecision) errors.push(`${replay.id} replayDecision must reproduce as ${expectedDecision}.`);
    const expectedDelta = !original ? "indeterminate" : trustRank[expectedDecision] < trustRank[original.decision] ? "tightened" : trustRank[expectedDecision] > trustRank[original.decision] ? "relaxed" : "unchanged";
    if (replay.outcomeDelta !== expectedDelta) errors.push(`${replay.id} outcomeDelta must reproduce as ${expectedDelta}.`);
    const materialChange = expectedDelta !== "unchanged";
    if (replay.materialChange !== materialChange) errors.push(`${replay.id} materialChange must reproduce as ${materialChange}.`);
    if (replay.status !== (expectedDecision === "policy-conformant-candidate" && !materialChange ? "reviewed" : "governance-required")) errors.push(`${replay.id} status must reproduce from replay outcome and material change.`);
    const types = portableGovernanceTypes(replay.governanceTriggerRefs, replay.id);
    for (const [field, value] of Object.entries(expectedChecks)) if (!value && !types.has(trustTriggerForCheck[field])) errors.push(`${replay.id} failed ${field} requires a ${trustTriggerForCheck[field]} governance trigger.`);
    if (!originalSnapshotMatches && !types.has("portable-trust-replay-input-mismatch")) errors.push(`${replay.id} changed frozen input requires a portable-trust-replay-input-mismatch governance trigger.`);
    if (materialChange && !types.has("portable-trust-replay-outcome-changed")) errors.push(`${replay.id} material outcome change requires a portable-trust-replay-outcome-changed governance trigger.`);
    if (expectedDecision !== "policy-conformant-candidate" && !types.has("portable-trust-decision-insufficient")) errors.push(`${replay.id} insufficient replay decision requires a portable-trust-decision-insufficient governance trigger.`);
    if (expectedDecision !== "policy-conformant-candidate" && !types.has("portable-trust-replay-insufficient")) errors.push(`${replay.id} insufficient replay requires a portable-trust-replay-insufficient governance trigger.`);
    if (replay.originalDecisionPreserved !== true || replay.inputsFrozen !== true || replay.activityCountIsQuality !== false || replay.automaticActivation !== false || replay.automaticAuthority !== false || replay.semanticTruthClaimed !== false) errors.push(`${replay.id} must preserve history and frozen inputs, treat counts as evidence, and forbid automatic activation, authority, and semantic truth claims.`);
  }

  for (const itemPreview of portableKnowledgeRolloutItemPreviews) {
    const rollout = portableKnowledgeRolloutPreviewIndex.get(itemPreview.rolloutPreviewRef);
    const item = portableKnowledgeItemIndex.get(itemPreview.itemRef);
    const proposedPolicy = portableKnowledgeTrustPolicyIndex.get(itemPreview.proposedPolicyRef);
    const attestation = itemPreview.attestationRef ? portableKnowledgeAttestationIndex.get(itemPreview.attestationRef) : null;
    const replay = itemPreview.replayRef ? portableKnowledgeTrustReplayIndex.get(itemPreview.replayRef) : null;
    const baselineResult = itemPreview.baselineResultRef
      ? portableKnowledgeTrustDecisionIndex.get(itemPreview.baselineResultRef) ?? portableKnowledgeTrustReplayIndex.get(itemPreview.baselineResultRef)
      : null;
    if (!rollout) errors.push(`${itemPreview.id} references missing rollout preview ${itemPreview.rolloutPreviewRef}.`);
    if (!item) errors.push(`${itemPreview.id} references missing portable knowledge item ${itemPreview.itemRef}.`);
    if (!proposedPolicy) errors.push(`${itemPreview.id} references missing proposed policy ${itemPreview.proposedPolicyRef}.`);
    if (proposedPolicy && itemPreview.proposedPolicyVersion !== proposedPolicy.version) errors.push(`${itemPreview.id} proposedPolicyVersion must exactly match ${proposedPolicy.id}.`);
    if (rollout && (itemPreview.proposedPolicyRef !== rollout.proposedPolicyRef || itemPreview.proposedPolicyVersion !== rollout.proposedPolicyVersion)) errors.push(`${itemPreview.id} proposed policy must match ${rollout.id}.`);
    const baselineValue = baselineResult?.decision ?? baselineResult?.replayDecision ?? "not-evaluable";
    if (itemPreview.baselineDecisionValue !== baselineValue) errors.push(`${itemPreview.id} baselineDecisionValue must reproduce as ${baselineValue}.`);
    if (itemPreview.inputState === "complete") {
      if (!attestation || !replay || !baselineResult) errors.push(`${itemPreview.id} complete input requires attestationRef, baselineResultRef, and replayRef.`);
      if ((itemPreview.unresolvedInputCodes ?? []).length !== 0) errors.push(`${itemPreview.id} complete input must not include unresolvedInputCodes.`);
      if (attestation && attestation.itemRef !== itemPreview.itemRef) errors.push(`${itemPreview.id} attestation must reference the same item.`);
      if (replay && (replay.itemRef !== itemPreview.itemRef || replay.replayPolicyRef !== itemPreview.proposedPolicyRef || replay.attestationRef !== itemPreview.attestationRef)) errors.push(`${itemPreview.id} replay must bind the same item, attestation, and proposed policy.`);
      if (replay && itemPreview.previewDecision !== replay.replayDecision) errors.push(`${itemPreview.id} previewDecision must reproduce ${replay.id}.`);
    } else {
      if ((itemPreview.unresolvedInputCodes ?? []).length === 0) errors.push(`${itemPreview.id} incomplete input requires unresolvedInputCodes.`);
      if (itemPreview.previewDecision !== "not-evaluable" || itemPreview.outcomeDelta !== "indeterminate" || itemPreview.materialChange !== false) errors.push(`${itemPreview.id} incomplete input must remain not-evaluable, indeterminate, and non-material until resolved.`);
    }
    const previewRank = { rejected: 0, "governance-required": 1, "policy-conformant-candidate": 2 };
    const expectedDelta = baselineValue === "not-evaluable" || itemPreview.previewDecision === "not-evaluable"
      ? "indeterminate"
      : previewRank[itemPreview.previewDecision] < previewRank[baselineValue]
        ? "tightened"
        : previewRank[itemPreview.previewDecision] > previewRank[baselineValue]
          ? "relaxed"
          : "unchanged";
    if (itemPreview.outcomeDelta !== expectedDelta) errors.push(`${itemPreview.id} outcomeDelta must reproduce as ${expectedDelta}.`);
    const expectedMaterialChange = !["unchanged", "indeterminate"].includes(expectedDelta);
    if (itemPreview.materialChange !== expectedMaterialChange) errors.push(`${itemPreview.id} materialChange must reproduce as ${expectedMaterialChange}.`);
    const types = portableGovernanceTypes(itemPreview.governanceTriggerRefs, itemPreview.id);
    if (itemPreview.inputState !== "complete" && !types.has("portable-trust-rollout-input-unresolved")) errors.push(`${itemPreview.id} unresolved input requires a portable-trust-rollout-input-unresolved governance trigger.`);
    if (expectedMaterialChange && !types.has("portable-trust-rollout-material-change")) errors.push(`${itemPreview.id} material change requires a portable-trust-rollout-material-change governance trigger.`);
    if ((itemPreview.inputState !== "complete" || expectedMaterialChange) && !types.has("portable-trust-rollout-insufficient")) errors.push(`${itemPreview.id} unsafe rollout result requires a portable-trust-rollout-insufficient governance trigger.`);
    if (itemPreview.activityCountIsQuality !== false || itemPreview.automaticActivation !== false || itemPreview.automaticAuthority !== false || itemPreview.semanticTruthClaimed !== false) errors.push(`${itemPreview.id} must treat counts as evidence and forbid automatic activation, authority, and semantic truth claims.`);
  }

  for (const rollout of portableKnowledgeRolloutPreviews) {
    const baselinePolicy = portableKnowledgeTrustPolicyIndex.get(rollout.baselinePolicyRef);
    const proposedPolicy = portableKnowledgeTrustPolicyIndex.get(rollout.proposedPolicyRef);
    if (!baselinePolicy) errors.push(`${rollout.id} references missing baseline policy ${rollout.baselinePolicyRef}.`);
    if (!proposedPolicy) errors.push(`${rollout.id} references missing proposed policy ${rollout.proposedPolicyRef}.`);
    if (rollout.baselinePolicyRef === rollout.proposedPolicyRef) errors.push(`${rollout.id} proposed policy must differ from the baseline policy.`);
    if (proposedPolicy && rollout.proposedPolicyVersion !== proposedPolicy.version) errors.push(`${rollout.id} proposedPolicyVersion must exactly match ${proposedPolicy.id}.`);
    if (proposedPolicy && proposedPolicy.status !== "draft") errors.push(`${rollout.id} proposed policy must remain draft during preview.`);
    const scopeIds = (rollout.scopeSnapshot ?? []).map((entry) => entry.itemRef);
    if (new Set(scopeIds).size !== scopeIds.length) errors.push(`${rollout.id} scopeSnapshot must not contain duplicate items.`);
    for (const entry of rollout.scopeSnapshot ?? []) {
      const item = portableKnowledgeItemIndex.get(entry.itemRef);
      if (!item) errors.push(`${rollout.id} scope references missing item ${entry.itemRef}.`);
      else if (entry.sourceDigest !== item.sourceDigest) errors.push(`${rollout.id} scope digest for ${entry.itemRef} must match the frozen item sourceDigest.`);
    }
    const sortedScope = [...(rollout.scopeSnapshot ?? [])].sort((a, b) => a.itemRef.localeCompare(b.itemRef));
    const expectedScopeDigest = sha256(sortedScope);
    if (rollout.scopeDigest !== expectedScopeDigest) errors.push(`${rollout.id} scopeDigest must reproduce as ${expectedScopeDigest}.`);
    if (rollout.scopeKind === "all-portable-items") {
      const allItemIds = [...portableKnowledgeItemIndex.keys()].sort();
      if (canonicalJson([...scopeIds].sort()) !== canonicalJson(allItemIds)) errors.push(`${rollout.id} all-portable-items scope must include every portable knowledge item exactly once.`);
    }
    const previewRefs = rollout.itemPreviewRefs ?? [];
    if (new Set(previewRefs).size !== previewRefs.length) errors.push(`${rollout.id} itemPreviewRefs must not contain duplicates.`);
    const itemPreviews = previewRefs.map((ref) => portableKnowledgeRolloutItemPreviewIndex.get(ref)).filter(Boolean);
    for (const ref of previewRefs) if (!portableKnowledgeRolloutItemPreviewIndex.has(ref)) errors.push(`${rollout.id} references missing item preview ${ref}.`);
    if (itemPreviews.some((entry) => entry.rolloutPreviewRef !== rollout.id)) errors.push(`${rollout.id} item previews must point back to the rollout preview.`);
    const previewItemIds = itemPreviews.map((entry) => entry.itemRef);
    const coverageComplete = new Set(previewItemIds).size === previewItemIds.length && canonicalJson([...previewItemIds].sort()) === canonicalJson([...scopeIds].sort());
    if (rollout.coverageComplete !== coverageComplete) errors.push(`${rollout.id} coverageComplete must reproduce as ${coverageComplete}.`);
    const counts = {
      totalItemCount: scopeIds.length,
      coveredItemCount: new Set(previewItemIds).size,
      unchangedCount: itemPreviews.filter((entry) => entry.outcomeDelta === "unchanged").length,
      tightenedCount: itemPreviews.filter((entry) => entry.outcomeDelta === "tightened").length,
      relaxedCount: itemPreviews.filter((entry) => entry.outcomeDelta === "relaxed").length,
      indeterminateCount: itemPreviews.filter((entry) => entry.outcomeDelta === "indeterminate").length,
      conformantCount: itemPreviews.filter((entry) => entry.previewDecision === "policy-conformant-candidate").length,
      governanceRequiredCount: itemPreviews.filter((entry) => entry.previewDecision === "governance-required").length,
      rejectedCount: itemPreviews.filter((entry) => entry.previewDecision === "rejected").length,
      notEvaluableCount: itemPreviews.filter((entry) => entry.previewDecision === "not-evaluable").length,
      materialChangeCount: itemPreviews.filter((entry) => entry.materialChange === true).length,
      unresolvedInputCount: itemPreviews.filter((entry) => entry.inputState !== "complete").length
    };
    for (const [field, value] of Object.entries(counts)) if (rollout[field] !== value) errors.push(`${rollout.id} ${field} must reproduce as ${value}.`);
    const inputsComplete = counts.unresolvedInputCount === 0;
    if (rollout.inputsComplete !== inputsComplete) errors.push(`${rollout.id} inputsComplete must reproduce as ${inputsComplete}.`);
    const sufficient = coverageComplete && inputsComplete;
    if (rollout.dataSufficiency !== (sufficient ? "sufficient" : "insufficient")) errors.push(`${rollout.id} dataSufficiency must reproduce as ${sufficient ? "sufficient" : "insufficient"}.`);
    const disposition = !coverageComplete || !inputsComplete ? "blocked" : counts.materialChangeCount > 0 ? "governance-required" : "ready-for-governance-decision";
    if (rollout.rolloutDisposition !== disposition) errors.push(`${rollout.id} rolloutDisposition must reproduce as ${disposition}.`);
    const types = portableGovernanceTypes(rollout.governanceTriggerRefs, rollout.id);
    if (!coverageComplete && !types.has("portable-trust-rollout-scope-mismatch")) errors.push(`${rollout.id} incomplete coverage requires a portable-trust-rollout-scope-mismatch governance trigger.`);
    if (new Set(previewItemIds).size !== previewItemIds.length && !types.has("portable-trust-rollout-duplicate-item")) errors.push(`${rollout.id} duplicate item previews require a portable-trust-rollout-duplicate-item governance trigger.`);
    if (!inputsComplete && !types.has("portable-trust-rollout-input-unresolved")) errors.push(`${rollout.id} unresolved inputs require a portable-trust-rollout-input-unresolved governance trigger.`);
    if (counts.materialChangeCount > 0 && !types.has("portable-trust-rollout-material-change")) errors.push(`${rollout.id} material changes require a portable-trust-rollout-material-change governance trigger.`);
    if (!sufficient && !types.has("portable-trust-rollout-insufficient")) errors.push(`${rollout.id} insufficient rollout preview requires a portable-trust-rollout-insufficient governance trigger.`);
    if (rollout.previewOnly !== true || rollout.activityCountIsQuality !== false || rollout.activationAuthorized !== false || rollout.automaticActivation !== false || rollout.automaticAuthority !== false || rollout.semanticTruthClaimed !== false) errors.push(`${rollout.id} must remain preview-only, treat counts as evidence, and forbid activation, authority, and semantic truth claims.`);
  }

  for (const activation of portableKnowledgeActivationDecisions) {
    const rollout = portableKnowledgeRolloutPreviewIndex.get(activation.rolloutPreviewRef);
    const baselinePolicy = portableKnowledgeTrustPolicyIndex.get(activation.baselinePolicyRef);
    const proposedPolicy = portableKnowledgeTrustPolicyIndex.get(activation.proposedPolicyRef);
    const observation = portableKnowledgePolicyObservationIndex.get(activation.observationRef);
    if (!rollout) errors.push(`${activation.id} references missing rollout preview ${activation.rolloutPreviewRef}.`);
    if (!baselinePolicy) errors.push(`${activation.id} references missing baseline policy ${activation.baselinePolicyRef}.`);
    if (!proposedPolicy) errors.push(`${activation.id} references missing proposed policy ${activation.proposedPolicyRef}.`);
    if (!observation) errors.push(`${activation.id} references missing observation ${activation.observationRef}.`);
    if (rollout && (activation.baselinePolicyRef !== rollout.baselinePolicyRef || activation.proposedPolicyRef !== rollout.proposedPolicyRef)) errors.push(`${activation.id} policy refs must match ${rollout.id}.`);
    if (rollout && activation.scopeDigest !== rollout.scopeDigest) errors.push(`${activation.id} scopeDigest must exactly match ${rollout.id}.`);
    if (observation && observation.activationDecisionRef !== activation.id) errors.push(`${activation.id} observation must point back to the activation decision.`);
    if (activation.rollbackTargetPolicyRef !== activation.baselinePolicyRef) errors.push(`${activation.id} rollback target must be the baseline policy.`);
    if (Date.parse(activation.rollbackDeadline) <= Date.parse(activation.decidedAt)) errors.push(`${activation.id} rollbackDeadline must be later than decidedAt.`);
    const previewSufficient = Boolean(rollout && rollout.coverageComplete && rollout.inputsComplete && rollout.dataSufficiency === "sufficient");
    if (activation.decision === "authorized" && !previewSufficient) errors.push(`${activation.id} cannot authorize an insufficient rollout preview.`);
    if (activation.decision === "authorized" && (!activation.decidedBy || !activation.authorityBasis)) errors.push(`${activation.id} authorization requires accountable decidedBy and authorityBasis.`);
    const materialChange = Boolean(rollout && rollout.materialChangeCount > 0);
    if (activation.materialChangesAcknowledged !== materialChange) errors.push(`${activation.id} materialChangesAcknowledged must reproduce as ${materialChange}.`);
    const types = portableGovernanceTypes(activation.governanceTriggerRefs, activation.id);
    if (!previewSufficient && !types.has("portable-trust-activation-preview-insufficient")) errors.push(`${activation.id} insufficient preview requires a portable-trust-activation-preview-insufficient governance trigger.`);
    if (materialChange && !types.has("portable-trust-activation-material-change")) errors.push(`${activation.id} material change requires a portable-trust-activation-material-change governance trigger.`);
    if (activation.status !== (activation.decision === "authorized" && !materialChange ? "reviewed" : "governance-required")) errors.push(`${activation.id} status must reproduce from the decision and material-change state.`);
    if (activation.previewEvidencePreserved !== true || activation.decisionDoesNotExecuteActivation !== true || activation.activityCountIsQuality !== false || activation.automaticActivation !== false || activation.automaticAuthority !== false || activation.semanticTruthClaimed !== false) errors.push(`${activation.id} must preserve preview evidence, separate decision from execution, treat counts as evidence, and forbid automatic activation, authority, and semantic truth claims.`);
  }

  for (const observation of portableKnowledgePolicyObservations) {
    const activation = portableKnowledgeActivationDecisionIndex.get(observation.activationDecisionRef);
    const rollback = portableKnowledgeRollbackRecordIndex.get(observation.rollbackRecordRef);
    if (!activation) errors.push(`${observation.id} references missing activation decision ${observation.activationDecisionRef}.`);
    if (!rollback) errors.push(`${observation.id} references missing rollback record ${observation.rollbackRecordRef}.`);
    if (activation && activation.observationRef !== observation.id) errors.push(`${observation.id} activation decision must point back to the observation.`);
    if (activation && activation.decision !== "authorized") errors.push(`${observation.id} requires an authorized activation decision.`);
    if (rollback && rollback.observationRef !== observation.id) errors.push(`${observation.id} rollback record must point back to the observation.`);
    const start = Date.parse(observation.windowStartedAt);
    const end = Date.parse(observation.windowEndsAt);
    const evaluated = Date.parse(observation.evaluatedAt);
    if (!(start < end && evaluated >= start && evaluated <= end)) errors.push(`${observation.id} evaluation must occur inside a bounded observation window.`);
    const signals = observation.signals ?? [];
    const complete = signals.length > 0 && signals.every((signal) => signal.result !== "missing" && (signal.evidenceRefs ?? []).length > 0);
    const stopMet = signals.some((signal) => signal.stopOnFailure === true && signal.result === "fail");
    const expectedDecision = !complete ? "hold" : stopMet ? "rollback-required" : "continue";
    if (observation.observationComplete !== complete) errors.push(`${observation.id} observationComplete must reproduce as ${complete}.`);
    if (observation.stopConditionMet !== stopMet) errors.push(`${observation.id} stopConditionMet must reproduce as ${stopMet}.`);
    if (observation.observationDecision !== expectedDecision) errors.push(`${observation.id} observationDecision must reproduce as ${expectedDecision}.`);
    const types = portableGovernanceTypes(observation.governanceTriggerRefs, observation.id);
    if (!complete && !types.has("portable-trust-observation-incomplete")) errors.push(`${observation.id} incomplete observation requires a portable-trust-observation-incomplete governance trigger.`);
    if (stopMet && !types.has("portable-trust-observation-stop-condition")) errors.push(`${observation.id} stop condition requires a portable-trust-observation-stop-condition governance trigger.`);
    if (expectedDecision === "rollback-required" && !types.has("portable-trust-rollback-required")) errors.push(`${observation.id} rollback decision requires a portable-trust-rollback-required governance trigger.`);
    if (observation.status !== (expectedDecision === "continue" ? "reviewed" : "governance-required")) errors.push(`${observation.id} status must reproduce from the observation decision.`);
    if (observation.activityCountIsQuality !== false || observation.automaticContinuation !== false || observation.automaticAuthority !== false || observation.semanticTruthClaimed !== false) errors.push(`${observation.id} must treat signal counts as evidence and forbid automatic continuation, authority, and semantic truth claims.`);
  }

  for (const rollback of portableKnowledgeRollbackRecords) {
    const activation = portableKnowledgeActivationDecisionIndex.get(rollback.activationDecisionRef);
    const observation = portableKnowledgePolicyObservationIndex.get(rollback.observationRef);
    if (!activation) errors.push(`${rollback.id} references missing activation decision ${rollback.activationDecisionRef}.`);
    if (!observation) errors.push(`${rollback.id} references missing observation ${rollback.observationRef}.`);
    if (activation && (rollback.fromPolicyRef !== activation.proposedPolicyRef || rollback.targetPolicyRef !== activation.rollbackTargetPolicyRef)) errors.push(`${rollback.id} from and target policies must match the activation decision.`);
    if (observation && (observation.activationDecisionRef !== rollback.activationDecisionRef || observation.rollbackRecordRef !== rollback.id)) errors.push(`${rollback.id} must be the rollback record selected by the same observation chain.`);
    if (observation && observation.observationDecision !== "rollback-required") errors.push(`${rollback.id} requires a rollback-required observation decision.`);
    if (activation && rollback.rollbackDeadline !== activation.rollbackDeadline) errors.push(`${rollback.id} rollbackDeadline must match the activation decision.`);
    if (Date.parse(rollback.initiatedAt) > Date.parse(rollback.rollbackDeadline)) errors.push(`${rollback.id} must be initiated by the rollback deadline.`);
    const completed = rollback.rollbackStatus === "completed";
    if (completed && (!rollback.completedAt || (rollback.executionEvidenceRefs ?? []).length === 0)) errors.push(`${rollback.id} completed rollback requires completedAt and execution evidence.`);
    if (!completed && rollback.completedAt) errors.push(`${rollback.id} non-completed rollback must not claim completedAt.`);
    const types = portableGovernanceTypes(rollback.governanceTriggerRefs, rollback.id);
    if (!types.has("portable-trust-rollback-required")) errors.push(`${rollback.id} must retain the portable-trust-rollback-required governance trigger.`);
    if (!completed && !types.has("portable-trust-rollback-incomplete")) errors.push(`${rollback.id} incomplete rollback requires a portable-trust-rollback-incomplete governance trigger.`);
    if (rollback.status !== (completed ? "reviewed" : "governance-required")) errors.push(`${rollback.id} status must reproduce from rollback completion.`);
    if (rollback.historyPreserved !== true || rollback.destructiveDeletion !== false || rollback.activityCountIsQuality !== false || rollback.automaticRollback !== false || rollback.automaticAuthority !== false || rollback.semanticTruthClaimed !== false) errors.push(`${rollback.id} must preserve history, forbid destructive deletion, treat counts as evidence, and forbid automatic rollback, authority, and semantic truth claims.`);
  }

  for (const reconciliation of portableKnowledgeExecutionReconciliations) {
    const activation = portableKnowledgeActivationDecisionIndex.get(reconciliation.activationDecisionRef);
    if (!activation) errors.push(`${reconciliation.id} references missing activation decision ${reconciliation.activationDecisionRef}.`);
    let expectedPolicyRef = null;
    if (reconciliation.actionKind === "activation") {
      if (reconciliation.actionRecordRef !== reconciliation.activationDecisionRef) errors.push(`${reconciliation.id} activation actionRecordRef must equal activationDecisionRef.`);
      expectedPolicyRef = activation?.proposedPolicyRef ?? null;
    } else {
      const rollback = portableKnowledgeRollbackRecordIndex.get(reconciliation.actionRecordRef);
      if (!rollback) errors.push(`${reconciliation.id} references missing rollback record ${reconciliation.actionRecordRef}.`);
      if (rollback && rollback.activationDecisionRef !== reconciliation.activationDecisionRef) errors.push(`${reconciliation.id} rollback record must belong to the same activation decision.`);
      expectedPolicyRef = rollback?.targetPolicyRef ?? null;
    }
    if (expectedPolicyRef && reconciliation.expectedPolicyRef !== expectedPolicyRef) errors.push(`${reconciliation.id} expectedPolicyRef must reproduce from the referenced action.`);
    if (activation && reconciliation.expectedScopeDigest !== activation.scopeDigest) errors.push(`${reconciliation.id} expectedScopeDigest must match the activation scope.`);
    const stateMatched = Boolean(expectedPolicyRef && reconciliation.observedPolicyRef === expectedPolicyRef && reconciliation.observedScopeDigest === reconciliation.expectedScopeDigest);
    if (reconciliation.stateMatched !== stateMatched) errors.push(`${reconciliation.id} stateMatched must reproduce as ${stateMatched}.`);
    const hasEvidence = (reconciliation.executionEvidenceRefs ?? []).length > 0;
    const expectedResult = !reconciliation.executionAttempted || !hasEvidence ? "unverified" : reconciliation.executionSucceeded && stateMatched ? "matched" : "mismatch";
    if (reconciliation.result !== expectedResult) errors.push(`${reconciliation.id} result must reproduce as ${expectedResult}.`);
    const types = portableGovernanceTypes(reconciliation.governanceTriggerRefs, reconciliation.id);
    if (expectedResult === "unverified" && !types.has("portable-trust-execution-unverified")) errors.push(`${reconciliation.id} unverified execution requires a portable-trust-execution-unverified governance trigger.`);
    if (expectedResult === "mismatch" && !types.has("portable-trust-execution-state-mismatch")) errors.push(`${reconciliation.id} execution mismatch requires a portable-trust-execution-state-mismatch governance trigger.`);
    if (reconciliation.status !== (expectedResult === "matched" ? "reviewed" : "governance-required")) errors.push(`${reconciliation.id} status must reproduce from execution reconciliation.`);
    if (reconciliation.historyPreserved !== true || reconciliation.activityCountIsQuality !== false || reconciliation.automaticStateClaim !== false || reconciliation.automaticAuthority !== false || reconciliation.semanticTruthClaimed !== false) errors.push(`${reconciliation.id} must preserve history, treat counts as evidence, and forbid automatic state claims, authority, and semantic truth claims.`);
  }

  for (const recovery of portableKnowledgeRecoveryVerifications) {
    const activation = portableKnowledgeActivationDecisionIndex.get(recovery.activationDecisionRef);
    const rollback = portableKnowledgeRollbackRecordIndex.get(recovery.rollbackRecordRef);
    const reconciliation = portableKnowledgeExecutionReconciliationIndex.get(recovery.rollbackReconciliationRef);
    if (!activation) errors.push(`${recovery.id} references missing activation decision ${recovery.activationDecisionRef}.`);
    if (!rollback) errors.push(`${recovery.id} references missing rollback record ${recovery.rollbackRecordRef}.`);
    if (!reconciliation) errors.push(`${recovery.id} references missing rollback reconciliation ${recovery.rollbackReconciliationRef}.`);
    if (rollback && rollback.activationDecisionRef !== recovery.activationDecisionRef) errors.push(`${recovery.id} rollback record must belong to the same activation decision.`);
    if (reconciliation && (reconciliation.actionKind !== "rollback" || reconciliation.actionRecordRef !== recovery.rollbackRecordRef)) errors.push(`${recovery.id} reconciliation must describe the referenced rollback.`);
    if (rollback && recovery.expectedRestoredPolicyRef !== rollback.targetPolicyRef) errors.push(`${recovery.id} expectedRestoredPolicyRef must match the rollback target.`);
    const checks = recovery.effectChecks ?? [];
    const checksComplete = checks.length > 0 && checks.every((check) => check.result === "pass" && (check.evidenceRefs ?? []).length > 0);
    const stateMatched = Boolean(rollback && recovery.observedRestoredPolicyRef === rollback.targetPolicyRef);
    const verified = Boolean(rollback?.rollbackStatus === "completed" && reconciliation?.result === "matched" && checksComplete && stateMatched);
    const failed = checks.some((check) => check.result === "fail") || reconciliation?.result === "mismatch" || (rollback?.rollbackStatus === "completed" && !stateMatched);
    const expectedDecision = verified ? "verified" : failed ? "failed" : "incomplete";
    if (recovery.recoveryComplete !== verified) errors.push(`${recovery.id} recoveryComplete must reproduce as ${verified}.`);
    if (recovery.verificationDecision !== expectedDecision) errors.push(`${recovery.id} verificationDecision must reproduce as ${expectedDecision}.`);
    const types = portableGovernanceTypes(recovery.governanceTriggerRefs, recovery.id);
    if (expectedDecision === "incomplete" && !types.has("portable-trust-recovery-incomplete")) errors.push(`${recovery.id} incomplete recovery requires a portable-trust-recovery-incomplete governance trigger.`);
    if (expectedDecision === "failed" && !types.has("portable-trust-recovery-failed")) errors.push(`${recovery.id} failed recovery requires a portable-trust-recovery-failed governance trigger.`);
    if (recovery.status !== (verified ? "reviewed" : "governance-required")) errors.push(`${recovery.id} status must reproduce from recovery verification.`);
    if (recovery.historyPreserved !== true || recovery.activityCountIsQuality !== false || recovery.automaticRecoveryClaim !== false || recovery.automaticAuthority !== false || recovery.semanticTruthClaimed !== false) errors.push(`${recovery.id} must preserve history, treat counts as evidence, and forbid automatic recovery claims, authority, and semantic truth claims.`);
  }

  for (const promotion of portableKnowledgePromotionDecisions) {
    const activation = portableKnowledgeActivationDecisionIndex.get(promotion.activationDecisionRef);
    const activationReconciliation = portableKnowledgeExecutionReconciliationIndex.get(promotion.activationReconciliationRef);
    const observation = portableKnowledgePolicyObservationIndex.get(promotion.observationRef);
    const rollback = promotion.rollbackRecordRef ? portableKnowledgeRollbackRecordIndex.get(promotion.rollbackRecordRef) : null;
    const recovery = promotion.recoveryVerificationRef ? portableKnowledgeRecoveryVerificationIndex.get(promotion.recoveryVerificationRef) : null;
    if (!activation) errors.push(`${promotion.id} references missing activation decision ${promotion.activationDecisionRef}.`);
    if (!activationReconciliation) errors.push(`${promotion.id} references missing activation reconciliation ${promotion.activationReconciliationRef}.`);
    if (!observation) errors.push(`${promotion.id} references missing observation ${promotion.observationRef}.`);
    if (activationReconciliation && (activationReconciliation.actionKind !== "activation" || activationReconciliation.activationDecisionRef !== promotion.activationDecisionRef)) errors.push(`${promotion.id} activation reconciliation must describe the same activation decision.`);
    if (activation && promotion.candidatePolicyRef !== activation.proposedPolicyRef) errors.push(`${promotion.id} candidatePolicyRef must match the proposed policy.`);
    let expectedDisposition = "hold";
    if (activationReconciliation?.result === "matched" && observation?.observationComplete) {
      if (observation.observationDecision === "continue") expectedDisposition = "promote";
      if (observation.observationDecision === "rollback-required") expectedDisposition = recovery?.verificationDecision === "verified" ? "retire" : "failed-recovery";
    }
    if (promotion.disposition !== expectedDisposition) errors.push(`${promotion.id} disposition must reproduce as ${expectedDisposition}.`);
    if (expectedDisposition === "promote" && activation && promotion.currentPolicyRef !== activation.proposedPolicyRef) errors.push(`${promotion.id} promoted currentPolicyRef must be the proposed policy.`);
    if (expectedDisposition === "retire" && activation && promotion.currentPolicyRef !== activation.baselinePolicyRef) errors.push(`${promotion.id} retired candidate must leave the baseline policy current.`);
    if (["retire", "failed-recovery"].includes(expectedDisposition) && (!rollback || !recovery)) errors.push(`${promotion.id} ${expectedDisposition} requires rollback and recovery verification records.`);
    const types = portableGovernanceTypes(promotion.governanceTriggerRefs, promotion.id);
    if (["hold", "failed-recovery"].includes(expectedDisposition) && !types.has("portable-trust-promotion-blocked")) errors.push(`${promotion.id} blocked promotion requires a portable-trust-promotion-blocked governance trigger.`);
    if (!promotion.decidedBy || !promotion.authorityBasis) errors.push(`${promotion.id} requires accountable decidedBy and authorityBasis.`);
    if (promotion.status !== (["promote", "retire"].includes(expectedDisposition) ? "reviewed" : "governance-required")) errors.push(`${promotion.id} status must reproduce from policy disposition.`);
    if (promotion.predecessorStatePreserved !== true || promotion.decisionDoesNotExecutePromotion !== true || promotion.activityCountIsQuality !== false || promotion.automaticPromotion !== false || promotion.automaticAuthority !== false || promotion.semanticTruthClaimed !== false) errors.push(`${promotion.id} must preserve predecessor state, separate decision from execution, treat counts as evidence, and forbid automatic promotion, authority, and semantic truth claims.`);
  }

  const index = pkg.ledgerIndex;
  if (!index || typeof index !== "object") {
    errors.push(`${packagePath} must include ledgerIndex.`);
  } else {
    for (const field of ["activeQualityIntentRefs", "openGovernanceTriggerRefs", "openResidualRiskRefs"]) {
      if (!Array.isArray(index[field])) {
        errors.push(`${packagePath} ledgerIndex must include ${field} array.`);
      }
      for (const ref of index[field] ?? []) {
        const item = resolveEntity(ref, packageIndex, `${packagePath}/ledgerIndex/${field}`);
        if (field === "openGovernanceTriggerRefs" && item && item.status !== "open") {
          errors.push(`${packagePath} ledgerIndex openGovernanceTriggerRefs must only reference open triggers.`);
        }
      }
    }
    checkRequiredString(index, "lastUpdated", `${packagePath}/ledgerIndex`);
    checkRequiredString(index, "summary", `${packagePath}/ledgerIndex`);
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
    if (!(boundary.doesNotClaim ?? []).includes("semantic truth")) {
      errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming semantic truth.`);
    }
    for (const claim of ["agent competence", "consensus correctness", "independence truth", "authorization or authority", "imported knowledge applicability or local validity", "source authenticity, license sufficiency, or safe execution", "evaluator independence beyond recorded identity separation", "counterexample completeness or operational representativeness", "activation approval or semantic fitness for use", "revocation notice authenticity or compromise truth", "cryptographic validity beyond recorded evidence, artifact safety, or attestation semantic fitness", "historical replay as current authorization, activation, authority, or semantic truth", "rollout preview as policy activation approval, enforcement authority, population fitness, or semantic truth", "activation decision as proof of execution, safe continuation, successful rollback, or semantic fitness", "execution reconciliation as provider authenticity, complete side-effect recovery, automatic promotion authority, or semantic fitness"]) {
      if (!(boundary.doesNotClaim ?? []).includes(claim)) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming ${claim}.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      packageRefs: packageRefs.length,
      crossPackageRefs: crossPackageRefs.length,
      qualityIntentLifecycleRecords: lifecycleRecords.length,
      missedIntentRecords: missedIntentRecords.length,
      agentTrials: agentTrials.length,
      evidenceOrigins: evidenceOrigins.length,
      agentOutcomes: agentOutcomes.length,
      judgmentMemoryPolicies: judgmentMemoryPolicies.length,
      judgmentMemoryGovernanceTriggers: judgmentMemoryGovernanceTriggers.length,
      judgmentMemoryEntries: judgmentMemoryEntries.length,
      judgmentMemoryDependencies: judgmentMemoryDependencies.length,
      judgmentMemoryRevisions: judgmentMemoryRevisions.length,
      judgmentRetirementDecisions: judgmentRetirementDecisions.length,
      multiAgentJudgmentJoins: multiAgentJudgmentJoins.length,
      judgmentMemoryAssessments: judgmentMemoryAssessments.length,
      portableKnowledgeImportPolicies: portableKnowledgeImportPolicies.length,
      portableKnowledgeGovernanceTriggers: portableKnowledgeGovernanceTriggers.length,
      portableKnowledgeLibraries: portableKnowledgeLibraries.length,
      portableKnowledgeItems: portableKnowledgeItems.length,
      portableKnowledgeImportDecisions: portableKnowledgeImportDecisions.length,
      portableKnowledgeAssessments: portableKnowledgeAssessments.length,
      portableKnowledgeLocalValidationPolicies: portableKnowledgeLocalValidationPolicies.length,
      portableKnowledgeApplicabilityDecisions: portableKnowledgeApplicabilityDecisions.length,
      portableKnowledgeReproductionTrials: portableKnowledgeReproductionTrials.length,
      portableKnowledgeLocalValidationAssessments: portableKnowledgeLocalValidationAssessments.length,
      portableKnowledgeRevocationPolicies: portableKnowledgeRevocationPolicies.length,
      portableKnowledgeRevocationNotices: portableKnowledgeRevocationNotices.length,
      portableKnowledgeDependencyEdges: portableKnowledgeDependencyEdges.length,
      portableKnowledgeRevocationImpactAssessments: portableKnowledgeRevocationImpactAssessments.length,
      portableKnowledgeRevalidationDecisions: portableKnowledgeRevalidationDecisions.length,
      portableKnowledgeTrustPolicies: portableKnowledgeTrustPolicies.length,
      portableKnowledgeAttestations: portableKnowledgeAttestations.length,
      portableKnowledgeTrustDecisions: portableKnowledgeTrustDecisions.length,
      portableKnowledgeTrustReplays: portableKnowledgeTrustReplays.length,
      portableKnowledgeRolloutItemPreviews: portableKnowledgeRolloutItemPreviews.length,
      portableKnowledgeRolloutPreviews: portableKnowledgeRolloutPreviews.length,
      portableKnowledgeActivationDecisions: portableKnowledgeActivationDecisions.length,
      portableKnowledgePolicyObservations: portableKnowledgePolicyObservations.length,
      portableKnowledgeRollbackRecords: portableKnowledgeRollbackRecords.length,
      portableKnowledgeExecutionReconciliations: portableKnowledgeExecutionReconciliations.length,
      portableKnowledgeRecoveryVerifications: portableKnowledgeRecoveryVerifications.length,
      portableKnowledgePromotionDecisions: portableKnowledgePromotionDecisions.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) {
    validateLedgerPackage(pkg, relativePath);
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, warnings, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF ledger package validation passed.",
  packages: results,
  warnings,
  errors
}, null, 2));
