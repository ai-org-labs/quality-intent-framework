const validator = "tools/validate-calibration-report.mjs";

function policy(pkg) { return pkg.calibrationPolicies[0]; }
function pair(pkg) { return pkg.decisionOutcomePairs[0]; }
function report(pkg) { return pkg.calibrationReports[0]; }
function cohort(pkg) { return pkg.calibrationCohorts[0]; }
function consequencePolicy(pkg) { return pkg.consequencePolicies[0]; }
function decisionConsequence(pkg) { return pkg.decisionConsequences[0]; }
function consequenceAssessment(pkg) { return pkg.consequenceAssessments[0]; }
function robustness(pkg) { return pkg.thresholdRobustnessAnalyses[0]; }

export const cases = [
  { id: "threshold-robustness-not-array", rule: "threshold robustness required", expect: "package thresholdRobustnessAnalyses must be an array.", mutate: (pkg) => { pkg.thresholdRobustnessAnalyses = null; } },
  { id: "threshold-alternative-duplicate", rule: "unique alternatives", expect: "threshold alternatives must not duplicate 0.6.", mutate: (pkg) => { robustness(pkg).thresholdAlternatives[1].threshold = 0.6; } },
  { id: "threshold-alternative-no-lower", rule: "lower alternative", expect: "threshold alternatives must include a value below the baseline.", mutate: (pkg) => { robustness(pkg).thresholdAlternatives[0].threshold = 0.7; } },
  { id: "threshold-alternative-no-upper", rule: "upper alternative", expect: "threshold alternatives must include a value above the baseline.", mutate: (pkg) => { robustness(pkg).thresholdAlternatives[1].threshold = 0.64; } },
  { id: "threshold-alternative-reviewer-missing", rule: "alternative review", expect: "reviewedBy must include at least one reviewer.", mutate: (pkg) => { robustness(pkg).thresholdAlternatives[0].reviewedBy = []; } },
  { id: "threshold-replay-coverage-mismatch", rule: "replay cartesian closure", expect: "thresholdReplays must exactly cover every baseline pair and alternative.", mutate: (pkg) => { robustness(pkg).thresholdReplays.pop(); } },
  { id: "threshold-replay-action-mismatch", rule: "alternative action reproduction", expect: "recommendedAction must reproduce as proceed.", mutate: (pkg) => { robustness(pkg).thresholdReplays[0].recommendedAction = "defer"; } },
  { id: "threshold-replay-class-mismatch", rule: "alternative consequence reproduction", expect: "consequenceClass must reproduce as false-assurance.", mutate: (pkg) => { robustness(pkg).thresholdReplays[0].consequenceClass = "aligned-proceed"; } },
  { id: "threshold-replay-weight-mismatch", rule: "alternative weight reproduction", expect: "applicableWeight must reproduce as 5.", mutate: (pkg) => { robustness(pkg).thresholdReplays[0].applicableWeight = 1; } },
  { id: "threshold-replay-error-mismatch", rule: "alternative error reproduction", expect: "weightedError must reproduce as 5.", mutate: (pkg) => { robustness(pkg).thresholdReplays[0].weightedError = 0; } },
  { id: "threshold-replay-distance-mismatch", rule: "boundary distance reproduction", expect: "distanceFromForecast must reproduce as 0.1.", mutate: (pkg) => { robustness(pkg).thresholdReplays[0].distanceFromForecast = 0.2; } },
  { id: "threshold-summary-flip-mismatch", rule: "action flip reproduction", expect: "robustnessSummary.actionFlipCount must reproduce as 1.", mutate: (pkg) => { robustness(pkg).robustnessSummary.actionFlipCount = 0; } },
  { id: "threshold-summary-pairs-mismatch", rule: "flipped pair reproduction", expect: "robustnessSummary.flippedPairRefs must reproduce.", mutate: (pkg) => { robustness(pkg).robustnessSummary.flippedPairRefs = []; } },
  { id: "threshold-summary-signal-mismatch", rule: "brittleness signal reproduction", expect: "brittlenessSignal must reproduce as insufficient-and-brittle.", mutate: (pkg) => { robustness(pkg).robustnessSummary.brittlenessSignal = "stable"; } },
  { id: "threshold-insufficient-trigger-missing", rule: "insufficient robustness governance", expect: "insufficient robustness evidence requires an insufficient-data governance trigger.", mutate: (pkg) => { robustness(pkg).governanceTriggerRefs = ["GTR-CR-007"]; } },
  { id: "threshold-brittleness-trigger-missing", rule: "brittleness governance", expect: "brittle threshold result requires a threshold-brittleness governance trigger.", mutate: (pkg) => { robustness(pkg).governanceTriggerRefs = ["GTR-CR-001"]; } },
  { id: "threshold-interpretation-overclaim", rule: "sensitivity evidence boundary", expect: "interpretation must remain sensitivity-evidence-only-not-policy-optimization-quality-or-authority.", mutate: (pkg) => { robustness(pkg).interpretation = "optimal-policy-selected"; } },
  { id: "threshold-boundary-overclaim", rule: "threshold verifier boundary", expect: "verifierBoundary must explicitly avoid claiming threshold sensitivity optimizes, ranks, selects, or authorizes policy.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that threshold sensitivity optimizes, ranks, selects, or authorizes policy"); } },
  {
    id: "consequence-policies-not-array",
    rule: "consequence policies required",
    expect: "package consequencePolicies must be an array.",
    mutate: (pkg) => { pkg.consequencePolicies = null; }
  },
  {
    id: "decision-consequences-not-array",
    rule: "decision consequences required",
    expect: "package decisionConsequences must be an array.",
    mutate: (pkg) => { pkg.decisionConsequences = null; }
  },
  {
    id: "consequence-assessments-not-array",
    rule: "consequence assessments required",
    expect: "package consequenceAssessments must be an array.",
    mutate: (pkg) => { pkg.consequenceAssessments = null; }
  },
  {
    id: "consequence-policy-source-missing",
    rule: "consequence policy source resolution",
    expect: "references missing source package",
    mutate: (pkg) => { consequencePolicy(pkg).sourcePackageRef = "PKGREF-NOPE-999"; }
  },
  {
    id: "consequence-policy-intent-missing",
    rule: "consequence policy intent resolution",
    expect: "references missing quality intent",
    mutate: (pkg) => { consequencePolicy(pkg).qualityIntentRef = "QIN-NOPE-999"; }
  },
  {
    id: "consequence-policy-boundary-mismatch",
    rule: "loss boundary reproduction",
    expect: "lossBoundary must equal the referenced quality intent lossBoundary.",
    mutate: (pkg) => { consequencePolicy(pkg).lossBoundary = "Any convenient boundary."; }
  },
  {
    id: "consequence-policy-severity-mismatch",
    rule: "loss boundary severity reproduction",
    expect: "lossBoundarySeverity must equal the referenced quality intent severity.",
    mutate: (pkg) => { consequencePolicy(pkg).lossBoundarySeverity = "medium"; }
  },
  {
    id: "consequence-policy-threshold-meaning",
    rule: "consequence threshold meaning",
    expect: "thresholdMeaning must be proceed-when-forecast-at-or-above-threshold.",
    mutate: (pkg) => { consequencePolicy(pkg).thresholdMeaning = "higher-is-better"; }
  },
  {
    id: "consequence-policy-asymmetry",
    rule: "severe false assurance priority",
    expect: "high or critical loss boundary must prioritize false assurance above false alarm.",
    mutate: (pkg) => { consequencePolicy(pkg).falseAssuranceWeight = 1; }
  },
  {
    id: "consequence-policy-weight-semantics",
    rule: "governance weight boundary",
    expect: "weightSemantics must remain policy-local-governance-priority-not-harm-or-money.",
    mutate: (pkg) => { consequencePolicy(pkg).weightSemantics = "objective-harm-value"; }
  },
  {
    id: "consequence-policy-reviewer-missing",
    rule: "consequence policy review",
    expect: "reviewedBy must include at least one accountable reviewer.",
    mutate: (pkg) => { consequencePolicy(pkg).reviewedBy = []; }
  },
  {
    id: "consequence-policy-unreviewed-trigger-missing",
    rule: "unreviewed consequence policy governance",
    expect: "non-active consequence policy requires a consequence-policy-unreviewed governance trigger.",
    mutate: (pkg) => { consequencePolicy(pkg).status = "draft"; }
  },
  {
    id: "decision-consequence-forecast-mismatch",
    rule: "decision consequence forecast reproduction",
    expect: "forecastProbability must equal the referenced pair forecastProbability.",
    mutate: (pkg) => { decisionConsequence(pkg).forecastProbability = 0.6; }
  },
  {
    id: "decision-consequence-threshold-mismatch",
    rule: "decision consequence threshold reproduction",
    expect: "actionThreshold must equal the referenced consequence policy threshold.",
    mutate: (pkg) => { decisionConsequence(pkg).actionThreshold = 0.8; }
  },
  {
    id: "decision-consequence-review-intent-mismatch",
    rule: "outcome review loss boundary linkage",
    expect: "source outcome review must identify the consequence policy quality intent.",
    mutate: (pkg) => {
      const p = consequencePolicy(pkg);
      p.qualityIntentRef = "QIN-QG-002";
      p.lossBoundary = "Valid refund claims must not be denied due to policy misconfiguration.";
      p.lossBoundarySeverity = "medium";
    }
  },
  {
    id: "decision-consequence-action-mismatch",
    rule: "threshold action reproduction",
    expect: "recommendedAction must reproduce as proceed.",
    mutate: (pkg) => { decisionConsequence(pkg).recommendedAction = "defer"; }
  },
  {
    id: "decision-consequence-outcome-mismatch",
    rule: "decision consequence outcome reproduction",
    expect: "observedOutcome must equal the referenced pair outcome.",
    mutate: (pkg) => { decisionConsequence(pkg).observedOutcome = "protected-outcome-held"; }
  },
  {
    id: "decision-consequence-class-mismatch",
    rule: "decision consequence classification",
    expect: "consequenceClass must reproduce as false-assurance.",
    mutate: (pkg) => { decisionConsequence(pkg).consequenceClass = "aligned-proceed"; }
  },
  {
    id: "decision-consequence-weight-mismatch",
    rule: "applicable weight reproduction",
    expect: "applicableWeight must reproduce as 5.",
    mutate: (pkg) => { decisionConsequence(pkg).applicableWeight = 1; }
  },
  {
    id: "decision-consequence-error-mismatch",
    rule: "weighted error reproduction",
    expect: "weightedError must reproduce as 5.",
    mutate: (pkg) => { decisionConsequence(pkg).weightedError = 0; }
  },
  {
    id: "decision-consequence-severe-trigger-missing",
    rule: "severe false assurance governance",
    expect: "severe false assurance requires a severe-false-assurance governance trigger.",
    mutate: (pkg) => { decisionConsequence(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "decision-consequence-aligned-defer-classification",
    rule: "aligned defer classification",
    expect: "consequenceClass must reproduce as aligned-defer.",
    mutate: (pkg) => {
      consequencePolicy(pkg).actionThreshold = 0.8;
      const item = decisionConsequence(pkg);
      item.actionThreshold = 0.8;
      item.recommendedAction = "defer";
      item.consequenceClass = "false-assurance";
      item.weightedError = 0;
    }
  },
  {
    id: "decision-consequence-false-alarm-classification",
    rule: "false alarm classification",
    expect: "consequenceClass must reproduce as false-alarm.",
    mutate: (pkg) => {
      pair(pkg).observedOutcome = "protected-outcome-held";
      pair(pkg).outcomeValue = 1;
      consequencePolicy(pkg).actionThreshold = 0.8;
      const item = decisionConsequence(pkg);
      item.actionThreshold = 0.8;
      item.recommendedAction = "defer";
      item.observedOutcome = "protected-outcome-held";
      item.consequenceClass = "aligned-defer";
      item.applicableWeight = 1;
      item.weightedError = 1;
    }
  },
  {
    id: "decision-consequence-aligned-proceed-classification",
    rule: "aligned proceed classification",
    expect: "consequenceClass must reproduce as aligned-proceed.",
    mutate: (pkg) => {
      pair(pkg).observedOutcome = "protected-outcome-held";
      pair(pkg).outcomeValue = 1;
      const item = decisionConsequence(pkg);
      item.observedOutcome = "protected-outcome-held";
      item.consequenceClass = "false-assurance";
      item.applicableWeight = 1;
      item.weightedError = 0;
    }
  },
  {
    id: "consequence-assessment-count-mismatch",
    rule: "consequence assessment class counts",
    expect: "falseAssuranceCount must reproduce as 1.",
    mutate: (pkg) => { consequenceAssessment(pkg).falseAssuranceCount = 0; }
  },
  {
    id: "consequence-assessment-weight-mismatch",
    rule: "consequence assessment applicable weight",
    expect: "totalApplicableWeight must reproduce as 5.",
    mutate: (pkg) => { consequenceAssessment(pkg).totalApplicableWeight = 1; }
  },
  {
    id: "consequence-assessment-error-mismatch",
    rule: "consequence assessment weighted error",
    expect: "totalWeightedError must reproduce as 5.",
    mutate: (pkg) => { consequenceAssessment(pkg).totalWeightedError = 1; }
  },
  {
    id: "consequence-assessment-rate-mismatch",
    rule: "consequence assessment weighted error rate",
    expect: "weightedErrorRate must reproduce as 1.",
    mutate: (pkg) => { consequenceAssessment(pkg).weightedErrorRate = 0.2; }
  },
  {
    id: "consequence-assessment-tolerance-mismatch",
    rule: "consequence assessment policy tolerance",
    expect: "maximumAcceptableWeightedErrorRate must match the consequence policy.",
    mutate: (pkg) => { consequenceAssessment(pkg).maximumAcceptableWeightedErrorRate = 0.3; }
  },
  {
    id: "consequence-assessment-signal-mismatch",
    rule: "consequence assessment signal",
    expect: "assessmentSignal must reproduce as insufficient-data.",
    mutate: (pkg) => { consequenceAssessment(pkg).assessmentSignal = "above-policy-tolerance"; }
  },
  {
    id: "consequence-assessment-insufficient-trigger-missing",
    rule: "insufficient consequence governance",
    expect: "insufficient consequence data requires an insufficient-data governance trigger.",
    mutate: (pkg) => { consequenceAssessment(pkg).governanceTriggerRefs = ["GTR-CR-006"]; }
  },
  {
    id: "consequence-assessment-threshold-trigger-missing",
    rule: "consequence threshold governance",
    expect: "weighted error above policy tolerance requires a consequence-threshold-exceeded governance trigger.",
    mutate: (pkg) => { consequenceAssessment(pkg).governanceTriggerRefs = ["GTR-CR-001"]; }
  },
  {
    id: "consequence-assessment-interpretation-overclaim",
    rule: "consequence assessment evidence-only interpretation",
    expect: "interpretation must be policy-local-decision-evidence-only-not-quality-or-authority.",
    mutate: (pkg) => { consequenceAssessment(pkg).interpretation = "automatic-quality-authority"; }
  },
  {
    id: "consequence-boundary-overclaim",
    rule: "consequence verifier boundary",
    expect: "verifierBoundary must explicitly bound consequence weights from money, objective harm, cross-policy utility, quality, or automatic authority.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that consequence weights are money, objective harm, cross-policy utility, quality, or automatic authority"); }
  },
  {
    id: "cohorts-not-array",
    rule: "calibration cohorts required",
    expect: "package calibrationCohorts must be an array.",
    mutate: (pkg) => { pkg.calibrationCohorts = null; }
  },
  {
    id: "cohort-eligible-decision-missing",
    rule: "eligible decision resolution",
    expect: "eligible decision references missing gate decision",
    mutate: (pkg) => { cohort(pkg).eligibleDecisions[0].gateDecisionRef = "QGD-NOPE-999"; }
  },
  {
    id: "cohort-candidate-not-eligible",
    rule: "candidate eligibility",
    expect: "candidate pair DOP-CR-001 is not backed by an eligible decision.",
    mutate: (pkg) => { cohort(pkg).eligibleDecisions = [{ sourcePackageRef: "PKGREF-CR-001", gateDecisionRef: "QGD-NOPE-999" }]; }
  },
  {
    id: "cohort-rule-operator-unsupported",
    rule: "selection rule operator",
    expect: "operator is not supported.",
    mutate: (pkg) => { cohort(pkg).selectionRules[0].operator = "approximately"; }
  },
  {
    id: "cohort-membership-mismatch",
    rule: "selection rule membership reproduction",
    expect: "includedPairRefs must reproduce from selectionRules.",
    mutate: (pkg) => { cohort(pkg).selectionRules[0].values = ["draft"]; }
  },
  {
    id: "cohort-exclusion-coverage-mismatch",
    rule: "excluded pair closure",
    expect: "excludedPairs must exactly cover rule-excluded candidates.",
    mutate: (pkg) => { cohort(pkg).selectionRules[0].values = ["draft"]; cohort(pkg).includedPairRefs = []; }
  },
  {
    id: "cohort-missing-outcome-closure",
    rule: "missing outcome closure",
    expect: "missingOutcomeDecisions must exactly cover eligible decisions without a pair.",
    mutate: (pkg) => { cohort(pkg).eligibleDecisions.push({ sourcePackageRef: "PKGREF-CR-001", gateDecisionRef: "QGD-NOPE-999" }); }
  },
  {
    id: "cohort-duplicate-groups-mismatch",
    rule: "duplicate group reproduction",
    expect: "duplicateGroups must reproduce from duplicateKeyFields.",
    mutate: (pkg) => {
      const duplicate = structuredClone(pair(pkg));
      duplicate.id = "DOP-CR-002";
      pkg.decisionOutcomePairs.push(duplicate);
      cohort(pkg).candidatePairRefs.push(duplicate.id);
      cohort(pkg).includedPairRefs.push(duplicate.id);
    }
  },
  {
    id: "cohort-independence-status-mismatch",
    rule: "independence status reproduction",
    expect: "independence status must reproduce as clear.",
    mutate: (pkg) => { cohort(pkg).independenceBoundary.status = "bounded"; }
  },
  {
    id: "cohort-segment-coverage-mismatch",
    rule: "segment summary closure",
    expect: "segmentSummaries must exactly cover included segment values.",
    mutate: (pkg) => { cohort(pkg).segmentSummaries = []; }
  },
  {
    id: "cohort-segment-pairs-mismatch",
    rule: "segment pair membership",
    expect: "pairRefs must reproduce.",
    mutate: (pkg) => { cohort(pkg).segmentSummaries[0].pairRefs = ["DOP-NOPE-999"]; }
  },
  {
    id: "cohort-segment-prevalence-mismatch",
    rule: "segment prevalence reproduction",
    expect: "outcomePrevalence must reproduce as 0.",
    mutate: (pkg) => { cohort(pkg).segmentSummaries[0].outcomePrevalence = 1; }
  },
  {
    id: "cohort-segment-count-mismatch",
    rule: "segment pair count reproduction",
    expect: "pairCount must reproduce as 1.",
    mutate: (pkg) => { cohort(pkg).segmentSummaries[0].pairCount = 2; }
  },
  {
    id: "cohort-segment-brier-mismatch",
    rule: "segment Brier reproduction",
    expect: "brierScore must reproduce as 0.49.",
    mutate: (pkg) => { cohort(pkg).segmentSummaries[0].brierScore = 0.1; }
  },
  {
    id: "cohort-segment-risk-mismatch",
    rule: "high-risk segment reproduction",
    expect: "highRisk must reproduce as true.",
    mutate: (pkg) => { cohort(pkg).segmentSummaries[0].highRisk = false; }
  },
  {
    id: "cohort-completeness-mismatch",
    rule: "cohort completeness reproduction",
    expect: "completenessSummary.coverageRate must reproduce as 1.",
    mutate: (pkg) => { cohort(pkg).completenessSummary.coverageRate = 0.5; }
  },
  {
    id: "cohort-drift-status-mismatch",
    rule: "drift baseline consistency",
    expect: "drift without baseline must have status not-assessed.",
    mutate: (pkg) => { cohort(pkg).driftAssessment.status = "stable"; }
  },
  {
    id: "cohort-high-risk-trigger-missing",
    rule: "high-risk segment governance",
    expect: "adverse high-risk segment requires a high-risk-segment-gap governance trigger.",
    mutate: (pkg) => { cohort(pkg).governanceTriggerRefs = cohort(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-003"); }
  },
  {
    id: "cohort-insufficient-trigger-missing",
    rule: "insufficient cohort governance",
    expect: "insufficient included cohort requires an insufficient-data governance trigger.",
    mutate: (pkg) => { cohort(pkg).governanceTriggerRefs = cohort(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-001"); }
  },
  {
    id: "cohort-drift-trigger-missing",
    rule: "unassessed drift governance",
    expect: "unassessed drift requires a drift-not-assessed governance trigger.",
    mutate: (pkg) => { cohort(pkg).governanceTriggerRefs = cohort(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-004"); }
  },
  {
    id: "cohort-interpretation-overclaim",
    rule: "cohort evidence-only interpretation",
    expect: "interpretation must be cohort-evidence-only-not-representativeness-or-quality.",
    mutate: (pkg) => { cohort(pkg).interpretation = "representative-quality-proof"; }
  },
  {
    id: "cohort-boundary-overclaim",
    rule: "cohort verifier boundary",
    expect: "verifierBoundary must explicitly avoid claiming that cohort coverage, balance, or size proves representativeness.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that cohort coverage, balance, or size proves representativeness"); }
  },
  {
    id: "wrong-package-type",
    rule: "package type",
    expect: "must have packageType calibration-report.",
    mutate: (pkg) => { pkg.packageType = "quality-gate"; }
  },
  {
    id: "package-path-traversal",
    rule: "repository-local package path",
    expect: "path must be repository-relative without parent traversal.",
    mutate: (pkg) => { pkg.packageRefs[0].path = "../quality-gate-package.json"; }
  },
  {
    id: "wrong-package-role",
    rule: "package role",
    expect: "role must be decision-outcome-source.",
    mutate: (pkg) => { pkg.packageRefs[0].role = "decorative-input"; }
  },
  {
    id: "unsupported-origin-kind",
    rule: "evidence origin kind",
    expect: "originKind is not supported.",
    mutate: (pkg) => { pkg.evidenceOrigins[0].originKind = "rumor"; }
  },
  {
    id: "empirical-origin-unverified",
    rule: "empirical origin verification",
    expect: "empirical evidence origin must have status verified.",
    mutate: (pkg) => { pkg.evidenceOrigins[0].originKind = "observed-operational"; pkg.evidenceOrigins[0].status = "draft"; }
  },
  {
    id: "policy-bucket-gap",
    rule: "bucket coverage",
    expect: "buckets must be contiguous without gaps or overlap.",
    mutate: (pkg) => { policy(pkg).bucketDefinitions[1].lowerInclusive = 0.55; }
  },
  {
    id: "source-confidence-mismatch",
    rule: "source confidence reproduction",
    expect: "sourceConfidence must equal the referenced gate decision confidence.",
    mutate: (pkg) => { pair(pkg).sourceConfidence = 0.6; pair(pkg).forecastProbability = 0.6; }
  },
  {
    id: "identity-transform-mismatch",
    rule: "identity transformation reproduction",
    expect: "identity transformation must preserve sourceConfidence as forecastProbability.",
    mutate: (pkg) => { pair(pkg).forecastProbability = 0.6; }
  },
  {
    id: "transformation-reviewer-missing",
    rule: "confidence transformation review",
    expect: "confidenceTransformation must include reviewedBy.",
    mutate: (pkg) => { pair(pkg).confidenceTransformation.reviewedBy = []; }
  },
  {
    id: "confidence-meaning-mismatch",
    rule: "prediction meaning alignment",
    expect: "confidenceMeaning must match a calibration policy predictionMeaning.",
    mutate: (pkg) => { pair(pkg).confidenceMeaning = "Confidence that documentation looks complete."; }
  },
  {
    id: "outcome-value-mismatch",
    rule: "outcome binary mapping",
    expect: "protected-outcome-failed requires outcomeValue 0.",
    mutate: (pkg) => { pair(pkg).outcomeValue = 1; }
  },
  {
    id: "missing-gate-decision",
    rule: "gate decision reference",
    expect: "references missing gate decision",
    mutate: (pkg) => { pair(pkg).gateDecisionRef = "QGD-NOPE-999"; }
  },
  {
    id: "source-origin-mismatch",
    rule: "source outcome provenance",
    expect: "sourceEvidenceOriginRef must equal the referenced outcome review evidenceOriginRef.",
    mutate: (pkg) => { pair(pkg).sourceEvidenceOriginRef = "EOR-NOPE-999"; }
  },
  {
    id: "outcome-rationale-missing",
    rule: "outcome interpretation rationale",
    expect: "must include non-empty string outcomeRationale.",
    mutate: (pkg) => { delete pair(pkg).outcomeRationale; }
  },
  {
    id: "observation-window-mismatch",
    rule: "outcome window reproduction",
    expect: "observationWindow must equal the referenced outcome review window.",
    mutate: (pkg) => { pair(pkg).observationWindow = "30-day"; }
  },
  {
    id: "excluded-pair-rationale-missing",
    rule: "excluded pair rationale",
    expect: "excluded pair must include exclusionRationale.",
    mutate: (pkg) => { pair(pkg).included = false; report(pkg).includedPairRefs = []; report(pkg).excludedPairRefs = [pair(pkg).id]; }
  },
  {
    id: "evidence-origin-set-mismatch",
    rule: "report evidence origin closure",
    expect: "evidenceOriginRefs must exactly match included pair evidence origins.",
    mutate: (pkg) => { report(pkg).evidenceOriginRefs = ["EOR-NOPE-999"]; }
  },
  {
    id: "brier-score-mismatch",
    rule: "Brier score reproduction",
    expect: "brierScore must reproduce as 0.49.",
    mutate: (pkg) => { report(pkg).brierScore = 0.1; }
  },
  {
    id: "bucket-membership-mismatch",
    rule: "calibration bucket membership",
    expect: "pairRefs do not match policy bucket membership.",
    mutate: (pkg) => { report(pkg).buckets[0].pairRefs = ["DOP-NOPE-999"]; }
  },
  {
    id: "bucket-mean-mismatch",
    rule: "bucket mean reproduction",
    expect: "meanForecastProbability must reproduce as 0.7.",
    mutate: (pkg) => { report(pkg).buckets[0].meanForecastProbability = 0.6; }
  },
  {
    id: "sample-count-mismatch",
    rule: "sample count reproduction",
    expect: "uncertaintyBoundary.pairCount must reproduce as 1.",
    mutate: (pkg) => { report(pkg).uncertaintyBoundary.pairCount = 2; }
  },
  {
    id: "sufficiency-mismatch",
    rule: "data sufficiency reproduction",
    expect: "dataSufficiency must reproduce as insufficient.",
    mutate: (pkg) => { report(pkg).uncertaintyBoundary.dataSufficiency = "sufficient"; }
  },
  {
    id: "signal-mismatch",
    rule: "calibration signal reproduction",
    expect: "calibrationSignal must reproduce as insufficient-data.",
    mutate: (pkg) => { report(pkg).calibrationSignal = "within-policy-tolerance"; }
  },
  {
    id: "insufficient-trigger-missing",
    rule: "insufficient data governance",
    expect: "insufficient data requires an insufficient-data governance trigger.",
    mutate: (pkg) => { report(pkg).governanceTriggerRefs = ["GTR-CR-002"]; }
  },
  {
    id: "non-empirical-trigger-missing",
    rule: "non-empirical governance",
    expect: "empirical evidence shortfall requires a non-empirical-evidence governance trigger.",
    mutate: (pkg) => { report(pkg).governanceTriggerRefs = ["GTR-CR-001"]; }
  },
  {
    id: "interpretation-overclaim",
    rule: "evidence-only interpretation",
    expect: "interpretation must be evidence-only-not-quality-verdict.",
    mutate: (pkg) => { report(pkg).interpretation = "quality-approved"; }
  },
  {
    id: "resolved-trigger-event-missing",
    rule: "governance event traceability",
    expect: "resolved trigger must include resultingGovernanceEventRef.",
    mutate: (pkg) => { pkg.governanceTriggers[0].status = "resolved"; }
  },
  {
    id: "verifier-boundary-overclaim",
    rule: "verifier semantic boundary",
    expect: "verifierBoundary must explicitly avoid claiming a calibration statistic is quality.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "a calibration statistic is quality"); }
  }
];

export const spec = {
  suiteId: "calibration-report",
  filePrefix: "calibration-report",
  basePackage: "examples/calibration-report-package.json",
  validator,
  corpusDir: "tests/fixtures/calibration-report"
};
