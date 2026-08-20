# QIF Roadmap: How Far QIF Can Go

## Thesis

QIF's maximum achievable position is analogous to double-entry bookkeeping.

Double-entry bookkeeping does not prove a business is good. It makes financial
claims recordable, auditable, and comparable, so cheaply and uniformly that
civilization adopted it as the default discipline for money.

QIF's ceiling is the same position for quality: a universal record discipline
that makes any quality claim — in software, operations, accounting,
maintenance, support, administration, or hybrid human/AI organizations —
traceable to intents, loss boundaries, evidence, verdicts, and governance,
and mechanically checkable for structure, reproducibility, and (eventually)
calibration.

That is the honest answer to "how far can it go": QIF can become the
accounting system for quality decisions. It cannot become an oracle of
quality truth, and no roadmap phase below pretends otherwise.

## The Permanent Ceiling

These limits are structural, not temporary engineering gaps. Every phase
respects them.

| Limit | Why it is permanent | What QIF does instead |
| --- | --- | --- |
| A verifier cannot prove semantic quality truth. | Whether evidence really protects a loss boundary is an empirical, contested judgment. | Prove structure, traceability, reproducibility; measure calibration statistically after the fact. |
| QIF cannot guarantee the right Quality Intents were discovered. | Discovery is bounded by who was asked and what has happened so far. | Close the loop: post-release incidents structurally force missed-intent derivation. |
| QIF cannot resolve stakeholder disagreement about what quality is. | Quality is partly political; boundaries differ by role and risk appetite. | Make disagreement explicit and governable: recorded exclusions, waivers, governance events, accountable owners. |
| Metrics never become quality itself. | Any count or rate can be gamed and detached from loss. | Enforce evidence-only interpretation forever, at verifier level. |

Growth means pushing hard against everything *outside* these limits — cost of
authoring, cost of verification, cross-package memory, empirical calibration,
and adoption surface — not pretending the limits away.

## Current Position (v0.5.3 baseline)

- Executable package types: qif-package, expert-judgment, discovery-session,
  organizational-quality-culture, evaluation-target, review-run, quality-gate,
  qif-ledger, world-model-review, world-model-calibration,
  world-model-pilot-corpus.
- Reproducible confidence, enforced gate rules, release verdict discipline
  (Go / Conditional Go / No-Go / Pending), post-release loop, traceability
  links, governance forcing.
- Verified by structural validators run through `npm test`.
- The quality-gate verifier has retained negative coverage; v0.4.3 completes
  the same discipline for the two core package verifiers. v0.4.4 adds an
  executable evidence-type vocabulary for quality-gate packages. v0.4.5 adds
  executable evaluation timing rules and decisions so required pre-decision
  evaluation cannot be silently deferred. v0.4.6 adds executable evidence
  retention policies so evidence remains reconstructable and access-controlled
  after a verdict. v0.4.7 adds executable Quality Reports so reported scores
  and sections must decompose into referenced gate decisions, gated intents,
  and verdict evidence. v0.4.8 extends retained negative fixture coverage to
  the discovery-session runtime verifier surface. v0.4.9 extends retained
  negative fixture coverage to the organizational-quality-culture runtime
  verifier surface. v0.4.10 extends retained negative fixture coverage to the
  evaluation-target runtime verifier surface. v0.4.11 extends retained
  negative fixture coverage to the review-run runtime verifier surface,
  completing the planned v0.4.x runtime package fixture frontier. v0.5.0 adds
  the first Living QIF Ledger runtime: package refs, cross-package entity refs,
  Quality Intent lifecycle records, missed-intent records, agent trial/outcome
  records, and a ledger index. v0.5.1 adds World Model Review: an executable
  pre-verdict package type for naming exact conceptual-modeling, domain-model,
  boundary, relationship, state/event, assumption, and coordinate-system gaps
  before AI-assisted quality verdicts. v0.5.2 adds World Model Calibration:
  an executable package type for measuring AI/expert agreement on unseen
  world-model gap cases, reproducing agreement/false-positive/false-negative
  rates, and forcing governance when calibration thresholds fail. v0.5.3 adds
  World Model Pilot Corpus: an executable package type for preparing real,
  privacy-screened, unseen pilot cases before calibration.
- Weaknesses: v0.5.3 cross-package behavior is intentionally minimal and
  example-file based; authoring cost for humans and AI agents is still high,
  Pilot Corpus now structures case ingestion but still uses example data rather
  than a live organization corpus, agent trajectories are summarized rather than deeply typed, and no
  longitudinal empirical feedback yet exists on whether QIF confidence predicts
  real outcomes.

## 2026 Agentic AI Trend Check

The roadmap was revalidated on 2026-08-20 against primary-source signals. The
goal is not to chase product features. It is to identify which quality claims
become dangerous as agents gain longer horizons, tools, parallelism, and wider
organizational authority.

| Current signal | Quality risk exposed | QIF response | Lead, not follow |
| --- | --- | --- | --- |
| Agent evaluation is moving from single answers to multi-turn trials, full trajectories, outcomes, multiple graders, and living suites. ([Anthropic](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents), [OpenAI](https://openai.com/index/trustworthy-third-party-evaluations-foundations/)) | A final answer can look correct while tool use, intermediate state, or the actual environment outcome is wrong; benchmark saturation and contamination can hide regressions. | v0.4.x fixture completeness, then v0.5 trajectory/outcome ledger and v0.7 calibration health. | Bind every verdict to outcome state, environment provenance, evaluator uncertainty, and suite health before these become audit afterthoughts. |
| Delegated work is becoming longer-running and increasingly parallel across multiple agents and non-engineering domains. ([OpenAI](https://openai.com/index/how-agents-are-transforming-work/), [Anthropic](https://www.anthropic.com/engineering/multi-agent-research-system)) | Errors compound across handoffs; a successful aggregate result can conceal an unsafe lane, unresolved disagreement, or unowned decision. | v0.6 governed agent authoring/actions and v0.8 multi-agent judgment memory. | Treat lane-local intents, join conflicts, authority, and dissent as quality ledger entries, not orchestration logs. |
| Agent harnesses now combine persistent runtime context, shell/computer tools, reusable skills, tracing, and protocol-connected tools such as MCP. ([OpenAI](https://openai.com/index/equip-responses-api-computer-environment/), [OpenAI](https://openai.com/index/new-tools-and-features-in-the-responses-api/)) | Quality depends on tool permissions, target operation, context freshness, runtime configuration, and rollback—not model output alone. | v0.5 provenance and v0.6 protocol-neutral action contracts. | Make an action's Quality Intent, loss boundary, evidence, permission, target, and rollback portable across harnesses and protocols. |
| Teams are shifting from token price toward cost per accepted outcome and real-task evals. ([OpenAI](https://openai.com/index/managing-ai-investments-in-agentic-era/)) | Cheap attempts can create expensive retries and human correction; activity volume can again be mistaken for value. | v0.7 outcome calibration keeps cost/latency as evidence attached to accepted outcomes. | Calibrate quality and cost jointly without allowing either metric to substitute for the accountable verdict. |

The one-step-ahead bet is Phase 6 / v0.9: an **Anticipatory Quality Intent
Twin**. Current eval practice tests known tasks. QIF should also generate and
govern counterfactual future contexts from intent/loss-boundary changes,
without pretending synthetic scenarios predict reality. This moves quality
work from regression detection toward governed pre-mortem discovery.

Each phase below states its goal the QIF way: an intent, the loss boundary
the phase protects, and the exit evidence that shows the phase is achieved.
Exit evidence is deliberately structural or empirical — never an activity
count read as quality.

## Phase 1 — v0.4.x: Close the Runtime (near term, weeks)

Intent: the v0.4 requirements document contains no entity that is
documentation-only.

Loss boundary: users must not adopt QIF expecting a capability that exists
only as prose.

Deliverables:

- Negative fixture suite: a retained `tests/fixtures/` corpus where every
  verifier rule has at least one fixture that violates it, run by `npm test`.
  A verifier rule without a failing fixture is treated as unproven.
  Status: established for the quality gate verifier and expanded in v0.4.1
  to selected `qif-package` and `expert-judgment` verifier rules. The retained
  corpora under `tests/fixtures/qif-package/`,
  `tests/fixtures/expert-judgment/`, `tests/fixtures/discovery-session/`,
  `tests/fixtures/organizational-quality-culture/`, and
  `tests/fixtures/evaluation-target/`, `tests/fixtures/review-run/`, and
  `tests/fixtures/quality-gate/` are generated from
  `tools/fixtures/*-cases.mjs` and run with a drift check by
  `tools/run-fixture-tests.mjs`. v0.4.8 adds retained discovery-session
  coverage for raw-answer traceability, extraction-step justification, and
  session-local provenance. v0.4.9 adds retained organizational-quality-culture
  coverage for context-only aggregation, non-prerequisite boundaries, grounding
  in multiple patterns, and required culture context fields. v0.4.10 adds
  retained evaluation-target coverage for target identity, domain, stakeholder
  impact, operational impact, risk summary, and source evidence. v0.4.11 adds
  retained review-run coverage for applicability consistency, evidence-backed
  verdicts, confidence reproduction, governance triggers, and verifier-boundary
  honesty.
- Evaluation Timing Rule and Evaluation Timing Decision entities: when
  evaluation must happen, decided by executable conditions, with recorded
  justification.
  Status: implemented for `quality-gate` packages in v0.4.5 through
  `evaluationTimingRules` and `evaluationTimingDecisions`, including verifier
  checks for required-before-decision completion, selected timing consistency,
  evidence-backed completion, and governance-backed waivers.
- Evidence Retention Policy entity: retention period, sensitivity, integrity
  policy as first-class checkable structure.
  Status: implemented for `quality-gate` packages in v0.4.6 through
  `evidenceRetentionPolicies`, including verifier checks for evidence item
  policy refs, declared evidence type coverage, sensitivity/access-control
  consistency, restricted-evidence integrity protection, disposal ownership,
  and unused policy declarations.
- Quality Report entity: any reported score must decompose, by reference,
  into the verdicts and evidence it summarizes. A score that cannot be
  decomposed fails verification.
  Status: implemented for `quality-gate` packages in v0.4.7 through
  `qualityReports`, including verifier checks for report target consistency,
  score and section decomposition into gate decisions, gated Quality Intents,
  and verdict evidence, and `report-summary-only` interpretation so report
  scores are not treated as quality itself.
- Evidence-type vocabulary record, so `requiredEvidenceTypes` matching is
  checked against a declared vocabulary instead of free-string luck.
  Status: implemented for `quality-gate` packages in v0.4.4 through
  `evidenceTypeVocabulary`, including verifier checks for undeclared evidence
  item types, undeclared gate-rule required types, unused vocabulary entries,
  and vocabulary-required `trust` / `findingEvidence` metadata.

Exit evidence:

- 100% of planned v0.4.x runtime package fixture surfaces have retained
  negative coverage. The next frontier is cross-package ledger behavior in
  v0.5, not more single-package fixture expansion.
- Every candidate entity listed in the v0.4 requirements is either
  implemented or explicitly re-scoped with rationale.

## Phase 2 — v0.5: The Living QIF Ledger (months)

Intent: quality knowledge survives across packages and time instead of dying
inside single files.

Loss boundary: an organization must not lose the chain from discovery to
release to incident to improvement when work spans multiple packages.

Deliverables:

- Cross-package references with provenance: a quality-gate package may cite
  a Quality Intent derived in a discovery-session package, and the verifier
  resolves the chain across files.
  Status: minimally implemented in v0.5.0 through `qif-ledger` `packageRefs`
  and `crossPackageRefs`; the verifier reads referenced package files and
  resolves entity ids across package boundaries.
- Quality Intent lifecycle: candidate, validated, active, superseded,
  retired — with rationale and evidence required for each transition.
  Status: minimally implemented in v0.5.0 through
  `qualityIntentLifecycleRecords`.
- Missed-intent records: a post-release incident that matches no active
  intent must structurally produce either a new intent derivation or an
  explicit accepted-gap record with an owner.
  Status: minimally implemented in v0.5.0 through `missedIntentRecords`.
- Ledger index: one queryable manifest of an organization's intents,
  boundaries, open residual risks, and open governance triggers.
  Status: minimally implemented in v0.5.0 through `ledgerIndex`.
- Agent Trial and Outcome records: task, trial, trajectory/transcript summary,
  environment state, tool/action provenance, grader evidence, evaluator
  uncertainty, and actual outcome remain linked without storing hidden
  reasoning.
  Status: minimally implemented in v0.5.0 through `agentTrials` and
  `agentOutcomes`; hidden chain-of-thought is explicitly rejected as ledger
  evidence.
- World Model Review records: conceptual model, domain entities, actors,
  boundaries, relationships, states, events, invariants, coordinate systems,
  assumptions, model evidence, gap findings, resolution actions, and governance
  triggers are checkable before AI-assisted quality verdicts.
  Status: implemented in v0.5.1 through the `world-model-review` package type,
  `worldModelGapFindings`, `tools/validate-world-model-review.mjs`, and retained
  negative fixtures requiring each finding to name the exact missing item,
  expected definition, observed problem, affected decisions, evidence, and
  resolution work.
- World Model Calibration records: calibration policy, unseen calibration
  cases, expert assessments, agent assessments, finding matches, calibration
  runs, agreement score, false-positive rate, false-negative rate, and
  governance triggers.
  Status: implemented in v0.5.2 through the `world-model-calibration` package
  type, `tools/validate-world-model-calibration.mjs`, and retained negative
  fixtures requiring reproducible agreement metrics and governance when
  thresholds fail.
- World Model Pilot Corpus records: pilot sources, privacy controls, sampling
  policies, pilot cases, normalization steps, expert panels, adjudication
  rubrics, ingestion runs, and governance triggers.
  Status: implemented in v0.5.3 through the `world-model-pilot-corpus` package
  type, `tools/validate-world-model-pilot-corpus.mjs`, and retained negative
  fixtures requiring reproducible corpus readiness, privacy readiness, real-case
  ratio, independent expert quorum, and governance when ingestion thresholds
  fail.

Exit evidence:

- A full chain — expert judgment, derived intent, gate decision, post-release
  incident, new derived intent — validates end-to-end across 3+ separate
  package files. Status: partial in v0.5.3; the example ledger resolves
  discovery-session, review-run, quality-gate, world-model-review, and
  world-model-calibration packages.
- Deleting any link in that chain makes verification fail. Status: partial in
  v0.5.3 through retained `qif-ledger`, `world-model-review`,
  `world-model-calibration`, and `world-model-pilot-corpus` negative fixtures.
- A multi-turn agent claim fails verification when its final answer is present
  but its claimed environment outcome or required provenance is absent. Status:
  partial in v0.5.0; trials must link outcome and tool/action provenance, but
  detailed multi-turn trajectory typing remains future work.

## Phase 3 — v0.6: AI-Native Authoring and Enforcement (months)

Intent: an AI agent can author correct QIF packages cheaply, and an agent
workflow can be structurally blocked from releasing without one.

Loss boundary: hybrid human/AI organizations must not ship AI-approved work
whose quality claims are unauditable.

Deliverables:

- Machine-readable authoring templates with example requests and expected
  outputs (the executable form of the AI Authoring Guide), plus fixtures
  that score an agent's output as valid/invalid.
- Guided elicitation templates: plain-language explanations, stepwise probes,
  answer scaffolds, clarification moves, and teach-back checks so an AI agent
  can elicit QIF candidates from users who do not know QIF terminology.
- A `qif` CLI: `qif validate`, `qif new <package-type>`, `qif trace <id>`
  (walk any entity's evidence chain), `qif open-risks`.
- Gate-as-hook reference integration: a demonstration where an agent task
  cannot be marked release-ready unless a quality-gate package for the
  target validates. No external service required; local hook only.
- Protocol-neutral Action Quality Contract: tool/provider, permission class,
  target operation, expected state transition, stop condition, rollback,
  evidence, and accountable approval are represented independently of MCP,
  A2A, or any single agent harness.

Exit evidence:

- An AI agent given only the templates (no conversation history, no guide
  prose) produces a first-try valid package for a held-out scenario in each
  package type.
- A non-expert user can answer the first three guided elicitation prompts
  without knowing the terms Quality Intent, Loss Boundary, or Evidence, and
  the resulting candidates preserve raw answers, clarification history, and
  teach-back confirmation.
- The reference hook demonstrably blocks a release attempt lacking a valid
  gate decision, and admits one that has it.
- The same action contract validates through two different harness adapters,
  while an unapproved write or unresolved target fails closed.

## Phase 4 — v0.7: Empirical Calibration (6–12 months of elapsed pilot time)

Intent: QIF confidence numbers earn empirical meaning.

Loss boundary: gate confidence must not present itself as predictive if it
has never been tested against outcomes.

This phase cannot be rushed, because it requires real releases and real
post-release windows in 2–3 pilot domains (at least one non-software, e.g.
an accounting close process or support operations).

Deliverables:

- Outcome records linking each gate decision to its post-release result.
- Calibration tooling: given N gate decisions and outcomes, compute whether
  stated confidence tracks observed escape rates (e.g., Brier score and
  a calibration table), as a report — never as an auto-verdict.
- Evaluation Suite Health records: task origin, contamination boundary,
  solvability review, saturation, grader calibration, trial variance, harness
  and infrastructure configuration, and drift ownership.
- First empirical self-test of the evidence independence hierarchy: do
  high-independence evidence items actually precede fewer escapes than
  low-independence ones? Publish the answer even if it is embarrassing.

Exit evidence:

- A calibration report generated from real (or honestly labeled synthetic)
  decision-outcome pairs, checked into the pilot record.
- At least one framework change made *because* calibration data contradicted
  an assumption — proof the learning loop reaches the framework itself.
- Small score differences are reported with trial and infrastructure
  uncertainty rather than as false precision.

## Phase 5 — v0.8: Multi-Agent Judgment Memory and Reuse (in parallel with Phase 4)

Intent: quality judgment compounds across teams and organizations instead of
retiring with veterans.

Loss boundary: an organization must not pay the full discovery cost for
patterns another team already validated, and must not import foreign
patterns without applicability checks.

Deliverables:

- Portable pattern/intent libraries: decision patterns and intents packaged
  for reuse with applicability boundaries, counterexamples, and provenance
  intact; imports stay `candidate` until locally validated.
- Governed multi-agent joins: lane-local Quality Intents, evidence, dissent,
  conflicts, authority boundaries, and join decisions remain independently
  inspectable even when the aggregate task succeeds.
- A public example corpus spanning at least five domains, each example a
  full validating chain, serving simultaneously as documentation, test
  suite, and evidence for the domain-generality claim.

Exit evidence:

- A pattern extracted in one domain is imported, applicability-checked,
  locally validated, and used in a gate decision in a different domain,
  with the whole chain verifiable.
- Removing a dissent record or failed lane that materially affected the join
  decision makes the multi-agent quality chain fail verification.

## Phase 6 — v0.9: Anticipatory Quality Intent Twin

Intent: discover plausible future quality failures before they appear in the
incident corpus, while keeping simulation distinct from observed truth.

Loss boundary: an organization must not mistake a regression suite built from
known history for coverage of fast-changing agent capabilities and operating
contexts.

Deliverables:

- Counterfactual Context records generated from changes in authority, tools,
  model/harness capability, stakeholder exposure, and loss boundaries.
- Pre-mortem Scenario records linking each synthetic scenario to the intent or
  assumption it challenges, provenance, novelty rationale, and an accountable
  review decision.
- Adaptive Challenge Set governance: scenarios can be promoted to retained
  eval tasks, rejected with rationale, or held as unresolved uncertainty.
- Strict synthetic boundary: simulated evidence can discover or challenge an
  intent but cannot satisfy an operational verdict without observed evidence.

Exit evidence:

- A capability or permission change generates at least one reviewed novel
  scenario that was absent from the historical suite and leads to a retained
  Quality Intent, counterexample, or explicit accepted-gap record.
- Re-labeling synthetic scenario output as observed evidence makes verification
  fail.

## Phase 7 — v1.0: Standard Candidate (after calibration evidence exists)

Intent: QIF is implementable from its specification alone.

Loss boundary: adopters must not depend on this repository's single
implementation or on its authors' tacit knowledge.

Deliverables:

- Frozen core schema with a versioning and deprecation policy.
- Conformance suite: any independent validator implementation can prove
  compliance by passing the fixture corpus.
- Specification text sufficient for a clean-room second implementation.

Exit evidence:

- A second validator implementation (different author or different
  language) passes the conformance suite without consulting this
  repository's validator source.

## Horizon — Beyond v1.0

If the phases above land, the realistic maximum positions are:

- **Audit interoperability.** Organizations exchange QIF packages instead of
  PDF audit narratives: a supplier hands a customer a verifiable quality-gate
  chain; an internal audit walks `qif trace` output instead of interviews
  alone. Regulated domains (finance, safety, medical administration) are the
  natural first adopters because they already pay for traceability.
- **The default gate for autonomous work.** As AI agents do more unsupervised
  work, "no release without a validating quality-gate package" becomes the
  cheapest honest control an organization can impose — the seatbelt, not the
  driver.
- **A shared empirical science of quality decisions.** Pooled, anonymized
  calibration data across organizations could answer, statistically,
  questions that are folklore today: which evidence types predict escapes,
  how fast confidence should decay, where shift-left actually pays.

And the permanent asymptote, restated: QIF ends where judgment begins. Its
final form makes every quality claim cheap to record, impossible to fake
structurally, and empirically scored after the fact — while the decision
itself always belongs to an accountable human or a human-governed authority.

## Permanent Non-Goals

No phase, including post-1.0, will:

- compute a quality score that substitutes for a verdict;
- let checklist completion, test counts, or dashboard values stand as quality;
- claim semantic truth from structural validation;
- make expert or AI judgment unchallengeable;
- specialize the core to software development;
- require any specific external service to use the core discipline.

## Sequencing Summary

| Phase | Version | Core question answered | Gate to next phase |
| --- | --- | --- | --- |
| 1 | v0.4.x | Is every documented capability executable? | Fixture-proven verifier |
| 2 | v0.5 | Does quality knowledge and agent outcome evidence survive across packages? | End-to-end cross-package and trial/outcome chain |
| 3 | v0.6 | Can agents author QIF and take governed actions across harnesses? | First-try authoring + fail-closed action contract |
| 4 | v0.7 | Do confidence and eval deltas mean anything empirically? | Calibrated outcome and suite-health reports |
| 5 | v0.8 | Does judgment compound safely across agents, teams, and domains? | Cross-domain reuse + inspectable multi-agent joins |
| 6 | v0.9 | Can QIF discover governed future failure hypotheses before incidents? | Reviewed counterfactual challenge promoted or resolved |
| 7 | v1.0 | Can anyone implement QIF from the spec alone? | Independent conformant implementation |

Phases 4 and 5 run in parallel; everything else is sequential. The single
biggest schedule risk is honest: calibration requires elapsed real-world
time and willing pilot organizations, and no engineering effort can
compress it.
