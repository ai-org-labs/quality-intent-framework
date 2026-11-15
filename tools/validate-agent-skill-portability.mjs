#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const files = process.argv.slice(2).length ? process.argv.slice(2) : ["examples/agent-skill-portability-package.json"];
const errors = [];
const requiredClaims = ["semantic truth", "client independence beyond declared groups", "model competence", "cross-client output equivalence", "skill causality", "behavioral portability from example-only evidence", "approval or execution authority"];
const sameSet = (a, b) => Array.isArray(a) && [...new Set(a)].sort().join("\0") === [...new Set(b)].sort().join("\0");
const array = (p, k) => Array.isArray(p[k]) ? p[k] : (errors.push(`package ${k} must be an array.`), []);
const index = (xs, name) => { const m = new Map(); for (const x of xs) { if (!x?.id) errors.push(`${name} contains an item without an id.`); else if (m.has(x.id)) errors.push(`Duplicate id ${x.id} in ${name}.`); else m.set(x.id, x); } return m; };
const resolve = (m, id, kind, owner) => m.get(id) || (errors.push(`${owner} references missing ${kind}: ${id}`), null);

for (const file of files) {
  let p;
  try { p = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { errors.push(`${file} cannot be read: ${e.message}`); continue; }
  if (p.packageType !== "agent-skill-portability") errors.push(`${file} packageType must be agent-skill-portability.`);
  const skills = array(p, "skillArtifacts"), clients = array(p, "clientProfiles"), cases = array(p, "portabilityCases");
  const criteria = array(p, "behaviorCriteria"), runs = array(p, "portabilityRuns"), pairs = array(p, "matchedRunPairs");
  const assessments = array(p, "portabilityAssessments"), triggers = array(p, "governanceTriggers");
  const S=index(skills,"skillArtifacts"), C=index(clients,"clientProfiles"), K=index(cases,"portabilityCases"), B=index(criteria,"behaviorCriteria"), R=index(runs,"portabilityRuns"), M=index(pairs,"matchedRunPairs"), G=index(triggers,"governanceTriggers");
  if (clients.length < 2 || new Set(clients.map(x=>x.independenceGroup)).size < 2) errors.push("clientProfiles must declare at least two distinct independenceGroup values.");
  for (const s of skills) {
    if (path.isAbsolute(s.sourcePath||"") || String(s.sourcePath||"").split(/[\\/]/).includes("..")) errors.push(`${s.id} sourcePath must be repository-relative without parent traversal.`);
    else if (!fs.existsSync(path.resolve(s.sourcePath||""))) errors.push(`${s.id} sourcePath does not exist: ${s.sourcePath}`);
    if (s.version !== p.runtimeVersion) errors.push(`${s.id} version must equal runtimeVersion ${p.runtimeVersion}.`);
  }
  for (const c of cases) if (!sameSet(c.expectedCriterionRefs, [...B.keys()])) errors.push(`${c.id} expectedCriterionRefs must cover every behavior criterion exactly once.`);
  for (const r of runs) {
    const c=resolve(C,r.clientRef,"client",r.id), k=resolve(K,r.caseRef,"case",r.id); void c;
    if (r.condition === "baseline" && r.skillArtifactRef !== null) errors.push(`${r.id} baseline skillArtifactRef must be null.`);
    if (r.condition === "skill-enabled" && !resolve(S,r.skillArtifactRef,"skill artifact",r.id)) void 0;
    if (k && r.inputDigest !== k.inputDigest) errors.push(`${r.id} inputDigest must match its case inputDigest.`);
    if (k && !sameSet(r.criterionResults?.map(x=>x.criterionRef), k.expectedCriterionRefs)) errors.push(`${r.id} criterionResults must cover expected criteria exactly once.`);
    if (Date.parse(r.completedAt) < Date.parse(r.startedAt)) errors.push(`${r.id} completedAt must not precede startedAt.`);
    if (r.evidenceStatus !== "verified" && r.status !== "governance-required") errors.push(`${r.id} non-verified evidence requires governance-required status.`);
    if (r.activityCountIsQuality !== false || r.semanticTruthClaimed !== false) errors.push(`${r.id} must preserve activity-count and semantic-truth boundaries.`);
  }
  const pairComputed = new Map();
  for (const m of pairs) {
    const base=resolve(R,m.baselineRunRef,"baseline run",m.id), skill=resolve(R,m.skillRunRef,"skill run",m.id); resolve(C,m.clientRef,"client",m.id); resolve(K,m.caseRef,"case",m.id);
    if (!base||!skill) continue;
    if (base.condition!=="baseline" || skill.condition!=="skill-enabled") errors.push(`${m.id} must pair baseline and skill-enabled conditions.`);
    if ([base.clientRef,skill.clientRef].some(x=>x!==m.clientRef) || [base.caseRef,skill.caseRef].some(x=>x!==m.caseRef)) errors.push(`${m.id} runs must match pair clientRef and caseRef.`);
    const flags={sameInput:base.inputDigest===skill.inputDigest,sameModelConfig:base.modelConfigDigest===skill.modelConfigDigest,sameToolConfig:base.toolConfigDigest===skill.toolConfigDigest};
    for (const [k,v] of Object.entries(flags)) if(m[k]!==v) errors.push(`${m.id} ${k} must reproduce as ${v}.`);
    const bm=new Map(base.criterionResults.map(x=>[x.criterionRef,x.score])), sm=new Map(skill.criterionResults.map(x=>[x.criterionRef,x.score]));
    const deltas=[...B.keys()].map(id=>[id,(sm.get(id)??0)-(bm.get(id)??0)]), total=deltas.reduce((n,[,d])=>n+d,0), improves=deltas.filter(([,d])=>d>0).map(([id])=>id), regress=deltas.filter(([,d])=>d<0).map(([id])=>id);
    if(m.criterionDeltaTotal!==total) errors.push(`${m.id} criterionDeltaTotal must reproduce as ${total}.`);
    if(!sameSet(m.improvementCriterionRefs,improves)) errors.push(`${m.id} improvementCriterionRefs must reproduce score improvements.`);
    if(!sameSet(m.regressionCriterionRefs,regress)) errors.push(`${m.id} regressionCriterionRefs must reproduce score regressions.`);
    const ev=base.evidenceStatus==="verified"&&skill.evidenceStatus==="verified"?"verified":(base.evidenceStatus==="example-only"||skill.evidenceStatus==="example-only"?"example-only":"unverified");
    if(m.evidenceStatus!==ev) errors.push(`${m.id} evidenceStatus must reproduce as ${ev}.`);
    if(ev!=="verified" && m.status!=="governance-required") errors.push(`${m.id} non-verified evidence requires governance-required status.`);
    pairComputed.set(m.id,{m,skill,total,regress,ev,flags});
  }
  for (const a of assessments) {
    resolve(S,a.skillArtifactRef,"skill artifact",a.id); const ps=(a.pairRefs||[]).map(id=>pairComputed.get(id) || (errors.push(`${a.id} references missing matched pair: ${id}`),null)).filter(Boolean);
    const clientIds=[...new Set(ps.map(x=>x.m.clientRef))], caseIds=[...new Set(ps.map(x=>x.m.caseRef))];
    if(!sameSet(a.clientRefs,clientIds)||!sameSet(a.caseRefs,caseIds)) errors.push(`${a.id} clientRefs and caseRefs must reproduce its matched pairs.`);
    if(a.clientCount!==clientIds.length||a.pairCount!==ps.length) errors.push(`${a.id} clientCount and pairCount must reproduce referenced pairs.`);
    const coverage=ps.every(x=>sameSet(x.skill.criterionResults.map(y=>y.criterionRef),K.get(x.m.caseRef)?.expectedCriterionRefs||[]));
    const matched=ps.every(x=>Object.values(x.flags).every(Boolean));
    if(a.criteriaCoverageComplete!==coverage||a.matchedConfigurationComplete!==matched) errors.push(`${a.id} coverage and matched-configuration flags must reproduce.`);
    const total=ps.reduce((n,x)=>n+x.total,0), regress=ps.reduce((n,x)=>n+x.regress.length,0);
    if(a.aggregateCriterionDelta!==total||a.regressionCount!==regress) errors.push(`${a.id} aggregate delta and regression count must reproduce.`);
    const failures=[...new Set(ps.flatMap(x=>x.skill.criterionResults.filter(y=>B.get(y.criterionRef)?.blocking&&y.score<B.get(y.criterionRef).minimumSkillScore).map(y=>y.criterionRef)))];
    if(!sameSet(a.blockingFailureRefs,failures)) errors.push(`${a.id} blockingFailureRefs must reproduce criterion thresholds.`);
    const ev=ps.every(x=>x.ev==="verified")?"verified":(ps.some(x=>x.ev==="example-only")?"example-only":"unverified");
    if(a.evidenceStatus!==ev) errors.push(`${a.id} evidenceStatus must reproduce as ${ev}.`);
    const independent=new Set((a.clientRefs||[]).map(id=>C.get(id)?.independenceGroup)).size>=2;
    const outcome=ev!=="verified"||!independent||!coverage||!matched?"governance-required":(failures.length||regress?"not-portable":"portable-candidate");
    if(a.outcome!==outcome) errors.push(`${a.id} outcome must reproduce as ${outcome}.`);
    if(outcome==="governance-required" && !(a.governanceTriggerRefs||[]).some(id=>G.get(id)?.triggerType==="portability-evidence-unverified")) errors.push(`${a.id} governance-required outcome requires portability-evidence-unverified trigger.`);
    if([a.activityCountIsQuality,a.agreementIsTruth,a.automaticAuthority,a.semanticTruthClaimed].some(x=>x!==false)) errors.push(`${a.id} must preserve quality, truth, and authority boundaries.`);
  }
  for (const claim of requiredClaims) if (!p.verifierBoundary?.doesNotClaim?.includes(claim)) errors.push(`verifierBoundary must explicitly not claim ${claim}.`);
  if (errors.length===0) console.log(JSON.stringify({ok:true,package:file,counts:{clients:clients.length,cases:cases.length,runs:runs.length,pairs:pairs.length,assessments:assessments.length}},null,2));
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
