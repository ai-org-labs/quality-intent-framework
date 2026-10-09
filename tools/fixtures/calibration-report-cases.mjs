const validator = "tools/validate-calibration-report.mjs";

function policy(pkg) { return pkg.calibrationPolicies[0]; }
function pair(pkg) { return pkg.decisionOutcomePairs[0]; }
function report(pkg) { return pkg.calibrationReports[0]; }
function cohort(pkg) { return pkg.calibrationCohorts[0]; }
function consequencePolicy(pkg) { return pkg.consequencePolicies[0]; }
function decisionConsequence(pkg) { return pkg.decisionConsequences[0]; }
function consequenceAssessment(pkg) { return pkg.consequenceAssessments[0]; }
function robustness(pkg) { return pkg.thresholdRobustnessAnalyses[0]; }
function escalationPolicy(pkg) { return pkg.selectiveEscalationPolicies[0]; }
function escalationDecision(pkg) { return pkg.selectiveEscalationDecisions[0]; }
function escalationAssessment(pkg) { return pkg.selectiveEscalationAssessments[0]; }
function resolutionPolicy(pkg) { return pkg.escalationResolutionPolicies[0]; }
function resolution(pkg) { return pkg.escalationResolutions[0]; }
function resolutionAssessment(pkg) { return pkg.escalationResolutionAssessments[0]; }
function reviewerPolicy(pkg) { return pkg.reviewerDisagreementPolicies[0]; }
function reviewerJudgment(pkg, index = 0) { return pkg.reviewerJudgments[index]; }
function disagreement(pkg) { return pkg.reviewerDisagreements[0]; }
function adjudication(pkg) { return pkg.adjudicationOutcomes[0]; }
function disagreementAssessment(pkg) { return pkg.reviewerDisagreementAssessments[0]; }
function routeSnapshot(pkg, index = 0) { return pkg.routePolicySnapshots[index]; }
function routeChange(pkg) { return pkg.routePolicyChanges[0]; }
function driftAssessment(pkg) { return pkg.routePolicyDriftAssessments[0]; }
function revalidationOutcome(pkg) { return pkg.routePolicyRevalidationOutcomes[0]; }
function revalidationAssessment(pkg) { return pkg.routePolicyRevalidationAssessments[0]; }
function feedbackObservation(pkg) { return pkg.adjudicationFeedbackObservations[0]; }
function rubricCandidate(pkg) { return pkg.rubricRevisionCandidates[0]; }
function rubricDecision(pkg) { return pkg.rubricRevisionDecisions[0]; }
function rubricImplementation(pkg) { return pkg.rubricRevisionImplementations[0]; }
function rubricAssessment(pkg) { return pkg.rubricRevisionAssessments[0]; }
function counterfactualVariant(pkg) { return pkg.policyCounterfactualVariants[0]; }
function counterfactualReplay(pkg) { return pkg.policyCounterfactualReplays[0]; }
function counterfactualAssessment(pkg) { return pkg.policyCounterfactualAssessments[0]; }
function judgeVariant(pkg, index = 0) { return pkg.judgeConditionVariants[index]; }
function judgeTrial(pkg, index = 0) { return pkg.judgeRobustnessTrials[index]; }
function judgeAssessment(pkg) { return pkg.judgeRobustnessAssessments[0]; }
function sequesteredProtocol(pkg) { return pkg.sequesteredReplayProtocols[0]; }
function sequesteredRun(pkg) { return pkg.sequesteredReplayRuns[0]; }
function gamingAssessment(pkg) { return pkg.policyGamingAssessments[0]; }

export const cases = [
  { id: "sequestered-protocols-not-array", rule: "sequestered protocols required", expect: "package sequesteredReplayProtocols must be an array.", mutate: (pkg) => { pkg.sequesteredReplayProtocols = null; } },
  { id: "sequestered-runs-not-array", rule: "sequestered runs required", expect: "package sequesteredReplayRuns must be an array.", mutate: (pkg) => { pkg.sequesteredReplayRuns = null; } },
  { id: "gaming-assessments-not-array", rule: "policy gaming assessments required", expect: "package policyGamingAssessments must be an array.", mutate: (pkg) => { pkg.policyGamingAssessments = null; } },
  { id: "sequestered-trial-missing", rule: "protocol trial traceability", expect: "references missing judge robustness trial", mutate: (pkg) => { sequesteredProtocol(pkg).trialRefs[0] = "JRT-NOPE-999"; } },
  { id: "sequestered-item-count", rule: "sequestered item minimum", expect: "sequesteredItems must include at least two items.", mutate: (pkg) => { sequesteredProtocol(pkg).sequesteredItems.pop(); } },
  { id: "sequestered-item-exposure", rule: "pre-execution sequestering", expect: "every sequestered item must remain sequesteredBeforeExecution.", mutate: (pkg) => { sequesteredProtocol(pkg).sequesteredItems[0].sequesteredBeforeExecution = false; } },
  { id: "sequestered-item-evidence", rule: "sequestered access evidence", expect: "each sequestered item requires access roles and evidence.", mutate: (pkg) => { sequesteredProtocol(pkg).sequesteredItems[0].evidenceRefs = []; } },
  { id: "sequestered-required-types", rule: "label and grader sequestering", expect: "must sequester expected-label and grader-implementation.", mutate: (pkg) => { sequesteredProtocol(pkg).sequesteredItems[1].itemType = "scoring-rule"; } },
  { id: "sequestered-affordance-duplicate", rule: "affordance identity", expect: "affordances must not duplicate id EAF-CR-LOCAL.", mutate: (pkg) => { sequesteredProtocol(pkg).affordances[1].id = "EAF-CR-LOCAL"; } },
  { id: "sequestered-log-required", rule: "access log requirement", expect: "must require access logs and externalized transcripts.", mutate: (pkg) => { sequesteredProtocol(pkg).accessLogRequired = false; } },
  { id: "sequestered-hidden-reasoning", rule: "protocol privacy boundary", expect: "hiddenReasoningCollected must be false.", mutate: (pkg) => { sequesteredProtocol(pkg).hiddenReasoningCollected = true; } },
  { id: "sequestered-auto-selection", rule: "no automatic selection", expect: "automaticSelection and automaticMutation must be false.", mutate: (pkg) => { sequesteredProtocol(pkg).automaticSelection = true; } },
  { id: "sequestered-unreviewed-trigger", rule: "protocol review governance", expect: "non-reviewed protocol requires a sequestered-protocol-unreviewed governance trigger.", mutate: (pkg) => { sequesteredProtocol(pkg).status = "draft"; } },
  { id: "sequestered-protocol-evidence-trigger", rule: "protocol evidence governance", expect: "non-verified protocol evidence requires a sequestered-evidence-unverified governance trigger.", mutate: (pkg) => { sequesteredProtocol(pkg).governanceTriggerRefs = []; } },
  { id: "sequestered-run-protocol-missing", rule: "run protocol traceability", expect: "references missing sequestered replay protocol", mutate: (pkg) => { sequesteredRun(pkg).protocolRef = "SRP-NOPE-999"; } },
  { id: "sequestered-run-trial-set", rule: "run trial closure", expect: "trialRefs must exactly match its protocol trialRefs.", mutate: (pkg) => { sequesteredRun(pkg).trialRefs.pop(); } },
  { id: "sequestered-run-logs", rule: "run evidence", expect: "requires access logs and externalized transcript evidence.", mutate: (pkg) => { sequesteredRun(pkg).accessLogRefs = []; } },
  { id: "sequestered-run-affordance-missing", rule: "observed affordance resolution", expect: "references missing protocol affordance", mutate: (pkg) => { sequesteredRun(pkg).observedAffordanceRefs = ["EAF-NOPE-999"]; } },
  { id: "sequestered-run-confirmed-with-example", rule: "confirmed blind evidence", expect: "confirmed-blind requires verified access evidence and no prohibited observed affordance.", mutate: (pkg) => { sequesteredRun(pkg).blindStateAtExecution = "confirmed-blind"; } },
  { id: "sequestered-run-hidden-reasoning", rule: "run privacy boundary", expect: "hiddenReasoningCollected must be false.", mutate: (pkg) => { sequesteredRun(pkg).hiddenReasoningCollected = true; } },
  { id: "sequestered-run-boundary", rule: "evaluation validity boundary", expect: "resultBoundary must remain evaluation-validity-evidence-only-not-contamination-freedom-honesty-competence-quality-selection-authorization-or-authority.", mutate: (pkg) => { sequesteredRun(pkg).resultBoundary = "gaming-free"; } },
  { id: "sequestered-finding-evidence", rule: "finding evidence", expect: "requires evidenceRefs.", mutate: (pkg) => { sequesteredRun(pkg).contaminationFindings[0].evidenceRefs = []; } },
  { id: "sequestered-access-trigger", rule: "blindness governance", expect: "exposed, unknown, or prohibited-affordance execution requires a sequestered-access-boundary-breached governance trigger.", mutate: (pkg) => { sequesteredRun(pkg).governanceTriggerRefs = ["GTR-CR-030", "GTR-CR-032", "GTR-CR-033"]; } },
  { id: "sequestered-transcript-trigger", rule: "transcript governance", expect: "uninspected or incomplete transcript requires a sequestered-transcript-uninspected governance trigger.", mutate: (pkg) => { sequesteredRun(pkg).transcriptInspectionStatus = "not-inspected"; } },
  { id: "sequestered-contamination-trigger", rule: "contamination governance", expect: "contamination alert requires a sequestered-contamination-alert governance trigger.", mutate: (pkg) => { sequesteredRun(pkg).governanceTriggerRefs = ["GTR-CR-030", "GTR-CR-031", "GTR-CR-033"]; } },
  { id: "sequestered-loophole-trigger", rule: "loophole governance", expect: "loophole alert requires a sequestered-loophole-alert governance trigger.", mutate: (pkg) => { sequesteredRun(pkg).governanceTriggerRefs = ["GTR-CR-030", "GTR-CR-031", "GTR-CR-032"]; } },
  { id: "sequestered-run-evidence-trigger", rule: "run evidence governance", expect: "non-verified replay evidence requires a sequestered-evidence-unverified governance trigger.", mutate: (pkg) => { sequesteredRun(pkg).governanceTriggerRefs = ["GTR-CR-031", "GTR-CR-032", "GTR-CR-033"]; } },
  { id: "gaming-assessment-run-missing", rule: "assessment run traceability", expect: "references missing sequestered replay run", mutate: (pkg) => { gamingAssessment(pkg).runRefs[0] = "SRR-NOPE-999"; } },
  { id: "gaming-assessment-minimum", rule: "assessment minimum", expect: "minimumRunCount must be at least 2.", mutate: (pkg) => { gamingAssessment(pkg).minimumRunCount = 1; } },
  { id: "gaming-assessment-run-count", rule: "run count reproduction", expect: "runCount must reproduce as 1.", mutate: (pkg) => { gamingAssessment(pkg).runCount = 2; } },
  { id: "gaming-assessment-blind-count", rule: "blind count reproduction", expect: "confirmedBlindRunCount must reproduce as 0.", mutate: (pkg) => { gamingAssessment(pkg).confirmedBlindRunCount = 1; } },
  { id: "gaming-assessment-alert-count", rule: "gaming alert reproduction", expect: "loopholeAlertCount must reproduce as 1.", mutate: (pkg) => { gamingAssessment(pkg).loopholeAlertCount = 0; } },
  { id: "gaming-assessment-sufficiency", rule: "gaming sufficiency reproduction", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { gamingAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "gaming-assessment-signal", rule: "gaming signal reproduction", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { gamingAssessment(pkg).assessmentSignal = "policy-gaming-risk-observed"; } },
  { id: "gaming-assessment-reviewer", rule: "gaming assessment review", expect: "reviewedBy must include at least one accountable reviewer.", mutate: (pkg) => { gamingAssessment(pkg).reviewedBy = []; } },
  { id: "gaming-assessment-selection", rule: "no automatic gaming selection", expect: "automaticSelection must be false.", mutate: (pkg) => { gamingAssessment(pkg).automaticSelection = true; } },
  { id: "gaming-assessment-interpretation", rule: "gaming interpretation boundary", expect: "interpretation must remain sequestered-replay-evidence-only-not-contamination-freedom-honesty-competence-quality-optimality-selection-authorization-or-authority.", mutate: (pkg) => { gamingAssessment(pkg).interpretation = "gaming-free"; } },
  { id: "gaming-assessment-trigger", rule: "insufficient gaming governance", expect: "insufficient policy-gaming evidence requires a policy-gaming-assessment-insufficient governance trigger.", mutate: (pkg) => { gamingAssessment(pkg).governanceTriggerRefs = ["GTR-CR-032", "GTR-CR-033"]; } },
  { id: "gaming-boundary-overclaim", rule: "gaming semantic boundary", expect: "verifierBoundary must explicitly avoid claiming that sequestered replay evidence proves contamination freedom, honesty, quality, competence, optimality, selection, authorization, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => !claim.startsWith("that blind-run count")); } },
  { id: "judge-variants-not-array", rule: "judge condition variants required", expect: "package judgeConditionVariants must be an array.", mutate: (pkg) => { pkg.judgeConditionVariants = null; } },
  { id: "judge-trials-not-array", rule: "judge robustness trials required", expect: "package judgeRobustnessTrials must be an array.", mutate: (pkg) => { pkg.judgeRobustnessTrials = null; } },
  { id: "judge-assessments-not-array", rule: "judge robustness assessments required", expect: "package judgeRobustnessAssessments must be an array.", mutate: (pkg) => { pkg.judgeRobustnessAssessments = null; } },
  { id: "judge-variant-pair-missing", rule: "judge condition pair traceability", expect: "references missing decision-outcome pair", mutate: (pkg) => { judgeVariant(pkg).pairRef = "DOP-NOPE-999"; } },
  { id: "judge-variant-snapshot-source", rule: "judge evidence source identity", expect: "evidenceSnapshot.sourcePackageRef must reproduce the unchanged pair value.", mutate: (pkg) => { judgeVariant(pkg).evidenceSnapshot.sourcePackageRef = "PKGREF-NOPE-999"; } },
  { id: "judge-variant-snapshot-digest", rule: "judge evidence digest", expect: "evidenceSnapshot must include non-empty string evidenceDigest.", mutate: (pkg) => { judgeVariant(pkg).evidenceSnapshot.evidenceDigest = ""; } },
  { id: "judge-baseline-ref", rule: "judge baseline self-boundary", expect: "baseline condition must use null baselineVariantRef.", mutate: (pkg) => { judgeVariant(pkg).baselineVariantRef = "JCV-CR-BASE"; } },
  { id: "judge-baseline-dimensions", rule: "judge baseline dimensions", expect: "baseline condition changedDimensions must be empty.", mutate: (pkg) => { judgeVariant(pkg).changedDimensions = ["downstream-use"]; } },
  { id: "judge-comparison-baseline-missing", rule: "judge comparison baseline traceability", expect: "references missing baseline judge condition variant", mutate: (pkg) => { judgeVariant(pkg, 1).baselineVariantRef = "JCV-NOPE-999"; } },
  { id: "judge-comparison-baseline-role", rule: "judge comparison baseline role", expect: "baselineVariantRef must resolve to a baseline condition.", mutate: (pkg) => { judgeVariant(pkg).conditionRole = "comparison"; judgeVariant(pkg).baselineVariantRef = "JCV-CR-CONSEQUENCE"; } },
  { id: "judge-comparison-group", rule: "judge condition group closure", expect: "must share conditionGroupRef and pairRef with its baseline.", mutate: (pkg) => { judgeVariant(pkg, 1).conditionGroupRef = "JCG-CR-OTHER"; } },
  { id: "judge-comparison-evidence", rule: "identical judge evidence", expect: "evidenceSnapshot must be identical to its baseline condition.", mutate: (pkg) => { judgeVariant(pkg, 1).evidenceSnapshot.evidenceDigest = "sha256:different"; } },
  { id: "judge-comparison-dimensions", rule: "judge condition difference reproduction", expect: "changedDimensions must reproduce the exact baseline-to-comparison condition differences.", mutate: (pkg) => { judgeVariant(pkg, 1).changedDimensions = ["downstream-use"]; } },
  { id: "judge-variant-reviewer", rule: "judge condition review", expect: "reviewedBy must include at least one accountable reviewer.", mutate: (pkg) => { judgeVariant(pkg).reviewedBy = []; } },
  { id: "judge-variant-evidence", rule: "judge condition evidence", expect: "evidenceRefs must include at least one item.", mutate: (pkg) => { judgeVariant(pkg).evidenceRefs = []; } },
  { id: "judge-variant-boundary", rule: "judge condition authority boundary", expect: "authorizationBoundary must remain measurement-condition-only-not-judge-selection-replacement-authorization-or-policy-mutation.", mutate: (pkg) => { judgeVariant(pkg).authorizationBoundary = "select-best-judge"; } },
  { id: "judge-variant-hidden-reasoning", rule: "judge privacy boundary", expect: "hiddenReasoningCollected must be false.", mutate: (pkg) => { judgeVariant(pkg).hiddenReasoningCollected = true; } },
  { id: "judge-variant-selection", rule: "no automatic judge selection", expect: "automaticSelection and automaticMutation must be false.", mutate: (pkg) => { judgeVariant(pkg).automaticSelection = true; } },
  { id: "judge-variant-mutation", rule: "no automatic judge mutation", expect: "automaticSelection and automaticMutation must be false.", mutate: (pkg) => { judgeVariant(pkg).automaticMutation = true; } },
  { id: "judge-variant-unreviewed-trigger", rule: "unreviewed judge condition governance", expect: "non-reviewed judge condition requires a judge-condition-unreviewed governance trigger.", mutate: (pkg) => { judgeVariant(pkg).status = "draft"; } },
  { id: "judge-variant-evidence-trigger", rule: "judge condition evidence governance", expect: "non-verified judge condition evidence requires a judge-evidence-unverified governance trigger.", mutate: (pkg) => { judgeVariant(pkg).governanceTriggerRefs = []; } },
  { id: "judge-trial-variant-missing", rule: "judge trial variant traceability", expect: "references missing judge condition variant", mutate: (pkg) => { judgeTrial(pkg).variantRef = "JCV-NOPE-999"; } },
  { id: "judge-trial-group", rule: "judge trial condition closure", expect: "conditionGroupRef and pairRef must match its judge condition variant.", mutate: (pkg) => { judgeTrial(pkg).conditionGroupRef = "JCG-CR-OTHER"; } },
  { id: "judge-trial-returned-label", rule: "judge label agreement", expect: "outputClass must reproduce returnedLabel agreement with expectedLabel.", mutate: (pkg) => { judgeTrial(pkg).returnedLabel = "COMPLIANT"; } },
  { id: "judge-trial-correctness", rule: "judge classification correctness", expect: "classificationCorrect must reproduce as true.", mutate: (pkg) => { judgeTrial(pkg).classificationCorrect = false; } },
  { id: "judge-trial-classification-abstention", rule: "classification is not abstention", expect: "classification output must use a non-applicable abstention review.", mutate: (pkg) => { judgeTrial(pkg).abstentionReview.applicable = true; } },
  { id: "judge-trial-nonclassification-label", rule: "non-classification label boundary", expect: "non-classification output must use null returnedLabel.", mutate: (pkg) => { judgeTrial(pkg, 1).returnedLabel = "DECLINE_TO_LABEL"; } },
  { id: "judge-trial-abstain-unavailable", rule: "abstain availability", expect: "abstention output requires an abstain-available condition.", mutate: (pkg) => { judgeVariant(pkg, 1).abstainAvailable = false; judgeVariant(pkg, 1).changedDimensions = ["downstream-use", "consequence-framing"]; } },
  { id: "judge-trial-abstention-justification", rule: "abstention justification reproduction", expect: "abstentionReview must reproduce as unjustified.", mutate: (pkg) => { judgeTrial(pkg, 1).abstentionReview.justified = true; } },
  { id: "judge-trial-abstention-evidence", rule: "abstention review evidence", expect: "abstention review requires reviewers and evidence.", mutate: (pkg) => { judgeTrial(pkg, 1).abstentionReview.evidenceRefs = []; } },
  { id: "judge-trial-refusal-boundary", rule: "refusal is not abstention", expect: "refusal or malformed output must not be recorded as abstention.", mutate: (pkg) => { judgeTrial(pkg, 1).outputClass = "refusal"; } },
  { id: "judge-trial-hidden-reasoning", rule: "trial privacy boundary", expect: "hiddenReasoningCollected must be false.", mutate: (pkg) => { judgeTrial(pkg).hiddenReasoningCollected = true; } },
  { id: "judge-trial-evidence-trigger", rule: "judge trial evidence governance", expect: "non-verified judge trial evidence requires a judge-evidence-unverified governance trigger.", mutate: (pkg) => { judgeTrial(pkg).governanceTriggerRefs = []; } },
  { id: "judge-trial-abstention-trigger", rule: "unjustified abstention governance", expect: "unjustified abstention requires a judge-abstention-review governance trigger.", mutate: (pkg) => { judgeTrial(pkg, 1).governanceTriggerRefs = ["GTR-CR-025", "GTR-CR-026"]; } },
  { id: "judge-trial-invalid-trigger", rule: "invalid judge output governance", expect: "refusal or malformed output requires a judge-output-invalid governance trigger.", mutate: (pkg) => { const t = judgeTrial(pkg, 1); t.outputClass = "malformed-output"; t.abstentionReview = { applicable: false, justified: null, reviewerRefs: [], evidenceRefs: [] }; } },
  { id: "judge-assessment-variant-missing", rule: "judge assessment variant resolution", expect: "references missing judge condition variant", mutate: (pkg) => { judgeAssessment(pkg).variantRefs[0] = "JCV-NOPE-999"; } },
  { id: "judge-assessment-trial-missing", rule: "judge assessment trial resolution", expect: "references missing judge robustness trial", mutate: (pkg) => { judgeAssessment(pkg).trialRefs[0] = "JRT-NOPE-999"; } },
  { id: "judge-assessment-minimum", rule: "judge assessment minimum", expect: "minimumTrialCount must be at least 2.", mutate: (pkg) => { judgeAssessment(pkg).minimumTrialCount = 1; } },
  { id: "judge-assessment-variant-count", rule: "judge variant count reproduction", expect: "variantCount must reproduce as 2.", mutate: (pkg) => { judgeAssessment(pkg).variantCount = 3; } },
  { id: "judge-assessment-trial-count", rule: "judge trial count reproduction", expect: "trialCount must reproduce as 2.", mutate: (pkg) => { judgeAssessment(pkg).trialCount = 3; } },
  { id: "judge-assessment-complete-count", rule: "complete condition group reproduction", expect: "completeConditionGroupCount must reproduce as 1.", mutate: (pkg) => { judgeAssessment(pkg).completeConditionGroupCount = 0; } },
  { id: "judge-assessment-class-count", rule: "judge output count reproduction", expect: "correctClassificationCount must reproduce as 1.", mutate: (pkg) => { judgeAssessment(pkg).correctClassificationCount = 0; } },
  { id: "judge-assessment-sensitive-count", rule: "condition sensitivity reproduction", expect: "conditionSensitiveGroupCount must reproduce as 1.", mutate: (pkg) => { judgeAssessment(pkg).conditionSensitiveGroupCount = 0; } },
  { id: "judge-assessment-verified-count", rule: "verified judge trial count", expect: "verifiedTrialCount must reproduce as 0.", mutate: (pkg) => { judgeAssessment(pkg).verifiedTrialCount = 2; } },
  { id: "judge-assessment-sufficiency", rule: "judge assessment sufficiency", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { judgeAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "judge-assessment-signal", rule: "judge assessment signal", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { judgeAssessment(pkg).assessmentSignal = "consequence-sensitivity-observed"; } },
  { id: "judge-assessment-reviewer", rule: "judge assessment review", expect: "reviewedBy must include at least one accountable reviewer.", mutate: (pkg) => { judgeAssessment(pkg).reviewedBy = []; } },
  { id: "judge-assessment-selection", rule: "no automatic judge selection from assessment", expect: "automaticSelection must be false.", mutate: (pkg) => { judgeAssessment(pkg).automaticSelection = true; } },
  { id: "judge-assessment-interpretation", rule: "judge robustness interpretation boundary", expect: "interpretation must remain judge-robustness-evidence-only-not-semantic-truth-quality-competence-optimality-selection-authorization-or-authority.", mutate: (pkg) => { judgeAssessment(pkg).interpretation = "best-judge-selected"; } },
  { id: "judge-assessment-insufficient-trigger", rule: "insufficient judge evidence governance", expect: "insufficient judge robustness evidence requires a judge-assessment-insufficient governance trigger.", mutate: (pkg) => { judgeAssessment(pkg).governanceTriggerRefs = ["GTR-CR-025", "GTR-CR-026", "GTR-CR-027"]; } },
  { id: "judge-assessment-sensitive-trigger", rule: "condition sensitivity governance", expect: "condition-sensitive judge results require a judge-consequence-sensitive governance trigger.", mutate: (pkg) => { judgeAssessment(pkg).governanceTriggerRefs = ["GTR-CR-025", "GTR-CR-027", "GTR-CR-029"]; } },
  { id: "judge-assessment-abstention-trigger", rule: "assessment abstention governance", expect: "unjustified abstention requires a judge-abstention-review governance trigger.", mutate: (pkg) => { judgeAssessment(pkg).governanceTriggerRefs = ["GTR-CR-025", "GTR-CR-026", "GTR-CR-029"]; } },
  { id: "judge-boundary-overclaim", rule: "judge robustness semantic boundary", expect: "verifierBoundary must explicitly avoid claiming that judge accuracy, stability, abstention, refusal, malformed-output, or condition-sensitivity counts prove semantic truth, quality, competence, optimality, selection, authorization, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => !claim.startsWith("that judge accuracy")); } },
  { id: "counterfactual-variants-not-array", rule: "counterfactual variants required", expect: "package policyCounterfactualVariants must be an array.", mutate: (pkg) => { pkg.policyCounterfactualVariants = null; } },
  { id: "counterfactual-replays-not-array", rule: "counterfactual replays required", expect: "package policyCounterfactualReplays must be an array.", mutate: (pkg) => { pkg.policyCounterfactualReplays = null; } },
  { id: "counterfactual-assessments-not-array", rule: "counterfactual assessments required", expect: "package policyCounterfactualAssessments must be an array.", mutate: (pkg) => { pkg.policyCounterfactualAssessments = null; } },
  { id: "counterfactual-variant-baseline-missing", rule: "counterfactual baseline traceability", expect: "references missing baseline route-policy snapshot", mutate: (pkg) => { counterfactualVariant(pkg).baselineSnapshotRef = "RPS-NOPE-999"; } },
  { id: "counterfactual-variant-route-coverage", rule: "counterfactual route coverage", expect: "routes must exactly cover the baseline snapshot routes.", mutate: (pkg) => { counterfactualVariant(pkg).routes.pop(); } },
  { id: "counterfactual-variant-rule-gap", rule: "counterfactual rule continuity", expect: "routingRules must be contiguous without gaps or overlap.", mutate: (pkg) => { counterfactualVariant(pkg).routingRules[1].lowerInclusive = 0.3; } },
  { id: "counterfactual-variant-rule-end", rule: "counterfactual rule closure", expect: "routingRules must end at 1.000001", mutate: (pkg) => { counterfactualVariant(pkg).routingRules[3].upperExclusive = 1; } },
  { id: "counterfactual-variant-route-missing", rule: "counterfactual route resolution", expect: "references missing candidate route", mutate: (pkg) => { counterfactualVariant(pkg).routingRules[0].routeRef = "SER-NOPE-999"; } },
  { id: "counterfactual-variant-dimensions", rule: "counterfactual change dimensions", expect: "changedDimensions must reproduce baseline-to-candidate differences.", mutate: (pkg) => { counterfactualVariant(pkg).changedDimensions = ["authority"]; } },
  { id: "counterfactual-variant-change-coverage", rule: "counterfactual exact change coverage", expect: "changes must cover every changed dimension.", mutate: (pkg) => { counterfactualVariant(pkg).changes[0].dimension = "authority"; } },
  { id: "counterfactual-variant-change-detail", rule: "counterfactual exact change reproduction", expect: "change detail threshold/SER-CR-PROCEED does not reproduce baseline and candidate values.", mutate: (pkg) => { counterfactualVariant(pkg).changes[0].currentValue.lowerInclusive = 0.66; } },
  { id: "counterfactual-variant-reviewer", rule: "counterfactual candidate review", expect: "reviewedBy must include at least one accountable reviewer.", mutate: (pkg) => { counterfactualVariant(pkg).reviewedBy = []; } },
  { id: "counterfactual-variant-evidence", rule: "counterfactual candidate evidence", expect: "evidenceRefs must include at least one item.", mutate: (pkg) => { counterfactualVariant(pkg).evidenceRefs = []; } },
  { id: "counterfactual-variant-boundary", rule: "counterfactual candidate authority boundary", expect: "authorizationBoundary must remain reviewed-candidate-only-not-selected-authorized-or-active.", mutate: (pkg) => { counterfactualVariant(pkg).authorizationBoundary = "automatically-authorized"; } },
  { id: "counterfactual-variant-selection", rule: "no automatic candidate selection", expect: "automaticSelection and automaticMutation must be false.", mutate: (pkg) => { counterfactualVariant(pkg).automaticSelection = true; } },
  { id: "counterfactual-variant-mutation", rule: "no automatic candidate mutation", expect: "automaticSelection and automaticMutation must be false.", mutate: (pkg) => { counterfactualVariant(pkg).automaticMutation = true; } },
  { id: "counterfactual-variant-unreviewed-trigger", rule: "unreviewed candidate governance", expect: "non-reviewed candidate requires a counterfactual-variant-unreviewed governance trigger.", mutate: (pkg) => { counterfactualVariant(pkg).status = "draft"; } },
  { id: "counterfactual-replay-variant-missing", rule: "counterfactual variant resolution", expect: "references missing policy counterfactual variant", mutate: (pkg) => { counterfactualReplay(pkg).variantRef = "PCV-NOPE-999"; } },
  { id: "counterfactual-replay-decision-missing", rule: "counterfactual decision traceability", expect: "references missing selective escalation decision", mutate: (pkg) => { counterfactualReplay(pkg).decisionRef = "SED-NOPE-999"; } },
  { id: "counterfactual-replay-pair-missing", rule: "counterfactual pair traceability", expect: "references missing decision-outcome pair", mutate: (pkg) => { counterfactualReplay(pkg).pairRef = "DOP-NOPE-999"; } },
  { id: "counterfactual-replay-snapshot-mismatch", rule: "counterfactual baseline lineage", expect: "baselineSnapshotRef must match its variant.", mutate: (pkg) => { counterfactualReplay(pkg).baselineSnapshotRef = "RPS-CR-001"; } },
  { id: "counterfactual-replay-pair-mismatch", rule: "counterfactual preserved decision closure", expect: "pairRef must match the preserved decision pairRef.", mutate: (pkg) => { escalationDecision(pkg).pairRef = "DOP-NOPE-999"; } },
  { id: "counterfactual-replay-evidence-forecast", rule: "identical evidence forecast", expect: "evidenceSnapshot.forecastProbability must reproduce the unchanged pair value.", mutate: (pkg) => { counterfactualReplay(pkg).evidenceSnapshot.forecastProbability = 0.71; } },
  { id: "counterfactual-replay-evidence-origin", rule: "identical evidence origin", expect: "evidenceSnapshot.evidenceOriginRef must reproduce the unchanged pair value.", mutate: (pkg) => { counterfactualReplay(pkg).evidenceSnapshot.evidenceOriginRef = "EOR-NOPE-999"; } },
  { id: "counterfactual-replay-baseline-rule", rule: "baseline rule reproduction", expect: "baselineRuleRef must reproduce as SRR-CR-050-075.", mutate: (pkg) => { counterfactualReplay(pkg).baselineRuleRef = "SRR-CR-025-050"; } },
  { id: "counterfactual-replay-baseline-route", rule: "baseline route reproduction", expect: "baselineRouteRef must reproduce as SER-CR-HUMAN.", mutate: (pkg) => { counterfactualReplay(pkg).baselineRouteRef = "SER-CR-SPECIALIST"; } },
  { id: "counterfactual-replay-counter-rule", rule: "counterfactual rule reproduction", expect: "counterfactualRuleRef must reproduce as PCVR-CR-065-100.", mutate: (pkg) => { counterfactualReplay(pkg).counterfactualRuleRef = "PCVR-CR-050-065"; } },
  { id: "counterfactual-replay-counter-route", rule: "counterfactual route reproduction", expect: "counterfactualRouteRef must reproduce as SER-CR-PROCEED.", mutate: (pkg) => { counterfactualReplay(pkg).counterfactualRouteRef = "SER-CR-HUMAN"; } },
  { id: "counterfactual-replay-route-changed", rule: "counterfactual route-change reproduction", expect: "routeChanged must reproduce as true.", mutate: (pkg) => { counterfactualReplay(pkg).routeChanged = false; } },
  { id: "counterfactual-replay-impact-empty", rule: "counterfactual impact required", expect: "lossBoundaryImpacts must include at least one explicit impact hypothesis.", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts = []; } },
  { id: "counterfactual-replay-impact-policy", rule: "counterfactual consequence policy", expect: "references missing consequence policy", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts[0].consequencePolicyRef = "CNP-NOPE-999"; } },
  { id: "counterfactual-replay-impact-intent", rule: "counterfactual intent linkage", expect: "impact qualityIntentRef must resolve through its consequence policy.", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts[0].qualityIntentRef = "QIN-QG-002"; } },
  { id: "counterfactual-replay-impact-boundary", rule: "counterfactual loss boundary reproduction", expect: "impact lossBoundary must reproduce the consequence policy and Quality Intent.", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts[0].lossBoundary = "Different loss boundary."; } },
  { id: "counterfactual-replay-impact-severity", rule: "counterfactual severity reproduction", expect: "impact severity must reproduce the consequence policy and Quality Intent.", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts[0].severity = "medium"; } },
  { id: "counterfactual-replay-impact-evidence", rule: "counterfactual impact evidence", expect: "impact evidenceRefs must include at least one item.", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts[0].evidenceRefs = []; } },
  { id: "counterfactual-replay-impact-status", rule: "counterfactual hypothetical status", expect: "impact hypothesisStatus must remain counterfactual-not-observed.", mutate: (pkg) => { counterfactualReplay(pkg).lossBoundaryImpacts[0].hypothesisStatus = "observed"; } },
  { id: "counterfactual-replay-baseline-preserved", rule: "counterfactual baseline preservation", expect: "baselineDecisionPreserved must be true.", mutate: (pkg) => { counterfactualReplay(pkg).baselineDecisionPreserved = false; } },
  { id: "counterfactual-replay-boundary", rule: "counterfactual interpretation boundary", expect: "counterfactualBoundary must remain hypothesis-evidence-not-observed-outcome-policy-selection-or-authority.", mutate: (pkg) => { counterfactualReplay(pkg).counterfactualBoundary = "candidate-proves-best-policy"; } },
  { id: "counterfactual-replay-route-trigger", rule: "counterfactual route-change governance", expect: "route change requires a counterfactual-route-change governance trigger.", mutate: (pkg) => { counterfactualReplay(pkg).governanceTriggerRefs = ["GTR-CR-021", "GTR-CR-023"]; } },
  { id: "counterfactual-replay-loss-trigger", rule: "counterfactual loss-boundary governance", expect: "severe or uncertain loss-boundary impact requires a counterfactual-loss-boundary-review governance trigger.", mutate: (pkg) => { counterfactualReplay(pkg).governanceTriggerRefs = ["GTR-CR-021", "GTR-CR-022"]; } },
  { id: "counterfactual-replay-evidence-trigger", rule: "counterfactual evidence governance", expect: "non-verified replay evidence requires a counterfactual-evidence-unverified governance trigger.", mutate: (pkg) => { counterfactualReplay(pkg).governanceTriggerRefs = ["GTR-CR-022", "GTR-CR-023"]; } },
  { id: "counterfactual-assessment-variant-missing", rule: "counterfactual assessment variant resolution", expect: "references missing policy counterfactual variant", mutate: (pkg) => { counterfactualAssessment(pkg).variantRefs = ["PCV-NOPE-999"]; } },
  { id: "counterfactual-assessment-replay-missing", rule: "counterfactual assessment replay resolution", expect: "references missing policy counterfactual replay", mutate: (pkg) => { counterfactualAssessment(pkg).replayRefs = ["PCR-NOPE-999"]; } },
  { id: "counterfactual-assessment-minimum", rule: "counterfactual assessment minimum", expect: "minimumReplayCount must be at least 2.", mutate: (pkg) => { counterfactualAssessment(pkg).minimumReplayCount = 1; } },
  { id: "counterfactual-assessment-count", rule: "counterfactual replay count reproduction", expect: "replayCount must reproduce as 1.", mutate: (pkg) => { counterfactualAssessment(pkg).replayCount = 2; } },
  { id: "counterfactual-assessment-route-count", rule: "counterfactual route-change count", expect: "routeChangeCount must reproduce as 1.", mutate: (pkg) => { counterfactualAssessment(pkg).routeChangeCount = 0; } },
  { id: "counterfactual-assessment-impact-count", rule: "counterfactual impact count", expect: "lossBoundaryImpactCount must reproduce as 1.", mutate: (pkg) => { counterfactualAssessment(pkg).lossBoundaryImpactCount = 0; } },
  { id: "counterfactual-assessment-severe-count", rule: "counterfactual severe impact count", expect: "severeImpactCount must reproduce as 1.", mutate: (pkg) => { counterfactualAssessment(pkg).severeImpactCount = 0; } },
  { id: "counterfactual-assessment-verified-count", rule: "counterfactual verified replay count", expect: "verifiedReplayCount must reproduce as 0.", mutate: (pkg) => { counterfactualAssessment(pkg).verifiedReplayCount = 1; } },
  { id: "counterfactual-assessment-sufficiency", rule: "counterfactual data sufficiency", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { counterfactualAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "counterfactual-assessment-signal", rule: "counterfactual assessment signal", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { counterfactualAssessment(pkg).assessmentSignal = "governance-required"; } },
  { id: "counterfactual-assessment-reviewer", rule: "counterfactual assessment review", expect: "reviewedBy must include at least one accountable reviewer.", mutate: (pkg) => { counterfactualAssessment(pkg).reviewedBy = []; } },
  { id: "counterfactual-assessment-interpretation", rule: "counterfactual assessment boundary", expect: "interpretation must remain counterfactual-replay-evidence-only-not-observed-outcome-quality-optimality-causality-or-authority.", mutate: (pkg) => { counterfactualAssessment(pkg).interpretation = "candidate-is-optimal"; } },
  { id: "counterfactual-assessment-trigger", rule: "counterfactual insufficient governance", expect: "insufficient counterfactual evidence requires a counterfactual-assessment-insufficient governance trigger.", mutate: (pkg) => { counterfactualAssessment(pkg).governanceTriggerRefs = ["GTR-CR-021", "GTR-CR-022", "GTR-CR-023"]; } },
  { id: "counterfactual-boundary-overclaim", rule: "counterfactual semantic boundary", expect: "verifierBoundary must explicitly avoid claiming that counterfactual replay count, route-change rate, or hypothesized loss-boundary direction proves observed outcome, policy quality, optimality, causality, competence, selection, authorization, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that counterfactual replay count, route-change rate, or hypothesized loss-boundary direction proves observed outcome, policy quality, optimality, causality, competence, selection, authorization, or authority"); } },
  { id: "feedback-observations-not-array", rule: "adjudication feedback required", expect: "package adjudicationFeedbackObservations must be an array.", mutate: (pkg) => { pkg.adjudicationFeedbackObservations = null; } },
  { id: "rubric-candidates-not-array", rule: "rubric candidates required", expect: "package rubricRevisionCandidates must be an array.", mutate: (pkg) => { pkg.rubricRevisionCandidates = null; } },
  { id: "rubric-decisions-not-array", rule: "rubric decisions required", expect: "package rubricRevisionDecisions must be an array.", mutate: (pkg) => { pkg.rubricRevisionDecisions = null; } },
  { id: "rubric-implementations-not-array", rule: "rubric implementations required", expect: "package rubricRevisionImplementations must be an array.", mutate: (pkg) => { pkg.rubricRevisionImplementations = null; } },
  { id: "rubric-assessments-not-array", rule: "rubric assessments required", expect: "package rubricRevisionAssessments must be an array.", mutate: (pkg) => { pkg.rubricRevisionAssessments = null; } },
  { id: "feedback-policy-missing", rule: "feedback policy traceability", expect: "references missing reviewer disagreement policy", mutate: (pkg) => { feedbackObservation(pkg).affectedPolicyRef = "RDP-NOPE-999"; } },
  { id: "feedback-disagreement-missing", rule: "feedback disagreement traceability", expect: "references missing reviewer disagreement", mutate: (pkg) => { feedbackObservation(pkg).disagreementRefs = ["RDG-NOPE-999"]; } },
  { id: "feedback-adjudication-link", rule: "feedback adjudication closure", expect: "must resolve one of its source disagreements.", mutate: (pkg) => { feedbackObservation(pkg).disagreementRefs = ["RDG-NOPE-999"]; } },
  { id: "feedback-clause-missing", rule: "affected clause resolution", expect: "affected clause missingClause does not exist", mutate: (pkg) => { feedbackObservation(pkg).affectedClausePaths = ["missingClause"]; } },
  { id: "feedback-boundary-overclaim", rule: "feedback authority boundary", expect: "feedbackBoundary must remain candidate-input-not-rubric-authority.", mutate: (pkg) => { feedbackObservation(pkg).feedbackBoundary = "automatic-rubric-authority"; } },
  { id: "feedback-unverified-trigger", rule: "feedback evidence governance", expect: "non-verified feedback requires a rubric-feedback-unverified governance trigger.", mutate: (pkg) => { feedbackObservation(pkg).governanceTriggerRefs = []; } },
  { id: "candidate-observation-missing", rule: "candidate feedback traceability", expect: "references missing adjudication feedback observation", mutate: (pkg) => { rubricCandidate(pkg).feedbackObservationRefs = ["AFO-NOPE-999"]; } },
  { id: "candidate-clause-not-declared", rule: "candidate clause feedback closure", expect: "clausePath must be declared by feedback observation", mutate: (pkg) => { rubricCandidate(pkg).clausePath = "aggregationBoundary"; } },
  { id: "candidate-alternative-minimum", rule: "alternative preservation", expect: "must preserve at least two revision alternatives.", mutate: (pkg) => { rubricCandidate(pkg).alternativeRevisions = [rubricCandidate(pkg).alternativeRevisions[0]]; } },
  { id: "candidate-selected-count", rule: "single selected alternative", expect: "must have exactly one selected alternative.", mutate: (pkg) => { rubricCandidate(pkg).alternativeRevisions[1].disposition = "selected"; } },
  { id: "candidate-selected-value", rule: "selected value reproduction", expect: "proposedValue must equal the selected alternative value.", mutate: (pkg) => { rubricCandidate(pkg).proposedValue = "different-value"; } },
  { id: "candidate-rejected-preservation", rule: "rejected alternative preservation", expect: "must preserve both rejected and deferred alternatives.", mutate: (pkg) => { rubricCandidate(pkg).alternativeRevisions[1].disposition = "deferred"; } },
  { id: "candidate-replay-scope", rule: "replay source closure", expect: "replayDisagreementRefs must come from source feedback disagreements.", mutate: (pkg) => { rubricCandidate(pkg).replayDisagreementRefs = ["RDG-NOPE-999"]; } },
  { id: "candidate-dissent-source", rule: "dissent source closure", expect: "dissentRef RJG-NOPE-999 must belong to a source disagreement.", mutate: (pkg) => { rubricCandidate(pkg).dissentRefs = ["RJG-NOPE-999"]; } },
  { id: "candidate-automatic-mutation", rule: "no automatic rubric mutation", expect: "automaticMutation must be false.", mutate: (pkg) => { rubricCandidate(pkg).automaticMutation = true; } },
  { id: "decision-candidate-missing", rule: "decision candidate traceability", expect: "references missing rubric revision candidate", mutate: (pkg) => { rubricDecision(pkg).candidateRef = "RRC-NOPE-999"; } },
  { id: "decision-selected-missing", rule: "decision selected alternative", expect: "selectedAlternativeRef must resolve in its candidate.", mutate: (pkg) => { rubricDecision(pkg).selectedAlternativeRef = "RRA-NOPE-999"; } },
  { id: "decision-dissent-not-preserved", rule: "decision dissent preservation", expect: "dissentPreserved must be true.", mutate: (pkg) => { rubricDecision(pkg).dissentPreserved = false; } },
  { id: "decision-implementation-mismatch", rule: "decision implementation requirement", expect: "implementationRequired must be true exactly when decision is approved.", mutate: (pkg) => { rubricDecision(pkg).implementationRequired = false; } },
  { id: "implementation-decision-missing", rule: "implementation decision traceability", expect: "references missing rubric revision decision", mutate: (pkg) => { rubricImplementation(pkg).decisionRef = "RRD-NOPE-999"; } },
  { id: "implementation-previous-value", rule: "implementation previous value reproduction", expect: "previousValue must reproduce the candidate currentValue.", mutate: (pkg) => { rubricImplementation(pkg).previousValue = "wrong-previous"; } },
  { id: "implementation-selected-value", rule: "implementation selected value reproduction", expect: "implementedValue must reproduce the selected alternative.", mutate: (pkg) => { rubricImplementation(pkg).implementedValue = "wrong-current"; } },
  { id: "implementation-policy-fidelity", rule: "active policy clause fidelity", expect: "implementedValue must match the active policy clause.", mutate: (pkg) => { reviewerPolicy(pkg).detectionRule = "preserve-exact-verdict-rationale-evidence-and-confidence"; } },
  { id: "implementation-replay-scope", rule: "implementation replay closure", expect: "replayDisagreementRefs must match the candidate replay scope.", mutate: (pkg) => { rubricImplementation(pkg).replayDisagreementRefs = ["RDG-NOPE-999"]; } },
  { id: "implementation-history", rule: "historical judgment preservation", expect: "historicalJudgmentsPreserved must be true.", mutate: (pkg) => { rubricImplementation(pkg).historicalJudgmentsPreserved = false; } },
  { id: "implementation-automatic-mutation", rule: "implementation mutation boundary", expect: "automaticMutation must be false.", mutate: (pkg) => { rubricImplementation(pkg).automaticMutation = true; } },
  { id: "implementation-replay-trigger", rule: "incomplete replay governance", expect: "incomplete replay requires a rubric-replay-incomplete governance trigger.", mutate: (pkg) => { rubricImplementation(pkg).governanceTriggerRefs = []; } },
  { id: "rubric-assessment-count", rule: "rubric candidate count reproduction", expect: "candidateCount must reproduce as 1.", mutate: (pkg) => { rubricAssessment(pkg).candidateCount = 2; } },
  { id: "rubric-assessment-implemented", rule: "implemented count reproduction", expect: "implementedCount must reproduce as 1.", mutate: (pkg) => { rubricAssessment(pkg).implementedCount = 0; } },
  { id: "rubric-assessment-replay", rule: "completed replay count reproduction", expect: "completedReplayCount must reproduce as 0.", mutate: (pkg) => { rubricAssessment(pkg).completedReplayCount = 1; } },
  { id: "rubric-assessment-verified", rule: "verified feedback count reproduction", expect: "verifiedFeedbackCount must reproduce as 0.", mutate: (pkg) => { rubricAssessment(pkg).verifiedFeedbackCount = 1; } },
  { id: "rubric-assessment-sufficiency", rule: "rubric evidence sufficiency", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { rubricAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "rubric-assessment-signal", rule: "rubric assessment signal", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { rubricAssessment(pkg).assessmentSignal = "observed-no-structural-alerts"; } },
  { id: "rubric-assessment-trigger", rule: "insufficient rubric governance", expect: "insufficient rubric-learning evidence requires a rubric-learning-insufficient governance trigger.", mutate: (pkg) => { rubricAssessment(pkg).governanceTriggerRefs = ["GTR-CR-018", "GTR-CR-019"]; } },
  { id: "rubric-boundary-overclaim", rule: "rubric semantic boundary", expect: "verifierBoundary must explicitly avoid claiming that feedback volume, revision acceptance, replay count, or post-revision score change proves quality, truth, competence, causality, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that feedback volume, revision acceptance, replay count, or post-revision score change proves quality, truth, competence, causality, or authority"); } },
  { id: "route-snapshots-not-array", rule: "route-policy snapshots required", expect: "package routePolicySnapshots must be an array.", mutate: (pkg) => { pkg.routePolicySnapshots = null; } },
  { id: "route-changes-not-array", rule: "route-policy changes required", expect: "package routePolicyChanges must be an array.", mutate: (pkg) => { pkg.routePolicyChanges = null; } },
  { id: "route-drift-not-array", rule: "route-policy drift assessments required", expect: "package routePolicyDriftAssessments must be an array.", mutate: (pkg) => { pkg.routePolicyDriftAssessments = null; } },
  { id: "route-revalidation-outcomes-not-array", rule: "route-policy revalidation outcomes required", expect: "package routePolicyRevalidationOutcomes must be an array.", mutate: (pkg) => { pkg.routePolicyRevalidationOutcomes = null; } },
  { id: "route-revalidation-assessments-not-array", rule: "route-policy revalidation assessments required", expect: "package routePolicyRevalidationAssessments must be an array.", mutate: (pkg) => { pkg.routePolicyRevalidationAssessments = null; } },
  { id: "route-snapshot-policy-missing", rule: "snapshot policy reference", expect: "references missing selective escalation policy", mutate: (pkg) => { routeSnapshot(pkg).policyRef = "SEP-NOPE-999"; } },
  { id: "route-snapshot-history-boundary", rule: "immutable history boundary", expect: "historyBoundary must preserve immutable history without retroactive authority.", mutate: (pkg) => { routeSnapshot(pkg).historyBoundary = "latest-policy-overwrites-history"; } },
  { id: "route-snapshot-current-duplicate", rule: "single current policy snapshot", expect: "must have exactly one current route-policy snapshot.", mutate: (pkg) => { routeSnapshot(pkg).snapshotRole = "current"; delete routeSnapshot(pkg).effectiveTo; } },
  { id: "route-snapshot-version-duplicate", rule: "unique policy versions", expect: "route-policy snapshot versions must be unique.", mutate: (pkg) => { routeSnapshot(pkg, 1).version = routeSnapshot(pkg).version; } },
  { id: "route-snapshot-current-authority-mismatch", rule: "current policy fidelity", expect: "authorityRef must match the current policy.", mutate: (pkg) => { routeSnapshot(pkg, 1).routes.find((item) => item.routeRef === "SER-CR-HUMAN").authorityRef = "old-authority"; } },
  { id: "route-change-version-order", rule: "monotonic policy version", expect: "current snapshot version must be greater than previous snapshot version.", mutate: (pkg) => { routeSnapshot(pkg, 1).version = 0; } },
  { id: "route-change-continuity", rule: "continuous policy transition", expect: "effectiveAt and snapshot boundaries must form a continuous transition.", mutate: (pkg) => { routeChange(pkg).effectiveAt = "2026-10-02T00:00:00Z"; } },
  { id: "route-change-dimensions", rule: "change dimension reproduction", expect: "changedDimensions must reproduce snapshot differences.", mutate: (pkg) => { routeChange(pkg).changedDimensions = ["evidence"]; } },
  { id: "route-change-detail", rule: "exact change detail reproduction", expect: "change detail authority/SER-CR-HUMAN does not reproduce snapshot values.", mutate: (pkg) => { routeChange(pkg).changes.find((item) => item.dimension === "authority").currentValue = "wrong-authority"; } },
  { id: "route-change-automatic-mutation", rule: "human-governed policy mutation", expect: "automaticMutation must be false.", mutate: (pkg) => { routeChange(pkg).automaticMutation = true; } },
  { id: "route-drift-decision-missing", rule: "drift decision traceability", expect: "references missing selective escalation decision", mutate: (pkg) => { driftAssessment(pkg).decisionImpacts[0].decisionRef = "SED-NOPE-999"; } },
  { id: "route-drift-snapshot-mismatch", rule: "drift snapshot lineage", expect: "snapshot refs must match the policy change.", mutate: (pkg) => { driftAssessment(pkg).decisionImpacts[0].currentSnapshotRef = "RPS-CR-001"; } },
  { id: "route-drift-dimensions", rule: "affected dimension reproduction", expect: "affectedDimensions must reproduce changes to the decision route.", mutate: (pkg) => { driftAssessment(pkg).decisionImpacts[0].affectedDimensions = ["evidence"]; } },
  { id: "route-drift-material-staleness", rule: "material drift revalidation", expect: "material impact must be stale and require revalidation.", mutate: (pkg) => { driftAssessment(pkg).decisionImpacts[0].staleness = "current"; } },
  { id: "route-drift-count", rule: "drift count reproduction", expect: "materialImpactCount must reproduce as 1.", mutate: (pkg) => { driftAssessment(pkg).materialImpactCount = 0; } },
  { id: "route-drift-trigger", rule: "stale decision governance", expect: "stale material decisions require a policy-decision-stale governance trigger.", mutate: (pkg) => { driftAssessment(pkg).governanceTriggerRefs = []; } },
  { id: "route-revalidation-impact-missing", rule: "revalidation impact traceability", expect: "must resolve a decision impact in its drift assessment.", mutate: (pkg) => { revalidationOutcome(pkg).decisionRef = "SED-NOPE-999"; } },
  { id: "route-revalidation-route-missing", rule: "current route resolution", expect: "resultingRouteRef must resolve in the current snapshot.", mutate: (pkg) => { revalidationOutcome(pkg).resultingRouteRef = "SER-NOPE-999"; } },
  { id: "route-revalidation-authority", rule: "current authority reproduction", expect: "resultingAuthorityRef must match the current snapshot route authority.", mutate: (pkg) => { revalidationOutcome(pkg).resultingAuthorityRef = "old-authority"; } },
  { id: "route-revalidation-history", rule: "prior decision preservation", expect: "priorDecisionPreserved must be true.", mutate: (pkg) => { revalidationOutcome(pkg).priorDecisionPreserved = false; } },
  { id: "route-revalidation-evidence-trigger", rule: "unverified revalidation governance", expect: "non-verified revalidation evidence requires a revalidation-evidence-unverified governance trigger.", mutate: (pkg) => { revalidationOutcome(pkg).governanceTriggerRefs = []; } },
  { id: "route-revalidation-count", rule: "revalidation count reproduction", expect: "requiredCount must reproduce as 1.", mutate: (pkg) => { revalidationAssessment(pkg).requiredCount = 0; } },
  { id: "route-revalidation-sufficiency", rule: "revalidation sufficiency reproduction", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { revalidationAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "route-revalidation-signal", rule: "revalidation signal reproduction", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { revalidationAssessment(pkg).assessmentSignal = "revalidated"; } },
  { id: "route-policy-boundary-overclaim", rule: "route-policy semantic boundary", expect: "verifierBoundary must explicitly avoid claiming that policy age, change count, drift count, or revalidation volume proves current quality, safety, causality, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that policy age, change count, drift count, or revalidation volume proves current quality, safety, causality, or authority"); } },
  { id: "reviewer-policies-not-array", rule: "reviewer disagreement policies required", expect: "package reviewerDisagreementPolicies must be an array.", mutate: (pkg) => { pkg.reviewerDisagreementPolicies = null; } },
  { id: "reviewer-judgments-not-array", rule: "reviewer judgments required", expect: "package reviewerJudgments must be an array.", mutate: (pkg) => { pkg.reviewerJudgments = null; } },
  { id: "reviewer-disagreements-not-array", rule: "reviewer disagreements required", expect: "package reviewerDisagreements must be an array.", mutate: (pkg) => { pkg.reviewerDisagreements = null; } },
  { id: "adjudications-not-array", rule: "adjudication outcomes required", expect: "package adjudicationOutcomes must be an array.", mutate: (pkg) => { pkg.adjudicationOutcomes = null; } },
  { id: "reviewer-assessments-not-array", rule: "reviewer disagreement assessments required", expect: "package reviewerDisagreementAssessments must be an array.", mutate: (pkg) => { pkg.reviewerDisagreementAssessments = null; } },
  { id: "reviewer-policy-resolution-missing", rule: "reviewer policy source resolution", expect: "references missing escalation resolution policy", mutate: (pkg) => { reviewerPolicy(pkg).escalationResolutionPolicyRef = "ERP-NOPE-999"; } },
  { id: "reviewer-policy-minimum", rule: "minimum independent judgments", expect: "minimumIndependentJudgments must be at least 2.", mutate: (pkg) => { reviewerPolicy(pkg).minimumIndependentJudgments = 1; } },
  { id: "reviewer-policy-detection", rule: "exact disagreement preservation", expect: "detectionRule must preserve exact verdict, rationale, evidence, and confidence.", mutate: (pkg) => { reviewerPolicy(pkg).detectionRule = "majority-only"; } },
  { id: "reviewer-policy-aggregation", rule: "anti-majority authority boundary", expect: "aggregationBoundary must forbid automatic majority, seniority, agreement, or confidence authority.", mutate: (pkg) => { reviewerPolicy(pkg).aggregationBoundary = "majority-is-authoritative"; } },
  { id: "reviewer-policy-unreviewed", rule: "reviewer policy governance", expect: "non-active reviewer disagreement policy requires a reviewer-policy-unreviewed governance trigger.", mutate: (pkg) => { reviewerPolicy(pkg).status = "draft"; } },
  { id: "reviewer-judgment-resolution-missing", rule: "reviewer judgment case traceability", expect: "references missing escalation resolution", mutate: (pkg) => { reviewerJudgment(pkg).escalationResolutionRef = "ERS-NOPE-999"; } },
  { id: "reviewer-judgment-policy-missing", rule: "reviewer judgment policy traceability", expect: "references missing reviewer disagreement policy", mutate: (pkg) => { reviewerJudgment(pkg).policyRef = "RDP-NOPE-999"; } },
  { id: "reviewer-judgment-evidence-empty", rule: "reviewer judgment evidence", expect: "evidenceRefs must include at least one item.", mutate: (pkg) => { reviewerJudgment(pkg).evidenceRefs = []; } },
  { id: "reviewer-judgment-unverified-trigger", rule: "reviewer evidence governance", expect: "non-verified reviewer evidence requires a reviewer-evidence-unverified governance trigger.", mutate: (pkg) => { reviewerJudgment(pkg).governanceTriggerRefs = []; } },
  { id: "disagreement-minimum", rule: "minimum judgments per disagreement", expect: "judgmentRefs must satisfy minimumIndependentJudgments.", mutate: (pkg) => { disagreement(pkg).judgmentRefs = ["RJG-CR-001"]; disagreement(pkg).verdictGroups = [{ verdict: "timed-out", judgmentRefs: ["RJG-CR-001"] }]; } },
  { id: "disagreement-reviewer-reuse", rule: "reviewer independence identity", expect: "must not reuse a reviewerRef within one disagreement case.", mutate: (pkg) => { reviewerJudgment(pkg, 1).reviewerRef = reviewerJudgment(pkg, 0).reviewerRef; } },
  { id: "disagreement-independence-trigger", rule: "reviewer independence governance", expect: "unresolved reviewer independence requires a reviewer-independence-unresolved governance trigger.", mutate: (pkg) => { reviewerJudgment(pkg, 1).independenceGroup = reviewerJudgment(pkg, 0).independenceGroup; } },
  { id: "disagreement-verdict-dimension", rule: "verdict disagreement declaration", expect: "disagreementDimensions must include verdict when verdicts differ.", mutate: (pkg) => { disagreement(pkg).disagreementDimensions = ["rationale"]; } },
  { id: "disagreement-rationale-dimension", rule: "rationale disagreement declaration", expect: "disagreementDimensions must include rationale when rationales differ.", mutate: (pkg) => { disagreement(pkg).disagreementDimensions = ["verdict"]; } },
  { id: "disagreement-verdict-groups", rule: "verdict group closure", expect: "verdictGroups must exactly reproduce reviewer verdicts.", mutate: (pkg) => { disagreement(pkg).verdictGroups.pop(); } },
  { id: "disagreement-group-membership", rule: "verdict group membership", expect: "timed-out judgmentRefs must reproduce verdict membership.", mutate: (pkg) => { disagreement(pkg).verdictGroups[0].judgmentRefs = ["RJG-CR-002"]; } },
  { id: "disagreement-adjudication-missing", rule: "adjudication reference required", expect: "adjudicated disagreement requires adjudicationOutcomeRef.", mutate: (pkg) => { delete disagreement(pkg).adjudicationOutcomeRef; } },
  { id: "adjudication-backlink", rule: "adjudication backlink", expect: "disagreement must point back to this adjudication outcome.", mutate: (pkg) => { disagreement(pkg).adjudicationOutcomeRef = "ADJ-NOPE-999"; } },
  { id: "adjudication-selected-missing", rule: "selected judgment required", expect: "select-judgment mode requires selectedJudgmentRef.", mutate: (pkg) => { adjudication(pkg).adjudicationMode = "select-judgment"; } },
  { id: "adjudication-originals", rule: "original judgments preserved", expect: "originalJudgmentsPreserved must be true.", mutate: (pkg) => { adjudication(pkg).originalJudgmentsPreserved = false; } },
  { id: "adjudication-conflict-trigger", rule: "adjudicator conflict governance", expect: "adjudicator conflict requires an adjudicator-conflict governance trigger.", mutate: (pkg) => { adjudication(pkg).adjudicatorIndependenceGroup = "operations-line"; } },
  { id: "adjudication-unverified-trigger", rule: "adjudication evidence governance", expect: "non-verified adjudication evidence requires an adjudication-evidence-unverified governance trigger.", mutate: (pkg) => { adjudication(pkg).governanceTriggerRefs = []; } },
  { id: "reviewer-assessment-count", rule: "disagreement case count reproduction", expect: "disagreementCaseCount must reproduce as 1.", mutate: (pkg) => { disagreementAssessment(pkg).disagreementCaseCount = 2; } },
  { id: "reviewer-assessment-independent", rule: "independent case count reproduction", expect: "independentCaseCount must reproduce as 1.", mutate: (pkg) => { disagreementAssessment(pkg).independentCaseCount = 0; } },
  { id: "reviewer-assessment-adjudicated", rule: "adjudicated count reproduction", expect: "adjudicatedCount must reproduce as 1.", mutate: (pkg) => { disagreementAssessment(pkg).adjudicatedCount = 0; } },
  { id: "reviewer-assessment-verified", rule: "verified adjudication count reproduction", expect: "verifiedAdjudicationCount must reproduce as 0.", mutate: (pkg) => { disagreementAssessment(pkg).verifiedAdjudicationCount = 1; } },
  { id: "reviewer-assessment-sufficiency", rule: "reviewer evidence sufficiency", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { disagreementAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "reviewer-assessment-trigger", rule: "insufficient disagreement governance", expect: "insufficient disagreement evidence requires an insufficient-data governance trigger.", mutate: (pkg) => { disagreementAssessment(pkg).governanceTriggerRefs = ["GTR-CR-014", "GTR-CR-015"]; } },
  { id: "reviewer-boundary-overclaim", rule: "reviewer semantic boundary", expect: "verifierBoundary must explicitly avoid claiming reviewer agreement, majority, seniority, confidence, or adjudication proves semantic truth, quality, competence, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that reviewer agreement, majority, seniority, confidence, or adjudication proves semantic truth, quality, competence, or authority"); } },
  { id: "resolution-policies-not-array", rule: "resolution policies required", expect: "package escalationResolutionPolicies must be an array.", mutate: (pkg) => { pkg.escalationResolutionPolicies = null; } },
  { id: "resolutions-not-array", rule: "escalation resolutions required", expect: "package escalationResolutions must be an array.", mutate: (pkg) => { pkg.escalationResolutions = null; } },
  { id: "resolution-assessments-not-array", rule: "resolution assessments required", expect: "package escalationResolutionAssessments must be an array.", mutate: (pkg) => { pkg.escalationResolutionAssessments = null; } },
  { id: "resolution-policy-route-coverage", rule: "resolution route closure", expect: "routeRequirements must exactly cover selective escalation policy routes.", mutate: (pkg) => { resolutionPolicy(pkg).routeRequirements.pop(); } },
  { id: "resolution-policy-route-duplicate", rule: "resolution route uniqueness", expect: "routeRequirements must not duplicate routeRef values.", mutate: (pkg) => { resolutionPolicy(pkg).routeRequirements[0].routeRef = "SER-CR-HUMAN"; } },
  { id: "resolution-policy-route-missing", rule: "resolution route resolution", expect: "route requirement references missing escalation route", mutate: (pkg) => { resolutionPolicy(pkg).routeRequirements[0].routeRef = "SER-CR-NOPE"; } },
  { id: "resolution-policy-redirect-self", rule: "redirect source exclusion", expect: "redirectRouteRefs must not include the source route.", mutate: (pkg) => { resolutionPolicy(pkg).routeRequirements[2].redirectRouteRefs.push("SER-CR-HUMAN"); } },
  { id: "resolution-policy-limit-invalid", rule: "positive response limit", expect: "responseTimeLimitMinutes must be a positive integer.", mutate: (pkg) => { resolutionPolicy(pkg).routeRequirements[2].responseTimeLimitMinutes = 0; } },
  { id: "resolution-policy-interpretation-overclaim", rule: "timeliness evidence boundary", expect: "timelinessInterpretation must be response-time-and-availability-evidence-only-not-quality-competence-or-authority.", mutate: (pkg) => { resolutionPolicy(pkg).timelinessInterpretation = "faster-is-better-quality"; } },
  { id: "resolution-policy-unreviewed-trigger", rule: "resolution policy governance", expect: "non-active resolution policy requires a resolution-policy-unreviewed governance trigger.", mutate: (pkg) => { resolutionPolicy(pkg).status = "draft"; } },
  { id: "resolution-decision-missing", rule: "resolution decision reference", expect: "references missing selective escalation decision", mutate: (pkg) => { resolution(pkg).selectiveEscalationDecisionRef = "SED-NOPE-999"; } },
  { id: "resolution-policy-missing", rule: "resolution policy reference", expect: "references missing escalation resolution policy", mutate: (pkg) => { resolution(pkg).policyRef = "ERP-NOPE-999"; } },
  { id: "resolution-route-mismatch", rule: "actual route consistency", expect: "routeRef must equal the referenced decision actualRouteRef.", mutate: (pkg) => { resolution(pkg).routeRef = "SER-CR-DEFER"; } },
  { id: "resolution-limit-mismatch", rule: "route response limit", expect: "responseTimeLimitMinutes must match its route requirement.", mutate: (pkg) => { resolution(pkg).responseTimeLimitMinutes = 120; } },
  { id: "resolution-elapsed-mismatch", rule: "elapsed time reproduction", expect: "elapsedMinutes must reproduce as 90.", mutate: (pkg) => { resolution(pkg).elapsedMinutes = 91; } },
  { id: "resolution-within-mismatch", rule: "timeliness reproduction", expect: "withinResponseTime must reproduce as false.", mutate: (pkg) => { resolution(pkg).withinResponseTime = true; } },
  { id: "resolution-timeout-trigger-missing", rule: "timeout governance", expect: "timed-out resolution requires a resolution-timeout governance trigger.", mutate: (pkg) => { resolution(pkg).governanceTriggerRefs = resolution(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-011"); } },
  { id: "resolution-late-trigger-missing", rule: "late resolution governance", expect: "late resolution requires a resolution-time-exceeded governance trigger.", mutate: (pkg) => { resolution(pkg).governanceTriggerRefs = resolution(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-010"); } },
  { id: "resolution-availability-trigger-missing", rule: "availability governance", expect: "unmet availability requires a resolution-availability-unmet governance trigger.", mutate: (pkg) => { resolution(pkg).governanceTriggerRefs = resolution(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-013"); } },
  { id: "resolution-evidence-verifier-missing", rule: "resolution evidence verification", expect: "resolutionEvidence verifiedBy must include at least one verifier.", mutate: (pkg) => { resolution(pkg).resolutionEvidence.verifiedBy = []; } },
  { id: "resolution-evidence-trigger-missing", rule: "unverified resolution governance", expect: "non-verified resolution evidence requires a resolution-evidence-unverified governance trigger.", mutate: (pkg) => { resolution(pkg).governanceTriggerRefs = resolution(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-012"); } },
  { id: "resolution-redirect-missing", rule: "redirect target required", expect: "redirected disposition requires redirectedRouteRef.", mutate: (pkg) => { resolution(pkg).disposition = "redirected"; } },
  { id: "resolution-outcome-mismatch", rule: "resolution outcome traceability", expect: "observedOutcome must equal the referenced decision observedOutcome.", mutate: (pkg) => { resolution(pkg).observedOutcome = "protected-outcome-held"; } },
  { id: "resolution-assessment-count", rule: "resolution count reproduction", expect: "resolutionCount must reproduce as 1.", mutate: (pkg) => { resolutionAssessment(pkg).resolutionCount = 2; } },
  { id: "resolution-assessment-disposition", rule: "disposition count reproduction", expect: "dispositionCounts.timedOut must reproduce as 1.", mutate: (pkg) => { resolutionAssessment(pkg).dispositionCounts.timedOut = 0; } },
  { id: "resolution-assessment-late", rule: "late count reproduction", expect: "lateCount must reproduce as 1.", mutate: (pkg) => { resolutionAssessment(pkg).lateCount = 0; } },
  { id: "resolution-assessment-verified", rule: "verified resolution count", expect: "verifiedResolutionCount must reproduce as 0.", mutate: (pkg) => { resolutionAssessment(pkg).verifiedResolutionCount = 1; } },
  { id: "resolution-assessment-unavailable", rule: "availability count reproduction", expect: "unavailableCount must reproduce as 1.", mutate: (pkg) => { resolutionAssessment(pkg).unavailableCount = 0; } },
  { id: "resolution-assessment-sufficiency", rule: "resolution evidence sufficiency", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { resolutionAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "resolution-assessment-signal", rule: "resolution assessment signal", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { resolutionAssessment(pkg).assessmentSignal = "governance-required"; } },
  { id: "resolution-assessment-trigger", rule: "insufficient resolution governance", expect: "insufficient resolution evidence requires an insufficient-data governance trigger.", mutate: (pkg) => { resolutionAssessment(pkg).governanceTriggerRefs = resolutionAssessment(pkg).governanceTriggerRefs.filter((id) => id !== "GTR-CR-001"); } },
  { id: "resolution-boundary-overclaim", rule: "resolution verifier boundary", expect: "verifierBoundary must explicitly avoid claiming resolution speed, volume, disposition, or reviewer availability proves quality, competence, causality, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that resolution speed, volume, disposition, or reviewer availability proves quality, competence, causality, or authority"); } },
  { id: "escalation-policies-not-array", rule: "selective escalation policies required", expect: "package selectiveEscalationPolicies must be an array.", mutate: (pkg) => { pkg.selectiveEscalationPolicies = null; } },
  { id: "escalation-decisions-not-array", rule: "selective escalation decisions required", expect: "package selectiveEscalationDecisions must be an array.", mutate: (pkg) => { pkg.selectiveEscalationDecisions = null; } },
  { id: "escalation-assessments-not-array", rule: "selective escalation assessments required", expect: "package selectiveEscalationAssessments must be an array.", mutate: (pkg) => { pkg.selectiveEscalationAssessments = null; } },
  { id: "escalation-route-types-incomplete", rule: "all governed route types required", expect: "routes must define proceed, defer, human-review, and specialist-escalation exactly once.", mutate: (pkg) => { escalationPolicy(pkg).routes[0].routeType = "proceed"; } },
  { id: "escalation-rule-gap", rule: "routing interval closure", expect: "routingRules must be contiguous without gaps or overlap.", mutate: (pkg) => { escalationPolicy(pkg).routingRules[1].lowerInclusive = 0.3; } },
  { id: "escalation-rule-end", rule: "routing interval upper closure", expect: "routingRules must end at 1.000001 so probability 1 is included.", mutate: (pkg) => { escalationPolicy(pkg).routingRules[3].upperExclusive = 1; } },
  { id: "escalation-route-unreachable", rule: "every route reachable", expect: "routingRules must make every declared route reachable exactly once.", mutate: (pkg) => { escalationPolicy(pkg).routingRules[0].routeRef = "SER-CR-PROCEED"; } },
  { id: "escalation-route-volume-overclaim", rule: "route volume evidence boundary", expect: "routeVolumeInterpretation must be workload-evidence-only-not-quality-competence-or-authority.", mutate: (pkg) => { escalationPolicy(pkg).routeVolumeInterpretation = "escalation-count-is-quality"; } },
  { id: "escalation-policy-unreviewed-trigger", rule: "route policy governance", expect: "non-active route policy requires a route-policy-unreviewed governance trigger.", mutate: (pkg) => { escalationPolicy(pkg).status = "draft"; } },
  { id: "escalation-decision-forecast-mismatch", rule: "forecast reproduction", expect: "forecastProbability must equal the referenced pair forecastProbability.", mutate: (pkg) => { escalationDecision(pkg).forecastProbability = 0.6; } },
  { id: "escalation-decision-rule-mismatch", rule: "selected rule reproduction", expect: "selectedRuleRef must reproduce as SRR-CR-050-075.", mutate: (pkg) => { escalationDecision(pkg).selectedRuleRef = "SRR-CR-025-050"; } },
  { id: "escalation-decision-route-mismatch", rule: "recommended route reproduction", expect: "recommendedRouteRef must reproduce as SER-CR-HUMAN.", mutate: (pkg) => { escalationDecision(pkg).recommendedRouteRef = "SER-CR-SPECIALIST"; } },
  { id: "escalation-decision-actual-route-missing", rule: "actual route resolution", expect: "references missing actual escalation route", mutate: (pkg) => { escalationDecision(pkg).actualRouteRef = "SER-CR-NOPE"; } },
  { id: "escalation-decision-deviation-mismatch", rule: "route deviation reproduction", expect: "routeDeviation must reproduce as true.", mutate: (pkg) => { escalationDecision(pkg).actualRouteRef = "SER-CR-SPECIALIST"; escalationDecision(pkg).authorityRef = "financial-policy-specialist"; } },
  { id: "escalation-decision-authority-mismatch", rule: "actual route authority", expect: "authorityRef must equal the declared actual-route authorityRef.", mutate: (pkg) => { escalationDecision(pkg).authorityRef = "automatic-agent"; } },
  { id: "escalation-decision-outcome-mismatch", rule: "route outcome reproduction", expect: "observedOutcome must equal the referenced pair outcome.", mutate: (pkg) => { escalationDecision(pkg).observedOutcome = "protected-outcome-held"; } },
  { id: "escalation-decision-class-mismatch", rule: "route outcome classification", expect: "routeOutcomeClass must reproduce as human-review-outcome-failed.", mutate: (pkg) => { escalationDecision(pkg).routeOutcomeClass = "human-review-outcome-held"; } },
  { id: "escalation-evidence-verifier-missing", rule: "route evidence verification", expect: "routeExecutionEvidence verifiedBy must include at least one verifier.", mutate: (pkg) => { escalationDecision(pkg).routeExecutionEvidence.verifiedBy = []; } },
  { id: "escalation-evidence-trigger-missing", rule: "unverified route evidence governance", expect: "non-verified route evidence requires a route-evidence-unverified governance trigger.", mutate: (pkg) => { escalationDecision(pkg).governanceTriggerRefs = ["GTR-CR-009"]; } },
  { id: "escalation-failed-trigger-missing", rule: "failed escalation governance", expect: "failed escalated outcome requires an escalated-outcome-failed governance trigger.", mutate: (pkg) => { escalationDecision(pkg).governanceTriggerRefs = ["GTR-CR-008"]; } },
  { id: "escalation-assessment-route-coverage", rule: "route summary closure", expect: "routeSummaries must exactly cover policy routes.", mutate: (pkg) => { escalationAssessment(pkg).routeSummaries.pop(); } },
  { id: "escalation-assessment-summary-refs", rule: "route summary membership", expect: "decisionRefs must reproduce.", mutate: (pkg) => { escalationAssessment(pkg).routeSummaries[2].decisionRefs = []; } },
  { id: "escalation-assessment-summary-count", rule: "route summary count", expect: "decisionCount must reproduce as 1.", mutate: (pkg) => { escalationAssessment(pkg).routeSummaries[2].decisionCount = 0; } },
  { id: "escalation-assessment-verified-count", rule: "verified execution count", expect: "verifiedExecutionCount must reproduce as 0.", mutate: (pkg) => { escalationAssessment(pkg).verifiedExecutionCount = 1; } },
  { id: "escalation-assessment-sufficiency", rule: "route evidence sufficiency", expect: "dataSufficiency must reproduce as insufficient.", mutate: (pkg) => { escalationAssessment(pkg).dataSufficiency = "sufficient"; } },
  { id: "escalation-assessment-signal", rule: "route assessment signal", expect: "assessmentSignal must reproduce as insufficient-data.", mutate: (pkg) => { escalationAssessment(pkg).assessmentSignal = "governance-required"; } },
  { id: "escalation-assessment-trigger-missing", rule: "insufficient route evidence governance", expect: "insufficient route evidence requires an insufficient-data governance trigger.", mutate: (pkg) => { escalationAssessment(pkg).governanceTriggerRefs = ["GTR-CR-008", "GTR-CR-009"]; } },
  { id: "escalation-boundary-overclaim", rule: "selective escalation verifier boundary", expect: "verifierBoundary must explicitly avoid claiming route volume, escalation frequency, or route outcome proves quality, competence, causality, or authority.", mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "that route volume, escalation frequency, or route outcome proves quality, competence, causality, or authority"); } },
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
