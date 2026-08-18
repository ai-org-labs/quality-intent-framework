// Retained negative coverage for the review-run runtime verifier.
//
// These cases protect the end-to-end QIF application path: target selection,
// applicability decisions, evidence-backed verdicts, confidence reproduction,
// governance triggers, and verifier-boundary honesty. Passing this suite proves
// structural regression resistance only; it does not prove semantic quality truth.

const validator = "tools/validate-qif-runtime.mjs";

function topArrayCase(key) {
  return {
    id: `top-level-${key}-not-array`,
    rule: `top-level ${key} must be an array`,
    expect: `package ${key} must be an array.`,
    mutate: (pkg) => { pkg[key] = null; }
  };
}

function target(pkg) { return pkg.evaluationTargets[0]; }
function intent(pkg, id = "QIN-RR-001") { return pkg.qualityIntents.find((entry) => entry.id === id); }
function rule(pkg, id = "APR-RR-001") { return pkg.applicabilityRules.find((entry) => entry.id === id); }
function decision(pkg) { return pkg.applicabilityDecisions[0]; }
function policy(pkg) { return pkg.confidencePolicies[0]; }
function evidence(pkg, id = "EVD-RR-001") { return pkg.evidenceItems.find((entry) => entry.id === id); }
function indicator(pkg) { return pkg.indicators[0]; }
function trigger(pkg, id = "GTR-RR-001") { return pkg.governanceTriggers.find((entry) => entry.id === id); }
function event(pkg) { return pkg.governanceEvents[0]; }
function run(pkg) { return pkg.reviewRuns[0]; }
function verdict(pkg, intentRef = "QIN-RR-001") {
  return run(pkg).verdicts.find((entry) => entry.intentRef === intentRef);
}

export const cases = [
  topArrayCase("evaluationTargets"),
  topArrayCase("qualityIntents"),
  topArrayCase("decisionPatterns"),
  topArrayCase("applicabilityRules"),
  topArrayCase("applicabilityDecisions"),
  topArrayCase("confidencePolicies"),
  topArrayCase("evidenceItems"),
  topArrayCase("indicators"),
  topArrayCase("governanceTriggers"),
  topArrayCase("governanceEvents"),
  topArrayCase("reviewRuns"),
  {
    id: "target-missing-stakeholder-impact",
    rule: "review target stakeholder impact required",
    expect: "TGT-RR-001 must include stakeholderImpact.",
    mutate: (pkg) => { target(pkg).stakeholderImpact = []; }
  },
  {
    id: "intent-broken-source-pattern",
    rule: "quality intent source decision pattern resolves",
    expect: "QIN-RR-001 references missing source decision pattern",
    mutate: (pkg) => { intent(pkg).sourceDecisionPatternRefs = ["PAT-NOPE-999"]; }
  },
  {
    id: "intent-direct-mode-culture-prerequisite",
    rule: "direct intent derivation must not require culture",
    expect: "QIN-RR-001 is direct-from-decision-pattern and must not require organizational culture.",
    mutate: (pkg) => { intent(pkg).organizationalCultureRef = "CUL-RR-001"; }
  },
  {
    id: "rule-broken-selected-intent",
    rule: "applicability rule selected intents resolve",
    expect: "APR-RR-001 references missing selected quality intent",
    mutate: (pkg) => { rule(pkg).selectedIntentRefs = ["QIN-NOPE-999"]; }
  },
  {
    id: "rule-broken-selected-pattern",
    rule: "applicability rule selected patterns resolve",
    expect: "APR-RR-001 references missing selected decision pattern",
    mutate: (pkg) => { rule(pkg).selectedDecisionPatternRefs = ["PAT-NOPE-999"]; }
  },
  {
    id: "rule-missing-match-conditions",
    rule: "applicability rule executable match conditions required",
    expect: "APR-RR-001 must include executable matchConditions.",
    mutate: (pkg) => { rule(pkg).matchConditions = []; }
  },
  {
    id: "rule-exclusion-conditions-not-array",
    rule: "applicability rule exclusion conditions array required",
    expect: "APR-RR-001 must include exclusionConditions array.",
    mutate: (pkg) => { rule(pkg).exclusionConditions = null; }
  },
  {
    id: "rule-condition-missing-field",
    rule: "applicability condition field required",
    expect: "APR-RR-001/MCH-RR-001 must include non-empty string field.",
    mutate: (pkg) => { delete rule(pkg).matchConditions[0].field; }
  },
  {
    id: "rule-condition-missing-expected-values",
    rule: "applicability condition expected values required",
    expect: "APR-RR-001/MCH-RR-001 must include expectedValues.",
    mutate: (pkg) => { rule(pkg).matchConditions[0].expectedValues = []; }
  },
  {
    id: "rule-duplicate-condition-id",
    rule: "applicability condition ids are unique per rule",
    expect: "APR-RR-001 has duplicate condition id MCH-RR-001.",
    mutate: (pkg) => { rule(pkg).matchConditions[1].id = "MCH-RR-001"; }
  },
  {
    id: "rule-legacy-selection-logic",
    rule: "applicability rule must be structured",
    expect: "APR-RR-001 must use structured matchConditions/exclusionConditions instead of selectionLogic.",
    mutate: (pkg) => { rule(pkg).selectionLogic = "free text"; }
  },
  {
    id: "rule-target-specific-field-forbidden",
    rule: "applicability rule must not be target-specific",
    expect: "APR-RR-001 must be reusable selection logic, not a target-specific applicability decision.",
    mutate: (pkg) => { rule(pkg).targetRef = "TGT-RR-001"; }
  },
  {
    id: "decision-broken-target-ref",
    rule: "applicability decision target resolves",
    expect: "APD-RR-001 references missing evaluation target",
    mutate: (pkg) => { decision(pkg).targetRef = "TGT-NOPE-999"; }
  },
  {
    id: "decision-broken-rule-ref",
    rule: "applicability decision rule resolves",
    expect: "APD-RR-001 references missing applicability rule",
    mutate: (pkg) => { decision(pkg).ruleRefs = ["APR-NOPE-999"]; }
  },
  {
    id: "decision-broken-matched-condition",
    rule: "applicability decision matched conditions resolve",
    expect: "APD-RR-001 references missing matched applicability condition",
    mutate: (pkg) => { decision(pkg).matchedConditionRefs = ["MCH-NOPE-999"]; }
  },
  {
    id: "decision-selected-intent-not-selected-by-rule",
    rule: "decision selected intent justified by cited rule",
    expect: "APD-RR-001 cannot both select and exclude quality intent QIN-RR-003.",
    mutate: (pkg) => { decision(pkg).selectedIntentRefs = ["QIN-RR-003"]; }
  },
  {
    id: "decision-selected-pattern-not-selected-by-rule",
    rule: "decision selected pattern justified by cited rule",
    expect: "APD-RR-001 cannot both select and exclude decision pattern PAT-RR-002.",
    mutate: (pkg) => { decision(pkg).selectedDecisionPatternRefs = ["PAT-RR-002"]; }
  },
  {
    id: "decision-matched-condition-context-mismatch",
    rule: "matched condition must match target context",
    expect: "APD-RR-001 matched condition MCH-RR-003 does not match recorded target/application context.",
    mutate: (pkg) => {
      target(pkg).operationalImpact = "Routine record completeness only";
      decision(pkg).matchedOperationalImpacts = ["routine record completeness"];
    }
  },
  {
    id: "decision-missing-selection-rationale",
    rule: "applicability decision rationale required",
    expect: "APD-RR-001 must include non-empty string selectionRationale.",
    mutate: (pkg) => { decision(pkg).selectionRationale = ""; }
  },
  {
    id: "decision-confidence-invalid",
    rule: "applicability decision confidence score",
    expect: "APD-RR-001 confidence must be a number from 0 to 1.",
    mutate: (pkg) => { decision(pkg).confidence = 2; }
  },
  {
    id: "decision-missing-matched-risk-refs",
    rule: "applicability decision matched risks required",
    expect: "APD-RR-001 must include matchedRiskRefs.",
    mutate: (pkg) => { decision(pkg).matchedRiskRefs = []; }
  },
  {
    id: "decision-excluded-intents-not-array",
    rule: "applicability decision excludedIntents array required",
    expect: "APD-RR-001 must include excludedIntents array.",
    mutate: (pkg) => { decision(pkg).excludedIntents = null; }
  },
  {
    id: "decision-excluded-patterns-not-array",
    rule: "applicability decision excludedDecisionPatterns array required",
    expect: "APD-RR-001 must include excludedDecisionPatterns array.",
    mutate: (pkg) => { decision(pkg).excludedDecisionPatterns = null; }
  },
  {
    id: "decision-exclusion-missing-rationale",
    rule: "applicability exclusion rationale required",
    expect: "APD-RR-001/excludedIntent must include non-empty string rationale.",
    mutate: (pkg) => { decision(pkg).excludedIntents[0].rationale = ""; }
  },
  {
    id: "decision-exclusion-rule-not-used",
    rule: "applicability exclusion rule must be cited by decision",
    expect: "APD-RR-001 excluded quality intent QIN-RR-003 cites rule APR-RR-002 that is not used by the decision.",
    mutate: (pkg) => { decision(pkg).ruleRefs = ["APR-RR-001"]; }
  },
  {
    id: "decision-exclusion-missing-condition",
    rule: "applicability exclusion condition resolves",
    expect: "APD-RR-001 excluded quality intent QIN-RR-003 cites missing exclusion condition EXC-NOPE-999.",
    mutate: (pkg) => { decision(pkg).excludedIntents[0].conditionRef = "EXC-NOPE-999"; }
  },
  {
    id: "decision-exclusion-condition-does-not-exclude-intent",
    rule: "applicability exclusion condition declares excluded intent",
    expect: "APD-RR-001 exclusion condition EXC-RR-001 does not exclude intent QIN-RR-003.",
    mutate: (pkg) => { rule(pkg, "APR-RR-002").exclusionConditions[0].excludedIntentRefs = []; }
  },
  {
    id: "decision-selects-and-excludes-same-intent",
    rule: "applicability decision cannot select and exclude same intent",
    expect: "APD-RR-001 cannot both select and exclude quality intent QIN-RR-003.",
    mutate: (pkg) => {
      decision(pkg).selectedIntentRefs = ["QIN-RR-001", "QIN-RR-002", "QIN-RR-003"];
      rule(pkg, "APR-RR-002").selectedIntentRefs = ["QIN-RR-003"];
    }
  },
  {
    id: "policy-missing-verdict-aggregation-rule",
    rule: "confidence policy verdict aggregation rule required",
    expect: "CFP-RR-001 must include non-empty string verdictAggregationRule.",
    mutate: (pkg) => { policy(pkg).verdictAggregationRule = ""; }
  },
  {
    id: "evidence-broken-target-ref",
    rule: "evidence target resolves",
    expect: "EVD-RR-001 references missing evaluation target",
    mutate: (pkg) => { evidence(pkg).targetRef = "TGT-NOPE-999"; }
  },
  {
    id: "evidence-missing-finding",
    rule: "evidence finding required",
    expect: "EVD-RR-001 must include non-empty string finding.",
    mutate: (pkg) => { evidence(pkg).finding = ""; }
  },
  {
    id: "evidence-confidence-invalid",
    rule: "evidence confidence score",
    expect: "EVD-RR-001 confidence must be a number from 0 to 1.",
    mutate: (pkg) => { evidence(pkg).confidence = -0.1; }
  },
  {
    id: "evidence-weight-invalid",
    rule: "evidence weight positive",
    expect: "EVD-RR-001 weight must be a positive number.",
    mutate: (pkg) => { evidence(pkg).weight = 0; }
  },
  {
    id: "indicator-activity-count-quality-itself",
    rule: "activity counts must remain evidence-only",
    expect: "IND-RR-001 is an activity-count metric but is not evidence-only.",
    mutate: (pkg) => { indicator(pkg).interpretation = "quality-itself"; }
  },
  {
    id: "governance-trigger-missing-owner",
    rule: "governance trigger owner required",
    expect: "GTR-RR-001 must include non-empty string owner.",
    mutate: (pkg) => { trigger(pkg).owner = ""; }
  },
  {
    id: "governance-trigger-broken-source-run",
    rule: "governance trigger source review run resolves",
    expect: "GTR-RR-001 references missing source review run",
    mutate: (pkg) => { trigger(pkg).sourceReviewRunRef = "RRN-NOPE-999"; }
  },
  {
    id: "governance-trigger-closed-without-event",
    rule: "closed governance trigger links resulting event",
    expect: "GTR-RR-001 is not open and must link to a resultingGovernanceEventRef.",
    mutate: (pkg) => { trigger(pkg).status = "reviewed"; }
  },
  {
    id: "governance-event-points-to-different-trigger",
    rule: "governance event backlink matches trigger",
    expect: "GTR-RR-003 resulting governance event GEV-RR-001 points to a different trigger.",
    mutate: (pkg) => { event(pkg).sourceGovernanceTriggerRef = "GTR-RR-001"; }
  },
  {
    id: "verifier-boundary-missing",
    rule: "verifier boundary required",
    expect: "must include verifierBoundary.",
    mutate: (pkg) => { delete pkg.verifierBoundary; }
  },
  {
    id: "verifier-boundary-claims-semantic-truth",
    rule: "verifier boundary avoids semantic truth",
    expect: "verifierBoundary must explicitly avoid claiming semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["expert correctness"]; }
  },
  {
    id: "run-broken-target-ref",
    rule: "review run target resolves",
    expect: "RRN-001 references missing evaluation target",
    mutate: (pkg) => { run(pkg).targetRef = "TGT-NOPE-999"; }
  },
  {
    id: "run-rule-not-used-by-decisions",
    rule: "review run rule justified by applicability decisions",
    expect: "RRN-001 applicability rule APR-RR-002 is not used by its applicability decisions.",
    mutate: (pkg) => { decision(pkg).ruleRefs = ["APR-RR-001"]; }
  },
  {
    id: "run-selected-intent-not-by-decision",
    rule: "review run selected intent justified by decision",
    expect: "RRN-001 selected quality intent QIN-RR-003 is not selected by an applicability decision.",
    mutate: (pkg) => { run(pkg).selectedIntentRefs = ["QIN-RR-003"]; }
  },
  {
    id: "run-selected-intent-excluded-by-decision",
    rule: "review run selected intent cannot be excluded",
    expect: "RRN-001 selected quality intent QIN-RR-003 was also excluded by an applicability decision.",
    mutate: (pkg) => {
      run(pkg).selectedIntentRefs = ["QIN-RR-001", "QIN-RR-002", "QIN-RR-003"];
      decision(pkg).selectedIntentRefs = ["QIN-RR-001", "QIN-RR-002", "QIN-RR-003"];
      rule(pkg, "APR-RR-002").selectedIntentRefs = ["QIN-RR-003"];
    }
  },
  {
    id: "run-selected-pattern-not-by-decision",
    rule: "review run selected pattern justified by decision",
    expect: "RRN-001 selected decision pattern PAT-RR-002 is not selected by an applicability decision.",
    mutate: (pkg) => { run(pkg).selectedDecisionPatternRefs = ["PAT-RR-002"]; }
  },
  {
    id: "run-missing-verdicts",
    rule: "review run verdicts required",
    expect: "RRN-001 must include verdicts.",
    mutate: (pkg) => { run(pkg).verdicts = []; }
  },
  {
    id: "verdict-broken-evidence-ref",
    rule: "verdict evidence resolves",
    expect: "RRN-001/verdict references missing evidence",
    mutate: (pkg) => { verdict(pkg).evidenceRefs = ["EVD-NOPE-999"]; }
  },
  {
    id: "verdict-confidence-not-reproduced",
    rule: "verdict confidence reproduces from evidence inputs",
    expect: "RRN-001/verdict/QIN-RR-001 confidence must reproduce from evidence inputs and policy CFP-RR-001: 0.52.",
    mutate: (pkg) => { verdict(pkg).confidence = 0.99; }
  },
  {
    id: "run-confidence-not-reproduced",
    rule: "review run confidence reproduces from verdicts",
    expect: "RRN-001 confidence must reproduce from evidence inputs, verdict aggregation, and review-run policy CFP-RR-001: 0.49.",
    mutate: (pkg) => { run(pkg).confidence = 0.99; }
  },
  {
    id: "run-missing-governance-for-low-or-conflict",
    rule: "low confidence or conflicting evidence triggers governance",
    expect: "RRN-001 must trigger governance review when confidence is low or evidence conflicts.",
    mutate: (pkg) => { run(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "run-missing-low-confidence-trigger",
    rule: "low confidence trigger type required",
    expect: "RRN-001 must include a low-confidence governance trigger.",
    mutate: (pkg) => { run(pkg).governanceTriggerRefs = ["GTR-RR-002", "GTR-RR-003"]; }
  },
  {
    id: "run-missing-conflicting-evidence-trigger",
    rule: "conflicting evidence trigger type required",
    expect: "RRN-001 must include a conflicting-evidence governance trigger.",
    mutate: (pkg) => { run(pkg).governanceTriggerRefs = ["GTR-RR-001", "GTR-RR-002"]; }
  },
  {
    id: "run-missing-context-mismatch-trigger",
    rule: "context mismatch trigger type required",
    expect: "RRN-001 must include a context-mismatch governance trigger when applicability decisions record context mismatches.",
    mutate: (pkg) => { run(pkg).governanceTriggerRefs = ["GTR-RR-001", "GTR-RR-003"]; }
  },
  {
    id: "run-missing-residual-risks",
    rule: "review run residual risks required",
    expect: "RRN-001 must include residualRisks.",
    mutate: (pkg) => { run(pkg).residualRisks = []; }
  },
  {
    id: "run-missing-recommendations",
    rule: "review run recommendations required",
    expect: "RRN-001 must include recommendations.",
    mutate: (pkg) => { run(pkg).recommendations = []; }
  },
  {
    id: "run-broken-governance-trigger-ref",
    rule: "review run governance trigger refs resolve",
    expect: "RRN-001 references missing governance trigger",
    mutate: (pkg) => { run(pkg).governanceTriggerRefs = ["GTR-NOPE-999"]; }
  }
];

export const spec = {
  suiteId: "review-run",
  basePackage: "examples/review-run-package.json",
  validator,
  corpusDir: "tests/fixtures/review-run",
  filePrefix: "review-run"
};
