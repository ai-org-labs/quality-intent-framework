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
  verifierBoundary: "This verifies declared structure, references, classifications, timing arithmetic, and policy conformance only; it does not prove probability semantics, representativeness, causality, consequence truth, calibration truth, resolution quality, reviewer competence, service availability, or decision authority."
}, null, 2));
