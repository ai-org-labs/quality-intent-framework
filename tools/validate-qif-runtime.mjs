#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = [
  "examples/discovery-session-package.json",
  "examples/organizational-quality-culture-package.json",
  "examples/evaluation-target-package.json",
  "examples/review-run-package.json",
  "examples/quality-gate-package.json"
];

const packagePaths = process.argv.slice(2);
const inputs = packagePaths.length > 0 ? packagePaths : defaultPackages;
const projectRoot = process.cwd();

const errors = [];
const warnings = [];
const results = [];

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`Cannot read JSON at ${filePath}: ${error.message}`);
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

function checkPositiveNumber(value, field, ownerId) {
  if (typeof value !== "number" || value <= 0) {
    errors.push(`${ownerId} ${field} must be a positive number.`);
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

function checkNonEmptyArray(item, field, ownerId) {
  if (!Array.isArray(item[field]) || item[field].length === 0) {
    errors.push(`${ownerId} must include ${field}.`);
  }
}

function rounded(value) {
  return Math.round(value * 100) / 100;
}

function lower(value) {
  return String(value ?? "").toLowerCase();
}

function checkRefsCovered(refs, coveredRefs, label, ownerId) {
  for (const ref of refs ?? []) {
    if (!coveredRefs.has(ref)) {
      errors.push(`${ownerId} ${label} ${ref} is not justified by its extraction steps.`);
    }
  }
}

function aggregateConfidence(inputs, rule, ownerId) {
  if (inputs.length === 0) {
    errors.push(`${ownerId} has no confidence inputs to aggregate.`);
    return 0;
  }
  if (rule === "minimum-evidence-confidence" || rule === "minimum-verdict-confidence") {
    return rounded(Math.min(...inputs.map((input) => input.confidence)));
  }
  if (rule === "weighted-average" || rule === "average-verdict-confidence") {
    const totalWeight = inputs.reduce((sum, input) => sum + input.weight, 0);
    if (totalWeight <= 0) {
      errors.push(`${ownerId} confidence weights must sum above zero.`);
      return 0;
    }
    const weighted = inputs.reduce((sum, input) => sum + input.confidence * input.weight, 0) / totalWeight;
    return rounded(weighted);
  }
  errors.push(`${ownerId} uses unsupported confidence rule ${rule}.`);
  return 0;
}

function conditionValues(condition, target, decision) {
  switch (condition.field) {
    case "context":
      return [target.context, decision.matchedContext];
    case "stakeholderImpact":
      return [...(target.stakeholderImpact ?? []), ...(decision.matchedStakeholderRefs ?? [])];
    case "risk":
      return decision.matchedRiskRefs ?? [];
    case "domain":
      return [target.domain, decision.matchedDomain];
    case "lossBoundary":
      return decision.matchedLossBoundaryRefs ?? [];
    case "artifactType":
      return [target.artifactType, ...(decision.matchedArtifactTypes ?? [])];
    case "operationalImpact":
      return [target.operationalImpact, ...(decision.matchedOperationalImpacts ?? [])];
    default:
      return [];
  }
}

function conditionMatches(condition, target, decision) {
  const values = conditionValues(condition, target, decision).filter((value) => typeof value === "string" && value.trim() !== "");
  const expectedValues = condition.expectedValues ?? [];
  const normalizedValues = values.map(lower);
  const normalizedExpected = expectedValues.map(lower);
  switch (condition.operator) {
    case "exists":
      return values.length > 0;
    case "equals":
    case "includes":
    case "intersects":
      return normalizedExpected.some((expected) => normalizedValues.includes(expected));
    case "contains-text":
      return normalizedExpected.some((expected) => normalizedValues.some((value) => value.includes(expected)));
    default:
      return false;
  }
}

function validateDiscoveryPackage(pkg, packagePath) {
  const experts = requireArray(pkg, "experts");
  const cases = requireArray(pkg, "cases");
  const questionLogEntries = requireArray(pkg, "questionLogEntries");
  const rawExpertAnswers = requireArray(pkg, "rawExpertAnswers");
  const expertJudgments = requireArray(pkg, "expertJudgments");
  const cues = requireArray(pkg, "cues");
  const concerns = requireArray(pkg, "concerns");
  const lossBoundaries = requireArray(pkg, "lossBoundaries");
  const qualityIntents = requireArray(pkg, "qualityIntents");
  const qualityIntentDerivations = requireArray(pkg, "qualityIntentDerivations");
  const decisionPatterns = requireArray(pkg, "decisionPatterns");
  const extractionSteps = requireArray(pkg, "extractionSteps");
  const discoverySessions = requireArray(pkg, "discoverySessions");

  const expertIndex = indexById(experts, `${packagePath}:experts`);
  const caseIndex = indexById(cases, `${packagePath}:cases`);
  const questionIndex = indexById(questionLogEntries, `${packagePath}:questionLogEntries`);
  const rawAnswerIndex = indexById(rawExpertAnswers, `${packagePath}:rawExpertAnswers`);
  const judgmentIndex = indexById(expertJudgments, `${packagePath}:expertJudgments`);
  const cueIndex = indexById(cues, `${packagePath}:cues`);
  const concernIndex = indexById(concerns, `${packagePath}:concerns`);
  const boundaryIndex = indexById(lossBoundaries, `${packagePath}:lossBoundaries`);
  const qualityIntentIndex = indexById(qualityIntents, `${packagePath}:qualityIntents`);
  const derivationIndex = indexById(qualityIntentDerivations, `${packagePath}:qualityIntentDerivations`);
  const patternIndex = indexById(decisionPatterns, `${packagePath}:decisionPatterns`);
  const extractionStepIndex = indexById(extractionSteps, `${packagePath}:extractionSteps`);
  const sessionIndex = indexById(discoverySessions, `${packagePath}:discoverySessions`);

  for (const question of questionLogEntries) {
    checkRefs([question.sessionRef], sessionIndex, "discovery session", question.id);
    checkRefs([question.targetCaseRef], caseIndex, "target case", question.id);
    checkRequiredString(question, "questionText", question.id);
    checkRequiredString(question, "questionType", question.id);
    checkRequiredString(question, "askedBy", question.id);
    if (!Number.isInteger(question.order) || question.order < 1) {
      errors.push(`${question.id} order must be a positive integer.`);
    }
  }
  for (const answer of rawExpertAnswers) {
    checkRefs([answer.sessionRef], sessionIndex, "discovery session", answer.id);
    checkRefs([answer.expertRef], expertIndex, "expert", answer.id);
    checkRefs([answer.caseRef], caseIndex, "case", answer.id);
    checkRefs([answer.questionRef], questionIndex, "question log entry", answer.id);
    checkRequiredString(answer, "answerText", answer.id);
    checkRequiredString(answer, "captureMode", answer.id);
    if (!Array.isArray(answer.ambiguity)) {
      errors.push(`${answer.id} must include ambiguity array.`);
    }
    if (!answer.sensitiveDataHandling || typeof answer.sensitiveDataHandling !== "object") {
      errors.push(`${answer.id} must include sensitiveDataHandling.`);
    } else {
      for (const field of ["classification", "redactionState", "handlingNotes"]) {
        checkRequiredString(answer.sensitiveDataHandling, field, `${answer.id}/sensitiveDataHandling`);
      }
    }
    const question = questionIndex.get(answer.questionRef);
    if (question) {
      if (question.sessionRef !== answer.sessionRef) {
        errors.push(`${answer.id} questionRef ${answer.questionRef} belongs to a different discovery session.`);
      }
      if (question.targetCaseRef !== answer.caseRef) {
        errors.push(`${answer.id} questionRef ${answer.questionRef} targets a different case.`);
      }
    }
  }
  for (const cue of cues) {
    checkRequiredString(cue, "statement", cue.id);
    checkRefs([cue.concernRef], concernIndex, "concern", cue.id);
  }
  for (const concern of concerns) {
    checkRequiredString(concern, "statement", concern.id);
    checkRefs([concern.lossBoundaryRef], boundaryIndex, "loss boundary", concern.id);
  }
  for (const boundary of lossBoundaries) {
    checkRequiredString(boundary, "statement", boundary.id);
    checkRequiredString(boundary, "severity", boundary.id);
  }
  for (const intent of qualityIntents) {
    checkRequiredString(intent, "statement", intent.id);
    checkRefs(intent.lossBoundaryRefs, boundaryIndex, "loss boundary", intent.id);
  }
  for (const judgment of expertJudgments) {
    checkRefs([judgment.caseRef], caseIndex, "case", judgment.id);
    checkRefs([judgment.expertRef], expertIndex, "expert", judgment.id);
    checkRefs(judgment.cueRefs, cueIndex, "cue", judgment.id);
    checkRefs([judgment.concernRef], concernIndex, "concern", judgment.id);
    checkRefs([judgment.lossBoundaryRef], boundaryIndex, "loss boundary", judgment.id);
    checkScore(judgment.confidence, "confidence", judgment.id);
  }
  for (const pattern of decisionPatterns) {
    checkRefs(pattern.sourceJudgmentRefs, judgmentIndex, "source judgment", pattern.id);
    checkScore(pattern.confidence, "confidence", pattern.id);
  }
  for (const derivation of qualityIntentDerivations) {
    checkRefs(derivation.sourceDecisionPatternRefs, patternIndex, "source decision pattern", derivation.id);
    checkRefs(derivation.sourceConcernRefs, concernIndex, "source concern", derivation.id);
    checkRefs(derivation.sourceLossBoundaryRefs, boundaryIndex, "source loss boundary", derivation.id);
    checkRefs([derivation.derivedQualityIntentRef], qualityIntentIndex, "derived quality intent", derivation.id);
    checkRequiredString(derivation, "derivationRationale", derivation.id);
    checkScore(derivation.confidence, "confidence", derivation.id);
    checkRequiredString(derivation, "status", derivation.id);
    checkRefs(derivation.reviewerRefs, expertIndex, "reviewer", derivation.id);
    if ((derivation.sourceDecisionPatternRefs ?? []).length === 0 && (derivation.sourceLossBoundaryRefs ?? []).length === 0) {
      errors.push(`${derivation.id} must reference at least one decision pattern or loss boundary.`);
    }
  }
  for (const step of extractionSteps) {
    checkRefs([step.sessionRef], sessionIndex, "discovery session", step.id);
    checkRequiredString(step, "extractionMethod", step.id);
    checkRequiredString(step, "rationale", step.id);
    checkScore(step.confidence, "confidence", step.id);
    checkRefs(step.rawExpertAnswerRefs, rawAnswerIndex, "raw expert answer", step.id);
    for (const ref of step.rawExpertAnswerRefs ?? []) {
      const answer = rawAnswerIndex.get(ref);
      if (answer && answer.sessionRef !== step.sessionRef) {
        errors.push(`${step.id} raw expert answer ${ref} belongs to a different discovery session.`);
      }
    }
    checkMaybeRefs(step.outputCueRefs, cueIndex, "cue", step.id);
    checkMaybeRefs(step.outputConcernRefs, concernIndex, "concern", step.id);
    checkMaybeRefs(step.outputLossBoundaryRefs, boundaryIndex, "loss boundary", step.id);
    checkMaybeRefs(step.outputDecisionPatternRefs, patternIndex, "decision pattern", step.id);
    checkMaybeRefs(step.outputQualityIntentDerivationRefs, derivationIndex, "quality intent derivation", step.id);
    const outputCount = [
      step.outputCueRefs,
      step.outputConcernRefs,
      step.outputLossBoundaryRefs,
      step.outputDecisionPatternRefs,
      step.outputQualityIntentDerivationRefs
    ].reduce((count, refs) => count + (Array.isArray(refs) ? refs.length : 0), 0);
    if (outputCount === 0) {
      errors.push(`${step.id} must output at least one extracted or derived entity.`);
    }
    if (!Array.isArray(step.ambiguity)) {
      errors.push(`${step.id} must include ambiguity array.`);
    }
  }

  const packageCovered = {
    cues: new Set(extractionSteps.flatMap((step) => step.outputCueRefs ?? [])),
    concerns: new Set(extractionSteps.flatMap((step) => step.outputConcernRefs ?? [])),
    boundaries: new Set(extractionSteps.flatMap((step) => step.outputLossBoundaryRefs ?? [])),
    patterns: new Set(extractionSteps.flatMap((step) => step.outputDecisionPatternRefs ?? [])),
    derivations: new Set(extractionSteps.flatMap((step) => step.outputQualityIntentDerivationRefs ?? []))
  };
  checkRefsCovered(cues.map((item) => item.id), packageCovered.cues, "cue", packagePath);
  checkRefsCovered(concerns.map((item) => item.id), packageCovered.concerns, "concern", packagePath);
  checkRefsCovered(lossBoundaries.map((item) => item.id), packageCovered.boundaries, "loss boundary", packagePath);
  checkRefsCovered(decisionPatterns.map((item) => item.id), packageCovered.patterns, "decision pattern", packagePath);
  checkRefsCovered(qualityIntentDerivations.map((item) => item.id), packageCovered.derivations, "quality intent derivation", packagePath);

  for (const session of discoverySessions) {
    checkRefs([session.expertRef], expertIndex, "expert", session.id);
    checkRefs(session.caseRefs, caseIndex, "case", session.id);
    checkRefs(session.questionLogEntryRefs, questionIndex, "question log entry", session.id);
    checkRefs(session.rawExpertAnswerRefs, rawAnswerIndex, "raw expert answer", session.id);
    checkRefs(session.judgmentRefs, judgmentIndex, "expert judgment", session.id);
    checkRefs(session.extractedCueRefs, cueIndex, "cue", session.id);
    checkRefs(session.extractedConcernRefs, concernIndex, "concern", session.id);
    checkRefs(session.mappedLossBoundaryRefs, boundaryIndex, "loss boundary", session.id);
    checkRefs(session.derivedDecisionPatternRefs, patternIndex, "decision pattern", session.id);
    checkRefs(session.derivedQualityIntentDerivationRefs, derivationIndex, "quality intent derivation", session.id);
    checkRefs(session.extractionStepRefs, extractionStepIndex, "extraction step", session.id);
    checkScore(session.confidence, "confidence", session.id);
    if (!Array.isArray(session.unresolvedAmbiguity)) {
      errors.push(`${session.id} must include unresolvedAmbiguity array.`);
    }
    for (const ref of session.questionLogEntryRefs ?? []) {
      const question = questionIndex.get(ref);
      if (question && question.sessionRef !== session.id) {
        errors.push(`${session.id} question log entry ${ref} belongs to a different discovery session.`);
      }
    }
    for (const ref of session.rawExpertAnswerRefs ?? []) {
      const answer = rawAnswerIndex.get(ref);
      if (answer && answer.sessionRef !== session.id) {
        errors.push(`${session.id} raw expert answer ${ref} belongs to a different discovery session.`);
      }
    }
    const sessionSteps = (session.extractionStepRefs ?? []).map((ref) => extractionStepIndex.get(ref)).filter(Boolean);
    const covered = {
      cues: new Set(sessionSteps.flatMap((step) => step.outputCueRefs ?? [])),
      concerns: new Set(sessionSteps.flatMap((step) => step.outputConcernRefs ?? [])),
      boundaries: new Set(sessionSteps.flatMap((step) => step.outputLossBoundaryRefs ?? [])),
      patterns: new Set(sessionSteps.flatMap((step) => step.outputDecisionPatternRefs ?? [])),
      derivations: new Set(sessionSteps.flatMap((step) => step.outputQualityIntentDerivationRefs ?? []))
    };
    checkRefsCovered(session.extractedCueRefs, covered.cues, "cue", session.id);
    checkRefsCovered(session.extractedConcernRefs, covered.concerns, "concern", session.id);
    checkRefsCovered(session.mappedLossBoundaryRefs, covered.boundaries, "loss boundary", session.id);
    checkRefsCovered(session.derivedDecisionPatternRefs, covered.patterns, "decision pattern", session.id);
    checkRefsCovered(session.derivedQualityIntentDerivationRefs, covered.derivations, "quality intent derivation", session.id);
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      experts: experts.length,
      cases: cases.length,
      questionLogEntries: questionLogEntries.length,
      rawExpertAnswers: rawExpertAnswers.length,
      expertJudgments: expertJudgments.length,
      cues: cues.length,
      concerns: concerns.length,
      lossBoundaries: lossBoundaries.length,
      qualityIntents: qualityIntents.length,
      qualityIntentDerivations: qualityIntentDerivations.length,
      decisionPatterns: decisionPatterns.length,
      extractionSteps: extractionSteps.length,
      discoverySessions: discoverySessions.length
    }
  });
}

function validateCulturePackage(pkg, packagePath) {
  const lossBoundaries = requireArray(pkg, "lossBoundaries");
  const decisionPatterns = requireArray(pkg, "decisionPatterns");
  const cultures = requireArray(pkg, "organizationalQualityCultures");

  const boundaryIndex = indexById(lossBoundaries, `${packagePath}:lossBoundaries`);
  const patternIndex = indexById(decisionPatterns, `${packagePath}:decisionPatterns`);

  for (const culture of cultures) {
    checkRefs(culture.nonNegotiableLossBoundaryRefs, boundaryIndex, "loss boundary", culture.id);
    checkRefs(culture.patternRefs, patternIndex, "decision pattern", culture.id);
    checkRequiredString(culture, "riskAppetite", culture.id);
    if (culture.aggregationRole !== "context-only") {
      errors.push(`${culture.id} must be marked as context-only.`);
    }
    if ("qualityIntentDerivationPrerequisite" in culture) {
      errors.push(`${culture.id} must not include qualityIntentDerivationPrerequisite; culture is context only.`);
    }
    for (const field of ["recurringFears", "preferredEvidence", "escalationNorms", "waiverPractices", "qualityTradeoffs", "departmentOrRoleDifferences"]) {
      if (!Array.isArray(culture[field]) || culture[field].length === 0) {
        errors.push(`${culture.id} must include ${field}.`);
      }
    }
    if (culture.patternRefs.length < 2 && culture.provisional !== true) {
      errors.push(`${culture.id} must reference multiple patterns or be explicitly provisional.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      lossBoundaries: lossBoundaries.length,
      decisionPatterns: decisionPatterns.length,
      organizationalQualityCultures: cultures.length
    }
  });
}

function validateTargetPackage(pkg, packagePath) {
  const targets = requireArray(pkg, "evaluationTargets");
  indexById(targets, `${packagePath}:evaluationTargets`);
  const supportedDomains = new Set([
    "software-development",
    "product-development",
    "service-operations",
    "accounting",
    "administration",
    "maintenance",
    "customer-support"
  ]);
  for (const target of targets) {
    for (const field of ["title", "domain", "targetType", "artifactType", "context", "operationalImpact", "riskSummary"]) {
      checkRequiredString(target, field, target.id);
    }
    if (typeof target.domain === "string" && !supportedDomains.has(target.domain)) {
      errors.push(`${target.id} domain must be one of the supported evaluation target domains.`);
    }
    if (!Array.isArray(target.stakeholderImpact) || target.stakeholderImpact.length === 0) {
      errors.push(`${target.id} must include stakeholderImpact.`);
    }
    if (!Array.isArray(target.sourceEvidence) || target.sourceEvidence.length === 0) {
      errors.push(`${target.id} must include sourceEvidence.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      evaluationTargets: targets.length
    }
  });
}

function indexRuleConditions(applicabilityRules) {
  const ruleConditionIndex = new Map();
  for (const rule of applicabilityRules) {
    const conditionIndex = new Map();
    for (const condition of [...(rule.matchConditions ?? []), ...(rule.exclusionConditions ?? [])]) {
      if (!condition || typeof condition !== "object") {
        errors.push(`${rule.id} contains a non-object applicability condition.`);
        continue;
      }
      if (typeof condition.id !== "string" || condition.id.trim() === "") {
        errors.push(`${rule.id} has an applicability condition without id.`);
        continue;
      }
      if (conditionIndex.has(condition.id)) {
        errors.push(`${rule.id} has duplicate condition id ${condition.id}.`);
      }
      conditionIndex.set(condition.id, condition);
    }
    ruleConditionIndex.set(rule.id, conditionIndex);
  }
  return ruleConditionIndex;
}

function validateReviewRunPackage(pkg, packagePath) {
  const targets = requireArray(pkg, "evaluationTargets");
  const qualityIntents = requireArray(pkg, "qualityIntents");
  const decisionPatterns = requireArray(pkg, "decisionPatterns");
  const applicabilityRules = requireArray(pkg, "applicabilityRules");
  const applicabilityDecisions = requireArray(pkg, "applicabilityDecisions");
  const confidencePolicies = requireArray(pkg, "confidencePolicies");
  const evidenceItems = requireArray(pkg, "evidenceItems");
  const indicators = requireArray(pkg, "indicators");
  const governanceTriggers = requireArray(pkg, "governanceTriggers");
  const governanceEvents = requireArray(pkg, "governanceEvents");
  const reviewRuns = requireArray(pkg, "reviewRuns");
  const verifierBoundary = pkg.verifierBoundary;

  const targetIndex = indexById(targets, `${packagePath}:evaluationTargets`);
  const intentIndex = indexById(qualityIntents, `${packagePath}:qualityIntents`);
  const patternIndex = indexById(decisionPatterns, `${packagePath}:decisionPatterns`);
  const applicabilityRuleIndex = indexById(applicabilityRules, `${packagePath}:applicabilityRules`);
  const applicabilityDecisionIndex = indexById(applicabilityDecisions, `${packagePath}:applicabilityDecisions`);
  const confidencePolicyIndex = indexById(confidencePolicies, `${packagePath}:confidencePolicies`);
  const evidenceIndex = indexById(evidenceItems, `${packagePath}:evidenceItems`);
  const governanceIndex = indexById(governanceTriggers, `${packagePath}:governanceTriggers`);
  const governanceEventIndex = indexById(governanceEvents, `${packagePath}:governanceEvents`);
  const runIndex = indexById(reviewRuns, `${packagePath}:reviewRuns`);
  const ruleConditionIndex = indexRuleConditions(applicabilityRules);

  for (const target of targets) {
    for (const field of ["title", "domain", "artifactType", "context", "operationalImpact"]) {
      checkRequiredString(target, field, target.id);
    }
    if (!Array.isArray(target.stakeholderImpact) || target.stakeholderImpact.length === 0) {
      errors.push(`${target.id} must include stakeholderImpact.`);
    }
  }
  for (const intent of qualityIntents) {
    checkRequiredString(intent, "statement", intent.id);
    checkRequiredString(intent, "lossBoundary", intent.id);
    checkRefs(intent.sourceDecisionPatternRefs, patternIndex, "source decision pattern", intent.id);
    if (intent.derivationMode === "direct-from-decision-pattern" && intent.organizationalCultureRef) {
      errors.push(`${intent.id} is direct-from-decision-pattern and must not require organizational culture.`);
    }
  }
  for (const rule of applicabilityRules) {
    for (const field of ["title", "ruleScope"]) {
      checkRequiredString(rule, field, rule.id);
    }
    checkRefs(rule.selectedIntentRefs, intentIndex, "selected quality intent", rule.id);
    checkRefs(rule.selectedDecisionPatternRefs, patternIndex, "selected decision pattern", rule.id);
    if (!Array.isArray(rule.matchConditions) || rule.matchConditions.length === 0) {
      errors.push(`${rule.id} must include executable matchConditions.`);
    }
    if (!Array.isArray(rule.exclusionConditions)) {
      errors.push(`${rule.id} must include exclusionConditions array.`);
    }
    for (const condition of rule.matchConditions ?? []) {
      checkRequiredString(condition, "field", `${rule.id}/${condition.id}`);
      checkRequiredString(condition, "operator", `${rule.id}/${condition.id}`);
      checkNonEmptyArray(condition, "expectedValues", `${rule.id}/${condition.id}`);
    }
    for (const condition of rule.exclusionConditions ?? []) {
      checkRequiredString(condition, "field", `${rule.id}/${condition.id}`);
      checkRequiredString(condition, "operator", `${rule.id}/${condition.id}`);
      checkNonEmptyArray(condition, "expectedValues", `${rule.id}/${condition.id}`);
      checkMaybeRefs(condition.excludedIntentRefs, intentIndex, "excluded quality intent", `${rule.id}/${condition.id}`);
      checkMaybeRefs(condition.excludedDecisionPatternRefs, patternIndex, "excluded decision pattern", `${rule.id}/${condition.id}`);
    }
    for (const legacyField of ["selectionLogic", "requiredContextSignals", "stakeholderSignals", "riskSignals", "domainScope", "lossBoundaryRefs", "artifactTypes", "operationalImpactSignals", "excludedWhen"]) {
      if (legacyField in rule) {
        errors.push(`${rule.id} must use structured matchConditions/exclusionConditions instead of ${legacyField}.`);
      }
    }
    if ("targetRef" in rule) {
      errors.push(`${rule.id} must be reusable selection logic, not a target-specific applicability decision.`);
    }
  }
  for (const decision of applicabilityDecisions) {
    checkRefs([decision.targetRef], targetIndex, "evaluation target", decision.id);
    checkRefs(decision.ruleRefs, applicabilityRuleIndex, "applicability rule", decision.id);
    checkRefs(decision.selectedIntentRefs, intentIndex, "quality intent", decision.id);
    checkRefs(decision.selectedDecisionPatternRefs, patternIndex, "decision pattern", decision.id);
    checkRefs(decision.matchedConditionRefs, new Map((decision.ruleRefs ?? []).flatMap((ruleRef) => [...(ruleConditionIndex.get(ruleRef) ?? new Map()).entries()])), "matched applicability condition", decision.id);
    checkRequiredString(decision, "selectionRationale", decision.id);
    checkScore(decision.confidence, "confidence", decision.id);
    for (const field of ["matchedStakeholderRefs", "matchedRiskRefs", "matchedLossBoundaryRefs", "matchedArtifactTypes", "matchedOperationalImpacts"]) {
      checkNonEmptyArray(decision, field, decision.id);
    }
    const target = targetIndex.get(decision.targetRef);
    const citedRules = (decision.ruleRefs ?? []).map((ref) => applicabilityRuleIndex.get(ref)).filter(Boolean);
    const ruleSelectedIntents = new Set(citedRules.flatMap((rule) => rule.selectedIntentRefs ?? []));
    const ruleSelectedPatterns = new Set(citedRules.flatMap((rule) => rule.selectedDecisionPatternRefs ?? []));
    const citedConditionEntries = new Map(citedRules.flatMap((rule) => [...(ruleConditionIndex.get(rule.id) ?? new Map()).entries()].map(([id, condition]) => [id, { rule, condition }])));
    for (const ref of decision.selectedIntentRefs ?? []) {
      if (!ruleSelectedIntents.has(ref)) {
        errors.push(`${decision.id} selected quality intent ${ref} is not selected by its cited applicability rules.`);
      }
    }
    for (const ref of decision.selectedDecisionPatternRefs ?? []) {
      if (!ruleSelectedPatterns.has(ref)) {
        errors.push(`${decision.id} selected decision pattern ${ref} is not selected by its cited applicability rules.`);
      }
    }
    for (const conditionRef of decision.matchedConditionRefs ?? []) {
      const entry = citedConditionEntries.get(conditionRef);
      if (entry && target && !conditionMatches(entry.condition, target, decision)) {
        errors.push(`${decision.id} matched condition ${conditionRef} does not match recorded target/application context.`);
      }
    }
    if (!Array.isArray(decision.excludedIntents)) {
      errors.push(`${decision.id} must include excludedIntents array.`);
    }
    if (!Array.isArray(decision.excludedDecisionPatterns)) {
      errors.push(`${decision.id} must include excludedDecisionPatterns array.`);
    }
    const excludedIntentRefs = new Set();
    for (const exclusion of decision.excludedIntents ?? []) {
      checkRefs([exclusion.intentRef], intentIndex, "excluded quality intent", decision.id);
      checkRefs([exclusion.ruleRef], applicabilityRuleIndex, "exclusion rule", decision.id);
      checkRequiredString(exclusion, "rationale", `${decision.id}/excludedIntent`);
      excludedIntentRefs.add(exclusion.intentRef);
      if (!(decision.ruleRefs ?? []).includes(exclusion.ruleRef)) {
        errors.push(`${decision.id} excluded quality intent ${exclusion.intentRef} cites rule ${exclusion.ruleRef} that is not used by the decision.`);
      }
      const condition = ruleConditionIndex.get(exclusion.ruleRef)?.get(exclusion.conditionRef);
      if (!condition) {
        errors.push(`${decision.id} excluded quality intent ${exclusion.intentRef} cites missing exclusion condition ${exclusion.conditionRef}.`);
      } else {
        if (!(condition.excludedIntentRefs ?? []).includes(exclusion.intentRef)) {
          errors.push(`${decision.id} exclusion condition ${exclusion.conditionRef} does not exclude intent ${exclusion.intentRef}.`);
        }
        if (target && !conditionMatches(condition, target, decision)) {
          errors.push(`${decision.id} exclusion condition ${exclusion.conditionRef} does not match recorded target/application context.`);
        }
      }
    }
    const excludedPatternRefs = new Set();
    for (const exclusion of decision.excludedDecisionPatterns ?? []) {
      checkRefs([exclusion.decisionPatternRef], patternIndex, "excluded decision pattern", decision.id);
      checkRefs([exclusion.ruleRef], applicabilityRuleIndex, "exclusion rule", decision.id);
      checkRequiredString(exclusion, "rationale", `${decision.id}/excludedDecisionPattern`);
      excludedPatternRefs.add(exclusion.decisionPatternRef);
      if (!(decision.ruleRefs ?? []).includes(exclusion.ruleRef)) {
        errors.push(`${decision.id} excluded decision pattern ${exclusion.decisionPatternRef} cites rule ${exclusion.ruleRef} that is not used by the decision.`);
      }
      const condition = ruleConditionIndex.get(exclusion.ruleRef)?.get(exclusion.conditionRef);
      if (!condition) {
        errors.push(`${decision.id} excluded decision pattern ${exclusion.decisionPatternRef} cites missing exclusion condition ${exclusion.conditionRef}.`);
      } else {
        if (!(condition.excludedDecisionPatternRefs ?? []).includes(exclusion.decisionPatternRef)) {
          errors.push(`${decision.id} exclusion condition ${exclusion.conditionRef} does not exclude decision pattern ${exclusion.decisionPatternRef}.`);
        }
        if (target && !conditionMatches(condition, target, decision)) {
          errors.push(`${decision.id} exclusion condition ${exclusion.conditionRef} does not match recorded target/application context.`);
        }
      }
    }
    for (const ref of decision.selectedIntentRefs ?? []) {
      if (excludedIntentRefs.has(ref)) {
        errors.push(`${decision.id} cannot both select and exclude quality intent ${ref}.`);
      }
    }
    for (const ref of decision.selectedDecisionPatternRefs ?? []) {
      if (excludedPatternRefs.has(ref)) {
        errors.push(`${decision.id} cannot both select and exclude decision pattern ${ref}.`);
      }
    }
  }
  for (const policy of confidencePolicies) {
    checkRequiredString(policy, "evidenceAggregationRule", policy.id);
    checkRequiredString(policy, "verdictAggregationRule", policy.id);
    checkRequiredString(policy, "reviewRunAggregationRule", policy.id);
    checkRequiredString(policy, "rounding", policy.id);
  }
  for (const evidence of evidenceItems) {
    checkRefs([evidence.targetRef], targetIndex, "evaluation target", evidence.id);
    checkRequiredString(evidence, "finding", evidence.id);
    checkScore(evidence.confidence, "confidence", evidence.id);
    checkPositiveNumber(evidence.weight, "weight", evidence.id);
  }
  for (const indicator of indicators) {
    checkRefs([indicator.linkedIntentRef], intentIndex, "quality intent", indicator.id);
    if (indicator.metricKind === "activity-count" && indicator.interpretation !== "evidence-only") {
      errors.push(`${indicator.id} is an activity-count metric but is not evidence-only.`);
    }
    if (indicator.interpretation === "quality-itself") {
      errors.push(`${indicator.id} treats an indicator as quality itself.`);
    }
  }
  for (const trigger of governanceTriggers) {
    for (const field of ["triggerType", "reason", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
    }
    checkRefs([trigger.sourceReviewRunRef], runIndex, "source review run", trigger.id);
    checkRefs([trigger.affectedTargetRef], targetIndex, "affected target", trigger.id);
    if (trigger.resultingGovernanceEventRef) {
      checkRefs([trigger.resultingGovernanceEventRef], governanceEventIndex, "resulting governance event", trigger.id);
      const event = governanceEventIndex.get(trigger.resultingGovernanceEventRef);
      if (event && event.sourceGovernanceTriggerRef !== trigger.id) {
        errors.push(`${trigger.id} resulting governance event ${event.id} points to a different trigger.`);
      }
    } else if (trigger.status !== "open") {
      errors.push(`${trigger.id} is not open and must link to a resultingGovernanceEventRef.`);
    }
  }
  for (const event of governanceEvents) {
    checkRefs([event.sourceGovernanceTriggerRef], governanceIndex, "source governance trigger", event.id);
    for (const field of ["decision", "decidedBy", "decisionRationale", "status"]) {
      checkRequiredString(event, field, event.id);
    }
  }
  if (!verifierBoundary || typeof verifierBoundary !== "object") {
    errors.push(`${packagePath} must include verifierBoundary.`);
  } else {
    for (const field of ["checks", "doesNotClaim", "semanticValidityRequires"]) {
      if (!Array.isArray(verifierBoundary[field]) || verifierBoundary[field].length === 0) {
        errors.push(`${packagePath} verifierBoundary must include ${field}.`);
      }
    }
    const doesNotClaim = new Set(verifierBoundary.doesNotClaim ?? []);
    if (!doesNotClaim.has("semantic truth")) {
      errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming semantic truth.`);
    }
  }
  for (const run of reviewRuns) {
    checkRefs([run.targetRef], targetIndex, "evaluation target", run.id);
    checkRefs(run.applicabilityRuleRefs, applicabilityRuleIndex, "applicability rule", run.id);
    checkRefs(run.applicabilityDecisionRefs, applicabilityDecisionIndex, "applicability decision", run.id);
    checkRefs(run.selectedIntentRefs, intentIndex, "quality intent", run.id);
    checkRefs(run.selectedDecisionPatternRefs, patternIndex, "decision pattern", run.id);
    checkRefs(run.collectedEvidenceRefs, evidenceIndex, "evidence", run.id);
    checkRefs([run.confidencePolicyRef], confidencePolicyIndex, "confidence policy", run.id);
    checkScore(run.confidence, "confidence", run.id);
    const runDecisions = (run.applicabilityDecisionRefs ?? []).map((ref) => applicabilityDecisionIndex.get(ref)).filter(Boolean);
    const selectedByDecisions = {
      intents: new Set(runDecisions.flatMap((decision) => decision.selectedIntentRefs ?? [])),
      patterns: new Set(runDecisions.flatMap((decision) => decision.selectedDecisionPatternRefs ?? [])),
      excludedIntents: new Set(runDecisions.flatMap((decision) => (decision.excludedIntents ?? []).map((item) => item.intentRef))),
      excludedPatterns: new Set(runDecisions.flatMap((decision) => (decision.excludedDecisionPatterns ?? []).map((item) => item.decisionPatternRef))),
      rules: new Set(runDecisions.flatMap((decision) => decision.ruleRefs ?? []))
    };
    for (const ref of run.selectedIntentRefs ?? []) {
      if (!selectedByDecisions.intents.has(ref)) {
        errors.push(`${run.id} selected quality intent ${ref} is not selected by an applicability decision.`);
      }
      if (selectedByDecisions.excludedIntents.has(ref)) {
        errors.push(`${run.id} selected quality intent ${ref} was also excluded by an applicability decision.`);
      }
    }
    for (const ref of run.selectedDecisionPatternRefs ?? []) {
      if (!selectedByDecisions.patterns.has(ref)) {
        errors.push(`${run.id} selected decision pattern ${ref} is not selected by an applicability decision.`);
      }
      if (selectedByDecisions.excludedPatterns.has(ref)) {
        errors.push(`${run.id} selected decision pattern ${ref} was also excluded by an applicability decision.`);
      }
    }
    for (const ref of run.applicabilityRuleRefs ?? []) {
      if (!selectedByDecisions.rules.has(ref)) {
        errors.push(`${run.id} applicability rule ${ref} is not used by its applicability decisions.`);
      }
    }
    if (!Array.isArray(run.verdicts) || run.verdicts.length === 0) {
      errors.push(`${run.id} must include verdicts.`);
    } else {
      let hasLowConfidence = false;
      let hasConflict = false;
      const computedVerdicts = [];
      for (const verdict of run.verdicts) {
        checkRefs([verdict.intentRef], intentIndex, "quality intent", `${run.id}/verdict`);
        checkRefs(verdict.evidenceRefs, evidenceIndex, "evidence", `${run.id}/verdict`);
        checkRefs([verdict.confidencePolicyRef], confidencePolicyIndex, "confidence policy", `${run.id}/verdict`);
        checkScore(verdict.confidence, "confidence", `${run.id}/verdict`);
        checkPositiveNumber(verdict.weight, "weight", `${run.id}/verdict`);
        const verdictPolicy = confidencePolicyIndex.get(verdict.confidencePolicyRef);
        const verdictEvidence = (verdict.evidenceRefs ?? []).map((ref) => evidenceIndex.get(ref)).filter(Boolean);
        if (verdictPolicy) {
          const expectedVerdictConfidence = aggregateConfidence(
            verdictEvidence.map((item) => ({ confidence: item.confidence, weight: item.weight })),
            verdictPolicy.verdictAggregationRule,
            `${run.id}/verdict/${verdict.intentRef}`
          );
          if (rounded(verdict.confidence) !== expectedVerdictConfidence) {
            errors.push(`${run.id}/verdict/${verdict.intentRef} confidence must reproduce from evidence inputs and policy ${verdict.confidencePolicyRef}: ${expectedVerdictConfidence}.`);
          }
          computedVerdicts.push({ confidence: expectedVerdictConfidence, weight: verdict.weight });
        } else {
          computedVerdicts.push({ confidence: verdict.confidence, weight: verdict.weight });
        }
        if (verdict.confidence < 0.55) {
          hasLowConfidence = true;
        }
        const polarities = new Set(verdictEvidence.map((item) => item.polarity));
        if (polarities.has("supports") && (polarities.has("contradicts") || polarities.has("mixed"))) {
          hasConflict = true;
        }
      }
      if ((hasLowConfidence || hasConflict) && (!Array.isArray(run.governanceTriggerRefs) || run.governanceTriggerRefs.length === 0)) {
        errors.push(`${run.id} must trigger governance review when confidence is low or evidence conflicts.`);
      }
      const runPolicy = confidencePolicyIndex.get(run.confidencePolicyRef);
      if (runPolicy) {
        const expectedRunConfidence = aggregateConfidence(computedVerdicts, runPolicy.reviewRunAggregationRule, run.id);
        if (rounded(run.confidence) !== expectedRunConfidence) {
          errors.push(`${run.id} confidence must reproduce from evidence inputs, verdict aggregation, and review-run policy ${run.confidencePolicyRef}: ${expectedRunConfidence}.`);
        }
      }
      const triggerTypes = new Set((run.governanceTriggerRefs ?? []).map((ref) => governanceIndex.get(ref)?.triggerType).filter(Boolean));
      if (hasLowConfidence && !triggerTypes.has("low-confidence")) {
        errors.push(`${run.id} must include a low-confidence governance trigger.`);
      }
      if (hasConflict && !triggerTypes.has("conflicting-evidence")) {
        errors.push(`${run.id} must include a conflicting-evidence governance trigger.`);
      }
    }
    const hasContextMismatch = runDecisions.some((decision) => Array.isArray(decision.contextMismatches) && decision.contextMismatches.length > 0);
    const runTriggerTypes = new Set((run.governanceTriggerRefs ?? []).map((ref) => governanceIndex.get(ref)?.triggerType).filter(Boolean));
    if (hasContextMismatch && !runTriggerTypes.has("context-mismatch")) {
      errors.push(`${run.id} must include a context-mismatch governance trigger when applicability decisions record context mismatches.`);
    }
    if (!Array.isArray(run.residualRisks) || run.residualRisks.length === 0) {
      errors.push(`${run.id} must include residualRisks.`);
    }
    if (!Array.isArray(run.recommendations) || run.recommendations.length === 0) {
      errors.push(`${run.id} must include recommendations.`);
    }
    checkRefs(run.governanceTriggerRefs, governanceIndex, "governance trigger", run.id);
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      evaluationTargets: targets.length,
      qualityIntents: qualityIntents.length,
      decisionPatterns: decisionPatterns.length,
      applicabilityRules: applicabilityRules.length,
      applicabilityDecisions: applicabilityDecisions.length,
      confidencePolicies: confidencePolicies.length,
      evidenceItems: evidenceItems.length,
      indicators: indicators.length,
      governanceTriggers: governanceTriggers.length,
      governanceEvents: governanceEvents.length,
      reviewRuns: reviewRuns.length
    }
  });
}

const CANONICAL_PERSPECTIVES = new Set([
  "functional quality",
  "regression quality",
  "automation",
  "coverage",
  "quantitative evidence",
  "evidence traceability",
  "continuity",
  "shift-left",
  "release decision",
  "operational quality",
  "improvement",
  "external dependency"
]);
const CANONICAL_QUALITY_ASPECTS = new Set([
  "functional suitability",
  "business fit",
  "usability",
  "ux design",
  "accessibility",
  "performance efficiency",
  "scalability",
  "availability",
  "reliability",
  "recoverability",
  "security",
  "privacy",
  "data quality",
  "operational quality",
  "maintainability",
  "changeability",
  "auditability",
  "compliance",
  "safety",
  "cost efficiency",
  "customer impact",
  "brand trust",
  "organizational operability"
]);
const QUANTITY_TYPES = new Set(["how-many", "how-much", "how-long", "how-often", "impact"]);
const GATE_DECISIONS = new Set(["Go", "Conditional Go", "No-Go", "Pending"]);
const HIGH_SEVERITIES = new Set(["high", "critical"]);
const FINDING_FINAL_STATUSES = new Set(["candidate", "confirmed", "false-positive", "mitigated", "accepted-risk", "needs-governance"]);
const TRUST_STATUSES = new Set(["draft", "verified", "stale", "rejected"]);
const EVALUATION_TIMINGS = new Set(["pre-implementation", "pre-release", "post-release", "continuous", "incident-driven"]);
const EVALUATION_TIMING_DECISION_STATUSES = new Set(["scheduled", "completed", "waived", "blocked"]);
const RETENTION_SENSITIVITIES = new Set(["public", "internal", "confidential", "restricted"]);
const RETENTION_INTEGRITY_PROTECTIONS = new Set(["none", "checksum", "signed-artifact", "immutable-log"]);
const RETENTION_ACCESS_CONTROLS = new Set(["open", "internal-only", "need-to-know", "regulatory-controlled"]);
const QUALITY_REPORT_STATUSES = new Set(["draft", "published", "superseded"]);
const QUALITY_REPORT_SCORE_TYPES = new Set(["confidence-summary", "verdict-summary", "readiness-rating", "residual-risk-rating", "custom"]);

function validateQualityGatePackage(pkg, packagePath) {
  const targets = requireArray(pkg, "evaluationTargets");
  const qualityIntents = requireArray(pkg, "qualityIntents");
  const qualityAspects = requireArray(pkg, "qualityAspects");
  const perspectives = requireArray(pkg, "evaluationPerspectives");
  const confidencePolicies = requireArray(pkg, "confidencePolicies");
  const evaluationTimingRules = requireArray(pkg, "evaluationTimingRules");
  const evaluationTimingDecisions = requireArray(pkg, "evaluationTimingDecisions");
  const evidenceRetentionPolicies = requireArray(pkg, "evidenceRetentionPolicies");
  const evidenceTypeVocabulary = requireArray(pkg, "evidenceTypeVocabulary");
  const evidenceItems = requireArray(pkg, "evidenceItems");
  const quantitativeRecords = requireArray(pkg, "quantitativeEvidenceRecords");
  const automatedDetails = Array.isArray(pkg.automatedEvaluationDetails) ? pkg.automatedEvaluationDetails : [];
  const gateRules = requireArray(pkg, "qualityGateRules");
  const gateDecisions = requireArray(pkg, "qualityGateDecisions");
  const qualityReports = requireArray(pkg, "qualityReports");
  const postReleaseReviews = Array.isArray(pkg.postReleaseReviews) ? pkg.postReleaseReviews : [];
  const improvementActions = Array.isArray(pkg.improvementActions) ? pkg.improvementActions : [];
  const traceabilityLinks = Array.isArray(pkg.traceabilityLinks) ? pkg.traceabilityLinks : [];
  const governanceTriggers = requireArray(pkg, "governanceTriggers");
  const governanceEvents = requireArray(pkg, "governanceEvents");
  const verifierBoundary = pkg.verifierBoundary;

  const targetIndex = indexById(targets, `${packagePath}:evaluationTargets`);
  const intentIndex = indexById(qualityIntents, `${packagePath}:qualityIntents`);
  const aspectIndex = indexById(qualityAspects, `${packagePath}:qualityAspects`);
  const perspectiveIndex = indexById(perspectives, `${packagePath}:evaluationPerspectives`);
  const confidencePolicyIndex = indexById(confidencePolicies, `${packagePath}:confidencePolicies`);
  const evaluationTimingRuleIndex = indexById(evaluationTimingRules, `${packagePath}:evaluationTimingRules`);
  const evaluationTimingDecisionIndex = indexById(evaluationTimingDecisions, `${packagePath}:evaluationTimingDecisions`);
  const evidenceRetentionPolicyIndex = indexById(evidenceRetentionPolicies, `${packagePath}:evidenceRetentionPolicies`);
  const evidenceTypeVocabularyIndex = indexById(evidenceTypeVocabulary, `${packagePath}:evidenceTypeVocabulary`);
  const evidenceIndex = indexById(evidenceItems, `${packagePath}:evidenceItems`);
  const quantitativeIndex = indexById(quantitativeRecords, `${packagePath}:quantitativeEvidenceRecords`);
  const automatedIndex = indexById(automatedDetails, `${packagePath}:automatedEvaluationDetails`);
  const gateRuleIndex = indexById(gateRules, `${packagePath}:qualityGateRules`);
  const gateDecisionIndex = indexById(gateDecisions, `${packagePath}:qualityGateDecisions`);
  const qualityReportIndex = indexById(qualityReports, `${packagePath}:qualityReports`);
  const postReleaseIndex = indexById(postReleaseReviews, `${packagePath}:postReleaseReviews`);
  const improvementIndex = indexById(improvementActions, `${packagePath}:improvementActions`);
  const governanceIndex = indexById(governanceTriggers, `${packagePath}:governanceTriggers`);
  const governanceEventIndex = indexById(governanceEvents, `${packagePath}:governanceEvents`);

  // A global id index lets traceability links resolve across every entity family.
  const globalIndex = new Map();
  for (const family of [targetIndex, intentIndex, aspectIndex, perspectiveIndex, confidencePolicyIndex, evaluationTimingRuleIndex, evaluationTimingDecisionIndex, evidenceRetentionPolicyIndex, evidenceTypeVocabularyIndex, evidenceIndex, quantitativeIndex, automatedIndex, gateRuleIndex, gateDecisionIndex, qualityReportIndex, postReleaseIndex, improvementIndex, governanceIndex, governanceEventIndex]) {
    for (const [id, item] of family.entries()) {
      globalIndex.set(id, item);
    }
  }

  for (const target of targets) {
    for (const field of ["title", "domain", "artifactType", "context", "operationalImpact"]) {
      checkRequiredString(target, field, target.id);
    }
    if (!Array.isArray(target.stakeholderImpact) || target.stakeholderImpact.length === 0) {
      errors.push(`${target.id} must include stakeholderImpact.`);
    }
  }
  for (const intent of qualityIntents) {
    checkRequiredString(intent, "statement", intent.id);
    checkRequiredString(intent, "lossBoundary", intent.id);
    checkRequiredString(intent, "lossBoundarySeverity", intent.id);
  }
  const aspectNames = new Set();
  for (const aspect of qualityAspects) {
    if (!CANONICAL_QUALITY_ASPECTS.has(aspect.name)) {
      errors.push(`${aspect.id} uses unsupported quality aspect ${aspect.name}.`);
    }
    if (aspectNames.has(aspect.name)) {
      errors.push(`${aspect.id} duplicates quality aspect name ${aspect.name}.`);
    }
    aspectNames.add(aspect.name);
    checkRequiredString(aspect, "purpose", aspect.id);
    if (aspect.interpretation !== "discovery-lens-only") {
      errors.push(`${aspect.id} quality aspect must be interpreted as discovery-lens-only, not as quality itself.`);
    }
    for (const field of ["discoveryQuestions", "typicalConcerns", "possibleLossBoundaries", "evidenceExamples", "antiPatterns"]) {
      checkNonEmptyArray(aspect, field, aspect.id);
    }
  }
  for (const perspective of perspectives) {
    if (!CANONICAL_PERSPECTIVES.has(perspective.perspective)) {
      errors.push(`${perspective.id} uses unsupported evaluation perspective ${perspective.perspective}.`);
    }
    checkRequiredString(perspective, "rationale", perspective.id);
    checkRefs(perspective.linkedAspectRefs, aspectIndex, "quality aspect", perspective.id);
    checkRefs(perspective.linkedIntentRefs, intentIndex, "quality intent", perspective.id);
  }
  for (const policy of confidencePolicies) {
    checkRequiredString(policy, "evidenceAggregationRule", policy.id);
    checkRequiredString(policy, "verdictAggregationRule", policy.id);
    checkRequiredString(policy, "reviewRunAggregationRule", policy.id);
    checkRequiredString(policy, "rounding", policy.id);
  }
  for (const rule of evaluationTimingRules) {
    checkRequiredString(rule, "title", rule.id);
    checkRefs(rule.appliesToIntentRefs, intentIndex, "quality intent", rule.id);
    if (!EVALUATION_TIMINGS.has(rule.timing)) {
      errors.push(`${rule.id} timing must be one of pre-implementation, pre-release, post-release, continuous, incident-driven.`);
    }
    checkNonEmptyArray(rule, "triggerConditions", rule.id);
    if (typeof rule.requiredBeforeDecision !== "boolean") {
      errors.push(`${rule.id} requiredBeforeDecision must be boolean.`);
    }
    checkRequiredString(rule, "latestAllowedStage", rule.id);
    checkNonEmptyArray(rule, "antiPatterns", rule.id);
  }
  const declaredEvidenceTypes = new Map();
  for (const entry of evidenceTypeVocabulary) {
    checkRequiredString(entry, "evidenceType", entry.id);
    checkRequiredString(entry, "purpose", entry.id);
    checkRequiredString(entry, "sourceCategory", entry.id);
    if (declaredEvidenceTypes.has(entry.evidenceType)) {
      errors.push(`${entry.id} duplicates evidence type ${entry.evidenceType}.`);
    }
    declaredEvidenceTypes.set(entry.evidenceType, entry);
    if (!["high", "medium", "low"].includes(entry.expectedIndependence)) {
      errors.push(`${entry.id} expectedIndependence must be high, medium, or low.`);
    }
    if (typeof entry.trustRequired !== "boolean") {
      errors.push(`${entry.id} trustRequired must be boolean.`);
    }
    if (typeof entry.findingEvidenceRequired !== "boolean") {
      errors.push(`${entry.id} findingEvidenceRequired must be boolean.`);
    }
    checkNonEmptyArray(entry, "antiPatterns", entry.id);
  }
  const usedRetentionPolicyRefs = new Set();
  for (const policy of evidenceRetentionPolicies) {
    checkRequiredString(policy, "title", policy.id);
    checkNonEmptyArray(policy, "appliesToEvidenceTypes", policy.id);
    for (const evidenceType of policy.appliesToEvidenceTypes ?? []) {
      if (!declaredEvidenceTypes.has(evidenceType)) {
        errors.push(`${policy.id} applies to undeclared evidence type ${evidenceType}.`);
      }
    }
    checkRequiredString(policy, "retentionPeriod", policy.id);
    if (!RETENTION_SENSITIVITIES.has(policy.sensitivity)) {
      errors.push(`${policy.id} sensitivity must be one of public, internal, confidential, restricted.`);
    }
    if (!RETENTION_INTEGRITY_PROTECTIONS.has(policy.integrityProtection)) {
      errors.push(`${policy.id} integrityProtection must be one of none, checksum, signed-artifact, immutable-log.`);
    }
    if (!RETENTION_ACCESS_CONTROLS.has(policy.accessControl)) {
      errors.push(`${policy.id} accessControl must be one of open, internal-only, need-to-know, regulatory-controlled.`);
    }
    checkRequiredString(policy, "disposalRule", policy.id);
    checkRequiredString(policy, "owner", policy.id);
    checkNonEmptyArray(policy, "antiPatterns", policy.id);
    if ((policy.sensitivity === "confidential" || policy.sensitivity === "restricted") && (policy.accessControl === "open" || policy.accessControl === "internal-only")) {
      errors.push(`${policy.id} ${policy.sensitivity} evidence must use need-to-know or regulatory-controlled access.`);
    }
    if (policy.sensitivity === "restricted" && (policy.integrityProtection === "none" || policy.integrityProtection === "checksum")) {
      errors.push(`${policy.id} restricted evidence must use signed-artifact or immutable-log integrity protection.`);
    }
  }
  for (const timingDecision of evaluationTimingDecisions) {
    checkRefs([timingDecision.targetRef], targetIndex, "evaluation target", timingDecision.id);
    checkRefs(timingDecision.timingRuleRefs, evaluationTimingRuleIndex, "evaluation timing rule", timingDecision.id);
    checkMaybeRefs(timingDecision.evidenceRefs, evidenceIndex, "timing decision evidence", timingDecision.id);
    checkRequiredString(timingDecision, "decisionRationale", timingDecision.id);
    checkScore(timingDecision.confidence, "confidence", timingDecision.id);
    checkRequiredString(timingDecision, "owner", timingDecision.id);
    if (!EVALUATION_TIMINGS.has(timingDecision.selectedTiming)) {
      errors.push(`${timingDecision.id} selectedTiming must be one of pre-implementation, pre-release, post-release, continuous, incident-driven.`);
    }
    if (!EVALUATION_TIMING_DECISION_STATUSES.has(timingDecision.status)) {
      errors.push(`${timingDecision.id} status must be one of scheduled, completed, waived, blocked.`);
    }
    const citedRules = (timingDecision.timingRuleRefs ?? []).map((ref) => evaluationTimingRuleIndex.get(ref)).filter(Boolean);
    if (citedRules.length > 0 && !citedRules.some((rule) => rule.timing === timingDecision.selectedTiming)) {
      errors.push(`${timingDecision.id} selectedTiming ${timingDecision.selectedTiming} is not allowed by its cited timing rules.`);
    }
    if (timingDecision.appliesBeforeGateDecisionRef !== undefined) {
      checkRefs([timingDecision.appliesBeforeGateDecisionRef], gateDecisionIndex, "gate decision", timingDecision.id);
      const gateDecision = gateDecisionIndex.get(timingDecision.appliesBeforeGateDecisionRef);
      if (gateDecision && gateDecision.targetRef !== timingDecision.targetRef) {
        errors.push(`${timingDecision.id} applies before gate decision ${gateDecision.id} for a different target.`);
      }
    }
    if (citedRules.some((rule) => rule.requiredBeforeDecision) && timingDecision.appliesBeforeGateDecisionRef === undefined) {
      errors.push(`${timingDecision.id} cites a required-before-decision timing rule and must include appliesBeforeGateDecisionRef.`);
    }
    if (timingDecision.status === "completed" && (!Array.isArray(timingDecision.evidenceRefs) || timingDecision.evidenceRefs.length === 0)) {
      errors.push(`${timingDecision.id} is completed and must cite timing decision evidence.`);
    }
    if (timingDecision.status === "waived") {
      checkRequiredString(timingDecision, "waiverRationale", timingDecision.id);
      checkRefs(timingDecision.governanceTriggerRefs, governanceIndex, "governance trigger", timingDecision.id);
    } else if (timingDecision.governanceTriggerRefs !== undefined) {
      checkMaybeRefs(timingDecision.governanceTriggerRefs, governanceIndex, "governance trigger", timingDecision.id);
    }
  }
  const usedEvidenceTypes = new Set();
  for (const evidence of evidenceItems) {
    checkRefs([evidence.targetRef], targetIndex, "evaluation target", evidence.id);
    checkRequiredString(evidence, "evidenceType", evidence.id);
    usedEvidenceTypes.add(evidence.evidenceType);
    const vocabularyEntry = declaredEvidenceTypes.get(evidence.evidenceType);
    if (!vocabularyEntry) {
      errors.push(`${evidence.id} uses undeclared evidenceType ${evidence.evidenceType}.`);
    }
    checkRequiredString(evidence, "finding", evidence.id);
    checkRequiredString(evidence, "evaluatorRole", evidence.id);
    checkRequiredString(evidence, "retention", evidence.id);
    checkRefs([evidence.retentionPolicyRef], evidenceRetentionPolicyIndex, "evidence retention policy", evidence.id);
    usedRetentionPolicyRefs.add(evidence.retentionPolicyRef);
    const retentionPolicy = evidenceRetentionPolicyIndex.get(evidence.retentionPolicyRef);
    if (retentionPolicy && !(retentionPolicy.appliesToEvidenceTypes ?? []).includes(evidence.evidenceType)) {
      errors.push(`${evidence.id} evidenceType ${evidence.evidenceType} is not covered by retention policy ${retentionPolicy.id}.`);
    }
    if (!["high", "medium", "low"].includes(evidence.independence)) {
      errors.push(`${evidence.id} independence must be high, medium, or low.`);
    }
    if (!["supports", "contradicts", "mixed", "neutral"].includes(evidence.polarity)) {
      errors.push(`${evidence.id} polarity must be supports, contradicts, mixed, or neutral.`);
    }
    checkScore(evidence.confidence, "confidence", evidence.id);
    checkPositiveNumber(evidence.weight, "weight", evidence.id);
    if (evidence.findingEvidence !== undefined) {
      if (typeof evidence.findingEvidence !== "object" || evidence.findingEvidence === null || Array.isArray(evidence.findingEvidence)) {
        errors.push(`${evidence.id}/findingEvidence must be an object.`);
        continue;
      }
      for (const field of ["generatedBy", "sourceArtifact", "reproducedBy"]) {
        checkRequiredString(evidence.findingEvidence, field, `${evidence.id}/findingEvidence`);
      }
      for (const field of ["reproducible", "falsePositiveChecked", "impactConfirmed"]) {
        if (typeof evidence.findingEvidence[field] !== "boolean") {
          errors.push(`${evidence.id}/findingEvidence ${field} must be boolean.`);
        }
      }
      if (!FINDING_FINAL_STATUSES.has(evidence.findingEvidence.finalStatus)) {
        errors.push(`${evidence.id}/findingEvidence finalStatus must be one of candidate, confirmed, false-positive, mitigated, accepted-risk, needs-governance.`);
      }
      if (evidence.findingEvidence.finalStatus === "confirmed" && (!evidence.findingEvidence.reproducible || !evidence.findingEvidence.falsePositiveChecked || !evidence.findingEvidence.impactConfirmed)) {
        errors.push(`${evidence.id}/findingEvidence cannot be confirmed until reproducible, falsePositiveChecked, and impactConfirmed are true.`);
      }
    }
    if (evidence.trust !== undefined) {
      if (typeof evidence.trust !== "object" || evidence.trust === null || Array.isArray(evidence.trust)) {
        errors.push(`${evidence.id}/trust must be an object.`);
        continue;
      }
      checkRequiredString(evidence.trust, "generatedBy", `${evidence.id}/trust`);
      checkRequiredString(evidence.trust, "staleAfter", `${evidence.id}/trust`);
      if (!Array.isArray(evidence.trust.sources)) {
        errors.push(`${evidence.id}/trust sources must be an array.`);
      } else if (evidence.trust.status === "verified" && evidence.trust.sources.length === 0) {
        errors.push(`${evidence.id}/trust verified status requires at least one source.`);
      }
      if (!Array.isArray(evidence.trust.verifiedBy)) {
        errors.push(`${evidence.id}/trust verifiedBy must be an array.`);
      } else if (evidence.trust.status === "verified" && evidence.trust.verifiedBy.length === 0) {
        errors.push(`${evidence.id}/trust verified status requires at least one verifier.`);
      }
      if (!TRUST_STATUSES.has(evidence.trust.status)) {
        errors.push(`${evidence.id}/trust status must be one of draft, verified, stale, rejected.`);
      }
    }
    if (vocabularyEntry?.trustRequired && evidence.trust === undefined) {
      errors.push(`${evidence.id} evidenceType ${evidence.evidenceType} requires trust metadata.`);
    }
    if (vocabularyEntry?.findingEvidenceRequired && evidence.findingEvidence === undefined) {
      errors.push(`${evidence.id} evidenceType ${evidence.evidenceType} requires findingEvidence metadata.`);
    }
  }
  for (const entry of evidenceTypeVocabulary) {
    const requiredByGateRule = gateRules.some((rule) => (rule.requiredEvidenceTypes ?? []).includes(entry.evidenceType));
    if (!usedEvidenceTypes.has(entry.evidenceType) && !requiredByGateRule) {
      errors.push(`${entry.id} evidence type ${entry.evidenceType} is declared but not used by evidence items or gate rules.`);
    }
  }
  for (const policy of evidenceRetentionPolicies) {
    if (!usedRetentionPolicyRefs.has(policy.id)) {
      errors.push(`${policy.id} retention policy is declared but not used by any evidence item.`);
    }
  }
  for (const record of quantitativeRecords) {
    checkRequiredString(record, "metricName", record.id);
    checkRequiredString(record, "unit", record.id);
    checkRequiredString(record, "measurementMethod", record.id);
    checkRequiredString(record, "interpretationRule", record.id);
    if (typeof record.value !== "number") {
      errors.push(`${record.id} value must be a number.`);
    }
    if (!QUANTITY_TYPES.has(record.quantityType)) {
      errors.push(`${record.id} quantityType must be one of how-many, how-much, how-long, how-often, impact.`);
    }
    // Quantitative values are evidence metadata; they must never be treated as quality itself.
    if (record.interpretation !== "evidence-only") {
      errors.push(`${record.id} quantitative record must be interpreted as evidence-only, not as quality itself.`);
    }
    checkRefs([record.targetRef], targetIndex, "evaluation target", record.id);
    checkRefs([record.evidenceRef], evidenceIndex, "retained evidence", record.id);
    checkRefs([record.linkedIntentRef], intentIndex, "quality intent", record.id);
  }
  for (const detail of automatedDetails) {
    checkRequiredString(detail, "evaluationType", detail.id);
    checkRequiredString(detail, "executionMode", detail.id);
    checkRequiredString(detail, "trigger", detail.id);
    checkRequiredString(detail, "environment", detail.id);
    checkRefs([detail.evidenceRef], evidenceIndex, "retained evidence", detail.id);
    if (!["high", "medium", "low"].includes(detail.independence)) {
      errors.push(`${detail.id} independence must be high, medium, or low.`);
    }
    for (const field of ["executedCount", "passedCount", "failedCount"]) {
      if (typeof detail[field] !== "number" || detail[field] < 0) {
        errors.push(`${detail.id} ${field} must be a non-negative number.`);
      }
    }
    checkScore(detail.passRate, "passRate", detail.id);
    // Execution counts and passRate are evidence metadata and must be reproducible, like confidence.
    if ([detail.executedCount, detail.passedCount, detail.failedCount].every((value) => typeof value === "number")) {
      const accounted = detail.passedCount + detail.failedCount + (detail.skippedCount ?? 0) + (detail.blockedCount ?? 0);
      if (accounted !== detail.executedCount) {
        errors.push(`${detail.id} passed, failed, skipped, and blocked counts must sum to executedCount.`);
      }
      if (detail.executedCount > 0 && typeof detail.passRate === "number" && rounded(detail.passRate) !== rounded(detail.passedCount / detail.executedCount)) {
        errors.push(`${detail.id} passRate must reproduce from passedCount divided by executedCount.`);
      }
    }
  }
  for (const rule of gateRules) {
    checkRequiredString(rule, "title", rule.id);
    checkRefs(rule.appliesToIntentRefs, intentIndex, "quality intent", rule.id);
    checkNonEmptyArray(rule, "requiredEvidenceTypes", rule.id);
    checkNonEmptyArray(rule, "blockingConditions", rule.id);
    for (const requiredType of rule.requiredEvidenceTypes ?? []) {
      if (!declaredEvidenceTypes.has(requiredType)) {
        errors.push(`${rule.id} requires undeclared evidence type ${requiredType}.`);
      }
    }
  }

  const perspectiveCoveredIntents = new Set(perspectives.flatMap((perspective) => perspective.linkedIntentRefs ?? []));
  const perspectiveCoveredAspects = new Set(perspectives.flatMap((perspective) => perspective.linkedAspectRefs ?? []));
  for (const aspect of qualityAspects) {
    if (!perspectiveCoveredAspects.has(aspect.id)) {
      errors.push(`${aspect.id} quality aspect is defined but not used by any evaluation perspective.`);
    }
  }

  for (const decision of gateDecisions) {
    checkRefs([decision.targetRef], targetIndex, "evaluation target", decision.id);
    checkRefs(decision.gateRuleRefs, gateRuleIndex, "quality gate rule", decision.id);
    checkRefs([decision.confidencePolicyRef], confidencePolicyIndex, "confidence policy", decision.id);
    if (!GATE_DECISIONS.has(decision.decision)) {
      errors.push(`${decision.id} decision must be Go, Conditional Go, No-Go, or Pending.`);
    }
    checkScore(decision.confidence, "confidence", decision.id);
    if (!Array.isArray(decision.residualRisks) || decision.residualRisks.length === 0) {
      errors.push(`${decision.id} must include residualRisks.`);
    }
    checkMaybeRefs(decision.governanceTriggerRefs, governanceIndex, "governance trigger", decision.id);

    let hasLowConfidence = false;
    let hasConflict = false;
    let needsWeakEvidenceGovernance = false;
    let hasUnprotectedHighSeverity = false;
    const verdictByIntent = new Map();
    const computedVerdicts = [];
    if (!Array.isArray(decision.intentVerdicts) || decision.intentVerdicts.length === 0) {
      errors.push(`${decision.id} must include intentVerdicts.`);
    } else {
      for (const verdict of decision.intentVerdicts) {
        checkRefs([verdict.intentRef], intentIndex, "quality intent", `${decision.id}/verdict`);
        checkRefs(verdict.evidenceRefs, evidenceIndex, "evidence", `${decision.id}/verdict`);
        checkRefs([verdict.confidencePolicyRef], confidencePolicyIndex, "confidence policy", `${decision.id}/verdict`);
        checkScore(verdict.confidence, "confidence", `${decision.id}/verdict`);
        checkPositiveNumber(verdict.weight, "weight", `${decision.id}/verdict`);
        checkRequiredString(verdict, "residualRisk", `${decision.id}/verdict`);
        const verdictPolicy = confidencePolicyIndex.get(verdict.confidencePolicyRef);
        const verdictEvidence = (verdict.evidenceRefs ?? []).map((ref) => evidenceIndex.get(ref)).filter(Boolean);
        if (verdictPolicy) {
          const expected = aggregateConfidence(
            verdictEvidence.map((item) => ({ confidence: item.confidence, weight: item.weight })),
            verdictPolicy.verdictAggregationRule,
            `${decision.id}/verdict/${verdict.intentRef}`
          );
          if (rounded(verdict.confidence) !== expected) {
            errors.push(`${decision.id}/verdict/${verdict.intentRef} confidence must reproduce from evidence inputs and policy ${verdict.confidencePolicyRef}: ${expected}.`);
          }
          computedVerdicts.push({ confidence: expected, weight: verdict.weight });
        } else {
          computedVerdicts.push({ confidence: verdict.confidence, weight: verdict.weight });
        }
        if (verdict.confidence < 0.55) {
          hasLowConfidence = true;
        }
        const polarities = new Set(verdictEvidence.map((item) => item.polarity));
        if (polarities.has("supports") && (polarities.has("contradicts") || polarities.has("mixed"))) {
          hasConflict = true;
        }
        if (verdictByIntent.has(verdict.intentRef)) {
          errors.push(`${decision.id} has duplicate verdicts for quality intent ${verdict.intentRef}.`);
        } else {
          verdictByIntent.set(verdict.intentRef, verdict);
        }
        if (verdict.decision === "achieved" && !verdictEvidence.some((item) => item.polarity === "supports")) {
          errors.push(`${decision.id}/verdict/${verdict.intentRef} is achieved but cites no supporting evidence.`);
        }
        if (intentIndex.has(verdict.intentRef) && !perspectiveCoveredIntents.has(verdict.intentRef)) {
          errors.push(`${decision.id}/verdict/${verdict.intentRef} gates an intent that no evaluation perspective covers.`);
        }
        // A high-severity loss boundary must not be claimed achieved on low-independence evidence alone.
        const intent = intentIndex.get(verdict.intentRef);
        const supporting = verdictEvidence.filter((item) => item.polarity === "supports");
        const reliesOnSupport = verdict.decision === "achieved" || verdict.decision === "partially-achieved";
        if (intent && HIGH_SEVERITIES.has(intent.lossBoundarySeverity) && reliesOnSupport && supporting.length > 0 && supporting.every((item) => item.independence === "low")) {
          needsWeakEvidenceGovernance = true;
        }
        if (intent && HIGH_SEVERITIES.has(intent.lossBoundarySeverity) && (verdict.decision === "not-achieved" || verdict.decision === "inconclusive")) {
          hasUnprotectedHighSeverity = true;
        }
      }
      const runPolicy = confidencePolicyIndex.get(decision.confidencePolicyRef);
      if (runPolicy) {
        const expected = aggregateConfidence(computedVerdicts, runPolicy.reviewRunAggregationRule, decision.id);
        if (rounded(decision.confidence) !== expected) {
          errors.push(`${decision.id} confidence must reproduce from verdict confidences and policy ${decision.confidencePolicyRef}: ${expected}.`);
        }
      }
    }

    const triggerTypes = new Set((decision.governanceTriggerRefs ?? []).map((ref) => governanceIndex.get(ref)?.triggerType).filter(Boolean));
    if (hasLowConfidence && !triggerTypes.has("low-confidence")) {
      errors.push(`${decision.id} must include a low-confidence governance trigger when a verdict confidence is low.`);
    }
    if (hasConflict && !triggerTypes.has("conflicting-evidence")) {
      errors.push(`${decision.id} must include a conflicting-evidence governance trigger when verdict evidence conflicts.`);
    }
    if (needsWeakEvidenceGovernance) {
      if (decision.decision === "Go") {
        errors.push(`${decision.id} cannot be Go when a high-severity loss boundary is supported only by low-independence evidence.`);
      }
      if (!triggerTypes.has("weak-evidence")) {
        errors.push(`${decision.id} must include a weak-evidence governance trigger when a high-severity loss boundary relies only on low-independence evidence.`);
      }
    }
    if (hasUnprotectedHighSeverity && decision.decision === "Go") {
      errors.push(`${decision.id} cannot be Go while a high-severity loss boundary verdict is not-achieved or inconclusive.`);
    }
    const openSevereTriggerIds = (decision.governanceTriggerRefs ?? [])
      .map((ref) => governanceIndex.get(ref))
      .filter((trigger) => trigger && trigger.status === "open" && HIGH_SEVERITIES.has(trigger.severity))
      .map((trigger) => trigger.id);
    if (decision.decision === "Go" && openSevereTriggerIds.length > 0) {
      errors.push(`${decision.id} cannot be Go while high-severity governance triggers remain open: ${openSevereTriggerIds.join(", ")}.`);
    }

    // Gate rules are enforced, not decorative: every protected intent needs a verdict,
    // and a Go or Conditional Go must satisfy each cited rule's required evidence types.
    for (const ruleRef of decision.gateRuleRefs ?? []) {
      const rule = gateRuleIndex.get(ruleRef);
      if (!rule) {
        continue;
      }
      for (const intentRef of rule.appliesToIntentRefs ?? []) {
        const verdict = verdictByIntent.get(intentRef);
        if (!verdict) {
          errors.push(`${decision.id} cites gate rule ${ruleRef} but records no verdict for its protected intent ${intentRef}.`);
          continue;
        }
        if (decision.decision === "Go" || decision.decision === "Conditional Go") {
          const availableTypes = new Set((verdict.evidenceRefs ?? []).map((ref) => evidenceIndex.get(ref)?.evidenceType).filter(Boolean));
          for (const requiredType of rule.requiredEvidenceTypes ?? []) {
            if (!availableTypes.has(requiredType)) {
              errors.push(`${decision.id} is ${decision.decision} but intent ${intentRef} lacks required evidence type ${requiredType} from gate rule ${ruleRef}; collect the evidence or record Pending.`);
            }
          }
        }
      }
    }

    // Release-completeness rules: a Go or Conditional Go must be safe to reverse and observe.
    if (decision.decision === "Go" || decision.decision === "Conditional Go") {
      for (const field of ["rollbackPlan", "monitoringPlan", "approvalOwner"]) {
        checkRequiredString(decision, field, decision.id);
      }
    }
    if (decision.decision === "Conditional Go") {
      if (!Array.isArray(decision.conditions) || decision.conditions.length === 0) {
        errors.push(`${decision.id} is Conditional Go and must include explicit conditions.`);
      } else {
        for (const condition of decision.conditions) {
          for (const field of ["condition", "owner", "monitoring"]) {
            checkRequiredString(condition, field, `${decision.id}/condition`);
          }
        }
      }
    }
    if (decision.decision === "No-Go") {
      const hasCitedRule = typeof decision.violatedGateRuleRef === "string" && gateRuleIndex.has(decision.violatedGateRuleRef);
      const hasCitedBoundary = typeof decision.violatedLossBoundary === "string" && decision.violatedLossBoundary.trim() !== "";
      if (!hasCitedRule && !hasCitedBoundary) {
        errors.push(`${decision.id} is No-Go and must cite a violated loss boundary or gate rule.`);
      }
    }
    if (decision.decision === "Pending") {
      if (!Array.isArray(decision.missingEvidence) || decision.missingEvidence.length === 0) {
        errors.push(`${decision.id} is Pending and must list the missing evidence.`);
      }
    }
  }

  for (const gateDecision of gateDecisions) {
    const coveredTimingRuleRefs = new Set(
      evaluationTimingDecisions
        .filter((timingDecision) => timingDecision.appliesBeforeGateDecisionRef === gateDecision.id && timingDecision.targetRef === gateDecision.targetRef && timingDecision.status === "completed")
        .flatMap((timingDecision) => timingDecision.timingRuleRefs ?? [])
    );
    for (const rule of evaluationTimingRules) {
      if (rule.requiredBeforeDecision && !(rule.appliesToIntentRefs ?? []).every((intentRef) => coveredTimingRuleRefs.has(rule.id) || !(gateDecision.intentVerdicts ?? []).some((verdict) => verdict.intentRef === intentRef))) {
        errors.push(`${gateDecision.id} lacks completed evaluation timing decision for required timing rule ${rule.id}.`);
      }
    }
  }

  for (const report of qualityReports) {
    checkRefs([report.targetRef], targetIndex, "evaluation target", report.id);
    checkRefs(report.gateDecisionRefs, gateDecisionIndex, "gate decision", report.id);
    for (const field of ["title", "reportPurpose", "generatedBy", "summary"]) {
      checkRequiredString(report, field, report.id);
    }
    if (!QUALITY_REPORT_STATUSES.has(report.status)) {
      errors.push(`${report.id} status must be one of draft, published, superseded.`);
    }
    checkNonEmptyArray(report, "limitations", report.id);
    checkNonEmptyArray(report, "antiPatterns", report.id);
    const reportGateDecisions = (report.gateDecisionRefs ?? []).map((ref) => gateDecisionIndex.get(ref)).filter(Boolean);
    if (reportGateDecisions.some((decision) => decision.targetRef !== report.targetRef)) {
      errors.push(`${report.id} cannot summarize gate decisions for a different target.`);
    }
    const reportVerdictIntentRefs = new Set(reportGateDecisions.flatMap((decision) => (decision.intentVerdicts ?? []).map((verdict) => verdict.intentRef)));
    const reportVerdictEvidenceRefs = new Set(reportGateDecisions.flatMap((decision) => (decision.intentVerdicts ?? []).flatMap((verdict) => verdict.evidenceRefs ?? [])));
    if (!Array.isArray(report.reportedScores) || report.reportedScores.length === 0) {
      errors.push(`${report.id} must include reportedScores.`);
    } else {
      const scoreIds = new Set();
      for (const score of report.reportedScores) {
        if (scoreIds.has(score.id)) {
          errors.push(`${report.id} has duplicate reported score ${score.id}.`);
        }
        scoreIds.add(score.id);
        for (const field of ["label", "calculationNote"]) {
          checkRequiredString(score, field, `${report.id}/score/${score.id}`);
        }
        if (!QUALITY_REPORT_SCORE_TYPES.has(score.scoreType)) {
          errors.push(`${report.id}/score/${score.id} scoreType must be one of confidence-summary, verdict-summary, readiness-rating, residual-risk-rating, custom.`);
        }
        checkScore(score.value, "value", `${report.id}/score/${score.id}`);
        if (score.interpretation !== "report-summary-only") {
          errors.push(`${report.id}/score/${score.id} must be interpreted as report-summary-only, not as quality itself.`);
        }
        checkRefs(score.gateDecisionRefs, gateDecisionIndex, "gate decision", `${report.id}/score/${score.id}`);
        checkRefs(score.intentRefs, intentIndex, "quality intent", `${report.id}/score/${score.id}`);
        checkRefs(score.evidenceRefs, evidenceIndex, "evidence", `${report.id}/score/${score.id}`);
        for (const gateDecisionRef of score.gateDecisionRefs ?? []) {
          if (!(report.gateDecisionRefs ?? []).includes(gateDecisionRef)) {
            errors.push(`${report.id}/score/${score.id} cites gate decision ${gateDecisionRef} outside the report gateDecisionRefs.`);
          }
        }
        for (const intentRef of score.intentRefs ?? []) {
          if (!reportVerdictIntentRefs.has(intentRef)) {
            errors.push(`${report.id}/score/${score.id} intent ${intentRef} is not decomposed from the report's gate verdicts.`);
          }
        }
        for (const evidenceRef of score.evidenceRefs ?? []) {
          if (!reportVerdictEvidenceRefs.has(evidenceRef)) {
            errors.push(`${report.id}/score/${score.id} evidence ${evidenceRef} is not decomposed from the report's gate verdict evidence.`);
          }
        }
      }
    }
    if (!Array.isArray(report.sections) || report.sections.length === 0) {
      errors.push(`${report.id} must include sections.`);
    } else {
      const sectionIds = new Set();
      for (const section of report.sections) {
        if (sectionIds.has(section.id)) {
          errors.push(`${report.id} has duplicate section ${section.id}.`);
        }
        sectionIds.add(section.id);
        for (const field of ["heading", "narrative"]) {
          checkRequiredString(section, field, `${report.id}/section/${section.id}`);
        }
        checkRefs(section.gateDecisionRefs, gateDecisionIndex, "gate decision", `${report.id}/section/${section.id}`);
        checkRefs(section.intentRefs, intentIndex, "quality intent", `${report.id}/section/${section.id}`);
        checkRefs(section.evidenceRefs, evidenceIndex, "evidence", `${report.id}/section/${section.id}`);
        for (const gateDecisionRef of section.gateDecisionRefs ?? []) {
          if (!(report.gateDecisionRefs ?? []).includes(gateDecisionRef)) {
            errors.push(`${report.id}/section/${section.id} cites gate decision ${gateDecisionRef} outside the report gateDecisionRefs.`);
          }
        }
        for (const intentRef of section.intentRefs ?? []) {
          if (!reportVerdictIntentRefs.has(intentRef)) {
            errors.push(`${report.id}/section/${section.id} intent ${intentRef} is not decomposed from the report's gate verdicts.`);
          }
        }
        for (const evidenceRef of section.evidenceRefs ?? []) {
          if (!reportVerdictEvidenceRefs.has(evidenceRef)) {
            errors.push(`${report.id}/section/${section.id} evidence ${evidenceRef} is not decomposed from the report's gate verdict evidence.`);
          }
        }
      }
    }
  }

  for (const trigger of governanceTriggers) {
    for (const field of ["triggerType", "reason", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
    }
    checkRefs([trigger.sourceGateDecisionRef], gateDecisionIndex, "source gate decision", trigger.id);
    checkRefs([trigger.affectedTargetRef], targetIndex, "affected target", trigger.id);
    if (trigger.resultingGovernanceEventRef) {
      checkRefs([trigger.resultingGovernanceEventRef], governanceEventIndex, "resulting governance event", trigger.id);
      const event = governanceEventIndex.get(trigger.resultingGovernanceEventRef);
      if (event && event.sourceGovernanceTriggerRef !== trigger.id) {
        errors.push(`${trigger.id} resulting governance event ${event.id} points to a different trigger.`);
      }
    } else if (trigger.status !== "open") {
      errors.push(`${trigger.id} is not open and must link to a resultingGovernanceEventRef.`);
    }
  }
  for (const event of governanceEvents) {
    checkRefs([event.sourceGovernanceTriggerRef], governanceIndex, "source governance trigger", event.id);
    for (const field of ["decision", "decidedBy", "decisionRationale", "status"]) {
      checkRequiredString(event, field, event.id);
    }
  }

  for (const review of postReleaseReviews) {
    checkRefs([review.gateDecisionRef], gateDecisionIndex, "gate decision", review.id);
    checkRequiredString(review, "window", review.id);
    checkRequiredString(review, "summary", review.id);
    if (!Array.isArray(review.incidents)) {
      errors.push(`${review.id} must include an incidents array.`);
    }
    checkMaybeRefs(review.improvementActionRefs ?? [], improvementIndex, "improvement action", review.id);
    checkMaybeRefs(review.feedsQualityIntentRefs ?? [], intentIndex, "quality intent", review.id);
    const hasSevereIncident = (review.incidents ?? []).some((incident) => HIGH_SEVERITIES.has(incident.severity));
    if (hasSevereIncident && (!Array.isArray(review.improvementActionRefs) || review.improvementActionRefs.length === 0)) {
      errors.push(`${review.id} records a high-severity incident and must link at least one improvement action.`);
    }
    for (const incident of review.incidents ?? []) {
      checkRequiredString(incident, "description", `${review.id}/incident`);
      if (!["low", "medium", "high", "critical"].includes(incident.severity)) {
        errors.push(`${review.id}/incident ${incident.id} severity must be low, medium, high, or critical.`);
      }
      if (!Array.isArray(incident.affectedStakeholders) || incident.affectedStakeholders.length === 0) {
        errors.push(`${review.id}/incident ${incident.id} must include affectedStakeholders.`);
      }
    }
  }
  for (const action of improvementActions) {
    for (const field of ["title", "correctiveAction", "effectMeasurement", "status"]) {
      checkRequiredString(action, field, action.id);
    }
    checkRefs([action.sourcePostReleaseReviewRef], postReleaseIndex, "source post-release review", action.id);
    const sourceReview = postReleaseIndex.get(action.sourcePostReleaseReviewRef);
    if (sourceReview && !(sourceReview.improvementActionRefs ?? []).includes(action.id)) {
      errors.push(`${action.id} cites post-release review ${sourceReview.id} that does not list it in improvementActionRefs.`);
    }
  }
  for (const link of traceabilityLinks) {
    checkRequiredString(link, "linkType", link.id);
    if (!globalIndex.has(link.sourceRef)) {
      errors.push(`${link.id} references missing sourceRef: ${link.sourceRef}`);
    }
    if (!globalIndex.has(link.targetRef)) {
      errors.push(`${link.id} references missing targetRef: ${link.targetRef}`);
    }
  }

  if (!verifierBoundary || typeof verifierBoundary !== "object") {
    errors.push(`${packagePath} must include verifierBoundary.`);
  } else {
    for (const field of ["checks", "doesNotClaim", "semanticValidityRequires"]) {
      if (!Array.isArray(verifierBoundary[field]) || verifierBoundary[field].length === 0) {
        errors.push(`${packagePath} verifierBoundary must include ${field}.`);
      }
    }
    if (!new Set(verifierBoundary.doesNotClaim ?? []).has("semantic truth")) {
      errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming semantic truth.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      evaluationTargets: targets.length,
      qualityIntents: qualityIntents.length,
      qualityAspects: qualityAspects.length,
      evaluationPerspectives: perspectives.length,
      evaluationTimingRules: evaluationTimingRules.length,
      evaluationTimingDecisions: evaluationTimingDecisions.length,
      evidenceRetentionPolicies: evidenceRetentionPolicies.length,
      evidenceItems: evidenceItems.length,
      evidenceTypeVocabulary: evidenceTypeVocabulary.length,
      quantitativeEvidenceRecords: quantitativeRecords.length,
      automatedEvaluationDetails: automatedDetails.length,
      qualityGateRules: gateRules.length,
      qualityGateDecisions: gateDecisions.length,
      qualityReports: qualityReports.length,
      postReleaseReviews: postReleaseReviews.length,
      improvementActions: improvementActions.length,
      traceabilityLinks: traceabilityLinks.length,
      governanceTriggers: governanceTriggers.length,
      governanceEvents: governanceEvents.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  const pkg = readJson(absolutePath);
  if (!pkg) {
    continue;
  }
  checkRequiredString(pkg, "packageType", relativePath);
  checkRequiredString(pkg, "runtimeVersion", relativePath);
  checkRequiredString(pkg, "packageId", relativePath);
  switch (pkg.packageType) {
    case "discovery-session":
      validateDiscoveryPackage(pkg, relativePath);
      break;
    case "organizational-quality-culture":
      validateCulturePackage(pkg, relativePath);
      break;
    case "evaluation-target":
      validateTargetPackage(pkg, relativePath);
      break;
    case "review-run":
      validateReviewRunPackage(pkg, relativePath);
      break;
    case "quality-gate":
      validateQualityGatePackage(pkg, relativePath);
      break;
    default:
      errors.push(`${relativePath} has unknown packageType ${pkg.packageType}.`);
      break;
  }
}

const summary = {
  packages: results,
  warnings,
  errors
};

if (errors.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF runtime package validation passed.",
  ...summary
}, null, 2));
