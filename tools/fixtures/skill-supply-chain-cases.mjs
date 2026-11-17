const skill=p=>p.skillArtifacts[0], component=p=>p.skillComponents[0], edge=p=>p.dependencyEdges[0], manifest=p=>p.dependencyManifests[0], lock=p=>p.lockRecords[0], risk=p=>p.riskSignals[0], assessment=p=>p.supplyChainAssessments[0];
export const cases=[
  {id:"nodes-array",rule:"dependency nodes required",expect:"package dependencyNodes must be an array.",mutate:p=>{p.dependencyNodes=null;}},
  {id:"component-coverage",rule:"component identity closure",expect:"componentRefs must exactly cover",mutate:p=>{skill(p).componentRefs.pop();}},
  {id:"runtime-version",rule:"skill version alignment",expect:"version must equal runtimeVersion",mutate:p=>{skill(p).version="0.0.0";}},
  {id:"missing-component",rule:"required component presence",expect:"required component must not be missing",mutate:p=>{component(p).status="missing";}},
  {id:"edge-reference",rule:"edge reference resolution",expect:"references missing dependency node",mutate:p=>{edge(p).toNodeRef="DPN-MISSING";}},
  {id:"self-edge",rule:"self dependency rejection",expect:"must not be a self dependency",mutate:p=>{edge(p).toNodeRef=edge(p).fromNodeRef;}},
  {id:"manifest-nodes",rule:"manifest node closure",expect:"nodeRefs must exactly cover",mutate:p=>{manifest(p).nodeRefs.pop();}},
  {id:"manifest-edges",rule:"manifest edge closure",expect:"edgeRefs must exactly cover",mutate:p=>{manifest(p).edgeRefs.pop();}},
  {id:"unresolved-reproduction",rule:"unresolved dependency reproduction",expect:"unresolvedDependencyRefs must reproduce",mutate:p=>{p.dependencyNodes[1].status="unresolved";}},
  {id:"complete-reproduction",rule:"manifest completeness",expect:"complete must reproduce",mutate:p=>{manifest(p).complete=false;}},
  {id:"lock-node",rule:"lock reference resolution",expect:"references missing dependency node",mutate:p=>{lock(p).nodeRef="DPN-MISSING";}},
  {id:"lock-identity",rule:"lock identity alignment",expect:"locked version and digest must match",mutate:p=>{lock(p).lockedVersion="different";}},
  {id:"risk-node",rule:"risk reference resolution",expect:"references missing dependency node",mutate:p=>{risk(p).nodeRef="DPN-MISSING";}},
  {id:"graph-counts",rule:"graph count reproduction",expect:"nodeCount and edgeCount must reproduce",mutate:p=>{assessment(p).nodeCount=99;}},
  {id:"lock-count",rule:"lock count reproduction",expect:"lockedRequiredNodeCount must reproduce",mutate:p=>{assessment(p).lockedRequiredNodeCount=0;}},
  {id:"direct-risk",rule:"direct risk reproduction",expect:"directRiskNodeRefs must reproduce",mutate:p=>{assessment(p).directRiskNodeRefs=[];}},
  {id:"propagated-risk",rule:"upstream risk reproduction",expect:"propagatedRiskNodeRefs must reproduce",mutate:p=>{assessment(p).propagatedRiskNodeRefs=[];}},
  {id:"cycle",rule:"cycle detection",expect:"cycleDetected must reproduce",mutate:p=>{p.dependencyEdges.push({id:"DPE-CYCLE",fromNodeRef:"DPN-SHELL-TOOL",toNodeRef:"DPN-QIF-SKILL",relation:"invokes",evidenceRefs:["example"],required:true,riskPropagation:"upstream"});manifest(p).edgeRefs.push("DPE-CYCLE");assessment(p).edgeCount++;}},
  {id:"readiness",rule:"risk readiness",expect:"readiness and status must reproduce",mutate:p=>{assessment(p).readiness="ready-for-review";}},
  {id:"trigger",rule:"risk governance",expect:"requires dependency-risk governance trigger",mutate:p=>{assessment(p).governanceTriggerRefs=[];}},
  {id:"trust-boundary",rule:"identity trust separation",expect:"must preserve identity, safety, authenticity, trust, permission, and authority boundaries",mutate:p=>{assessment(p).identityIsSafety=true;}},
  {id:"verifier-boundary",rule:"verifier claim boundary",expect:"must explicitly not claim dependency safety",mutate:p=>{p.verifierBoundary.doesNotClaim=p.verifierBoundary.doesNotClaim.filter(x=>x!=="dependency safety");}}
];
export const spec={suiteId:"skill-supply-chain",filePrefix:"skill-supply-chain",validator:"tools/validate-skill-supply-chain.mjs",basePackage:"examples/skill-supply-chain-package.json",corpusDir:"tests/fixtures/skill-supply-chain"};
