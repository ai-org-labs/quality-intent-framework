#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = [
  "examples/discovery-session-package.json",
  "examples/organizational-quality-culture-package.json",
  "examples/evaluation-target-package.json",
  "examples/review-run-package.json"
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
  for (const target of targets) {
    for (const field of ["title", "domain", "targetType", "artifactType", "context", "operationalImpact", "riskSummary"]) {
      checkRequiredString(target, field, target.id);
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
