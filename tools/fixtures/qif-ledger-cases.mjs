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
function portablePolicy(pkg) { return pkg.portableKnowledgeImportPolicies[0]; }
function portableLibrary(pkg) { return pkg.portableKnowledgeLibraries[0]; }
function portableItem(pkg, index = 0) { return pkg.portableKnowledgeItems[index]; }
function portableDecision(pkg) { return pkg.portableKnowledgeImportDecisions[0]; }
function portableAssessment(pkg) { return pkg.portableKnowledgeAssessments[0]; }
function localValidationPolicy(pkg) { return pkg.portableKnowledgeLocalValidationPolicies[0]; }
function localApplicability(pkg, index = 0) { return pkg.portableKnowledgeApplicabilityDecisions[index]; }
function localReproduction(pkg, index = 0) { return pkg.portableKnowledgeReproductionTrials[index]; }
function localValidationAssessment(pkg) { return pkg.portableKnowledgeLocalValidationAssessments[0]; }
function revocationPolicy(pkg) { return pkg.portableKnowledgeRevocationPolicies[0]; }
function revocationNotice(pkg) { return pkg.portableKnowledgeRevocationNotices[0]; }
function dependencyEdge(pkg, index = 0) { return pkg.portableKnowledgeDependencyEdges[index]; }
function revocationImpact(pkg) { return pkg.portableKnowledgeRevocationImpactAssessments[0]; }
function revalidationDecision(pkg) { return pkg.portableKnowledgeRevalidationDecisions[0]; }
function trustPolicy(pkg, index = 0) { return pkg.portableKnowledgeTrustPolicies[index]; }
function attestation(pkg) { return pkg.portableKnowledgeAttestations[0]; }
function trustDecision(pkg) { return pkg.portableKnowledgeTrustDecisions[0]; }
function trustReplay(pkg, index = 0) { return pkg.portableKnowledgeTrustReplays[index]; }
function rolloutItemPreview(pkg, index = 0) { return pkg.portableKnowledgeRolloutItemPreviews[index]; }
function rolloutPreview(pkg) { return pkg.portableKnowledgeRolloutPreviews[0]; }
function activationDecision(pkg) { return pkg.portableKnowledgeActivationDecisions[0]; }
function policyObservation(pkg) { return pkg.portableKnowledgePolicyObservations[0]; }
function rollbackRecord(pkg) { return pkg.portableKnowledgeRollbackRecords[0]; }
function executionReconciliation(pkg, index = 0) { return pkg.portableKnowledgeExecutionReconciliations[index]; }
function recoveryVerification(pkg) { return pkg.portableKnowledgeRecoveryVerifications[0]; }
function promotionDecision(pkg) { return pkg.portableKnowledgePromotionDecisions[0]; }

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
  },
  {
    id: "portable-knowledge-policies-not-array",
    rule: "portable import policies are retained",
    expect: "portableKnowledgeImportPolicies must be an array.",
    mutate: (pkg) => { pkg.portableKnowledgeImportPolicies = null; }
  },
  {
    id: "portable-knowledge-policy-boundary",
    rule: "portable import policy forbids activation and authority",
    expect: "must forbid executable imported instructions, hidden reasoning, automatic activation, and automatic authority.",
    mutate: (pkg) => { portablePolicy(pkg).automaticActivation = true; }
  },
  {
    id: "portable-knowledge-source-missing",
    rule: "portable item source resolves",
    expect: "PKI-001/sourceEntity references missing entity",
    mutate: (pkg) => { portableItem(pkg).sourceEntity.entityRef = "PAT-NOPE-999"; }
  },
  {
    id: "portable-knowledge-snapshot-mismatch",
    rule: "portable snapshot exactly preserves source",
    expect: "PKI-001 sourceSnapshot must exactly reproduce the resolved source entity.",
    mutate: (pkg) => { portableItem(pkg).sourceSnapshot.title = "Silently changed title"; }
  },
  {
    id: "portable-knowledge-digest-mismatch",
    rule: "portable source digest reproduces",
    expect: "PKI-001 sourceDigest must reproduce the canonical source entity digest",
    mutate: (pkg) => { portableItem(pkg).sourceDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-knowledge-type-mismatch",
    rule: "knowledge type matches source collection",
    expect: "PKI-001 knowledgeType quality-intent requires source entityType qualityIntents.",
    mutate: (pkg) => { portableItem(pkg).knowledgeType = "quality-intent"; }
  },
  {
    id: "portable-knowledge-counterexamples-required",
    rule: "portable items preserve counterexample challenges",
    expect: "PKI-001 counterexamples must include at least one concrete challenge.",
    mutate: (pkg) => { portableItem(pkg).counterexamples = []; }
  },
  {
    id: "portable-knowledge-instruction-boundary",
    rule: "portable items are not executable instructions",
    expect: "PKI-001 must remain reference data only and must not store hidden reasoning.",
    mutate: (pkg) => { portableItem(pkg).instructionBoundary = "execute-as-agent-instructions"; }
  },
  {
    id: "portable-knowledge-hidden-reasoning",
    rule: "portable items exclude hidden reasoning",
    expect: "PKI-001 must remain reference data only and must not store hidden reasoning.",
    mutate: (pkg) => { portableItem(pkg).hiddenReasoningStored = true; }
  },
  {
    id: "portable-knowledge-evidence-required",
    rule: "portable items retain evidence refs",
    expect: "PKI-001 evidenceRefs must include source evidence.",
    mutate: (pkg) => { portableItem(pkg).evidenceRefs = []; }
  },
  {
    id: "portable-library-item-list",
    rule: "library item index is exact",
    expect: "PKL-001 itemRefs must exactly list items owned by the library.",
    mutate: (pkg) => { portableLibrary(pkg).itemRefs = ["PKI-001"]; }
  },
  {
    id: "portable-library-digest",
    rule: "library digest reproduces",
    expect: "PKL-001 libraryDigest must reproduce as",
    mutate: (pkg) => { portableLibrary(pkg).libraryDigest = `sha256:${"f".repeat(64)}`; }
  },
  {
    id: "portable-library-trust-source",
    rule: "library trust sources resolve",
    expect: "PKL-001 trust references missing source package PKG-NOPE-999.",
    mutate: (pkg) => { portableLibrary(pkg).trust.sources = ["PKG-NOPE-999"]; }
  },
  {
    id: "portable-import-candidate-only",
    rule: "imported knowledge stays candidate-only",
    expect: "PKD-001 imported knowledge must remain candidate-only, non-executable, non-activating, and non-authoritative.",
    mutate: (pkg) => { portableDecision(pkg).importedStatus = "active"; }
  },
  {
    id: "portable-import-digest-reproduction",
    rule: "import decision reproduces digest verification",
    expect: "PKD-001 sourceDigestVerified must reproduce as true.",
    mutate: (pkg) => { portableDecision(pkg).sourceDigestVerified = false; }
  },
  {
    id: "portable-import-provenance",
    rule: "import preserves provenance",
    expect: "PKD-001 provenancePreserved must be true.",
    mutate: (pkg) => { portableDecision(pkg).provenancePreserved = false; }
  },
  {
    id: "portable-import-source-trigger",
    rule: "unverified source trust routes governance",
    expect: "PKD-001 unverified source trust requires a portable-source-unverified governance trigger.",
    mutate: (pkg) => { portableDecision(pkg).governanceTriggerRefs = ["PKGTR-002", "PKGTR-003"]; }
  },
  {
    id: "portable-import-applicability-trigger",
    rule: "candidate imports route applicability governance",
    expect: "PKD-001 candidate import requires a portable-applicability-unvalidated governance trigger.",
    mutate: (pkg) => { portableDecision(pkg).governanceTriggerRefs = ["PKGTR-001", "PKGTR-003"]; }
  },
  {
    id: "portable-import-counterexample-trigger",
    rule: "candidate imports route counterexample governance",
    expect: "PKD-001 candidate import requires a portable-counterexample-unresolved governance trigger.",
    mutate: (pkg) => { portableDecision(pkg).governanceTriggerRefs = ["PKGTR-001", "PKGTR-002"]; }
  },
  {
    id: "portable-import-governance-status",
    rule: "candidate imports require governance",
    expect: "PKD-001 candidate import must have status governance-required until local validation.",
    mutate: (pkg) => { portableDecision(pkg).status = "reviewed"; }
  },
  {
    id: "portable-assessment-count",
    rule: "portable assessment counts reproduce",
    expect: "PKA-001 itemCount must reproduce as 2.",
    mutate: (pkg) => { portableAssessment(pkg).itemCount = 1; }
  },
  {
    id: "portable-assessment-signals",
    rule: "portable assessment signals reproduce",
    expect: "PKA-001 assessmentSignals must reproduce as",
    mutate: (pkg) => { portableAssessment(pkg).assessmentSignals = ["candidate-only"]; }
  },
  {
    id: "portable-assessment-sufficiency",
    rule: "portable assessment remains insufficient",
    expect: "PKA-001 dataSufficiency must remain insufficient before local validation.",
    mutate: (pkg) => { portableAssessment(pkg).dataSufficiency = "sufficient"; }
  },
  {
    id: "portable-assessment-trigger",
    rule: "insufficient portable assessment routes governance",
    expect: "PKA-001 insufficient portable knowledge assessment requires a portable-assessment-insufficient governance trigger.",
    mutate: (pkg) => { portableAssessment(pkg).governanceTriggerRefs = ["PKGTR-001", "PKGTR-002", "PKGTR-003"]; }
  },
  {
    id: "portable-verifier-local-validity-boundary",
    rule: "verifier does not claim imported applicability",
    expect: "verifierBoundary must explicitly avoid claiming imported knowledge applicability or local validity.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "imported knowledge applicability or local validity"); }
  },
  {
    id: "portable-local-policies-not-array",
    rule: "local validation policies are retained",
    expect: "portableKnowledgeLocalValidationPolicies must be an array.",
    mutate: (pkg) => { pkg.portableKnowledgeLocalValidationPolicies = null; }
  },
  {
    id: "portable-local-policy-dimensions",
    rule: "local validation covers every applicability dimension",
    expect: "PKLVP-001 requiredApplicabilityDimensions must include all seven local target dimensions exactly once.",
    mutate: (pkg) => { localValidationPolicy(pkg).requiredApplicabilityDimensions = ["context", "domain"]; }
  },
  {
    id: "portable-local-policy-authority-boundary",
    rule: "local validation does not activate knowledge",
    expect: "PKLVP-001 must forbid automatic activation, automatic authority, and semantic truth claims.",
    mutate: (pkg) => { localValidationPolicy(pkg).automaticAuthority = true; }
  },
  {
    id: "portable-local-applicability-target",
    rule: "applicability decision target resolves",
    expect: "PKLAD-001/targetRef references missing entity",
    mutate: (pkg) => { localApplicability(pkg).targetRef.entityRef = "TGT-NOPE-999"; }
  },
  {
    id: "portable-local-applicability-dimensions",
    rule: "applicability decision executes policy dimensions",
    expect: "PKLAD-001 evaluatedDimensions must reproduce the policy dimensions exactly once.",
    mutate: (pkg) => { localApplicability(pkg).evaluatedDimensions = ["context", "domain"]; }
  },
  {
    id: "portable-local-applicability-mismatch-trigger",
    rule: "local context mismatch routes governance",
    expect: "PKLAD-001 local mismatch or non-applicable decision requires a portable-local-target-mismatch governance trigger.",
    mutate: (pkg) => { localApplicability(pkg).mismatches = ["Local waiver authority differs."]; }
  },
  {
    id: "portable-local-reproduction-source-overlap",
    rule: "reproduction cases are unseen",
    expect: "PKLRT-001 unseen cases must not overlap source cases.",
    mutate: (pkg) => { localReproduction(pkg).unseenCaseRefs[0] = structuredClone(localReproduction(pkg).sourceCaseRefs[0]); }
  },
  {
    id: "portable-local-reproduction-case-coverage",
    rule: "expected decisions cover unseen cases",
    expect: "PKLRT-001 expectedDecisions must cover unseenCaseRefs exactly once.",
    mutate: (pkg) => { localReproduction(pkg).expectedDecisions.pop(); }
  },
  {
    id: "portable-local-reproduction-agreement",
    rule: "agreement score reproduces from case decisions",
    expect: "PKLRT-001 agreementScore must reproduce as 1.",
    mutate: (pkg) => { localReproduction(pkg).agreementScore = 0.5; }
  },
  {
    id: "portable-local-reproduction-independence",
    rule: "evaluator identity separation reproduces",
    expect: "PKLRT-001 evaluatorIndependent must reproduce as false.",
    mutate: (pkg) => { localReproduction(pkg).evaluatorRef = "EXP-SW-001"; }
  },
  {
    id: "portable-local-reproduction-counterexamples",
    rule: "all imported counterexamples are challenged",
    expect: "PKLRT-001 counterexampleOutcomes must challenge every imported counterexample exactly once.",
    mutate: (pkg) => { localReproduction(pkg).counterexampleOutcomes.pop(); }
  },
  {
    id: "portable-local-reproduction-result",
    rule: "trial result reproduces",
    expect: "PKLRT-001 result must reproduce as partial-pass.",
    mutate: (pkg) => { localReproduction(pkg).counterexampleOutcomes[0].outcome = "unresolved"; }
  },
  {
    id: "portable-local-reproduction-evidence-trigger",
    rule: "example-only evidence routes governance",
    expect: "PKLRT-001 unverified or example-only evidence requires a portable-local-evidence-unverified governance trigger.",
    mutate: (pkg) => { localReproduction(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "portable-local-reproduction-hidden-reasoning",
    rule: "reproduction excludes hidden reasoning",
    expect: "PKLRT-001 must not store hidden reasoning.",
    mutate: (pkg) => { localReproduction(pkg).hiddenReasoningStored = true; }
  },
  {
    id: "portable-local-assessment-item-coverage",
    rule: "applicability decisions cover assessed items",
    expect: "PKLVA-001 applicability decisions must cover itemRefs exactly once.",
    mutate: (pkg) => { localValidationAssessment(pkg).applicabilityDecisionRefs = ["PKLAD-001"]; }
  },
  {
    id: "portable-local-assessment-count",
    rule: "local validation counts reproduce",
    expect: "PKLVA-001 reproducedItemCount must reproduce as 2.",
    mutate: (pkg) => { localValidationAssessment(pkg).reproducedItemCount = 1; }
  },
  {
    id: "portable-local-assessment-source-trust",
    rule: "source trust state reproduces",
    expect: "PKLVA-001 sourceTrustStatus must reproduce as unverified.",
    mutate: (pkg) => { localValidationAssessment(pkg).sourceTrustStatus = "verified"; }
  },
  {
    id: "portable-local-assessment-sufficiency",
    rule: "local validation sufficiency reproduces",
    expect: "PKLVA-001 dataSufficiency must reproduce as insufficient.",
    mutate: (pkg) => { localValidationAssessment(pkg).dataSufficiency = "sufficient"; }
  },
  {
    id: "portable-local-assessment-eligibility",
    rule: "activation eligibility reproduces",
    expect: "PKLVA-001 activationEligibility must reproduce as not-eligible.",
    mutate: (pkg) => { localValidationAssessment(pkg).activationEligibility = "eligible-for-governed-activation"; }
  },
  {
    id: "portable-local-assessment-signals",
    rule: "local validation signals reproduce",
    expect: "PKLVA-001 assessmentSignals must reproduce as",
    mutate: (pkg) => { localValidationAssessment(pkg).assessmentSignals = ["eligible-for-governed-activation"]; }
  },
  {
    id: "portable-local-assessment-trigger",
    rule: "insufficient local validation routes governance",
    expect: "PKLVA-001 insufficient local validation requires a portable-local-validation-insufficient governance trigger.",
    mutate: (pkg) => { localValidationAssessment(pkg).governanceTriggerRefs = ["PKGTR-001", "PKGTR-005"]; }
  },
  {
    id: "portable-local-assessment-authority-boundary",
    rule: "local assessment does not grant authority",
    expect: "PKLVA-001 must keep counts as evidence and forbid automatic activation, authority, and semantic truth claims.",
    mutate: (pkg) => { localValidationAssessment(pkg).automaticActivation = true; }
  },
  {
    id: "portable-local-verifier-independence-boundary",
    rule: "verifier does not overclaim evaluator independence",
    expect: "verifierBoundary must explicitly avoid claiming evaluator independence beyond recorded identity separation.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "evaluator independence beyond recorded identity separation"); }
  },
  {
    id: "portable-revocation-policy-boundary",
    rule: "revocation policy fails closed and preserves history",
    expect: "PKRVP-001 must require evidence, dependency closure, fail-closed handling, and history preservation.",
    mutate: (pkg) => { revocationPolicy(pkg).failClosedOnUnknownImpact = false; }
  },
  {
    id: "portable-revocation-exact-item",
    rule: "revocation subject resolves exactly",
    expect: "PKRVN-001 references missing portable knowledge item PKI-NOPE-999.",
    mutate: (pkg) => { revocationNotice(pkg).itemRef = "PKI-NOPE-999"; }
  },
  {
    id: "portable-revocation-digest-match",
    rule: "item revocation digest matches source",
    expect: "PKRVN-001 sourceDigest must exactly match PKI-001.",
    mutate: (pkg) => { revocationNotice(pkg).sourceDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-revocation-source-trigger",
    rule: "unverified notice routes governance",
    expect: "PKRVN-001 unverified revocation issuer requires a portable-revocation-source-unverified governance trigger.",
    mutate: (pkg) => { revocationNotice(pkg).governanceTriggerRefs = ["PKGTR-008"]; }
  },
  {
    id: "portable-dependency-upstream",
    rule: "dependency endpoints resolve",
    expect: "PKDE-001 references missing upstream record PKI-NOPE-999.",
    mutate: (pkg) => { dependencyEdge(pkg).upstreamRef = "PKI-NOPE-999"; }
  },
  {
    id: "portable-dependency-self",
    rule: "dependency edges do not self-reference",
    expect: "PKDE-001 must not self-reference.",
    mutate: (pkg) => { dependencyEdge(pkg).downstreamRef = "PKI-001"; }
  },
  {
    id: "portable-revocation-direct-impact",
    rule: "direct impact reproduces from graph",
    expect: "PKRVIA-001 directDependentRefs must exactly reproduce direct dependency impact.",
    mutate: (pkg) => { revocationImpact(pkg).directDependentRefs = ["PKLAD-001"]; }
  },
  {
    id: "portable-revocation-transitive-impact",
    rule: "transitive impact reproduces from graph",
    expect: "PKRVIA-001 transitiveDependentRefs must exactly reproduce transitive dependency impact.",
    mutate: (pkg) => { revocationImpact(pkg).transitiveDependentRefs = []; }
  },
  {
    id: "portable-revocation-fail-closed",
    rule: "active revocation suspends eligibility",
    expect: "PKRVIA-001 active or disputed notice must fail closed with suspended eligibility.",
    mutate: (pkg) => { revocationImpact(pkg).eligibilityEffect = "unaffected"; }
  },
  {
    id: "portable-revocation-preserves-history",
    rule: "revocation does not delete history",
    expect: "PKRVIA-001 must preserve history and forbid deletion, automatic activation, authority, and semantic truth claims.",
    mutate: (pkg) => { revocationImpact(pkg).destructiveDeletion = true; }
  },
  {
    id: "portable-revalidation-remains-suspended",
    rule: "untrusted replacement cannot restore use",
    expect: "PKRVD-001 must remain suspended until trusted replacement evidence is reviewed.",
    mutate: (pkg) => { revalidationDecision(pkg).resultingUseStatus = "candidate"; }
  },
  {
    id: "portable-revalidation-trigger",
    rule: "insufficient revalidation routes governance",
    expect: "PKRVD-001 insufficient revalidation requires a portable-revalidation-insufficient governance trigger.",
    mutate: (pkg) => { revalidationDecision(pkg).governanceTriggerRefs = ["PKGTR-008"]; }
  },
  {
    id: "portable-revocation-verifier-boundary",
    rule: "verifier does not claim revocation authenticity",
    expect: "verifierBoundary must explicitly avoid claiming revocation notice authenticity or compromise truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "revocation notice authenticity or compromise truth"); }
  },
  {
    id: "portable-trust-policy-window",
    rule: "trust policy validity window is ordered",
    expect: "PKTP-001 validFrom must precede validUntil.",
    mutate: (pkg) => { trustPolicy(pkg).validUntil = "2026-09-01T00:00:00.000Z"; }
  },
  {
    id: "portable-trust-policy-boundary",
    rule: "trust policy fails closed without authority",
    expect: "PKTP-001 must require cryptographic, transparency, and revocation evidence and fail closed.",
    mutate: (pkg) => { trustPolicy(pkg).failClosed = false; }
  },
  {
    id: "portable-attestation-item",
    rule: "attestation item resolves",
    expect: "PKAT-001 references missing portable knowledge item PKI-NOPE-999.",
    mutate: (pkg) => { attestation(pkg).itemRef = "PKI-NOPE-999"; }
  },
  {
    id: "portable-attestation-digest",
    rule: "attestation digest matches exact item",
    expect: "PKAT-001 subjectDigest must exactly match PKI-002.",
    mutate: (pkg) => { attestation(pkg).subjectDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-attestation-window",
    rule: "attestation window is ordered",
    expect: "PKAT-001 issuedAt must precede expiresAt.",
    mutate: (pkg) => { attestation(pkg).expiresAt = "2026-10-01T00:00:00.000Z"; }
  },
  {
    id: "portable-attestation-hidden-reasoning",
    rule: "attestation excludes hidden reasoning",
    expect: "PKAT-001 must not store hidden reasoning.",
    mutate: (pkg) => { attestation(pkg).hiddenReasoningStored = true; }
  },
  {
    id: "portable-trust-decision-policy-version",
    rule: "trust decision pins policy version",
    expect: "PKTD-001 policyVersion must exactly match PKTP-001.",
    mutate: (pkg) => { trustDecision(pkg).policyVersion = "0.9.0"; }
  },
  {
    id: "portable-trust-decision-issuer",
    rule: "issuer acceptance reproduces",
    expect: "PKTD-001 issuerAccepted must reproduce as false.",
    mutate: (pkg) => { attestation(pkg).issuer = "https://untrusted.example"; }
  },
  {
    id: "portable-trust-decision-predicate",
    rule: "predicate acceptance reproduces",
    expect: "PKTD-001 predicateTypeAccepted must reproduce as false.",
    mutate: (pkg) => { attestation(pkg).predicateType = "https://example.org/unknown"; }
  },
  {
    id: "portable-trust-decision-root",
    rule: "trust-root acceptance reproduces",
    expect: "PKTD-001 trustRootAccepted must reproduce as false.",
    mutate: (pkg) => { attestation(pkg).trustRootRevision = "unknown-root"; }
  },
  {
    id: "portable-trust-decision-expiry",
    rule: "attestation validity reproduces",
    expect: "PKTD-001 withinAttestationWindow must reproduce as false.",
    mutate: (pkg) => { trustDecision(pkg).evaluatedAt = "2026-12-01T00:00:00.000Z"; }
  },
  {
    id: "portable-trust-decision-transparency",
    rule: "transparency evidence reproduces",
    expect: "PKTD-001 transparencyEvidenceSatisfied must reproduce as false.",
    mutate: (pkg) => { attestation(pkg).transparencyEvidenceStatus = "missing"; }
  },
  {
    id: "portable-trust-decision-revoked",
    rule: "revocation status rejects",
    expect: "PKTD-001 revocationCheckSatisfied must reproduce as false.",
    mutate: (pkg) => { attestation(pkg).revocationStatus = "revoked"; }
  },
  {
    id: "portable-trust-decision-authority-boundary",
    rule: "trust checks do not grant authority",
    expect: "PKTD-001 must treat checks as evidence and forbid automatic activation, authority, and semantic truth claims.",
    mutate: (pkg) => { trustDecision(pkg).automaticAuthority = true; }
  },
  {
    id: "portable-trust-verifier-boundary",
    rule: "verifier does not claim cryptographic or semantic truth",
    expect: "verifierBoundary must explicitly avoid claiming cryptographic validity beyond recorded evidence, artifact safety, or attestation semantic fitness.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "cryptographic validity beyond recorded evidence, artifact safety, or attestation semantic fitness"); }
  },
  {
    id: "portable-trust-lineage-initial-previous",
    rule: "initial trust policy has no predecessor",
    expect: "PKTP-001 initial revision must not reference a previous policy.",
    mutate: (pkg) => { trustPolicy(pkg).previousPolicyRef = "PKTP-002"; }
  },
  {
    id: "portable-trust-lineage-rotation-previous",
    rule: "rotated trust policy names predecessor",
    expect: "PKTP-002 non-initial revision requires previousPolicyRef.",
    mutate: (pkg) => { delete trustPolicy(pkg, 1).previousPolicyRef; }
  },
  {
    id: "portable-trust-lineage-backlink",
    rule: "trust policy succession is bidirectional",
    expect: "PKTP-002 previous policy must point back through supersededByPolicyRef.",
    mutate: (pkg) => { trustPolicy(pkg).supersededByPolicyRef = "PKTP-NOPE-999"; }
  },
  {
    id: "portable-trust-lineage-boundary",
    rule: "rotation boundary is contiguous",
    expect: "PKTP-002 effectiveAt must equal the previous policy validUntil boundary.",
    mutate: (pkg) => { trustPolicy(pkg, 1).effectiveAt = "2026-10-29T00:00:00.000Z"; trustPolicy(pkg, 1).validFrom = "2026-10-29T00:00:00.000Z"; }
  },
  {
    id: "portable-trust-lineage-active-count",
    rule: "one trust policy revision is active",
    expect: "trust policy lineage must contain exactly one active revision.",
    mutate: (pkg) => { trustPolicy(pkg).status = "active"; }
  },
  {
    id: "portable-trust-replay-original-snapshot",
    rule: "historical replay freezes original decision",
    expect: "PKTR-001 frozen original decision inputs must exactly match PKTD-001.",
    mutate: (pkg) => { trustReplay(pkg).originalDecisionValue = "rejected"; }
  },
  {
    id: "portable-trust-replay-policy-version",
    rule: "historical replay pins later policy version",
    expect: "PKTR-001 replayPolicyVersion must exactly match PKTP-002.",
    mutate: (pkg) => { trustReplay(pkg).replayPolicyVersion = "1.9.9"; }
  },
  {
    id: "portable-trust-replay-distinct-policy",
    rule: "historical replay uses a later policy",
    expect: "PKTR-001 replay policy must differ from the original policy.",
    mutate: (pkg) => { trustReplay(pkg).replayPolicyRef = "PKTP-001"; trustReplay(pkg).replayPolicyVersion = "1.0.0"; }
  },
  {
    id: "portable-trust-replay-check",
    rule: "historical replay checks reproduce",
    expect: "PKTR-001 trustRootAccepted must reproduce as false.",
    mutate: (pkg) => { trustReplay(pkg).trustRootAccepted = true; }
  },
  {
    id: "portable-trust-replay-decision",
    rule: "historical replay decision reproduces",
    expect: "PKTR-001 replayDecision must reproduce as governance-required.",
    mutate: (pkg) => { trustReplay(pkg).replayDecision = "policy-conformant-candidate"; }
  },
  {
    id: "portable-trust-replay-delta",
    rule: "historical replay outcome delta reproduces",
    expect: "PKTR-001 outcomeDelta must reproduce as tightened.",
    mutate: (pkg) => { trustReplay(pkg).outcomeDelta = "unchanged"; }
  },
  {
    id: "portable-trust-replay-material-change",
    rule: "historical replay material change reproduces",
    expect: "PKTR-001 materialChange must reproduce as true.",
    mutate: (pkg) => { trustReplay(pkg).materialChange = false; }
  },
  {
    id: "portable-trust-replay-change-trigger",
    rule: "changed replay routes governance",
    expect: "PKTR-001 material outcome change requires a portable-trust-replay-outcome-changed governance trigger.",
    mutate: (pkg) => { trustReplay(pkg).governanceTriggerRefs = trustReplay(pkg).governanceTriggerRefs.filter((ref) => ref !== "PKGTR-012"); }
  },
  {
    id: "portable-trust-replay-insufficient-trigger",
    rule: "insufficient replay routes governance",
    expect: "PKTR-001 insufficient replay requires a portable-trust-replay-insufficient governance trigger.",
    mutate: (pkg) => { trustReplay(pkg).governanceTriggerRefs = trustReplay(pkg).governanceTriggerRefs.filter((ref) => ref !== "PKGTR-013"); }
  },
  {
    id: "portable-trust-replay-history-boundary",
    rule: "historical replay preserves history without authority",
    expect: "PKTR-001 must preserve history and frozen inputs, treat counts as evidence, and forbid automatic activation, authority, and semantic truth claims.",
    mutate: (pkg) => { trustReplay(pkg).automaticAuthority = true; }
  },
  {
    id: "portable-trust-replay-verifier-boundary",
    rule: "verifier does not turn replay into current authority",
    expect: "verifierBoundary must explicitly avoid claiming historical replay as current authorization, activation, authority, or semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "historical replay as current authorization, activation, authority, or semantic truth"); }
  },
  {
    id: "portable-trust-rollout-proposed-draft",
    rule: "rollout preview does not activate proposed policy",
    expect: "PKRP-001 proposed policy must remain draft during preview.",
    mutate: (pkg) => { trustPolicy(pkg, 2).status = "active"; }
  },
  {
    id: "portable-trust-rollout-scope-digest",
    rule: "frozen rollout scope digest reproduces",
    expect: "PKRP-001 scopeDigest must reproduce as",
    mutate: (pkg) => { rolloutPreview(pkg).scopeDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-trust-rollout-all-items",
    rule: "all-items scope covers the complete portable population",
    expect: "PKRP-001 all-portable-items scope must include every portable knowledge item exactly once.",
    mutate: (pkg) => { rolloutPreview(pkg).scopeSnapshot.pop(); }
  },
  {
    id: "portable-trust-rollout-item-source-digest",
    rule: "scope snapshot freezes each item digest",
    expect: "PKRP-001 scope digest for PKI-001 must match the frozen item sourceDigest.",
    mutate: (pkg) => { rolloutPreview(pkg).scopeSnapshot[0].sourceDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-trust-rollout-preview-duplicate",
    rule: "item previews are unique",
    expect: "PKRP-001 itemPreviewRefs must not contain duplicates.",
    mutate: (pkg) => { rolloutPreview(pkg).itemPreviewRefs[1] = "PKRIP-001"; }
  },
  {
    id: "portable-trust-rollout-coverage",
    rule: "coverage completeness reproduces",
    expect: "PKRP-001 coverageComplete must reproduce as false.",
    mutate: (pkg) => { rolloutPreview(pkg).itemPreviewRefs.pop(); }
  },
  {
    id: "portable-trust-rollout-census",
    rule: "affected-knowledge census arithmetic reproduces",
    expect: "PKRP-001 relaxedCount must reproduce as 1.",
    mutate: (pkg) => { rolloutPreview(pkg).relaxedCount = 0; }
  },
  {
    id: "portable-trust-rollout-item-policy-version",
    rule: "item preview pins proposed policy version",
    expect: "PKRIP-002 proposedPolicyVersion must exactly match PKTP-003.",
    mutate: (pkg) => { rolloutItemPreview(pkg, 1).proposedPolicyVersion = "2.9.9"; }
  },
  {
    id: "portable-trust-rollout-baseline",
    rule: "item preview reproduces baseline result",
    expect: "PKRIP-002 baselineDecisionValue must reproduce as governance-required.",
    mutate: (pkg) => { rolloutItemPreview(pkg, 1).baselineDecisionValue = "rejected"; }
  },
  {
    id: "portable-trust-rollout-complete-input",
    rule: "complete preview input resolves replay evidence",
    expect: "PKRIP-002 complete input requires attestationRef, baselineResultRef, and replayRef.",
    mutate: (pkg) => { delete rolloutItemPreview(pkg, 1).replayRef; }
  },
  {
    id: "portable-trust-rollout-unresolved-codes",
    rule: "incomplete item preview names unresolved input",
    expect: "PKRIP-001 incomplete input requires unresolvedInputCodes.",
    mutate: (pkg) => { rolloutItemPreview(pkg).unresolvedInputCodes = []; }
  },
  {
    id: "portable-trust-rollout-replay-result",
    rule: "item preview mirrors proposed-policy replay",
    expect: "PKRIP-002 previewDecision must reproduce PKTR-002.",
    mutate: (pkg) => { rolloutItemPreview(pkg, 1).previewDecision = "governance-required"; }
  },
  {
    id: "portable-trust-rollout-delta",
    rule: "item preview delta compares baseline and proposed outcomes",
    expect: "PKRIP-002 outcomeDelta must reproduce as relaxed.",
    mutate: (pkg) => { rolloutItemPreview(pkg, 1).outcomeDelta = "unchanged"; }
  },
  {
    id: "portable-trust-rollout-input-trigger",
    rule: "unresolved rollout input routes governance",
    expect: "PKRIP-001 unresolved input requires a portable-trust-rollout-input-unresolved governance trigger.",
    mutate: (pkg) => { rolloutItemPreview(pkg).governanceTriggerRefs = rolloutItemPreview(pkg).governanceTriggerRefs.filter((ref) => ref !== "PKGTR-014"); }
  },
  {
    id: "portable-trust-rollout-change-trigger",
    rule: "material rollout change routes governance",
    expect: "PKRIP-002 material change requires a portable-trust-rollout-material-change governance trigger.",
    mutate: (pkg) => { rolloutItemPreview(pkg, 1).governanceTriggerRefs = rolloutItemPreview(pkg, 1).governanceTriggerRefs.filter((ref) => ref !== "PKGTR-015"); }
  },
  {
    id: "portable-trust-rollout-insufficient-trigger",
    rule: "insufficient rollout blocks activation",
    expect: "PKRP-001 insufficient rollout preview requires a portable-trust-rollout-insufficient governance trigger.",
    mutate: (pkg) => { rolloutPreview(pkg).governanceTriggerRefs = rolloutPreview(pkg).governanceTriggerRefs.filter((ref) => ref !== "PKGTR-016"); }
  },
  {
    id: "portable-trust-rollout-authority-boundary",
    rule: "rollout preview does not authorize activation",
    expect: "PKRP-001 must remain preview-only, treat counts as evidence, and forbid activation, authority, and semantic truth claims.",
    mutate: (pkg) => { rolloutPreview(pkg).activationAuthorized = true; }
  },
  {
    id: "portable-trust-rollout-verifier-boundary",
    rule: "verifier does not turn preview into policy authority",
    expect: "verifierBoundary must explicitly avoid claiming rollout preview as policy activation approval, enforcement authority, population fitness, or semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "rollout preview as policy activation approval, enforcement authority, population fitness, or semantic truth"); }
  },
  {
    id: "portable-trust-activation-preview-sufficient",
    rule: "authorization requires a sufficient rollout preview",
    expect: "PKAD-001 cannot authorize an insufficient rollout preview.",
    mutate: (pkg) => { activationDecision(pkg).rolloutPreviewRef = "PKRP-001"; }
  },
  {
    id: "portable-trust-activation-scope-digest",
    rule: "activation freezes the preview scope",
    expect: "PKAD-001 scopeDigest must exactly match PKRP-002.",
    mutate: (pkg) => { activationDecision(pkg).scopeDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-trust-activation-rollback-target",
    rule: "activation names the baseline rollback target",
    expect: "PKAD-001 rollback target must be the baseline policy.",
    mutate: (pkg) => { activationDecision(pkg).rollbackTargetPolicyRef = "PKTP-001"; }
  },
  {
    id: "portable-trust-activation-material-acknowledgement",
    rule: "material rollout changes are acknowledged",
    expect: "PKAD-001 materialChangesAcknowledged must reproduce as true.",
    mutate: (pkg) => { activationDecision(pkg).materialChangesAcknowledged = false; }
  },
  {
    id: "portable-trust-activation-material-trigger",
    rule: "material activation routes governance",
    expect: "PKAD-001 material change requires a portable-trust-activation-material-change governance trigger.",
    mutate: (pkg) => { activationDecision(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "portable-trust-activation-observation-backlink",
    rule: "activation and observation are bidirectionally linked",
    expect: "PKAD-001 observation must point back to the activation decision.",
    mutate: (pkg) => { policyObservation(pkg).activationDecisionRef = "PKAD-NOPE"; }
  },
  {
    id: "portable-trust-activation-decision-boundary",
    rule: "activation decision does not execute or grant authority",
    expect: "PKAD-001 must preserve preview evidence, separate decision from execution, treat counts as evidence, and forbid automatic activation, authority, and semantic truth claims.",
    mutate: (pkg) => { activationDecision(pkg).automaticActivation = true; }
  },
  {
    id: "portable-trust-observation-window",
    rule: "observation evaluation stays inside its bounded window",
    expect: "PKOBS-001 evaluation must occur inside a bounded observation window.",
    mutate: (pkg) => { policyObservation(pkg).evaluatedAt = "2026-10-31T00:00:00.000Z"; }
  },
  {
    id: "portable-trust-observation-completeness",
    rule: "observation completeness reproduces from evidence-bearing signals",
    expect: "PKOBS-001 observationComplete must reproduce as false.",
    mutate: (pkg) => { policyObservation(pkg).signals[0].result = "missing"; policyObservation(pkg).signals[0].evidenceRefs = []; }
  },
  {
    id: "portable-trust-observation-stop-condition",
    rule: "stop conditions reproduce from signal failures",
    expect: "PKOBS-001 stopConditionMet must reproduce as true.",
    mutate: (pkg) => { policyObservation(pkg).stopConditionMet = false; }
  },
  {
    id: "portable-trust-observation-decision",
    rule: "observation decision fails closed",
    expect: "PKOBS-001 observationDecision must reproduce as rollback-required.",
    mutate: (pkg) => { policyObservation(pkg).observationDecision = "continue"; }
  },
  {
    id: "portable-trust-observation-stop-trigger",
    rule: "stop condition routes governance",
    expect: "PKOBS-001 stop condition requires a portable-trust-observation-stop-condition governance trigger.",
    mutate: (pkg) => { policyObservation(pkg).governanceTriggerRefs = ["PKGTR-019"]; }
  },
  {
    id: "portable-trust-observation-boundary",
    rule: "observation does not continue automatically",
    expect: "PKOBS-001 must treat signal counts as evidence and forbid automatic continuation, authority, and semantic truth claims.",
    mutate: (pkg) => { policyObservation(pkg).automaticContinuation = true; }
  },
  {
    id: "portable-trust-rollback-policy-chain",
    rule: "rollback restores the activation baseline",
    expect: "PKRB-001 from and target policies must match the activation decision.",
    mutate: (pkg) => { rollbackRecord(pkg).targetPolicyRef = "PKTP-001"; }
  },
  {
    id: "portable-trust-rollback-deadline",
    rule: "rollback deadline matches the activation contract",
    expect: "PKRB-001 rollbackDeadline must match the activation decision.",
    mutate: (pkg) => { rollbackRecord(pkg).rollbackDeadline = "2026-10-31T13:00:00.000Z"; }
  },
  {
    id: "portable-trust-rollback-completion-evidence",
    rule: "completed rollback requires execution evidence",
    expect: "PKRB-001 completed rollback requires completedAt and execution evidence.",
    mutate: (pkg) => { rollbackRecord(pkg).executionEvidenceRefs = []; }
  },
  {
    id: "portable-trust-rollback-incomplete-trigger",
    rule: "incomplete rollback remains governed",
    expect: "PKRB-001 incomplete rollback requires a portable-trust-rollback-incomplete governance trigger.",
    mutate: (pkg) => { rollbackRecord(pkg).rollbackStatus = "planned"; delete rollbackRecord(pkg).completedAt; rollbackRecord(pkg).executionEvidenceRefs = []; rollbackRecord(pkg).status = "governance-required"; rollbackRecord(pkg).governanceTriggerRefs = ["PKGTR-019"]; }
  },
  {
    id: "portable-trust-rollback-boundary",
    rule: "rollback preserves history without automatic authority",
    expect: "PKRB-001 must preserve history, forbid destructive deletion, treat counts as evidence, and forbid automatic rollback, authority, and semantic truth claims.",
    mutate: (pkg) => { rollbackRecord(pkg).automaticRollback = true; }
  },
  {
    id: "portable-trust-execution-action-record",
    rule: "execution reconciliation resolves the declared action",
    expect: "PKXR-001 activation actionRecordRef must equal activationDecisionRef.",
    mutate: (pkg) => { executionReconciliation(pkg).actionRecordRef = "PKRB-001"; }
  },
  {
    id: "portable-trust-execution-policy-state",
    rule: "expected policy reproduces from the action",
    expect: "PKXR-001 expectedPolicyRef must reproduce from the referenced action.",
    mutate: (pkg) => { executionReconciliation(pkg).expectedPolicyRef = "PKTP-002"; }
  },
  {
    id: "portable-trust-execution-scope",
    rule: "execution reconciliation retains activation scope",
    expect: "PKXR-001 expectedScopeDigest must match the activation scope.",
    mutate: (pkg) => { executionReconciliation(pkg).expectedScopeDigest = `sha256:${"0".repeat(64)}`; }
  },
  {
    id: "portable-trust-execution-state-match",
    rule: "state match reproduces from observed state",
    expect: "PKXR-001 stateMatched must reproduce as false.",
    mutate: (pkg) => { executionReconciliation(pkg).observedPolicyRef = "PKTP-002"; }
  },
  {
    id: "portable-trust-execution-result",
    rule: "execution result requires evidence",
    expect: "PKXR-001 result must reproduce as unverified.",
    mutate: (pkg) => { executionReconciliation(pkg).executionEvidenceRefs = []; }
  },
  {
    id: "portable-trust-execution-mismatch-trigger",
    rule: "execution mismatch routes governance",
    expect: "PKXR-001 execution mismatch requires a portable-trust-execution-state-mismatch governance trigger.",
    mutate: (pkg) => { executionReconciliation(pkg).observedPolicyRef = "PKTP-002"; executionReconciliation(pkg).stateMatched = false; executionReconciliation(pkg).result = "mismatch"; }
  },
  {
    id: "portable-trust-execution-boundary",
    rule: "reconciliation does not claim provider truth or authority",
    expect: "PKXR-001 must preserve history, treat counts as evidence, and forbid automatic state claims, authority, and semantic truth claims.",
    mutate: (pkg) => { executionReconciliation(pkg).automaticStateClaim = true; }
  },
  {
    id: "portable-trust-recovery-reconciliation",
    rule: "recovery uses the rollback execution reconciliation",
    expect: "PKRV-001 reconciliation must describe the referenced rollback.",
    mutate: (pkg) => { recoveryVerification(pkg).rollbackReconciliationRef = "PKXR-001"; }
  },
  {
    id: "portable-trust-recovery-policy-state",
    rule: "recovery expected state matches rollback target",
    expect: "PKRV-001 expectedRestoredPolicyRef must match the rollback target.",
    mutate: (pkg) => { recoveryVerification(pkg).expectedRestoredPolicyRef = "PKTP-003"; }
  },
  {
    id: "portable-trust-recovery-decision",
    rule: "recovery decision reproduces from checks and state",
    expect: "PKRV-001 verificationDecision must reproduce as failed.",
    mutate: (pkg) => { recoveryVerification(pkg).effectChecks[0].result = "fail"; }
  },
  {
    id: "portable-trust-recovery-incomplete-trigger",
    rule: "incomplete recovery routes governance",
    expect: "PKRV-001 incomplete recovery requires a portable-trust-recovery-incomplete governance trigger.",
    mutate: (pkg) => { recoveryVerification(pkg).effectChecks[0].result = "missing"; recoveryVerification(pkg).effectChecks[0].evidenceRefs = []; recoveryVerification(pkg).recoveryComplete = false; recoveryVerification(pkg).verificationDecision = "incomplete"; }
  },
  {
    id: "portable-trust-recovery-failed-trigger",
    rule: "failed recovery routes governance",
    expect: "PKRV-001 failed recovery requires a portable-trust-recovery-failed governance trigger.",
    mutate: (pkg) => { recoveryVerification(pkg).effectChecks[0].result = "fail"; recoveryVerification(pkg).recoveryComplete = false; recoveryVerification(pkg).verificationDecision = "failed"; }
  },
  {
    id: "portable-trust-recovery-boundary",
    rule: "recovery verification does not claim automatic recovery",
    expect: "PKRV-001 must preserve history, treat counts as evidence, and forbid automatic recovery claims, authority, and semantic truth claims.",
    mutate: (pkg) => { recoveryVerification(pkg).automaticRecoveryClaim = true; }
  },
  {
    id: "portable-trust-promotion-activation-reconciliation",
    rule: "promotion resolves activation execution evidence",
    expect: "PKPD-001 activation reconciliation must describe the same activation decision.",
    mutate: (pkg) => { promotionDecision(pkg).activationReconciliationRef = "PKXR-002"; }
  },
  {
    id: "portable-trust-promotion-disposition",
    rule: "policy disposition reproduces from observation and recovery",
    expect: "PKPD-001 disposition must reproduce as retire.",
    mutate: (pkg) => { promotionDecision(pkg).disposition = "promote"; }
  },
  {
    id: "portable-trust-promotion-current-policy",
    rule: "retirement leaves the restored baseline current",
    expect: "PKPD-001 retired candidate must leave the baseline policy current.",
    mutate: (pkg) => { promotionDecision(pkg).currentPolicyRef = "PKTP-003"; }
  },
  {
    id: "portable-trust-promotion-blocked-trigger",
    rule: "failed recovery blocks promotion through governance",
    expect: "PKPD-001 blocked promotion requires a portable-trust-promotion-blocked governance trigger.",
    mutate: (pkg) => { recoveryVerification(pkg).verificationDecision = "failed"; promotionDecision(pkg).disposition = "failed-recovery"; promotionDecision(pkg).status = "governance-required"; }
  },
  {
    id: "portable-trust-promotion-authority",
    rule: "promotion disposition retains accountable authority",
    expect: "PKPD-001 requires accountable decidedBy and authorityBasis.",
    mutate: (pkg) => { promotionDecision(pkg).authorityBasis = ""; }
  },
  {
    id: "portable-trust-promotion-boundary",
    rule: "promotion decision does not execute or grant authority",
    expect: "PKPD-001 must preserve predecessor state, separate decision from execution, treat counts as evidence, and forbid automatic promotion, authority, and semantic truth claims.",
    mutate: (pkg) => { promotionDecision(pkg).automaticPromotion = true; }
  },
  {
    id: "portable-trust-activation-verifier-boundary",
    rule: "verifier does not turn records into execution or semantic proof",
    expect: "verifierBoundary must explicitly avoid claiming activation decision as proof of execution, safe continuation, successful rollback, or semantic fitness.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "activation decision as proof of execution, safe continuation, successful rollback, or semantic fitness"); }
  },
  {
    id: "portable-trust-promotion-verifier-boundary",
    rule: "verifier does not turn reconciliation into provider truth or promotion authority",
    expect: "verifierBoundary must explicitly avoid claiming execution reconciliation as provider authenticity, complete side-effect recovery, automatic promotion authority, or semantic fitness.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = pkg.verifierBoundary.doesNotClaim.filter((claim) => claim !== "execution reconciliation as provider authenticity, complete side-effect recovery, automatic promotion authority, or semantic fitness"); }
  }
];

export const spec = {
  suiteId: "qif-ledger",
  basePackage: "examples/qif-ledger-package.json",
  validator,
  corpusDir: "tests/fixtures/qif-ledger",
  filePrefix: "qif-ledger"
};
