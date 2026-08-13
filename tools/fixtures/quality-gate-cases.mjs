// Negative fixture cases for the quality-gate runtime verifier.
//
// Each case starts from the valid example package and applies one targeted
// mutation that must make the verifier fail. The `expect` substring is the
// evidence that the intended rule — not some unrelated rule — fired.
//
// Design contract (QIF Roadmap Phase 1): every distinct verifier rule in
// validateQualityGatePackage must have at least one case here. A rule with no
// failing case is treated as unproven. The runner also fails if any case's
// expected error stops appearing, which catches a rule that silently breaks.
//
// Mutations may produce extra, incidental errors; that is acceptable. The
// runner only asserts that the targeted `expect` substring is present, because
// the verifier accumulates all errors rather than stopping at the first.

const validator = "tools/validate-qif-runtime.mjs";

function intent(pkg, id) {
  return pkg.qualityIntents.find((entry) => entry.id === id);
}
function evidence(pkg, id) {
  return pkg.evidenceItems.find((entry) => entry.id === id);
}
function decision(pkg) {
  return pkg.qualityGateDecisions[0];
}
function verdict(pkg, intentRef) {
  return decision(pkg).intentVerdicts.find((entry) => entry.intentRef === intentRef);
}

export const cases = [
  // ---- Target / intent / perspective structure ----
  {
    id: "target-missing-domain",
    rule: "evaluation target required fields",
    expect: "must include non-empty string domain",
    mutate: (pkg) => { delete pkg.evaluationTargets[0].domain; }
  },
  {
    id: "target-missing-stakeholders",
    rule: "evaluation target stakeholder impact",
    expect: "must include stakeholderImpact.",
    mutate: (pkg) => { pkg.evaluationTargets[0].stakeholderImpact = []; }
  },
  {
    id: "intent-missing-severity",
    rule: "quality intent loss boundary severity",
    expect: "must include non-empty string lossBoundarySeverity.",
    mutate: (pkg) => { delete intent(pkg, "QIN-QG-001").lossBoundarySeverity; }
  },
  {
    id: "perspective-unsupported",
    rule: "canonical evaluation perspective",
    expect: "uses unsupported evaluation perspective",
    mutate: (pkg) => { pkg.evaluationPerspectives[0].perspective = "vibes"; }
  },
  {
    id: "perspective-broken-intent-ref",
    rule: "perspective linked intent resolves",
    expect: "references missing quality intent",
    mutate: (pkg) => { pkg.evaluationPerspectives[0].linkedIntentRefs = ["QIN-NOPE-999"]; }
  },
  {
    id: "aspect-unsupported",
    rule: "canonical quality aspect",
    expect: "uses unsupported quality aspect",
    mutate: (pkg) => { pkg.qualityAspects[0].name = "vibes"; }
  },
  {
    id: "aspect-treated-as-quality",
    rule: "quality aspect stays discovery-lens-only",
    expect: "quality aspect must be interpreted as discovery-lens-only, not as quality itself.",
    mutate: (pkg) => { pkg.qualityAspects[0].interpretation = "quality-itself"; }
  },
  {
    id: "aspect-missing-discovery-questions",
    rule: "quality aspect has discovery questions",
    expect: "must include discoveryQuestions.",
    mutate: (pkg) => { pkg.qualityAspects[0].discoveryQuestions = []; }
  },
  {
    id: "aspect-unused",
    rule: "quality aspect is used by an evaluation perspective",
    expect: "quality aspect is defined but not used by any evaluation perspective.",
    mutate: (pkg) => {
      pkg.qualityAspects.push({
        id: "QAS-QG-UNUSED",
        name: "safety",
        purpose: "Unused aspect.",
        interpretation: "discovery-lens-only",
        discoveryQuestions: ["What harm could happen?"],
        typicalConcerns: ["harm"],
        possibleLossBoundaries: ["Harm must not occur."],
        evidenceExamples: ["review"],
        antiPatterns: ["Treating aspect presence as quality."]
      });
    }
  },
  {
    id: "perspective-broken-aspect-ref",
    rule: "perspective linked aspect resolves",
    expect: "references missing quality aspect",
    mutate: (pkg) => { pkg.evaluationPerspectives[0].linkedAspectRefs = ["QAS-NOPE-999"]; }
  },

  // ---- Evidence items ----
  {
    id: "evidence-bad-independence",
    rule: "evidence independence enum",
    expect: "independence must be high, medium, or low.",
    mutate: (pkg) => { pkg.evidenceItems[0].independence = "vibes"; }
  },
  {
    id: "evidence-bad-polarity",
    rule: "evidence polarity enum",
    expect: "polarity must be supports, contradicts, mixed, or neutral.",
    mutate: (pkg) => { pkg.evidenceItems[0].polarity = "maybe"; }
  },
  {
    id: "evidence-type-undeclared",
    rule: "evidence item type must be declared in vocabulary",
    expect: "uses undeclared evidenceType",
    mutate: (pkg) => { pkg.evidenceItems[0].evidenceType = "surprise-scan"; }
  },
  {
    id: "gate-rule-required-evidence-type-undeclared",
    rule: "gate rule required evidence type must be declared in vocabulary",
    expect: "requires undeclared evidence type",
    mutate: (pkg) => { pkg.qualityGateRules[0].requiredEvidenceTypes.push("surprise-scan"); }
  },
  {
    id: "evidence-type-vocabulary-unused",
    rule: "evidence type vocabulary entries must be used",
    expect: "is declared but not used by evidence items or gate rules.",
    mutate: (pkg) => {
      pkg.evidenceTypeVocabulary.push({
        id: "ETV-QG-UNUSED",
        evidenceType: "unused-review",
        purpose: "Unused vocabulary entry.",
        sourceCategory: "human-review",
        expectedIndependence: "medium",
        trustRequired: false,
        findingEvidenceRequired: false,
        antiPatterns: ["Decorative vocabulary."]
      });
    }
  },
  {
    id: "evidence-type-trust-required",
    rule: "vocabulary can require trust metadata",
    expect: "evidenceType sampled-review requires trust metadata.",
    mutate: (pkg) => { delete pkg.evidenceItems[0].trust; }
  },
  {
    id: "evidence-type-finding-evidence-required",
    rule: "vocabulary can require findingEvidence metadata",
    expect: "evidenceType sampled-review requires findingEvidence metadata.",
    mutate: (pkg) => { delete pkg.evidenceItems[0].findingEvidence; }
  },
  {
    id: "evidence-missing-retention-policy",
    rule: "evidence item must cite retention policy",
    expect: "references missing evidence retention policy",
    mutate: (pkg) => { pkg.evidenceItems[0].retentionPolicyRef = "ERP-NOPE-999"; }
  },
  {
    id: "retention-policy-undeclared-evidence-type",
    rule: "retention policy evidence types resolve",
    expect: "applies to undeclared evidence type",
    mutate: (pkg) => { pkg.evidenceRetentionPolicies[0].appliesToEvidenceTypes.push("surprise-scan"); }
  },
  {
    id: "retention-policy-does-not-cover-evidence-type",
    rule: "evidence type must be covered by cited retention policy",
    expect: "is not covered by retention policy",
    mutate: (pkg) => { pkg.evidenceItems[4].retentionPolicyRef = "ERP-QG-RELEASE-EVIDENCE"; }
  },
  {
    id: "retention-policy-confidential-open-access",
    rule: "confidential retention policy requires restricted access",
    expect: "confidential evidence must use need-to-know or regulatory-controlled access.",
    mutate: (pkg) => { pkg.evidenceRetentionPolicies[0].accessControl = "open"; }
  },
  {
    id: "retention-policy-restricted-weak-integrity",
    rule: "restricted retention policy requires strong integrity protection",
    expect: "restricted evidence must use signed-artifact or immutable-log integrity protection.",
    mutate: (pkg) => {
      pkg.evidenceRetentionPolicies[0].sensitivity = "restricted";
      pkg.evidenceRetentionPolicies[0].integrityProtection = "checksum";
      pkg.evidenceRetentionPolicies[0].accessControl = "regulatory-controlled";
    }
  },
  {
    id: "retention-policy-unused",
    rule: "retention policies must be used",
    expect: "retention policy is declared but not used by any evidence item.",
    mutate: (pkg) => {
      pkg.evidenceRetentionPolicies.push({
        id: "ERP-QG-UNUSED",
        title: "Unused retention policy",
        appliesToEvidenceTypes: ["control-test"],
        retentionPeriod: "1 month",
        sensitivity: "internal",
        integrityProtection: "checksum",
        accessControl: "internal-only",
        disposalRule: "Dispose after one month.",
        owner: "quality-owner",
        antiPatterns: ["Decorative retention policy."]
      });
    }
  },
  {
    id: "finding-evidence-missing-final-status",
    rule: "AI finding evidence final status is required",
    expect: "finalStatus must be one of",
    mutate: (pkg) => { delete pkg.evidenceItems[0].findingEvidence.finalStatus; }
  },
  {
    id: "finding-evidence-reproducible-not-boolean",
    rule: "AI finding evidence reproducible is boolean",
    expect: "reproducible must be boolean.",
    mutate: (pkg) => { pkg.evidenceItems[0].findingEvidence.reproducible = "yes"; }
  },
  {
    id: "finding-evidence-confirmed-before-checks",
    rule: "confirmed AI finding evidence requires reproduction, false-positive check, and impact confirmation",
    expect: "cannot be confirmed until reproducible, falsePositiveChecked, and impactConfirmed are true.",
    mutate: (pkg) => { pkg.evidenceItems[0].findingEvidence.falsePositiveChecked = false; }
  },
  {
    id: "trust-missing-status",
    rule: "evidence trust status is required",
    expect: "trust status must be one of draft, verified, stale, rejected.",
    mutate: (pkg) => { delete pkg.evidenceItems[0].trust.status; }
  },
  {
    id: "trust-verified-without-source",
    rule: "verified evidence trust requires source grounding",
    expect: "trust verified status requires at least one source.",
    mutate: (pkg) => { pkg.evidenceItems[0].trust.sources = []; }
  },
  {
    id: "trust-verified-without-verifier",
    rule: "verified evidence trust requires verifier",
    expect: "trust verified status requires at least one verifier.",
    mutate: (pkg) => { pkg.evidenceItems[0].trust.verifiedBy = []; }
  },

  // ---- Quantitative evidence records ----
  {
    id: "quant-missing-unit",
    rule: "quantitative record unit",
    expect: "must include non-empty string unit.",
    mutate: (pkg) => { delete pkg.quantitativeEvidenceRecords[0].unit; }
  },
  {
    id: "quant-missing-interpretation-rule",
    rule: "quantitative record interpretation rule",
    expect: "must include non-empty string interpretationRule.",
    mutate: (pkg) => { delete pkg.quantitativeEvidenceRecords[0].interpretationRule; }
  },
  {
    id: "quant-value-not-number",
    rule: "quantitative record numeric value",
    expect: "value must be a number.",
    mutate: (pkg) => { pkg.quantitativeEvidenceRecords[0].value = "three"; }
  },
  {
    id: "quant-bad-quantity-type",
    rule: "quantitative record quantity type",
    expect: "quantityType must be one of",
    mutate: (pkg) => { pkg.quantitativeEvidenceRecords[0].quantityType = "how-shiny"; }
  },
  {
    id: "quant-treated-as-quality",
    rule: "quantitative record stays evidence-only (metric is not quality itself)",
    expect: "must be interpreted as evidence-only, not as quality itself.",
    mutate: (pkg) => { pkg.quantitativeEvidenceRecords[0].interpretation = "quality-itself"; }
  },
  {
    id: "quant-broken-evidence-ref",
    rule: "quantitative record links retained evidence",
    expect: "references missing retained evidence",
    mutate: (pkg) => { pkg.quantitativeEvidenceRecords[0].evidenceRef = "EVD-NOPE-999"; }
  },
  {
    id: "quant-broken-intent-ref",
    rule: "quantitative record links quality intent",
    expect: "references missing quality intent",
    mutate: (pkg) => { pkg.quantitativeEvidenceRecords[0].linkedIntentRef = "QIN-NOPE-999"; }
  },

  // ---- Automated evaluation detail ----
  {
    id: "automated-counts-do-not-sum",
    rule: "automated counts sum to executedCount",
    expect: "counts must sum to executedCount.",
    mutate: (pkg) => { pkg.automatedEvaluationDetails[0].failedCount = 7; }
  },
  {
    id: "automated-passrate-not-reproducible",
    rule: "automated passRate reproduces from counts",
    expect: "passRate must reproduce from passedCount divided by executedCount.",
    mutate: (pkg) => { pkg.automatedEvaluationDetails[0].passRate = 0.5; }
  },

  // ---- Gate rules ----
  {
    id: "gate-rule-missing-required-evidence",
    rule: "gate rule required evidence types",
    expect: "must include requiredEvidenceTypes.",
    mutate: (pkg) => { pkg.qualityGateRules[0].requiredEvidenceTypes = []; }
  },

  // ---- Evaluation timing rules and decisions ----
  {
    id: "timing-rule-broken-intent-ref",
    rule: "evaluation timing rule linked intents resolve",
    expect: "references missing quality intent",
    mutate: (pkg) => { pkg.evaluationTimingRules[0].appliesToIntentRefs = ["QIN-NOPE-999"]; }
  },
  {
    id: "timing-rule-bad-timing",
    rule: "evaluation timing rule timing enum",
    expect: "timing must be one of",
    mutate: (pkg) => { pkg.evaluationTimingRules[0].timing = "eventually"; }
  },
  {
    id: "timing-decision-bad-selected-timing",
    rule: "evaluation timing decision selected timing matches cited rules",
    expect: "selectedTiming continuous is not allowed by its cited timing rules.",
    mutate: (pkg) => { pkg.evaluationTimingDecisions[0].selectedTiming = "continuous"; }
  },
  {
    id: "timing-decision-missing-gate-ref",
    rule: "required-before-decision timing decision cites gate decision",
    expect: "cites a required-before-decision timing rule and must include appliesBeforeGateDecisionRef.",
    mutate: (pkg) => { delete pkg.evaluationTimingDecisions[0].appliesBeforeGateDecisionRef; }
  },
  {
    id: "gate-decision-missing-required-timing",
    rule: "gate decision requires completed evaluation timing decision",
    expect: "lacks completed evaluation timing decision for required timing rule",
    mutate: (pkg) => { pkg.evaluationTimingDecisions[0].status = "scheduled"; }
  },
  {
    id: "timing-decision-completed-without-evidence",
    rule: "completed evaluation timing decision cites evidence",
    expect: "is completed and must cite timing decision evidence.",
    mutate: (pkg) => { pkg.evaluationTimingDecisions[0].evidenceRefs = []; }
  },
  {
    id: "timing-decision-waived-without-governance",
    rule: "waived evaluation timing decision requires governance",
    expect: "must include at least one governance trigger.",
    mutate: (pkg) => {
      pkg.evaluationTimingDecisions[0].status = "waived";
      pkg.evaluationTimingDecisions[0].waiverRationale = "Emergency waiver.";
      pkg.evaluationTimingDecisions[0].governanceTriggerRefs = [];
    }
  },

  // ---- Gate decision: enum, confidence, verdict discipline ----
  {
    id: "decision-bad-enum",
    rule: "gate decision verdict enum",
    expect: "decision must be Go, Conditional Go, No-Go, or Pending.",
    mutate: (pkg) => { decision(pkg).decision = "Probably"; }
  },
  {
    id: "decision-missing-residual-risks",
    rule: "gate decision residual risks",
    expect: "must include residualRisks.",
    mutate: (pkg) => { decision(pkg).residualRisks = []; }
  },
  {
    id: "verdict-confidence-not-reproducible",
    rule: "verdict confidence reproduces from evidence and policy",
    expect: "confidence must reproduce from evidence inputs and policy",
    mutate: (pkg) => { verdict(pkg, "QIN-QG-001").confidence = 0.99; }
  },
  {
    id: "decision-confidence-not-reproducible",
    rule: "decision confidence reproduces from verdict confidences",
    expect: "confidence must reproduce from verdict confidences and policy",
    mutate: (pkg) => { decision(pkg).confidence = 0.42; }
  },
  {
    id: "duplicate-verdict",
    rule: "one verdict per gated intent",
    expect: "has duplicate verdicts for quality intent",
    mutate: (pkg) => {
      const v = verdict(pkg, "QIN-QG-002");
      decision(pkg).intentVerdicts.push(structuredClone(v));
    }
  },
  {
    id: "achieved-without-support",
    rule: "achieved verdict cites supporting evidence",
    expect: "is achieved but cites no supporting evidence.",
    mutate: (pkg) => { evidence(pkg, "EVD-QG-003").polarity = "contradicts"; }
  },
  {
    id: "intent-without-perspective",
    rule: "gated intent covered by an evaluation perspective",
    expect: "gates an intent that no evaluation perspective covers.",
    mutate: (pkg) => {
      for (const p of pkg.evaluationPerspectives) {
        p.linkedIntentRefs = p.linkedIntentRefs.filter((ref) => ref !== "QIN-QG-002");
      }
      pkg.evaluationPerspectives = pkg.evaluationPerspectives.filter((p) => p.linkedIntentRefs.length > 0);
    }
  },

  // ---- Gate rule enforcement (rules are executable, not decorative) ----
  {
    id: "gate-rule-intent-without-verdict",
    rule: "every intent a cited gate rule protects has a verdict",
    expect: "records no verdict for its protected intent",
    mutate: (pkg) => {
      decision(pkg).intentVerdicts = decision(pkg).intentVerdicts.filter((v) => v.intentRef !== "QIN-QG-002");
    }
  },
  {
    id: "go-missing-required-evidence-type",
    rule: "Go/Conditional Go satisfies each cited rule's required evidence types",
    expect: "lacks required evidence type",
    mutate: (pkg) => {
      // Drop the control-test evidence from QIN-QG-001; keep confidence reproducible
      // by leaving the sampled-review evidence (min of one input = its own value).
      const v = verdict(pkg, "QIN-QG-001");
      v.evidenceRefs = ["EVD-QG-001"];
      v.confidence = 0.7;
    }
  },

  // ---- Governance forcing ----
  {
    id: "conflict-without-governance",
    rule: "conflicting evidence forces a governance trigger",
    expect: "must include a conflicting-evidence governance trigger when verdict evidence conflicts.",
    mutate: (pkg) => { decision(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "low-confidence-without-governance",
    rule: "low-confidence verdict forces a governance trigger",
    expect: "must include a low-confidence governance trigger when a verdict confidence is low.",
    mutate: (pkg) => {
      // State a low verdict confidence; the low-confidence rule reads the stated value.
      verdict(pkg, "QIN-QG-003").confidence = 0.4;
    }
  },
  {
    id: "weak-evidence-without-governance",
    rule: "high-severity boundary on only low-independence evidence forces governance",
    expect: "must include a weak-evidence governance trigger",
    mutate: (pkg) => {
      // QIN-QG-003 is high severity; make both its supporting items low-independence.
      evidence(pkg, "EVD-QG-004").independence = "low";
    }
  },
  {
    id: "go-on-weak-evidence",
    rule: "Go blocked when high-severity boundary rests only on low-independence evidence",
    expect: "cannot be Go when a high-severity loss boundary is supported only by low-independence evidence.",
    mutate: (pkg) => {
      evidence(pkg, "EVD-QG-004").independence = "low";
      decision(pkg).decision = "Go";
    }
  },
  {
    id: "go-with-unprotected-boundary",
    rule: "Go blocked while a high-severity boundary verdict is not-achieved/inconclusive",
    expect: "cannot be Go while a high-severity loss boundary verdict is not-achieved or inconclusive.",
    mutate: (pkg) => {
      decision(pkg).decision = "Go";
      verdict(pkg, "QIN-QG-001").decision = "not-achieved";
    }
  },
  {
    id: "go-with-open-severe-trigger",
    rule: "Go blocked while a high-severity governance trigger is open",
    expect: "cannot be Go while high-severity governance triggers remain open",
    mutate: (pkg) => {
      decision(pkg).decision = "Go";
      const t = pkg.governanceTriggers[0];
      t.status = "open";
      delete t.resultingGovernanceEventRef;
      pkg.governanceEvents = [];
    }
  },

  // ---- Release-completeness of Go / Conditional Go ----
  {
    id: "conditional-go-missing-rollback",
    rule: "Go/Conditional Go includes a rollback plan",
    expect: "must include non-empty string rollbackPlan.",
    mutate: (pkg) => { delete decision(pkg).rollbackPlan; }
  },
  {
    id: "conditional-go-missing-conditions",
    rule: "Conditional Go lists explicit conditions",
    expect: "is Conditional Go and must include explicit conditions.",
    mutate: (pkg) => { decision(pkg).conditions = []; }
  },
  {
    id: "conditional-go-condition-missing-owner",
    rule: "each Conditional Go condition names an owner",
    expect: "must include non-empty string owner.",
    mutate: (pkg) => { delete decision(pkg).conditions[0].owner; }
  },
  {
    id: "no-go-without-citation",
    rule: "No-Go cites a violated boundary or gate rule",
    expect: "is No-Go and must cite a violated loss boundary or gate rule.",
    mutate: (pkg) => { decision(pkg).decision = "No-Go"; }
  },
  {
    id: "pending-without-missing-evidence",
    rule: "Pending lists the missing evidence",
    expect: "is Pending and must list the missing evidence.",
    mutate: (pkg) => { decision(pkg).decision = "Pending"; }
  },

  // ---- Governance triggers and events ----
  {
    id: "trigger-missing-required-action",
    rule: "governance trigger required fields",
    expect: "must include non-empty string requiredAction.",
    mutate: (pkg) => { delete pkg.governanceTriggers[0].requiredAction; }
  },
  {
    id: "trigger-not-open-without-event",
    rule: "non-open trigger links a governance event",
    expect: "is not open and must link to a resultingGovernanceEventRef.",
    mutate: (pkg) => {
      delete pkg.governanceTriggers[0].resultingGovernanceEventRef;
      pkg.governanceEvents = [];
    }
  },
  {
    id: "event-missing-decided-by",
    rule: "governance event required fields",
    expect: "must include non-empty string decidedBy.",
    mutate: (pkg) => { delete pkg.governanceEvents[0].decidedBy; }
  },

  // ---- Post-release review, improvement, traceability ----
  {
    id: "severe-incident-without-improvement",
    rule: "high-severity post-release incident links an improvement action",
    expect: "records a high-severity incident and must link at least one improvement action.",
    mutate: (pkg) => { pkg.postReleaseReviews[0].improvementActionRefs = []; }
  },
  {
    id: "improvement-not-mirrored",
    rule: "improvement action is cross-referenced by its source review",
    expect: "that does not list it in improvementActionRefs.",
    mutate: (pkg) => {
      pkg.improvementActions.push({
        id: "IMP-QG-999",
        title: "Orphan action",
        correctiveAction: "x",
        sourcePostReleaseReviewRef: "PRR-QG-001",
        effectMeasurement: "y",
        status: "proposed"
      });
    }
  },
  {
    id: "improvement-broken-source-ref",
    rule: "improvement action links its source post-release review",
    expect: "references missing source post-release review",
    mutate: (pkg) => { pkg.improvementActions[0].sourcePostReleaseReviewRef = "PRR-NOPE-999"; }
  },
  {
    id: "traceability-broken-source",
    rule: "traceability link source resolves",
    expect: "references missing sourceRef",
    mutate: (pkg) => { pkg.traceabilityLinks[0].sourceRef = "ZZZ-NOPE-999"; }
  },
  {
    id: "traceability-broken-target",
    rule: "traceability link target resolves",
    expect: "references missing targetRef",
    mutate: (pkg) => { pkg.traceabilityLinks[0].targetRef = "ZZZ-NOPE-999"; }
  },

  // ---- Verifier boundary self-declaration ----
  {
    id: "verifier-boundary-omits-semantic-truth",
    rule: "verifier boundary disclaims semantic truth",
    expect: "must explicitly avoid claiming semantic truth.",
    mutate: (pkg) => {
      pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((c) => c !== "semantic truth");
    }
  }
];

export const spec = {
  suiteId: "quality-gate",
  basePackage: "examples/quality-gate-package.json",
  validator,
  corpusDir: "tests/fixtures/quality-gate",
  filePrefix: "quality-gate"
};
