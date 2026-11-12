# QIF v0.8.12 Agent Skill Distribution

## Purpose

QIF v0.8.12 makes the framework directly usable by Agent Skills-compatible
AI systems. The distribution teaches an agent when and how to apply QIF,
loads detailed guidance only when the task needs it, and provides an optional
wrapper around the canonical deterministic verifier.

This is a procedural agent capability, not an autonomous agent. It does not
approve releases, execute remediations, determine semantic truth, or acquire
organizational authority.

## Standard Shape

```text
quality-intent-framework/
|- SKILL.md
|- agents/openai.yaml
|- references/
|  |- core-model.md
|  |- discovery.md
|  |- evaluation.md
|  |- world-model.md
|  `- packages-and-cli.md
|- assets/qif-review-template.md
|- scripts/run-qif.mjs
`- runtime/
   |- docs/
   |- schemas/
   |- examples/
   `- tools/
```

`SKILL.md` is the discovery and routing surface. It selects among discovery,
evaluation, world-model elicitation, expert-judgment extraction, and package
authoring. References contain deeper instructions. The script delegates to
the bundled canonical QIF CLI instead of implementing a competing verifier.

## Build and Install

```bash
npm run skill:release
```

The command creates and verifies:

- `dist/qif-agent-skill-current/quality-intent-framework/`
- `dist/qif-agent-skill-v<VERSION>/quality-intent-framework/`
- `dist/qif-agent-skill-v<VERSION>.zip`
- `dist/qif-agent-skill-v<VERSION>.zip.sha256`

Install the `quality-intent-framework` directory in a client's skills
directory. Where explicit invocation is supported, use
`$quality-intent-framework`. A client without Agent Skills support should use
the document-oriented portable distribution instead.

## Verification

Source validation checks the required frontmatter, skill name, description,
version alignment, local links, OpenAI metadata, and explicit authority
boundaries. Distribution verification checks exact file inventory and hashes,
single-folder zip shape, deterministic reconstruction, and platform limits.
An end-to-end test invokes the bundled QIF CLI, validates a bundled sample,
and confirms that a modified bundle is rejected.

These checks prove packaging and declared structural behavior. They cannot
prove that an AI followed the skill, that evidence is authentic or
sufficient, that a Quality Intent is semantically correct, or that a verdict
is authorized.

## Architectural Decision

The Agent Skill and the existing portable package are complementary:

| Distribution | Primary environment | Entry point |
| --- | --- | --- |
| Agent Skill | Skill-aware agent runtimes | `SKILL.md` |
| Portable documents | Drive, project knowledge, document context | `SYSTEM_INSTRUCTIONS.md` |

Both are generated from the same repository and use the same QIF concepts.
QIF remains standalone; AOF is used to govern QIF development and is not a
runtime dependency for QIF users.
