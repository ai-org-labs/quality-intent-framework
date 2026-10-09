# QIF v0.6.43

QIF v0.6.43 introduces the Portable AI Package: one vendor-neutral,
versioned distribution that can be given to Gemini, Claude, Codex, or another
AI without cloning the full repository.

## Added

- Plain-language `START_HERE.md`, operational `SYSTEM_INSTRUCTIONS.md`, compact
  `QIF_CORE.md`, use-case routing, and a structured output template.
- Automatic inclusion of canonical guidance, all current QIF schemas, and all
  current examples.
- Deterministic current and versioned directories, zip archive, manifest,
  source mapping, byte counts, SHA-256 hashes, and archive checksum.
- Verification that rejects missing, added, stale, modified, or version-mismatched
  package content, plus a retained mutation test.
- `npm test` integration and GitHub Release automation that builds, verifies,
  and attaches the current portable zip and checksum.

## Boundary

The portable package guides AI behavior but is not itself an agent or the
complete QIF Runtime. Integrity verification does not prove semantic truth,
evidence authenticity, instruction compliance, quality, safety, or authority.
