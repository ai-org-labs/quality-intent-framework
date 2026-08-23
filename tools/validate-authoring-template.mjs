#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const defaultPackages = ["examples/authoring-template-package.json"];
const inputs = process.argv.slice(2).length > 0 ? process.argv.slice(2) : defaultPackages;
const supportedPackageTypes = new Set([
  "qif-package",
  "expert-judgment",
  "discovery-session",
  "organizational-quality-culture",
  "evaluation-target",
  "review-run",
  "quality-gate",
  "qif-ledger",
  "world-model-review",
  "world-model-calibration",
  "world-model-pilot-corpus",
  "guided-elicitation",
  "world-model-elicitation",
  "action-quality-contract",
  "authoring-template"
]);
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

function array(pkg, key, owner = "package") {
  if (!Array.isArray(pkg[key])) {
    errors.push(`${owner} ${key} must be an array.`);
    return [];
  }
  return pkg[key];
}

function str(item, field, owner) {
  if (typeof item[field] !== "string" || item[field].trim() === "") {
    errors.push(`${owner} must include non-empty string ${field}.`);
  }
}

function score(value, field, owner) {
  if (typeof value !== "number" || value < 0 || value > 1) {
    errors.push(`${owner} ${field} must be a number from 0 to 1.`);
  }
}

function index(items, label) {
  const map = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object") {
      errors.push(`${label} contains a non-object item.`);
      continue;
    }
    if (typeof item.id !== "string" || item.id.trim() === "") {
      errors.push(`${label} item is missing string id.`);
      continue;
    }
    if (map.has(item.id)) errors.push(`Duplicate id ${item.id} in ${label}.`);
    map.set(item.id, item);
  }
  return map;
}

function refs(values, map, label, owner) {
  if (!Array.isArray(values) || values.length === 0) {
    errors.push(`${owner} must include at least one ${label}.`);
    return;
  }
  for (const ref of values) {
    if (!map.has(ref)) errors.push(`${owner} references missing ${label}: ${ref}`);
  }
}

function optionalRefs(values, map, label, owner) {
  if (values === undefined) return;
  if (!Array.isArray(values)) {
    errors.push(`${owner} ${label} refs must be an array.`);
    return;
  }
  for (const ref of values) {
    if (!map.has(ref)) errors.push(`${owner} references missing ${label}: ${ref}`);
  }
}

function validate(pkg, packagePath) {
  if (pkg.packageType !== "authoring-template") {
    errors.push(`${packagePath} must have packageType authoring-template.`);
  }
  str(pkg, "runtimeVersion", packagePath);
  str(pkg, "packageId", packagePath);

  const templates = array(pkg, "authoringTemplates", packagePath);
  const instructions = array(pkg, "instructionBlocks", packagePath);
  const inputContracts = array(pkg, "inputContracts", packagePath);
  const untrustedInputBoundaries = array(pkg, "untrustedInputBoundaries", packagePath);
  const explanationContracts = array(pkg, "audienceExplanationContracts", packagePath);
  const outputContracts = array(pkg, "outputContracts", packagePath);
  const validationPipelines = array(pkg, "validationPipelines", packagePath);
  const goldenCases = array(pkg, "goldenCases", packagePath);
  const scoringRubrics = array(pkg, "scoringRubrics", packagePath);
  const agentAuthoringRuns = array(pkg, "agentAuthoringRuns", packagePath);
  const diagramComprehensionEvidence = array(pkg, "diagramComprehensionEvidence", packagePath);
  const conformanceResults = array(pkg, "conformanceResults", packagePath);
  const triggers = array(pkg, "governanceTriggers", packagePath);

  const templateIndex = index(templates, `${packagePath}:authoringTemplates`);
  const instructionIndex = index(instructions, `${packagePath}:instructionBlocks`);
  const inputIndex = index(inputContracts, `${packagePath}:inputContracts`);
  const untrustedInputBoundaryIndex = index(untrustedInputBoundaries, `${packagePath}:untrustedInputBoundaries`);
  const explanationIndex = index(explanationContracts, `${packagePath}:audienceExplanationContracts`);
  const outputIndex = index(outputContracts, `${packagePath}:outputContracts`);
  const pipelineIndex = index(validationPipelines, `${packagePath}:validationPipelines`);
  const goldenIndex = index(goldenCases, `${packagePath}:goldenCases`);
  const rubricIndex = index(scoringRubrics, `${packagePath}:scoringRubrics`);
  const runIndex = index(agentAuthoringRuns, `${packagePath}:agentAuthoringRuns`);
  const diagramEvidenceIndex = index(diagramComprehensionEvidence, `${packagePath}:diagramComprehensionEvidence`);
  const resultIndex = index(conformanceResults, `${packagePath}:conformanceResults`);
  const triggerIndex = index(triggers, `${packagePath}:governanceTriggers`);

  for (const instruction of instructions) {
    for (const field of ["purpose", "instructionText", "status"]) str(instruction, field, instruction.id);
    if (instruction.instructionText.includes("checklist completion proves quality")) {
      errors.push(`${instruction.id} instructionText must not treat checklist completion as quality.`);
    }
    if (!Array.isArray(instruction.prohibitedClaims) || instruction.prohibitedClaims.length === 0) {
      errors.push(`${instruction.id} prohibitedClaims must include at least one claim.`);
    }
  }

  for (const input of inputContracts) {
    for (const field of ["inputKind", "description", "missingInputPolicy", "status"]) str(input, field, input.id);
    if (!Array.isArray(input.requiredFields) || input.requiredFields.length === 0) {
      errors.push(`${input.id} requiredFields must include at least one field.`);
    }
  }

  for (const boundary of untrustedInputBoundaries) {
    for (const field of ["trustTreatment", "verificationRequired", "sanitizationPolicy", "instructionConflictPolicy", "status"]) {
      str(boundary, field, boundary.id);
    }
    if (!Array.isArray(boundary.sourceKinds) || boundary.sourceKinds.length === 0) {
      errors.push(`${boundary.id} sourceKinds must include at least one source kind.`);
    }
    if (!Array.isArray(boundary.allowedUse) || boundary.allowedUse.length === 0) {
      errors.push(`${boundary.id} allowedUse must include at least one use.`);
    }
    if (!Array.isArray(boundary.prohibitedUse) || boundary.prohibitedUse.length === 0) {
      errors.push(`${boundary.id} prohibitedUse must include at least one use.`);
    }
    const prohibitedText = (boundary.prohibitedUse ?? []).join(" ").toLowerCase();
    if (!prohibitedText.includes("instruction")) {
      errors.push(`${boundary.id} prohibitedUse must explicitly block embedded instructions.`);
    }
    const conflictText = String(boundary.instructionConflictPolicy ?? "").toLowerCase();
    if (!conflictText.includes("system") || !conflictText.includes("user")) {
      errors.push(`${boundary.id} instructionConflictPolicy must rank system and user instructions above source content.`);
    }
  }

  for (const explanation of explanationContracts) {
    for (const field of ["audienceLevel", "plainLanguageRequirement", "diagramRequirement", "diagramComprehensionRequirement", "stepByStepQuestionRequirement", "comprehensionCheck", "status"]) {
      str(explanation, field, explanation.id);
    }
    if (explanation.audienceLevel !== "general-public") {
      errors.push(`${explanation.id} audienceLevel must be general-public.`);
    }
    if (!Array.isArray(explanation.requiredExpressionRules) || explanation.requiredExpressionRules.length === 0) {
      errors.push(`${explanation.id} requiredExpressionRules must include at least one rule.`);
    }
    if (!Array.isArray(explanation.termsToAvoidWithoutExplanation) || explanation.termsToAvoidWithoutExplanation.length === 0) {
      errors.push(`${explanation.id} termsToAvoidWithoutExplanation must include at least one term.`);
    }
    if (!Array.isArray(explanation.diagramSpecs) || explanation.diagramSpecs.length === 0) {
      errors.push(`${explanation.id} diagramSpecs must include at least one diagram spec.`);
    }
    for (const diagram of explanation.diagramSpecs ?? []) {
      for (const field of ["diagramKind", "title", "diagramText", "status"]) {
        str(diagram, field, `${explanation.id} diagram spec`);
      }
      if (typeof diagram.diagramText === "string" && !diagram.diagramText.includes("->")) {
        errors.push(`${explanation.id} diagramText must show a simple flow using ->.`);
      }
    }
  }

  for (const explanation of explanationContracts) {
    const matchingEvidence = diagramComprehensionEvidence.filter((evidence) => evidence.audienceExplanationContractRef === explanation.id);
    if (matchingEvidence.length === 0) {
      errors.push(`${explanation.id} must have at least one diagram comprehension evidence item.`);
    }
  }

  for (const output of outputContracts) {
    for (const field of ["targetPackageType", "schemaRef", "exampleRef", "status"]) str(output, field, output.id);
    if (!supportedPackageTypes.has(output.targetPackageType)) {
      errors.push(`${output.id} targetPackageType is not supported: ${output.targetPackageType}`);
    }
    if (!Array.isArray(output.requiredEntityFamilies) || output.requiredEntityFamilies.length === 0) {
      errors.push(`${output.id} requiredEntityFamilies must include at least one family.`);
    }
  }

  for (const pipeline of validationPipelines) {
    refs([pipeline.outputContractRef], outputIndex, "output contract", pipeline.id);
    for (const field of ["validationCommand", "successCondition", "status"]) str(pipeline, field, pipeline.id);
    if (!pipeline.validationCommand.startsWith("node tools/validate-")) {
      errors.push(`${pipeline.id} validationCommand must call a local QIF validator.`);
    }
    if (!Array.isArray(pipeline.negativeFixtureRefs)) {
      errors.push(`${pipeline.id} negativeFixtureRefs must be an array.`);
    }
  }

  for (const golden of goldenCases) {
    refs([golden.inputContractRef], inputIndex, "input contract", golden.id);
    refs([golden.outputContractRef], outputIndex, "output contract", golden.id);
    for (const field of ["scenario", "expectedOutputSummary", "status"]) str(golden, field, golden.id);
    if (!Array.isArray(golden.acceptanceCriteria) || golden.acceptanceCriteria.length === 0) {
      errors.push(`${golden.id} acceptanceCriteria must include at least one criterion.`);
    }
  }

  for (const rubric of scoringRubrics) {
    refs([rubric.outputContractRef], outputIndex, "output contract", rubric.id);
    if (!Array.isArray(rubric.criteria) || rubric.criteria.length === 0) {
      errors.push(`${rubric.id} criteria must include at least one criterion.`);
    }
    for (const criterion of rubric.criteria ?? []) {
      if (typeof criterion.name !== "string" || criterion.name.trim() === "") errors.push(`${rubric.id} criterion must include name.`);
      score(criterion.weight, "weight", `${rubric.id} criterion ${criterion.name ?? "(missing)"}`);
    }
    score(rubric.passThreshold, "passThreshold", rubric.id);
  }

  for (const template of templates) {
    refs(template.instructionBlockRefs, instructionIndex, "instruction block", template.id);
    refs([template.inputContractRef], inputIndex, "input contract", template.id);
    refs([template.untrustedInputBoundaryRef], untrustedInputBoundaryIndex, "untrusted input boundary", template.id);
    refs([template.audienceExplanationContractRef], explanationIndex, "audience explanation contract", template.id);
    refs([template.outputContractRef], outputIndex, "output contract", template.id);
    refs([template.validationPipelineRef], pipelineIndex, "validation pipeline", template.id);
    optionalRefs(template.goldenCaseRefs, goldenIndex, "golden case", template.id);
    optionalRefs(template.scoringRubricRefs, rubricIndex, "scoring rubric", template.id);
    for (const field of ["targetUser", "targetPackageType", "status"]) str(template, field, template.id);
    if (!supportedPackageTypes.has(template.targetPackageType)) {
      errors.push(`${template.id} targetPackageType is not supported: ${template.targetPackageType}`);
    }
    const output = outputIndex.get(template.outputContractRef);
    if (output && output.targetPackageType !== template.targetPackageType) {
      errors.push(`${template.id} targetPackageType must match output contract targetPackageType.`);
    }
  }

  for (const run of agentAuthoringRuns) {
    refs([run.authoringTemplateRef], templateIndex, "authoring template", run.id);
    refs([run.goldenCaseRef], goldenIndex, "golden case", run.id);
    for (const field of ["agentRef", "inputSummary", "outputArtifactRef", "status"]) str(run, field, run.id);
    if (run.hiddenReasoningStored === true) {
      errors.push(`${run.id} hiddenReasoningStored must not be true.`);
    }
  }

  for (const evidence of diagramComprehensionEvidence) {
    refs([evidence.audienceExplanationContractRef], explanationIndex, "audience explanation contract", evidence.id);
    optionalRefs(evidence.governanceTriggerRefs, triggerIndex, "governance trigger", evidence.id);
    for (const field of ["diagramSpecTitle", "audienceSample", "restatement", "misunderstandingSummary", "revisionAction", "status"]) {
      str(evidence, field, evidence.id);
    }
    if (typeof evidence.understood !== "boolean") {
      errors.push(`${evidence.id} understood must be boolean.`);
    }
    if (evidence.understood !== true && (!Array.isArray(evidence.governanceTriggerRefs) || evidence.governanceTriggerRefs.length === 0)) {
      errors.push(`${evidence.id} not-understood diagram comprehension evidence requires governanceTriggerRefs.`);
    }
  }

  for (const result of conformanceResults) {
    refs([result.agentAuthoringRunRef], runIndex, "agent authoring run", result.id);
    refs([result.validationPipelineRef], pipelineIndex, "validation pipeline", result.id);
    refs([result.scoringRubricRef], rubricIndex, "scoring rubric", result.id);
    optionalRefs(result.governanceTriggerRefs, triggerIndex, "governance trigger", result.id);
    for (const field of ["verdict", "validationOutputSummary", "status"]) str(result, field, result.id);
    score(result.score, "score", result.id);
    const rubric = rubricIndex.get(result.scoringRubricRef);
    if (result.verdict === "pass" && rubric && result.score < rubric.passThreshold) {
      errors.push(`${result.id} pass verdict score is below rubric passThreshold.`);
    }
    if (result.verdict !== "pass" && (!Array.isArray(result.governanceTriggerRefs) || result.governanceTriggerRefs.length === 0)) {
      errors.push(`${result.id} non-pass conformance result requires governanceTriggerRefs.`);
    }
  }

  for (const trigger of triggers) {
    optionalRefs(trigger.sourceTemplateRefs, templateIndex, "authoring template", trigger.id);
    optionalRefs(trigger.sourceConformanceResultRefs, resultIndex, "conformance result", trigger.id);
    for (const field of ["triggerType", "reason", "severity", "requiredAction", "owner", "status"]) str(trigger, field, trigger.id);
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
    if (!(boundary.doesNotClaim ?? []).includes("semantic truth")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming semantic truth.`);
    if (!(boundary.doesNotClaim ?? []).includes("agent authoring competence")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming agent authoring competence.`);
    if (!(boundary.doesNotClaim ?? []).includes("universal user comprehension")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming universal user comprehension.`);
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      authoringTemplates: templates.length,
      instructionBlocks: instructions.length,
      inputContracts: inputContracts.length,
      untrustedInputBoundaries: untrustedInputBoundaries.length,
      audienceExplanationContracts: explanationContracts.length,
      outputContracts: outputContracts.length,
      validationPipelines: validationPipelines.length,
      goldenCases: goldenCases.length,
      scoringRubrics: scoringRubrics.length,
      agentAuthoringRuns: agentAuthoringRuns.length,
      diagramComprehensionEvidence: diagramComprehensionEvidence.length,
      conformanceResults: conformanceResults.length,
      governanceTriggers: triggers.length
    }
  });
}

for (const relativePath of inputs) {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  const pkg = readJson(absolutePath, relativePath);
  if (pkg) validate(pkg, relativePath);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF authoring template package validation passed.",
  packages: results,
  errors
}, null, 2));
