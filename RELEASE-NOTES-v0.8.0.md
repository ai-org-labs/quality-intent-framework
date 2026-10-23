# QIF v0.8.0

## Multi-Agent Judgment Memory

QIF v0.8.0 turns the Living QIF Ledger into a memory layer for cooperating
human and AI evaluators without reducing their work to a final consensus.

### What is new

- lane-local Judgment Memory Entries linked to source judgments and evidence;
- explicit shared-source, model, prompt, tool, data, and operator dependencies;
- append-only revision chains with exactly one current revision;
- governed retain/retire decisions that never delete audit history;
- joins that reproduce current inputs, dependencies, conflicts, and exact dissent;
- aggregate assessments for current/retired memory, dissent, shared dependency,
  unresolved conflict, unverified evidence, sufficiency, and governance;
- 28 new retained negative fixtures.

The example retains three current reviewer lanes, one corrected revision chain,
and one retired legacy summary. Its evidence is example-only, its lanes share a
source dependency, and its interpretations conflict, so the joined result is
correctly classified as insufficient and governance-required.

## Boundaries

Verifier success proves structural integrity, reference resolution, revision
lineage, deterministic join consistency, arithmetic, and rule compliance. It
does not prove semantic truth, agent competence, consensus correctness,
independence, evidence authenticity, authorization, or authority.

## Verification

- all positive package checks pass;
- all retained negative fixtures are rejected with their expected errors;
- the portable AI package builds, verifies, and rejects mutation;
- AOF v12.2.0 runtime records Need Validation, Charter, Council, actor packet,
  review, self-review, and retrospective evidence.
