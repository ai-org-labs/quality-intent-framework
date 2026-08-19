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
  }
];

export const spec = {
  suiteId: "qif-ledger",
  basePackage: "examples/qif-ledger-package.json",
  validator,
  corpusDir: "tests/fixtures/qif-ledger",
  filePrefix: "qif-ledger"
};
