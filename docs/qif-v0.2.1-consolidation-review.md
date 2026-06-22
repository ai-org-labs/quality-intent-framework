# QIF v0.2.1 Consolidation Review

## Mission

This review consolidates QIF v0.2.1 after schema and verifier hardening.

It does not redesign QIF. It reviews the accepted v0.2.1 model so QIF can be explained as one coherent runtime:

```text
QIF captures expert judgment from concrete cases,
extracts reusable decision patterns,
derives quality intents,
selects applicable quality knowledge for a real target,
evaluates evidence,
produces an explainable verdict,
and routes uncertainty or conflict to governance.
```

## 1. Consolidated Concept Map

### Knowledge Entities

| Entity | Role in QIF | Current state |
| --- | --- | --- |
| Case | Concrete situation used to elicit judgment. | Present in discovery and expert judgment models. |
| Expert Judgment | Expert decision on a Case. | Present and traceable to Cue, Concern, Loss Boundary. |
| Cue | Observable signal that changed judgment. | Present and must link to Concern. |
| Concern | Harm or failure mode behind a Cue. | Present and must link to Loss Boundary. |
| Loss Boundary | Unacceptable harm boundary. | Present, but shape differs across packages. |
| Decision Pattern | Reusable decision logic derived from judgments. | Present, but schema shape differs by package. |
| Quality Intent Derivation | Record explaining how patterns or boundaries produced a Quality Intent. | Present in discovery runtime; distinct from Quality Intent. |
| Quality Intent | Reusable statement of quality to evaluate. | Present, but shape differs between discovery and review-run packages. |
| Applicability Boundary | Boundary around a Decision Pattern from expert-judgment theory. | Conceptually overlaps with Applicability Rule/Decision. |
| Counterexample | Case that limits or challenges a pattern. | Present upstream in expert-judgment model, absent from v0.2.1 runtime examples. |
| Organizational Quality Culture | Aggregated context from repeated patterns. | Present as `context-only`; not prerequisite to Quality Intent derivation. |

### Runtime Entities

| Entity | Role in QIF | Current state |
| --- | --- | --- |
| Discovery Session | Bounded elicitation session. | Present; owns session-level grouping and unresolved ambiguity. |
| Question Log Entry | Structured question asked in a session. | Present and first-class in v0.2.1. |
| Raw Expert Answer | Captured answer before interpretation. | Present and first-class in v0.2.1. |
| Extraction Step | Transformation record from raw answers to structured knowledge. | Present and central to interpretability. |
| Evaluation Target | Object being evaluated. | Present, but shape differs between standalone target package and review-run package. |
| Applicability Rule | Reusable selection logic. | Present and executable with structured conditions. |
| Applicability Decision | Target-specific selection/exclusion record. | Present and checked by verifier. |
| Review Run | Bounded execution of a QIF review. | Present; replaces older "Evaluation Run" wording in runtime layer. |
| Verdict | Judgment for a Quality Intent in a Review Run. | Present inside Review Run. |
| Confidence Policy | Rule set for reproducing confidence. | Present in review-run package. |

### Evidence Entities

| Entity | Role in QIF | Current state |
| --- | --- | --- |
| Evidence Item | Observable support, contradiction, or uncertainty. | Present in review-run package; source linkage is thinner than baseline QIF. |
| Indicator | Measured signal that may support evidence. | Present; activity-count misuse is blocked. |
| Source Evidence | Target-level source materials. | Present in standalone Evaluation Target package, absent from embedded review-run target. |
| Reproduction Test | Test of whether non-experts or AI can apply a pattern. | Present upstream, not yet integrated into runtime package flow. |
| Review History Inference | Candidate pattern extraction from historical records. | Present upstream, not yet integrated into runtime package flow. |

### Governance Entities

| Entity | Role in QIF | Current state |
| --- | --- | --- |
| Governance Trigger | Reason governance is needed. | Present in review-run runtime. |
| Governance Event | Decision made by governance. | Present in baseline QIF and v0.2.1 review-run package. |
| Waiver Practice | Culture-level norm for exceptions. | Present inside Organizational Quality Culture. |
| Acceptance Gate | Baseline release/evaluation gate. | Present in v0.1 package, not part of v0.2.1 runtime examples. |

### Package-Level Entities

| Entity | Role in QIF | Current state |
| --- | --- | --- |
| Discovery Session Package | Holds elicitation and extraction artifacts. | Present. |
| Organizational Quality Culture Package | Holds aggregated culture context. | Present. |
| Evaluation Target Package | Holds domain-general target examples. | Present. |
| Review Run Package | Holds actual review execution. | Present. |
| Package ID / Runtime Version / Package Type | Envelope fields. | Present in every runtime package. |
| Verifier Boundary | Declares what the verifier does and does not claim. | Present only in review-run package. |

### Verifier-Only Concepts

| Concept | Role | Current state |
| --- | --- | --- |
| Reference resolution | Checks that refs point to known IDs. | Implemented. |
| Extraction coverage | Checks derived entities are justified by Extraction Steps. | Implemented. |
| Applicability consistency | Checks Review Run selections come from Applicability Decisions. | Implemented. |
| Confidence reproducibility | Recalculates confidence from evidence and policy. | Implemented. |
| Activity-count guardrail | Blocks treating activity-count metrics as quality itself. | Implemented. |
| Governance trigger guardrail | Flags low-confidence, conflicting, or context-mismatched review results without governance. | Implemented. |
| Semantic truth | Explicit non-claim. | Correctly outside verifier. |

### Duplicated, Overlapping, Or Ambiguous Concepts

| Concept pair | Issue | Recommendation |
| --- | --- | --- |
| Evaluation Run / Review Run | Baseline QIF uses Evaluation Run; runtime uses Review Run. | Standardize on Review Run for v0.3 runtime and note Evaluation Run as legacy/baseline wording. |
| Applicability Boundary / Applicability Rule / Applicability Decision | Boundary is conceptual, Rule is reusable executable logic, Decision is target-specific application. | Keep all three only if boundary becomes a Decision Pattern property; otherwise fold boundary into Applicability Rule metadata. |
| Quality Intent shape | Discovery package uses `lossBoundaryRefs`; review-run package uses `lossBoundary` string and `sourceDecisionPatternRefs`. | Create one canonical Quality Intent schema and let packages reference it. |
| Decision Pattern shape | Discovery, culture, review-run, and expert-judgment schemas all define different subsets. | Create canonical Decision Pattern core plus package-specific projections. |
| Loss Boundary shape | Discovery has severity; culture has only statement; review-run embeds string in Quality Intent. | Create canonical Loss Boundary core. |
| Evidence Item / Source Evidence / Knowledge Source | Evidence is split between target inputs and review findings. | Keep Source Evidence as target input and Evidence Item as evaluated finding, with optional source refs. |
| Governance Trigger / Governance Event | Boundary is now clear, but docs should emphasize Trigger is not a decision. | Keep both. Trigger asks for governance; Event records governance decision. |
| Organizational Quality Culture / Quality Intent Derivation | v0.2.1 correctly prevents culture from being a prerequisite. | Keep culture optional and context-only. |

## 2. Entity Responsibility Matrix

| Entity | Purpose | Owns | Must not own | Upstream | Downstream |
| --- | --- | --- | --- | --- | --- |
| Case | Ground expert judgment in a concrete situation. | Facts, context, domain, source material. | Abstract quality principles or final reusable rules. | Knowledge sources, operations, history. | Expert Judgment, Reproduction Test. |
| Expert Judgment | Record expert decision on a Case. | Acceptability decision, cue refs, concern ref, boundary ref, confidence. | The reusable pattern itself. | Case, Expert, Raw Expert Answer. | Decision Pattern. |
| Question Log Entry | Preserve elicitation prompt. | Question text, type, order, target case. | Expert answer or extracted interpretation. | Discovery Session. | Raw Expert Answer. |
| Raw Expert Answer | Preserve captured answer before interpretation. | Answer text, capture mode, ambiguity, sensitive data handling. | Cue, concern, or pattern decisions. | Question Log Entry, Case, Expert. | Extraction Step. |
| Extraction Step | Explain transformation from raw answer to structured knowledge. | Method, rationale, extractor, outputs, ambiguity, confidence. | Semantic validation of extracted truth. | Raw Expert Answer. | Cue, Concern, Loss Boundary, Decision Pattern, Quality Intent Derivation. |
| Cue | Capture observed signal that changed judgment. | Cue statement and concern link. | Harm definition or policy rule. | Extraction Step, Expert Judgment. | Concern, Decision Pattern. |
| Concern | Capture failure or harm being avoided. | Concern statement and loss boundary link. | Decision or evidence requirements. | Cue, Extraction Step. | Loss Boundary, Decision Pattern, Quality Intent Derivation. |
| Loss Boundary | Define unacceptable line. | Boundary statement, severity, optional owner/status in future. | Evidence collection or verdict calculation. | Concern, Extraction Step, policy/history. | Decision Pattern, Quality Intent, Governance. |
| Decision Pattern | Make expert judgment reusable. | Trigger logic, context, concern, boundary, typical decision, evidence expectations. | Final organizational approval. | Expert Judgment, Cue, Concern, Loss Boundary. | Quality Intent Derivation, Applicability Rule, Culture. |
| Quality Intent Derivation | Explain why a Quality Intent exists. | Source patterns, concerns, boundaries, rationale, reviewers, confidence, status. | The Quality Intent's canonical content. | Decision Pattern, Concern, Loss Boundary. | Quality Intent. |
| Quality Intent | State quality objective to evaluate. | Statement, boundary references, status, derivation lineage. | Evidence findings or target-specific selection. | Derivation, policy, culture as optional context. | Applicability Rule, Applicability Decision, Verdict. |
| Organizational Quality Culture | Summarize repeated organizational tendencies. | Non-negotiable boundaries, preferred evidence, risk appetite, escalation and waiver norms. | Mandatory derivation authority for every Quality Intent. | Multiple Decision Patterns, governance history. | Applicability interpretation, governance context. |
| Evaluation Target | Identify object under review. | Domain, target type, artifact type, context, stakeholders, impact, source evidence. | Selected intents or verdicts. | Work item/process/event/service object. | Applicability Decision, Review Run. |
| Applicability Rule | Define reusable selection logic. | Match conditions, selected intents/patterns, exclusion conditions. | Target-specific rationale. | Quality Intent, Decision Pattern. | Applicability Decision. |
| Applicability Decision | Apply rules to one target. | Matched conditions, selected/excluded intents/patterns, rationale, confidence. | Reusable rule definition. | Evaluation Target, Applicability Rule. | Review Run. |
| Evidence Item | Record review finding. | Finding, polarity, confidence, weight, target ref. | Final verdict or source truth. | Evaluation Target, source evidence, review activity. | Verdict, confidence calculation. |
| Indicator | Record measured signal. | Metric kind and interpretation guardrail. | Quality itself. | Measurement system, review context. | Evidence Item, verifier warning/error. |
| Confidence Policy | Define reproducible confidence math. | Evidence, verdict, and review-run aggregation rules. | Semantic correctness of confidence inputs. | Review methodology. | Verdict, Review Run confidence. |
| Verdict | Judge one intent for one run. | Decision, confidence, evidence refs, residual risk. | Governance decision or business approval. | Quality Intent, Evidence Item, Confidence Policy. | Review Run summary, Governance Trigger. |
| Review Run | Execute bounded review. | Target, selected knowledge, collected evidence, verdicts, residual risks, recommendations, triggers. | Discovery history or reusable rule definition. | Evaluation Target, Applicability Decision, Evidence Item. | Governance Trigger, reporting. |
| Governance Trigger | State why governance is needed. | Trigger type, reason, severity, owner, required action, status, optional event ref. | Governance decision itself. | Review Run, Verdict, Applicability Decision. | Governance Event. |
| Governance Event | Record governance decision. | Decision, decision maker, rationale, status. | Trigger condition or evidence calculation. | Governance Trigger. | Updated rules/intents/patterns in future cycles. |
| Verifier Boundary | Declare verifier authority. | Checks, non-claims, semantic review requirements. | Runtime facts or review outcomes. | Verifier implementation. | User/operator trust boundary. |

## 3. Runtime Flow Review

### Reviewed Flow

```text
Discovery Session
  -> Raw Expert Answer
  -> Extraction Step
  -> Cue
  -> Concern
  -> Loss Boundary
  -> Decision Pattern
  -> Quality Intent Derivation
  -> Quality Intent
  -> Evaluation Target
  -> Applicability Rule
  -> Applicability Decision
  -> Review Run
  -> Verdict
  -> Governance Trigger
```

### Integrity Assessment

| Check | Assessment | Notes |
| --- | --- | --- |
| Missing links | Partial gap. | Discovery package can trace to Quality Intent, and review-run package can evaluate intents, but there is no package-level composition link from discovery-derived `QIN-DS-001` to review-run `QIN-RR-*`. |
| Unnecessary dependencies | Mostly clean. | Culture is no longer required for Quality Intent derivation. Good. |
| Cyclic dependencies | No direct cycle found. | Governance Event can eventually revise rules or intents, but current packages do not model that update loop as a hard cycle. |
| Mandatory concepts that should be optional | Governance Events should remain optional when all triggers are open. | Current review-run schema allows empty `governanceEvents`, and verifier requires event only for non-open trigger. Good. |
| Optional concepts that should be mandatory | Cross-package lineage should be mandatory for v0.3 pilot bundles. | A pilot must connect discovered judgment to applied review knowledge. |
| Flow ordering | Mostly coherent. | Expert Judgment appears in docs flow after Raw Expert Answer but before Extraction Step in some narratives; the reviewed flow omits Expert Judgment. For clarity, keep Expert Judgment as a peer input to Extraction Step and source for Decision Pattern. |
| Evidence source path | Thin. | Review-run Evidence Items link to target, but not to target `sourceEvidence` or Knowledge Source. v0.2.2 should add optional source refs before pilot. |

### Recommended Canonical Flow For v0.3 Pilot

```text
Case
  -> Question Log Entry
  -> Raw Expert Answer
  -> Expert Judgment
  -> Extraction Step
  -> Cue
  -> Concern
  -> Loss Boundary
  -> Decision Pattern
  -> Quality Intent Derivation
  -> Quality Intent
  -> Evaluation Target
  -> Applicability Rule
  -> Applicability Decision
  -> Evidence Item
  -> Verdict
  -> Review Run
  -> Governance Trigger
  -> Governance Event
```

Review Run still owns the execution envelope, but the explanatory story is easier when Evidence Item is shown before Verdict and Review Run is treated as the container.

## 4. Schema / Docs / Example Alignment Report

| Area | Alignment state | Finding | Recommended cleanup |
| --- | --- | --- | --- |
| Discovery raw capture | Aligned. | Docs, schema, example, and verifier all use Question Log Entry and Raw Expert Answer. | No change required. |
| Extraction Step | Aligned. | `rawExpertAnswerRefs` and output refs are checked. | No change required. |
| Quality Intent Derivation | Mostly aligned. | Docs and discovery schema treat it as derivation record. | Add a note that review-run Quality Intents should cite derivation refs when available. |
| Quality Intent | Misaligned. | Discovery schema uses `lossBoundaryRefs`; review-run schema uses `lossBoundary` string and `sourceDecisionPatternRefs`. | Create canonical Quality Intent core for v0.2.2 or v0.3. |
| Decision Pattern | Misaligned by package projection. | Discovery pattern has source judgments and typical decision; review-run pattern has applicable context; culture pattern has only title; expert package has full schema. | Define canonical Decision Pattern and allow projections. |
| Loss Boundary | Misaligned by package projection. | Discovery boundary has severity; culture boundary omits severity; review-run embeds boundary as string. | Define canonical Loss Boundary core. |
| Evaluation Target | Misaligned. | Standalone target schema requires `targetType`, `riskSummary`, and `sourceEvidence`; review-run embedded target schema omits them. Docs list the richer target. | Make review-run embedded target match canonical target or use `targetRef` to composed target package. |
| Applicability Rule | Aligned. | Docs, schema, example, and verifier use structured `matchConditions`. | No change required, but add optional `applicabilityBoundaryRef` only if boundary remains separate. |
| Applicability Decision | Aligned. | Selected/excluded refs and rationales are checked. | No change required. |
| Evidence Item | Partially aligned. | Verifier checks confidence and target ref; docs do not specify source refs. | Add optional `sourceEvidenceRefs` or `knowledgeSourceRefs`. |
| Confidence Policy | Aligned. | Verifier recalculates verdict and review-run confidence from policy. | No change required. |
| Governance Trigger/Event | Aligned. | Trigger/event boundary is clear and verifier enforces non-open trigger event links. | No change required. |
| Verifier Boundary | Aligned in review-run package only. | Boundary is not present in other package types. | For v0.3 pilot bundle, put verifier boundary at bundle level. |

## 5. Verifier Boundary Matrix

| Verifier capability | What it can do | What it cannot do |
| --- | --- | --- |
| Structurally prove | Required arrays/fields exist; IDs are unique; references resolve; selected refs are justified by decisions; extraction outputs are covered by Extraction Steps. | Prove that an expert's interpretation is correct. |
| Calculate | Verdict confidence from evidence inputs and policy; Review Run confidence from verdict aggregation policy. | Decide whether the confidence inputs themselves are trustworthy. |
| Flag | Low confidence, conflicting evidence, context mismatch, activity-count misuse, missing governance trigger, non-open trigger without event. | Resolve the flagged issue or approve the target. |
| Trace | Raw answer to extraction output; cue to concern; concern to loss boundary; pattern to judgments; verdict to evidence. | Guarantee real-world completeness of evidence. |
| Enforce rule compliance | Applicability Rule/Decision consistency and reusable-vs-target-specific boundary. | Judge whether the selected rule is semantically the best rule. |
| Require human semantic review | Expert correctness, organizational acceptance, waiver legitimacy, governance decision validity, real operational risk. | The verifier can only point to missing or inconsistent records. |

The verifier must continue to state:

- Passing validation means structural and arithmetic consistency.
- Passing validation does not mean quality was achieved.
- Passing validation does not mean expert opinion is correct.
- Passing validation does not mean business approval.

## 6. Package Architecture Recommendation

### Options Reviewed

| Option | Strength | Weakness |
| --- | --- | --- |
| One unified runtime package | Easiest end-to-end trace for a pilot. | Can become large and mixes authoring stages. |
| Multiple package types | Clear ownership by lifecycle stage. | Current packages duplicate entity shapes and lack cross-package lineage. |
| Package composition | Preserves lifecycle packages while adding end-to-end trace. | Requires a small manifest or bundle verifier. |
| Package references only | Minimal change. | Too easy to leave unresolved cross-package identity gaps. |

### Recommendation For v0.3 Pilot

Use package composition:

```text
qif-runtime-bundle
  -> discovery-session-package
  -> organizational-quality-culture-package
  -> evaluation-target-package
  -> review-run-package
  -> global entity index / canonical refs
  -> verifier boundary
```

This is the simplest pilot structure that preserves current package separation while solving the main pilot-readiness gap: end-to-end lineage across packages.

For v0.3, do not collapse everything into one giant package unless the pilot verifier cannot resolve package refs. A composition bundle gives the pilot one entry point without forcing all authoring workflows into one file.

## 7. Naming Improvement List

| Current name | Issue | Recommendation |
| --- | --- | --- |
| Evaluation Run | Overlaps with Review Run. | Use Review Run in runtime docs; keep Evaluation Run only as legacy baseline term. |
| Applicability Boundary | Overlaps with Applicability Rule. | Rename to Pattern Applicability Boundary if retained. |
| Applicability Rule `selectedIntentRefs` | A rule selecting concrete IDs can feel less reusable. | For v0.3, consider allowing `selectedIntentCriteria` or clarify that rules are reusable within a bundle/version. |
| Matched Risk Refs | Values are strings, not refs to Risk entities in review-run package. | Rename to `matchedRisks` or introduce canonical Risk entities. |
| Matched Loss Boundary Refs | Values are strings in review-run package. | Rename to `matchedLossBoundaries` or reference canonical Loss Boundary IDs. |
| Source Evidence | Could be confused with Evidence Item. | Rename to `targetSourceMaterials` or link Evidence Item to source refs. |
| Confidence | Used for extraction, judgment, derivation, evidence, verdict, and run. | Keep name, but document each confidence owner and calculation authority. |
| Organizational Quality Culture | Broad and sociological. | Keep, but always qualify as "aggregation context", not causal authority. |
| Quality Intent Derivation | Good but long. | Keep; precision matters more than brevity here. |
| Verifier Boundary | Clear. | Keep. |
| Governance Trigger | Clear. | Keep. |
| Governance Event | Clear. | Keep. |

## 8. v0.3 Pilot Readiness Assessment

### Readiness Verdict

QIF v0.2.1 is conditionally ready for v0.3 pilot design, but not yet ready for a clean v0.3 pilot package without v0.2.2 cleanup.

### Pilot Questions

| Pilot question | Current ability | Gap |
| --- | --- | --- |
| Which expert judgment was captured? | Yes. Discovery package has cases, questions, raw answers, and judgments. | None for current example. |
| Which decision pattern was derived? | Yes. Discovery package links patterns to judgments. | Pattern shape differs from review-run package. |
| Which quality intent was created? | Yes inside discovery package. | Review-run uses separate Quality Intent records rather than referencing discovery-derived intent. |
| Which target was evaluated? | Yes. Evaluation target package and review-run target both exist. | Target schema differs between packages. |
| Why were specific intents selected? | Yes. Applicability Rule and Decision explain selection/exclusion. | Rule selects specific IDs; reusable semantics need clearer version/bundle boundary. |
| What evidence supported the verdict? | Yes. Verdicts link to evidence. | Evidence items do not link back to target source materials. |
| Why was governance triggered? | Yes. Governance Trigger records low confidence, conflict, and mismatch. | Good. |

### Pilot Readiness Rating

| Dimension | Rating | Reason |
| --- | --- | --- |
| Conceptual coherence | Medium-high | Core story is coherent, but duplicate entity shapes need cleanup. |
| Executability | High | `npm test` validates current examples. |
| Explainability | Medium-high | Traceability is good inside packages; cross-package lineage is weak. |
| Domain generality | High | Examples cover multiple domains and do not assume software artifacts. |
| Verifier discipline | High | Semantic truth boundary is explicit. |
| Pilot package readiness | Medium | Needs bundle/composition and canonical entity shape cleanup. |

## 9. Recommended v0.2.2 Cleanup Tasks

1. Create canonical entity cores for Quality Intent, Decision Pattern, Loss Boundary, and Evaluation Target.
2. Align review-run embedded Evaluation Target with standalone Evaluation Target, or replace embedded targets with package refs.
3. Add a `qif-runtime-bundle` composition manifest for v0.3 pilot.
4. Add cross-package lineage from discovery-derived Quality Intent to review-run selected Quality Intent.
5. Add optional `sourceEvidenceRefs` or `knowledgeSourceRefs` to Evidence Item.
6. Decide whether Applicability Boundary remains separate or becomes a Decision Pattern property.
7. Standardize culture naming between expert framework and runtime package: `recurringFears` vs `repeatedFears`, `departmentOrRoleDifferences` vs `subgroupDifferences`.
8. Add negative verifier fixtures for broken extraction, broken applicability decision, broken confidence calculation, activity-count misuse, and missing governance event.
9. Add a glossary section that distinguishes Rule, Decision, Boundary, Trigger, Event, Verdict, and Review Run.
10. Add a v0.3 pilot bundle example that answers the full north-star chain from expert judgment to governance.

## Final Assessment

QIF v0.2.1 succeeds as an executable hardened baseline.

The main consolidation finding is not conceptual failure; it is schema projection drift. The same conceptual entities appear in several package types with different required fields. That was acceptable for v0.2.1 hardening, but v0.3 pilot needs a composition layer and canonical entity cores so a pilot user can follow one unbroken chain:

```text
Expert judgment
  -> Decision pattern
  -> Quality intent
  -> Evaluation target
  -> Applicability decision
  -> Evidence-backed verdict
  -> Governance trigger
```

The verifier is correctly scoped. It can prove structure, traceability, reference resolution, rule compliance, and confidence arithmetic. It cannot and must not claim semantic quality truth.
