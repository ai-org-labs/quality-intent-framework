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
      targets: indexById(pkg.evaluationTargets || [], `${packageRef.id}:evaluationTargets`)
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
  const reports = requiredArray(pkg, "calibrationReports");
  const triggers = requiredArray(pkg, "governanceTriggers");
  const { index: packageRefIndex, loaded } = loadPackageRefs(packageRefs, packagePath);
  const originIndex = indexById(origins, `${packagePath}:evidenceOrigins`);
  const policyIndex = indexById(policies, `${packagePath}:calibrationPolicies`);
  const pairIndex = indexById(pairs, `${packagePath}:decisionOutcomePairs`);
  const reportIndex = indexById(reports, `${packagePath}:calibrationReports`);
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
  }

  results.push({
    package: packagePath,
    packageType: pkg.packageType,
    counts: {
      packageRefs: packageRefs.length,
      evidenceOrigins: origins.length,
      calibrationPolicies: policies.length,
      decisionOutcomePairs: pairs.length,
      calibrationReports: reports.length,
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
  verifierBoundary: "This verifies declared structure, references, and arithmetic only; it does not prove probability semantics, representativeness, causality, calibration truth, or quality."
}, null, 2));
