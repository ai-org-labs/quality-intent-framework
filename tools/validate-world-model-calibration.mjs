#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/world-model-calibration-package.json"];
const packagePaths = process.argv.slice(2);
const inputs = packagePaths.length > 0 ? packagePaths : defaultPackages;
const projectRoot = process.cwd();

const errors = [];
const warnings = [];
const results = [];

const referencedEntityCollections = [
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

const matchScores = new Map([
  ["exact", 1],
  ["partial", 0.5],
  ["missed", 0],
  ["spurious", 0],
  ["disagreement", 0]
]);

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

function rounded(value) {
  return Math.round(value * 100) / 100;
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function sameSet(a, b) {
  const aa = sortedUnique(a);
  const bb = sortedUnique(b);
  return aa.length === bb.length && aa.every((value, index) => value === bb[index]);
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
  for (const collection of referencedEntityCollections) {
    const items = Array.isArray(pkg[collection]) ? pkg[collection] : [];
    for (const item of items) {
      addEntity(index, collection, item);
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

function checkPackageRefs(packageRefs, packagePath) {
  const packageRefIndex = indexById(packageRefs, `${packagePath}:packageRefs`);
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
  return { packageRefIndex, packageIndex };
}

function checkCalibratedFindings(findings, packageIndex, ownerId) {
  if (!Array.isArray(findings)) {
    errors.push(`${ownerId} findings must be an array.`);
    return new Map();
  }
  const findingIndex = indexById(findings, `${ownerId}:findings`);
  for (const finding of findings) {
    for (const field of ["gapObjectType", "missingItem", "expectedDefinition", "verdictEffect", "severity", "rationale"]) {
      checkRequiredString(finding, field, finding.id);
    }
    if (finding.sourceFindingRef !== undefined) {
      resolveEntity(finding.sourceFindingRef, packageIndex, `${finding.id}/sourceFindingRef`);
    }
  }
  return findingIndex;
}

function validateCalibrationPackage(pkg, packagePath) {
  if (pkg.packageType !== "world-model-calibration") {
    errors.push(`${packagePath} must have packageType world-model-calibration.`);
  }
  checkRequiredString(pkg, "runtimeVersion", packagePath);
  checkRequiredString(pkg, "packageId", packagePath);

  const packageRefs = requireArray(pkg, "packageRefs", packagePath);
  const evidenceOrigins = requireArray(pkg, "evidenceOrigins", packagePath);
  const policies = requireArray(pkg, "calibrationPolicies", packagePath);
  const cases = requireArray(pkg, "calibrationCases", packagePath);
  const expertAssessments = requireArray(pkg, "expertAssessments", packagePath);
  const agentAssessments = requireArray(pkg, "agentAssessments", packagePath);
  const findingMatches = requireArray(pkg, "findingMatches", packagePath);
  const suiteHealthRecords = requireArray(pkg, "evaluationSuiteHealthRecords", packagePath);
  const trialVarianceRecords = requireArray(pkg, "trialVarianceRecords", packagePath);
  const frameworkLearningRecords = requireArray(pkg, "frameworkLearningRecords", packagePath);
  const calibrationRuns = requireArray(pkg, "calibrationRuns", packagePath);
  const governanceTriggers = requireArray(pkg, "governanceTriggers", packagePath);

  const { packageRefIndex, packageIndex } = checkPackageRefs(packageRefs, packagePath);
  const evidenceOriginIndex = checkEvidenceOrigins(evidenceOrigins, packagePath);
  const policyIndex = indexById(policies, `${packagePath}:calibrationPolicies`);
  const caseIndex = indexById(cases, `${packagePath}:calibrationCases`);
  const expertAssessmentIndex = indexById(expertAssessments, `${packagePath}:expertAssessments`);
  const agentAssessmentIndex = indexById(agentAssessments, `${packagePath}:agentAssessments`);
  const matchIndex = indexById(findingMatches, `${packagePath}:findingMatches`);
  const suiteHealthIndex = indexById(suiteHealthRecords, `${packagePath}:evaluationSuiteHealthRecords`);
  const trialVarianceIndex = indexById(trialVarianceRecords, `${packagePath}:trialVarianceRecords`);
  const frameworkLearningIndex = indexById(frameworkLearningRecords, `${packagePath}:frameworkLearningRecords`);
  const runIndex = indexById(calibrationRuns, `${packagePath}:calibrationRuns`);
  const triggerIndex = indexById(governanceTriggers, `${packagePath}:governanceTriggers`);

  for (const policy of policies) {
    checkRequiredString(policy, "title", policy.id);
    checkRefs(policy.targetPackageRefs, packageRefIndex, "target package", policy.id);
    if (!Number.isInteger(policy.minimumCaseCount) || policy.minimumCaseCount < 1) {
      errors.push(`${policy.id} minimumCaseCount must be a positive integer.`);
    }
    if (!Number.isInteger(policy.requiredExpertAssessorsPerCase) || policy.requiredExpertAssessorsPerCase < 1) {
      errors.push(`${policy.id} requiredExpertAssessorsPerCase must be a positive integer.`);
    }
    if (!Number.isInteger(policy.minimumTrialCount) || policy.minimumTrialCount < 2) {
      errors.push(`${policy.id} minimumTrialCount must be an integer of at least 2.`);
    }
    if (!Array.isArray(policy.requiredDomains) || policy.requiredDomains.length === 0) {
      errors.push(`${policy.id} must include requiredDomains.`);
    }
    if (typeof policy.requiresUnseenCases !== "boolean") {
      errors.push(`${policy.id} requiresUnseenCases must be boolean.`);
    }
    if (typeof policy.governanceOnFailure !== "boolean") {
      errors.push(`${policy.id} governanceOnFailure must be boolean.`);
    }
    for (const field of ["agreementThreshold", "falsePositiveRateMax", "falseNegativeRateMax"]) {
      checkScore(policy[field], field, policy.id);
    }
    if (policy.scoreRule !== "exact-1-partial-0.5-miss-0") {
      errors.push(`${policy.id} scoreRule must be exact-1-partial-0.5-miss-0.`);
    }
    checkRequiredString(policy, "status", policy.id);
  }

  for (const calibrationCase of cases) {
    for (const field of ["title", "domain", "targetDescription", "sourceArtifact", "decisionContext"]) {
      checkRequiredString(calibrationCase, field, calibrationCase.id);
    }
    if (typeof calibrationCase.unseenCase !== "boolean") {
      errors.push(`${calibrationCase.id} unseenCase must be boolean.`);
    }
    if (!Array.isArray(calibrationCase.expectedGapObjectTypes) || calibrationCase.expectedGapObjectTypes.length === 0) {
      errors.push(`${calibrationCase.id} must include expectedGapObjectTypes.`);
    }
    resolveEntity(calibrationCase.sourceWorldModelRef, packageIndex, `${calibrationCase.id}/sourceWorldModelRef`);
    if (!evidenceOriginIndex.has(calibrationCase.evidenceOriginRef)) {
      errors.push(`${calibrationCase.id} references missing evidence origin: ${calibrationCase.evidenceOriginRef}`);
    }
  }

  const expertFindingIndexes = new Map();
  const expertAssessmentsByCase = new Map();
  for (const assessment of expertAssessments) {
    checkRefs([assessment.caseRef], caseIndex, "calibration case", assessment.id);
    for (const field of ["assessor", "role", "assessmentMode"]) {
      checkRequiredString(assessment, field, assessment.id);
    }
    checkScore(assessment.confidence, "confidence", assessment.id);
    if (!Array.isArray(assessment.expectedFindings) || assessment.expectedFindings.length === 0) {
      errors.push(`${assessment.id} must include expectedFindings.`);
    }
    expertFindingIndexes.set(assessment.id, checkCalibratedFindings(assessment.expectedFindings, packageIndex, `${assessment.id}/expectedFindings`));
    if (!expertAssessmentsByCase.has(assessment.caseRef)) {
      expertAssessmentsByCase.set(assessment.caseRef, []);
    }
    expertAssessmentsByCase.get(assessment.caseRef).push(assessment);
  }

  const agentFindingIndexes = new Map();
  const agentAssessmentsByCase = new Map();
  for (const assessment of agentAssessments) {
    checkRefs([assessment.caseRef], caseIndex, "calibration case", assessment.id);
    for (const field of ["generatedBy", "modelOrAgent", "assessmentMode", "transcriptHandling"]) {
      checkRequiredString(assessment, field, assessment.id);
    }
    if (assessment.transcriptHandling === "hidden-chain-of-thought") {
      errors.push(`${assessment.id} must not store hidden chain-of-thought as calibration evidence.`);
    }
    checkScore(assessment.confidence, "confidence", assessment.id);
    agentFindingIndexes.set(assessment.id, checkCalibratedFindings(assessment.generatedFindings, packageIndex, `${assessment.id}/generatedFindings`));
    if (!agentAssessmentsByCase.has(assessment.caseRef)) {
      agentAssessmentsByCase.set(assessment.caseRef, []);
    }
    agentAssessmentsByCase.get(assessment.caseRef).push(assessment);
  }

  const healthyStatuses = {
    taskOrigin: "verified",
    contamination: "clear",
    solvability: "verified",
    saturation: "not-saturated",
    graders: "calibrated",
    harness: "reproducible",
    infrastructure: "stable",
    drift: "monitored"
  };
  for (const health of suiteHealthRecords) {
    checkRequiredString(health, "title", health.id);
    checkRequiredString(health, "overallStatus", health.id);
    checkRequiredString(health, "assuranceBoundary", health.id);
    checkRefs([health.calibrationRunRef], runIndex, "calibration run", health.id);
    checkRefs([health.policyRef], policyIndex, "calibration policy", health.id);
    checkRefs(health.caseRefs, caseIndex, "calibration case", health.id);

    for (const dimension of Object.keys(healthyStatuses)) {
      if (!health[dimension] || typeof health[dimension] !== "object") {
        errors.push(`${health.id} must include ${dimension}.`);
      } else {
        checkRequiredString(health[dimension], "status", `${health.id}/${dimension}`);
      }
    }
    checkRefs(health.taskOrigin?.evidenceOriginRefs, evidenceOriginIndex, "evidence origin", `${health.id}/taskOrigin`);
    checkRequiredString(health.taskOrigin ?? {}, "distributionSummary", `${health.id}/taskOrigin`);
    checkRequiredString(health.contamination ?? {}, "checkMethod", `${health.id}/contamination`);
    checkRequiredString(health.contamination ?? {}, "finding", `${health.id}/contamination`);
    checkRequiredString(health.solvability ?? {}, "reviewMethod", `${health.id}/solvability`);
    checkRefs(health.solvability?.reviewedCaseRefs, caseIndex, "reviewed calibration case", `${health.id}/solvability`);
    if (!Array.isArray(health.solvability?.unresolvedCaseRefs)) {
      errors.push(`${health.id}/solvability unresolvedCaseRefs must be an array.`);
    } else {
      for (const ref of health.solvability.unresolvedCaseRefs) {
        if (!caseIndex.has(ref)) errors.push(`${health.id}/solvability references missing unresolved calibration case: ${ref}`);
      }
    }
    if (!sameSet(health.solvability?.reviewedCaseRefs ?? [], health.caseRefs ?? [])) {
      errors.push(`${health.id} solvability reviewedCaseRefs must equal caseRefs.`);
    }
    checkRequiredString(health.saturation ?? {}, "detectionMethod", `${health.id}/saturation`);
    checkRequiredString(health.saturation ?? {}, "rationale", `${health.id}/saturation`);
    if (typeof health.saturation?.saturated !== "boolean") errors.push(`${health.id}/saturation saturated must be boolean.`);
    checkRefs(health.graders?.expertAssessmentRefs, expertAssessmentIndex, "expert assessment", `${health.id}/graders`);
    checkRefs(health.graders?.agentAssessmentRefs, agentAssessmentIndex, "agent assessment", `${health.id}/graders`);
    checkRequiredString(health.graders ?? {}, "calibrationMethod", `${health.id}/graders`);
    checkRequiredString(health.graders ?? {}, "disagreementPolicy", `${health.id}/graders`);
    checkRequiredString(health.harness ?? {}, "configuration", `${health.id}/harness`);
    checkRequiredString(health.harness ?? {}, "reproducibilityEvidence", `${health.id}/harness`);
    checkRequiredString(health.infrastructure ?? {}, "environment", `${health.id}/infrastructure`);
    checkRequiredString(health.infrastructure ?? {}, "configuration", `${health.id}/infrastructure`);
    if (!Array.isArray(health.infrastructure?.incidentRefs)) errors.push(`${health.id}/infrastructure incidentRefs must be an array.`);
    checkRequiredString(health.drift ?? {}, "owner", `${health.id}/drift`);
    checkRequiredString(health.drift ?? {}, "reviewCadence", `${health.id}/drift`);
    checkRequiredString(health.drift ?? {}, "nextReviewAt", `${health.id}/drift`);
    if (!Array.isArray(health.drift?.triggerConditions) || health.drift.triggerConditions.length === 0) {
      errors.push(`${health.id}/drift must include triggerConditions.`);
    }
    if (!Array.isArray(health.governanceTriggerRefs)) {
      errors.push(`${health.id} governanceTriggerRefs must be an array.`);
    } else {
      for (const ref of health.governanceTriggerRefs) {
        if (!triggerIndex.has(ref)) errors.push(`${health.id} references missing governance trigger: ${ref}`);
      }
    }

    const unhealthyDimensions = Object.entries(healthyStatuses)
      .filter(([dimension, expected]) => health[dimension]?.status !== expected)
      .map(([dimension]) => dimension);
    if (health.overallStatus === "healthy") {
      if (unhealthyDimensions.length > 0) {
        errors.push(`${health.id} overallStatus healthy conflicts with unhealthy dimensions: ${unhealthyDimensions.join(", ")}.`);
      }
      if (health.saturation?.saturated !== false || (health.solvability?.unresolvedCaseRefs ?? []).length > 0) {
        errors.push(`${health.id} overallStatus healthy requires no saturation and no unresolved cases.`);
      }
      const empiricalOrigins = (health.taskOrigin?.evidenceOriginRefs ?? []).map((ref) => evidenceOriginIndex.get(ref));
      if (empiricalOrigins.some((origin) => !origin || !["observed-operational", "historical-record"].includes(origin.originKind) || origin.status !== "verified")) {
        errors.push(`${health.id} overallStatus healthy requires verified observed-operational or historical-record origins.`);
      }
      const unresolvedTriggers = (health.governanceTriggerRefs ?? []).map((ref) => triggerIndex.get(ref)).filter((trigger) => trigger?.status !== "resolved");
      if (unresolvedTriggers.length > 0) errors.push(`${health.id} overallStatus healthy cannot retain unresolved governance triggers.`);
    } else if ((health.governanceTriggerRefs ?? []).length === 0) {
      errors.push(`${health.id} non-healthy suite status requires governanceTriggerRefs.`);
    }
  }

  const empiricalOriginKinds = new Set(["observed-operational", "historical-record"]);
  const supportedVarianceMetrics = new Set(["agreementScore", "falsePositiveRate", "falseNegativeRate"]);
  const supportedVarianceStatuses = new Set(["sufficient", "provisional", "blocked", "stale"]);
  const supportedInfrastructureStatuses = new Set(["controlled", "bounded", "unresolved", "incident-affected"]);
  const supportedProfileStatuses = new Set(["stable", "degraded", "incident-open", "unknown"]);
  for (const variance of trialVarianceRecords) {
    checkRequiredString(variance, "title", variance.id);
    checkRequiredString(variance, "metric", variance.id);
    checkRequiredString(variance, "overallStatus", variance.id);
    checkRequiredString(variance, "assuranceBoundary", variance.id);
    if (!supportedVarianceMetrics.has(variance.metric)) errors.push(`${variance.id} metric is not supported.`);
    if (!supportedVarianceStatuses.has(variance.overallStatus)) errors.push(`${variance.id} overallStatus is not supported.`);
    checkRefs([variance.calibrationRunRef], runIndex, "calibration run", variance.id);
    checkRefs([variance.suiteHealthRecordRef], suiteHealthIndex, "evaluation suite health record", variance.id);
    checkRefs(variance.evidenceOriginRefs, evidenceOriginIndex, "evidence origin", variance.id);

    const measurements = Array.isArray(variance.trialMeasurements) ? variance.trialMeasurements : [];
    if (measurements.length < 2) errors.push(`${variance.id} must include at least two trialMeasurements.`);
    const measurementIndex = indexById(measurements, `${variance.id}:trialMeasurements`);
    const profiles = Array.isArray(variance.infrastructureProfiles) ? variance.infrastructureProfiles : [];
    if (profiles.length === 0) errors.push(`${variance.id} must include infrastructureProfiles.`);
    const profileIndex = indexById(profiles, `${variance.id}:infrastructureProfiles`);

    for (const measurement of measurements) {
      checkScore(measurement.value, "value", measurement.id);
      checkRequiredString(measurement, "infrastructureProfileRef", measurement.id);
      checkRequiredString(measurement, "observedAt", measurement.id);
      if (!profileIndex.has(measurement.infrastructureProfileRef)) {
        errors.push(`${measurement.id} references missing infrastructure profile: ${measurement.infrastructureProfileRef}`);
      }
      if (typeof measurement.included !== "boolean") errors.push(`${measurement.id} included must be boolean.`);
      if (typeof measurement.exclusionRationale !== "string") errors.push(`${measurement.id} exclusionRationale must be a string.`);
      if (measurement.included === false && (typeof measurement.exclusionRationale !== "string" || measurement.exclusionRationale.trim() === "")) {
        errors.push(`${measurement.id} excluded trial requires exclusionRationale.`);
      }
    }
    for (const profile of profiles) {
      for (const field of ["environment", "runtime", "resourceEnvelope", "timeLimit", "concurrency", "status"]) {
        checkRequiredString(profile, field, profile.id);
      }
      if (!supportedProfileStatuses.has(profile.status)) errors.push(`${profile.id} status is not supported.`);
      if (!Array.isArray(profile.incidentRefs)) errors.push(`${profile.id} incidentRefs must be an array.`);
    }

    const summary = variance.summary ?? {};
    const includedMeasurements = measurements.filter((measurement) => measurement.included === true);
    const includedRefs = includedMeasurements.map((measurement) => measurement.id);
    checkRefs(summary.includedTrialRefs, measurementIndex, "trial measurement", `${variance.id}/summary`);
    if (!sameSet(summary.includedTrialRefs ?? [], includedRefs)) {
      errors.push(`${variance.id} summary includedTrialRefs must equal included trialMeasurements.`);
    }
    const values = includedMeasurements.map((measurement) => measurement.value);
    const expectedCount = values.length;
    const expectedMean = rounded(values.reduce((sum, value) => sum + value, 0) / Math.max(expectedCount, 1));
    const expectedMinimum = values.length > 0 ? Math.min(...values) : 0;
    const expectedMaximum = values.length > 0 ? Math.max(...values) : 0;
    const expectedRange = rounded(expectedMaximum - expectedMinimum);
    if (summary.trialCount !== expectedCount) errors.push(`${variance.id} summary trialCount must reproduce from included trials: expected ${expectedCount}.`);
    if (summary.mean !== expectedMean) errors.push(`${variance.id} summary mean must reproduce from included trials: expected ${expectedMean}.`);
    if (summary.minimum !== expectedMinimum) errors.push(`${variance.id} summary minimum must reproduce from included trials: expected ${expectedMinimum}.`);
    if (summary.maximum !== expectedMaximum) errors.push(`${variance.id} summary maximum must reproduce from included trials: expected ${expectedMaximum}.`);
    if (summary.observedRange !== expectedRange) errors.push(`${variance.id} summary observedRange must reproduce from included trials: expected ${expectedRange}.`);

    const infrastructure = variance.infrastructureAssessment ?? {};
    checkRefs(infrastructure.profileRefs, profileIndex, "infrastructure profile", `${variance.id}/infrastructureAssessment`);
    if (!sameSet(infrastructure.profileRefs ?? [], profiles.map((profile) => profile.id))) {
      errors.push(`${variance.id} infrastructureAssessment profileRefs must equal infrastructureProfiles.`);
    }
    if (!Array.isArray(infrastructure.controlledVariables) || infrastructure.controlledVariables.length === 0) {
      errors.push(`${variance.id} infrastructureAssessment must include controlledVariables.`);
    }
    for (const field of ["knownDifferences", "potentialConfounders"]) {
      if (!Array.isArray(infrastructure[field])) errors.push(`${variance.id} infrastructureAssessment ${field} must be an array.`);
    }
    checkRequiredString(infrastructure, "status", `${variance.id}/infrastructureAssessment`);
    if (!supportedInfrastructureStatuses.has(infrastructure.status)) errors.push(`${variance.id} infrastructureAssessment status is not supported.`);

    const uncertainty = variance.uncertaintyRange ?? {};
    if (uncertainty.rangeKind !== "observed-trial-range") errors.push(`${variance.id} uncertaintyRange rangeKind must be observed-trial-range.`);
    if (uncertainty.calculationMethod !== "minimum-and-maximum-of-included-trials") {
      errors.push(`${variance.id} uncertaintyRange calculationMethod must be minimum-and-maximum-of-included-trials.`);
    }
    if (uncertainty.lower !== expectedMinimum || uncertainty.upper !== expectedMaximum) {
      errors.push(`${variance.id} uncertaintyRange must equal the minimum and maximum included trial values.`);
    }
    checkRequiredString(uncertainty, "interpretation", `${variance.id}/uncertaintyRange`);
    const comparison = variance.comparisonBoundary ?? {};
    checkScore(comparison.minimumMeaningfulDifference, "minimumMeaningfulDifference", `${variance.id}/comparisonBoundary`);
    if (comparison.exactComparisonAllowed !== false) {
      errors.push(`${variance.id} comparisonBoundary exactComparisonAllowed must be false.`);
    }
    checkRequiredString(comparison, "rationale", `${variance.id}/comparisonBoundary`);

    if (!Array.isArray(variance.governanceTriggerRefs)) {
      errors.push(`${variance.id} governanceTriggerRefs must be an array.`);
    } else {
      for (const ref of variance.governanceTriggerRefs) {
        if (!triggerIndex.has(ref)) errors.push(`${variance.id} references missing governance trigger: ${ref}`);
      }
    }
    const run = runIndex.get(variance.calibrationRunRef);
    const health = suiteHealthIndex.get(variance.suiteHealthRecordRef);
    if (health && health.calibrationRunRef !== variance.calibrationRunRef) {
      errors.push(`${variance.id} suiteHealthRecordRef must belong to the same calibration run.`);
    }
    const variancePolicy = run ? policyIndex.get(run.policyRef) : null;
    const empiricalOrigins = (variance.evidenceOriginRefs ?? []).map((ref) => evidenceOriginIndex.get(ref));
    const unresolvedTriggers = (variance.governanceTriggerRefs ?? []).map((ref) => triggerIndex.get(ref)).filter((trigger) => trigger?.status !== "resolved");
    if (variance.overallStatus === "sufficient") {
      if (!variancePolicy || expectedCount < variancePolicy.minimumTrialCount) {
        errors.push(`${variance.id} overallStatus sufficient requires the policy minimumTrialCount.`);
      }
      if (empiricalOrigins.some((origin) => !origin || !empiricalOriginKinds.has(origin.originKind) || origin.status !== "verified")) {
        errors.push(`${variance.id} overallStatus sufficient requires verified observed-operational or historical-record origins.`);
      }
      if (!["controlled", "bounded"].includes(infrastructure.status) || (infrastructure.potentialConfounders ?? []).length > 0) {
        errors.push(`${variance.id} overallStatus sufficient requires controlled or bounded infrastructure without unresolved confounders.`);
      }
      if (profiles.some((profile) => profile.status !== "stable")) {
        errors.push(`${variance.id} overallStatus sufficient requires stable infrastructure profiles.`);
      }
      if (unresolvedTriggers.length > 0) errors.push(`${variance.id} overallStatus sufficient cannot retain unresolved governance triggers.`);
    } else if ((variance.governanceTriggerRefs ?? []).length === 0) {
      errors.push(`${variance.id} non-sufficient uncertainty status requires governanceTriggerRefs.`);
    }
  }

  const learningEvidenceIndex = new Map([
    ...evidenceOriginIndex,
    ...matchIndex,
    ...suiteHealthIndex,
    ...trialVarianceIndex,
    ...runIndex
  ]);
  const supportedLearningStatuses = new Set(["proposed", "accepted", "implemented", "rejected", "rolled-back", "stale"]);
  const supportedAssumptionStatuses = new Set(["supported", "contradicted", "contested", "unresolved"]);
  const supportedChangeTypes = new Set(["schema", "verifier", "guidance", "policy", "workflow", "example", "other"]);
  const supportedDecisions = new Set(["pending", "accepted", "rejected", "deferred", "rolled-back"]);
  const supportedImplementationStatuses = new Set(["not-started", "implemented", "not-applicable", "rolled-back"]);
  for (const learning of frameworkLearningRecords) {
    checkRequiredString(learning, "title", learning.id);
    checkRequiredString(learning, "overallStatus", learning.id);
    checkRequiredString(learning, "assuranceBoundary", learning.id);
    if (!supportedLearningStatuses.has(learning.overallStatus)) errors.push(`${learning.id} overallStatus is not supported.`);
    checkRefs(learning.calibrationRunRefs, runIndex, "calibration run", learning.id);
    checkRefs(learning.evidenceOriginRefs, evidenceOriginIndex, "evidence origin", learning.id);

    const assumption = learning.contradictedAssumption ?? {};
    for (const field of ["statement", "priorRationale", "contradictionSummary", "status"]) {
      checkRequiredString(assumption, field, `${learning.id}/contradictedAssumption`);
    }
    if (!supportedAssumptionStatuses.has(assumption.status)) errors.push(`${learning.id} contradictedAssumption status is not supported.`);
    checkRefs(assumption.contradictionEvidenceRefs, learningEvidenceIndex, "contradiction evidence", `${learning.id}/contradictedAssumption`);

    const change = learning.proposedChange ?? {};
    for (const field of ["targetArtifact", "changeType", "description", "expectedEffect"]) {
      checkRequiredString(change, field, `${learning.id}/proposedChange`);
    }
    if (!supportedChangeTypes.has(change.changeType)) errors.push(`${learning.id} proposedChange changeType is not supported.`);

    const decision = learning.governanceDecision ?? {};
    for (const field of ["decision", "decidedBy", "decidedAt", "rationale"]) {
      checkRequiredString(decision, field, `${learning.id}/governanceDecision`);
    }
    if (!supportedDecisions.has(decision.decision)) errors.push(`${learning.id} governanceDecision decision is not supported.`);

    const implementation = learning.implementation ?? {};
    checkRequiredString(implementation, "status", `${learning.id}/implementation`);
    if (!supportedImplementationStatuses.has(implementation.status)) errors.push(`${learning.id} implementation status is not supported.`);
    for (const field of ["artifactRefs", "validationEvidenceRefs", "rollbackEvidenceRefs"]) {
      if (!Array.isArray(implementation[field])) errors.push(`${learning.id} implementation ${field} must be an array.`);
    }

    const followUp = learning.followUp ?? {};
    checkRequiredString(followUp, "owner", `${learning.id}/followUp`);
    checkRequiredString(followUp, "reviewAt", `${learning.id}/followUp`);
    for (const field of ["successCriteria", "rollbackCriteria"]) {
      if (!Array.isArray(followUp[field]) || followUp[field].length === 0) {
        errors.push(`${learning.id} followUp must include ${field}.`);
      }
    }
    if (!Array.isArray(learning.governanceTriggerRefs)) {
      errors.push(`${learning.id} governanceTriggerRefs must be an array.`);
    } else {
      for (const ref of learning.governanceTriggerRefs) {
        if (!triggerIndex.has(ref)) errors.push(`${learning.id} references missing governance trigger: ${ref}`);
      }
    }

    for (const runRef of learning.calibrationRunRefs ?? []) {
      const linkedRun = runIndex.get(runRef);
      if (linkedRun && !(linkedRun.frameworkLearningRecordRefs ?? []).includes(learning.id)) {
        errors.push(`${learning.id} calibration run ${runRef} must link back through frameworkLearningRecordRefs.`);
      }
    }

    const empiricalOrigins = (learning.evidenceOriginRefs ?? []).map((ref) => evidenceOriginIndex.get(ref));
    const unresolvedTriggers = (learning.governanceTriggerRefs ?? []).map((ref) => triggerIndex.get(ref)).filter((item) => item?.status !== "resolved");
    if (learning.overallStatus === "implemented") {
      if (assumption.status !== "contradicted") errors.push(`${learning.id} implemented learning requires a contradicted assumption.`);
      if (decision.decision !== "accepted") errors.push(`${learning.id} implemented learning requires an accepted governance decision.`);
      if (implementation.status !== "implemented") errors.push(`${learning.id} implemented learning requires implementation status implemented.`);
      if (!Array.isArray(implementation.artifactRefs) || implementation.artifactRefs.length === 0) errors.push(`${learning.id} implemented learning requires artifactRefs.`);
      if (!Array.isArray(implementation.validationEvidenceRefs) || implementation.validationEvidenceRefs.length === 0) errors.push(`${learning.id} implemented learning requires validationEvidenceRefs.`);
      if (empiricalOrigins.some((origin) => !origin || !empiricalOriginKinds.has(origin.originKind) || origin.status !== "verified")) {
        errors.push(`${learning.id} implemented learning requires verified observed-operational or historical-record origins.`);
      }
      if (unresolvedTriggers.length > 0) errors.push(`${learning.id} implemented learning cannot retain unresolved governance triggers.`);
    } else if (learning.overallStatus === "accepted") {
      if (decision.decision !== "accepted" || implementation.status !== "not-started") {
        errors.push(`${learning.id} accepted learning requires accepted governance and not-started implementation.`);
      }
      if ((learning.governanceTriggerRefs ?? []).length === 0) errors.push(`${learning.id} accepted but unimplemented learning requires governanceTriggerRefs.`);
    } else if (learning.overallStatus === "proposed") {
      if (!["pending", "deferred"].includes(decision.decision) || implementation.status !== "not-started") {
        errors.push(`${learning.id} proposed learning requires pending or deferred governance and not-started implementation.`);
      }
      if ((learning.governanceTriggerRefs ?? []).length === 0) errors.push(`${learning.id} proposed learning requires governanceTriggerRefs.`);
    } else if (learning.overallStatus === "rejected") {
      if (decision.decision !== "rejected" || implementation.status !== "not-applicable") {
        errors.push(`${learning.id} rejected learning requires rejected governance and not-applicable implementation.`);
      }
    } else if (learning.overallStatus === "rolled-back") {
      if (decision.decision !== "rolled-back" || implementation.status !== "rolled-back") {
        errors.push(`${learning.id} rolled-back learning requires rolled-back governance and implementation.`);
      }
      if (!Array.isArray(implementation.rollbackEvidenceRefs) || implementation.rollbackEvidenceRefs.length === 0) {
        errors.push(`${learning.id} rolled-back learning requires rollbackEvidenceRefs.`);
      }
    } else if (learning.overallStatus === "stale" && (learning.governanceTriggerRefs ?? []).length === 0) {
      errors.push(`${learning.id} stale learning requires governanceTriggerRefs.`);
    }
  }

  const coveredExpertFindings = new Set();
  const coveredAgentFindings = new Set();

  for (const match of findingMatches) {
    checkRefs([match.caseRef], caseIndex, "calibration case", match.id);
    checkRefs([match.expertAssessmentRef], expertAssessmentIndex, "expert assessment", match.id);
    checkRefs([match.agentAssessmentRef], agentAssessmentIndex, "agent assessment", match.id);
    checkRequiredString(match, "matchType", match.id);
    checkRequiredString(match, "rationale", match.id);
    checkScore(match.score, "score", match.id);

    const expertAssessment = expertAssessmentIndex.get(match.expertAssessmentRef);
    const agentAssessment = agentAssessmentIndex.get(match.agentAssessmentRef);
    if (expertAssessment && expertAssessment.caseRef !== match.caseRef) {
      errors.push(`${match.id} expertAssessmentRef belongs to a different case.`);
    }
    if (agentAssessment && agentAssessment.caseRef !== match.caseRef) {
      errors.push(`${match.id} agentAssessmentRef belongs to a different case.`);
    }

    if (!matchScores.has(match.matchType)) {
      errors.push(`${match.id} matchType must be exact, partial, missed, spurious, or disagreement.`);
    } else if (match.score !== matchScores.get(match.matchType)) {
      errors.push(`${match.id} score must be ${matchScores.get(match.matchType)} for matchType ${match.matchType}.`);
    }

    const expertFindingIndex = expertFindingIndexes.get(match.expertAssessmentRef) ?? new Map();
    const agentFindingIndex = agentFindingIndexes.get(match.agentAssessmentRef) ?? new Map();

    if (["exact", "partial", "disagreement"].includes(match.matchType)) {
      if (!match.expertFindingRef || !expertFindingIndex.has(match.expertFindingRef)) {
        errors.push(`${match.id} references missing expert finding: ${match.expertFindingRef}`);
      } else {
        coveredExpertFindings.add(`${match.expertAssessmentRef}/${match.expertFindingRef}`);
      }
      if (!match.agentFindingRef || !agentFindingIndex.has(match.agentFindingRef)) {
        errors.push(`${match.id} references missing agent finding: ${match.agentFindingRef}`);
      } else {
        coveredAgentFindings.add(`${match.agentAssessmentRef}/${match.agentFindingRef}`);
      }
    } else if (match.matchType === "missed") {
      if (!match.expertFindingRef || !expertFindingIndex.has(match.expertFindingRef)) {
        errors.push(`${match.id} references missing expert finding: ${match.expertFindingRef}`);
      } else {
        coveredExpertFindings.add(`${match.expertAssessmentRef}/${match.expertFindingRef}`);
      }
      if (match.agentFindingRef) {
        errors.push(`${match.id} missed match must not include agentFindingRef.`);
      }
    } else if (match.matchType === "spurious") {
      if (match.expertFindingRef) {
        errors.push(`${match.id} spurious match must not include expertFindingRef.`);
      }
      if (!match.agentFindingRef || !agentFindingIndex.has(match.agentFindingRef)) {
        errors.push(`${match.id} references missing agent finding: ${match.agentFindingRef}`);
      } else {
        coveredAgentFindings.add(`${match.agentAssessmentRef}/${match.agentFindingRef}`);
      }
    }
  }

  for (const assessment of expertAssessments) {
    for (const finding of assessment.expectedFindings ?? []) {
      const key = `${assessment.id}/${finding.id}`;
      if (!coveredExpertFindings.has(key)) {
        errors.push(`${assessment.id} expected finding ${finding.id} is not covered by any findingMatch.`);
      }
    }
  }
  for (const assessment of agentAssessments) {
    for (const finding of assessment.generatedFindings ?? []) {
      const key = `${assessment.id}/${finding.id}`;
      if (!coveredAgentFindings.has(key)) {
        errors.push(`${assessment.id} generated finding ${finding.id} is not covered by any findingMatch.`);
      }
    }
  }

  for (const trigger of governanceTriggers) {
    checkRefs([trigger.sourceCalibrationRunRef], runIndex, "calibration run", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
    }
  }

  for (const run of calibrationRuns) {
    checkRefs([run.policyRef], policyIndex, "calibration policy", run.id);
    checkRefs(run.caseRefs, caseIndex, "calibration case", run.id);
    checkRefs(run.expertAssessmentRefs, expertAssessmentIndex, "expert assessment", run.id);
    checkRefs(run.agentAssessmentRefs, agentAssessmentIndex, "agent assessment", run.id);
    checkRefs(run.findingMatchRefs, matchIndex, "finding match", run.id);
    checkRefs(run.suiteHealthRecordRefs, suiteHealthIndex, "evaluation suite health record", run.id);
    checkRefs(run.trialVarianceRecordRefs, trialVarianceIndex, "trial variance record", run.id);
    checkRefs(run.frameworkLearningRecordRefs, frameworkLearningIndex, "framework learning record", run.id);
    checkRequiredString(run, "conclusion", run.id);
    checkRequiredString(run, "residualRisk", run.id);
    checkRequiredString(run, "status", run.id);
    checkScore(run.agreementScore, "agreementScore", run.id);
    checkScore(run.falsePositiveRate, "falsePositiveRate", run.id);
    checkScore(run.falseNegativeRate, "falseNegativeRate", run.id);

    const policy = policyIndex.get(run.policyRef);
    const runCases = (run.caseRefs ?? []).map((ref) => caseIndex.get(ref)).filter(Boolean);
    const runMatches = (run.findingMatchRefs ?? []).map((ref) => matchIndex.get(ref)).filter(Boolean);
    const runTriggers = (run.governanceTriggerRefs ?? []).map((ref) => triggerIndex.get(ref)).filter(Boolean);
    const runHealthRecords = (run.suiteHealthRecordRefs ?? []).map((ref) => suiteHealthIndex.get(ref)).filter(Boolean);
    const runVarianceRecords = (run.trialVarianceRecordRefs ?? []).map((ref) => trialVarianceIndex.get(ref)).filter(Boolean);
    const runLearningRecords = (run.frameworkLearningRecordRefs ?? []).map((ref) => frameworkLearningIndex.get(ref)).filter(Boolean);

    for (const health of runHealthRecords) {
      if (health.calibrationRunRef !== run.id) errors.push(`${run.id} suite health record ${health.id} must reference the same calibration run.`);
      if (health.policyRef !== run.policyRef) errors.push(`${run.id} suite health record ${health.id} must reference the same calibration policy.`);
      if (!sameSet(health.caseRefs ?? [], run.caseRefs ?? [])) errors.push(`${run.id} suite health record ${health.id} caseRefs must equal the run caseRefs.`);
    }
    for (const variance of runVarianceRecords) {
      if (variance.calibrationRunRef !== run.id) errors.push(`${run.id} trial variance record ${variance.id} must reference the same calibration run.`);
      if (!(run.suiteHealthRecordRefs ?? []).includes(variance.suiteHealthRecordRef)) {
        errors.push(`${run.id} trial variance record ${variance.id} must reference one of the run suiteHealthRecordRefs.`);
      }
    }
    for (const learning of runLearningRecords) {
      if (!(learning.calibrationRunRefs ?? []).includes(run.id)) {
        errors.push(`${run.id} framework learning record ${learning.id} must reference the same calibration run.`);
      }
    }

    if (run.caseCount !== (run.caseRefs ?? []).length) {
      errors.push(`${run.id} caseCount must equal caseRefs length.`);
    }

    const actualDomains = sortedUnique(runCases.map((entry) => entry.domain));
    if (!sameSet(run.domainCoverage ?? [], actualDomains)) {
      errors.push(`${run.id} domainCoverage must equal the domains of caseRefs.`);
    }

    const agreement = rounded(runMatches.reduce((sum, match) => sum + (match?.score ?? 0), 0) / Math.max(runMatches.length, 1));
    const falsePositiveRate = rounded(runMatches.filter((match) => match?.matchType === "spurious").length / Math.max(runMatches.length, 1));
    const falseNegativeRate = rounded(runMatches.filter((match) => match?.matchType === "missed").length / Math.max(runMatches.length, 1));
    if (run.agreementScore !== agreement) {
      errors.push(`${run.id} agreementScore must reproduce from findingMatch scores: expected ${agreement}.`);
    }
    if (run.falsePositiveRate !== falsePositiveRate) {
      errors.push(`${run.id} falsePositiveRate must reproduce from spurious findingMatches: expected ${falsePositiveRate}.`);
    }
    if (run.falseNegativeRate !== falseNegativeRate) {
      errors.push(`${run.id} falseNegativeRate must reproduce from missed findingMatches: expected ${falseNegativeRate}.`);
    }

    if (policy) {
      const failures = [];
      if ((run.caseRefs ?? []).length < policy.minimumCaseCount) {
        failures.push("insufficient-case-count");
      }
      for (const domain of policy.requiredDomains ?? []) {
        if (!actualDomains.includes(domain)) {
          failures.push(`missing-domain:${domain}`);
        }
      }
      if (policy.requiresUnseenCases && runCases.some((entry) => entry.unseenCase !== true)) {
        failures.push("non-unseen-case");
      }
      for (const caseRef of run.caseRefs ?? []) {
        const expertCount = (run.expertAssessmentRefs ?? [])
          .map((ref) => expertAssessmentIndex.get(ref))
          .filter((assessment) => assessment?.caseRef === caseRef).length;
        if (expertCount < policy.requiredExpertAssessorsPerCase) {
          failures.push(`insufficient-experts:${caseRef}`);
        }
        const agentCount = (run.agentAssessmentRefs ?? [])
          .map((ref) => agentAssessmentIndex.get(ref))
          .filter((assessment) => assessment?.caseRef === caseRef).length;
        if (agentCount < 1) {
          failures.push(`missing-agent-assessment:${caseRef}`);
        }
      }
      if (run.agreementScore < policy.agreementThreshold) {
        failures.push("low-agreement");
      }
      if (run.falsePositiveRate > policy.falsePositiveRateMax) {
        failures.push("high-false-positive-rate");
      }
      if (run.falseNegativeRate > policy.falseNegativeRateMax) {
        failures.push("high-false-negative-rate");
      }

      if (failures.length > 0 && policy.governanceOnFailure && runTriggers.length === 0) {
        errors.push(`${run.id} calibration failures require governanceTriggerRefs: ${failures.join(", ")}.`);
      }
      if (failures.length > 0 && run.conclusion === "calibrated") {
        errors.push(`${run.id} conclusion cannot be calibrated while calibration failures exist: ${failures.join(", ")}.`);
      }
      if (failures.length === 0 && run.conclusion === "failed") {
        errors.push(`${run.id} conclusion failed is inconsistent with passing calibration thresholds.`);
      }
      if (run.conclusion === "calibrated" && !runHealthRecords.some((health) => health.overallStatus === "healthy")) {
        errors.push(`${run.id} conclusion calibrated requires a healthy evaluation suite health record.`);
      }
      if (run.conclusion === "calibrated" && !runVarianceRecords.some((variance) => variance.overallStatus === "sufficient")) {
        errors.push(`${run.id} conclusion calibrated requires a sufficient trial variance record.`);
      }
    }

    for (const triggerRef of run.governanceTriggerRefs ?? []) {
      const trigger = triggerIndex.get(triggerRef);
      if (!trigger) {
        errors.push(`${run.id} references missing governance trigger: ${triggerRef}`);
      } else if (trigger.sourceCalibrationRunRef !== run.id) {
        errors.push(`${run.id} governance trigger ${triggerRef} must reference the same calibration run.`);
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
    if (!(boundary.doesNotClaim ?? []).includes("change count as learning")) {
      errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming change count as learning.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      packageRefs: packageRefs.length,
      evidenceOrigins: evidenceOrigins.length,
      calibrationPolicies: policies.length,
      calibrationCases: cases.length,
      expertAssessments: expertAssessments.length,
      agentAssessments: agentAssessments.length,
      findingMatches: findingMatches.length,
      evaluationSuiteHealthRecords: suiteHealthRecords.length,
      trialVarianceRecords: trialVarianceRecords.length,
      frameworkLearningRecords: frameworkLearningRecords.length,
      calibrationRuns: calibrationRuns.length,
      governanceTriggers: governanceTriggers.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) {
    validateCalibrationPackage(pkg, relativePath);
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, warnings, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF world model calibration package validation passed.",
  packages: results,
  warnings,
  errors
}, null, 2));
