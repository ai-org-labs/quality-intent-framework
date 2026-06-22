#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const packagePath = process.argv[2] || "examples/qif-sample-package.json";
const projectRoot = process.cwd();
const absolutePackagePath = path.resolve(projectRoot, packagePath);

const errors = [];
const warnings = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`Cannot read JSON at ${filePath}: ${error.message}`);
    return null;
  }
}

function round2(value) {
  return Math.round(value * 100) / 100;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function evidenceConfidence(inputs) {
  return round2(clamp01(
    inputs.sourceReliability * 0.25 +
    inputs.relevance * 0.25 +
    inputs.coverage * 0.20 +
    inputs.recency * 0.15 +
    inputs.independence * 0.15 -
    inputs.contradictionPenalty
  ));
}

function average(values) {
  if (values.length === 0) {
    return 0;
  }
  return round2(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function requireArray(packageData, key) {
  if (!Array.isArray(packageData[key])) {
    errors.push(`Top-level ${key} must be an array.`);
    return [];
  }
  return packageData[key];
}

function indexById(items, label) {
  const index = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object") {
      errors.push(`${label} contains a non-object item.`);
      continue;
    }
    if (!item.id || typeof item.id !== "string") {
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

const packageData = readJson(absolutePackagePath);

if (!packageData) {
  process.exit(1);
}

checkRequiredString(packageData, "qifVersion", "package");
checkRequiredString(packageData, "packageId", "package");

const missions = requireArray(packageData, "missions");
const stakeholders = requireArray(packageData, "stakeholders");
const contexts = requireArray(packageData, "contexts");
const risks = requireArray(packageData, "risks");
const knowledgeSources = requireArray(packageData, "knowledgeSources");
const qualityIntents = requireArray(packageData, "qualityIntents");
const evidenceItems = requireArray(packageData, "evidenceItems");
const evaluations = requireArray(packageData, "evaluations");
const governanceEvents = requireArray(packageData, "governanceEvents");
const acceptanceGates = requireArray(packageData, "acceptanceGates");
const indicators = Array.isArray(packageData.indicators) ? packageData.indicators : [];

const stakeholderIndex = indexById(stakeholders, "stakeholders");
const contextIndex = indexById(contexts, "contexts");
const riskIndex = indexById(risks, "risks");
const sourceIndex = indexById(knowledgeSources, "knowledgeSources");
const intentIndex = indexById(qualityIntents, "qualityIntents");
const evidenceIndex = indexById(evidenceItems, "evidenceItems");
const missionIndex = indexById(missions, "missions");
const indicatorIndex = indexById(indicators, "indicators");
const evaluationIndex = indexById(evaluations, "evaluations");
const governanceIndex = indexById(governanceEvents, "governanceEvents");
const gateIndex = indexById(acceptanceGates, "acceptanceGates");

void missionIndex;
void indicatorIndex;
void evaluationIndex;
void governanceIndex;
void gateIndex;

for (const mission of missions) {
  checkRequiredString(mission, "statement", mission.id);
  checkRefs(mission.stakeholderRefs, stakeholderIndex, "stakeholder", mission.id);
  checkRefs(mission.contextRefs, contextIndex, "context", mission.id);
}

for (const risk of risks) {
  checkRequiredString(risk, "statement", risk.id);
  checkRequiredString(risk, "lossBoundary", risk.id);
  checkRefs(risk.stakeholderRefs, stakeholderIndex, "stakeholder", risk.id);
  checkRefs(risk.contextRefs, contextIndex, "context", risk.id);
}

for (const source of knowledgeSources) {
  checkRequiredString(source, "title", source.id);
  checkScore(source.reliability, "reliability", source.id);
}

for (const intent of qualityIntents) {
  checkRequiredString(intent, "statement", intent.id);
  checkRequiredString(intent, "purpose", intent.id);
  checkRequiredString(intent, "governanceOwner", intent.id);
  checkRefs(intent.stakeholderRefs, stakeholderIndex, "stakeholder", intent.id);
  checkRefs(intent.contextRefs, contextIndex, "context", intent.id);
  checkRefs(intent.riskRefs, riskIndex, "risk", intent.id);
  checkRefs(intent.sourceRefs, sourceIndex, "knowledge source", intent.id);
  if (intent.status === "active" && intent.governanceOwner.trim() === "") {
    errors.push(`${intent.id} is active but has no governance owner.`);
  }
  if (!Array.isArray(intent.acceptanceCriteria) || intent.acceptanceCriteria.length === 0) {
    errors.push(`${intent.id} must have acceptance criteria.`);
  }
}

for (const evidence of evidenceItems) {
  checkRefs([evidence.sourceRef], sourceIndex, "knowledge source", evidence.id);
  checkRefs(evidence.intentRefs, intentIndex, "quality intent", evidence.id);
  checkRequiredString(evidence, "finding", evidence.id);
  if (!evidence.confidenceInputs || typeof evidence.confidenceInputs !== "object") {
    errors.push(`${evidence.id} is missing confidenceInputs.`);
    continue;
  }
  for (const field of ["sourceReliability", "relevance", "coverage", "recency", "independence", "contradictionPenalty"]) {
    checkScore(evidence.confidenceInputs[field], `confidenceInputs.${field}`, evidence.id);
  }
  const expected = evidenceConfidence(evidence.confidenceInputs);
  if (Math.abs(expected - evidence.confidence) > 0.01) {
    errors.push(`${evidence.id} confidence ${evidence.confidence} does not match expected ${expected}.`);
  }
}

for (const indicator of indicators) {
  checkRefs([indicator.linkedIntentRef], intentIndex, "quality intent", indicator.id);
  checkRefs([indicator.linkedRiskRef], riskIndex, "risk", indicator.id);
  if (indicator.metricKind === "activity-count" && indicator.interpretation !== "evidence-only") {
    errors.push(`${indicator.id} is an activity-count indicator but is not evidence-only.`);
  }
  if (indicator.interpretation === "quality-itself") {
    errors.push(`${indicator.id} treats an indicator as quality itself.`);
  }
}

for (const evaluation of evaluations) {
  checkRefs(evaluation.evaluatedIntentRefs, intentIndex, "quality intent", evaluation.id);
  checkRefs(evaluation.evidenceRefs, evidenceIndex, "evidence", evaluation.id);
  if (!evaluation.confidencePolicy) {
    errors.push(`${evaluation.id} is missing confidencePolicy.`);
    continue;
  }
  checkScore(evaluation.confidencePolicy.partialThreshold, "partialThreshold", evaluation.id);
  checkScore(evaluation.confidencePolicy.achievedThreshold, "achievedThreshold", evaluation.id);
  if (evaluation.confidencePolicy.partialThreshold > evaluation.confidencePolicy.achievedThreshold) {
    errors.push(`${evaluation.id} partialThreshold cannot exceed achievedThreshold.`);
  }
  if (!Array.isArray(evaluation.verdicts) || evaluation.verdicts.length === 0) {
    errors.push(`${evaluation.id} must include verdicts.`);
    continue;
  }

  for (const verdict of evaluation.verdicts) {
    const owner = `${evaluation.id}/${verdict.intentRef || "missing-intent"}`;
    checkRefs([verdict.intentRef], intentIndex, "quality intent", owner);
    checkRefs(verdict.evidenceRefs, evidenceIndex, "evidence", owner);
    const verdictEvidence = (verdict.evidenceRefs || []).map((ref) => evidenceIndex.get(ref)).filter(Boolean);
    const expectedConfidence = average(verdictEvidence.map((item) => item.confidence));
    if (Math.abs(expectedConfidence - verdict.confidence) > 0.01) {
      errors.push(`${owner} confidence ${verdict.confidence} does not match evidence mean ${expectedConfidence}.`);
    }
    if (verdict.decision === "achieved" && verdict.confidence < evaluation.confidencePolicy.achievedThreshold) {
      errors.push(`${owner} is achieved below achievedThreshold ${evaluation.confidencePolicy.achievedThreshold}.`);
    }
    if (verdict.decision === "partially-achieved" && verdict.confidence < evaluation.confidencePolicy.partialThreshold) {
      errors.push(`${owner} is partially-achieved below partialThreshold ${evaluation.confidencePolicy.partialThreshold}.`);
    }
    if (verdict.decision === "achieved" && verdictEvidence.some((item) => item.polarity === "contradicts" && item.confidence >= 0.6)) {
      errors.push(`${owner} is achieved despite high-confidence contradictory evidence.`);
    }
  }
}

for (const event of governanceEvents) {
  const targetExists =
    intentIndex.has(event.targetRef) ||
    evidenceIndex.has(event.targetRef) ||
    riskIndex.has(event.targetRef);
  if (!targetExists) {
    errors.push(`${event.id} references missing governance target ${event.targetRef}.`);
  }
  checkRefs(event.evidenceRefs, evidenceIndex, "evidence", event.id);
}

for (const gate of acceptanceGates) {
  if (!Array.isArray(gate.requiredArtifactRefs) || gate.requiredArtifactRefs.length === 0) {
    errors.push(`${gate.id} must include requiredArtifactRefs.`);
  } else {
    for (const artifactRef of gate.requiredArtifactRefs) {
      const artifactPath = path.resolve(projectRoot, artifactRef);
      if (!fs.existsSync(artifactPath)) {
        errors.push(`${gate.id} required artifact does not exist: ${artifactRef}`);
      }
    }
  }
  if (!Array.isArray(gate.criteria) || gate.criteria.length === 0) {
    errors.push(`${gate.id} must include criteria.`);
  } else {
    const failed = gate.criteria.filter((criterion) => criterion.status !== "pass");
    if (failed.length > 0) {
      errors.push(`${gate.id} has non-passing criteria: ${failed.map((criterion) => criterion.statement).join("; ")}`);
    }
  }
}

const summary = {
  package: packagePath,
  counts: {
    missions: missions.length,
    stakeholders: stakeholders.length,
    contexts: contexts.length,
    risks: risks.length,
    knowledgeSources: knowledgeSources.length,
    qualityIntents: qualityIntents.length,
    evidenceItems: evidenceItems.length,
    indicators: indicators.length,
    evaluations: evaluations.length,
    governanceEvents: governanceEvents.length,
    acceptanceGates: acceptanceGates.length
  },
  warnings,
  errors
};

if (errors.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF package validation passed.",
  ...summary
}, null, 2));

