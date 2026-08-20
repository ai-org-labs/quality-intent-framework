#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/world-model-elicitation-package.json"];
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

function refsBelongToSession(refs, index, sessionId, label, ownerId) {
  for (const ref of refs ?? []) {
    const item = index.get(ref);
    if (item && item.sessionRef !== sessionId) {
      errors.push(`${ownerId} ${label} ${ref} belongs to a different world model elicitation session.`);
    }
  }
}

function validatePackage(pkg, packagePath) {
  if (pkg.packageType !== "world-model-elicitation") {
    errors.push(`${packagePath} must have packageType world-model-elicitation.`);
  }
  checkRequiredString(pkg, "runtimeVersion", packagePath);
  checkRequiredString(pkg, "packageId", packagePath);

  const sessions = requireArray(pkg, "worldModelElicitationSessions", packagePath);
  const rawIntents = requireArray(pkg, "rawIntents", packagePath);
  const hypotheses = requireArray(pkg, "modelHypotheses", packagePath);
  const questions = requireArray(pkg, "discriminatingQuestions", packagePath);
  const answers = requireArray(pkg, "humanAnswers", packagePath);
  const eliminations = requireArray(pkg, "hypothesisEliminations", packagePath);
  const sequences = requireArray(pkg, "counterexampleSequences", packagePath);
  const expectations = requireArray(pkg, "sequenceExpectations", packagePath);
  const invariants = requireArray(pkg, "invariantCandidates", packagePath);
  const confirmations = requireArray(pkg, "invariantConfirmations", packagePath);
  const closures = requireArray(pkg, "elicitationClosureAssessments", packagePath);
  const worldModels = requireArray(pkg, "derivedWorldModels", packagePath);
  const scenarios = requireArray(pkg, "acceptanceScenarios", packagePath);
  const qualityIntentCandidates = requireArray(pkg, "qualityIntentCandidates", packagePath);
  const triggers = requireArray(pkg, "governanceTriggers", packagePath);

  const sessionIndex = indexById(sessions, `${packagePath}:worldModelElicitationSessions`);
  const rawIntentIndex = indexById(rawIntents, `${packagePath}:rawIntents`);
  const hypothesisIndex = indexById(hypotheses, `${packagePath}:modelHypotheses`);
  const questionIndex = indexById(questions, `${packagePath}:discriminatingQuestions`);
  const answerIndex = indexById(answers, `${packagePath}:humanAnswers`);
  const eliminationIndex = indexById(eliminations, `${packagePath}:hypothesisEliminations`);
  const sequenceIndex = indexById(sequences, `${packagePath}:counterexampleSequences`);
  const expectationIndex = indexById(expectations, `${packagePath}:sequenceExpectations`);
  const invariantIndex = indexById(invariants, `${packagePath}:invariantCandidates`);
  const confirmationIndex = indexById(confirmations, `${packagePath}:invariantConfirmations`);
  const closureIndex = indexById(closures, `${packagePath}:elicitationClosureAssessments`);
  const worldModelIndex = indexById(worldModels, `${packagePath}:derivedWorldModels`);
  const scenarioIndex = indexById(scenarios, `${packagePath}:acceptanceScenarios`);
  const qualityIntentCandidateIndex = indexById(qualityIntentCandidates, `${packagePath}:qualityIntentCandidates`);
  const triggerIndex = indexById(triggers, `${packagePath}:governanceTriggers`);

  for (const rawIntent of rawIntents) {
    checkRefs([rawIntent.sessionRef], sessionIndex, "world model elicitation session", rawIntent.id);
    for (const field of ["statement", "source", "captureMode", "status"]) {
      checkRequiredString(rawIntent, field, rawIntent.id);
    }
    if (!Array.isArray(rawIntent.ambiguitySignals)) {
      errors.push(`${rawIntent.id} ambiguitySignals must be an array.`);
    }
  }

  for (const hypothesis of hypotheses) {
    checkRefs([hypothesis.sessionRef], sessionIndex, "world model elicitation session", hypothesis.id);
    checkRefs(hypothesis.sourceRawIntentRefs, rawIntentIndex, "source raw intent", hypothesis.id);
    for (const field of ["name", "modelType", "assumption", "predictionSummary", "status"]) {
      checkRequiredString(hypothesis, field, hypothesis.id);
    }
    checkScore(hypothesis.confidence, "confidence", hypothesis.id);
  }

  for (const question of questions) {
    checkRefs([question.sessionRef], sessionIndex, "world model elicitation session", question.id);
    checkRefs(question.competingHypothesisRefs, hypothesisIndex, "competing hypothesis", question.id);
    for (const field of ["scenario", "questionText", "selectionRationale", "resultingModelUpdate", "status"]) {
      checkRequiredString(question, field, question.id);
    }
    if (question.competingHypothesisRefs?.length < 2) {
      errors.push(`${question.id} must compare at least two competing hypotheses.`);
    }
    if (!Array.isArray(question.expectedAnswers) || question.expectedAnswers.length === 0) {
      errors.push(`${question.id} expectedAnswers must include at least one answer branch.`);
    } else {
      let eliminatesAtLeastOne = false;
      for (const expected of question.expectedAnswers) {
        if (typeof expected.id !== "string" || expected.id.trim() === "") {
          errors.push(`${question.id} expectedAnswers item must include string id.`);
        }
        if (typeof expected.answerPattern !== "string" || expected.answerPattern.trim() === "") {
          errors.push(`${question.id} expected answer ${expected.id ?? "(missing)"} must include answerPattern.`);
        }
        checkOptionalRefs(expected.hypothesesEliminatedRefs, hypothesisIndex, "hypothesis", `${question.id} expected answer ${expected.id ?? "(missing)"}`);
        if ((expected.hypothesesEliminatedRefs ?? []).length > 0) eliminatesAtLeastOne = true;
      }
      if (!eliminatesAtLeastOne) {
        errors.push(`${question.id} expectedAnswers must eliminate at least one hypothesis.`);
      }
    }
    checkScore(question.informationGain, "informationGain", question.id);
  }

  for (const answer of answers) {
    checkRefs([answer.sessionRef], sessionIndex, "world model elicitation session", answer.id);
    checkOptionalRefs([answer.rawIntentRef].filter(Boolean), rawIntentIndex, "raw intent", answer.id);
    checkOptionalRefs([answer.questionRef].filter(Boolean), questionIndex, "discriminating question", answer.id);
    checkOptionalRefs([answer.sequenceRef].filter(Boolean), sequenceIndex, "counterexample sequence", answer.id);
    checkOptionalRefs([answer.invariantCandidateRef].filter(Boolean), invariantIndex, "invariant candidate", answer.id);
    for (const field of ["answerText", "captureMode", "status"]) {
      checkRequiredString(answer, field, answer.id);
    }
    if (!answer.questionRef && !answer.sequenceRef && !answer.invariantCandidateRef) {
      errors.push(`${answer.id} must reference a question, sequence, or invariant candidate.`);
    }
  }

  for (const elimination of eliminations) {
    checkRefs([elimination.sessionRef], sessionIndex, "world model elicitation session", elimination.id);
    checkRefs([elimination.answerRef], answerIndex, "human answer", elimination.id);
    checkRefs(elimination.eliminatedHypothesisRefs, hypothesisIndex, "eliminated hypothesis", elimination.id);
    checkRefs(elimination.remainingHypothesisRefs, hypothesisIndex, "remaining hypothesis", elimination.id);
    checkRequiredString(elimination, "rationale", elimination.id);
    if (elimination.remainingHypothesisRefs?.length < 1) {
      errors.push(`${elimination.id} must leave at least one remaining hypothesis.`);
    }
  }

  for (const sequence of sequences) {
    checkRefs([sequence.sessionRef], sessionIndex, "world model elicitation session", sequence.id);
    checkRefs(sequence.targetHypothesisRefs, hypothesisIndex, "target hypothesis", sequence.id);
    for (const field of ["explorationType", "purpose", "status"]) {
      checkRequiredString(sequence, field, sequence.id);
    }
    if (!["repeat", "inverse", "orthogonal", "reference-frame", "composition", "boundary"].includes(sequence.explorationType)) {
      errors.push(`${sequence.id} explorationType must be repeat, inverse, orthogonal, reference-frame, composition, or boundary.`);
    }
    if (!Array.isArray(sequence.steps) || sequence.steps.length < 2) {
      errors.push(`${sequence.id} steps must include at least two transitions.`);
    }
  }

  for (const expectation of expectations) {
    checkRefs([expectation.sessionRef], sessionIndex, "world model elicitation session", expectation.id);
    checkRefs([expectation.sequenceRef], sequenceIndex, "counterexample sequence", expectation.id);
    checkRefs([expectation.answerRef], answerIndex, "human answer", expectation.id);
    checkRefs(expectation.affectedHypothesisRefs, hypothesisIndex, "affected hypothesis", expectation.id);
    for (const field of ["expectedOutcome", "interpretation", "status"]) {
      checkRequiredString(expectation, field, expectation.id);
    }
  }

  for (const invariant of invariants) {
    checkRefs([invariant.sessionRef], sessionIndex, "world model elicitation session", invariant.id);
    checkRefs(invariant.sourceSequenceRefs, sequenceIndex, "source sequence", invariant.id);
    checkRefs(invariant.sourceAnswerRefs, answerIndex, "source answer", invariant.id);
    checkOptionalRefs(invariant.confirmationRefs, confirmationIndex, "invariant confirmation", invariant.id);
    checkOptionalRefs(invariant.governanceTriggerRefs, triggerIndex, "governance trigger", invariant.id);
    for (const field of ["statement", "scope", "status"]) {
      checkRequiredString(invariant, field, invariant.id);
    }
    checkScore(invariant.confidence, "confidence", invariant.id);
    if (invariant.status === "accepted") {
      const confirmed = (invariant.confirmationRefs ?? [])
        .map((ref) => confirmationIndex.get(ref))
        .some((entry) => entry?.userResponse === "accurate" && entry?.status === "accepted");
      if (!confirmed) {
        errors.push(`${invariant.id} accepted invariant requires an accepted accurate invariant confirmation.`);
      }
    }
    if (invariant.confidence < 0.6 && (!Array.isArray(invariant.governanceTriggerRefs) || invariant.governanceTriggerRefs.length === 0)) {
      errors.push(`${invariant.id} low-confidence invariant requires governanceTriggerRefs.`);
    }
  }

  for (const confirmation of confirmations) {
    checkRefs([confirmation.sessionRef], sessionIndex, "world model elicitation session", confirmation.id);
    checkRefs([confirmation.invariantCandidateRef], invariantIndex, "invariant candidate", confirmation.id);
    checkRefs([confirmation.answerRef], answerIndex, "human answer", confirmation.id);
    for (const field of ["confirmationQuestion", "userResponse", "status"]) {
      checkRequiredString(confirmation, field, confirmation.id);
    }
  }

  for (const worldModel of worldModels) {
    checkRefs([worldModel.sessionRef], sessionIndex, "world model elicitation session", worldModel.id);
    checkRefs([worldModel.selectedHypothesisRef], hypothesisIndex, "selected hypothesis", worldModel.id);
    checkRefs(worldModel.invariantRefs, invariantIndex, "invariant", worldModel.id);
    for (const field of ["title", "summary", "status"]) {
      checkRequiredString(worldModel, field, worldModel.id);
    }
  }

  for (const scenario of scenarios) {
    checkRefs([scenario.sessionRef], sessionIndex, "world model elicitation session", scenario.id);
    checkRefs([scenario.derivedWorldModelRef], worldModelIndex, "derived world model", scenario.id);
    checkRefs(scenario.sourceSequenceRefs, sequenceIndex, "source sequence", scenario.id);
    for (const field of ["scenario", "expectedResult", "status"]) {
      checkRequiredString(scenario, field, scenario.id);
    }
  }

  for (const candidate of qualityIntentCandidates) {
    checkRefs([candidate.sessionRef], sessionIndex, "world model elicitation session", candidate.id);
    checkRefs([candidate.derivedWorldModelRef], worldModelIndex, "derived world model", candidate.id);
    checkRefs(candidate.acceptanceScenarioRefs, scenarioIndex, "acceptance scenario", candidate.id);
    for (const field of ["statement", "lossBoundary", "status"]) {
      checkRequiredString(candidate, field, candidate.id);
    }
    checkScore(candidate.confidence, "confidence", candidate.id);
  }

  for (const closure of closures) {
    checkRefs([closure.sessionRef], sessionIndex, "world model elicitation session", closure.id);
    checkOptionalRefs(closure.unresolvedHypothesisRefs, hypothesisIndex, "unresolved hypothesis", closure.id);
    checkRefs(closure.derivedWorldModelRefs, worldModelIndex, "derived world model", closure.id);
    checkRefs(closure.acceptanceScenarioRefs, scenarioIndex, "acceptance scenario", closure.id);
    checkRefs(closure.qualityIntentCandidateRefs, qualityIntentCandidateIndex, "quality intent candidate", closure.id);
    checkOptionalRefs(closure.governanceTriggerRefs, triggerIndex, "governance trigger", closure.id);
    for (const field of ["closureVerdict", "rationale", "status"]) {
      checkRequiredString(closure, field, closure.id);
    }
    if (!Array.isArray(closure.closureCriteria) || closure.closureCriteria.length === 0) {
      errors.push(`${closure.id} closureCriteria must include at least one criterion.`);
    }
    const unmet = (closure.closureCriteria ?? []).filter((criterion) => criterion.status !== "met");
    if (closure.closureVerdict === "closed") {
      if ((closure.unresolvedHypothesisRefs ?? []).length > 0) {
        errors.push(`${closure.id} closed elicitation must have zero unresolvedHypothesisRefs.`);
      }
      if (unmet.length > 0) {
        errors.push(`${closure.id} closed elicitation requires all closureCriteria to be met.`);
      }
      if ((closure.acceptanceScenarioRefs ?? []).length === 0) {
        errors.push(`${closure.id} closed elicitation requires acceptanceScenarioRefs.`);
      }
    }
  }

  for (const trigger of triggers) {
    checkRefs([trigger.sourceSessionRef], sessionIndex, "world model elicitation session", trigger.id);
    checkOptionalRefs(trigger.sourceInvariantRefs, invariantIndex, "invariant", trigger.id);
    checkOptionalRefs(trigger.sourceClosureRefs, closureIndex, "closure assessment", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) {
      checkRequiredString(trigger, field, trigger.id);
    }
  }

  for (const session of sessions) {
    checkRefs(session.rawIntentRefs, rawIntentIndex, "raw intent", session.id);
    checkRefs(session.modelHypothesisRefs, hypothesisIndex, "model hypothesis", session.id);
    checkRefs(session.discriminatingQuestionRefs, questionIndex, "discriminating question", session.id);
    checkRefs(session.counterexampleSequenceRefs, sequenceIndex, "counterexample sequence", session.id);
    checkRefs(session.invariantCandidateRefs, invariantIndex, "invariant candidate", session.id);
    checkRefs([session.closureAssessmentRef], closureIndex, "closure assessment", session.id);
    for (const field of ["target", "purpose", "level", "status"]) {
      checkRequiredString(session, field, session.id);
    }
    if (session.level !== "level-4") {
      errors.push(`${session.id} level must be level-4.`);
    }
    if (session.modelHypothesisRefs?.length < 2) {
      errors.push(`${session.id} must start with at least two modelHypothesisRefs.`);
    }
    refsBelongToSession(session.rawIntentRefs, rawIntentIndex, session.id, "raw intent", session.id);
    refsBelongToSession(session.modelHypothesisRefs, hypothesisIndex, session.id, "model hypothesis", session.id);
    refsBelongToSession(session.discriminatingQuestionRefs, questionIndex, session.id, "discriminating question", session.id);
    refsBelongToSession(session.counterexampleSequenceRefs, sequenceIndex, session.id, "counterexample sequence", session.id);
    refsBelongToSession(session.invariantCandidateRefs, invariantIndex, session.id, "invariant candidate", session.id);
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
    if (!(boundary.doesNotClaim ?? []).includes("requirement completeness by question count")) {
      errors.push(`${packagePath} verifierBoundary must explicitly avoid requirement completeness by question count.`);
    }
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      worldModelElicitationSessions: sessions.length,
      rawIntents: rawIntents.length,
      modelHypotheses: hypotheses.length,
      discriminatingQuestions: questions.length,
      humanAnswers: answers.length,
      hypothesisEliminations: eliminations.length,
      counterexampleSequences: sequences.length,
      sequenceExpectations: expectations.length,
      invariantCandidates: invariants.length,
      invariantConfirmations: confirmations.length,
      elicitationClosureAssessments: closures.length,
      derivedWorldModels: worldModels.length,
      acceptanceScenarios: scenarios.length,
      qualityIntentCandidates: qualityIntentCandidates.length,
      governanceTriggers: triggers.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) validatePackage(pkg, relativePath);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF world model elicitation package validation passed.",
  packages: results,
  errors
}, null, 2));
