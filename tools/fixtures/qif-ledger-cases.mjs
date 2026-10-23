// Retained negative coverage for the qif-ledger verifier.
//
// These cases protect the Living QIF Ledger boundary: cross-package references
// must resolve, lifecycle state must be evidence-backed, missed intents must
// close to a derivation or accepted gap, and agent trials must link to outcomes
// without storing hidden reasoning.

const validator = "tools/validate-qif-ledger.mjs";

function packageRef(pkg, id = "PKG-DISCOVERY") {
  return pkg.packageRefs.find((entry) => entry.id === id);
}

function xref(pkg) {
  return pkg.crossPackageRefs[0];
}

function lifecycle(pkg, id = "QLC-001") {
  return pkg.qualityIntentLifecycleRecords.find((entry) => entry.id === id);
}

function missedIntent(pkg) {
  return pkg.missedIntentRecords[0];
}

function trial(pkg) {
  return pkg.agentTrials[0];
}

function outcome(pkg) {
  return pkg.agentOutcomes[0];
}

function memoryPolicy(pkg) { return pkg.judgmentMemoryPolicies[0]; }
function memoryEntry(pkg, index = 0) { return pkg.judgmentMemoryEntries[index]; }
function memoryDependency(pkg) { return pkg.judgmentMemoryDependencies[0]; }
function memoryRevision(pkg, id = "JMR-002") { return pkg.judgmentMemoryRevisions.find((entry) => entry.id === id); }
function retirementDecision(pkg) { return pkg.judgmentRetirementDecisions[0]; }
function memoryJoin(pkg) { return pkg.multiAgentJudgmentJoins[0]; }
function memoryAssessment(pkg) { return pkg.judgmentMemoryAssessments[0]; }

export const cases = [
  {
    id: "packageRefs-not-array",
    rule: "packageRefs must be an array",
    expect: "packageRefs must be an array.",
    mutate: (pkg) => { pkg.packageRefs = null; }
  },
  {
    id: "package-ref-path-missing",
    rule: "package ref path exists",
    expect: "PKG-DISCOVERY package path does not exist",
    mutate: (pkg) => { packageRef(pkg).path = "examples/missing-package.json"; }
  },
  {
    id: "package-ref-wrong-type",
    rule: "package ref type matches referenced package",
    expect: "PKG-DISCOVERY expected packageType review-run but found discovery-session.",
    mutate: (pkg) => { packageRef(pkg).packageType = "review-run"; }
  },
  {
    id: "cross-package-ref-broken-from",
    rule: "cross package from ref resolves",
    expect: "XREF-001/from references missing entity",
    mutate: (pkg) => { xref(pkg).from.entityRef = "QID-NOPE-999"; }
  },
  {
    id: "cross-package-ref-self",
    rule: "cross package ref must not self-reference",
    expect: "XREF-001 must not point an entity to itself.",
    mutate: (pkg) => { xref(pkg).to = structuredClone(xref(pkg).from); }
  },
  {
    id: "lifecycle-missing-evidence",
    rule: "lifecycle records require evidence",
    expect: "QLC-001 must include evidenceRefs.",
    mutate: (pkg) => { lifecycle(pkg).evidenceRefs = []; }
  },
  {
    id: "lifecycle-broken-previous",
    rule: "lifecycle previous record resolves",
    expect: "QLC-001 references missing previousLifecycleRecordRef QLC-NOPE-999.",
    mutate: (pkg) => { lifecycle(pkg).previousLifecycleRecordRef = "QLC-NOPE-999"; }
  },
  {
    id: "missed-intent-broken-incident",
    rule: "missed intent source incident resolves",
    expect: "MIR-001/sourceIncident references missing entity",
    mutate: (pkg) => { missedIntent(pkg).sourceIncident.entityRef = "INC-NOPE-999"; }
  },
  {
    id: "missed-intent-matched-not-active",
    rule: "matched missed-intent refs must be active",
    expect: "MIR-001 matched intent PKG-GATE/qualityIntents/QIN-QG-001 must have an active lifecycle record.",
    mutate: (pkg) => { lifecycle(pkg, "QLC-002").state = "candidate"; }
  },
  {
    id: "missed-intent-derive-without-derivation",
    rule: "derive-new-intent requires derivation ref",
    expect: "MIR-001 outcome derive-new-intent requires newQualityIntentDerivation.",
    mutate: (pkg) => { delete missedIntent(pkg).newQualityIntentDerivation; }
  },
  {
    id: "missed-intent-accepted-gap-without-rationale",
    rule: "accepted gap requires rationale",
    expect: "MIR-001 must include non-empty string acceptedGapRationale.",
    mutate: (pkg) => {
      missedIntent(pkg).outcome = "accepted-gap";
      delete missedIntent(pkg).newQualityIntentDerivation;
    }
  },
  {
    id: "agent-trial-hidden-reasoning",
    rule: "agent trial must not store hidden reasoning",
    expect: "ATR-001 must not store hidden chain-of-thought as ledger evidence.",
    mutate: (pkg) => { trial(pkg).transcriptHandling = "hidden-chain-of-thought"; }
  },
  {
    id: "agent-trial-missing-outcome",
    rule: "agent trial outcome resolves",
    expect: "ATR-001 references missing outcomeRef AOC-NOPE-999.",
    mutate: (pkg) => { trial(pkg).outcomeRef = "AOC-NOPE-999"; }
  },
  {
    id: "agent-outcome-broken-trial",
    rule: "agent outcome trial resolves",
    expect: "AOC-001 references missing trialRef ATR-NOPE-999.",
    mutate: (pkg) => { outcome(pkg).trialRef = "ATR-NOPE-999"; }
  },
  {
    id: "agent-outcome-broken-evidence-origin",
    rule: "agent outcomes resolve evidence origin",
    expect: "AOC-001 references missing evidence origin: EOR-NOPE-999",
    mutate: (pkg) => { outcome(pkg).evidenceOriginRef = "EOR-NOPE-999"; }
  },
  {
    id: "empirical-origin-not-verified",
    rule: "empirical evidence origin is verified",
    expect: "EOR-LEDGER-001 empirical evidence origin must have status verified.",
    mutate: (pkg) => {
      pkg.evidenceOrigins[0].originKind = "historical-record";
      pkg.evidenceOrigins[0].status = "stale";
    }
  },
  {
    id: "ledger-index-closed-governance-trigger",
    rule: "ledger index open governance triggers are open",
    expect: "ledgerIndex openGovernanceTriggerRefs must only reference open triggers.",
    mutate: (pkg) => {
      pkg.ledgerIndex.openGovernanceTriggerRefs[0] = {
        packageRef: "PKG-REVIEW",
        entityType: "governanceTriggers",
        entityRef: "GTR-RR-003"
      };
    }
  },
  {
    id: "verifier-boundary-claims-semantic-truth",
    rule: "ledger verifier boundary avoids semantic truth",
    expect: "verifierBoundary must explicitly avoid claiming semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["expert correctness"]; }
  },
  {
    id: "judgment-memory-policies-not-array",
    rule: "judgment memory policies are retained",
    expect: "judgmentMemoryPolicies must be an array.",
    mutate: (pkg) => { pkg.judgmentMemoryPolicies = null; }
  },
  {
    id: "judgment-memory-entries-not-array",
    rule: "lane-local judgment memories are retained",
    expect: "judgmentMemoryEntries must be an array.",
    mutate: (pkg) => { pkg.judgmentMemoryEntries = null; }
  },
  {
    id: "judgment-memory-policy-boundary",
    rule: "memory policy forbids destructive forgetting and authority",
    expect: "must forbid destructive forgetting, hidden reasoning storage, and automatic authority.",
    mutate: (pkg) => { memoryPolicy(pkg).destructiveForgetAllowed = true; }
  },
  {
    id: "judgment-memory-source-missing",
    rule: "memory source judgment resolves",
    expect: "JME-001/sourceJudgment references missing entity",
    mutate: (pkg) => { memoryEntry(pkg).sourceJudgment.entityRef = "RJG-NOPE-999"; }
  },
  {
    id: "judgment-memory-hidden-reasoning",
    rule: "memory excludes hidden reasoning",
    expect: "JME-001 hiddenReasoningStored must be false.",
    mutate: (pkg) => { memoryEntry(pkg).hiddenReasoningStored = true; }
  },
  {
    id: "judgment-memory-current-revision",
    rule: "memory identifies one current revision",
    expect: "JME-001 must identify exactly one current revision through currentRevisionRef.",
    mutate: (pkg) => { memoryEntry(pkg).currentRevisionRef = "JMR-001"; }
  },
  {
    id: "judgment-memory-dependency-backlink",
    rule: "dependency disclosure is bidirectional",
    expect: "JMD-001 affected memory JME-002 must link back through dependencyRefs.",
    mutate: (pkg) => { memoryEntry(pkg, 1).dependencyRefs = ["JMD-NOPE-999"]; }
  },
  {
    id: "judgment-memory-shared-dependency-count",
    rule: "shared dependency affects multiple memories",
    expect: "JMD-001 shared dependency must affect at least two memories.",
    mutate: (pkg) => { memoryDependency(pkg).affectedMemoryRefs = ["JME-001"]; }
  },
  {
    id: "judgment-memory-dependency-trigger",
    rule: "shared dependency routes governance",
    expect: "JMD-001 non-independent dependency requires a memory-shared-dependency governance trigger.",
    mutate: (pkg) => { memoryDependency(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "judgment-memory-revision-previous",
    rule: "revision lineage resolves",
    expect: "JMR-002 references missing previous judgment memory revision JMR-NOPE-999.",
    mutate: (pkg) => { memoryRevision(pkg).previousRevisionRef = "JMR-NOPE-999"; }
  },
  {
    id: "judgment-memory-revision-contiguous",
    rule: "revision numbers are contiguous",
    expect: "JMR-002 previous revision must belong to the same memory and increment revisionNumber by one.",
    mutate: (pkg) => { memoryRevision(pkg).revisionNumber = 3; }
  },
  {
    id: "judgment-memory-retirement-status",
    rule: "retirement status reproduces",
    expect: "JRD-001 resultingStatus must reproduce as retired.",
    mutate: (pkg) => { retirementDecision(pkg).resultingStatus = "current"; }
  },
  {
    id: "judgment-memory-destructive-delete",
    rule: "retirement is non-destructive",
    expect: "JRD-001 destructiveDeletion must be false.",
    mutate: (pkg) => { retirementDecision(pkg).destructiveDeletion = true; }
  },
  {
    id: "judgment-memory-retirement-trigger",
    rule: "retirement routes governance",
    expect: "JRD-001 retirement requires a memory-retirement-review governance trigger.",
    mutate: (pkg) => { retirementDecision(pkg).governanceTriggerRefs = ["JGT-001"]; }
  },
  {
    id: "judgment-memory-join-retired",
    rule: "joins exclude retired memories",
    expect: "JMJ-001 must not join retired memories.",
    mutate: (pkg) => { memoryJoin(pkg).memoryRefs[0] = "JME-004"; memoryJoin(pkg).revisionRefs[0] = "JMR-005"; }
  },
  {
    id: "judgment-memory-join-distinct-lanes",
    rule: "join requires distinct lanes",
    expect: "JMJ-001 must include at least 2 distinct lanes.",
    mutate: (pkg) => { memoryEntry(pkg, 1).laneId = "operations-lane"; memoryEntry(pkg, 2).laneId = "operations-lane"; }
  },
  {
    id: "judgment-memory-join-revisions",
    rule: "join uses current revisions",
    expect: "JMJ-001 revisionRefs must exactly match current revisions of joined memories.",
    mutate: (pkg) => { memoryJoin(pkg).revisionRefs[0] = "JMR-001"; }
  },
  {
    id: "judgment-memory-join-dependencies",
    rule: "join discloses shared dependencies",
    expect: "JMJ-001 dependencyRefs must disclose every dependency shared by joined memories.",
    mutate: (pkg) => { memoryJoin(pkg).dependencyRefs = []; }
  },
  {
    id: "judgment-memory-join-dissent",
    rule: "join preserves exact dissent",
    expect: "JMJ-001 dissentMemoryRefs must reproduce every joined memory that differs from joinedJudgment.",
    mutate: (pkg) => { memoryJoin(pkg).dissentMemoryRefs = []; }
  },
  {
    id: "judgment-memory-join-conflict-dimensions",
    rule: "join names conflict dimensions",
    expect: "JMJ-001 conflicting judgments require conflictDimensions.",
    mutate: (pkg) => { memoryJoin(pkg).conflictDimensions = []; }
  },
  {
    id: "judgment-memory-join-sufficiency",
    rule: "join sufficiency reproduces",
    expect: "JMJ-001 dataSufficiency must reproduce as insufficient.",
    mutate: (pkg) => { memoryJoin(pkg).dataSufficiency = "sufficient"; }
  },
  {
    id: "judgment-memory-join-evidence-trigger",
    rule: "unverified memory routes governance",
    expect: "JMJ-001 unverified memory evidence requires a memory-evidence-unverified governance trigger.",
    mutate: (pkg) => { memoryJoin(pkg).governanceTriggerRefs = ["JGT-002", "JGT-003"]; }
  },
  {
    id: "judgment-memory-join-authority-boundary",
    rule: "join does not grant authority",
    expect: "JMJ-001 authorityBoundary must remain recorded-join-only-not-semantic-truth-quality-competence-authorization-or-authority.",
    mutate: (pkg) => { memoryJoin(pkg).authorityBoundary = "approved-by-consensus"; }
  },
  {
    id: "judgment-memory-assessment-count",
    rule: "assessment counts reproduce",
    expect: "JMA-001 dissentCount must reproduce as 1.",
    mutate: (pkg) => { memoryAssessment(pkg).dissentCount = 0; }
  },
  {
    id: "judgment-memory-assessment-signals",
    rule: "assessment signals reproduce",
    expect: "JMA-001 assessmentSignals must reproduce as",
    mutate: (pkg) => { memoryAssessment(pkg).assessmentSignals = ["ready-for-governed-use"]; }
  },
  {
    id: "judgment-memory-assessment-trigger",
    rule: "insufficient assessment routes governance",
    expect: "JMA-001 insufficient memory evidence requires a memory-assessment-insufficient governance trigger.",
    mutate: (pkg) => { memoryAssessment(pkg).governanceTriggerRefs = ["JGT-001", "JGT-002", "JGT-003"]; }
  },
  {
    id: "judgment-memory-verifier-authority-boundary",
    rule: "verifier does not claim authority",
    expect: "verifierBoundary must explicitly avoid claiming authorization or authority.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "authorization or authority"); }
  }
];

export const spec = {
  suiteId: "qif-ledger",
  basePackage: "examples/qif-ledger-package.json",
  validator,
  corpusDir: "tests/fixtures/qif-ledger",
  filePrefix: "qif-ledger"
};
