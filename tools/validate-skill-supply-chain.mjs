#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";

const files = process.argv.slice(2).length ? process.argv.slice(2) : ["examples/skill-supply-chain-package.json"];
const errors = [];
const requiredClaims = ["semantic truth","source authenticity","component lineage beyond declared evidence","behavioral equivalence","dependency safety","Skill trustworthiness","permission or execution authority","automatic trust elevation"];
const sameSet = (a,b) => Array.isArray(a) && [...new Set(a)].sort().join("\0") === [...new Set(b)].sort().join("\0");
const arr = (p,k) => Array.isArray(p[k]) ? p[k] : (errors.push(`package ${k} must be an array.`), []);
const idx = (xs,n) => { const m=new Map(); for (const x of xs) { if (!x?.id) errors.push(`${n} contains an item without an id.`); else if (m.has(x.id)) errors.push(`Duplicate id ${x.id} in ${n}.`); else m.set(x.id,x); } return m; };
const ref = (m,id,kind,owner) => m.get(id) || (errors.push(`${owner} references missing ${kind}: ${id}`), null);
const sorted = xs => [...new Set(xs)].sort();

function hasCycle(nodes, edges) {
  const next=new Map(nodes.map(n=>[n.id,[]]));
  for (const e of edges) if (next.has(e.fromNodeRef) && next.has(e.toNodeRef)) next.get(e.fromNodeRef).push(e.toNodeRef);
  const visiting=new Set(), done=new Set();
  const visit=id=>{ if(visiting.has(id)) return true; if(done.has(id)) return false; visiting.add(id); for(const n of next.get(id)||[]) if(visit(n)) return true; visiting.delete(id); done.add(id); return false; };
  return nodes.some(n=>visit(n.id));
}

function propagatedRisk(nodes, edges, direct) {
  const reverse=new Map(nodes.map(n=>[n.id,[]]));
  for(const e of edges) if(e.riskPropagation==="upstream" && reverse.has(e.toNodeRef)) reverse.get(e.toNodeRef).push(e.fromNodeRef);
  const seen=new Set(direct), queue=[...direct];
  while(queue.length) for(const up of reverse.get(queue.shift())||[]) if(!seen.has(up)){seen.add(up);queue.push(up);}
  return sorted([...seen].filter(x=>!direct.includes(x)));
}

for (const file of files) {
  let p; try { p=JSON.parse(fs.readFileSync(file,"utf8")); } catch(e){ errors.push(`${file} cannot be read: ${e.message}`); continue; }
  if(p.packageType!=="skill-supply-chain") errors.push(`${file} packageType must be skill-supply-chain.`);
  const skills=arr(p,"skillArtifacts"), comps=arr(p,"skillComponents"), nodes=arr(p,"dependencyNodes"), edges=arr(p,"dependencyEdges"), manifests=arr(p,"dependencyManifests"), locks=arr(p,"lockRecords"), risks=arr(p,"riskSignals"), assessments=arr(p,"supplyChainAssessments"), triggers=arr(p,"governanceTriggers");
  const S=idx(skills,"skillArtifacts"), C=idx(comps,"skillComponents"), N=idx(nodes,"dependencyNodes"), E=idx(edges,"dependencyEdges"), M=idx(manifests,"dependencyManifests"), L=idx(locks,"lockRecords"), R=idx(risks,"riskSignals"), G=idx(triggers,"governanceTriggers"); void L; void R;
  for(const s of skills){ ref(N,s.rootNodeRef,"root dependency node",s.id); for(const id of s.componentRefs||[]) ref(C,id,"component",s.id); if(!sameSet(s.componentRefs,comps.filter(c=>c.skillRef===s.id).map(c=>c.id))) errors.push(`${s.id} componentRefs must exactly cover its skillComponents.`); if(s.version!==p.runtimeVersion) errors.push(`${s.id} version must equal runtimeVersion ${p.runtimeVersion}.`); }
  for(const c of comps){ ref(S,c.skillRef,"skill",c.id); if(c.required && c.status==="missing") errors.push(`${c.id} required component must not be missing.`); }
  for(const e of edges){ ref(N,e.fromNodeRef,"dependency node",e.id); ref(N,e.toNodeRef,"dependency node",e.id); if(e.fromNodeRef===e.toNodeRef) errors.push(`${e.id} must not be a self dependency.`); }
  for(const m of manifests){ const s=ref(S,m.skillRef,"skill",m.id); for(const id of m.nodeRefs||[]) ref(N,id,"dependency node",m.id); for(const id of m.edgeRefs||[]) ref(E,id,"dependency edge",m.id); if(!sameSet(m.nodeRefs,[...N.keys()])) errors.push(`${m.id} nodeRefs must exactly cover dependencyNodes.`); if(!sameSet(m.edgeRefs,[...E.keys()])) errors.push(`${m.id} edgeRefs must exactly cover dependencyEdges.`); if(s && !m.nodeRefs.includes(s.rootNodeRef)) errors.push(`${m.id} must include the skill root node.`); const unresolved=nodes.filter(n=>n.required&&n.status==="unresolved").map(n=>n.id); if(!sameSet(m.unresolvedDependencyRefs,unresolved)) errors.push(`${m.id} unresolvedDependencyRefs must reproduce required unresolved nodes.`); if(m.complete !== (unresolved.length===0)) errors.push(`${m.id} complete must reproduce unresolved dependency closure.`); }
  for(const l of locks){ ref(M,l.manifestRef,"manifest",l.id); const n=ref(N,l.nodeRef,"dependency node",l.id); if(n && (l.lockedVersion!==n.version || l.lockedDigest!==n.digest)) errors.push(`${l.id} locked version and digest must match its dependency node.`); }
  for(const r of risks) ref(N,r.nodeRef,"dependency node",r.id);
  const cycle=hasCycle(nodes,edges);
  for(const a of assessments){ const m=ref(M,a.manifestRef,"manifest",a.id); if(!m) continue; const requiredResolved=nodes.filter(n=>n.required&&n.status==="resolved"); const validLocks=requiredResolved.filter(n=>locks.some(l=>l.manifestRef===m.id&&l.nodeRef===n.id&&l.status==="active"&&l.verified&&!l.stale&&l.lockedVersion===n.version&&l.lockedDigest===n.digest)); const unresolved=nodes.filter(n=>n.required&&n.status==="unresolved"); const stale=locks.filter(l=>l.manifestRef===m.id&&l.stale); const direct=sorted(risks.filter(r=>r.status!=="closed").map(r=>r.nodeRef)); const propagated=propagatedRisk(nodes,edges,direct); if(a.nodeCount!==nodes.length||a.edgeCount!==edges.length) errors.push(`${a.id} nodeCount and edgeCount must reproduce the manifest graph.`); if(a.lockedRequiredNodeCount!==validLocks.length) errors.push(`${a.id} lockedRequiredNodeCount must reproduce verified active locks.`); if(a.unresolvedRequiredNodeCount!==unresolved.length) errors.push(`${a.id} unresolvedRequiredNodeCount must reproduce required unresolved nodes.`); if(a.staleLockCount!==stale.length) errors.push(`${a.id} staleLockCount must reproduce stale locks.`); if(!sameSet(a.directRiskNodeRefs,direct)) errors.push(`${a.id} directRiskNodeRefs must reproduce open risk signals.`); if(!sameSet(a.propagatedRiskNodeRefs,propagated)) errors.push(`${a.id} propagatedRiskNodeRefs must reproduce upstream risk propagation.`); if(a.cycleDetected!==cycle) errors.push(`${a.id} cycleDetected must reproduce graph cycle detection.`); const provisional=risks.some(r=>r.status!=="closed"&&r.evidenceStatus!=="verified"); const governed=cycle||unresolved.length>0||stale.length>0||direct.length>0||provisional||!m.complete; const expected=governed?"governance-required":"ready-for-review"; if(a.readiness!==expected||a.status!==(governed?"governance-required":"reviewed")) errors.push(`${a.id} readiness and status must reproduce dependency risk state.`); for(const id of a.governanceTriggerRefs||[]) ref(G,id,"governance trigger",a.id); const needed=[]; if(unresolved.length)needed.push("unresolved-dependency"); if(cycle)needed.push("dependency-cycle"); if(stale.length)needed.push("stale-lock"); if(direct.length)needed.push("dependency-risk"); if(a.concentrationRisk)needed.push("concentration-risk"); if(provisional)needed.push("evidence-unverified"); const cited=(a.governanceTriggerRefs||[]).map(id=>G.get(id)?.triggerType).filter(Boolean); for(const t of needed) if(!cited.includes(t)) errors.push(`${a.id} requires ${t} governance trigger.`); if([a.identityIsSafety,a.behavioralEquivalenceClaimed,a.sourceAuthenticityClaimed,a.automaticTrustElevation,a.automaticPermission,a.automaticAuthority].some(Boolean)) errors.push(`${a.id} must preserve identity, safety, authenticity, trust, permission, and authority boundaries.`); }
  for(const claim of requiredClaims) if(!p.verifierBoundary?.doesNotClaim?.includes(claim)) errors.push(`verifierBoundary must explicitly not claim ${claim}.`);
  if(!errors.length) console.log(JSON.stringify({ok:true,package:file,counts:{skills:skills.length,components:comps.length,nodes:nodes.length,edges:edges.length,manifests:manifests.length,locks:locks.length,risks:risks.length,assessments:assessments.length}},null,2));
}
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
