// Retained negative coverage for the world-model-review verifier.
//
// These cases protect the QIF World Model Review boundary: findings must name
// the exact missing conceptual part, why it matters, which decisions are
// affected, what evidence supports the claim, and what resolution work is
// required before AI or humans rely on a quality verdict.

const validator = "tools/validate-world-model-review.mjs";

function concept(pkg) {
  return pkg.conceptDefinitions[0];
}

function domainEntity(pkg) {
  return pkg.domainEntities[0];
}

function actor(pkg) {
  return pkg.actors[0];
}

function relationship(pkg) {
  return pkg.relationships[0];
}

function state(pkg) {
  return pkg.states[0];
}

function coordinateSystem(pkg) {
  return pkg.coordinateSystems[0];
}

function axis(pkg) {
  return pkg.coordinateAxes[0];
}

function assumption(pkg) {
  return pkg.assumptions[0];
}

function evidence(pkg) {
  return pkg.modelEvidence[0];
}

function finding(pkg) {
  return pkg.worldModelGapFindings[0];
}

function action(pkg) {
  return pkg.resolutionActions[0];
}

function trigger(pkg) {
  return pkg.governanceTriggers[0];
}

export const cases = [
  {
    id: "worldModels-not-array",
    rule: "worldModels must be an array",
    expect: "worldModels must be an array.",
    mutate: (pkg) => { pkg.worldModels = null; }
  },
  {
    id: "concept-missing-world-model",
    rule: "concept world model ref resolves",
    expect: "CON-WM-001 references missing world model: WMD-NOPE-999",
    mutate: (pkg) => { concept(pkg).worldModelRef = "WMD-NOPE-999"; }
  },
  {
    id: "domain-entity-missing-concept",
    rule: "domain entity concept ref resolves",
    expect: "DEN-WM-001 references missing concept: CON-NOPE-999",
    mutate: (pkg) => { domainEntity(pkg).conceptRef = "CON-NOPE-999"; }
  },
  {
    id: "actor-missing-responsibility-boundary",
    rule: "actor responsibility boundary resolves",
    expect: "ACT-WM-001 references missing responsibility boundary: BDY-NOPE-999",
    mutate: (pkg) => { actor(pkg).responsibilityBoundaryRef = "BDY-NOPE-999"; }
  },
  {
    id: "relationship-broken-from-ref",
    rule: "relationship from ref resolves",
    expect: "REL-WM-001/from references missing actors: ACT-NOPE-999",
    mutate: (pkg) => { relationship(pkg).from.entityRef = "ACT-NOPE-999"; }
  },
  {
    id: "relationship-self-ref",
    rule: "relationship must not self-reference",
    expect: "REL-WM-001 must not relate an entity to itself.",
    mutate: (pkg) => { relationship(pkg).to = structuredClone(relationship(pkg).from); }
  },
  {
    id: "state-definedFor-broken",
    rule: "state definedFor ref resolves",
    expect: "STA-WM-001/definedFor references missing domainEntities: DEN-NOPE-999",
    mutate: (pkg) => { state(pkg).definedFor.entityRef = "DEN-NOPE-999"; }
  },
  {
    id: "coordinate-system-missing-axis",
    rule: "coordinate system axis refs resolve",
    expect: "COS-WM-001 references missing coordinate axis: CAX-NOPE-999",
    mutate: (pkg) => { coordinateSystem(pkg).axisRefs[0] = "CAX-NOPE-999"; }
  },
  {
    id: "coordinate-axis-missing-scale-definition",
    rule: "coordinate axis explains scale",
    expect: "CAX-WM-001 must include non-empty string scaleDefinition.",
    mutate: (pkg) => { axis(pkg).scaleDefinition = ""; }
  },
  {
    id: "assumption-broken-evidence",
    rule: "assumption source evidence resolves",
    expect: "ASM-WM-001 references missing source evidence: EVD-NOPE-999",
    mutate: (pkg) => { assumption(pkg).sourceEvidenceRefs[0] = "EVD-NOPE-999"; }
  },
  {
    id: "model-evidence-verified-without-source",
    rule: "verified trust requires sources",
    expect: "EVD-WM-001/trust verified status requires at least one source.",
    mutate: (pkg) => { evidence(pkg).trust.sources = []; }
  },
  {
    id: "finding-missing-item-empty",
    rule: "finding must name exact missing item",
    expect: "WMG-WM-001 must include non-empty string missingItem.",
    mutate: (pkg) => { finding(pkg).missingItem = ""; }
  },
  {
    id: "finding-missing-expected-definition",
    rule: "finding must describe expected definition",
    expect: "WMG-WM-001 must include non-empty string expectedDefinition.",
    mutate: (pkg) => { finding(pkg).expectedDefinition = ""; }
  },
  {
    id: "finding-without-affected-decision",
    rule: "finding must name affected decisions",
    expect: "WMG-WM-001 must include affectedDecisionRefs.",
    mutate: (pkg) => { finding(pkg).affectedDecisionRefs = []; }
  },
  {
    id: "finding-without-evidence",
    rule: "finding evidence refs are required",
    expect: "WMG-WM-001 must include at least one evidence.",
    mutate: (pkg) => { finding(pkg).evidenceRefs = []; }
  },
  {
    id: "finding-block-without-governance",
    rule: "blocking findings require governance",
    expect: "WMG-WM-001 verdictEffect block-evaluation requires governanceTriggerRefs.",
    mutate: (pkg) => { finding(pkg).governanceTriggerRefs = []; }
  },
  {
    id: "resolution-action-broken-finding",
    rule: "resolution action finding ref resolves",
    expect: "RSA-WM-001 references missing finding: WMG-NOPE-999",
    mutate: (pkg) => { action(pkg).findingRef = "WMG-NOPE-999"; }
  },
  {
    id: "governance-trigger-broken-source",
    rule: "governance trigger source finding resolves",
    expect: "GTR-WM-001 references missing source finding: WMG-NOPE-999",
    mutate: (pkg) => { trigger(pkg).sourceFindingRef = "WMG-NOPE-999"; }
  },
  {
    id: "finding-confirmed-without-impact",
    rule: "confirmed finding evidence requires impact confirmation",
    expect: "WMG-WM-001/findingEvidence cannot be confirmed until reproducible, falsePositiveChecked, and impactConfirmed are true.",
    mutate: (pkg) => { finding(pkg).findingEvidence.impactConfirmed = false; }
  },
  {
    id: "verifier-boundary-claims-semantic-truth",
    rule: "world model verifier boundary avoids semantic truth",
    expect: "verifierBoundary must explicitly avoid claiming semantic truth.",
    mutate: (pkg) => { pkg.verifierBoundary.doesNotClaim = ["business correctness"]; }
  }
];

export const spec = {
  suiteId: "world-model-review",
  basePackage: "examples/world-model-review-package.json",
  validator,
  corpusDir: "tests/fixtures/world-model-review",
  filePrefix: "world-model-review"
};
