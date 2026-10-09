#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const inputs = process.argv.slice(2).length > 0
  ? process.argv.slice(2)
  : ["examples/calibration-report-package.json"];
const projectRoot = process.cwd();
const errors = [];
const results = [];
const empiricalKinds = new Set(["observed-operational", "historical-record"]);
const originKinds = new Set([...empiricalKinds, "simulated", "synthetic", "example"]);

function readJson(filePath, owner) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${owner} cannot read JSON at ${filePath}: ${error.message}`);
    return null;
  }
}

function requiredArray(owner, field) {
  if (!Array.isArray(owner[field])) {
    errors.push(`package ${field} must be an array.`);
    return [];
  }
  return owner[field];
}

function str(item, field, owner) {
  if (typeof item?.[field] !== "string" || item[field].trim() === "") {
    errors.push(`${owner} must include non-empty string ${field}.`);
  }
}

function score(value, field, owner) {
  if (typeof value !== "number" || value < 0 || value > 1) {
    errors.push(`${owner} ${field} must be a number from 0 to 1.`);
  }
}

function indexById(items, label) {
  const index = new Map();
  for (const item of items) {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || item.id.trim() === "") {
      errors.push(`${label} contains an item without a string id.`);
      continue;
    }
    if (index.has(item.id)) errors.push(`Duplicate id ${item.id} in ${label}.`);
    index.set(item.id, item);
  }
  return index;
}

function ref(index, value, label, owner) {
  if (!index.has(value)) {
    errors.push(`${owner} references missing ${label}: ${value}`);
    return null;
  }
  return index.get(value);
}

function round(value, decimals) {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function sameNumber(actual, expected) {
  return typeof actual === "number" && Math.abs(actual - expected) < 1e-9;
}

function sameSet(actual, expected) {
  if (!Array.isArray(actual)) return false;
  const a = [...new Set(actual)].sort();
  const b = [...new Set(expected)].sort();
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameValue(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

function pairField(pair, field, loaded) {
  if (field === "sourceEvidenceOriginKind") {
    return loaded.get(pair.sourcePackageRef)?.origins.get(pair.sourceEvidenceOriginRef)?.originKind;
  }
  return pair[field];
}

function ruleMatches(rule, pair, loaded) {
  const value = pairField(pair, rule.field, loaded);
  if (rule.operator === "equals") return value === rule.values?.[0];
  if (rule.operator === "in") return rule.values?.includes(value) === true;
  if (rule.operator === "not-equals") return value !== rule.values?.[0];
  return false;
}

function loadPackageRefs(packageRefs, packagePath) {
  const index = indexById(packageRefs, `${packagePath}:packageRefs`);
  const loaded = new Map();
  for (const packageRef of packageRefs) {
    for (const field of ["path", "packageType", "role"]) str(packageRef, field, packageRef.id);
    if (path.isAbsolute(packageRef.path || "") || String(packageRef.path || "").split(/[\\/]/).includes("..")) {
      errors.push(`${packageRef.id} path must be repository-relative without parent traversal.`);
      continue;
    }
    const absolute = path.resolve(projectRoot, packageRef.path || "");
    if (!fs.existsSync(absolute)) {
      errors.push(`${packageRef.id} package path does not exist: ${packageRef.path}`);
      continue;
    }
    const pkg = readJson(absolute, packageRef.id);
    if (!pkg) continue;
    if (packageRef.packageType !== "quality-gate" || pkg.packageType !== "quality-gate") {
      errors.push(`${packageRef.id} must reference a quality-gate package.`);
    }
    if (packageRef.role !== "decision-outcome-source") {
      errors.push(`${packageRef.id} role must be decision-outcome-source.`);
    }
    loaded.set(packageRef.id, {
      package: pkg,
      decisions: indexById(pkg.qualityGateDecisions || [], `${packageRef.id}:qualityGateDecisions`),
      reviews: indexById(pkg.postReleaseReviews || [], `${packageRef.id}:postReleaseReviews`),
      origins: indexById(pkg.evidenceOrigins || [], `${packageRef.id}:evidenceOrigins`),
      targets: indexById(pkg.evaluationTargets || [], `${packageRef.id}:evaluationTargets`),
      qualityIntents: indexById(pkg.qualityIntents || [], `${packageRef.id}:qualityIntents`)
    });
  }
  return { index, loaded };
}

function validatePackage(pkg, packagePath) {
  if (pkg.packageType !== "calibration-report") errors.push(`${packagePath} must have packageType calibration-report.`);
  str(pkg, "runtimeVersion", packagePath);
  str(pkg, "packageId", packagePath);

  const packageRefs = requiredArray(pkg, "packageRefs");
  const origins = requiredArray(pkg, "evidenceOrigins");
  const policies = requiredArray(pkg, "calibrationPolicies");
  const pairs = requiredArray(pkg, "decisionOutcomePairs");
  const cohorts = requiredArray(pkg, "calibrationCohorts");
  const reports = requiredArray(pkg, "calibrationReports");
  const consequencePolicies = requiredArray(pkg, "consequencePolicies");
  const decisionConsequences = requiredArray(pkg, "decisionConsequences");
  const consequenceAssessments = requiredArray(pkg, "consequenceAssessments");
  const thresholdRobustnessAnalyses = requiredArray(pkg, "thresholdRobustnessAnalyses");
  const selectiveEscalationPolicies = requiredArray(pkg, "selectiveEscalationPolicies");
  const selectiveEscalationDecisions = requiredArray(pkg, "selectiveEscalationDecisions");
  const selectiveEscalationAssessments = requiredArray(pkg, "selectiveEscalationAssessments");
  const escalationResolutionPolicies = requiredArray(pkg, "escalationResolutionPolicies");
  const escalationResolutions = requiredArray(pkg, "escalationResolutions");
  const escalationResolutionAssessments = requiredArray(pkg, "escalationResolutionAssessments");
  const reviewerDisagreementPolicies = requiredArray(pkg, "reviewerDisagreementPolicies");
  const reviewerJudgments = requiredArray(pkg, "reviewerJudgments");
  const reviewerDisagreements = requiredArray(pkg, "reviewerDisagreements");
  const adjudicationOutcomes = requiredArray(pkg, "adjudicationOutcomes");
  const reviewerDisagreementAssessments = requiredArray(pkg, "reviewerDisagreementAssessments");
  const routePolicySnapshots = requiredArray(pkg, "routePolicySnapshots");
  const routePolicyChanges = requiredArray(pkg, "routePolicyChanges");
  const routePolicyDriftAssessments = requiredArray(pkg, "routePolicyDriftAssessments");
  const routePolicyRevalidationOutcomes = requiredArray(pkg, "routePolicyRevalidationOutcomes");
  const routePolicyRevalidationAssessments = requiredArray(pkg, "routePolicyRevalidationAssessments");
  const adjudicationFeedbackObservations = requiredArray(pkg, "adjudicationFeedbackObservations");
  const rubricRevisionCandidates = requiredArray(pkg, "rubricRevisionCandidates");
  const rubricRevisionDecisions = requiredArray(pkg, "rubricRevisionDecisions");
  const rubricRevisionImplementations = requiredArray(pkg, "rubricRevisionImplementations");
  const rubricRevisionAssessments = requiredArray(pkg, "rubricRevisionAssessments");
  const policyCounterfactualVariants = requiredArray(pkg, "policyCounterfactualVariants");
  const policyCounterfactualReplays = requiredArray(pkg, "policyCounterfactualReplays");
  const policyCounterfactualAssessments = requiredArray(pkg, "policyCounterfactualAssessments");
  const judgeConditionVariants = requiredArray(pkg, "judgeConditionVariants");
  const judgeRobustnessTrials = requiredArray(pkg, "judgeRobustnessTrials");
  const judgeRobustnessAssessments = requiredArray(pkg, "judgeRobustnessAssessments");
  const sequesteredReplayProtocols = requiredArray(pkg, "sequesteredReplayProtocols");
  const sequesteredReplayRuns = requiredArray(pkg, "sequesteredReplayRuns");
  const policyGamingAssessments = requiredArray(pkg, "policyGamingAssessments");
  const triggers = requiredArray(pkg, "governanceTriggers");
  const { index: packageRefIndex, loaded } = loadPackageRefs(packageRefs, packagePath);
  const originIndex = indexById(origins, `${packagePath}:evidenceOrigins`);
  const policyIndex = indexById(policies, `${packagePath}:calibrationPolicies`);
  const pairIndex = indexById(pairs, `${packagePath}:decisionOutcomePairs`);
  const cohortIndex = indexById(cohorts, `${packagePath}:calibrationCohorts`);
  const reportIndex = indexById(reports, `${packagePath}:calibrationReports`);
  const consequencePolicyIndex = indexById(consequencePolicies, `${packagePath}:consequencePolicies`);
  const decisionConsequenceIndex = indexById(decisionConsequences, `${packagePath}:decisionConsequences`);
  const consequenceAssessmentIndex = indexById(consequenceAssessments, `${packagePath}:consequenceAssessments`);
  const thresholdRobustnessIndex = indexById(thresholdRobustnessAnalyses, `${packagePath}:thresholdRobustnessAnalyses`);
  const escalationPolicyIndex = indexById(selectiveEscalationPolicies, `${packagePath}:selectiveEscalationPolicies`);
  const escalationDecisionIndex = indexById(selectiveEscalationDecisions, `${packagePath}:selectiveEscalationDecisions`);
  const escalationAssessmentIndex = indexById(selectiveEscalationAssessments, `${packagePath}:selectiveEscalationAssessments`);
  const resolutionPolicyIndex = indexById(escalationResolutionPolicies, `${packagePath}:escalationResolutionPolicies`);
  const resolutionIndex = indexById(escalationResolutions, `${packagePath}:escalationResolutions`);
  const resolutionAssessmentIndex = indexById(escalationResolutionAssessments, `${packagePath}:escalationResolutionAssessments`);
  const reviewerPolicyIndex = indexById(reviewerDisagreementPolicies, `${packagePath}:reviewerDisagreementPolicies`);
  const reviewerJudgmentIndex = indexById(reviewerJudgments, `${packagePath}:reviewerJudgments`);
  const reviewerDisagreementIndex = indexById(reviewerDisagreements, `${packagePath}:reviewerDisagreements`);
  const adjudicationIndex = indexById(adjudicationOutcomes, `${packagePath}:adjudicationOutcomes`);
  const reviewerAssessmentIndex = indexById(reviewerDisagreementAssessments, `${packagePath}:reviewerDisagreementAssessments`);
  const routePolicySnapshotIndex = indexById(routePolicySnapshots, `${packagePath}:routePolicySnapshots`);
  const routePolicyChangeIndex = indexById(routePolicyChanges, `${packagePath}:routePolicyChanges`);
  const routePolicyDriftIndex = indexById(routePolicyDriftAssessments, `${packagePath}:routePolicyDriftAssessments`);
  const routePolicyRevalidationIndex = indexById(routePolicyRevalidationOutcomes, `${packagePath}:routePolicyRevalidationOutcomes`);
  const routePolicyRevalidationAssessmentIndex = indexById(routePolicyRevalidationAssessments, `${packagePath}:routePolicyRevalidationAssessments`);
  const feedbackObservationIndex = indexById(adjudicationFeedbackObservations, `${packagePath}:adjudicationFeedbackObservations`);
  const rubricCandidateIndex = indexById(rubricRevisionCandidates, `${packagePath}:rubricRevisionCandidates`);
  const rubricDecisionIndex = indexById(rubricRevisionDecisions, `${packagePath}:rubricRevisionDecisions`);
  const rubricImplementationIndex = indexById(rubricRevisionImplementations, `${packagePath}:rubricRevisionImplementations`);
  const rubricAssessmentIndex = indexById(rubricRevisionAssessments, `${packagePath}:rubricRevisionAssessments`);
  const counterfactualVariantIndex = indexById(policyCounterfactualVariants, `${packagePath}:policyCounterfactualVariants`);
  const counterfactualReplayIndex = indexById(policyCounterfactualReplays, `${packagePath}:policyCounterfactualReplays`);
  const counterfactualAssessmentIndex = indexById(policyCounterfactualAssessments, `${packagePath}:policyCounterfactualAssessments`);
  const judgeConditionVariantIndex = indexById(judgeConditionVariants, `${packagePath}:judgeConditionVariants`);
  const judgeRobustnessTrialIndex = indexById(judgeRobustnessTrials, `${packagePath}:judgeRobustnessTrials`);
  const judgeRobustnessAssessmentIndex = indexById(judgeRobustnessAssessments, `${packagePath}:judgeRobustnessAssessments`);
  const sequesteredReplayProtocolIndex = indexById(sequesteredReplayProtocols, `${packagePath}:sequesteredReplayProtocols`);
  const sequesteredReplayRunIndex = indexById(sequesteredReplayRuns, `${packagePath}:sequesteredReplayRuns`);
  const policyGamingAssessmentIndex = indexById(policyGamingAssessments, `${packagePath}:policyGamingAssessments`);
  const triggerIndex = indexById(triggers, `${packagePath}:governanceTriggers`);

  for (const origin of origins) {
    for (const field of ["originKind", "sourceArtifact", "observationWindow", "environment", "generatedBy", "transformationSummary", "status"]) str(origin, field, origin.id);
    if (!originKinds.has(origin.originKind)) errors.push(`${origin.id} originKind is not supported.`);
    if (!Array.isArray(origin.verifiedBy) || origin.verifiedBy.length === 0) errors.push(`${origin.id} verifiedBy must include at least one verifier.`);
    if (empiricalKinds.has(origin.originKind) && origin.status !== "verified") errors.push(`${origin.id} empirical evidence origin must have status verified.`);
  }

  for (const policy of policies) {
    for (const field of ["predictionMeaning", "outcomeMeaning", "scoreRule", "insufficientDataAction", "status"]) str(policy, field, policy.id);
    if (policy.scoreRule !== "mean-squared-probability-error") errors.push(`${policy.id} scoreRule must be mean-squared-probability-error.`);
    if (!Number.isInteger(policy.roundingDecimals) || policy.roundingDecimals < 2 || policy.roundingDecimals > 6) errors.push(`${policy.id} roundingDecimals must be an integer from 2 to 6.`);
    if (!Number.isInteger(policy.minimumPairCount) || policy.minimumPairCount < 2) errors.push(`${policy.id} minimumPairCount must be at least 2.`);
    if (!Number.isInteger(policy.minimumEmpiricalPairCount) || policy.minimumEmpiricalPairCount < 2) errors.push(`${policy.id} minimumEmpiricalPairCount must be at least 2.`);
    score(policy.maximumAcceptableBrierScore, "maximumAcceptableBrierScore", policy.id);
    score(policy.maximumAcceptableBucketGap, "maximumAcceptableBucketGap", policy.id);
    if (policy.insufficientDataAction !== "governance-review") errors.push(`${policy.id} insufficientDataAction must be governance-review.`);
    if (!Array.isArray(policy.bucketDefinitions) || policy.bucketDefinitions.length < 2) {
      errors.push(`${policy.id} bucketDefinitions must include at least two buckets.`);
      continue;
    }
    const sorted = [...policy.bucketDefinitions].sort((a, b) => a.lowerInclusive - b.lowerInclusive);
    sorted.forEach((bucket, index) => {
      str(bucket, "id", `${policy.id} bucket`);
      score(bucket.lowerInclusive, "lowerInclusive", bucket.id || policy.id);
      if (typeof bucket.upperExclusive !== "number" || bucket.upperExclusive <= bucket.lowerInclusive || bucket.upperExclusive > 1.000001) errors.push(`${bucket.id} upperExclusive must be greater than lowerInclusive and no more than 1.000001.`);
      if (index === 0 && bucket.lowerInclusive !== 0) errors.push(`${policy.id} buckets must start at 0.`);
      if (index > 0 && !sameNumber(bucket.lowerInclusive, sorted[index - 1].upperExclusive)) errors.push(`${policy.id} buckets must be contiguous without gaps or overlap.`);
    });
    if (!sameNumber(sorted.at(-1).upperExclusive, 1.000001)) errors.push(`${policy.id} buckets must end at 1.000001 so probability 1 is included.`);
  }

  const pairKeys = new Set();
  for (const pair of pairs) {
    for (const field of ["sourcePackageRef", "gateDecisionRef", "outcomeReviewRef", "sourceEvidenceOriginRef", "evidenceOriginRef", "confidenceMeaning", "observedOutcome", "outcomeRationale", "observationWindow", "domain", "status"]) str(pair, field, pair.id);
    ref(packageRefIndex, pair.sourcePackageRef, "package ref", pair.id);
    const source = loaded.get(pair.sourcePackageRef);
    const decision = source?.decisions.get(pair.gateDecisionRef);
    const review = source?.reviews.get(pair.outcomeReviewRef);
    const sourceOrigin = source?.origins.get(pair.sourceEvidenceOriginRef);
    if (!decision) errors.push(`${pair.id} references missing gate decision: ${pair.gateDecisionRef}`);
    if (!review) errors.push(`${pair.id} references missing outcome review: ${pair.outcomeReviewRef}`);
    if (!sourceOrigin) errors.push(`${pair.id} references missing source evidence origin: ${pair.sourceEvidenceOriginRef}`);
    if (review && review.gateDecisionRef !== pair.gateDecisionRef) errors.push(`${pair.id} outcome review does not reference its gate decision.`);
    if (review && review.evidenceOriginRef !== pair.sourceEvidenceOriginRef) errors.push(`${pair.id} sourceEvidenceOriginRef must equal the referenced outcome review evidenceOriginRef.`);
    if (decision && !sameNumber(pair.sourceConfidence, decision.confidence)) errors.push(`${pair.id} sourceConfidence must equal the referenced gate decision confidence.`);
    score(pair.sourceConfidence, "sourceConfidence", pair.id);
    score(pair.forecastProbability, "forecastProbability", pair.id);
    if (!pair.confidenceTransformation || pair.confidenceTransformation.method !== "identity") errors.push(`${pair.id} confidenceTransformation.method must be identity in v0.6.31.`);
    if (pair.confidenceTransformation?.method === "identity" && !sameNumber(pair.forecastProbability, pair.sourceConfidence)) errors.push(`${pair.id} identity transformation must preserve sourceConfidence as forecastProbability.`);
    if (!Array.isArray(pair.confidenceTransformation?.reviewedBy) || pair.confidenceTransformation.reviewedBy.length === 0) errors.push(`${pair.id} confidenceTransformation must include reviewedBy.`);
    str(pair.confidenceTransformation, "rationale", `${pair.id} confidenceTransformation`);
    const policyMeanings = policies.map((policy) => policy.predictionMeaning);
    if (!policyMeanings.includes(pair.confidenceMeaning)) errors.push(`${pair.id} confidenceMeaning must match a calibration policy predictionMeaning.`);
    if (pair.observedOutcome === "protected-outcome-held" && pair.outcomeValue !== 1) errors.push(`${pair.id} protected-outcome-held requires outcomeValue 1.`);
    if (pair.observedOutcome === "protected-outcome-failed" && pair.outcomeValue !== 0) errors.push(`${pair.id} protected-outcome-failed requires outcomeValue 0.`);
    if (!new Set(["protected-outcome-held", "protected-outcome-failed"]).has(pair.observedOutcome)) errors.push(`${pair.id} observedOutcome is not supported.`);
    if (review && pair.observationWindow !== review.window) errors.push(`${pair.id} observationWindow must equal the referenced outcome review window.`);
    ref(originIndex, pair.evidenceOriginRef, "evidence origin", pair.id);
    if (typeof pair.included !== "boolean") errors.push(`${pair.id} included must be boolean.`);
    if (pair.included === false && (typeof pair.exclusionRationale !== "string" || pair.exclusionRationale.trim() === "")) errors.push(`${pair.id} excluded pair must include exclusionRationale.`);
    const key = `${pair.sourcePackageRef}/${pair.gateDecisionRef}/${pair.outcomeReviewRef}`;
    if (pairKeys.has(key)) errors.push(`${pair.id} duplicates decision-outcome pair ${key}.`);
    pairKeys.add(key);
  }

  for (const cohort of cohorts) {
    for (const field of ["title", "policyRef", "interpretation", "status"]) str(cohort, field, cohort.id);
    const policy = ref(policyIndex, cohort.policyRef, "calibration policy", cohort.id);
    const eligible = Array.isArray(cohort.eligibleDecisions) ? cohort.eligibleDecisions : [];
    if (eligible.length === 0) errors.push(`${cohort.id} eligibleDecisions must include at least one decision.`);
    const eligibleKeys = new Set();
    for (const decisionRef of eligible) {
      str(decisionRef, "sourcePackageRef", `${cohort.id} eligible decision`);
      str(decisionRef, "gateDecisionRef", `${cohort.id} eligible decision`);
      const source = loaded.get(decisionRef.sourcePackageRef);
      if (!source) errors.push(`${cohort.id} eligible decision references missing package: ${decisionRef.sourcePackageRef}`);
      else if (!source.decisions.has(decisionRef.gateDecisionRef)) errors.push(`${cohort.id} eligible decision references missing gate decision: ${decisionRef.gateDecisionRef}`);
      const key = `${decisionRef.sourcePackageRef}/${decisionRef.gateDecisionRef}`;
      if (eligibleKeys.has(key)) errors.push(`${cohort.id} eligibleDecisions must not contain duplicate ${key}.`);
      eligibleKeys.add(key);
    }
    const candidates = Array.isArray(cohort.candidatePairRefs)
      ? cohort.candidatePairRefs.map((id) => ref(pairIndex, id, "candidate decision-outcome pair", cohort.id)).filter(Boolean)
      : [];
    if (candidates.length === 0) errors.push(`${cohort.id} candidatePairRefs must include at least one pair.`);
    for (const pair of candidates) {
      if (!eligibleKeys.has(`${pair.sourcePackageRef}/${pair.gateDecisionRef}`)) errors.push(`${cohort.id} candidate pair ${pair.id} is not backed by an eligible decision.`);
    }
    const rules = Array.isArray(cohort.selectionRules) ? cohort.selectionRules : [];
    if (rules.length === 0) errors.push(`${cohort.id} selectionRules must include at least one rule.`);
    const ruleIndex = indexById(rules, `${cohort.id}:selectionRules`);
    for (const rule of rules) {
      for (const field of ["field", "operator", "effect", "rationale"]) str(rule, field, rule.id);
      if (!new Set(["domain", "observedOutcome", "status", "sourceEvidenceOriginKind"]).has(rule.field)) errors.push(`${rule.id} field is not supported.`);
      if (!new Set(["equals", "in", "not-equals"]).has(rule.operator)) errors.push(`${rule.id} operator is not supported.`);
      if (!new Set(["include", "exclude"]).has(rule.effect)) errors.push(`${rule.id} effect is not supported.`);
      if (!Array.isArray(rule.values) || rule.values.length === 0) errors.push(`${rule.id} values must include at least one value.`);
      if (["equals", "not-equals"].includes(rule.operator) && rule.values?.length !== 1) errors.push(`${rule.id} ${rule.operator} requires exactly one value.`);
    }
    const includeRules = rules.filter((rule) => rule.effect === "include");
    const excludeRules = rules.filter((rule) => rule.effect === "exclude");
    const expectedIncluded = [];
    const expectedExcluded = [];
    for (const pair of candidates) {
      const failedInclude = includeRules.find((rule) => !ruleMatches(rule, pair, loaded));
      const matchedExclude = excludeRules.find((rule) => ruleMatches(rule, pair, loaded));
      if (!failedInclude && !matchedExclude) expectedIncluded.push(pair);
      else expectedExcluded.push({ pair, rule: matchedExclude || failedInclude });
    }
    if (!sameSet(cohort.includedPairRefs, expectedIncluded.map((pair) => pair.id))) errors.push(`${cohort.id} includedPairRefs must reproduce from selectionRules.`);
    const excludedPairs = Array.isArray(cohort.excludedPairs) ? cohort.excludedPairs : [];
    if (!sameSet(excludedPairs.map((entry) => entry.pairRef), expectedExcluded.map((entry) => entry.pair.id))) errors.push(`${cohort.id} excludedPairs must exactly cover rule-excluded candidates.`);
    for (const entry of excludedPairs) {
      const pair = ref(pairIndex, entry.pairRef, "excluded pair", cohort.id);
      const rule = ref(ruleIndex, entry.ruleRef, "selection rule", `${cohort.id}/${entry.pairRef}`);
      str(entry, "rationale", `${cohort.id}/${entry.pairRef}`);
      const expected = expectedExcluded.find((item) => item.pair.id === pair?.id);
      if (expected && rule?.id !== expected.rule?.id) errors.push(`${cohort.id}/${entry.pairRef} ruleRef must identify the rule that excluded the pair.`);
    }

    const pairedEligibleKeys = new Set(pairs.map((pair) => `${pair.sourcePackageRef}/${pair.gateDecisionRef}`));
    const expectedMissing = eligible.filter((item) => !pairedEligibleKeys.has(`${item.sourcePackageRef}/${item.gateDecisionRef}`));
    const missing = Array.isArray(cohort.missingOutcomeDecisions) ? cohort.missingOutcomeDecisions : [];
    const missingKeys = missing.map((item) => `${item.sourcePackageRef}/${item.gateDecisionRef}`);
    if (!sameSet(missingKeys, expectedMissing.map((item) => `${item.sourcePackageRef}/${item.gateDecisionRef}`))) errors.push(`${cohort.id} missingOutcomeDecisions must exactly cover eligible decisions without a pair.`);
    for (const item of missing) str(item, "rationale", `${cohort.id} missing outcome decision`);

    const independence = cohort.independenceBoundary;
    let expectedDuplicateGroups = [];
    if (!independence || typeof independence !== "object") {
      errors.push(`${cohort.id} must include independenceBoundary.`);
    } else {
      str(independence, "unitOfAnalysis", `${cohort.id} independenceBoundary`);
      const fields = Array.isArray(independence.duplicateKeyFields) ? independence.duplicateKeyFields : [];
      if (fields.length === 0) errors.push(`${cohort.id} duplicateKeyFields must include at least one field.`);
      const grouped = new Map();
      for (const pair of expectedIncluded) {
        const key = fields.map((field) => String(pair[field])).join("|");
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(pair.id);
      }
      expectedDuplicateGroups = [...grouped.entries()].filter(([, pairRefs]) => pairRefs.length > 1).map(([key, pairRefs]) => ({ key, pairRefs }));
      const actualGroups = Array.isArray(independence.duplicateGroups) ? independence.duplicateGroups : [];
      if (!sameSet(actualGroups.map((group) => group.key), expectedDuplicateGroups.map((group) => group.key))) errors.push(`${cohort.id} duplicateGroups must reproduce from duplicateKeyFields.`);
      for (const expected of expectedDuplicateGroups) {
        const actual = actualGroups.find((group) => group.key === expected.key);
        if (actual && !sameSet(actual.pairRefs, expected.pairRefs)) errors.push(`${cohort.id} duplicate group ${expected.key} pairRefs must reproduce.`);
      }
      if (!Array.isArray(independence.dependenceRisks)) errors.push(`${cohort.id} dependenceRisks must be an array.`);
      const expectedStatus = expectedDuplicateGroups.length > 0 ? "unresolved" : (independence.dependenceRisks || []).length > 0 ? "bounded" : "clear";
      if (independence.status !== expectedStatus) errors.push(`${cohort.id} independence status must reproduce as ${expectedStatus}.`);
    }

    const definitions = Array.isArray(cohort.segmentDefinitions) ? cohort.segmentDefinitions : [];
    if (definitions.length === 0) errors.push(`${cohort.id} segmentDefinitions must include at least one definition.`);
    const definitionIndex = indexById(definitions, `${cohort.id}:segmentDefinitions`);
    for (const definition of definitions) {
      str(definition, "dimension", definition.id);
      str(definition, "rationale", definition.id);
      if (!Array.isArray(definition.highRiskValues)) errors.push(`${definition.id} highRiskValues must be an array.`);
    }
    const expectedSegments = [];
    if (policy) {
      for (const definition of definitions) {
        const values = [...new Set(expectedIncluded.map((pair) => pairField(pair, definition.dimension, loaded)))].filter((value) => value !== undefined).sort();
        for (const value of values) {
          const segmentPairs = expectedIncluded.filter((pair) => pairField(pair, definition.dimension, loaded) === value);
          expectedSegments.push({ definition, value, pairs: segmentPairs });
        }
      }
      const summaries = Array.isArray(cohort.segmentSummaries) ? cohort.segmentSummaries : [];
      const summaryKeys = summaries.map((summary) => `${summary.segmentRef}/${summary.value}`);
      const expectedKeys = expectedSegments.map((segment) => `${segment.definition.id}/${segment.value}`);
      if (!sameSet(summaryKeys, expectedKeys)) errors.push(`${cohort.id} segmentSummaries must exactly cover included segment values.`);
      for (const expected of expectedSegments) {
        const summary = summaries.find((item) => item.segmentRef === expected.definition.id && item.value === expected.value);
        if (!summary) continue;
        ref(definitionIndex, summary.segmentRef, "segment definition", cohort.id);
        if (!sameSet(summary.pairRefs, expected.pairs.map((pair) => pair.id))) errors.push(`${cohort.id}/${summary.segmentRef}/${summary.value} pairRefs must reproduce.`);
        if (summary.pairCount !== expected.pairs.length) errors.push(`${cohort.id}/${summary.segmentRef}/${summary.value} pairCount must reproduce as ${expected.pairs.length}.`);
        const prevalence = round(expected.pairs.reduce((sum, pair) => sum + pair.outcomeValue, 0) / expected.pairs.length, policy.roundingDecimals);
        const brier = round(expected.pairs.reduce((sum, pair) => sum + (pair.forecastProbability - pair.outcomeValue) ** 2, 0) / expected.pairs.length, policy.roundingDecimals);
        if (!sameNumber(summary.outcomePrevalence, prevalence)) errors.push(`${cohort.id}/${summary.segmentRef}/${summary.value} outcomePrevalence must reproduce as ${prevalence}.`);
        if (!sameNumber(summary.brierScore, brier)) errors.push(`${cohort.id}/${summary.segmentRef}/${summary.value} brierScore must reproduce as ${brier}.`);
        const highRisk = expected.definition.highRiskValues.includes(expected.value);
        if (summary.highRisk !== highRisk) errors.push(`${cohort.id}/${summary.segmentRef}/${summary.value} highRisk must reproduce as ${highRisk}.`);
      }
    }

    const summary = cohort.completenessSummary;
    if (!summary || typeof summary !== "object") {
      errors.push(`${cohort.id} must include completenessSummary.`);
    } else if (policy) {
      const coverage = round((eligible.length - expectedMissing.length) / eligible.length, policy.roundingDecimals);
      const prevalence = expectedIncluded.length > 0 ? round(expectedIncluded.reduce((sum, pair) => sum + pair.outcomeValue, 0) / expectedIncluded.length, policy.roundingDecimals) : 0;
      const expectedValues = {
        eligibleDecisionCount: eligible.length,
        candidatePairCount: candidates.length,
        includedPairCount: expectedIncluded.length,
        excludedPairCount: expectedExcluded.length,
        missingOutcomeCount: expectedMissing.length,
        coverageRate: coverage,
        outcomePrevalence: prevalence
      };
      for (const [field, value] of Object.entries(expectedValues)) if (!sameNumber(summary[field], value)) errors.push(`${cohort.id} completenessSummary.${field} must reproduce as ${value}.`);
    }

    const drift = cohort.driftAssessment;
    if (!drift || typeof drift !== "object") {
      errors.push(`${cohort.id} must include driftAssessment.`);
    } else {
      for (const field of ["comparisonBasis", "status", "rationale"]) str(drift, field, `${cohort.id} driftAssessment`);
      if (!Array.isArray(drift.dimensions) || drift.dimensions.length === 0) errors.push(`${cohort.id} driftAssessment.dimensions must include at least one dimension.`);
      if (!drift.baselineCohortRef && drift.status !== "not-assessed") errors.push(`${cohort.id} drift without baseline must have status not-assessed.`);
      if (drift.baselineCohortRef) {
        ref(cohortIndex, drift.baselineCohortRef, "baseline cohort", cohort.id);
        if (drift.status === "not-assessed") errors.push(`${cohort.id} drift with baseline must be stable or drift-detected.`);
      }
    }

    if (cohort.interpretation !== "cohort-evidence-only-not-representativeness-or-quality") errors.push(`${cohort.id} interpretation must be cohort-evidence-only-not-representativeness-or-quality.`);
    if (!Array.isArray(cohort.governanceTriggerRefs)) errors.push(`${cohort.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((cohort.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", cohort.id)?.triggerType));
    if (policy && expectedIncluded.length < policy.minimumPairCount && !triggerTypes.has("insufficient-data")) errors.push(`${cohort.id} insufficient included cohort requires an insufficient-data governance trigger.`);
    if (expectedMissing.length > 0 && !triggerTypes.has("missing-outcomes")) errors.push(`${cohort.id} missing outcomes require a missing-outcomes governance trigger.`);
    if (expectedDuplicateGroups.length > 0 && !triggerTypes.has("duplicate-observations")) errors.push(`${cohort.id} duplicate observations require a duplicate-observations governance trigger.`);
    if (independence?.status === "unresolved" && !triggerTypes.has("dependence-unresolved")) errors.push(`${cohort.id} unresolved independence requires a dependence-unresolved governance trigger.`);
    const summaries = Array.isArray(cohort.segmentSummaries) ? cohort.segmentSummaries : [];
    if (policy && summaries.some((item) => item.highRisk === true && item.brierScore > policy.maximumAcceptableBrierScore) && !triggerTypes.has("high-risk-segment-gap")) errors.push(`${cohort.id} adverse high-risk segment requires a high-risk-segment-gap governance trigger.`);
    if (drift?.status === "not-assessed" && !triggerTypes.has("drift-not-assessed")) errors.push(`${cohort.id} unassessed drift requires a drift-not-assessed governance trigger.`);
    if (drift?.status === "drift-detected" && !triggerTypes.has("drift-detected")) errors.push(`${cohort.id} detected drift requires a drift-detected governance trigger.`);
  }

  for (const policy of consequencePolicies) {
    for (const field of ["sourcePackageRef", "qualityIntentRef", "lossBoundary", "lossBoundarySeverity", "thresholdMeaning", "weightSemantics", "severeFalseAssuranceAction", "status"]) str(policy, field, policy.id);
    const source = loaded.get(policy.sourcePackageRef);
    if (!source) errors.push(`${policy.id} references missing source package: ${policy.sourcePackageRef}`);
    const intent = source?.qualityIntents.get(policy.qualityIntentRef);
    if (!intent) errors.push(`${policy.id} references missing quality intent: ${policy.qualityIntentRef}`);
    if (intent && policy.lossBoundary !== intent.lossBoundary) errors.push(`${policy.id} lossBoundary must equal the referenced quality intent lossBoundary.`);
    if (intent && policy.lossBoundarySeverity !== intent.lossBoundarySeverity) errors.push(`${policy.id} lossBoundarySeverity must equal the referenced quality intent severity.`);
    score(policy.actionThreshold, "actionThreshold", policy.id);
    score(policy.maximumAcceptableWeightedErrorRate, "maximumAcceptableWeightedErrorRate", policy.id);
    if (policy.thresholdMeaning !== "proceed-when-forecast-at-or-above-threshold") errors.push(`${policy.id} thresholdMeaning must be proceed-when-forecast-at-or-above-threshold.`);
    if (!Number.isInteger(policy.falseAssuranceWeight) || policy.falseAssuranceWeight < 1 || policy.falseAssuranceWeight > 10) errors.push(`${policy.id} falseAssuranceWeight must be an integer from 1 to 10.`);
    if (!Number.isInteger(policy.falseAlarmWeight) || policy.falseAlarmWeight < 1 || policy.falseAlarmWeight > 10) errors.push(`${policy.id} falseAlarmWeight must be an integer from 1 to 10.`);
    if (["high", "critical"].includes(policy.lossBoundarySeverity) && policy.falseAssuranceWeight <= policy.falseAlarmWeight) errors.push(`${policy.id} high or critical loss boundary must prioritize false assurance above false alarm.`);
    if (policy.weightSemantics !== "policy-local-governance-priority-not-harm-or-money") errors.push(`${policy.id} weightSemantics must remain policy-local-governance-priority-not-harm-or-money.`);
    if (!Number.isInteger(policy.roundingDecimals) || policy.roundingDecimals < 2 || policy.roundingDecimals > 6) errors.push(`${policy.id} roundingDecimals must be an integer from 2 to 6.`);
    if (!Number.isInteger(policy.minimumPairCount) || policy.minimumPairCount < 2) errors.push(`${policy.id} minimumPairCount must be at least 2.`);
    if (policy.severeFalseAssuranceAction !== "governance-review") errors.push(`${policy.id} severeFalseAssuranceAction must be governance-review.`);
    if (!Array.isArray(policy.reviewedBy) || policy.reviewedBy.length === 0) errors.push(`${policy.id} reviewedBy must include at least one accountable reviewer.`);
    if (!Array.isArray(policy.governanceTriggerRefs)) errors.push(`${policy.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((policy.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", policy.id)?.triggerType));
    if (policy.status !== "active" && !triggerTypes.has("consequence-policy-unreviewed")) errors.push(`${policy.id} non-active consequence policy requires a consequence-policy-unreviewed governance trigger.`);
  }

  const consequenceKeys = new Set();
  for (const consequence of decisionConsequences) {
    for (const field of ["pairRef", "policyRef", "recommendedAction", "observedOutcome", "consequenceClass", "rationale", "status"]) str(consequence, field, consequence.id);
    const pair = ref(pairIndex, consequence.pairRef, "decision-outcome pair", consequence.id);
    const policy = ref(consequencePolicyIndex, consequence.policyRef, "consequence policy", consequence.id);
    if (!pair || !policy) continue;
    const key = `${pair.id}/${policy.id}`;
    if (consequenceKeys.has(key)) errors.push(`${consequence.id} duplicates decision consequence ${key}.`);
    consequenceKeys.add(key);
    if (pair.sourcePackageRef !== policy.sourcePackageRef) errors.push(`${consequence.id} pair and consequence policy must reference the same source package.`);
    const source = loaded.get(pair.sourcePackageRef);
    const decision = source?.decisions.get(pair.gateDecisionRef);
    const review = source?.reviews.get(pair.outcomeReviewRef);
    if (decision && !(decision.intentVerdicts || []).some((item) => item.intentRef === policy.qualityIntentRef)) errors.push(`${consequence.id} source gate decision must include the consequence policy quality intent.`);
    if (review && !(review.feedsQualityIntentRefs || []).includes(policy.qualityIntentRef)) errors.push(`${consequence.id} source outcome review must identify the consequence policy quality intent.`);
    if (!sameNumber(consequence.forecastProbability, pair.forecastProbability)) errors.push(`${consequence.id} forecastProbability must equal the referenced pair forecastProbability.`);
    if (!sameNumber(consequence.actionThreshold, policy.actionThreshold)) errors.push(`${consequence.id} actionThreshold must equal the referenced consequence policy threshold.`);
    if (consequence.observedOutcome !== pair.observedOutcome) errors.push(`${consequence.id} observedOutcome must equal the referenced pair outcome.`);
    const expectedAction = pair.forecastProbability >= policy.actionThreshold ? "proceed" : "defer";
    if (consequence.recommendedAction !== expectedAction) errors.push(`${consequence.id} recommendedAction must reproduce as ${expectedAction}.`);
    let expectedClass;
    if (expectedAction === "proceed" && pair.outcomeValue === 1) expectedClass = "aligned-proceed";
    else if (expectedAction === "defer" && pair.outcomeValue === 0) expectedClass = "aligned-defer";
    else if (expectedAction === "proceed") expectedClass = "false-assurance";
    else expectedClass = "false-alarm";
    if (consequence.consequenceClass !== expectedClass) errors.push(`${consequence.id} consequenceClass must reproduce as ${expectedClass}.`);
    const applicableWeight = pair.outcomeValue === 0 ? policy.falseAssuranceWeight : policy.falseAlarmWeight;
    if (consequence.applicableWeight !== applicableWeight) errors.push(`${consequence.id} applicableWeight must reproduce as ${applicableWeight}.`);
    const expectedWeightedError = ["false-assurance", "false-alarm"].includes(expectedClass) ? applicableWeight : 0;
    if (!sameNumber(consequence.weightedError, expectedWeightedError)) errors.push(`${consequence.id} weightedError must reproduce as ${expectedWeightedError}.`);
    if (!Array.isArray(consequence.governanceTriggerRefs)) errors.push(`${consequence.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((consequence.governanceTriggerRefs || []).map((id) => {
      const trigger = ref(triggerIndex, id, "governance trigger", consequence.id);
      const sourceReport = trigger ? reportIndex.get(trigger.sourceCalibrationReportRef) : null;
      if (trigger && sourceReport && !(sourceReport.includedPairRefs || []).includes(pair.id)) errors.push(`${trigger.id} source calibration report must include pair ${pair.id}.`);
      return trigger?.triggerType;
    }));
    if (expectedClass === "false-assurance" && ["high", "critical"].includes(policy.lossBoundarySeverity) && !triggerTypes.has("severe-false-assurance")) errors.push(`${consequence.id} severe false assurance requires a severe-false-assurance governance trigger.`);
  }

  for (const assessment of consequenceAssessments) {
    for (const field of ["title", "policyRef", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const policy = ref(consequencePolicyIndex, assessment.policyRef, "consequence policy", assessment.id);
    const items = Array.isArray(assessment.decisionConsequenceRefs)
      ? assessment.decisionConsequenceRefs.map((id) => ref(decisionConsequenceIndex, id, "decision consequence", assessment.id)).filter(Boolean)
      : [];
    if (items.length === 0) errors.push(`${assessment.id} decisionConsequenceRefs must include at least one record.`);
    if (new Set(assessment.decisionConsequenceRefs || []).size !== (assessment.decisionConsequenceRefs || []).length) errors.push(`${assessment.id} decisionConsequenceRefs must not contain duplicates.`);
    for (const item of items) if (item.policyRef !== assessment.policyRef) errors.push(`${assessment.id} decision consequence ${item.id} must use policy ${assessment.policyRef}.`);
    const falseAssuranceCount = items.filter((item) => item.consequenceClass === "false-assurance").length;
    const falseAlarmCount = items.filter((item) => item.consequenceClass === "false-alarm").length;
    const alignedCount = items.length - falseAssuranceCount - falseAlarmCount;
    const totalApplicableWeight = items.reduce((sum, item) => sum + item.applicableWeight, 0);
    const totalWeightedError = items.reduce((sum, item) => sum + item.weightedError, 0);
    const weightedErrorRate = policy && totalApplicableWeight > 0 ? round(totalWeightedError / totalApplicableWeight, policy.roundingDecimals) : 0;
    const expectedValues = { pairCount: items.length, falseAssuranceCount, falseAlarmCount, alignedCount, totalApplicableWeight, totalWeightedError, weightedErrorRate };
    for (const [field, value] of Object.entries(expectedValues)) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    if (policy && !sameNumber(assessment.maximumAcceptableWeightedErrorRate, policy.maximumAcceptableWeightedErrorRate)) errors.push(`${assessment.id} maximumAcceptableWeightedErrorRate must match the consequence policy.`);
    const expectedSignal = policy && items.length < policy.minimumPairCount
      ? "insufficient-data"
      : policy && weightedErrorRate > policy.maximumAcceptableWeightedErrorRate ? "above-policy-tolerance" : "within-policy-tolerance";
    if (assessment.assessmentSignal !== expectedSignal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${expectedSignal}.`);
    if (assessment.interpretation !== "policy-local-decision-evidence-only-not-quality-or-authority") errors.push(`${assessment.id} interpretation must be policy-local-decision-evidence-only-not-quality-or-authority.`);
    if (!Array.isArray(assessment.governanceTriggerRefs)) errors.push(`${assessment.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (expectedSignal === "insufficient-data" && !triggerTypes.has("insufficient-data")) errors.push(`${assessment.id} insufficient consequence data requires an insufficient-data governance trigger.`);
    if (policy && weightedErrorRate > policy.maximumAcceptableWeightedErrorRate && !triggerTypes.has("consequence-threshold-exceeded")) errors.push(`${assessment.id} weighted error above policy tolerance requires a consequence-threshold-exceeded governance trigger.`);
  }

  for (const analysis of thresholdRobustnessAnalyses) {
    for (const field of ["title", "policyRef", "interpretation", "status"]) str(analysis, field, analysis.id);
    const policy = ref(consequencePolicyIndex, analysis.policyRef, "consequence policy", analysis.id);
    const baselines = Array.isArray(analysis.baselineDecisionConsequenceRefs)
      ? analysis.baselineDecisionConsequenceRefs.map((id) => ref(decisionConsequenceIndex, id, "baseline decision consequence", analysis.id)).filter(Boolean)
      : [];
    if (baselines.length === 0) errors.push(`${analysis.id} baselineDecisionConsequenceRefs must include at least one record.`);
    for (const item of baselines) if (item.policyRef !== analysis.policyRef) errors.push(`${analysis.id} baseline ${item.id} must use policy ${analysis.policyRef}.`);
    const alternatives = Array.isArray(analysis.thresholdAlternatives) ? analysis.thresholdAlternatives : [];
    if (alternatives.length < 2) errors.push(`${analysis.id} thresholdAlternatives must include at least two alternatives.`);
    const alternativeIndex = indexById(alternatives, `${analysis.id}:thresholdAlternatives`);
    const thresholdValues = new Set();
    for (const alternative of alternatives) {
      score(alternative.threshold, "threshold", alternative.id);
      str(alternative, "rationale", alternative.id);
      if (!Array.isArray(alternative.reviewedBy) || alternative.reviewedBy.length === 0) errors.push(`${alternative.id} reviewedBy must include at least one reviewer.`);
      if (policy && sameNumber(alternative.threshold, policy.actionThreshold)) errors.push(`${alternative.id} must differ from the baseline action threshold.`);
      if (thresholdValues.has(alternative.threshold)) errors.push(`${analysis.id} threshold alternatives must not duplicate ${alternative.threshold}.`);
      thresholdValues.add(alternative.threshold);
    }
    if (policy && alternatives.length > 0 && !alternatives.some((item) => item.threshold < policy.actionThreshold)) errors.push(`${analysis.id} threshold alternatives must include a value below the baseline.`);
    if (policy && alternatives.length > 0 && !alternatives.some((item) => item.threshold > policy.actionThreshold)) errors.push(`${analysis.id} threshold alternatives must include a value above the baseline.`);

    const expectedReplays = [];
    if (policy) {
      for (const baseline of baselines) {
        const pair = pairIndex.get(baseline.pairRef);
        if (!pair) continue;
        for (const alternative of alternatives) {
          const action = pair.forecastProbability >= alternative.threshold ? "proceed" : "defer";
          let consequenceClass;
          if (action === "proceed" && pair.outcomeValue === 1) consequenceClass = "aligned-proceed";
          else if (action === "defer" && pair.outcomeValue === 0) consequenceClass = "aligned-defer";
          else if (action === "proceed") consequenceClass = "false-assurance";
          else consequenceClass = "false-alarm";
          const applicableWeight = pair.outcomeValue === 0 ? policy.falseAssuranceWeight : policy.falseAlarmWeight;
          const weightedError = ["false-assurance", "false-alarm"].includes(consequenceClass) ? applicableWeight : 0;
          expectedReplays.push({ baseline, pair, alternative, action, consequenceClass, applicableWeight, weightedError, distance: round(Math.abs(pair.forecastProbability - alternative.threshold), policy.roundingDecimals) });
        }
      }
    }
    const replays = Array.isArray(analysis.thresholdReplays) ? analysis.thresholdReplays : [];
    const replayKeys = replays.map((item) => `${item.alternativeRef}/${item.pairRef}`);
    const expectedKeys = expectedReplays.map((item) => `${item.alternative.id}/${item.pair.id}`);
    if (!sameSet(replayKeys, expectedKeys)) errors.push(`${analysis.id} thresholdReplays must exactly cover every baseline pair and alternative.`);
    for (const expected of expectedReplays) {
      const replay = replays.find((item) => item.alternativeRef === expected.alternative.id && item.pairRef === expected.pair.id);
      if (!replay) continue;
      ref(alternativeIndex, replay.alternativeRef, "threshold alternative", analysis.id);
      if (replay.recommendedAction !== expected.action) errors.push(`${analysis.id}/${replay.alternativeRef}/${replay.pairRef} recommendedAction must reproduce as ${expected.action}.`);
      if (replay.consequenceClass !== expected.consequenceClass) errors.push(`${analysis.id}/${replay.alternativeRef}/${replay.pairRef} consequenceClass must reproduce as ${expected.consequenceClass}.`);
      if (replay.applicableWeight !== expected.applicableWeight) errors.push(`${analysis.id}/${replay.alternativeRef}/${replay.pairRef} applicableWeight must reproduce as ${expected.applicableWeight}.`);
      if (!sameNumber(replay.weightedError, expected.weightedError)) errors.push(`${analysis.id}/${replay.alternativeRef}/${replay.pairRef} weightedError must reproduce as ${expected.weightedError}.`);
      if (!sameNumber(replay.distanceFromForecast, expected.distance)) errors.push(`${analysis.id}/${replay.alternativeRef}/${replay.pairRef} distanceFromForecast must reproduce as ${expected.distance}.`);
    }
    const brittleness = analysis.brittlenessPolicy;
    if (!brittleness || typeof brittleness !== "object") errors.push(`${analysis.id} must include brittlenessPolicy.`);
    else {
      score(brittleness.maximumActionFlipRate, "maximumActionFlipRate", `${analysis.id} brittlenessPolicy`);
      score(brittleness.minimumBoundaryDistance, "minimumBoundaryDistance", `${analysis.id} brittlenessPolicy`);
      str(brittleness, "rationale", `${analysis.id} brittlenessPolicy`);
      if (!Array.isArray(brittleness.reviewedBy) || brittleness.reviewedBy.length === 0) errors.push(`${analysis.id} brittlenessPolicy reviewedBy must include at least one reviewer.`);
    }
    const actionFlipCount = expectedReplays.filter((item) => item.action !== item.baseline.recommendedAction).length;
    const flippedPairRefs = [...new Set(expectedReplays.filter((item) => item.action !== item.baseline.recommendedAction).map((item) => item.pair.id))];
    const flipRate = policy && expectedReplays.length > 0 ? round(actionFlipCount / expectedReplays.length, policy.roundingDecimals) : 0;
    const minDistance = expectedReplays.length > 0 ? Math.min(...expectedReplays.map((item) => item.distance)) : 0;
    const isBrittle = brittleness && (flipRate > brittleness.maximumActionFlipRate || minDistance < brittleness.minimumBoundaryDistance);
    const insufficient = policy && baselines.length < policy.minimumPairCount;
    const signal = insufficient && isBrittle ? "insufficient-and-brittle" : insufficient ? "insufficient-data" : isBrittle ? "brittle" : "stable";
    const summary = analysis.robustnessSummary || {};
    const expectedSummary = { pairCount: baselines.length, alternativeCount: alternatives.length, actionEvaluationCount: expectedReplays.length, actionFlipCount, actionFlipRate: flipRate, minimumBoundaryDistance: minDistance };
    for (const [field, value] of Object.entries(expectedSummary)) if (!sameNumber(summary[field], value)) errors.push(`${analysis.id} robustnessSummary.${field} must reproduce as ${value}.`);
    if (!sameSet(summary.flippedPairRefs, flippedPairRefs)) errors.push(`${analysis.id} robustnessSummary.flippedPairRefs must reproduce.`);
    if (summary.brittlenessSignal !== signal) errors.push(`${analysis.id} robustnessSummary.brittlenessSignal must reproduce as ${signal}.`);
    if (analysis.interpretation !== "sensitivity-evidence-only-not-policy-optimization-quality-or-authority") errors.push(`${analysis.id} interpretation must remain sensitivity-evidence-only-not-policy-optimization-quality-or-authority.`);
    if (!Array.isArray(analysis.governanceTriggerRefs)) errors.push(`${analysis.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((analysis.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", analysis.id)?.triggerType));
    if (insufficient && !triggerTypes.has("insufficient-data")) errors.push(`${analysis.id} insufficient robustness evidence requires an insufficient-data governance trigger.`);
    if (isBrittle && !triggerTypes.has("threshold-brittleness")) errors.push(`${analysis.id} brittle threshold result requires a threshold-brittleness governance trigger.`);
  }

  const requiredRouteTypes = ["proceed", "defer", "human-review", "specialist-escalation"];
  for (const policy of selectiveEscalationPolicies) {
    const consequencePolicy = ref(consequencePolicyIndex, policy.consequencePolicyRef, "consequence policy", policy.id);
    const routes = Array.isArray(policy.routes) ? policy.routes : [];
    const routeIndex = indexById(routes, `${policy.id}:routes`);
    const routeTypes = routes.map((route) => route.routeType);
    if (!sameSet(routeTypes, requiredRouteTypes)) errors.push(`${policy.id} routes must define proceed, defer, human-review, and specialist-escalation exactly once.`);
    for (const route of routes) {
      for (const field of ["routeType", "authorityRef", "capabilityRequirement", "responseTimeBoundary", "status"]) str(route, field, route.id);
      if (!Array.isArray(route.evidenceRequired) || route.evidenceRequired.length === 0) errors.push(`${route.id} evidenceRequired must include at least one item.`);
    }
    const rules = Array.isArray(policy.routingRules) ? [...policy.routingRules].sort((a, b) => a.lowerInclusive - b.lowerInclusive) : [];
    if (rules.length < 4) errors.push(`${policy.id} routingRules must include at least four rules.`);
    const ruleIndex = indexById(rules, `${policy.id}:routingRules`);
    for (const [index, rule] of rules.entries()) {
      score(rule.lowerInclusive, "lowerInclusive", rule.id);
      if (typeof rule.upperExclusive !== "number" || rule.upperExclusive <= rule.lowerInclusive || rule.upperExclusive > 1.000001) errors.push(`${rule.id} upperExclusive must be greater than lowerInclusive and no more than 1.000001.`);
      ref(routeIndex, rule.routeRef, "escalation route", rule.id);
      str(rule, "rationale", rule.id);
      if (index === 0 && rule.lowerInclusive !== 0) errors.push(`${policy.id} routingRules must start at 0.`);
      if (index > 0 && !sameNumber(rule.lowerInclusive, rules[index - 1].upperExclusive)) errors.push(`${policy.id} routingRules must be contiguous without gaps or overlap.`);
    }
    if (rules.length > 0 && !sameNumber(rules.at(-1).upperExclusive, 1.000001)) errors.push(`${policy.id} routingRules must end at 1.000001 so probability 1 is included.`);
    if (!sameSet(rules.map((rule) => rule.routeRef), routes.map((route) => route.id))) errors.push(`${policy.id} routingRules must make every declared route reachable exactly once.`);
    if (!Number.isInteger(policy.minimumPairCount) || policy.minimumPairCount < 2) errors.push(`${policy.id} minimumPairCount must be at least 2.`);
    if (!Number.isInteger(policy.minimumVerifiedExecutionCount) || policy.minimumVerifiedExecutionCount < 2) errors.push(`${policy.id} minimumVerifiedExecutionCount must be at least 2.`);
    if (policy.routeVolumeInterpretation !== "workload-evidence-only-not-quality-competence-or-authority") errors.push(`${policy.id} routeVolumeInterpretation must be workload-evidence-only-not-quality-competence-or-authority.`);
    if (!Array.isArray(policy.reviewedBy) || policy.reviewedBy.length === 0) errors.push(`${policy.id} reviewedBy must include at least one accountable reviewer.`);
    if (!Array.isArray(policy.governanceTriggerRefs)) errors.push(`${policy.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((policy.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", policy.id)?.triggerType));
    if (policy.status !== "active" && !triggerTypes.has("route-policy-unreviewed")) errors.push(`${policy.id} non-active route policy requires a route-policy-unreviewed governance trigger.`);
    if (!consequencePolicy) continue;
    if (policy.status === "active" && routes.some((route) => route.status !== "active")) errors.push(`${policy.id} active policy requires every route to be active.`);
    policy.__routeIndex = routeIndex;
    policy.__ruleIndex = ruleIndex;
  }

  const escalationKeys = new Set();
  for (const decision of selectiveEscalationDecisions) {
    for (const field of ["pairRef", "policyRef", "selectedRuleRef", "recommendedRouteRef", "actualRouteRef", "authorityRef", "observedOutcome", "routeOutcomeClass", "rationale", "status"]) str(decision, field, decision.id);
    const pair = ref(pairIndex, decision.pairRef, "decision-outcome pair", decision.id);
    const policy = ref(escalationPolicyIndex, decision.policyRef, "selective escalation policy", decision.id);
    if (!pair || !policy) continue;
    const key = `${pair.id}/${policy.id}`;
    if (escalationKeys.has(key)) errors.push(`${decision.id} duplicates selective escalation decision ${key}.`);
    escalationKeys.add(key);
    if (!sameNumber(decision.forecastProbability, pair.forecastProbability)) errors.push(`${decision.id} forecastProbability must equal the referenced pair forecastProbability.`);
    const matchingRules = (policy.routingRules || []).filter((rule) => pair.forecastProbability >= rule.lowerInclusive && pair.forecastProbability < rule.upperExclusive);
    if (matchingRules.length !== 1) errors.push(`${decision.id} forecastProbability must match exactly one routing rule.`);
    const expectedRule = matchingRules[0];
    if (expectedRule && decision.selectedRuleRef !== expectedRule.id) errors.push(`${decision.id} selectedRuleRef must reproduce as ${expectedRule.id}.`);
    if (expectedRule && decision.recommendedRouteRef !== expectedRule.routeRef) errors.push(`${decision.id} recommendedRouteRef must reproduce as ${expectedRule.routeRef}.`);
    const actualRoute = policy.__routeIndex?.get(decision.actualRouteRef);
    if (!actualRoute) errors.push(`${decision.id} references missing actual escalation route: ${decision.actualRouteRef}`);
    const expectedDeviation = decision.actualRouteRef !== decision.recommendedRouteRef;
    if (decision.routeDeviation !== expectedDeviation) errors.push(`${decision.id} routeDeviation must reproduce as ${expectedDeviation}.`);
    if (actualRoute && decision.authorityRef !== actualRoute.authorityRef) errors.push(`${decision.id} authorityRef must equal the declared actual-route authorityRef.`);
    if (decision.observedOutcome !== pair.observedOutcome) errors.push(`${decision.id} observedOutcome must equal the referenced pair outcome.`);
    const outcomeSuffix = pair.outcomeValue === 1 ? "held" : "failed";
    const expectedClass = actualRoute ? `${actualRoute.routeType}-outcome-${outcomeSuffix}` : null;
    if (expectedClass && decision.routeOutcomeClass !== expectedClass) errors.push(`${decision.id} routeOutcomeClass must reproduce as ${expectedClass}.`);
    const evidence = decision.routeExecutionEvidence;
    if (!evidence || typeof evidence !== "object") errors.push(`${decision.id} must include routeExecutionEvidence.`);
    else {
      for (const field of ["sourceArtifact", "executedBy", "observationWindow", "resultSummary", "status"]) str(evidence, field, `${decision.id} routeExecutionEvidence`);
      if (!Array.isArray(evidence.verifiedBy) || evidence.verifiedBy.length === 0) errors.push(`${decision.id} routeExecutionEvidence verifiedBy must include at least one verifier.`);
    }
    if (!Array.isArray(decision.governanceTriggerRefs)) errors.push(`${decision.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((decision.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", decision.id)?.triggerType));
    if (expectedDeviation && !triggerTypes.has("route-deviation")) errors.push(`${decision.id} route deviation requires a route-deviation governance trigger.`);
    if (decision.authorityResolved !== true && !triggerTypes.has("route-authority-unresolved")) errors.push(`${decision.id} unresolved authority requires a route-authority-unresolved governance trigger.`);
    if (evidence?.status !== "verified" && !triggerTypes.has("route-evidence-unverified")) errors.push(`${decision.id} non-verified route evidence requires a route-evidence-unverified governance trigger.`);
    if (actualRoute && ["human-review", "specialist-escalation"].includes(actualRoute.routeType) && pair.outcomeValue === 0 && !triggerTypes.has("escalated-outcome-failed")) errors.push(`${decision.id} failed escalated outcome requires an escalated-outcome-failed governance trigger.`);
  }

  for (const assessment of selectiveEscalationAssessments) {
    for (const field of ["title", "policyRef", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const policy = ref(escalationPolicyIndex, assessment.policyRef, "selective escalation policy", assessment.id);
    const decisions = Array.isArray(assessment.decisionRefs)
      ? assessment.decisionRefs.map((id) => ref(escalationDecisionIndex, id, "selective escalation decision", assessment.id)).filter(Boolean)
      : [];
    if (decisions.length === 0) errors.push(`${assessment.id} decisionRefs must include at least one record.`);
    if (new Set(assessment.decisionRefs || []).size !== (assessment.decisionRefs || []).length) errors.push(`${assessment.id} decisionRefs must not contain duplicates.`);
    for (const decision of decisions) if (decision.policyRef !== assessment.policyRef) errors.push(`${assessment.id} decision ${decision.id} must use policy ${assessment.policyRef}.`);
    const summaries = Array.isArray(assessment.routeSummaries) ? assessment.routeSummaries : [];
    if (policy && !sameSet(summaries.map((item) => item.routeRef), policy.routes.map((route) => route.id))) errors.push(`${assessment.id} routeSummaries must exactly cover policy routes.`);
    for (const summary of summaries) {
      const route = policy?.__routeIndex?.get(summary.routeRef);
      if (!route) errors.push(`${assessment.id} route summary references missing route: ${summary.routeRef}`);
      const routeDecisions = decisions.filter((decision) => decision.actualRouteRef === summary.routeRef);
      const heldCount = routeDecisions.filter((decision) => decision.observedOutcome === "protected-outcome-held").length;
      const failedCount = routeDecisions.length - heldCount;
      if (!sameSet(summary.decisionRefs, routeDecisions.map((decision) => decision.id))) errors.push(`${assessment.id}/${summary.routeRef} decisionRefs must reproduce.`);
      for (const [field, value] of Object.entries({ decisionCount: routeDecisions.length, heldCount, failedCount })) if (!sameNumber(summary[field], value)) errors.push(`${assessment.id}/${summary.routeRef} ${field} must reproduce as ${value}.`);
    }
    const verifiedExecutionCount = decisions.filter((decision) => decision.routeExecutionEvidence?.status === "verified").length;
    const routeDeviationCount = decisions.filter((decision) => decision.routeDeviation === true).length;
    const unresolvedAuthorityCount = decisions.filter((decision) => decision.authorityResolved !== true).length;
    for (const [field, value] of Object.entries({ pairCount: decisions.length, verifiedExecutionCount, routeDeviationCount, unresolvedAuthorityCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const dataSufficiency = policy && decisions.length >= policy.minimumPairCount && verifiedExecutionCount >= policy.minimumVerifiedExecutionCount ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const hasAlert = decisions.some((decision) => decision.routeDeviation || !decision.authorityResolved || decision.routeExecutionEvidence?.status !== "verified" || decision.routeOutcomeClass.endsWith("-outcome-failed"));
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : hasAlert ? "governance-required" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (assessment.interpretation !== "route-outcome-evidence-only-not-quality-causality-competence-or-authority") errors.push(`${assessment.id} interpretation must be route-outcome-evidence-only-not-quality-causality-competence-or-authority.`);
    if (!Array.isArray(assessment.governanceTriggerRefs)) errors.push(`${assessment.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("insufficient-data")) errors.push(`${assessment.id} insufficient route evidence requires an insufficient-data governance trigger.`);
  }

  for (const policy of escalationResolutionPolicies) {
    const escalationPolicy = ref(escalationPolicyIndex, policy.selectiveEscalationPolicyRef, "selective escalation policy", policy.id);
    const requirements = Array.isArray(policy.routeRequirements) ? policy.routeRequirements : [];
    const requirementRoutes = requirements.map((requirement) => requirement.routeRef);
    if (escalationPolicy && !sameSet(requirementRoutes, escalationPolicy.routes.map((route) => route.id))) errors.push(`${policy.id} routeRequirements must exactly cover selective escalation policy routes.`);
    if (new Set(requirementRoutes).size !== requirementRoutes.length) errors.push(`${policy.id} routeRequirements must not duplicate routeRef values.`);
    const requirementIndex = new Map();
    for (const requirement of requirements) {
      const route = escalationPolicy?.__routeIndex?.get(requirement.routeRef);
      if (!route) errors.push(`${policy.id} route requirement references missing escalation route: ${requirement.routeRef}`);
      else requirementIndex.set(requirement.routeRef, requirement);
      const dispositions = requirement.allowedDispositions || [];
      if (!Array.isArray(requirement.allowedDispositions) || dispositions.length === 0) errors.push(`${policy.id}/${requirement.routeRef} allowedDispositions must include at least one disposition.`);
      if (new Set(dispositions).size !== dispositions.length) errors.push(`${policy.id}/${requirement.routeRef} allowedDispositions must not contain duplicates.`);
      if (!Number.isInteger(requirement.responseTimeLimitMinutes) || requirement.responseTimeLimitMinutes < 1) errors.push(`${policy.id}/${requirement.routeRef} responseTimeLimitMinutes must be a positive integer.`);
      str(requirement, "availabilityRequirement", `${policy.id}/${requirement.routeRef}`);
      str(requirement, "timeoutAction", `${policy.id}/${requirement.routeRef}`);
      if (!Array.isArray(requirement.redirectRouteRefs)) errors.push(`${policy.id}/${requirement.routeRef} redirectRouteRefs must be an array.`);
      for (const redirectRef of requirement.redirectRouteRefs || []) {
        if (!escalationPolicy?.__routeIndex?.has(redirectRef)) errors.push(`${policy.id}/${requirement.routeRef} redirectRouteRefs references missing escalation route: ${redirectRef}`);
        if (redirectRef === requirement.routeRef) errors.push(`${policy.id}/${requirement.routeRef} redirectRouteRefs must not include the source route.`);
      }
    }
    if (!Number.isInteger(policy.minimumResolutionCount) || policy.minimumResolutionCount < 2) errors.push(`${policy.id} minimumResolutionCount must be at least 2.`);
    if (!Number.isInteger(policy.minimumVerifiedResolutionCount) || policy.minimumVerifiedResolutionCount < 2) errors.push(`${policy.id} minimumVerifiedResolutionCount must be at least 2.`);
    if (policy.timelinessInterpretation !== "response-time-and-availability-evidence-only-not-quality-competence-or-authority") errors.push(`${policy.id} timelinessInterpretation must be response-time-and-availability-evidence-only-not-quality-competence-or-authority.`);
    if (!Array.isArray(policy.reviewedBy) || policy.reviewedBy.length === 0) errors.push(`${policy.id} reviewedBy must include at least one accountable reviewer.`);
    if (!Array.isArray(policy.governanceTriggerRefs)) errors.push(`${policy.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((policy.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", policy.id)?.triggerType));
    if (policy.status !== "active" && !triggerTypes.has("resolution-policy-unreviewed")) errors.push(`${policy.id} non-active resolution policy requires a resolution-policy-unreviewed governance trigger.`);
    if (policy.status === "active" && escalationPolicy?.status !== "active") errors.push(`${policy.id} active resolution policy requires an active selective escalation policy.`);
    policy.__escalationPolicy = escalationPolicy;
    policy.__requirementIndex = requirementIndex;
  }

  const resolutionKeys = new Set();
  for (const resolution of escalationResolutions) {
    for (const field of ["selectiveEscalationDecisionRef", "policyRef", "routeRef", "disposition", "startedAt", "resolvedAt", "availabilityObserved", "observedOutcome", "status"]) str(resolution, field, resolution.id);
    const decision = ref(escalationDecisionIndex, resolution.selectiveEscalationDecisionRef, "selective escalation decision", resolution.id);
    const policy = ref(resolutionPolicyIndex, resolution.policyRef, "escalation resolution policy", resolution.id);
    if (!decision || !policy) continue;
    const key = `${decision.id}/${policy.id}`;
    if (resolutionKeys.has(key)) errors.push(`${resolution.id} duplicates escalation resolution ${key}.`);
    resolutionKeys.add(key);
    if (policy.selectiveEscalationPolicyRef !== decision.policyRef) errors.push(`${resolution.id} policyRef must govern the decision selective escalation policy.`);
    if (resolution.routeRef !== decision.actualRouteRef) errors.push(`${resolution.id} routeRef must equal the referenced decision actualRouteRef.`);
    const requirement = policy.__requirementIndex?.get(resolution.routeRef);
    if (!requirement) errors.push(`${resolution.id} routeRef has no resolution requirement.`);
    if (requirement && !(requirement.allowedDispositions || []).includes(resolution.disposition)) errors.push(`${resolution.id} disposition is not allowed by its route requirement.`);
    if (requirement && resolution.responseTimeLimitMinutes !== requirement.responseTimeLimitMinutes) errors.push(`${resolution.id} responseTimeLimitMinutes must match its route requirement.`);
    const started = Date.parse(resolution.startedAt);
    const resolved = Date.parse(resolution.resolvedAt);
    if (!Number.isFinite(started) || !Number.isFinite(resolved)) errors.push(`${resolution.id} startedAt and resolvedAt must be valid date-time values.`);
    else {
      if (resolved < started) errors.push(`${resolution.id} resolvedAt must not precede startedAt.`);
      const expectedElapsed = Math.round((resolved - started) / 60000);
      if (resolution.elapsedMinutes !== expectedElapsed) errors.push(`${resolution.id} elapsedMinutes must reproduce as ${expectedElapsed}.`);
      const expectedWithin = expectedElapsed <= resolution.responseTimeLimitMinutes;
      if (resolution.withinResponseTime !== expectedWithin) errors.push(`${resolution.id} withinResponseTime must reproduce as ${expectedWithin}.`);
    }
    if (resolution.disposition === "timed-out" && resolution.withinResponseTime !== false) errors.push(`${resolution.id} timed-out disposition requires withinResponseTime false.`);
    if (resolution.disposition === "redirected") {
      if (!resolution.redirectedRouteRef) errors.push(`${resolution.id} redirected disposition requires redirectedRouteRef.`);
      else if (!(requirement?.redirectRouteRefs || []).includes(resolution.redirectedRouteRef)) errors.push(`${resolution.id} redirectedRouteRef is not allowed by its route requirement.`);
    } else if (resolution.redirectedRouteRef) errors.push(`${resolution.id} non-redirected disposition must not include redirectedRouteRef.`);
    if (resolution.observedOutcome !== decision.observedOutcome) errors.push(`${resolution.id} observedOutcome must equal the referenced decision observedOutcome.`);
    const evidence = resolution.resolutionEvidence;
    if (!evidence || typeof evidence !== "object") errors.push(`${resolution.id} must include resolutionEvidence.`);
    else {
      for (const field of ["sourceArtifact", "resolvedBy", "resultSummary", "status"]) str(evidence, field, `${resolution.id} resolutionEvidence`);
      if (!Array.isArray(evidence.verifiedBy) || evidence.verifiedBy.length === 0) errors.push(`${resolution.id} resolutionEvidence verifiedBy must include at least one verifier.`);
    }
    if (!Array.isArray(resolution.governanceTriggerRefs)) errors.push(`${resolution.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((resolution.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", resolution.id)?.triggerType));
    if (resolution.withinResponseTime === false && !triggerTypes.has("resolution-time-exceeded")) errors.push(`${resolution.id} late resolution requires a resolution-time-exceeded governance trigger.`);
    if (resolution.disposition === "timed-out" && !triggerTypes.has("resolution-timeout")) errors.push(`${resolution.id} timed-out resolution requires a resolution-timeout governance trigger.`);
    if (resolution.availabilityObserved !== "available" && !triggerTypes.has("resolution-availability-unmet")) errors.push(`${resolution.id} unmet availability requires a resolution-availability-unmet governance trigger.`);
    if (evidence?.status !== "verified" && !triggerTypes.has("resolution-evidence-unverified")) errors.push(`${resolution.id} non-verified resolution evidence requires a resolution-evidence-unverified governance trigger.`);
    if (resolution.disposition === "redirected" && resolution.redirectedRouteRef && !(requirement?.redirectRouteRefs || []).includes(resolution.redirectedRouteRef) && !triggerTypes.has("resolution-redirect-invalid")) errors.push(`${resolution.id} invalid redirect requires a resolution-redirect-invalid governance trigger.`);
  }

  for (const assessment of escalationResolutionAssessments) {
    for (const field of ["title", "policyRef", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const policy = ref(resolutionPolicyIndex, assessment.policyRef, "escalation resolution policy", assessment.id);
    const resolutions = Array.isArray(assessment.resolutionRefs)
      ? assessment.resolutionRefs.map((id) => ref(resolutionIndex, id, "escalation resolution", assessment.id)).filter(Boolean)
      : [];
    if (resolutions.length === 0) errors.push(`${assessment.id} resolutionRefs must include at least one record.`);
    if (new Set(assessment.resolutionRefs || []).size !== (assessment.resolutionRefs || []).length) errors.push(`${assessment.id} resolutionRefs must not contain duplicates.`);
    for (const resolution of resolutions) if (resolution.policyRef !== assessment.policyRef) errors.push(`${assessment.id} resolution ${resolution.id} must use policy ${assessment.policyRef}.`);
    const counts = {
      accepted: resolutions.filter((item) => item.disposition === "accepted").length,
      rejected: resolutions.filter((item) => item.disposition === "rejected").length,
      redirected: resolutions.filter((item) => item.disposition === "redirected").length,
      timedOut: resolutions.filter((item) => item.disposition === "timed-out").length
    };
    for (const [field, value] of Object.entries(counts)) if (!sameNumber(assessment.dispositionCounts?.[field], value)) errors.push(`${assessment.id} dispositionCounts.${field} must reproduce as ${value}.`);
    const timelyCount = resolutions.filter((item) => item.withinResponseTime === true).length;
    const lateCount = resolutions.length - timelyCount;
    const verifiedResolutionCount = resolutions.filter((item) => item.resolutionEvidence?.status === "verified").length;
    const unavailableCount = resolutions.filter((item) => item.availabilityObserved !== "available").length;
    for (const [field, value] of Object.entries({ resolutionCount: resolutions.length, timelyCount, lateCount, verifiedResolutionCount, unavailableCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const dataSufficiency = policy && resolutions.length >= policy.minimumResolutionCount && verifiedResolutionCount >= policy.minimumVerifiedResolutionCount ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const hasAlert = resolutions.some((item) => !item.withinResponseTime || item.disposition === "timed-out" || item.availabilityObserved !== "available" || item.resolutionEvidence?.status !== "verified");
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : hasAlert ? "governance-required" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (assessment.interpretation !== "resolution-and-timeliness-evidence-only-not-quality-causality-competence-or-authority") errors.push(`${assessment.id} interpretation must be resolution-and-timeliness-evidence-only-not-quality-causality-competence-or-authority.`);
    if (!Array.isArray(assessment.governanceTriggerRefs)) errors.push(`${assessment.id} governanceTriggerRefs must be an array.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("insufficient-data")) errors.push(`${assessment.id} insufficient resolution evidence requires an insufficient-data governance trigger.`);
  }

  for (const policy of reviewerDisagreementPolicies) {
    const resolutionPolicy = ref(resolutionPolicyIndex, policy.escalationResolutionPolicyRef, "escalation resolution policy", policy.id);
    for (const field of ["detectionRule", "aggregationBoundary", "status"]) str(policy, field, policy.id);
    if (!Number.isInteger(policy.minimumIndependentJudgments) || policy.minimumIndependentJudgments < 2) errors.push(`${policy.id} minimumIndependentJudgments must be at least 2.`);
    if (!Number.isInteger(policy.minimumDisagreementCaseCount) || policy.minimumDisagreementCaseCount < 2) errors.push(`${policy.id} minimumDisagreementCaseCount must be at least 2.`);
    if (!Array.isArray(policy.independenceDimensions) || policy.independenceDimensions.length === 0) errors.push(`${policy.id} independenceDimensions must include at least one dimension.`);
    if (!Array.isArray(policy.adjudicationModes) || policy.adjudicationModes.length === 0) errors.push(`${policy.id} adjudicationModes must include at least one mode.`);
    if (!["preserve-exact-verdict-rationale-evidence-and-confidence", "preserve-exact-verdict-rationale-evidence-confidence-and-separate-operational-event-from-protected-decision-state"].includes(policy.detectionRule)) errors.push(`${policy.id} detectionRule must preserve exact verdict, rationale, evidence, and confidence.`);
    if (policy.aggregationBoundary !== "no-automatic-majority-seniority-agreement-or-confidence-authority") errors.push(`${policy.id} aggregationBoundary must forbid automatic majority, seniority, agreement, or confidence authority.`);
    if (!Array.isArray(policy.reviewedBy) || policy.reviewedBy.length === 0) errors.push(`${policy.id} reviewedBy must include at least one accountable reviewer.`);
    const triggerTypes = new Set((policy.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", policy.id)?.triggerType));
    if (policy.status !== "active" && !triggerTypes.has("reviewer-policy-unreviewed")) errors.push(`${policy.id} non-active reviewer disagreement policy requires a reviewer-policy-unreviewed governance trigger.`);
    if (policy.status === "active" && resolutionPolicy?.status !== "active") errors.push(`${policy.id} active reviewer disagreement policy requires an active escalation resolution policy.`);
  }

  for (const judgment of reviewerJudgments) {
    for (const field of ["escalationResolutionRef", "policyRef", "reviewerRef", "reviewerRole", "independenceGroup", "verdict", "rationale", "submittedAt", "evidenceStatus", "status"]) str(judgment, field, judgment.id);
    const resolution = ref(resolutionIndex, judgment.escalationResolutionRef, "escalation resolution", judgment.id);
    const policy = ref(reviewerPolicyIndex, judgment.policyRef, "reviewer disagreement policy", judgment.id);
    if (resolution && policy) {
      const resolutionPolicy = resolutionPolicyIndex.get(resolution.policyRef);
      if (policy.escalationResolutionPolicyRef !== resolutionPolicy?.id) errors.push(`${judgment.id} policyRef must govern the referenced escalation resolution policy.`);
    }
    if (!Array.isArray(judgment.evidenceRefs) || judgment.evidenceRefs.length === 0) errors.push(`${judgment.id} evidenceRefs must include at least one item.`);
    score(judgment.confidence, "confidence", judgment.id);
    if (!Number.isFinite(Date.parse(judgment.submittedAt))) errors.push(`${judgment.id} submittedAt must be a valid date-time.`);
    const triggerTypes = new Set((judgment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", judgment.id)?.triggerType));
    if (judgment.evidenceStatus !== "verified" && !triggerTypes.has("reviewer-evidence-unverified")) errors.push(`${judgment.id} non-verified reviewer evidence requires a reviewer-evidence-unverified governance trigger.`);
    if (judgment.overrideRef) {
      const outcome = ref(adjudicationIndex, judgment.overrideRef, "adjudication outcome", judgment.id);
      const disagreement = outcome && reviewerDisagreementIndex.get(outcome.disagreementRef);
      if (disagreement && !(disagreement.judgmentRefs || []).includes(judgment.id)) errors.push(`${judgment.id} overrideRef must resolve to an adjudication of that judgment.`);
    }
  }

  for (const disagreement of reviewerDisagreements) {
    for (const field of ["policyRef", "escalationResolutionRef", "disagreementStatus", "status"]) str(disagreement, field, disagreement.id);
    const policy = ref(reviewerPolicyIndex, disagreement.policyRef, "reviewer disagreement policy", disagreement.id);
    ref(resolutionIndex, disagreement.escalationResolutionRef, "escalation resolution", disagreement.id);
    const judgments = Array.isArray(disagreement.judgmentRefs) ? disagreement.judgmentRefs.map((id) => ref(reviewerJudgmentIndex, id, "reviewer judgment", disagreement.id)).filter(Boolean) : [];
    if (judgments.length < (policy?.minimumIndependentJudgments || 2)) errors.push(`${disagreement.id} judgmentRefs must satisfy minimumIndependentJudgments.`);
    if (new Set(disagreement.judgmentRefs || []).size !== (disagreement.judgmentRefs || []).length) errors.push(`${disagreement.id} judgmentRefs must not contain duplicates.`);
    for (const judgment of judgments) {
      if (judgment.policyRef !== disagreement.policyRef) errors.push(`${disagreement.id} judgment ${judgment.id} must use policy ${disagreement.policyRef}.`);
      if (judgment.escalationResolutionRef !== disagreement.escalationResolutionRef) errors.push(`${disagreement.id} judgment ${judgment.id} must review resolution ${disagreement.escalationResolutionRef}.`);
    }
    const uniqueReviewers = new Set(judgments.map((item) => item.reviewerRef));
    if (uniqueReviewers.size !== judgments.length) errors.push(`${disagreement.id} must not reuse a reviewerRef within one disagreement case.`);
    const independenceGroups = new Set(judgments.map((item) => item.independenceGroup));
    const triggerTypes = new Set((disagreement.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", disagreement.id)?.triggerType));
    if (independenceGroups.size < (policy?.minimumIndependentJudgments || 2) && !triggerTypes.has("reviewer-independence-unresolved")) errors.push(`${disagreement.id} unresolved reviewer independence requires a reviewer-independence-unresolved governance trigger.`);
    const verdicts = new Set(judgments.map((item) => item.verdict));
    if (verdicts.size > 1 && !(disagreement.disagreementDimensions || []).includes("verdict")) errors.push(`${disagreement.id} disagreementDimensions must include verdict when verdicts differ.`);
    const rationales = new Set(judgments.map((item) => item.rationale));
    if (rationales.size > 1 && !(disagreement.disagreementDimensions || []).includes("rationale")) errors.push(`${disagreement.id} disagreementDimensions must include rationale when rationales differ.`);
    const grouped = new Map();
    for (const judgment of judgments) grouped.set(judgment.verdict, [...(grouped.get(judgment.verdict) || []), judgment.id]);
    const verdictGroups = disagreement.verdictGroups || [];
    if (!sameSet(verdictGroups.map((item) => item.verdict), [...grouped.keys()])) errors.push(`${disagreement.id} verdictGroups must exactly reproduce reviewer verdicts.`);
    for (const group of verdictGroups) if (!sameSet(group.judgmentRefs, grouped.get(group.verdict) || [])) errors.push(`${disagreement.id}/${group.verdict} judgmentRefs must reproduce verdict membership.`);
    if (!Array.isArray(disagreement.focalIssues) || disagreement.focalIssues.length === 0) errors.push(`${disagreement.id} focalIssues must include at least one issue.`);
    if (disagreement.dissentPreserved !== true && !triggerTypes.has("dissent-not-preserved")) errors.push(`${disagreement.id} unpreserved dissent requires a dissent-not-preserved governance trigger.`);
    if (disagreement.disagreementStatus === "adjudicated") {
      if (!disagreement.adjudicationOutcomeRef) errors.push(`${disagreement.id} adjudicated disagreement requires adjudicationOutcomeRef.`);
      else ref(adjudicationIndex, disagreement.adjudicationOutcomeRef, "adjudication outcome", disagreement.id);
    } else if (disagreement.adjudicationOutcomeRef) errors.push(`${disagreement.id} non-adjudicated disagreement must not include adjudicationOutcomeRef.`);
    if (disagreement.disagreementStatus === "open" && !triggerTypes.has("reviewer-disagreement-unresolved")) errors.push(`${disagreement.id} open disagreement requires a reviewer-disagreement-unresolved governance trigger.`);
  }

  for (const outcome of adjudicationOutcomes) {
    for (const field of ["disagreementRef", "adjudicatorRef", "adjudicatorAuthorityRef", "adjudicatorIndependenceGroup", "adjudicationMode", "finalDisposition", "rationale", "evidenceStatus", "status"]) str(outcome, field, outcome.id);
    const disagreement = ref(reviewerDisagreementIndex, outcome.disagreementRef, "reviewer disagreement", outcome.id);
    const policy = disagreement && reviewerPolicyIndex.get(disagreement.policyRef);
    if (disagreement?.adjudicationOutcomeRef !== outcome.id) errors.push(`${outcome.id} disagreement must point back to this adjudication outcome.`);
    if (policy && !(policy.adjudicationModes || []).includes(outcome.adjudicationMode)) errors.push(`${outcome.id} adjudicationMode is not allowed by policy ${policy.id}.`);
    if (outcome.adjudicationMode === "select-judgment" && !outcome.selectedJudgmentRef) errors.push(`${outcome.id} select-judgment mode requires selectedJudgmentRef.`);
    if (outcome.selectedJudgmentRef && !(disagreement?.judgmentRefs || []).includes(outcome.selectedJudgmentRef)) errors.push(`${outcome.id} selectedJudgmentRef must belong to the disagreement.`);
    for (const judgmentRef of outcome.supersededJudgmentRefs || []) if (!(disagreement?.judgmentRefs || []).includes(judgmentRef)) errors.push(`${outcome.id} supersededJudgmentRefs must belong to the disagreement.`);
    if (outcome.originalJudgmentsPreserved !== true) errors.push(`${outcome.id} originalJudgmentsPreserved must be true.`);
    if (!Array.isArray(outcome.evidenceRefs) || outcome.evidenceRefs.length === 0) errors.push(`${outcome.id} evidenceRefs must include at least one item.`);
    const sourceGroups = new Set((disagreement?.judgmentRefs || []).map((id) => reviewerJudgmentIndex.get(id)?.independenceGroup));
    const triggerTypes = new Set((outcome.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", outcome.id)?.triggerType));
    if (sourceGroups.has(outcome.adjudicatorIndependenceGroup) && !triggerTypes.has("adjudicator-conflict")) errors.push(`${outcome.id} adjudicator conflict requires an adjudicator-conflict governance trigger.`);
    if (outcome.evidenceStatus !== "verified" && !triggerTypes.has("adjudication-evidence-unverified")) errors.push(`${outcome.id} non-verified adjudication evidence requires an adjudication-evidence-unverified governance trigger.`);
  }

  for (const assessment of reviewerDisagreementAssessments) {
    for (const field of ["title", "policyRef", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const policy = ref(reviewerPolicyIndex, assessment.policyRef, "reviewer disagreement policy", assessment.id);
    const disagreements = Array.isArray(assessment.disagreementRefs) ? assessment.disagreementRefs.map((id) => ref(reviewerDisagreementIndex, id, "reviewer disagreement", assessment.id)).filter(Boolean) : [];
    if (disagreements.length === 0) errors.push(`${assessment.id} disagreementRefs must include at least one record.`);
    for (const disagreement of disagreements) if (disagreement.policyRef !== assessment.policyRef) errors.push(`${assessment.id} disagreement ${disagreement.id} must use policy ${assessment.policyRef}.`);
    const independentCaseCount = disagreements.filter((item) => new Set((item.judgmentRefs || []).map((id) => reviewerJudgmentIndex.get(id)?.independenceGroup)).size >= (policy?.minimumIndependentJudgments || 2)).length;
    const adjudicatedCount = disagreements.filter((item) => item.disagreementStatus === "adjudicated").length;
    const unresolvedCount = disagreements.filter((item) => item.disagreementStatus === "open").length;
    const preservedDissentCount = disagreements.filter((item) => item.dissentPreserved === true).length;
    const verifiedAdjudicationCount = disagreements.filter((item) => adjudicationIndex.get(item.adjudicationOutcomeRef)?.evidenceStatus === "verified").length;
    for (const [field, value] of Object.entries({ disagreementCaseCount: disagreements.length, independentCaseCount, adjudicatedCount, unresolvedCount, preservedDissentCount, verifiedAdjudicationCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const dataSufficiency = policy && disagreements.length >= policy.minimumDisagreementCaseCount ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const hasAlert = unresolvedCount > 0 || preservedDissentCount < disagreements.length || independentCaseCount < disagreements.length || verifiedAdjudicationCount < adjudicatedCount;
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : hasAlert ? "governance-required" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (assessment.interpretation !== "disagreement-and-adjudication-evidence-only-not-truth-quality-competence-or-authority") errors.push(`${assessment.id} interpretation must remain disagreement-and-adjudication-evidence-only-not-truth-quality-competence-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("insufficient-data")) errors.push(`${assessment.id} insufficient disagreement evidence requires an insufficient-data governance trigger.`);
  }

  const snapshotsByPolicy = new Map();
  for (const snapshot of routePolicySnapshots) {
    for (const field of ["policyRef", "snapshotRole", "capturedAt", "effectiveFrom", "historyBoundary", "status"]) str(snapshot, field, snapshot.id);
    const policy = ref(escalationPolicyIndex, snapshot.policyRef, "selective escalation policy", snapshot.id);
    if (!Number.isInteger(snapshot.version) || snapshot.version < 1) errors.push(`${snapshot.id} version must be a positive integer.`);
    if (!Number.isFinite(Date.parse(snapshot.capturedAt)) || !Number.isFinite(Date.parse(snapshot.effectiveFrom))) errors.push(`${snapshot.id} capturedAt and effectiveFrom must be valid date-time values.`);
    if (snapshot.effectiveTo && Date.parse(snapshot.effectiveTo) <= Date.parse(snapshot.effectiveFrom)) errors.push(`${snapshot.id} effectiveTo must follow effectiveFrom.`);
    if (snapshot.snapshotRole === "baseline" && !snapshot.effectiveTo) errors.push(`${snapshot.id} baseline snapshot requires effectiveTo.`);
    if (snapshot.snapshotRole === "current" && snapshot.effectiveTo) errors.push(`${snapshot.id} current snapshot must not include effectiveTo.`);
    if (snapshot.historyBoundary !== "immutable-snapshot-not-retroactive-policy-authority") errors.push(`${snapshot.id} historyBoundary must preserve immutable history without retroactive authority.`);
    if (!Array.isArray(snapshot.approvedBy) || snapshot.approvedBy.length === 0) errors.push(`${snapshot.id} approvedBy must include at least one authority.`);
    if (!Array.isArray(snapshot.evidenceRefs) || snapshot.evidenceRefs.length === 0) errors.push(`${snapshot.id} evidenceRefs must include at least one item.`);
    const triggerTypes = new Set((snapshot.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", snapshot.id)?.triggerType));
    if ((snapshot.status === "draft" || snapshot.approvedBy?.length === 0) && !triggerTypes.has("policy-snapshot-unapproved")) errors.push(`${snapshot.id} unapproved snapshot requires a policy-snapshot-unapproved governance trigger.`);
    const routeRefs = (snapshot.routes || []).map((item) => item.routeRef);
    const ruleRefs = (snapshot.routingRules || []).map((item) => item.ruleRef);
    if (new Set(routeRefs).size !== routeRefs.length) errors.push(`${snapshot.id} routes must not duplicate routeRef values.`);
    if (new Set(ruleRefs).size !== ruleRefs.length) errors.push(`${snapshot.id} routingRules must not duplicate ruleRef values.`);
    for (const rule of snapshot.routingRules || []) if (!routeRefs.includes(rule.routeRef)) errors.push(`${snapshot.id}/${rule.ruleRef} references missing snapshot route ${rule.routeRef}.`);
    snapshotsByPolicy.set(snapshot.policyRef, [...(snapshotsByPolicy.get(snapshot.policyRef) || []), snapshot]);
    if (snapshot.snapshotRole === "current" && policy) {
      if (!sameSet(routeRefs, policy.routes.map((item) => item.id))) errors.push(`${snapshot.id} current routes must exactly match the referenced policy routes.`);
      if (!sameSet(ruleRefs, policy.routingRules.map((item) => item.id))) errors.push(`${snapshot.id} current routingRules must exactly match the referenced policy rules.`);
      for (const source of policy.routes) {
        const item = (snapshot.routes || []).find((route) => route.routeRef === source.id);
        if (!item) continue;
        for (const [field, expected] of Object.entries({ routeType: source.routeType, authorityRef: source.authorityRef, capabilityRequirement: source.capabilityRequirement, responseTimeBoundary: source.responseTimeBoundary, status: source.status })) if (!sameValue(item[field], expected)) errors.push(`${snapshot.id}/${source.id} ${field} must match the current policy.`);
        if (!sameValue(item.evidenceRequired, source.evidenceRequired)) errors.push(`${snapshot.id}/${source.id} evidenceRequired must match the current policy.`);
      }
      for (const source of policy.routingRules) {
        const item = (snapshot.routingRules || []).find((rule) => rule.ruleRef === source.id);
        if (!item) continue;
        for (const field of ["lowerInclusive", "upperExclusive", "routeRef"]) if (!sameValue(item[field], source[field])) errors.push(`${snapshot.id}/${source.id} ${field} must match the current policy.`);
      }
    }
  }
  for (const [policyRef, snapshots] of snapshotsByPolicy) {
    if (snapshots.filter((item) => item.snapshotRole === "current").length !== 1) errors.push(`${policyRef} must have exactly one current route-policy snapshot.`);
    const versions = snapshots.map((item) => item.version);
    if (new Set(versions).size !== versions.length) errors.push(`${policyRef} route-policy snapshot versions must be unique.`);
  }

  function deriveChanges(previous, current) {
    const changes = [];
    const previousRoutes = new Map((previous?.routes || []).map((item) => [item.routeRef, item]));
    const currentRoutes = new Map((current?.routes || []).map((item) => [item.routeRef, item]));
    for (const routeRef of new Set([...previousRoutes.keys(), ...currentRoutes.keys()])) {
      const before = previousRoutes.get(routeRef);
      const after = currentRoutes.get(routeRef);
      if (!before || !after || before.routeType !== after.routeType || before.status !== after.status) changes.push({ dimension: "route", routeRef, previousValue: before || null, currentValue: after || null });
      if (!before || !after) continue;
      for (const [dimension, field] of [["authority", "authorityRef"], ["capability", "capabilityRequirement"], ["evidence", "evidenceRequired"], ["response-time", "responseTimeBoundary"]]) {
        if (!sameValue(before[field], after[field])) changes.push({ dimension, routeRef, previousValue: before[field], currentValue: after[field] });
      }
    }
    const previousRules = new Map((previous?.routingRules || []).map((item) => [item.ruleRef, item]));
    const currentRules = new Map((current?.routingRules || []).map((item) => [item.ruleRef, item]));
    for (const ruleRef of new Set([...previousRules.keys(), ...currentRules.keys()])) {
      const before = previousRules.get(ruleRef);
      const after = currentRules.get(ruleRef);
      if (!sameValue(before, after)) changes.push({ dimension: "threshold", routeRef: after?.routeRef || before?.routeRef, previousValue: before || null, currentValue: after || null });
    }
    return changes;
  }

  for (const change of routePolicyChanges) {
    for (const field of ["previousSnapshotRef", "currentSnapshotRef", "effectiveAt", "authorizedBy", "status"]) str(change, field, change.id);
    const previous = ref(routePolicySnapshotIndex, change.previousSnapshotRef, "previous route-policy snapshot", change.id);
    const current = ref(routePolicySnapshotIndex, change.currentSnapshotRef, "current route-policy snapshot", change.id);
    if (previous && current) {
      if (previous.policyRef !== current.policyRef) errors.push(`${change.id} snapshots must reference the same policy.`);
      if (current.version <= previous.version) errors.push(`${change.id} current snapshot version must be greater than previous snapshot version.`);
      if (change.effectiveAt !== current.effectiveFrom || previous.effectiveTo !== current.effectiveFrom) errors.push(`${change.id} effectiveAt and snapshot boundaries must form a continuous transition.`);
      const expected = deriveChanges(previous, current);
      if (!sameSet(change.changedDimensions, expected.map((item) => item.dimension))) errors.push(`${change.id} changedDimensions must reproduce snapshot differences.`);
      if ((change.changes || []).length !== expected.length) errors.push(`${change.id} changes must reproduce every snapshot difference.`);
      for (const item of change.changes || []) {
        const match = expected.find((candidate) => candidate.dimension === item.dimension && candidate.routeRef === item.routeRef && sameValue(candidate.previousValue, item.previousValue) && sameValue(candidate.currentValue, item.currentValue));
        if (!match) errors.push(`${change.id} change detail ${item.dimension}/${item.routeRef} does not reproduce snapshot values.`);
        str(item, "rationale", `${change.id}/${item.dimension}/${item.routeRef}`);
      }
    }
    if (change.automaticMutation !== false) errors.push(`${change.id} automaticMutation must be false.`);
    if (!Array.isArray(change.evidenceRefs) || change.evidenceRefs.length === 0) errors.push(`${change.id} evidenceRefs must include at least one item.`);
    const triggerTypes = new Set((change.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", change.id)?.triggerType));
    if (change.status !== "approved" && !triggerTypes.has("policy-change-unauthorized")) errors.push(`${change.id} non-approved change requires a policy-change-unauthorized governance trigger.`);
  }

  for (const assessment of routePolicyDriftAssessments) {
    for (const field of ["changeRef", "assessedAt", "interpretation", "status"]) str(assessment, field, assessment.id);
    const change = ref(routePolicyChangeIndex, assessment.changeRef, "route-policy change", assessment.id);
    const impacts = assessment.decisionImpacts || [];
    if (!Array.isArray(assessment.decisionImpacts) || impacts.length === 0) errors.push(`${assessment.id} decisionImpacts must include at least one decision.`);
    for (const impact of impacts) {
      const decision = ref(escalationDecisionIndex, impact.decisionRef, "selective escalation decision", assessment.id);
      const previous = ref(routePolicySnapshotIndex, impact.originalSnapshotRef, "original route-policy snapshot", assessment.id);
      const current = ref(routePolicySnapshotIndex, impact.currentSnapshotRef, "current route-policy snapshot", assessment.id);
      if (change && (impact.originalSnapshotRef !== change.previousSnapshotRef || impact.currentSnapshotRef !== change.currentSnapshotRef)) errors.push(`${assessment.id}/${impact.decisionRef} snapshot refs must match the policy change.`);
      const expectedDimensions = (change?.changes || []).filter((item) => !decision || item.routeRef === decision.actualRouteRef).map((item) => item.dimension);
      if (!sameSet(impact.affectedDimensions, expectedDimensions)) errors.push(`${assessment.id}/${impact.decisionRef} affectedDimensions must reproduce changes to the decision route.`);
      if (impact.materiality === "material" && (impact.staleness !== "stale" || impact.revalidationRequired !== true)) errors.push(`${assessment.id}/${impact.decisionRef} material impact must be stale and require revalidation.`);
      if (impact.materiality === "non-material" && (impact.staleness !== "current" || impact.revalidationRequired !== false)) errors.push(`${assessment.id}/${impact.decisionRef} non-material impact must remain current without revalidation.`);
      if (previous && decision && previous.policyRef !== decision.policyRef) errors.push(`${assessment.id}/${impact.decisionRef} original snapshot must govern the decision policy.`);
      if (current && decision && current.policyRef !== decision.policyRef) errors.push(`${assessment.id}/${impact.decisionRef} current snapshot must govern the decision policy.`);
      str(impact, "rationale", `${assessment.id}/${impact.decisionRef}`);
    }
    const materialImpactCount = impacts.filter((item) => item.materiality === "material").length;
    const staleDecisionCount = impacts.filter((item) => item.staleness === "stale").length;
    for (const [field, value] of Object.entries({ impactCount: impacts.length, materialImpactCount, staleDecisionCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    if (assessment.interpretation !== "policy-drift-evidence-only-not-quality-safety-causality-or-authority") errors.push(`${assessment.id} interpretation must remain policy-drift-evidence-only-not-quality-safety-causality-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (materialImpactCount > 0 && !triggerTypes.has("policy-decision-stale")) errors.push(`${assessment.id} stale material decisions require a policy-decision-stale governance trigger.`);
  }

  for (const outcome of routePolicyRevalidationOutcomes) {
    for (const field of ["driftAssessmentRef", "decisionRef", "previousSnapshotRef", "currentSnapshotRef", "reviewedAt", "reviewerRef", "outcome", "resultingRouteRef", "resultingAuthorityRef", "rationale", "evidenceStatus", "status"]) str(outcome, field, outcome.id);
    const assessment = ref(routePolicyDriftIndex, outcome.driftAssessmentRef, "route-policy drift assessment", outcome.id);
    const decision = ref(escalationDecisionIndex, outcome.decisionRef, "selective escalation decision", outcome.id);
    const impact = assessment?.decisionImpacts?.find((item) => item.decisionRef === outcome.decisionRef);
    if (!impact) errors.push(`${outcome.id} must resolve a decision impact in its drift assessment.`);
    if (impact && (outcome.previousSnapshotRef !== impact.originalSnapshotRef || outcome.currentSnapshotRef !== impact.currentSnapshotRef)) errors.push(`${outcome.id} snapshot refs must match the decision impact.`);
    const current = ref(routePolicySnapshotIndex, outcome.currentSnapshotRef, "current route-policy snapshot", outcome.id);
    const route = current?.routes?.find((item) => item.routeRef === outcome.resultingRouteRef);
    if (!route) errors.push(`${outcome.id} resultingRouteRef must resolve in the current snapshot.`);
    else if (outcome.resultingAuthorityRef !== route.authorityRef) errors.push(`${outcome.id} resultingAuthorityRef must match the current snapshot route authority.`);
    if (outcome.priorDecisionPreserved !== true) errors.push(`${outcome.id} priorDecisionPreserved must be true.`);
    if (!Array.isArray(outcome.evidenceRefs) || outcome.evidenceRefs.length === 0) errors.push(`${outcome.id} evidenceRefs must include at least one item.`);
    const triggerTypes = new Set((outcome.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", outcome.id)?.triggerType));
    if (outcome.outcome === "unresolved" && !triggerTypes.has("revalidation-unresolved")) errors.push(`${outcome.id} unresolved revalidation requires a revalidation-unresolved governance trigger.`);
    if (outcome.evidenceStatus !== "verified" && !triggerTypes.has("revalidation-evidence-unverified")) errors.push(`${outcome.id} non-verified revalidation evidence requires a revalidation-evidence-unverified governance trigger.`);
    if (decision && current && current.policyRef !== decision.policyRef) errors.push(`${outcome.id} current snapshot must govern the decision policy.`);
  }

  for (const assessment of routePolicyRevalidationAssessments) {
    for (const field of ["title", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const drift = (assessment.driftAssessmentRefs || []).map((id) => ref(routePolicyDriftIndex, id, "route-policy drift assessment", assessment.id)).filter(Boolean);
    const outcomes = (assessment.outcomeRefs || []).map((id) => ref(routePolicyRevalidationIndex, id, "route-policy revalidation outcome", assessment.id)).filter(Boolean);
    const requiredImpacts = drift.flatMap((item) => item.decisionImpacts || []).filter((item) => item.revalidationRequired === true);
    const requiredCount = requiredImpacts.length;
    const completedCount = outcomes.filter((item) => item.outcome !== "unresolved").length;
    const verifiedCount = outcomes.filter((item) => item.evidenceStatus === "verified").length;
    const unresolvedCount = outcomes.filter((item) => item.outcome === "unresolved").length;
    const outcomeDecisionRefs = new Set(outcomes.map((item) => item.decisionRef));
    const staleWithoutOutcomeCount = requiredImpacts.filter((item) => !outcomeDecisionRefs.has(item.decisionRef)).length;
    for (const [field, value] of Object.entries({ requiredCount, completedCount, verifiedCount, unresolvedCount, staleWithoutOutcomeCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    if (!Number.isInteger(assessment.minimumRevalidationCount) || assessment.minimumRevalidationCount < 2) errors.push(`${assessment.id} minimumRevalidationCount must be at least 2.`);
    const dataSufficiency = completedCount >= assessment.minimumRevalidationCount && verifiedCount >= assessment.minimumRevalidationCount ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : unresolvedCount > 0 || staleWithoutOutcomeCount > 0 ? "governance-required" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (!Array.isArray(assessment.reviewedBy) || assessment.reviewedBy.length === 0) errors.push(`${assessment.id} reviewedBy must include at least one authority.`);
    if (assessment.interpretation !== "revalidation-evidence-only-not-current-quality-safety-causality-or-authority") errors.push(`${assessment.id} interpretation must remain revalidation-evidence-only-not-current-quality-safety-causality-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("insufficient-data")) errors.push(`${assessment.id} insufficient revalidation evidence requires an insufficient-data governance trigger.`);
    if (staleWithoutOutcomeCount > 0 && !triggerTypes.has("revalidation-missing")) errors.push(`${assessment.id} stale decisions without outcomes require a revalidation-missing governance trigger.`);
  }

  for (const observation of adjudicationFeedbackObservations) {
    for (const field of ["observedAmbiguity", "affectedPolicyRef", "evidenceStatus", "feedbackBoundary", "status"]) str(observation, field, observation.id);
    const policy = ref(reviewerPolicyIndex, observation.affectedPolicyRef, "reviewer disagreement policy", observation.id);
    const disagreements = (observation.disagreementRefs || []).map((id) => ref(reviewerDisagreementIndex, id, "reviewer disagreement", observation.id)).filter(Boolean);
    const outcomes = (observation.adjudicationOutcomeRefs || []).map((id) => ref(adjudicationIndex, id, "adjudication outcome", observation.id)).filter(Boolean);
    if (disagreements.length === 0 || outcomes.length === 0) errors.push(`${observation.id} must reference at least one disagreement and adjudication outcome.`);
    for (const disagreement of disagreements) if (disagreement.policyRef !== observation.affectedPolicyRef) errors.push(`${observation.id} disagreement ${disagreement.id} must use affected policy ${observation.affectedPolicyRef}.`);
    for (const outcome of outcomes) if (!observation.disagreementRefs?.includes(outcome.disagreementRef)) errors.push(`${observation.id} adjudication ${outcome.id} must resolve one of its source disagreements.`);
    if (!Array.isArray(observation.affectedClausePaths) || observation.affectedClausePaths.length === 0) errors.push(`${observation.id} affectedClausePaths must include at least one clause.`);
    for (const clausePath of observation.affectedClausePaths || []) if (policy && !Object.hasOwn(policy, clausePath)) errors.push(`${observation.id} affected clause ${clausePath} does not exist on policy ${policy.id}.`);
    if (!Array.isArray(observation.evidenceRefs) || observation.evidenceRefs.length === 0) errors.push(`${observation.id} evidenceRefs must include at least one item.`);
    if (observation.feedbackBoundary !== "candidate-input-not-rubric-authority") errors.push(`${observation.id} feedbackBoundary must remain candidate-input-not-rubric-authority.`);
    const triggerTypes = new Set((observation.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", observation.id)?.triggerType));
    if (observation.evidenceStatus !== "verified" && !triggerTypes.has("rubric-feedback-unverified")) errors.push(`${observation.id} non-verified feedback requires a rubric-feedback-unverified governance trigger.`);
  }

  for (const candidate of rubricRevisionCandidates) {
    for (const field of ["policyRef", "clausePath", "changeRationale", "status"]) str(candidate, field, candidate.id);
    const policy = ref(reviewerPolicyIndex, candidate.policyRef, "reviewer disagreement policy", candidate.id);
    const observations = (candidate.feedbackObservationRefs || []).map((id) => ref(feedbackObservationIndex, id, "adjudication feedback observation", candidate.id)).filter(Boolean);
    if (observations.length === 0) errors.push(`${candidate.id} feedbackObservationRefs must include at least one observation.`);
    for (const observation of observations) {
      if (observation.affectedPolicyRef !== candidate.policyRef) errors.push(`${candidate.id} feedback observation ${observation.id} must affect policy ${candidate.policyRef}.`);
      if (!(observation.affectedClausePaths || []).includes(candidate.clausePath)) errors.push(`${candidate.id} clausePath must be declared by feedback observation ${observation.id}.`);
    }
    if (policy && !Object.hasOwn(policy, candidate.clausePath)) errors.push(`${candidate.id} clausePath ${candidate.clausePath} does not exist on policy ${policy.id}.`);
    const alternatives = candidate.alternativeRevisions || [];
    if (alternatives.length < 2) errors.push(`${candidate.id} must preserve at least two revision alternatives.`);
    if (new Set(alternatives.map((item) => item.id)).size !== alternatives.length) errors.push(`${candidate.id} alternativeRevisions ids must be unique.`);
    const selected = alternatives.filter((item) => item.disposition === "selected");
    if (selected.length !== 1) errors.push(`${candidate.id} must have exactly one selected alternative.`);
    if (selected[0] && !sameValue(selected[0].proposedValue, candidate.proposedValue)) errors.push(`${candidate.id} proposedValue must equal the selected alternative value.`);
    if (!alternatives.some((item) => item.disposition === "rejected") || !alternatives.some((item) => item.disposition === "deferred")) errors.push(`${candidate.id} must preserve both rejected and deferred alternatives.`);
    for (const alternative of alternatives) for (const field of ["rationale", "disposition", "dispositionRationale"]) str(alternative, field, `${candidate.id}/${alternative.id}`);
    const sourceDisagreementRefs = new Set(observations.flatMap((item) => item.disagreementRefs || []));
    for (const replayRef of candidate.replayDisagreementRefs || []) {
      ref(reviewerDisagreementIndex, replayRef, "replay disagreement", candidate.id);
      if (!sourceDisagreementRefs.has(replayRef)) errors.push(`${candidate.id} replayDisagreementRefs must come from source feedback disagreements.`);
    }
    for (const dissentRef of candidate.dissentRefs || []) {
      ref(reviewerJudgmentIndex, dissentRef, "dissent judgment", candidate.id);
      const belongs = [...sourceDisagreementRefs].some((id) => reviewerDisagreementIndex.get(id)?.judgmentRefs?.includes(dissentRef));
      if (!belongs) errors.push(`${candidate.id} dissentRef ${dissentRef} must belong to a source disagreement.`);
    }
    if (candidate.automaticMutation !== false) errors.push(`${candidate.id} automaticMutation must be false.`);
    const triggerTypes = new Set((candidate.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", candidate.id)?.triggerType));
    if (["proposed", "under-review"].includes(candidate.status) && !triggerTypes.has("rubric-candidate-unreviewed")) errors.push(`${candidate.id} undecided candidate requires a rubric-candidate-unreviewed governance trigger.`);
  }

  for (const decision of rubricRevisionDecisions) {
    for (const field of ["candidateRef", "decision", "selectedAlternativeRef", "authorizedBy", "decidedAt", "rationale", "status"]) str(decision, field, decision.id);
    const candidate = ref(rubricCandidateIndex, decision.candidateRef, "rubric revision candidate", decision.id);
    const selected = candidate?.alternativeRevisions?.find((item) => item.id === decision.selectedAlternativeRef);
    if (!selected) errors.push(`${decision.id} selectedAlternativeRef must resolve in its candidate.`);
    else if (selected.disposition !== "selected") errors.push(`${decision.id} selectedAlternativeRef must identify the selected candidate alternative.`);
    if (!Array.isArray(decision.reviewerRefs) || decision.reviewerRefs.length === 0) errors.push(`${decision.id} reviewerRefs must include at least one reviewer.`);
    if (!Array.isArray(decision.evidenceRefs) || decision.evidenceRefs.length === 0) errors.push(`${decision.id} evidenceRefs must include at least one item.`);
    if (decision.dissentPreserved !== true) errors.push(`${decision.id} dissentPreserved must be true.`);
    if ((decision.decision === "approved") !== (decision.implementationRequired === true)) errors.push(`${decision.id} implementationRequired must be true exactly when decision is approved.`);
    const triggerTypes = new Set((decision.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", decision.id)?.triggerType));
    if (decision.decision === "approved" && !decision.authorizedBy && !triggerTypes.has("rubric-decision-unauthorized")) errors.push(`${decision.id} unauthorized approval requires a rubric-decision-unauthorized governance trigger.`);
  }

  for (const implementation of rubricRevisionImplementations) {
    for (const field of ["decisionRef", "policyRef", "clausePath", "implementedAt", "implementedBy", "replayStatus", "rollbackPlan", "status"]) str(implementation, field, implementation.id);
    const decision = ref(rubricDecisionIndex, implementation.decisionRef, "rubric revision decision", implementation.id);
    const candidate = decision && rubricCandidateIndex.get(decision.candidateRef);
    const policy = ref(reviewerPolicyIndex, implementation.policyRef, "reviewer disagreement policy", implementation.id);
    const selected = candidate?.alternativeRevisions?.find((item) => item.id === decision?.selectedAlternativeRef);
    if (decision?.decision !== "approved" || decision?.implementationRequired !== true) errors.push(`${implementation.id} must implement an approved decision that requires implementation.`);
    if (candidate && (candidate.policyRef !== implementation.policyRef || candidate.clausePath !== implementation.clausePath)) errors.push(`${implementation.id} policyRef and clausePath must match its candidate.`);
    if (candidate && !sameValue(implementation.previousValue, candidate.currentValue)) errors.push(`${implementation.id} previousValue must reproduce the candidate currentValue.`);
    if (selected && !sameValue(implementation.implementedValue, selected.proposedValue)) errors.push(`${implementation.id} implementedValue must reproduce the selected alternative.`);
    if (implementation.status === "implemented" && policy && !sameValue(policy[implementation.clausePath], implementation.implementedValue)) errors.push(`${implementation.id} implementedValue must match the active policy clause.`);
    if (!sameSet(implementation.replayDisagreementRefs, candidate?.replayDisagreementRefs || [])) errors.push(`${implementation.id} replayDisagreementRefs must match the candidate replay scope.`);
    if (implementation.historicalJudgmentsPreserved !== true) errors.push(`${implementation.id} historicalJudgmentsPreserved must be true.`);
    if (implementation.automaticMutation !== false) errors.push(`${implementation.id} automaticMutation must be false.`);
    if (!Array.isArray(implementation.evidenceRefs) || implementation.evidenceRefs.length === 0) errors.push(`${implementation.id} evidenceRefs must include at least one item.`);
    const triggerTypes = new Set((implementation.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", implementation.id)?.triggerType));
    if (implementation.replayStatus !== "completed" && !triggerTypes.has("rubric-replay-incomplete")) errors.push(`${implementation.id} incomplete replay requires a rubric-replay-incomplete governance trigger.`);
  }

  for (const assessment of rubricRevisionAssessments) {
    for (const field of ["title", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const candidates = (assessment.candidateRefs || []).map((id) => ref(rubricCandidateIndex, id, "rubric revision candidate", assessment.id)).filter(Boolean);
    const decisions = (assessment.decisionRefs || []).map((id) => ref(rubricDecisionIndex, id, "rubric revision decision", assessment.id)).filter(Boolean);
    const implementations = (assessment.implementationRefs || []).map((id) => ref(rubricImplementationIndex, id, "rubric revision implementation", assessment.id)).filter(Boolean);
    const approvedCount = decisions.filter((item) => item.decision === "approved").length;
    const rejectedCount = decisions.filter((item) => item.decision === "rejected").length;
    const deferredCount = decisions.filter((item) => ["deferred", "needs-more-evidence"].includes(item.decision)).length;
    const implementedCount = implementations.filter((item) => item.status === "implemented").length;
    const completedReplayCount = implementations.filter((item) => item.replayStatus === "completed").length;
    const feedbackRefs = new Set(candidates.flatMap((item) => item.feedbackObservationRefs || []));
    const verifiedFeedbackCount = [...feedbackRefs].filter((id) => feedbackObservationIndex.get(id)?.evidenceStatus === "verified").length;
    for (const [field, value] of Object.entries({ candidateCount: candidates.length, approvedCount, rejectedCount, deferredCount, implementedCount, completedReplayCount, verifiedFeedbackCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const dataSufficiency = candidates.length >= 2 && verifiedFeedbackCount === feedbackRefs.size && completedReplayCount === implementedCount ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : implementations.some((item) => item.replayStatus !== "completed") ? "governance-required" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (assessment.interpretation !== "rubric-learning-evidence-only-not-quality-truth-competence-causality-or-authority") errors.push(`${assessment.id} interpretation must remain rubric-learning-evidence-only-not-quality-truth-competence-causality-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("rubric-learning-insufficient")) errors.push(`${assessment.id} insufficient rubric-learning evidence requires a rubric-learning-insufficient governance trigger.`);
  }

  for (const variant of policyCounterfactualVariants) {
    for (const field of ["title", "baselineSnapshotRef", "authorizationBoundary", "status"]) str(variant, field, variant.id);
    const baseline = ref(routePolicySnapshotIndex, variant.baselineSnapshotRef, "baseline route-policy snapshot", variant.id);
    const routes = Array.isArray(variant.routes) ? variant.routes : [];
    const routeIndex = indexById(routes.map((item) => ({ ...item, id: item.routeRef })), `${variant.id}:routes`);
    const rules = Array.isArray(variant.routingRules) ? [...variant.routingRules].sort((a, b) => a.lowerInclusive - b.lowerInclusive) : [];
    const ruleIndex = indexById(rules.map((item) => ({ ...item, id: item.ruleRef })), `${variant.id}:routingRules`);
    if (!baseline) continue;
    if (!sameSet(routes.map((item) => item.routeRef), baseline.routes.map((item) => item.routeRef))) errors.push(`${variant.id} routes must exactly cover the baseline snapshot routes.`);
    if (rules.length < 4) errors.push(`${variant.id} routingRules must include at least four rules.`);
    for (const [index, rule] of rules.entries()) {
      score(rule.lowerInclusive, "lowerInclusive", `${variant.id}/${rule.ruleRef}`);
      if (typeof rule.upperExclusive !== "number" || rule.upperExclusive <= rule.lowerInclusive || rule.upperExclusive > 1.000001) errors.push(`${variant.id}/${rule.ruleRef} upperExclusive must be greater than lowerInclusive and no more than 1.000001.`);
      if (!routeIndex.has(rule.routeRef)) errors.push(`${variant.id}/${rule.ruleRef} references missing candidate route ${rule.routeRef}.`);
      if (index === 0 && rule.lowerInclusive !== 0) errors.push(`${variant.id} routingRules must start at 0.`);
      if (index > 0 && !sameNumber(rule.lowerInclusive, rules[index - 1].upperExclusive)) errors.push(`${variant.id} routingRules must be contiguous without gaps or overlap.`);
    }
    if (rules.length > 0 && !sameNumber(rules.at(-1).upperExclusive, 1.000001)) errors.push(`${variant.id} routingRules must end at 1.000001 so probability 1 is included.`);
    if (!sameSet(rules.map((item) => item.routeRef), routes.map((item) => item.routeRef))) errors.push(`${variant.id} routingRules must make every candidate route reachable exactly once.`);

    const dimensions = new Set();
    for (const sourceRoute of baseline.routes || []) {
      const candidateRoute = routes.find((item) => item.routeRef === sourceRoute.routeRef);
      if (!candidateRoute) continue;
      if (candidateRoute.routeType !== sourceRoute.routeType) dimensions.add("route");
      if (candidateRoute.authorityRef !== sourceRoute.authorityRef) dimensions.add("authority");
      if (candidateRoute.capabilityRequirement !== sourceRoute.capabilityRequirement) dimensions.add("capability");
      if (!sameValue(candidateRoute.evidenceRequired, sourceRoute.evidenceRequired)) dimensions.add("evidence");
      if (candidateRoute.responseTimeBoundary !== sourceRoute.responseTimeBoundary) dimensions.add("response-time");
    }
    for (const sourceRule of baseline.routingRules || []) {
      const candidateRule = rules.find((item) => item.routeRef === sourceRule.routeRef);
      if (!candidateRule || candidateRule.routeRef !== sourceRule.routeRef) dimensions.add("route");
      if (candidateRule && (!sameNumber(candidateRule.lowerInclusive, sourceRule.lowerInclusive) || !sameNumber(candidateRule.upperExclusive, sourceRule.upperExclusive))) dimensions.add("threshold");
    }
    if (!sameSet(variant.changedDimensions, [...dimensions])) errors.push(`${variant.id} changedDimensions must reproduce baseline-to-candidate differences.`);
    if (!Array.isArray(variant.changes) || variant.changes.length === 0) errors.push(`${variant.id} changes must include exact candidate edits.`);
    if (!sameSet((variant.changes || []).map((item) => item.dimension), [...dimensions])) errors.push(`${variant.id} changes must cover every changed dimension.`);
    for (const change of variant.changes || []) {
      const sourceRoute = (baseline.routes || []).find((item) => item.routeRef === change.routeRef);
      const candidateRoute = routes.find((item) => item.routeRef === change.routeRef);
      const sourceRule = (baseline.routingRules || []).find((item) => item.routeRef === change.routeRef);
      const candidateRule = rules.find((item) => item.routeRef === change.routeRef);
      let previousValue;
      let currentValue;
      if (change.dimension === "threshold") {
        previousValue = sourceRule && { lowerInclusive: sourceRule.lowerInclusive, upperExclusive: sourceRule.upperExclusive };
        currentValue = candidateRule && { lowerInclusive: candidateRule.lowerInclusive, upperExclusive: candidateRule.upperExclusive };
      } else if (change.dimension === "authority") {
        previousValue = sourceRoute?.authorityRef;
        currentValue = candidateRoute?.authorityRef;
      } else if (change.dimension === "capability") {
        previousValue = sourceRoute?.capabilityRequirement;
        currentValue = candidateRoute?.capabilityRequirement;
      } else if (change.dimension === "evidence") {
        previousValue = sourceRoute?.evidenceRequired;
        currentValue = candidateRoute?.evidenceRequired;
      } else if (change.dimension === "route") {
        previousValue = sourceRoute?.routeType;
        currentValue = candidateRoute?.routeType;
      } else if (change.dimension === "response-time") {
        previousValue = sourceRoute?.responseTimeBoundary;
        currentValue = candidateRoute?.responseTimeBoundary;
      }
      if (!sameValue(change.previousValue, previousValue) || !sameValue(change.currentValue, currentValue)) errors.push(`${variant.id} change detail ${change.dimension}/${change.routeRef} does not reproduce baseline and candidate values.`);
    }
    if (!Array.isArray(variant.reviewedBy) || variant.reviewedBy.length === 0) errors.push(`${variant.id} reviewedBy must include at least one accountable reviewer.`);
    if (!Array.isArray(variant.evidenceRefs) || variant.evidenceRefs.length === 0) errors.push(`${variant.id} evidenceRefs must include at least one item.`);
    if (variant.authorizationBoundary !== "reviewed-candidate-only-not-selected-authorized-or-active") errors.push(`${variant.id} authorizationBoundary must remain reviewed-candidate-only-not-selected-authorized-or-active.`);
    if (variant.automaticSelection !== false || variant.automaticMutation !== false) errors.push(`${variant.id} automaticSelection and automaticMutation must be false.`);
    const triggerTypes = new Set((variant.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", variant.id)?.triggerType));
    if (variant.status !== "reviewed" && !triggerTypes.has("counterfactual-variant-unreviewed")) errors.push(`${variant.id} non-reviewed candidate requires a counterfactual-variant-unreviewed governance trigger.`);
    variant.__routeIndex = routeIndex;
    variant.__ruleIndex = ruleIndex;
  }

  for (const replay of policyCounterfactualReplays) {
    for (const field of ["variantRef", "decisionRef", "pairRef", "baselineSnapshotRef", "replayedAt", "replayedBy", "baselineRuleRef", "baselineRouteRef", "counterfactualRuleRef", "counterfactualRouteRef", "evidenceStatus", "counterfactualBoundary", "status"]) str(replay, field, replay.id);
    const variant = ref(counterfactualVariantIndex, replay.variantRef, "policy counterfactual variant", replay.id);
    const decision = ref(escalationDecisionIndex, replay.decisionRef, "selective escalation decision", replay.id);
    const pair = ref(pairIndex, replay.pairRef, "decision-outcome pair", replay.id);
    const baseline = ref(routePolicySnapshotIndex, replay.baselineSnapshotRef, "baseline route-policy snapshot", replay.id);
    if (!variant || !decision || !pair || !baseline) continue;
    if (variant.baselineSnapshotRef !== replay.baselineSnapshotRef) errors.push(`${replay.id} baselineSnapshotRef must match its variant.`);
    if (decision.pairRef !== replay.pairRef) errors.push(`${replay.id} pairRef must match the preserved decision pairRef.`);
    const evidence = replay.evidenceSnapshot || {};
    for (const [field, value] of Object.entries({ pairRef: pair.id, forecastProbability: pair.forecastProbability, sourceEvidenceOriginRef: pair.sourceEvidenceOriginRef, evidenceOriginRef: pair.evidenceOriginRef, observationWindow: pair.observationWindow })) {
      if (!sameValue(evidence[field], value)) errors.push(`${replay.id} evidenceSnapshot.${field} must reproduce the unchanged pair value.`);
    }
    const baselineRules = (baseline.routingRules || []).filter((rule) => pair.forecastProbability >= rule.lowerInclusive && pair.forecastProbability < rule.upperExclusive);
    if (baselineRules.length !== 1) errors.push(`${replay.id} forecastProbability must match exactly one baseline routing rule.`);
    const baselineRule = baselineRules[0];
    if (baselineRule && replay.baselineRuleRef !== baselineRule.ruleRef) errors.push(`${replay.id} baselineRuleRef must reproduce as ${baselineRule.ruleRef}.`);
    if (baselineRule && replay.baselineRouteRef !== baselineRule.routeRef) errors.push(`${replay.id} baselineRouteRef must reproduce as ${baselineRule.routeRef}.`);
    if (replay.baselineRuleRef !== decision.selectedRuleRef || replay.baselineRouteRef !== decision.recommendedRouteRef) errors.push(`${replay.id} baseline policy output must match the preserved decision recommendation.`);
    const counterfactualRules = (variant.routingRules || []).filter((rule) => pair.forecastProbability >= rule.lowerInclusive && pair.forecastProbability < rule.upperExclusive);
    if (counterfactualRules.length !== 1) errors.push(`${replay.id} forecastProbability must match exactly one counterfactual routing rule.`);
    const counterfactualRule = counterfactualRules[0];
    if (counterfactualRule && replay.counterfactualRuleRef !== counterfactualRule.ruleRef) errors.push(`${replay.id} counterfactualRuleRef must reproduce as ${counterfactualRule.ruleRef}.`);
    if (counterfactualRule && replay.counterfactualRouteRef !== counterfactualRule.routeRef) errors.push(`${replay.id} counterfactualRouteRef must reproduce as ${counterfactualRule.routeRef}.`);
    const routeChanged = replay.baselineRouteRef !== replay.counterfactualRouteRef;
    if (replay.routeChanged !== routeChanged) errors.push(`${replay.id} routeChanged must reproduce as ${routeChanged}.`);
    const impacts = Array.isArray(replay.lossBoundaryImpacts) ? replay.lossBoundaryImpacts : [];
    if (impacts.length === 0) errors.push(`${replay.id} lossBoundaryImpacts must include at least one explicit impact hypothesis.`);
    for (const impact of impacts) {
      const consequencePolicy = ref(consequencePolicyIndex, impact.consequencePolicyRef, "consequence policy", replay.id);
      if (!consequencePolicy) continue;
      const qualityIntent = loaded.get(consequencePolicy.sourcePackageRef)?.qualityIntents.get(consequencePolicy.qualityIntentRef);
      if (impact.qualityIntentRef !== consequencePolicy.qualityIntentRef || !qualityIntent) errors.push(`${replay.id} impact qualityIntentRef must resolve through its consequence policy.`);
      if (impact.lossBoundary !== consequencePolicy.lossBoundary || impact.lossBoundary !== qualityIntent?.lossBoundary) errors.push(`${replay.id} impact lossBoundary must reproduce the consequence policy and Quality Intent.`);
      if (impact.severity !== consequencePolicy.lossBoundarySeverity || impact.severity !== qualityIntent?.lossBoundarySeverity) errors.push(`${replay.id} impact severity must reproduce the consequence policy and Quality Intent.`);
      if (!Array.isArray(impact.evidenceRefs) || impact.evidenceRefs.length === 0) errors.push(`${replay.id} impact evidenceRefs must include at least one item.`);
      if (impact.hypothesisStatus !== "counterfactual-not-observed") errors.push(`${replay.id} impact hypothesisStatus must remain counterfactual-not-observed.`);
    }
    if (replay.baselineDecisionPreserved !== true) errors.push(`${replay.id} baselineDecisionPreserved must be true.`);
    if (replay.counterfactualBoundary !== "hypothesis-evidence-not-observed-outcome-policy-selection-or-authority") errors.push(`${replay.id} counterfactualBoundary must remain hypothesis-evidence-not-observed-outcome-policy-selection-or-authority.`);
    const triggerTypes = new Set((replay.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", replay.id)?.triggerType));
    if (routeChanged && !triggerTypes.has("counterfactual-route-change")) errors.push(`${replay.id} route change requires a counterfactual-route-change governance trigger.`);
    const severeImpact = impacts.some((impact) => ["high", "critical"].includes(impact.severity) && ["increased-exposure", "tradeoff", "uncertain"].includes(impact.direction));
    if (severeImpact && !triggerTypes.has("counterfactual-loss-boundary-review")) errors.push(`${replay.id} severe or uncertain loss-boundary impact requires a counterfactual-loss-boundary-review governance trigger.`);
    if (replay.evidenceStatus !== "verified" && !triggerTypes.has("counterfactual-evidence-unverified")) errors.push(`${replay.id} non-verified replay evidence requires a counterfactual-evidence-unverified governance trigger.`);
  }

  for (const assessment of policyCounterfactualAssessments) {
    for (const field of ["title", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const variants = (assessment.variantRefs || []).map((id) => ref(counterfactualVariantIndex, id, "policy counterfactual variant", assessment.id)).filter(Boolean);
    const replays = (assessment.replayRefs || []).map((id) => ref(counterfactualReplayIndex, id, "policy counterfactual replay", assessment.id)).filter(Boolean);
    if (!Number.isInteger(assessment.minimumReplayCount) || assessment.minimumReplayCount < 2) errors.push(`${assessment.id} minimumReplayCount must be at least 2.`);
    for (const replay of replays) if (!assessment.variantRefs?.includes(replay.variantRef)) errors.push(`${assessment.id} replay ${replay.id} must use an assessed variant.`);
    const routeChangeCount = replays.filter((item) => item.routeChanged === true).length;
    const impacts = replays.flatMap((item) => item.lossBoundaryImpacts || []);
    const severeImpactCount = impacts.filter((impact) => ["high", "critical"].includes(impact.severity) && ["increased-exposure", "tradeoff", "uncertain"].includes(impact.direction)).length;
    const verifiedReplayCount = replays.filter((item) => item.evidenceStatus === "verified").length;
    for (const [field, value] of Object.entries({ variantCount: variants.length, replayCount: replays.length, routeChangeCount, lossBoundaryImpactCount: impacts.length, severeImpactCount, verifiedReplayCount })) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const dataSufficiency = replays.length >= assessment.minimumReplayCount && verifiedReplayCount === replays.length && variants.every((item) => item.status === "reviewed") ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : routeChangeCount > 0 || severeImpactCount > 0 ? "governance-required" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (!Array.isArray(assessment.reviewedBy) || assessment.reviewedBy.length === 0) errors.push(`${assessment.id} reviewedBy must include at least one accountable reviewer.`);
    if (assessment.interpretation !== "counterfactual-replay-evidence-only-not-observed-outcome-quality-optimality-causality-or-authority") errors.push(`${assessment.id} interpretation must remain counterfactual-replay-evidence-only-not-observed-outcome-quality-optimality-causality-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("counterfactual-assessment-insufficient")) errors.push(`${assessment.id} insufficient counterfactual evidence requires a counterfactual-assessment-insufficient governance trigger.`);
  }

  for (const variant of judgeConditionVariants) {
    for (const field of ["title", "conditionGroupRef", "pairRef", "conditionRole", "downstreamUse", "consequenceFraming", "promptDelta", "evidenceStatus", "authorizationBoundary", "status"]) str(variant, field, variant.id);
    const pair = ref(pairIndex, variant.pairRef, "decision-outcome pair", variant.id);
    const snapshot = variant.evidenceSnapshot || {};
    if (pair) {
      for (const [field, value] of Object.entries({ pairRef: pair.id, sourcePackageRef: pair.sourcePackageRef, sourceEvidenceOriginRef: pair.sourceEvidenceOriginRef, evidenceOriginRef: pair.evidenceOriginRef, observationWindow: pair.observationWindow })) {
        if (!sameValue(snapshot[field], value)) errors.push(`${variant.id} evidenceSnapshot.${field} must reproduce the unchanged pair value.`);
      }
    }
    str(snapshot, "evidenceDigest", `${variant.id} evidenceSnapshot`);
    if (variant.conditionRole === "baseline") {
      if (variant.baselineVariantRef !== null) errors.push(`${variant.id} baseline condition must use null baselineVariantRef.`);
      if (!sameSet(variant.changedDimensions, [])) errors.push(`${variant.id} baseline condition changedDimensions must be empty.`);
    } else {
      const baseline = ref(judgeConditionVariantIndex, variant.baselineVariantRef, "baseline judge condition variant", variant.id);
      if (baseline) {
        if (baseline.conditionRole !== "baseline") errors.push(`${variant.id} baselineVariantRef must resolve to a baseline condition.`);
        if (baseline.conditionGroupRef !== variant.conditionGroupRef || baseline.pairRef !== variant.pairRef) errors.push(`${variant.id} must share conditionGroupRef and pairRef with its baseline.`);
        if (!sameValue(baseline.evidenceSnapshot, variant.evidenceSnapshot)) errors.push(`${variant.id} evidenceSnapshot must be identical to its baseline condition.`);
        const dimensions = [];
        if (baseline.downstreamUse !== variant.downstreamUse) dimensions.push("downstream-use");
        if (baseline.consequenceFraming !== variant.consequenceFraming) dimensions.push("consequence-framing");
        if (baseline.abstainAvailable !== variant.abstainAvailable) dimensions.push("abstain-availability");
        if (!sameSet(variant.changedDimensions, dimensions)) errors.push(`${variant.id} changedDimensions must reproduce the exact baseline-to-comparison condition differences.`);
      }
    }
    if (!Array.isArray(variant.reviewedBy) || variant.reviewedBy.length === 0) errors.push(`${variant.id} reviewedBy must include at least one accountable reviewer.`);
    if (!Array.isArray(variant.evidenceRefs) || variant.evidenceRefs.length === 0) errors.push(`${variant.id} evidenceRefs must include at least one item.`);
    if (variant.authorizationBoundary !== "measurement-condition-only-not-judge-selection-replacement-authorization-or-policy-mutation") errors.push(`${variant.id} authorizationBoundary must remain measurement-condition-only-not-judge-selection-replacement-authorization-or-policy-mutation.`);
    if (variant.hiddenReasoningCollected !== false) errors.push(`${variant.id} hiddenReasoningCollected must be false.`);
    if (variant.automaticSelection !== false || variant.automaticMutation !== false) errors.push(`${variant.id} automaticSelection and automaticMutation must be false.`);
    const triggerTypes = new Set((variant.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", variant.id)?.triggerType));
    if (variant.status !== "reviewed" && !triggerTypes.has("judge-condition-unreviewed")) errors.push(`${variant.id} non-reviewed judge condition requires a judge-condition-unreviewed governance trigger.`);
    if (variant.evidenceStatus !== "verified" && !triggerTypes.has("judge-evidence-unverified")) errors.push(`${variant.id} non-verified judge condition evidence requires a judge-evidence-unverified governance trigger.`);
  }

  for (const trial of judgeRobustnessTrials) {
    for (const field of ["variantRef", "conditionGroupRef", "pairRef", "expectedLabel", "outputClass", "responseSummary", "executedAt", "executedBy", "evidenceStatus", "status"]) str(trial, field, trial.id);
    const variant = ref(judgeConditionVariantIndex, trial.variantRef, "judge condition variant", trial.id);
    const pair = ref(pairIndex, trial.pairRef, "decision-outcome pair", trial.id);
    if (variant && (trial.conditionGroupRef !== variant.conditionGroupRef || trial.pairRef !== variant.pairRef)) errors.push(`${trial.id} conditionGroupRef and pairRef must match its judge condition variant.`);
    if (!pair) continue;
    const abstention = trial.abstentionReview || {};
    const classified = ["correct-classification", "incorrect-classification"].includes(trial.outputClass);
    const abstained = ["justified-abstention", "unjustified-abstention"].includes(trial.outputClass);
    const invalid = ["refusal", "malformed-output"].includes(trial.outputClass);
    if (classified) {
      if (typeof trial.returnedLabel !== "string" || trial.returnedLabel.trim() === "") errors.push(`${trial.id} classification output requires a returnedLabel.`);
      const expectedCorrect = trial.returnedLabel === trial.expectedLabel;
      if (trial.outputClass !== (expectedCorrect ? "correct-classification" : "incorrect-classification")) errors.push(`${trial.id} outputClass must reproduce returnedLabel agreement with expectedLabel.`);
      if (trial.classificationCorrect !== expectedCorrect) errors.push(`${trial.id} classificationCorrect must reproduce as ${expectedCorrect}.`);
      if (abstention.applicable !== false || abstention.justified !== null) errors.push(`${trial.id} classification output must use a non-applicable abstention review.`);
    } else {
      if (trial.returnedLabel !== null) errors.push(`${trial.id} non-classification output must use null returnedLabel.`);
      if (trial.classificationCorrect !== null) errors.push(`${trial.id} non-classification output must use null classificationCorrect.`);
    }
    if (abstained) {
      const expectedJustified = trial.outputClass === "justified-abstention";
      if (variant?.abstainAvailable !== true) errors.push(`${trial.id} abstention output requires an abstain-available condition.`);
      if (abstention.applicable !== true || abstention.justified !== expectedJustified) errors.push(`${trial.id} abstentionReview must reproduce as ${expectedJustified ? "justified" : "unjustified"}.`);
      if (!Array.isArray(abstention.reviewerRefs) || abstention.reviewerRefs.length === 0 || !Array.isArray(abstention.evidenceRefs) || abstention.evidenceRefs.length === 0) errors.push(`${trial.id} abstention review requires reviewers and evidence.`);
    }
    if (invalid && (abstention.applicable !== false || abstention.justified !== null)) errors.push(`${trial.id} refusal or malformed output must not be recorded as abstention.`);
    if (trial.hiddenReasoningCollected !== false) errors.push(`${trial.id} hiddenReasoningCollected must be false.`);
    const triggerTypes = new Set((trial.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", trial.id)?.triggerType));
    if (trial.evidenceStatus !== "verified" && !triggerTypes.has("judge-evidence-unverified")) errors.push(`${trial.id} non-verified judge trial evidence requires a judge-evidence-unverified governance trigger.`);
    if (trial.outputClass === "unjustified-abstention" && !triggerTypes.has("judge-abstention-review")) errors.push(`${trial.id} unjustified abstention requires a judge-abstention-review governance trigger.`);
    if (invalid && !triggerTypes.has("judge-output-invalid")) errors.push(`${trial.id} refusal or malformed output requires a judge-output-invalid governance trigger.`);
  }

  for (const assessment of judgeRobustnessAssessments) {
    for (const field of ["title", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const variants = (assessment.variantRefs || []).map((id) => ref(judgeConditionVariantIndex, id, "judge condition variant", assessment.id)).filter(Boolean);
    const trials = (assessment.trialRefs || []).map((id) => ref(judgeRobustnessTrialIndex, id, "judge robustness trial", assessment.id)).filter(Boolean);
    if (!Number.isInteger(assessment.minimumTrialCount) || assessment.minimumTrialCount < 2) errors.push(`${assessment.id} minimumTrialCount must be at least 2.`);
    for (const trial of trials) if (!assessment.variantRefs?.includes(trial.variantRef)) errors.push(`${assessment.id} trial ${trial.id} must use an assessed variant.`);
    const groups = new Map();
    for (const trial of trials) {
      if (!groups.has(trial.conditionGroupRef)) groups.set(trial.conditionGroupRef, []);
      groups.get(trial.conditionGroupRef).push(trial);
    }
    const variantSet = new Set(variants.map((item) => item.id));
    const completeGroups = [...groups.values()].filter((items) => sameSet(items.map((item) => item.variantRef), [...variantSet]));
    const signature = (trial) => `${trial.outputClass}:${trial.returnedLabel ?? "null"}`;
    const conditionSensitiveGroupCount = completeGroups.filter((items) => new Set(items.map(signature)).size > 1).length;
    const counts = Object.fromEntries(["correct-classification", "incorrect-classification", "justified-abstention", "unjustified-abstention", "refusal", "malformed-output"].map((kind) => [kind, trials.filter((item) => item.outputClass === kind).length]));
    const verifiedTrialCount = trials.filter((item) => item.evidenceStatus === "verified").length;
    const expected = {
      variantCount: variants.length,
      trialCount: trials.length,
      completeConditionGroupCount: completeGroups.length,
      correctClassificationCount: counts["correct-classification"],
      incorrectClassificationCount: counts["incorrect-classification"],
      justifiedAbstentionCount: counts["justified-abstention"],
      unjustifiedAbstentionCount: counts["unjustified-abstention"],
      refusalCount: counts.refusal,
      malformedOutputCount: counts["malformed-output"],
      conditionSensitiveGroupCount,
      verifiedTrialCount
    };
    for (const [field, value] of Object.entries(expected)) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const allGroupsComplete = groups.size > 0 && completeGroups.length === groups.size;
    const dataSufficiency = trials.length >= assessment.minimumTrialCount && verifiedTrialCount === trials.length && variants.every((item) => item.status === "reviewed" && item.evidenceStatus === "verified") && allGroupsComplete ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const hasAbstentionAlert = counts["unjustified-abstention"] > 0 || counts.refusal > 0 || counts["malformed-output"] > 0;
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : conditionSensitiveGroupCount > 0 ? "consequence-sensitivity-observed" : hasAbstentionAlert ? "abstention-alert" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (!Array.isArray(assessment.reviewedBy) || assessment.reviewedBy.length === 0) errors.push(`${assessment.id} reviewedBy must include at least one accountable reviewer.`);
    if (assessment.automaticSelection !== false) errors.push(`${assessment.id} automaticSelection must be false.`);
    if (assessment.interpretation !== "judge-robustness-evidence-only-not-semantic-truth-quality-competence-optimality-selection-authorization-or-authority") errors.push(`${assessment.id} interpretation must remain judge-robustness-evidence-only-not-semantic-truth-quality-competence-optimality-selection-authorization-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("judge-assessment-insufficient")) errors.push(`${assessment.id} insufficient judge robustness evidence requires a judge-assessment-insufficient governance trigger.`);
    if (conditionSensitiveGroupCount > 0 && !triggerTypes.has("judge-consequence-sensitive")) errors.push(`${assessment.id} condition-sensitive judge results require a judge-consequence-sensitive governance trigger.`);
    if (counts["unjustified-abstention"] > 0 && !triggerTypes.has("judge-abstention-review")) errors.push(`${assessment.id} unjustified abstention requires a judge-abstention-review governance trigger.`);
    if ((counts.refusal > 0 || counts["malformed-output"] > 0) && !triggerTypes.has("judge-output-invalid")) errors.push(`${assessment.id} invalid judge outputs require a judge-output-invalid governance trigger.`);
  }

  for (const protocol of sequesteredReplayProtocols) {
    for (const field of ["title", "evidenceStatus", "status"]) str(protocol, field, protocol.id);
    for (const trialRef of protocol.trialRefs || []) ref(judgeRobustnessTrialIndex, trialRef, "judge robustness trial", protocol.id);
    if (!Array.isArray(protocol.sequesteredItems) || protocol.sequesteredItems.length < 2) errors.push(`${protocol.id} sequesteredItems must include at least two items.`);
    const itemTypes = new Set();
    for (const item of protocol.sequesteredItems || []) {
      for (const field of ["itemType", "revealStage"]) str(item, field, `${protocol.id} sequestered item`);
      itemTypes.add(item.itemType);
      if (item.sequesteredBeforeExecution !== true) errors.push(`${protocol.id} every sequestered item must remain sequesteredBeforeExecution.`);
      if (!Array.isArray(item.accessRoleRefs) || item.accessRoleRefs.length === 0 || !Array.isArray(item.evidenceRefs) || item.evidenceRefs.length === 0) errors.push(`${protocol.id} each sequestered item requires access roles and evidence.`);
    }
    if (!itemTypes.has("expected-label") || !itemTypes.has("grader-implementation")) errors.push(`${protocol.id} must sequester expected-label and grader-implementation.`);
    const affordanceIds = new Set();
    for (const affordance of protocol.affordances || []) {
      for (const field of ["id", "affordanceType", "rationale"]) str(affordance, field, protocol.id);
      if (affordanceIds.has(affordance.id)) errors.push(`${protocol.id} affordances must not duplicate id ${affordance.id}.`);
      affordanceIds.add(affordance.id);
      if (typeof affordance.allowed !== "boolean") errors.push(`${protocol.id}/${affordance.id} allowed must be boolean.`);
    }
    if (protocol.accessLogRequired !== true || protocol.externalizedTranscriptRequired !== true) errors.push(`${protocol.id} must require access logs and externalized transcripts.`);
    if (protocol.hiddenReasoningCollected !== false) errors.push(`${protocol.id} hiddenReasoningCollected must be false.`);
    if (!Array.isArray(protocol.reviewedBy) || protocol.reviewedBy.length === 0 || !Array.isArray(protocol.evidenceRefs) || protocol.evidenceRefs.length === 0) errors.push(`${protocol.id} requires accountable review and evidence.`);
    if (protocol.automaticSelection !== false || protocol.automaticMutation !== false) errors.push(`${protocol.id} automaticSelection and automaticMutation must be false.`);
    const triggerTypes = new Set((protocol.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", protocol.id)?.triggerType));
    if (protocol.status !== "reviewed" && !triggerTypes.has("sequestered-protocol-unreviewed")) errors.push(`${protocol.id} non-reviewed protocol requires a sequestered-protocol-unreviewed governance trigger.`);
    if (protocol.evidenceStatus !== "verified" && !triggerTypes.has("sequestered-evidence-unverified")) errors.push(`${protocol.id} non-verified protocol evidence requires a sequestered-evidence-unverified governance trigger.`);
  }

  for (const run of sequesteredReplayRuns) {
    for (const field of ["protocolRef", "executedAt", "executedBy", "blindStateAtExecution", "transcriptInspectionStatus", "resultBoundary", "evidenceStatus", "status"]) str(run, field, run.id);
    const protocol = ref(sequesteredReplayProtocolIndex, run.protocolRef, "sequestered replay protocol", run.id);
    for (const trialRef of run.trialRefs || []) ref(judgeRobustnessTrialIndex, trialRef, "judge robustness trial", run.id);
    if (protocol && !sameSet(run.trialRefs, protocol.trialRefs)) errors.push(`${run.id} trialRefs must exactly match its protocol trialRefs.`);
    if (!Array.isArray(run.accessLogRefs) || run.accessLogRefs.length === 0 || !Array.isArray(run.externalizedTranscriptRefs) || run.externalizedTranscriptRefs.length === 0) errors.push(`${run.id} requires access logs and externalized transcript evidence.`);
    const affordanceIndex = new Map((protocol?.affordances || []).map((item) => [item.id, item]));
    let prohibitedAffordanceObserved = false;
    for (const affordanceRef of run.observedAffordanceRefs || []) {
      const affordance = affordanceIndex.get(affordanceRef);
      if (!affordance) errors.push(`${run.id} references missing protocol affordance: ${affordanceRef}`);
      else if (affordance.allowed !== true) prohibitedAffordanceObserved = true;
    }
    if (run.blindStateAtExecution === "confirmed-blind" && (run.evidenceStatus !== "verified" || run.accessLogRefs.length === 0 || prohibitedAffordanceObserved)) errors.push(`${run.id} confirmed-blind requires verified access evidence and no prohibited observed affordance.`);
    if (run.hiddenReasoningCollected !== false) errors.push(`${run.id} hiddenReasoningCollected must be false.`);
    if (run.resultBoundary !== "evaluation-validity-evidence-only-not-contamination-freedom-honesty-competence-quality-selection-authorization-or-authority") errors.push(`${run.id} resultBoundary must remain evaluation-validity-evidence-only-not-contamination-freedom-honesty-competence-quality-selection-authorization-or-authority.`);
    const contaminationAlerts = (run.contaminationFindings || []).filter((item) => ["suspected", "confirmed", "unknown"].includes(item.findingStatus));
    const loopholeAlerts = (run.loopholeFindings || []).filter((item) => ["suspected", "confirmed", "unknown"].includes(item.findingStatus));
    for (const finding of [...(run.contaminationFindings || []), ...(run.loopholeFindings || [])]) {
      for (const field of ["id", "findingType", "findingStatus", "rationale"]) str(finding, field, run.id);
      if (!Array.isArray(finding.evidenceRefs) || finding.evidenceRefs.length === 0) errors.push(`${run.id}/${finding.id} requires evidenceRefs.`);
    }
    const triggerTypes = new Set((run.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", run.id)?.triggerType));
    if ((run.blindStateAtExecution !== "confirmed-blind" || prohibitedAffordanceObserved) && !triggerTypes.has("sequestered-access-boundary-breached")) errors.push(`${run.id} exposed, unknown, or prohibited-affordance execution requires a sequestered-access-boundary-breached governance trigger.`);
    if (run.transcriptInspectionStatus !== "inspected" && !triggerTypes.has("sequestered-transcript-uninspected")) errors.push(`${run.id} uninspected or incomplete transcript requires a sequestered-transcript-uninspected governance trigger.`);
    if (contaminationAlerts.length > 0 && !triggerTypes.has("sequestered-contamination-alert")) errors.push(`${run.id} contamination alert requires a sequestered-contamination-alert governance trigger.`);
    if (loopholeAlerts.length > 0 && !triggerTypes.has("sequestered-loophole-alert")) errors.push(`${run.id} loophole alert requires a sequestered-loophole-alert governance trigger.`);
    if (run.evidenceStatus !== "verified" && !triggerTypes.has("sequestered-evidence-unverified")) errors.push(`${run.id} non-verified replay evidence requires a sequestered-evidence-unverified governance trigger.`);
  }

  for (const assessment of policyGamingAssessments) {
    for (const field of ["title", "dataSufficiency", "assessmentSignal", "interpretation", "status"]) str(assessment, field, assessment.id);
    const protocols = (assessment.protocolRefs || []).map((id) => ref(sequesteredReplayProtocolIndex, id, "sequestered replay protocol", assessment.id)).filter(Boolean);
    const runs = (assessment.runRefs || []).map((id) => ref(sequesteredReplayRunIndex, id, "sequestered replay run", assessment.id)).filter(Boolean);
    if (!Number.isInteger(assessment.minimumRunCount) || assessment.minimumRunCount < 2) errors.push(`${assessment.id} minimumRunCount must be at least 2.`);
    for (const run of runs) if (!assessment.protocolRefs?.includes(run.protocolRef)) errors.push(`${assessment.id} run ${run.id} must use an assessed protocol.`);
    const contaminationAlertCount = runs.reduce((count, run) => count + (run.contaminationFindings || []).filter((item) => ["suspected", "confirmed", "unknown"].includes(item.findingStatus)).length, 0);
    const loopholeAlertCount = runs.reduce((count, run) => count + (run.loopholeFindings || []).filter((item) => ["suspected", "confirmed", "unknown"].includes(item.findingStatus)).length, 0);
    const expected = {
      runCount: runs.length,
      confirmedBlindRunCount: runs.filter((run) => run.blindStateAtExecution === "confirmed-blind").length,
      exposedOrUnknownRunCount: runs.filter((run) => run.blindStateAtExecution !== "confirmed-blind").length,
      transcriptInspectedRunCount: runs.filter((run) => run.transcriptInspectionStatus === "inspected").length,
      contaminationAlertCount,
      loopholeAlertCount,
      verifiedRunCount: runs.filter((run) => run.evidenceStatus === "verified").length
    };
    for (const [field, value] of Object.entries(expected)) if (!sameNumber(assessment[field], value)) errors.push(`${assessment.id} ${field} must reproduce as ${value}.`);
    const dataSufficiency = runs.length >= assessment.minimumRunCount && expected.confirmedBlindRunCount === runs.length && expected.transcriptInspectedRunCount === runs.length && expected.verifiedRunCount === runs.length && protocols.every((item) => item.status === "reviewed" && item.evidenceStatus === "verified") ? "sufficient" : "insufficient";
    if (assessment.dataSufficiency !== dataSufficiency) errors.push(`${assessment.id} dataSufficiency must reproduce as ${dataSufficiency}.`);
    const signal = dataSufficiency === "insufficient" ? "insufficient-data" : contaminationAlertCount > 0 || loopholeAlertCount > 0 ? "policy-gaming-risk-observed" : "observed-no-structural-alerts";
    if (assessment.assessmentSignal !== signal) errors.push(`${assessment.id} assessmentSignal must reproduce as ${signal}.`);
    if (!Array.isArray(assessment.reviewedBy) || assessment.reviewedBy.length === 0) errors.push(`${assessment.id} reviewedBy must include at least one accountable reviewer.`);
    if (assessment.automaticSelection !== false) errors.push(`${assessment.id} automaticSelection must be false.`);
    if (assessment.interpretation !== "sequestered-replay-evidence-only-not-contamination-freedom-honesty-competence-quality-optimality-selection-authorization-or-authority") errors.push(`${assessment.id} interpretation must remain sequestered-replay-evidence-only-not-contamination-freedom-honesty-competence-quality-optimality-selection-authorization-or-authority.`);
    const triggerTypes = new Set((assessment.governanceTriggerRefs || []).map((id) => ref(triggerIndex, id, "governance trigger", assessment.id)?.triggerType));
    if (dataSufficiency === "insufficient" && !triggerTypes.has("policy-gaming-assessment-insufficient")) errors.push(`${assessment.id} insufficient policy-gaming evidence requires a policy-gaming-assessment-insufficient governance trigger.`);
    if ((contaminationAlertCount > 0 || loopholeAlertCount > 0) && !triggerTypes.has("sequestered-loophole-alert") && !triggerTypes.has("sequestered-contamination-alert")) errors.push(`${assessment.id} policy-gaming alerts require a contamination or loophole governance trigger.`);
  }

  for (const report of reports) {
    for (const field of ["title", "policyRef", "calibrationSignal", "interpretation", "status"]) str(report, field, report.id);
    const policy = ref(policyIndex, report.policyRef, "calibration policy", report.id);
    const included = Array.isArray(report.includedPairRefs) ? report.includedPairRefs.map((id) => ref(pairIndex, id, "decision-outcome pair", report.id)).filter(Boolean) : [];
    if (!Array.isArray(report.includedPairRefs) || report.includedPairRefs.length === 0) errors.push(`${report.id} includedPairRefs must include at least one pair.`);
    const excluded = Array.isArray(report.excludedPairRefs) ? report.excludedPairRefs.map((id) => ref(pairIndex, id, "excluded decision-outcome pair", report.id)).filter(Boolean) : [];
    if (!Array.isArray(report.excludedPairRefs)) errors.push(`${report.id} excludedPairRefs must be an array.`);
    for (const pair of included) if (pair.included !== true) errors.push(`${report.id} included pair ${pair.id} must have included true.`);
    for (const pair of excluded) if (pair.included !== false) errors.push(`${report.id} excluded pair ${pair.id} must have included false.`);
    if (new Set(report.includedPairRefs || []).size !== (report.includedPairRefs || []).length) errors.push(`${report.id} includedPairRefs must not contain duplicates.`);
    const expectedOriginRefs = [...new Set(included.map((pair) => pair.evidenceOriginRef))].sort();
    if (!sameSet(report.evidenceOriginRefs, expectedOriginRefs)) errors.push(`${report.id} evidenceOriginRefs must exactly match included pair evidence origins.`);
    for (const originRef of report.evidenceOriginRefs || []) ref(originIndex, originRef, "evidence origin", report.id);

    if (policy && included.length > 0) {
      const expectedBrier = round(included.reduce((sum, pair) => sum + (pair.forecastProbability - pair.outcomeValue) ** 2, 0) / included.length, policy.roundingDecimals);
      if (!sameNumber(report.brierScore, expectedBrier)) errors.push(`${report.id} brierScore must reproduce as ${expectedBrier}.`);
      const buckets = Array.isArray(report.buckets) ? report.buckets : [];
      if (!Array.isArray(report.buckets) || report.buckets.length === 0) errors.push(`${report.id} buckets must include every non-empty policy bucket.`);
      const expectedBuckets = policy.bucketDefinitions.map((definition) => ({
        definition,
        pairs: included.filter((pair) => pair.forecastProbability >= definition.lowerInclusive && pair.forecastProbability < definition.upperExclusive)
      })).filter((entry) => entry.pairs.length > 0);
      if (!sameSet(buckets.map((bucket) => bucket.bucketRef), expectedBuckets.map((entry) => entry.definition.id))) errors.push(`${report.id} buckets must exactly cover non-empty policy buckets.`);
      for (const expected of expectedBuckets) {
        const bucket = buckets.find((item) => item.bucketRef === expected.definition.id);
        if (!bucket) continue;
        const pairRefs = expected.pairs.map((pair) => pair.id);
        if (!sameSet(bucket.pairRefs, pairRefs)) errors.push(`${report.id}/${bucket.bucketRef} pairRefs do not match policy bucket membership.`);
        if (bucket.pairCount !== expected.pairs.length) errors.push(`${report.id}/${bucket.bucketRef} pairCount must reproduce as ${expected.pairs.length}.`);
        const mean = round(expected.pairs.reduce((sum, pair) => sum + pair.forecastProbability, 0) / expected.pairs.length, policy.roundingDecimals);
        const observed = round(expected.pairs.reduce((sum, pair) => sum + pair.outcomeValue, 0) / expected.pairs.length, policy.roundingDecimals);
        const gap = round(Math.abs(mean - observed), policy.roundingDecimals);
        if (!sameNumber(bucket.meanForecastProbability, mean)) errors.push(`${report.id}/${bucket.bucketRef} meanForecastProbability must reproduce as ${mean}.`);
        if (!sameNumber(bucket.observedSuccessRate, observed)) errors.push(`${report.id}/${bucket.bucketRef} observedSuccessRate must reproduce as ${observed}.`);
        if (!sameNumber(bucket.calibrationGap, gap)) errors.push(`${report.id}/${bucket.bucketRef} calibrationGap must reproduce as ${gap}.`);
      }

      const empiricalCount = included.filter((pair) => {
        const sourceOrigin = loaded.get(pair.sourcePackageRef)?.origins.get(pair.sourceEvidenceOriginRef);
        return sourceOrigin && empiricalKinds.has(sourceOrigin.originKind) && sourceOrigin.status === "verified";
      }).length;
      const boundary = report.uncertaintyBoundary;
      if (!boundary || typeof boundary !== "object") {
        errors.push(`${report.id} must include uncertaintyBoundary.`);
      } else {
        if (boundary.pairCount !== included.length) errors.push(`${report.id} uncertaintyBoundary.pairCount must reproduce as ${included.length}.`);
        if (boundary.empiricalPairCount !== empiricalCount) errors.push(`${report.id} uncertaintyBoundary.empiricalPairCount must reproduce as ${empiricalCount}.`);
        if (boundary.minimumPairCount !== policy.minimumPairCount) errors.push(`${report.id} uncertaintyBoundary.minimumPairCount must match policy.`);
        if (boundary.minimumEmpiricalPairCount !== policy.minimumEmpiricalPairCount) errors.push(`${report.id} uncertaintyBoundary.minimumEmpiricalPairCount must match policy.`);
        const expectedSufficiency = included.length < policy.minimumPairCount
          ? "insufficient"
          : empiricalCount < policy.minimumEmpiricalPairCount ? "provisional" : "sufficient";
        if (boundary.dataSufficiency !== expectedSufficiency) errors.push(`${report.id} dataSufficiency must reproduce as ${expectedSufficiency}.`);
        if (!Array.isArray(boundary.limitations) || boundary.limitations.length === 0) errors.push(`${report.id} uncertaintyBoundary.limitations must include at least one limitation.`);

        const maxGap = Math.max(...buckets.map((bucket) => bucket.calibrationGap), 0);
        const differences = buckets.map((bucket) => bucket.meanForecastProbability - bucket.observedSuccessRate).filter((difference) => Math.abs(difference) > policy.maximumAcceptableBucketGap);
        let expectedSignal;
        if (expectedSufficiency === "insufficient") expectedSignal = "insufficient-data";
        else if (expectedSufficiency === "provisional") expectedSignal = "descriptive-only";
        else if (expectedBrier <= policy.maximumAcceptableBrierScore && maxGap <= policy.maximumAcceptableBucketGap) expectedSignal = "within-policy-tolerance";
        else if (differences.length > 0 && differences.every((difference) => difference > 0)) expectedSignal = "possible-overconfidence";
        else if (differences.length > 0 && differences.every((difference) => difference < 0)) expectedSignal = "possible-underconfidence";
        else expectedSignal = "mixed";
        if (report.calibrationSignal !== expectedSignal) errors.push(`${report.id} calibrationSignal must reproduce as ${expectedSignal}.`);
      }
    }
    if (report.interpretation !== "evidence-only-not-quality-verdict") errors.push(`${report.id} interpretation must be evidence-only-not-quality-verdict.`);
    if (!Array.isArray(report.governanceTriggerRefs)) errors.push(`${report.id} governanceTriggerRefs must be an array.`);
    for (const triggerRef of report.governanceTriggerRefs || []) {
      const trigger = ref(triggerIndex, triggerRef, "governance trigger", report.id);
      if (trigger && trigger.sourceCalibrationReportRef !== report.id) errors.push(`${trigger.id} must point back to source calibration report ${report.id}.`);
    }
    const triggerTypes = new Set((report.governanceTriggerRefs || []).map((id) => triggerIndex.get(id)?.triggerType));
    if (report.uncertaintyBoundary?.dataSufficiency === "insufficient" && !triggerTypes.has("insufficient-data")) errors.push(`${report.id} insufficient data requires an insufficient-data governance trigger.`);
    if ((report.uncertaintyBoundary?.empiricalPairCount || 0) < (report.uncertaintyBoundary?.minimumEmpiricalPairCount || 0) && !triggerTypes.has("non-empirical-evidence")) errors.push(`${report.id} empirical evidence shortfall requires a non-empirical-evidence governance trigger.`);
    if (["possible-overconfidence", "possible-underconfidence", "mixed"].includes(report.calibrationSignal) && !triggerTypes.has("calibration-gap")) errors.push(`${report.id} adverse calibration signal requires a calibration-gap governance trigger.`);
  }

  for (const trigger of triggers) {
    for (const field of ["triggerType", "reason", "sourceCalibrationReportRef", "severity", "requiredAction", "owner", "status"]) str(trigger, field, trigger.id);
    ref(reportIndex, trigger.sourceCalibrationReportRef, "calibration report", trigger.id);
    if (trigger.status === "resolved" && !trigger.resultingGovernanceEventRef) errors.push(`${trigger.id} resolved trigger must include resultingGovernanceEventRef.`);
  }

  const boundary = pkg.verifierBoundary;
  if (!boundary || typeof boundary !== "object") {
    errors.push(`${packagePath} must include verifierBoundary.`);
  } else {
    for (const field of ["checks", "doesNotClaim", "semanticValidityRequires"]) {
      if (!Array.isArray(boundary[field]) || boundary[field].length === 0) errors.push(`${packagePath} verifierBoundary must include ${field}.`);
    }
    for (const claim of ["semantic truth", "that source confidence is a valid probability forecast", "a calibration statistic is quality", "an automatic quality verdict"]) {
      if (!(boundary.doesNotClaim || []).includes(claim)) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming ${claim}.`);
    }
    if (!(boundary.doesNotClaim || []).includes("that cohort coverage, balance, or size proves representativeness")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming that cohort coverage, balance, or size proves representativeness.`);
    if (!(boundary.doesNotClaim || []).includes("that consequence weights are money, objective harm, cross-policy utility, quality, or automatic authority")) errors.push(`${packagePath} verifierBoundary must explicitly bound consequence weights from money, objective harm, cross-policy utility, quality, or automatic authority.`);
    if (!(boundary.doesNotClaim || []).includes("that threshold sensitivity optimizes, ranks, selects, or authorizes policy")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming threshold sensitivity optimizes, ranks, selects, or authorizes policy.`);
    if (!(boundary.doesNotClaim || []).includes("that route volume, escalation frequency, or route outcome proves quality, competence, causality, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming route volume, escalation frequency, or route outcome proves quality, competence, causality, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that resolution speed, volume, disposition, or reviewer availability proves quality, competence, causality, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming resolution speed, volume, disposition, or reviewer availability proves quality, competence, causality, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that reviewer agreement, majority, seniority, confidence, or adjudication proves semantic truth, quality, competence, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming reviewer agreement, majority, seniority, confidence, or adjudication proves semantic truth, quality, competence, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that policy age, change count, drift count, or revalidation volume proves current quality, safety, causality, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming that policy age, change count, drift count, or revalidation volume proves current quality, safety, causality, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that feedback volume, revision acceptance, replay count, or post-revision score change proves quality, truth, competence, causality, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming that feedback volume, revision acceptance, replay count, or post-revision score change proves quality, truth, competence, causality, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that counterfactual replay count, route-change rate, or hypothesized loss-boundary direction proves observed outcome, policy quality, optimality, causality, competence, selection, authorization, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming that counterfactual replay count, route-change rate, or hypothesized loss-boundary direction proves observed outcome, policy quality, optimality, causality, competence, selection, authorization, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that judge accuracy, stability, abstention, refusal, malformed-output, or condition-sensitivity counts prove semantic truth, quality, competence, optimality, selection, authorization, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming that judge accuracy, stability, abstention, refusal, malformed-output, or condition-sensitivity counts prove semantic truth, quality, competence, optimality, selection, authorization, or authority.`);
    if (!(boundary.doesNotClaim || []).includes("that blind-run count, contamination finding, transcript inspection, loophole count, or absence of detected gaming proves contamination freedom, honesty, quality, competence, optimality, selection, authorization, or authority")) errors.push(`${packagePath} verifierBoundary must explicitly avoid claiming that sequestered replay evidence proves contamination freedom, honesty, quality, competence, optimality, selection, authorization, or authority.`);
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      packageRefs: packageRefs.length,
      evidenceOrigins: origins.length,
      calibrationPolicies: policies.length,
      decisionOutcomePairs: pairs.length,
      calibrationCohorts: cohorts.length,
      calibrationReports: reports.length,
      consequencePolicies: consequencePolicies.length,
      decisionConsequences: decisionConsequences.length,
      consequenceAssessments: consequenceAssessments.length,
      thresholdRobustnessAnalyses: thresholdRobustnessAnalyses.length,
      selectiveEscalationPolicies: selectiveEscalationPolicies.length,
      selectiveEscalationDecisions: selectiveEscalationDecisions.length,
      selectiveEscalationAssessments: selectiveEscalationAssessments.length,
      escalationResolutionPolicies: escalationResolutionPolicies.length,
      escalationResolutions: escalationResolutions.length,
      escalationResolutionAssessments: escalationResolutionAssessments.length,
      reviewerDisagreementPolicies: reviewerDisagreementPolicies.length,
      reviewerJudgments: reviewerJudgments.length,
      reviewerDisagreements: reviewerDisagreements.length,
      adjudicationOutcomes: adjudicationOutcomes.length,
      reviewerDisagreementAssessments: reviewerDisagreementAssessments.length,
      routePolicySnapshots: routePolicySnapshots.length,
      routePolicyChanges: routePolicyChanges.length,
      routePolicyDriftAssessments: routePolicyDriftAssessments.length,
      routePolicyRevalidationOutcomes: routePolicyRevalidationOutcomes.length,
      routePolicyRevalidationAssessments: routePolicyRevalidationAssessments.length,
      adjudicationFeedbackObservations: adjudicationFeedbackObservations.length,
      rubricRevisionCandidates: rubricRevisionCandidates.length,
      rubricRevisionDecisions: rubricRevisionDecisions.length,
      rubricRevisionImplementations: rubricRevisionImplementations.length,
      rubricRevisionAssessments: rubricRevisionAssessments.length,
      policyCounterfactualVariants: policyCounterfactualVariants.length,
      policyCounterfactualReplays: policyCounterfactualReplays.length,
      policyCounterfactualAssessments: policyCounterfactualAssessments.length,
      judgeConditionVariants: judgeConditionVariants.length,
      judgeRobustnessTrials: judgeRobustnessTrials.length,
      judgeRobustnessAssessments: judgeRobustnessAssessments.length,
      sequesteredReplayProtocols: sequesteredReplayProtocols.length,
      sequesteredReplayRuns: sequesteredReplayRuns.length,
      policyGamingAssessments: policyGamingAssessments.length,
      governanceTriggers: triggers.length
    }
  });
}

for (const input of inputs) {
  const pkg = readJson(path.resolve(projectRoot, input), input);
  if (pkg) validatePackage(pkg, input);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ packages: results, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF calibration report package validation passed.",
  packages: results,
  verifierBoundary: "This verifies declared structure, references, classifications, timing arithmetic, disagreement grouping, adjudication traceability, route-policy lineage, drift and revalidation traceability, rubric-feedback lineage, revision lifecycle, counterfactual same-evidence replay, hypothetical loss-boundary linkage, judge-condition evidence identity, output taxonomy, abstention review, sequestered access declarations, observed affordances, externalized transcript inspection, contamination and loophole findings, robustness summaries, rollback preservation, and policy conformance only; it does not prove probability semantics, representativeness, causality, consequence truth, calibration truth, contamination freedom, honesty, resolution quality, judge, rubric, or policy improvement, optimality, reviewer competence, semantic correctness, service availability, current quality, safety, judge or policy selection, or decision authority."
}, null, 2));
