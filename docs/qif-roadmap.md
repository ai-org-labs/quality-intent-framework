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

## Current Position (v0.4.0 baseline)

- Executable package types: qif-package, expert-judgment, discovery-session,
  organizational-quality-culture, evaluation-target, review-run, quality-gate.
- Reproducible confidence, enforced gate rules, release verdict discipline
  (Go / Conditional Go / No-Go / Pending), post-release loop, traceability
  links, governance forcing.
- Verified by structural validators run through `npm test`.
- Weaknesses: packages are islands (no cross-package references), negative
  verifier coverage is not a retained fixture suite, authoring cost for
  humans and AI agents is still high, and no empirical feedback yet exists
  on whether QIF confidence predicts real outcomes.

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
  Status: established for the quality gate verifier — `tests/fixtures/quality-gate/`
  holds one retained invalid package per rule, generated from
  `tools/fixtures/quality-gate-cases.mjs` and run with a drift check by
  `tools/run-fixture-tests.mjs`. Remaining: extend the same suite to the
  `qif-package`, `expert-judgment`, discovery-session, culture, evaluation-target,
  and review-run verifier surfaces before this deliverable is complete.
- Evaluation Timing Rule and Evaluation Timing Decision entities: when
  evaluation must happen, decided by executable conditions, with recorded
  justification.
- Evidence Retention Policy entity: retention period, sensitivity, integrity
  policy as first-class checkable structure.
- Quality Report entity: any reported score must decompose, by reference,
  into the verdicts and evidence it summarizes. A score that cannot be
  decomposed fails verification.
- Evidence-type vocabulary record, so `requiredEvidenceTypes` matching is
  checked against a declared vocabulary instead of free-string luck.

Exit evidence:

- 100% of verifier rules have a violating fixture that fails. (Currently met for
  the quality gate verifier; open for the other verifier surfaces.)
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
- Quality Intent lifecycle: candidate, validated, active, superseded,
  retired — with rationale and evidence required for each transition.
- Missed-intent records: a post-release incident that matches no active
  intent must structurally produce either a new intent derivation or an
  explicit accepted-gap record with an owner.
- Ledger index: one queryable manifest of an organization's intents,
  boundaries, open residual risks, and open governance triggers.

Exit evidence:

- A full chain — expert judgment, derived intent, gate decision, post-release
  incident, new derived intent — validates end-to-end across 3+ separate
  package files.
- Deleting any link in that chain makes verification fail.

## Phase 3 — v0.6: AI-Native Authoring and Enforcement (months)

Intent: an AI agent can author correct QIF packages cheaply, and an agent
workflow can be structurally blocked from releasing without one.

Loss boundary: hybrid human/AI organizations must not ship AI-approved work
whose quality claims are unauditable.

Deliverables:

- Machine-readable authoring templates with example requests and expected
  outputs (the executable form of the AI Authoring Guide), plus fixtures
  that score an agent's output as valid/invalid.
- A `qif` CLI: `qif validate`, `qif new <package-type>`, `qif trace <id>`
  (walk any entity's evidence chain), `qif open-risks`.
- Gate-as-hook reference integration: a demonstration where an agent task
  cannot be marked release-ready unless a quality-gate package for the
  target validates. No external service required; local hook only.

Exit evidence:

- An AI agent given only the templates (no conversation history, no guide
  prose) produces a first-try valid package for a held-out scenario in each
  package type.
- The reference hook demonstrably blocks a release attempt lacking a valid
  gate decision, and admits one that has it.

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
- First empirical self-test of the evidence independence hierarchy: do
  high-independence evidence items actually precede fewer escapes than
  low-independence ones? Publish the answer even if it is embarrassing.

Exit evidence:

- A calibration report generated from real (or honestly labeled synthetic)
  decision-outcome pairs, checked into the pilot record.
- At least one framework change made *because* calibration data contradicted
  an assumption — proof the learning loop reaches the framework itself.

## Phase 5 — v0.8: Organizational Memory and Reuse (in parallel with Phase 4)

Intent: quality judgment compounds across teams and organizations instead of
retiring with veterans.

Loss boundary: an organization must not pay the full discovery cost for
patterns another team already validated, and must not import foreign
patterns without applicability checks.

Deliverables:

- Portable pattern/intent libraries: decision patterns and intents packaged
  for reuse with applicability boundaries, counterexamples, and provenance
  intact; imports stay `candidate` until locally validated.
- A public example corpus spanning at least five domains, each example a
  full validating chain, serving simultaneously as documentation, test
  suite, and evidence for the domain-generality claim.

Exit evidence:

- A pattern extracted in one domain is imported, applicability-checked,
  locally validated, and used in a gate decision in a different domain,
  with the whole chain verifiable.

## Phase 6 — v1.0: Standard Candidate (after calibration evidence exists)

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
| 2 | v0.5 | Does quality knowledge survive across packages? | End-to-end cross-package chain |
| 3 | v0.6 | Can AI agents author and be gated by QIF cheaply? | First-try valid agent authoring + working hook |
| 4 | v0.7 | Do QIF confidence numbers mean anything empirically? | Calibration report from real pilots |
| 5 | v0.8 | Does judgment compound across teams and domains? | Cross-domain validated pattern reuse |
| 6 | v1.0 | Can anyone implement QIF from the spec alone? | Independent conformant implementation |

Phases 4 and 5 run in parallel; everything else is sequential. The single
biggest schedule risk is honest: calibration requires elapsed real-world
time and willing pilot organizations, and no engineering effort can
compress it.
