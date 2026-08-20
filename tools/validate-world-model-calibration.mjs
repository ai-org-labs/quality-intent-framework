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
  const policies = requireArray(pkg, "calibrationPolicies", packagePath);
  const cases = requireArray(pkg, "calibrationCases", packagePath);
  const expertAssessments = requireArray(pkg, "expertAssessments", packagePath);
  const agentAssessments = requireArray(pkg, "agentAssessments", packagePath);
  const findingMatches = requireArray(pkg, "findingMatches", packagePath);
  const calibrationRuns = requireArray(pkg, "calibrationRuns", packagePath);
  const governanceTriggers = requireArray(pkg, "governanceTriggers", packagePath);

  const { packageRefIndex, packageIndex } = checkPackageRefs(packageRefs, packagePath);
  const policyIndex = indexById(policies, `${packagePath}:calibrationPolicies`);
  const caseIndex = indexById(cases, `${packagePath}:calibrationCases`);
  const expertAssessmentIndex = indexById(expertAssessments, `${packagePath}:expertAssessments`);
  const agentAssessmentIndex = indexById(agentAssessments, `${packagePath}:agentAssessments`);
  const matchIndex = indexById(findingMatches, `${packagePath}:findingMatches`);
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
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      packageRefs: packageRefs.length,
      calibrationPolicies: policies.length,
      calibrationCases: cases.length,
      expertAssessments: expertAssessments.length,
      agentAssessments: agentAssessments.length,
      findingMatches: findingMatches.length,
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
