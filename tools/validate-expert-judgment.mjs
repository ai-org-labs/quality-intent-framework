#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const packagePath = process.argv[2] || "examples/expert-judgment-sample-package.json";
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

function requireArray(pkg, key) {
  if (!Array.isArray(pkg[key])) {
    errors.push(`Top-level ${key} must be an array.`);
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

const pkg = readJson(absolutePackagePath);
if (!pkg) {
  process.exit(1);
}

checkRequiredString(pkg, "frameworkVersion", "package");
checkRequiredString(pkg, "packageId", "package");

const stakeholders = requireArray(pkg, "stakeholders");
const knowledgeSources = requireArray(pkg, "knowledgeSources");
const cases = requireArray(pkg, "cases");
const expertJudgments = requireArray(pkg, "expertJudgments");
const cues = requireArray(pkg, "cues");
const concerns = requireArray(pkg, "concerns");
const lossBoundaries = requireArray(pkg, "lossBoundaries");
const decisionPatterns = requireArray(pkg, "decisionPatterns");
const applicabilityBoundaries = requireArray(pkg, "applicabilityBoundaries");
const counterexamples = requireArray(pkg, "counterexamples");
const qualityIntentDerivations = requireArray(pkg, "qualityIntentDerivations");
const reproductionTests = requireArray(pkg, "reproductionTests");
const organizationalQualityCultures = requireArray(pkg, "organizationalQualityCultures");
const reviewHistoryInferences = requireArray(pkg, "reviewHistoryInferences");
const governanceEvents = requireArray(pkg, "governanceEvents");
const acceptanceGates = requireArray(pkg, "acceptanceGates");

const stakeholderIndex = indexById(stakeholders, "stakeholders");
const sourceIndex = indexById(knowledgeSources, "knowledgeSources");
const caseIndex = indexById(cases, "cases");
const cueIndex = indexById(cues, "cues");
const concernIndex = indexById(concerns, "concerns");
const lossBoundaryIndex = indexById(lossBoundaries, "lossBoundaries");
const judgmentIndex = indexById(expertJudgments, "expertJudgments");
const patternIndex = indexById(decisionPatterns, "decisionPatterns");
const applicabilityIndex = indexById(applicabilityBoundaries, "applicabilityBoundaries");
const counterexampleIndex = indexById(counterexamples, "counterexamples");
const derivationIndex = indexById(qualityIntentDerivations, "qualityIntentDerivations");
const reproductionIndex = indexById(reproductionTests, "reproductionTests");
const cultureIndex = indexById(organizationalQualityCultures, "organizationalQualityCultures");
const inferenceIndex = indexById(reviewHistoryInferences, "reviewHistoryInferences");
const governanceIndex = indexById(governanceEvents, "governanceEvents");
const gateIndex = indexById(acceptanceGates, "acceptanceGates");

void applicabilityIndex;
void derivationIndex;
void cultureIndex;
void inferenceIndex;
void governanceIndex;
void gateIndex;

for (const source of knowledgeSources) {
  checkRequiredString(source, "title", source.id);
  checkScore(source.reliability, "reliability", source.id);
}

for (const item of cases) {
  checkRequiredString(item, "title", item.id);
  checkRequiredString(item, "context", item.id);
  checkRefs(item.stakeholderRefs, stakeholderIndex, "stakeholder", item.id);
  checkRefs([item.sourceRef], sourceIndex, "knowledge source", item.id);
  if (!Array.isArray(item.presentedFacts) || item.presentedFacts.length === 0) {
    errors.push(`${item.id} must include presentedFacts.`);
  }
  if (!Array.isArray(item.availableEvidence) || item.availableEvidence.length === 0) {
    errors.push(`${item.id} must include availableEvidence.`);
  }
}

for (const cue of cues) {
  checkRequiredString(cue, "statement", cue.id);
  checkRequiredString(cue, "detectionMethod", cue.id);
  checkScore(cue.salience, "salience", cue.id);
}

for (const concern of concerns) {
  checkRequiredString(concern, "statement", concern.id);
  checkRequiredString(concern, "harmMode", concern.id);
  if (!Array.isArray(concern.affectedParties) || concern.affectedParties.length === 0) {
    errors.push(`${concern.id} must include affectedParties.`);
  }
}

for (const boundary of lossBoundaries) {
  checkRequiredString(boundary, "statement", boundary.id);
  checkRequiredString(boundary, "waiverAuthority", boundary.id);
  checkRefs(boundary.stakeholderRefs, stakeholderIndex, "stakeholder", boundary.id);
}

for (const judgment of expertJudgments) {
  checkRefs([judgment.caseRef], caseIndex, "case", judgment.id);
  checkRefs(judgment.primaryCueRefs, cueIndex, "cue", judgment.id);
  checkRefs([judgment.concernRef], concernIndex, "concern", judgment.id);
  checkRefs([judgment.lossBoundaryRef], lossBoundaryIndex, "loss boundary", judgment.id);
  checkScore(judgment.confidence, "confidence", judgment.id);
  if (!Array.isArray(judgment.acceptanceConditions) || judgment.acceptanceConditions.length === 0) {
    errors.push(`${judgment.id} must include acceptanceConditions.`);
  }
  if (!Array.isArray(judgment.requiredEvidence) || judgment.requiredEvidence.length === 0) {
    errors.push(`${judgment.id} must include requiredEvidence.`);
  }
  if (!Array.isArray(judgment.waiverConditions) || judgment.waiverConditions.length === 0) {
    errors.push(`${judgment.id} must include waiverConditions.`);
  }
}

for (const pattern of decisionPatterns) {
  checkRequiredString(pattern, "title", pattern.id);
  checkRequiredString(pattern, "applicableContext", pattern.id);
  checkRefs(pattern.triggerCueRefs, cueIndex, "cue", pattern.id);
  checkRefs([pattern.concernRef], concernIndex, "concern", pattern.id);
  checkRefs([pattern.lossBoundaryRef], lossBoundaryIndex, "loss boundary", pattern.id);
  checkRefs(pattern.counterexampleRefs, counterexampleIndex, "counterexample", pattern.id);
  checkRefs(pattern.sourceJudgmentRefs, judgmentIndex, "source judgment", pattern.id);
  checkRefs([pattern.reproductionTestRef], reproductionIndex, "reproduction test", pattern.id);
  checkScore(pattern.confidence, "confidence", pattern.id);
  if (!Array.isArray(pattern.acceptanceConditions) || pattern.acceptanceConditions.length === 0) {
    errors.push(`${pattern.id} must include acceptanceConditions.`);
  }
  if (!Array.isArray(pattern.evidenceRequired) || pattern.evidenceRequired.length === 0) {
    errors.push(`${pattern.id} must include evidenceRequired.`);
  }
  if (!Array.isArray(pattern.exceptions) || pattern.exceptions.length === 0) {
    errors.push(`${pattern.id} must include exceptions.`);
  }
}

for (const boundary of applicabilityBoundaries) {
  checkRefs([boundary.patternRef], patternIndex, "decision pattern", boundary.id);
  for (const field of ["includedContexts", "excludedContexts", "assumptions", "invalidationSignals"]) {
    if (!Array.isArray(boundary[field]) || boundary[field].length === 0) {
      errors.push(`${boundary.id} must include ${field}.`);
    }
  }
}

for (const counterexample of counterexamples) {
  checkRefs([counterexample.caseRef], caseIndex, "case", counterexample.id);
  checkRefs([counterexample.patternRef], patternIndex, "decision pattern", counterexample.id);
  if (!Array.isArray(counterexample.distinguishingFactors) || counterexample.distinguishingFactors.length === 0) {
    errors.push(`${counterexample.id} must include distinguishingFactors.`);
  }
}

for (const derivation of qualityIntentDerivations) {
  checkRefs(derivation.patternRefs, patternIndex, "decision pattern", derivation.id);
  checkRequiredString(derivation, "derivedIntentStatement", derivation.id);
  checkRequiredString(derivation, "rationale", derivation.id);
}

for (const test of reproductionTests) {
  checkRefs([test.patternRef], patternIndex, "decision pattern", test.id);
  if (test.usesUnseenCases !== true) {
    errors.push(`${test.id} must use unseen cases.`);
  }
  checkRefs(test.unseenCaseRefs, caseIndex, "unseen case", test.id);
  checkScore(test.observedAgreement, "observedAgreement", test.id);
  if (!Array.isArray(test.expectedDecisions) || test.expectedDecisions.length === 0) {
    errors.push(`${test.id} must include expectedDecisions.`);
  } else {
    for (const expected of test.expectedDecisions) {
      if (!expected || typeof expected !== "object") {
        errors.push(`${test.id} expectedDecisions contains a non-object item.`);
        continue;
      }
      checkRefs([expected.caseRef], caseIndex, "case", `${test.id}/expectedDecision`);
    }
  }
  if (!Array.isArray(test.failureAnalysis)) {
    errors.push(`${test.id} must include failureAnalysis.`);
  }
  if (test.result === "pass" && test.observedAgreement < 0.75) {
    errors.push(`${test.id} is pass below acceptable agreement threshold 0.75.`);
  }
}

for (const culture of organizationalQualityCultures) {
  checkRefs(culture.nonNegotiableLossBoundaryRefs, lossBoundaryIndex, "loss boundary", culture.id);
  checkRefs(culture.patternRefs, patternIndex, "decision pattern", culture.id);
  for (const field of ["preferredEvidence", "escalationNorms", "waiverPractices", "repeatedFears", "qualityTradeoffs", "subgroupDifferences"]) {
    if (!Array.isArray(culture[field]) || culture[field].length === 0) {
      errors.push(`${culture.id} must include ${field}.`);
    }
  }
  checkRequiredString(culture, "riskAppetite", culture.id);
}

for (const inference of reviewHistoryInferences) {
  if (!Array.isArray(inference.sourceRefs) || inference.sourceRefs.length === 0) {
    errors.push(`${inference.id} must include sourceRefs.`);
  }
  if (!Array.isArray(inference.supportingClues) || inference.supportingClues.length === 0) {
    errors.push(`${inference.id} must include supportingClues.`);
  }
  checkRequiredString(inference, "inferredPatternSummary", inference.id);
  checkScore(inference.confidence, "confidence", inference.id);
  if (inference.status !== "candidate") {
    warnings.push(`${inference.id} is ${inference.status}; inferred patterns should remain candidate until independently validated.`);
  }
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

for (const pattern of decisionPatterns) {
  const linkedBoundary = applicabilityBoundaries.find((boundary) => boundary.patternRef === pattern.id);
  if (!linkedBoundary) {
    errors.push(`${pattern.id} must have an applicability boundary.`);
  }
}

const summary = {
  package: packagePath,
  counts: {
    stakeholders: stakeholders.length,
    knowledgeSources: knowledgeSources.length,
    cases: cases.length,
    expertJudgments: expertJudgments.length,
    cues: cues.length,
    concerns: concerns.length,
    lossBoundaries: lossBoundaries.length,
    decisionPatterns: decisionPatterns.length,
    applicabilityBoundaries: applicabilityBoundaries.length,
    counterexamples: counterexamples.length,
    qualityIntentDerivations: qualityIntentDerivations.length,
    reproductionTests: reproductionTests.length,
    organizationalQualityCultures: organizationalQualityCultures.length,
    reviewHistoryInferences: reviewHistoryInferences.length,
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
  message: "Expert judgment package validation passed.",
  ...summary
}, null, 2));
