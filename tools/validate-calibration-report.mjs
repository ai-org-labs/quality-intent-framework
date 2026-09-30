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
  verifierBoundary: "This verifies declared structure, references, classifications, and arithmetic only; it does not prove probability semantics, representativeness, causality, consequence truth, calibration truth, quality, or decision authority."
}, null, 2));
