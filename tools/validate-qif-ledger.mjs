#!/usr/bin/env node

import fs from "node:fs";
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
  const agentOutcomes = requireArray(pkg, "agentOutcomes", packagePath);
  const packageRefIndex = indexById(packageRefs, `${packagePath}:packageRefs`);
  const crossPackageRefIndex = indexById(crossPackageRefs, `${packagePath}:crossPackageRefs`);
  const lifecycleIndex = indexById(lifecycleRecords, `${packagePath}:qualityIntentLifecycleRecords`);
  const missedIntentIndex = indexById(missedIntentRecords, `${packagePath}:missedIntentRecords`);
  const trialIndex = indexById(agentTrials, `${packagePath}:agentTrials`);
  const outcomeIndex = indexById(agentOutcomes, `${packagePath}:agentOutcomes`);
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
    if (referenced.packageType !== ref.packageType) {
      errors.push(`${ref.id} expected packageType ${ref.packageType} but found ${referenced.packageType}.`);
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
    if (!Array.isArray(outcome.outcomeEvidenceRefs) || outcome.outcomeEvidenceRefs.length === 0) {
      errors.push(`${outcome.id} must include outcomeEvidenceRefs.`);
    }
    for (const evidenceRef of outcome.outcomeEvidenceRefs ?? []) {
      resolveEntity(evidenceRef, packageIndex, `${outcome.id}/outcomeEvidenceRef`);
    }
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
      agentOutcomes: agentOutcomes.length
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
