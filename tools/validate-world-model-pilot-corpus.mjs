#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/world-model-pilot-corpus-package.json"];
const packagePaths = process.argv.slice(2);
const inputs = packagePaths.length > 0 ? packagePaths : defaultPackages;
const projectRoot = process.cwd();

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

function checkTrust(trust, ownerId) {
  if (!trust || typeof trust !== "object") {
    errors.push(`${ownerId} must include trust.`);
    return;
  }
  if (!Array.isArray(trust.sources) || trust.sources.length === 0) {
    errors.push(`${ownerId} trust.sources must include at least one source.`);
  }
  checkRequiredString(trust, "generatedBy", `${ownerId}/trust`);
  if (!Array.isArray(trust.verifiedBy)) {
    errors.push(`${ownerId} trust.verifiedBy must be an array.`);
  }
  checkRequiredString(trust, "status", `${ownerId}/trust`);
  checkRequiredString(trust, "staleAfter", `${ownerId}/trust`);
  if (trust.status === "verified" && trust.verifiedBy.length === 0) {
    errors.push(`${ownerId} trust verified status requires verifiedBy.`);
  }
}

function checkPackageRefs(packageRefs, packagePath) {
  const packageRefIndex = indexById(packageRefs, `${packagePath}:packageRefs`);
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
    if (referenced && referenced.packageType !== ref.packageType) {
      errors.push(`${ref.id} expected packageType ${ref.packageType} but found ${referenced.packageType}.`);
    }
  }
  return packageRefIndex;
}

function privacyReady(control) {
  if (!control) return false;
  if (control.redactionRequired === false) {
    return control.redactionState === "not-required" || control.redactionState === "verified";
  }
  return control.redactionState === "redacted" || control.redactionState === "verified";
}

function validatePilotCorpusPackage(pkg, packagePath) {
  if (pkg.packageType !== "world-model-pilot-corpus") {
    errors.push(`${packagePath} must have packageType world-model-pilot-corpus.`);
  }
  checkRequiredString(pkg, "runtimeVersion", packagePath);
  checkRequiredString(pkg, "packageId", packagePath);

  const packageRefs = requireArray(pkg, "packageRefs", packagePath);
  const pilotSources = requireArray(pkg, "pilotSources", packagePath);
  const privacyControls = requireArray(pkg, "privacyControls", packagePath);
  const samplingPolicies = requireArray(pkg, "samplingPolicies", packagePath);
  const pilotCases = requireArray(pkg, "pilotCases", packagePath);
  const caseNormalizationSteps = requireArray(pkg, "caseNormalizationSteps", packagePath);
  const expertPanels = requireArray(pkg, "expertPanels", packagePath);
  const adjudicationRubrics = requireArray(pkg, "adjudicationRubrics", packagePath);
  const ingestionRuns = requireArray(pkg, "ingestionRuns", packagePath);
  const governanceTriggers = requireArray(pkg, "governanceTriggers", packagePath);

  checkPackageRefs(packageRefs, packagePath);
  const sourceIndex = indexById(pilotSources, `${packagePath}:pilotSources`);
  const privacyIndex = indexById(privacyControls, `${packagePath}:privacyControls`);
  const policyIndex = indexById(samplingPolicies, `${packagePath}:samplingPolicies`);
  const caseIndex = indexById(pilotCases, `${packagePath}:pilotCases`);
  const normalizationIndex = indexById(caseNormalizationSteps, `${packagePath}:caseNormalizationSteps`);
  const panelIndex = indexById(expertPanels, `${packagePath}:expertPanels`);
  const rubricIndex = indexById(adjudicationRubrics, `${packagePath}:adjudicationRubrics`);
  const runIndex = indexById(ingestionRuns, `${packagePath}:ingestionRuns`);
  const triggerIndex = indexById(governanceTriggers, `${packagePath}:governanceTriggers`);

  for (const source of pilotSources) {
    for (const field of ["sourceType", "sourceArtifact", "domain", "sensitivity", "owner", "status"]) {
      checkRequiredString(source, field, source.id);
    }
    checkTrust(source.trust, source.id);
  }

  for (const control of privacyControls) {
    checkRefs([control.sourceRef], sourceIndex, "pilot source", control.id);
    for (const field of ["classification", "redactionState", "allowedUse", "reviewer", "status"]) {
      checkRequiredString(control, field, control.id);
    }
    if (typeof control.redactionRequired !== "boolean") {
      errors.push(`${control.id} redactionRequired must be boolean.`);
    }
  }

  for (const policy of samplingPolicies) {
    checkRequiredString(policy, "title", policy.id);
    if (!Number.isInteger(policy.minimumCaseCount) || policy.minimumCaseCount < 1) {
      errors.push(`${policy.id} minimumCaseCount must be a positive integer.`);
    }
    if (!Array.isArray(policy.requiredDomains) || policy.requiredDomains.length === 0) {
      errors.push(`${policy.id} must include requiredDomains.`);
    }
    for (const field of ["requiresUnseenCases", "syntheticAllowed", "sourceDiversityRequired", "governanceOnFailure"]) {
      if (typeof policy[field] !== "boolean") {
        errors.push(`${policy.id} ${field} must be boolean.`);
      }
    }
    checkScore(policy.minimumRealCaseRatio, "minimumRealCaseRatio", policy.id);
    checkRequiredString(policy, "status", policy.id);
  }

  for (const pilotCase of pilotCases) {
    checkRefs([pilotCase.sourceRef], sourceIndex, "pilot source", pilotCase.id);
    checkRefs([pilotCase.privacyControlRef], privacyIndex, "privacy control", pilotCase.id);
    for (const field of ["title", "domain", "targetDescription", "decisionContext", "caseKind", "sourceExcerptSummary", "expectedUse", "status"]) {
      checkRequiredString(pilotCase, field, pilotCase.id);
    }
    if (typeof pilotCase.unseenCase !== "boolean") {
      errors.push(`${pilotCase.id} unseenCase must be boolean.`);
    }
  }

  for (const step of caseNormalizationSteps) {
    checkRefs([step.caseRef], caseIndex, "pilot case", step.id);
    checkRefs([step.sourceRef], sourceIndex, "pilot source", step.id);
    for (const field of ["performedBy", "method", "transformationSummary", "status"]) {
      checkRequiredString(step, field, step.id);
    }
    if (!Array.isArray(step.preservedSignals) || step.preservedSignals.length === 0) {
      errors.push(`${step.id} preservedSignals must include at least one signal.`);
    }
    if (typeof step.removedSensitiveData !== "boolean") {
      errors.push(`${step.id} removedSensitiveData must be boolean.`);
    }
    checkScore(step.confidence, "confidence", step.id);
    const pilotCase = caseIndex.get(step.caseRef);
    if (pilotCase && pilotCase.sourceRef !== step.sourceRef) {
      errors.push(`${step.id} sourceRef must match its pilot case sourceRef.`);
    }
    const privacy = pilotCase ? privacyIndex.get(pilotCase.privacyControlRef) : null;
    if (privacy?.redactionRequired && step.removedSensitiveData !== true) {
      errors.push(`${step.id} must remove sensitive data for redaction-required case ${step.caseRef}.`);
    }
  }

  for (const panel of expertPanels) {
    checkRequiredString(panel, "name", panel.id);
    if (!Array.isArray(panel.panelMembers) || panel.panelMembers.length === 0) {
      errors.push(`${panel.id} panelMembers must include at least one member.`);
    }
    if (!Number.isInteger(panel.quorum) || panel.quorum < 1) {
      errors.push(`${panel.id} quorum must be a positive integer.`);
    }
    checkRequiredString(panel, "conflictPolicy", panel.id);
    checkRequiredString(panel, "status", panel.id);
    const independentMembers = (panel.panelMembers ?? []).filter((member) => member?.independent === true).length;
    if (panel.quorum > independentMembers) {
      errors.push(`${panel.id} quorum must be satisfied by independent panel members.`);
    }
  }

  for (const rubric of adjudicationRubrics) {
    checkRequiredString(rubric, "title", rubric.id);
    if (!Array.isArray(rubric.criteria) || rubric.criteria.length === 0) {
      errors.push(`${rubric.id} criteria must include at least one criterion.`);
    }
    checkRequiredString(rubric, "disagreementPolicy", rubric.id);
    checkRequiredString(rubric, "status", rubric.id);
  }

  for (const trigger of governanceTriggers) {
    checkRefs([trigger.sourceIngestionRunRef], runIndex, "ingestion run", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
    }
  }

  for (const run of ingestionRuns) {
    checkRefs([run.policyRef], policyIndex, "sampling policy", run.id);
    checkRefs(run.sourceRefs, sourceIndex, "pilot source", run.id);
    checkRefs(run.caseRefs, caseIndex, "pilot case", run.id);
    checkRefs(run.normalizationStepRefs, normalizationIndex, "normalization step", run.id);
    checkRefs(run.privacyControlRefs, privacyIndex, "privacy control", run.id);
    checkRefs([run.expertPanelRef], panelIndex, "expert panel", run.id);
    checkRefs([run.adjudicationRubricRef], rubricIndex, "adjudication rubric", run.id);
    for (const field of ["conclusion", "residualRisk", "status"]) {
      checkRequiredString(run, field, run.id);
    }
    checkScore(run.realCaseRatio, "realCaseRatio", run.id);
    if (typeof run.privacyReady !== "boolean") {
      errors.push(`${run.id} privacyReady must be boolean.`);
    }

    const policy = policyIndex.get(run.policyRef);
    const runCases = (run.caseRefs ?? []).map((ref) => caseIndex.get(ref)).filter(Boolean);
    const runSources = (run.sourceRefs ?? []).map((ref) => sourceIndex.get(ref)).filter(Boolean);
    const runPrivacy = (run.privacyControlRefs ?? []).map((ref) => privacyIndex.get(ref)).filter(Boolean);
    const runTriggers = (run.governanceTriggerRefs ?? []).map((ref) => triggerIndex.get(ref)).filter(Boolean);

    if (run.caseCount !== (run.caseRefs ?? []).length) {
      errors.push(`${run.id} caseCount must equal caseRefs length.`);
    }
    const actualDomains = sortedUnique(runCases.map((entry) => entry.domain));
    if (!sameSet(run.domainCoverage ?? [], actualDomains)) {
      errors.push(`${run.id} domainCoverage must equal the domains of caseRefs.`);
    }
    const realCaseRatio = rounded(runCases.filter((entry) => entry.caseKind?.startsWith("real")).length / Math.max(runCases.length, 1));
    if (run.realCaseRatio !== realCaseRatio) {
      errors.push(`${run.id} realCaseRatio must reproduce from real pilot cases: expected ${realCaseRatio}.`);
    }
    const actualPrivacyReady = runPrivacy.every(privacyReady);
    if (run.privacyReady !== actualPrivacyReady) {
      errors.push(`${run.id} privacyReady must reproduce from referenced privacy controls: expected ${actualPrivacyReady}.`);
    }
    for (const stepRef of run.normalizationStepRefs ?? []) {
      const step = normalizationIndex.get(stepRef);
      if (step && !(run.caseRefs ?? []).includes(step.caseRef)) {
        errors.push(`${run.id} normalization step ${stepRef} must reference one of the run caseRefs.`);
      }
    }
    for (const triggerRef of run.governanceTriggerRefs ?? []) {
      const trigger = triggerIndex.get(triggerRef);
      if (!trigger) {
        errors.push(`${run.id} references missing governance trigger: ${triggerRef}`);
      } else if (trigger.sourceIngestionRunRef !== run.id) {
        errors.push(`${run.id} governance trigger ${triggerRef} must reference the same ingestion run.`);
      }
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
      if (policy.syntheticAllowed === false && runCases.some((entry) => entry.caseKind === "synthetic")) {
        failures.push("synthetic-case-not-allowed");
      }
      if (run.realCaseRatio < policy.minimumRealCaseRatio) {
        failures.push("low-real-case-ratio");
      }
      const sourceTypes = sortedUnique(runSources.map((entry) => entry.sourceType));
      if (policy.sourceDiversityRequired && sourceTypes.length < 2) {
        failures.push("insufficient-source-diversity");
      }
      if (!run.privacyReady) {
        failures.push("privacy-not-ready");
      }
      if (failures.length > 0 && policy.governanceOnFailure && runTriggers.length === 0) {
        errors.push(`${run.id} ingestion failures require governanceTriggerRefs: ${failures.join(", ")}.`);
      }
      if (failures.length > 0 && run.conclusion === "ready") {
        errors.push(`${run.id} conclusion cannot be ready while ingestion failures exist: ${failures.join(", ")}.`);
      }
      if (failures.length === 0 && run.conclusion === "blocked") {
        errors.push(`${run.id} conclusion blocked is inconsistent with passing ingestion thresholds.`);
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
      pilotSources: pilotSources.length,
      privacyControls: privacyControls.length,
      samplingPolicies: samplingPolicies.length,
      pilotCases: pilotCases.length,
      caseNormalizationSteps: caseNormalizationSteps.length,
      expertPanels: expertPanels.length,
      adjudicationRubrics: adjudicationRubrics.length,
      ingestionRuns: ingestionRuns.length,
      governanceTriggers: governanceTriggers.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) {
    validatePilotCorpusPackage(pkg, relativePath);
  }
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF world model pilot corpus package validation passed.",
  packages: results,
  errors
}, null, 2));
