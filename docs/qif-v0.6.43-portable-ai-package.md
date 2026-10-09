# QIF v0.6.43 Portable AI Package

## Purpose

The portable package lets a user place one QIF folder or zip in Google Drive,
an AI project, or another document context and ask Gemini, Claude, Codex, or a
different AI to work in QIF style.

It packages guidance. It is not an autonomous agent and it is not the complete
QIF Runtime.

## Package Shape

```text
qif-portable-v<VERSION>/
|- START_HERE.md
|- SYSTEM_INSTRUCTIONS.md
|- QIF_CORE.md
|- USE_CASES.md
|- OUTPUT_TEMPLATE.json
|- MANIFEST.json
|- SHA256SUMS
|- docs/
|- schemas/
`- examples/
```

The short root documents provide the first-use path. Canonical documents,
schemas, and examples remain available for deeper or machine-readable work.

## Build and Verify

```bash
npm run portable:build
npm run portable:verify
```

The build creates:

- `dist/qif-portable-current/`
- `dist/qif-portable-v<VERSION>/`
- `dist/qif-portable-v<VERSION>.zip`
- `dist/qif-portable-v<VERSION>.zip.sha256`

`package.json` is the version authority. Source paths are declared by the
generator, source and output content are hashed with SHA-256, file order and
zip metadata are deterministic, and verification rejects missing, additional,
stale, or modified content.

`npm test` runs build, verification, and a mutation rejection test before the
existing QIF test suite. A GitHub Release workflow checks that the release tag
matches `package.json`, runs the complete suite, and attaches the current zip
and checksum to every published release.

## Distribution

For document-context AI systems:

1. Upload the whole expanded directory or versioned zip.
2. Tell the AI to read `SYSTEM_INSTRUCTIONS.md` first.
3. Add the target to evaluate.
4. Ask for either an evaluation or target-specific QIF checks.

The package is vendor-neutral. Vendor-specific project instructions may point
to `SYSTEM_INSTRUCTIONS.md`, but must not silently weaken its evidence,
uncertainty, authority, or verifier boundaries.

## Verification Boundary

The package and its verifier can establish distribution integrity, source
traceability, version consistency, and deterministic reconstruction. They do
not establish that:

- an AI read or followed every instruction;
- evidence is authentic or sufficient;
- the chosen world model is semantically correct;
- a verdict protects the intended loss boundary;
- an AI or package has organizational authority.

Those claims require reproduction, human or expert review, observed outcomes,
and governance appropriate to the consequence.
