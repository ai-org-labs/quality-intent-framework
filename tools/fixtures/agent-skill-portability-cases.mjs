const run = (p, i=0) => p.portabilityRuns[i];
const pair = (p, i=0) => p.matchedRunPairs[i];
const assessment = p => p.portabilityAssessments[0];

export const cases = [
  { id:"clients-array", rule:"client profiles required", expect:"package clientProfiles must be an array.", mutate:p=>{p.clientProfiles=null;} },
  { id:"independence-groups", rule:"declared client independence", expect:"at least two distinct independenceGroup", mutate:p=>{p.clientProfiles[1].independenceGroup=p.clientProfiles[0].independenceGroup;} },
  { id:"skill-path", rule:"portable source path", expect:"sourcePath must be repository-relative", mutate:p=>{p.skillArtifacts[0].sourcePath="../secret";} },
  { id:"case-coverage", rule:"case criterion closure", expect:"expectedCriterionRefs must cover", mutate:p=>{p.portabilityCases[0].expectedCriterionRefs.pop();} },
  { id:"baseline-skill", rule:"baseline isolation", expect:"baseline skillArtifactRef must be null", mutate:p=>{run(p).skillArtifactRef="SKA-001";} },
  { id:"run-input", rule:"matched case input", expect:"inputDigest must match", mutate:p=>{run(p).inputDigest="sha256:bad";} },
  { id:"run-coverage", rule:"run criterion closure", expect:"criterionResults must cover", mutate:p=>{run(p).criterionResults.pop();} },
  { id:"run-time", rule:"run chronology", expect:"completedAt must not precede", mutate:p=>{run(p).completedAt="2020-01-01T00:00:00Z";} },
  { id:"run-boundary", rule:"semantic boundary", expect:"must preserve activity-count", mutate:p=>{run(p).semanticTruthClaimed=true;} },
  { id:"pair-conditions", rule:"matched condition roles", expect:"must pair baseline and skill-enabled", mutate:p=>{run(p).condition="skill-enabled";} },
  { id:"pair-config", rule:"configuration reproduction", expect:"sameModelConfig must reproduce as true", mutate:p=>{pair(p).sameModelConfig=false;} },
  { id:"pair-delta", rule:"delta reproduction", expect:"criterionDeltaTotal must reproduce", mutate:p=>{pair(p).criterionDeltaTotal=99;} },
  { id:"pair-improvements", rule:"improvement reproduction", expect:"improvementCriterionRefs must reproduce", mutate:p=>{pair(p).improvementCriterionRefs=[];} },
  { id:"pair-evidence", rule:"evidence reproduction", expect:"evidenceStatus must reproduce as example-only", mutate:p=>{pair(p).evidenceStatus="verified";} },
  { id:"assessment-counts", rule:"assessment count reproduction", expect:"clientCount and pairCount must reproduce", mutate:p=>{assessment(p).clientCount=3;} },
  { id:"assessment-total", rule:"assessment arithmetic", expect:"aggregate delta and regression count must reproduce", mutate:p=>{assessment(p).aggregateCriterionDelta=0;} },
  { id:"assessment-outcome", rule:"provisional evidence governance", expect:"outcome must reproduce as governance-required", mutate:p=>{assessment(p).outcome="portable-candidate";} },
  { id:"assessment-trigger", rule:"portability governance trigger", expect:"requires portability-evidence-unverified trigger", mutate:p=>{assessment(p).governanceTriggerRefs=[];} },
  { id:"assessment-authority", rule:"authority boundary", expect:"must preserve quality, truth, and authority boundaries", mutate:p=>{assessment(p).automaticAuthority=true;} },
  { id:"verifier-boundary", rule:"verifier claim boundary", expect:"must explicitly not claim skill causality", mutate:p=>{p.verifierBoundary.doesNotClaim=p.verifierBoundary.doesNotClaim.filter(x=>x!=="skill causality");} }
];

export const spec = {
  suiteId:"agent-skill-portability",
  filePrefix:"agent-skill-portability",
  validator:"tools/validate-agent-skill-portability.mjs",
  basePackage:"examples/agent-skill-portability-package.json",
  corpusDir:"tests/fixtures/agent-skill-portability"
};
