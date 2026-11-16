const run = (p, i=0) => p.portabilityRuns[i];
const pair = (p, i=0) => p.matchedRunPairs[i];
const assessment = p => p.portabilityAssessments[0];
const source = (p, i=0) => p.evidenceSources[i];
const attestation = (p, i=0) => p.executionAttestations[i];
const custody = (p, i=0) => p.evidenceCustodyEvents[i];
const imported = (p, i=0) => p.evidenceImportDecisions[i];
const corpus = p => p.corpusReadinessAssessments[0];

export const cases = [
  { id:"sources-array", rule:"evidence sources required", expect:"package evidenceSources must be an array.", mutate:p=>{p.evidenceSources=null;} },
  { id:"attestations-array", rule:"execution attestations required", expect:"package executionAttestations must be an array.", mutate:p=>{p.executionAttestations=null;} },
  { id:"custody-array", rule:"custody events required", expect:"package evidenceCustodyEvents must be an array.", mutate:p=>{p.evidenceCustodyEvents=null;} },
  { id:"imports-array", rule:"import decisions required", expect:"package evidenceImportDecisions must be an array.", mutate:p=>{p.evidenceImportDecisions=null;} },
  { id:"corpus-array", rule:"corpus assessments required", expect:"package corpusReadinessAssessments must be an array.", mutate:p=>{p.corpusReadinessAssessments=null;} },
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
  { id:"attestation-digest", rule:"attestation digest alignment", expect:"attested digests must align", mutate:p=>{attestation(p).transcriptDigest="sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";} },
  { id:"attestation-acceptance", rule:"attestation acceptance boundary", expect:"accepted status requires reviewed attestation", mutate:p=>{attestation(p).status="accepted";} },
  { id:"custody-prior", rule:"custody predecessor resolution", expect:"references missing prior custody event", mutate:p=>{custody(p).priorEventRef="ECE-NOPE";} },
  { id:"import-chain", rule:"evidence chain closure", expect:"must form one evidence chain", mutate:p=>{imported(p).sourceRef="EVS-002";} },
  { id:"import-digest", rule:"import digest reproduction", expect:"digestAlignment must reproduce as true", mutate:p=>{imported(p).digestAlignment=false;} },
  { id:"import-custody", rule:"custody completeness reproduction", expect:"custodyComplete must reproduce as true", mutate:p=>{imported(p).custodyComplete=false;} },
  { id:"import-review", rule:"attestation review reproduction", expect:"attestationReviewed must reproduce as false", mutate:p=>{imported(p).attestationReviewed=true;} },
  { id:"import-decision", rule:"import decision reproduction", expect:"decision must reproduce as provisional", mutate:p=>{imported(p).decision="accepted";} },
  { id:"import-status", rule:"unresolved import governance", expect:"unresolved import requires governance-required status", mutate:p=>{imported(p).status="reviewed";} },
  { id:"corpus-groups", rule:"corpus group reproduction", expect:"observedIndependentGroups must reproduce as 2", mutate:p=>{corpus(p).observedIndependentGroups=1;} },
  { id:"corpus-verified-count", rule:"verified pair reproduction", expect:"verifiedPairCount must reproduce as 0", mutate:p=>{corpus(p).verifiedPairCount=2;} },
  { id:"corpus-readiness", rule:"corpus readiness reproduction", expect:"readiness must reproduce as governance-required", mutate:p=>{corpus(p).readiness="ready-for-external-review";} },
  { id:"corpus-trigger", rule:"non-ready corpus governance", expect:"requires corpus-evidence-not-ready trigger", mutate:p=>{corpus(p).governanceTriggerRefs=[];} },
  { id:"corpus-boundary", rule:"authenticity authority boundary", expect:"must preserve authenticity and authority boundaries", mutate:p=>{corpus(p).sourceAuthenticityClaimed=true;} },
  { id:"verifier-boundary", rule:"verifier claim boundary", expect:"must explicitly not claim skill causality", mutate:p=>{p.verifierBoundary.doesNotClaim=p.verifierBoundary.doesNotClaim.filter(x=>x!=="skill causality");} }
];

export const spec = {
  suiteId:"agent-skill-portability",
  filePrefix:"agent-skill-portability",
  validator:"tools/validate-agent-skill-portability.mjs",
  basePackage:"examples/agent-skill-portability-package.json",
  corpusDir:"tests/fixtures/agent-skill-portability"
};
