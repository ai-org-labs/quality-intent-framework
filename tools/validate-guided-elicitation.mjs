#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/guided-elicitation-package.json"];
const inputs = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultPackages;
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

function requireArray(pkg, key, owner = "package") {
  if (!Array.isArray(pkg[key])) {
    errors.push(`${owner} ${key} must be an array.`);
    return [];
  }
  return pkg[key];
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

function checkOptionalRefs(refs, index, label, ownerId) {
  if (refs === undefined) return;
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

function hasAbstractQifQuestion(text) {
  return /what\s+are\s+the\s+quality\s+intents|what\s+is\s+the\s+loss\s+boundary|what\s+evidence\s+is\s+sufficient/i.test(text ?? "");
}

function validateGuidedElicitationPackage(pkg, packagePath) {
  if (pkg.packageType !== "guided-elicitation") {
    errors.push(`${packagePath} must have packageType guided-elicitation.`);
  }
  checkRequiredString(pkg, "runtimeVersion", packagePath);
  checkRequiredString(pkg, "packageId", packagePath);

  const sessions = requireArray(pkg, "elicitationSessions", packagePath);
  const profiles = requireArray(pkg, "userComprehensionProfiles", packagePath);
  const explanations = requireArray(pkg, "explanationUnits", packagePath);
  const strategies = requireArray(pkg, "questionStrategies", packagePath);
  const probes = requireArray(pkg, "stepwiseProbes", packagePath);
  const scaffolds = requireArray(pkg, "answerScaffolds", packagePath);
  const answers = requireArray(pkg, "userAnswers", packagePath);
  const clarifications = requireArray(pkg, "clarificationMoves", packagePath);
  const teachBacks = requireArray(pkg, "teachBackChecks", packagePath);
  const states = requireArray(pkg, "elicitationStates", packagePath);
  const candidates = requireArray(pkg, "derivedCandidates", packagePath);
  const triggers = requireArray(pkg, "governanceTriggers", packagePath);

  const sessionIndex = indexById(sessions, `${packagePath}:elicitationSessions`);
  const profileIndex = indexById(profiles, `${packagePath}:userComprehensionProfiles`);
  const explanationIndex = indexById(explanations, `${packagePath}:explanationUnits`);
  const strategyIndex = indexById(strategies, `${packagePath}:questionStrategies`);
  const probeIndex = indexById(probes, `${packagePath}:stepwiseProbes`);
  const scaffoldIndex = indexById(scaffolds, `${packagePath}:answerScaffolds`);
  const answerIndex = indexById(answers, `${packagePath}:userAnswers`);
  const clarificationIndex = indexById(clarifications, `${packagePath}:clarificationMoves`);
  const teachBackIndex = indexById(teachBacks, `${packagePath}:teachBackChecks`);
  const stateIndex = indexById(states, `${packagePath}:elicitationStates`);
  const candidateIndex = indexById(candidates, `${packagePath}:derivedCandidates`);
  const triggerIndex = indexById(triggers, `${packagePath}:governanceTriggers`);

  for (const profile of profiles) {
    for (const field of ["userRef", "language", "qifFamiliarity", "domainKnowledge", "preferredExplanationLevel", "status"]) {
      checkRequiredString(profile, field, profile.id);
    }
    if (!Array.isArray(profile.uncertaintySignals)) {
      errors.push(`${profile.id} uncertaintySignals must be an array.`);
    }
  }

  for (const explanation of explanations) {
    for (const field of ["concept", "plainLanguage", "taskExample", "status"]) {
      checkRequiredString(explanation, field, explanation.id);
    }
    if (!Array.isArray(explanation.prohibitedJargon)) {
      errors.push(`${explanation.id} prohibitedJargon must be an array.`);
    }
    if (explanation.plainLanguage === explanation.concept) {
      errors.push(`${explanation.id} plainLanguage must explain the concept, not repeat the concept label.`);
    }
  }

  for (const strategy of strategies) {
    for (const field of ["trigger", "rationale", "status"]) {
      checkRequiredString(strategy, field, strategy.id);
    }
    if (strategy.antiChecklist !== true) {
      errors.push(`${strategy.id} antiChecklist must be true.`);
    }
    if (!Array.isArray(strategy.nextProbeRules) || strategy.nextProbeRules.length === 0) {
      errors.push(`${strategy.id} nextProbeRules must include at least one rule.`);
    }
  }

  for (const probe of probes) {
    checkRefs([probe.sessionRef], sessionIndex, "elicitation session", probe.id);
    checkRefs([probe.strategyRef], strategyIndex, "question strategy", probe.id);
    checkRefs([probe.explanationRef], explanationIndex, "explanation unit", probe.id);
    for (const field of ["questionText", "purpose", "status"]) {
      checkRequiredString(probe, field, probe.id);
    }
    if (!Number.isInteger(probe.order) || probe.order < 1) {
      errors.push(`${probe.id} order must be a positive integer.`);
    }
    if (!Array.isArray(probe.expectedCandidateTypes) || probe.expectedCandidateTypes.length === 0) {
      errors.push(`${probe.id} expectedCandidateTypes must include at least one candidate type.`);
    }
    if (hasAbstractQifQuestion(probe.questionText)) {
      errors.push(`${probe.id} questionText must not ask abstract QIF terminology without plain-language framing.`);
    }
  }

  for (const scaffold of scaffolds) {
    checkRefs([scaffold.probeRef], probeIndex, "stepwise probe", scaffold.id);
    if (scaffold.optional !== true) {
      errors.push(`${scaffold.id} optional must be true.`);
    }
    if (!Array.isArray(scaffold.formats) || scaffold.formats.length === 0) {
      errors.push(`${scaffold.id} formats must include at least one answer format.`);
    }
    checkRequiredString(scaffold, "status", scaffold.id);
  }

  for (const answer of answers) {
    checkRefs([answer.sessionRef], sessionIndex, "elicitation session", answer.id);
    checkRefs([answer.profileRef], profileIndex, "user comprehension profile", answer.id);
    checkRefs([answer.probeRef], probeIndex, "stepwise probe", answer.id);
    for (const field of ["answerText", "captureMode", "language", "sensitiveDataHandling", "status"]) {
      checkRequiredString(answer, field, answer.id);
    }
    if (!Array.isArray(answer.ambiguity)) {
      errors.push(`${answer.id} ambiguity must be an array.`);
    }
    const probe = probeIndex.get(answer.probeRef);
    if (probe && probe.sessionRef !== answer.sessionRef) {
      errors.push(`${answer.id} probeRef ${answer.probeRef} belongs to a different elicitation session.`);
    }
  }

  for (const clarification of clarifications) {
    checkRefs([clarification.answerRef], answerIndex, "user answer", clarification.id);
    for (const field of ["reasonType", "questionText", "status"]) {
      checkRequiredString(clarification, field, clarification.id);
    }
    if (typeof clarification.resolved !== "boolean") {
      errors.push(`${clarification.id} resolved must be boolean.`);
    }
    checkOptionalRefs(clarification.resultingAnswerRefs, answerIndex, "user answer", clarification.id);
    if (clarification.resolved === true && (!Array.isArray(clarification.resultingAnswerRefs) || clarification.resultingAnswerRefs.length === 0)) {
      errors.push(`${clarification.id} resolved clarification must cite resultingAnswerRefs.`);
    }
  }

  for (const teachBack of teachBacks) {
    checkRefs([teachBack.sessionRef], sessionIndex, "elicitation session", teachBack.id);
    checkRefs(teachBack.derivedCandidateRefs, candidateIndex, "derived candidate", teachBack.id);
    for (const field of ["interpretationText", "userResponse", "status"]) {
      checkRequiredString(teachBack, field, teachBack.id);
    }
  }

  for (const state of states) {
    checkRefs([state.sessionRef], sessionIndex, "elicitation session", state.id);
    checkOptionalRefs(state.unresolvedAmbiguityRefs, clarificationIndex, "clarification move", state.id);
    for (const field of ["nextRecommendedMove", "status"]) {
      checkRequiredString(state, field, state.id);
    }
    if (!Array.isArray(state.knownFacts) || state.knownFacts.length === 0) {
      errors.push(`${state.id} knownFacts must include at least one fact.`);
    }
    if (!Array.isArray(state.fatigueSignals)) {
      errors.push(`${state.id} fatigueSignals must be an array.`);
    }
  }

  for (const candidate of candidates) {
    checkRefs([candidate.sessionRef], sessionIndex, "elicitation session", candidate.id);
    checkRefs(candidate.sourceAnswerRefs, answerIndex, "source answer", candidate.id);
    checkRefs(candidate.sourceProbeRefs, probeIndex, "source probe", candidate.id);
    checkOptionalRefs(candidate.clarificationMoveRefs, clarificationIndex, "clarification move", candidate.id);
    checkOptionalRefs(candidate.teachBackCheckRefs, teachBackIndex, "teach-back check", candidate.id);
    checkOptionalRefs(candidate.governanceTriggerRefs, triggerIndex, "governance trigger", candidate.id);
    for (const field of ["candidateType", "statement", "status"]) {
      checkRequiredString(candidate, field, candidate.id);
    }
    checkScore(candidate.confidence, "confidence", candidate.id);
    if (candidate.status === "finalized") {
      const teachBackOk = (candidate.teachBackCheckRefs ?? [])
        .map((ref) => teachBackIndex.get(ref))
        .some((entry) => entry?.userResponse === "accurate" && entry?.status === "accepted");
      if (!teachBackOk) {
        errors.push(`${candidate.id} finalized candidate requires an accepted accurate teachBackCheck.`);
      }
    }
    if (candidate.confidence < 0.6 && (!Array.isArray(candidate.governanceTriggerRefs) || candidate.governanceTriggerRefs.length === 0)) {
      errors.push(`${candidate.id} low-confidence candidate requires governanceTriggerRefs.`);
    }
  }

  for (const session of sessions) {
    checkRefs([session.profileRef], profileIndex, "user comprehension profile", session.id);
    checkRefs(session.probeRefs, probeIndex, "stepwise probe", session.id);
    checkRefs(session.answerRefs, answerIndex, "user answer", session.id);
    checkRefs(session.derivedCandidateRefs, candidateIndex, "derived candidate", session.id);
    checkRefs([session.stateRef], stateIndex, "elicitation state", session.id);
    checkOptionalRefs(session.clarificationMoveRefs, clarificationIndex, "clarification move", session.id);
    checkOptionalRefs(session.teachBackCheckRefs, teachBackIndex, "teach-back check", session.id);
    for (const field of ["target", "purpose", "status"]) {
      checkRequiredString(session, field, session.id);
    }
    for (const ref of session.probeRefs ?? []) {
      const probe = probeIndex.get(ref);
      if (probe && probe.sessionRef !== session.id) {
        errors.push(`${session.id} probe ${ref} belongs to a different elicitation session.`);
      }
    }
    for (const ref of session.answerRefs ?? []) {
      const answer = answerIndex.get(ref);
      if (answer && answer.sessionRef !== session.id) {
        errors.push(`${session.id} answer ${ref} belongs to a different elicitation session.`);
      }
    }
  }

  for (const trigger of triggers) {
    checkRefs([trigger.sourceSessionRef], sessionIndex, "elicitation session", trigger.id);
    checkOptionalRefs(trigger.sourceDerivedCandidateRefs, candidateIndex, "derived candidate", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
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
    if (!(boundary.doesNotClaim ?? []).includes("question count as quality")) {
      errors.push(`${packagePath} verifierBoundary must explicitly avoid treating question count as quality.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      elicitationSessions: sessions.length,
      userComprehensionProfiles: profiles.length,
      explanationUnits: explanations.length,
      questionStrategies: strategies.length,
      stepwiseProbes: probes.length,
      answerScaffolds: scaffolds.length,
      userAnswers: answers.length,
      clarificationMoves: clarifications.length,
      teachBackChecks: teachBacks.length,
      elicitationStates: states.length,
      derivedCandidates: candidates.length,
      governanceTriggers: triggers.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) validateGuidedElicitationPackage(pkg, relativePath);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF guided elicitation package validation passed.",
  packages: results,
  errors
}, null, 2));
