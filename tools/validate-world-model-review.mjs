#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/world-model-review-package.json"];
const packagePaths = process.argv.slice(2);
const inputs = packagePaths.length > 0 ? packagePaths : defaultPackages;
const projectRoot = process.cwd();

const errors = [];
const warnings = [];
const results = [];

const collections = [
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
  "qualityIntents",
  "worldModelGapFindings",
  "resolutionActions",
  "governanceTriggers"
];

const FINDING_FINAL_STATUSES = new Set(["candidate", "confirmed", "false-positive", "mitigated", "accepted-risk", "needs-governance"]);
const TRUST_STATUSES = new Set(["draft", "verified", "stale", "rejected"]);
const VERDICT_EFFECTS_REQUIRING_GOVERNANCE = new Set(["block-evaluation", "require-governance"]);

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

function checkScore(value, field, ownerId) {
  if (typeof value !== "number" || value < 0 || value > 1) {
    errors.push(`${ownerId} ${field} must be a number from 0 to 1.`);
  }
}

function requireArray(pkg, key, owner = "package") {
  if (!Array.isArray(pkg[key])) {
    errors.push(`${owner} ${key} must be an array.`);
    return [];
  }
  return pkg[key];
}

function checkNonEmptyArray(item, field, ownerId) {
  if (!Array.isArray(item[field]) || item[field].length === 0) {
    errors.push(`${ownerId} must include ${field}.`);
  }
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

function checkRefs(refs, index, label, ownerId) {
  if (!Array.isArray(refs) || refs.length === 0) {
    errors.push(`${ownerId} must include at least one ${label}.`);
    return;
  }
  for (const ref of refs) {
    if (!index.has(ref)) {
      errors.push(`${ownerId} references missing ${label}: ${ref}`);
    }
  }
}

function checkMaybeRefs(refs, index, label, ownerId) {
  if (!Array.isArray(refs)) {
    errors.push(`${ownerId} ${label} refs must be an array.`);
    return;
  }
  for (const ref of refs) {
    if (!index.has(ref)) {
      errors.push(`${ownerId} references missing ${label}: ${ref}`);
    }
  }
}

function buildIndexes(pkg, packagePath) {
  const indexes = new Map();
  for (const collection of collections) {
    indexes.set(collection, indexById(requireArray(pkg, collection, packagePath), `${packagePath}:${collection}`));
  }
  return indexes;
}

function index(indexes, collection) {
  return indexes.get(collection) ?? new Map();
}

function resolveLocalRef(ref, indexes, ownerId) {
  if (!ref || typeof ref !== "object") {
    errors.push(`${ownerId} must include structured local entity reference.`);
    return null;
  }
  checkRequiredString(ref, "entityType", `${ownerId}/localRef`);
  checkRequiredString(ref, "entityRef", `${ownerId}/localRef`);
  const collection = index(indexes, ref.entityType);
  if (!collection || collection.size === 0 && !indexes.has(ref.entityType)) {
    errors.push(`${ownerId} references unsupported entityType ${ref.entityType}.`);
    return null;
  }
  const item = collection.get(ref.entityRef);
  if (!item) {
    errors.push(`${ownerId} references missing ${ref.entityType}: ${ref.entityRef}`);
    return null;
  }
  return item;
}

function checkWorldModelRef(item, worldModelIndex, ownerId) {
  checkRefs([item.worldModelRef], worldModelIndex, "world model", ownerId);
}

function checkFindingEvidence(findingEvidence, ownerId) {
  if (!findingEvidence || typeof findingEvidence !== "object" || Array.isArray(findingEvidence)) {
    errors.push(`${ownerId}/findingEvidence must be an object.`);
    return;
  }
  for (const field of ["generatedBy", "sourceArtifact", "reproducedBy"]) {
    checkRequiredString(findingEvidence, field, `${ownerId}/findingEvidence`);
  }
  for (const field of ["reproducible", "falsePositiveChecked", "impactConfirmed"]) {
    if (typeof findingEvidence[field] !== "boolean") {
      errors.push(`${ownerId}/findingEvidence ${field} must be boolean.`);
    }
  }
  if (!FINDING_FINAL_STATUSES.has(findingEvidence.finalStatus)) {
    errors.push(`${ownerId}/findingEvidence finalStatus must be one of candidate, confirmed, false-positive, mitigated, accepted-risk, needs-governance.`);
  }
  if (findingEvidence.finalStatus === "confirmed" && (!findingEvidence.reproducible || !findingEvidence.falsePositiveChecked || !findingEvidence.impactConfirmed)) {
    errors.push(`${ownerId}/findingEvidence cannot be confirmed until reproducible, falsePositiveChecked, and impactConfirmed are true.`);
  }
}

function checkTrust(trust, ownerId) {
  if (!trust || typeof trust !== "object" || Array.isArray(trust)) {
    errors.push(`${ownerId}/trust must be an object.`);
    return;
  }
  checkRequiredString(trust, "generatedBy", `${ownerId}/trust`);
  checkRequiredString(trust, "staleAfter", `${ownerId}/trust`);
  if (!Array.isArray(trust.sources)) {
    errors.push(`${ownerId}/trust sources must be an array.`);
  } else if (trust.status === "verified" && trust.sources.length === 0) {
    errors.push(`${ownerId}/trust verified status requires at least one source.`);
  }
  if (!Array.isArray(trust.verifiedBy)) {
    errors.push(`${ownerId}/trust verifiedBy must be an array.`);
  } else if (trust.status === "verified" && trust.verifiedBy.length === 0) {
    errors.push(`${ownerId}/trust verified status requires at least one verifier.`);
  }
  if (!TRUST_STATUSES.has(trust.status)) {
    errors.push(`${ownerId}/trust status must be one of draft, verified, stale, rejected.`);
  }
}

function validateWorldModelPackage(pkg, packagePath) {
  if (pkg.packageType !== "world-model-review") {
    errors.push(`${packagePath} must have packageType world-model-review.`);
  }
  checkRequiredString(pkg, "runtimeVersion", packagePath);
  checkRequiredString(pkg, "packageId", packagePath);

  const indexes = buildIndexes(pkg, packagePath);
  const worldModelIndex = index(indexes, "worldModels");
  const conceptIndex = index(indexes, "conceptDefinitions");
  const boundaryIndex = index(indexes, "boundaries");
  const actorIndex = index(indexes, "actors");
  const stateIndex = index(indexes, "states");
  const axisIndex = index(indexes, "coordinateAxes");
  const evidenceIndex = index(indexes, "modelEvidence");
  const qualityIntentIndex = index(indexes, "qualityIntents");
  const findingIndex = index(indexes, "worldModelGapFindings");
  const actionIndex = index(indexes, "resolutionActions");
  const triggerIndex = index(indexes, "governanceTriggers");

  if (worldModelIndex.size === 0) {
    errors.push(`${packagePath} must include at least one world model.`);
  }

  for (const worldModel of worldModelIndex.values()) {
    for (const field of ["title", "targetDescription", "scope", "context", "owner", "status"]) {
      checkRequiredString(worldModel, field, worldModel.id);
    }
  }

  for (const concept of conceptIndex.values()) {
    checkWorldModelRef(concept, worldModelIndex, concept.id);
    for (const field of ["term", "definition", "status"]) {
      checkRequiredString(concept, field, concept.id);
    }
    if (concept.disambiguatesConceptRefs !== undefined) {
      checkMaybeRefs(concept.disambiguatesConceptRefs, conceptIndex, "concept", concept.id);
    }
  }

  for (const entity of index(indexes, "domainEntities").values()) {
    checkWorldModelRef(entity, worldModelIndex, entity.id);
    for (const field of ["name", "entityType", "owner"]) {
      checkRequiredString(entity, field, entity.id);
    }
    checkRefs([entity.conceptRef], conceptIndex, "concept", entity.id);
    checkRefs(entity.boundaryRefs, boundaryIndex, "boundary", entity.id);
  }

  for (const actor of actorIndex.values()) {
    checkWorldModelRef(actor, worldModelIndex, actor.id);
    for (const field of ["name", "actorType"]) {
      checkRequiredString(actor, field, actor.id);
    }
    checkRefs([actor.responsibilityBoundaryRef], boundaryIndex, "responsibility boundary", actor.id);
    checkRefs(actor.authorityBoundaryRefs, boundaryIndex, "authority boundary", actor.id);
  }

  for (const boundary of boundaryIndex.values()) {
    checkWorldModelRef(boundary, worldModelIndex, boundary.id);
    for (const field of ["boundaryType", "statement", "severity", "status"]) {
      checkRequiredString(boundary, field, boundary.id);
    }
  }

  for (const relationship of index(indexes, "relationships").values()) {
    checkWorldModelRef(relationship, worldModelIndex, relationship.id);
    checkRequiredString(relationship, "relationshipType", relationship.id);
    checkRequiredString(relationship, "description", relationship.id);
    const from = resolveLocalRef(relationship.from, indexes, `${relationship.id}/from`);
    const to = resolveLocalRef(relationship.to, indexes, `${relationship.id}/to`);
    if (from && to && relationship.from.entityType === relationship.to.entityType && relationship.from.entityRef === relationship.to.entityRef) {
      errors.push(`${relationship.id} must not relate an entity to itself.`);
    }
  }

  for (const state of stateIndex.values()) {
    checkWorldModelRef(state, worldModelIndex, state.id);
    for (const field of ["name", "entryCriteria", "exitCriteria"]) {
      checkRequiredString(state, field, state.id);
    }
    resolveLocalRef(state.definedFor, indexes, `${state.id}/definedFor`);
  }

  for (const event of index(indexes, "events").values()) {
    checkWorldModelRef(event, worldModelIndex, event.id);
    checkRequiredString(event, "name", event.id);
    checkRequiredString(event, "trigger", event.id);
    checkRefs(event.changedStateRefs, stateIndex, "changed state", event.id);
    checkRefs(event.affectedActorRefs, actorIndex, "affected actor", event.id);
    checkRefs(event.boundaryRefs, boundaryIndex, "boundary", event.id);
  }

  for (const invariant of index(indexes, "invariants").values()) {
    checkWorldModelRef(invariant, worldModelIndex, invariant.id);
    for (const field of ["statement", "violationEffect", "owner"]) {
      checkRequiredString(invariant, field, invariant.id);
    }
    checkRefs(invariant.boundaryRefs, boundaryIndex, "boundary", invariant.id);
  }

  for (const axis of axisIndex.values()) {
    checkWorldModelRef(axis, worldModelIndex, axis.id);
    for (const field of ["name", "axisType", "scaleDefinition", "missingValueHandling"]) {
      checkRequiredString(axis, field, axis.id);
    }
    checkNonEmptyArray(axis, "exampleValues", axis.id);
  }

  for (const system of index(indexes, "coordinateSystems").values()) {
    checkWorldModelRef(system, worldModelIndex, system.id);
    for (const field of ["name", "purpose", "status"]) {
      checkRequiredString(system, field, system.id);
    }
    checkRefs(system.axisRefs, axisIndex, "coordinate axis", system.id);
  }

  for (const perspective of index(indexes, "perspectives").values()) {
    checkWorldModelRef(perspective, worldModelIndex, perspective.id);
    for (const field of ["name", "stakeholderType", "concernFocus"]) {
      checkRequiredString(perspective, field, perspective.id);
    }
    checkRefs(perspective.qualityIntentRefs, qualityIntentIndex, "quality intent", perspective.id);
  }

  for (const evidence of evidenceIndex.values()) {
    checkWorldModelRef(evidence, worldModelIndex, evidence.id);
    for (const field of ["evidenceType", "sourceArtifact", "summary"]) {
      checkRequiredString(evidence, field, evidence.id);
    }
    checkScore(evidence.confidence, "confidence", evidence.id);
    checkNonEmptyArray(evidence, "targetRefs", evidence.id);
    for (const targetRef of evidence.targetRefs ?? []) {
      resolveLocalRef(targetRef, indexes, `${evidence.id}/targetRef`);
    }
    if (evidence.findingEvidence !== undefined) {
      checkFindingEvidence(evidence.findingEvidence, evidence.id);
    }
    checkTrust(evidence.trust, evidence.id);
  }

  for (const assumption of index(indexes, "assumptions").values()) {
    checkWorldModelRef(assumption, worldModelIndex, assumption.id);
    checkRequiredString(assumption, "statement", assumption.id);
    checkRequiredString(assumption, "status", assumption.id);
    checkRefs(assumption.sourceEvidenceRefs, evidenceIndex, "source evidence", assumption.id);
    checkNonEmptyArray(assumption, "affects", assumption.id);
    for (const affected of assumption.affects ?? []) {
      resolveLocalRef(affected, indexes, `${assumption.id}/affects`);
    }
    checkScore(assumption.confidence, "confidence", assumption.id);
  }

  for (const intent of qualityIntentIndex.values()) {
    checkRequiredString(intent, "statement", intent.id);
    checkRequiredString(intent, "status", intent.id);
    checkRefs([intent.lossBoundaryRef], boundaryIndex, "loss boundary", intent.id);
    checkMaybeRefs(intent.sourceGapFindingRefs, findingIndex, "source gap finding", intent.id);
  }

  for (const finding of findingIndex.values()) {
    checkWorldModelRef(finding, worldModelIndex, finding.id);
    for (const field of ["gapObjectType", "missingItem", "expectedDefinition", "observedProblem", "whyItMatters", "verdictEffect", "severity", "status"]) {
      checkRequiredString(finding, field, finding.id);
    }
    if (finding.gapObjectRef !== undefined) {
      resolveLocalRef(finding.gapObjectRef, indexes, `${finding.id}/gapObjectRef`);
    }
    checkRefs(finding.affectedQualityIntentRefs, qualityIntentIndex, "affected quality intent", finding.id);
    checkNonEmptyArray(finding, "affectedDecisionRefs", finding.id);
    checkRefs(finding.evidenceRefs, evidenceIndex, "evidence", finding.id);
    checkRefs(finding.requiredResolutionActionRefs, actionIndex, "resolution action", finding.id);
    checkMaybeRefs(finding.governanceTriggerRefs, triggerIndex, "governance trigger", finding.id);
    checkScore(finding.confidence, "confidence", finding.id);
    checkFindingEvidence(finding.findingEvidence, finding.id);
    checkTrust(finding.trust, finding.id);
    if (VERDICT_EFFECTS_REQUIRING_GOVERNANCE.has(finding.verdictEffect) && (!Array.isArray(finding.governanceTriggerRefs) || finding.governanceTriggerRefs.length === 0)) {
      errors.push(`${finding.id} verdictEffect ${finding.verdictEffect} requires governanceTriggerRefs.`);
    }
  }

  for (const action of actionIndex.values()) {
    checkRefs([action.findingRef], findingIndex, "finding", action.id);
    for (const field of ["actionType", "requiredDefinition", "owner", "status"]) {
      checkRequiredString(action, field, action.id);
    }
    checkNonEmptyArray(action, "acceptanceCriteria", action.id);
  }

  for (const trigger of triggerIndex.values()) {
    checkRefs([trigger.sourceFindingRef], findingIndex, "source finding", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
    }
  }

  for (const finding of findingIndex.values()) {
    for (const actionRef of finding.requiredResolutionActionRefs ?? []) {
      const action = actionIndex.get(actionRef);
      if (action && action.findingRef !== finding.id) {
        errors.push(`${finding.id} resolution action ${actionRef} must reference the same finding.`);
      }
    }
    for (const triggerRef of finding.governanceTriggerRefs ?? []) {
      const trigger = triggerIndex.get(triggerRef);
      if (trigger && trigger.sourceFindingRef !== finding.id) {
        errors.push(`${finding.id} governance trigger ${triggerRef} must reference the same finding.`);
      }
    }
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
    counts: Object.fromEntries(collections.map((collection) => [collection, index(indexes, collection).size]))
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) {
    validateWorldModelPackage(pkg, relativePath);
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, warnings, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF world model review package validation passed.",
  packages: results,
  warnings,
  errors
}, null, 2));
